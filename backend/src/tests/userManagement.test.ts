import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import { connectTestDB, closeTestDB, clearTestDB } from './setup';
import User from '../models/User';
import jwt from 'jsonwebtoken';

/**
 * Simulation scenario :
 * 1- A Candidate can register and log in.
 * 2- A Candidate gets blocked (403 Forbidden) if they try to access the Admin users list.
 * 3- An Admin can successfully deactivate the Candidate.
 * 4- The deactivated Candidate is blocked from logging in.
*/

// Setup and Teardown Hooks
beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

// --- UTILITY MOCK ---

/**
 * Directly creates an Admin user in the database since public registration 
 * usually defaults to CANDIDATE or RECRUITER.
 */
const mockAdminToken = async () => {
    const admin = await User.create({
        email: 'admin@talentlens.com',
        passwordHash: 'hashedpassword', // Bypass bcrypt for fast test setup
        role: 'ADMIN'
    });

    return {
        token: jwt.sign({ id: admin.id }, process.env.JWT_SECRET || 'testsecret'),
        adminId: admin.id
    };
};

// --- TEST SUITES ---

describe('Authentication and RBAC Flow', () => {

    const candidatePayload = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@test.com',
        password: 'SecurePassword123!',
        role: 'CANDIDATE'
    };

    it('should successfully register a new candidate', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send(candidatePayload);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully.');
        expect(response.body.user.email).toBe(candidatePayload.email);

        // Ensuring the token was sent in the HttpOnly cookie
        expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should block a Candidate from accessing Admin routes (RBAC)', async () => {
        // Register the candidate
        await request(app).post('/api/auth/register').send(candidatePayload);

        // Login to get the cookie/token
        const loginRes = await request(app).post('/api/auth/login').send({
            email: candidatePayload.email,
            password: candidatePayload.password
        });

        const candidateCookie = loginRes.headers['set-cookie'];

        // Attempt to fetch all users (Admin route)
        const response = await request(app)
            .get('/api/users')
            .set('Cookie', candidateCookie);

        // Assert they are forbidden
        expect(response.status).toBe(403);
        expect(response.body.message).toContain('Forbidden');
    });

    it('should allow an Admin to deactivate a user, blocking future logins', async () => {
        // Setup: Create Admin and Candidate
        const admin = await mockAdminToken();
        await request(app).post('/api/auth/register').send(candidatePayload);

        const candidateInDb = await User.findOne({ email: candidatePayload.email });
        expect(candidateInDb?.isActive).toBe(true);

        // Admin deactivates the Candidate
        const toggleRes = await request(app)
            .patch(`/api/users/${candidateInDb?.id}/toggle-active`)
            .set('Authorization', `Bearer ${admin.token}`);

        expect(toggleRes.status).toBe(200);
        expect(toggleRes.body.isActive).toBe(false);

        // Candidate attempts to log in
        const loginRes = await request(app).post('/api/auth/login').send({
            email: candidatePayload.email,
            password: candidatePayload.password
        });

        // Assert the login is blocked due to deactivation
        expect(loginRes.status).toBe(403);
        expect(loginRes.body.message).toContain('deactivated');
    });
});