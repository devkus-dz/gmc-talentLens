// src/controllers/dashboardController.ts
import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/authMiddleware';
import JobOffer from '../models/JobOffer';
import User from '../models/User';

/**
 * Controller handling chart-ready statistics for all user roles.
 * Uses MongoDB Aggregation Pipelines for high-performance counting.
 * @namespace dashboardController
 */
export const dashboardController = {

    /**
     * CANDIDATE STATS
     * Returns total saved jobs, total applications, and a breakdown of application statuses.
     * Perfect for a Pie Chart (Status Breakdown) and Number Cards.
     */
    async getCandidateStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            const candidateId = new mongoose.Types.ObjectId(req.user?.id);

            // Get saved jobs count
            const user = await User.findById(candidateId).select('savedJobs');
            const totalSavedJobs = user?.savedJobs?.length || 0;

            // Aggregate applications and group by Status (The Magic Mongoose Pipeline)
            const statusBreakdown = await JobOffer.aggregate([
                { $unwind: '$applicants' }, // Deconstructs the applicants array
                { $match: { 'applicants.candidate': candidateId } }, // Find only THIS candidate
                {
                    $group: {
                        _id: '$applicants.status', // Group by status (e.g., 'Interview')
                        count: { $sum: 1 }         // Count them
                    }
                }
            ]);

            // 3. Calculate total applications from the breakdown
            const totalApplications = statusBreakdown.reduce((acc, curr) => acc + curr.count, 0);

            // Format for frontend charts (e.g., Recharts or Chart.js)
            res.status(200).json({
                totalSavedJobs,
                totalApplications,
                statusChartData: statusBreakdown.map(stat => ({
                    status: stat._id,
                    count: stat.count
                }))
            });
        } catch (error) {
            console.error('Candidate Stats Error:', error);
            res.status(500).json({ message: 'Failed to load candidate dashboard stats.' });
        }
    },

    /**
     * RECRUITER STATS
     * Returns total jobs created, total candidates received, and a status breakdown of ALL their candidates.
     * Perfect for a Bar Chart (Pipeline Health) and Number Cards.
     */
    async getRecruiterStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            const recruiterId = new mongoose.Types.ObjectId(req.user?.id);

            // Get total jobs (Active vs Inactive)
            const jobStats = await JobOffer.aggregate([
                { $match: { createdBy: recruiterId } },
                {
                    $group: {
                        _id: '$isActive',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const activeJobs = jobStats.find(stat => stat._id === true)?.count || 0;
            const inactiveJobs = jobStats.find(stat => stat._id === false)?.count || 0;

            // Aggregate ALL applicants across ALL jobs owned by this recruiter
            const pipelineBreakdown = await JobOffer.aggregate([
                { $match: { createdBy: recruiterId } },
                { $unwind: '$applicants' },
                {
                    $group: {
                        _id: '$applicants.status',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const totalApplicants = pipelineBreakdown.reduce((acc, curr) => acc + curr.count, 0);

            res.status(200).json({
                jobs: {
                    total: activeJobs + inactiveJobs,
                    active: activeJobs,
                    inactive: inactiveJobs
                },
                totalApplicants,
                pipelineChartData: pipelineBreakdown.map(stat => ({
                    status: stat._id,
                    count: stat.count
                }))
            });
        } catch (error) {
            console.error('Recruiter Stats Error:', error);
            res.status(500).json({ message: 'Failed to load recruiter dashboard stats.' });
        }
    },

    /**
     * ADMIN STATS
     * Returns platform-wide health metrics: User growth, Total Jobs, and overall application volume.
     * Perfect for a macro-level overview dashboard.
     */
    async getAdminStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            // Group Users by Role
            const userStats = await User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } }
            ]);

            // Group Jobs by Active/Inactive
            const jobStats = await JobOffer.aggregate([
                { $group: { _id: '$isActive', count: { $sum: 1 } } }
            ]);

            // Count total applications ever submitted
            const applicationStats = await JobOffer.aggregate([
                { $project: { applicantCount: { $size: '$applicants' } } },
                { $group: { _id: null, total: { $sum: '$applicantCount' } } }
            ]);

            res.status(200).json({
                usersChartData: userStats.map(stat => ({
                    role: stat._id,
                    count: stat.count
                })),
                jobsChartData: jobStats.map(stat => ({
                    isActive: stat._id,
                    count: stat.count
                })),
                totalApplicationsPlatformWide: applicationStats[0]?.total || 0
            });
        } catch (error) {
            console.error('Admin Stats Error:', error);
            res.status(500).json({ message: 'Failed to load admin dashboard stats.' });
        }
    }
};