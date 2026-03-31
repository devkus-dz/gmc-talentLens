import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import { connectTestDB, closeTestDB, clearTestDB } from './setup';
import User from '../models/User';
import JobOffer from '../models/JobOffer';
import jwt from 'jsonwebtoken';


/**
 * Simulation scenario :
 * 1- A Recruiter creates a job.
 * 2- A Candidate applies for it.
 * 3- The Candidate tries to apply again (and gets blocked).
 * 4- The Recruiter moves the Candidate to "Interview" in the Kanban board.
 */


// Setup and Teardown Hooks
beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

// --- UTILITY MOCKS ---

const mockRecruiterToken = async () => {
    const user = await User.create({
        email: 'recruiter@test.com',
        passwordHash: 'hashedpassword',
        role: 'RECRUITER',
        companyName: 'Test Corp'
    });
    return {
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'testsecret'),
        userId: user.id
    };
};

const mockCandidateToken = async () => {
    const user = await User.create({
        email: 'candidate@test.com',
        passwordHash: 'hashedpassword',
        role: 'CANDIDATE',
        firstName: 'John',
        lastName: 'Doe'
    });
    return {
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'testsecret'),
        userId: user.id
    };
};

// --- TEST SUITES ---

describe('Job Offer Business Rules (Recruiter)', () => {
    it('should PREVENT deleting an ACTIVE job offer', async () => {
        const { token, userId } = await mockRecruiterToken();

        const activeJob = await JobOffer.create({
            title: 'Frontend Dev',
            description: 'React expert needed',
            createdBy: userId,
            isActive: true
        });

        const response = await request(app)
            .delete(`/api/jobs/${activeJob.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Cannot delete a published job offer');
    });

    it('should ALLOW deleting an INACTIVE job offer', async () => {
        const { token, userId } = await mockRecruiterToken();

        const inactiveJob = await JobOffer.create({
            title: 'Backend Dev',
            description: 'Node expert needed',
            createdBy: userId,
            isActive: false
        });

        const response = await request(app)
            .delete(`/api/jobs/${inactiveJob.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);

        const checkDb = await JobOffer.findById(inactiveJob.id);
        expect(checkDb).toBeNull();
    });
});

describe('Application Flow (Candidate)', () => {
    it('should allow a Candidate to apply for an active job', async () => {
        const recruiter = await mockRecruiterToken();
        const candidate = await mockCandidateToken();

        // Recruiter creates a job
        const job = await JobOffer.create({
            title: 'Fullstack Dev',
            description: 'MERN stack',
            createdBy: recruiter.userId,
            isActive: true
        });

        // Candidate applies
        const response = await request(app)
            .post(`/api/jobs/${job.id}/apply`)
            .set('Authorization', `Bearer ${candidate.token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Successfully applied for the job!');

        // Verify the database was updated using $push
        const updatedJob = await JobOffer.findById(job.id);
        expect(updatedJob?.applicants.length).toBe(1);
        expect(updatedJob?.applicants[0].candidate.toString()).toBe(candidate.userId.toString());
        expect(updatedJob?.applicants[0].status).toBe('Applied');
    });

    it('should PREVENT a Candidate from applying to the same job twice', async () => {
        const recruiter = await mockRecruiterToken();
        const candidate = await mockCandidateToken();

        const job = await JobOffer.create({
            title: 'Fullstack Dev',
            description: 'MERN stack',
            createdBy: recruiter.userId,
            isActive: true,
            // Manually add the candidate as if they already applied
            applicants: [{ candidate: candidate.userId, status: 'Applied' }]
        });

        // Candidate tries to apply again
        const response = await request(app)
            .post(`/api/jobs/${job.id}/apply`)
            .set('Authorization', `Bearer ${candidate.token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('You have already applied for this job.');
    });
});

describe('Kanban Board Flow (Recruiter)', () => {
    it('should allow a Recruiter to update a candidate\'s status', async () => {
        const recruiter = await mockRecruiterToken();
        const candidate = await mockCandidateToken();

        // Create a job with an existing applicant
        const job = await JobOffer.create({
            title: 'DevOps Engineer',
            description: 'Docker/AWS',
            createdBy: recruiter.userId,
            isActive: true,
            applicants: [{ candidate: candidate.userId, status: 'Applied' }]
        });

        // Recruiter moves them to "Interview"
        const response = await request(app)
            .patch(`/api/jobs/${job.id}/applicants/${candidate.userId}/status`)
            .set('Authorization', `Bearer ${recruiter.token}`)
            .send({ status: 'Interview' });

        expect(response.status).toBe(200);
        expect(response.body.message).toContain('Candidate moved to Interview');

        // Verify the status changed in the DB
        const updatedJob = await JobOffer.findById(job.id);
        expect(updatedJob?.applicants[0].status).toBe('Interview');
    });
});