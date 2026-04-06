// backend/src/controllers/dashboardController.ts
import { Response, Request } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/authMiddleware';
import JobOffer from '../models/JobOffer';
import User from '../models/User';
import Company from '../models/Company';

class DashboardController {

    /**
     * @route GET /api/dashboard/candidate
     * @description CANDIDATE STATS: Total saved jobs, total applications, and status breakdown.
     */
    getCandidateStats = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const candidateId = new mongoose.Types.ObjectId(req.user?.id);

            const user = await User.findById(candidateId).select('savedJobs');
            const totalSavedJobs = user?.savedJobs?.length || 0;

            const statusBreakdown = await JobOffer.aggregate([
                { $unwind: '$applicants' },
                { $match: { 'applicants.candidate': candidateId } },
                {
                    $group: {
                        _id: '$applicants.status',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const totalApplications = statusBreakdown.reduce((acc, curr) => acc + curr.count, 0);

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
    };

    /**
     * @route GET /api/dashboard/recruiter
     * @description RECRUITER STATS: KPIs, Pipeline Funnel, Job Status, and Traffic Timeline.
     */
    getRecruiterStats = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const recruiterId = new mongoose.Types.ObjectId(req.user?.id);

            // Top Level KPIs
            const jobs = await JobOffer.find({ createdBy: recruiterId });
            const totalJobs = jobs.length;
            const activeJobs = jobs.filter(j => j.status === 'PUBLISHED').length;
            const inactiveJobs = jobs.filter(j => j.status === 'DRAFT' || j.status === 'CLOSED').length;
            const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants.length, 0);

            // Pipeline Funnel (Mapped to specific stages to guarantee order)
            const pipelineRaw = await JobOffer.aggregate([
                { $match: { createdBy: recruiterId } },
                { $unwind: '$applicants' },
                { $group: { _id: '$applicants.status', count: { $sum: 1 } } }
            ]);
            const funnelStages = ['Applied', 'In Review', 'Interview', 'Offered', 'Rejected'];
            const pipelineChartData = funnelStages.map(stage => {
                const found = pipelineRaw.find(p => p._id === stage);
                return { status: stage, count: found ? found.count : 0 };
            });

            // Activity Timeline (Last 6 Months)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const activityRaw = await JobOffer.aggregate([
                { $match: { createdBy: recruiterId } },
                { $unwind: "$applicants" },
                { $match: { "applicants.appliedAt": { $gte: sixMonthsAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$applicants.appliedAt" } },
                        applications: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);
            const activityTimeline = activityRaw.map(item => ({ month: item._id, applications: item.applications }));

            // 4. Job Status (Pie Chart)
            const jobStatusRaw = await JobOffer.aggregate([
                { $match: { createdBy: recruiterId } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]);
            const jobStatus = jobStatusRaw.map(item => ({ name: item._id, value: item.count }));

            res.status(200).json({
                jobs: { total: totalJobs, active: activeJobs, inactive: inactiveJobs },
                totalApplicants,
                pipelineChartData,
                activityTimeline,
                jobStatus
            });
        } catch (error) {
            console.error('Recruiter Stats Error:', error);
            res.status(500).json({ message: 'Failed to load recruiter dashboard stats.' });
        }
    };

    /**
     * @route GET /api/dashboard/admin
     * @description ADMIN STATS: Platform-wide health metrics.
     */
    getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const [
                userStats,
                jobStats,
                applicationStats,
                totalCompanies,
                bannedUsers
            ] = await Promise.all([
                User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
                JobOffer.aggregate([{ $group: { _id: '$isActive', count: { $sum: 1 } } }]),
                JobOffer.aggregate([
                    { $project: { applicantCount: { $size: '$applicants' } } },
                    { $group: { _id: null, total: { $sum: '$applicantCount' } } }
                ]),
                Company.countDocuments(),
                User.countDocuments({ isActive: false })
            ]);

            let recruitersCount = 0;
            let candidatesCount = 0;
            let totalUsers = 0;

            userStats.forEach(stat => {
                totalUsers += stat.count;
                if (stat._id === 'RECRUITER') recruitersCount = stat.count;
                if (stat._id === 'CANDIDATE') candidatesCount = stat.count;
            });

            let activeJobs = 0;
            let inactiveJobs = 0;
            let totalJobs = 0;

            jobStats.forEach(stat => {
                totalJobs += stat.count;
                if (stat._id === true) activeJobs = stat.count;
                if (stat._id === false) inactiveJobs = stat.count;
            });

            res.status(200).json({
                data: {
                    companies: { total: totalCompanies },
                    users: {
                        total: totalUsers,
                        recruiters: recruitersCount,
                        candidates: candidatesCount,
                        banned: bannedUsers
                    },
                    jobs: {
                        total: totalJobs,
                        active: activeJobs,
                        inactive: inactiveJobs
                    },
                    applications: {
                        total: applicationStats[0]?.total || 0
                    },
                    usersChartData: userStats.map(stat => ({ role: stat._id, count: stat.count })),
                    jobsChartData: jobStats.map(stat => ({ isActive: stat._id, count: stat.count }))
                }
            });
        } catch (error) {
            console.error('Admin Stats Error:', error);
            res.status(500).json({ message: 'Failed to load admin dashboard stats.' });
        }
    };

    /**
     * @route GET /api/dashboard/analytics
     * @description Shared macro-analytics route for full chart pages.
     */
    getAnalyticsData = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;

            const matchStage = role === 'RECRUITER'
                ? { $match: { createdBy: new mongoose.Types.ObjectId(userId) } }
                : { $match: {} };

            const jobStatusRaw = await JobOffer.aggregate([matchStage, { $group: { _id: "$status", count: { $sum: 1 } } }]);
            const jobStatus = jobStatusRaw.map(item => ({ name: item._id, value: item.count }));

            const pipelineRaw = await JobOffer.aggregate([
                matchStage,
                { $unwind: "$applicants" },
                { $group: { _id: "$applicants.status", count: { $sum: 1 } } }
            ]);
            const funnelStages = ['Applied', 'In Review', 'Interview', 'Offered', 'Rejected'];
            const pipeline = funnelStages.map(stage => {
                const found = pipelineRaw.find(p => p._id === stage);
                return { stage, candidates: found ? found.count : 0 };
            });

            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const activityRaw = await JobOffer.aggregate([
                matchStage,
                { $unwind: "$applicants" },
                { $match: { "applicants.appliedAt": { $gte: sixMonthsAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$applicants.appliedAt" } },
                        applications: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);
            const activityTimeline = activityRaw.map(item => ({ month: item._id, applications: item.applications }));

            res.status(200).json({ jobStatus, pipeline, activityTimeline });
        } catch (error) {
            console.error('Analytics Aggregation Error:', error);
            res.status(500).json({ message: 'Internal server error while fetching analytics data.' });
        }
    };
}

export const dashboardController = new DashboardController();