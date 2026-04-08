import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { clearUserCache, clearGlobalCache } from '../middlewares/cacheMiddleware';
import { BaseController } from './BaseController';
import JobOffer, { IJobOffer } from '../models/JobOffer';
import Resume from '../models/Resume';
import { jobOfferRepository } from '../repositories/JobOfferRepository';
import { geminiService } from '../services/geminiService';
import { notificationService } from '../services/notificationService';
import User from '../models/User';

class JobOfferController extends BaseController<IJobOffer> {
    constructor() {
        super(jobOfferRepository);
    }

    /**
     * Creates a new Job Offer in the database.
     * Automatically links the job offer to the Recruiter's company.
     */
    createJobOffer = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const {
                title, description, department, location,
                employmentType, salaryRange, minYearsOfExperience,
                requiredSkills, tags, status
            } = req.body;

            // Fetch the Recruiter's Company details
            const user = await User.findById(req.user?.id).populate('companyId');
            const company = user?.companyId as any;

            const newJobOffer = await this.repository.create({
                title,
                description,
                department,
                location,
                employmentType,
                salaryRange,
                minYearsOfExperience,
                requiredSkills,
                tags,
                status: status || 'DRAFT',
                createdBy: req.user?.id,

                // Attach Company Info
                companyId: company?._id,
                companyName: company?.name || 'TalentLens Partner',
                companyLogo: company?.logoUrl
            });

            // Trigger notification asynchronously
            if (newJobOffer.status === 'PUBLISHED') {
                notificationService.notifyMatchingCandidates(newJobOffer).catch(console.error);
            }

            // Clear the cache so new job shows up!
            clearUserCache(req.user!.id);
            // Clear the global cache so new job shows up!
            clearGlobalCache();

            res.status(201).json({ message: 'Job offer created successfully', jobOffer: newJobOffer });
        } catch (error) {
            console.error('Error creating Job Offer:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };

    /**
     * Updates a job offer. 
     * Business Rule: Cannot modify core details if the job is published, unless changing status to DRAFT or CLOSED.
     */
    updateJobOffer = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const jobOffer = await this.repository.findById(id as string);

            if (!jobOffer) {
                res.status(404).json({ message: 'Job offer not found.' });
                return;
            }

            if (jobOffer.createdBy.toString() !== userId?.toString() && req.user?.role !== 'ADMIN') {
                res.status(403).json({ message: 'Forbidden. You do not own this job offer.' });
                return;
            }

            if (jobOffer.status === 'PUBLISHED') {
                // If they are trying to change the status to DRAFT or CLOSED, allow it.
                if (req.body.status === 'DRAFT' || req.body.status === 'CLOSED') {
                    // Strip out all other fields from the request body 
                    req.body = { status: req.body.status };
                } else {
                    // If they are trying to update fields while keeping it PUBLISHED, block it.
                    res.status(400).json({
                        message: 'Cannot modify a published job offer. Please change status to DRAFT first.'
                    });
                    return;
                }
            }

            const updatedJob = await this.repository.update(id as string, req.body);

            // Clear the global cache so new job shows up!
            clearGlobalCache();

            res.status(200).json({ message: 'Job offer updated successfully.', jobOffer: updatedJob });
        } catch (error) {
            console.error('Update Job Offer Error:', error);
            res.status(500).json({ message: 'Internal server error while updating job offer.' });
        }
    };

    /**
     * Deletes a job offer.
     * Business Rule: Cannot delete a job offer if it is currently PUBLISHED.
     */
    deleteJobOffer = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const jobOffer = await this.repository.findById(id as string);

            if (!jobOffer) {
                res.status(404).json({ message: 'Job offer not found.' });
                return;
            }

            if (jobOffer.createdBy.toString() !== userId?.toString() && req.user?.role !== 'ADMIN') {
                res.status(403).json({ message: 'Forbidden. You do not own this job offer.' });
                return;
            }

            if (jobOffer.status === 'PUBLISHED') {
                res.status(400).json({
                    message: 'Cannot delete a published job offer. Please change status to CLOSED or DRAFT first.'
                });
                return;
            }

            await this.repository.delete(id as string);

            // Clear the global cache so new job shows up!
            clearGlobalCache();

            res.status(200).json({ message: 'Job offer permanently deleted.' });
        } catch (error) {
            console.error('Delete Job Offer Error:', error);
            res.status(500).json({ message: 'Internal server error while deleting job offer.' });
        }
    };

    /**
     * THE APPLICANT MATCHING ALGORITHM (MongoDB + Gemini)
     * Evaluates candidates who applied, and SAVES the scores to the database.
     */
    findMatches = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const jobOffer = await this.repository.findById(id as string);

            if (!jobOffer) {
                res.status(404).json({ message: 'Job offer not found.' });
                return;
            }

            // Get unique applicant IDs who haven't been scored yet
            const candidatesNeedingEvaluation = jobOffer.applicants
                .filter((app: any) => app.aiScore === undefined || app.aiScore === null)
                .map((app: any) => app.candidate.toString());

            const uniqueCandidatesToScore = [...new Set(candidatesNeedingEvaluation)];

            if (uniqueCandidatesToScore.length === 0) {
                res.status(200).json({ message: 'All applicants have already been scored!', matches: [] });
                return;
            }

            // Fetch resumes, sorted by newest first
            const allApplicantResumes = await Resume.find({
                userId: { $in: uniqueCandidatesToScore }
            }).sort({ updatedAt: -1 }).lean();

            // Keep only 1 resume per User ID
            const deduplicatedResumes: any[] = [];
            const seenUserIds = new Set();
            for (const resume of allApplicantResumes) {
                if (!seenUserIds.has(resume.userId.toString())) {
                    seenUserIds.add(resume.userId.toString());
                    deduplicatedResumes.push(resume);
                }
            }

            if (deduplicatedResumes.length === 0) {
                res.status(200).json({ message: 'No resumes found to evaluate.', matches: [] });
                return;
            }

            const jobOfferText = `
                Job Title: ${jobOffer.title}
                Required Experience: ${jobOffer.minYearsOfExperience} years
                Key Skills: ${jobOffer.requiredSkills.join(', ')}
                Description: ${jobOffer.description}
            `;

            // 4. Send the perfectly deduplicated array
            const evaluatedMatches = await geminiService.evaluateCandidates(jobOfferText, deduplicatedResumes);

            // 5. Save the FULL breakdown (aiScores) to the DB
            let hasUpdates = false;
            evaluatedMatches.forEach(aiMatch => {
                const candidateObj = deduplicatedResumes.find(c => c._id.toString() === aiMatch.resumeId);
                if (candidateObj) {
                    const applicantEntry = jobOffer.applicants.find((a: any) => a.candidate.toString() === candidateObj.userId.toString());
                    if (applicantEntry) {
                        applicantEntry.aiScore = aiMatch.scores.overallScore;
                        applicantEntry.aiScores = aiMatch.scores; // <--- SAVING THE 4 CRITERIA HERE
                        applicantEntry.aiExplanation = aiMatch.explanation;
                        hasUpdates = true;
                    }
                }
            });

            if (hasUpdates) await jobOffer.save();

            res.status(200).json({
                message: `Successfully evaluated ${deduplicatedResumes.length} applicants.`,
                totalEvaluated: deduplicatedResumes.length,
                matches: evaluatedMatches
            });

        } catch (error) {
            console.error('Hybrid Matching Error:', error);
            res.status(500).json({ message: 'Internal server error during candidate matching.' });
        }
    };

    /**
     * Allows a candidate to apply for a job using their existing profile.
     */
    applyForJob = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id: jobId } = req.params;
            const candidateId = req.user?.id;

            if (!candidateId) return;

            const jobOffer = await this.repository.findById(jobId as string);

            if (!jobOffer || jobOffer.status !== 'PUBLISHED') {
                res.status(400).json({ message: 'This job offer is not active or does not exist.' });
                return;
            }

            const alreadyApplied = jobOffer.applicants.some(
                (applicant) => applicant.candidate.toString() === candidateId.toString()
            );

            if (alreadyApplied) {
                res.status(400).json({ message: 'You have already applied for this job.' });
                return;
            }

            await JobOffer.findByIdAndUpdate(
                jobId,
                {
                    $push: {
                        applicants: {
                            candidate: candidateId,
                            status: 'Applied',
                            appliedAt: new Date()
                        }
                    }
                }
            );

            // Clear the global cache so new job shows up!
            clearGlobalCache();

            res.status(200).json({ message: 'Successfully applied for the job!', jobTitle: jobOffer.title });
        } catch (error) {
            console.error('Apply for Job Error:', error);
            res.status(500).json({ message: 'Internal server error while applying.' });
        }
    };

    /**
     * Retrieves all applicants for a specific job offer to populate the Kanban board.
     */
    getJobApplicants = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id: jobId } = req.params;

            const jobOffer = await JobOffer.findById(jobId)
                .populate({ path: 'applicants.candidate', select: 'firstName lastName email profilePictureUrl' })
                .lean();

            if (!jobOffer) {
                res.status(404).json({ message: 'Job offer not found.' });
                return;
            }

            const candidateIds = jobOffer.applicants.map((app: any) => app.candidate._id);
            const resumes = await Resume.find({ userId: { $in: candidateIds } }).lean();

            const applicantsWithResumes = jobOffer.applicants.map((app: any) => {
                const candidateResume = resumes.find(r => r.userId.toString() === app.candidate._id.toString());
                return { ...app, resume: candidateResume || null };
            });

            res.status(200).json({
                jobTitle: jobOffer.title,
                totalApplicants: applicantsWithResumes.length,
                applicants: applicantsWithResumes
            });
        } catch (error) {
            console.error('Fetch Applicants Error:', error);
            res.status(500).json({ message: 'Internal server error while fetching applicants.' });
        }
    };

    /**
     * Updates an applicant's status in the Kanban board.
     */
    updateApplicantStatus = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id: jobId, candidateId } = req.params;
            const { status } = req.body;

            const validStatuses = ['Applied', 'In Review', 'Interview', 'Offered', 'Rejected'];

            if (!validStatuses.includes(status)) {
                res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
                return;
            }

            const updatedJob = await JobOffer.findOneAndUpdate(
                { _id: jobId, 'applicants.candidate': candidateId },
                { $set: { 'applicants.$.status': status } },
                { returnDocument: 'after' }
            );

            if (!updatedJob) {
                res.status(404).json({ message: 'Job offer or applicant not found.' });
                return;
            }

            notificationService.notifyStatusUpdate(candidateId as string, updatedJob.title, status).catch(console.error);

            // Clear the global cache so new job shows up!
            clearGlobalCache();

            res.status(200).json({ message: `Candidate moved to ${status}.` });
        } catch (error) {
            console.error('Update Applicant Status Error:', error);
            res.status(500).json({ message: 'Internal server error while updating status.' });
        }
    };

    /**
         * Retrieves a paginated and dynamically filtered list of Job Offers.
         */
    getAllJobOffers = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const search = req.query.search as string;
            const isActive = req.query.isActive as string;
            const createdBy = req.query.createdBy as string;
            const status = req.query.status as string;

            const query: any = {};

            if (isActive !== undefined) {
                query.isActive = isActive === 'true';
            }

            // --- SECURITY DATA SCOPING ---
            if (req.user?.role === 'RECRUITER') {
                // A recruiter can ONLY ever see their own jobs
                query.createdBy = req.user.id;
            } else if (req.user?.role === 'CANDIDATE') {
                // A candidate can ONLY ever see published jobs
                query.status = 'PUBLISHED';
            } else if (createdBy) {
                // Admins can filter by specific creators
                query.createdBy = createdBy;
            }

            if (status) {
                query.status = status;
            }

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { companyName: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } }
                ];
            }

            const jobs = await JobOffer.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await JobOffer.countDocuments(query);

            res.status(200).json({ data: jobs, total, page, totalPages: Math.ceil(total / limit) });
        } catch (error) {
            console.error('Fetch Jobs Error:', error);
            res.status(500).json({ message: 'Failed to fetch jobs' });
        }
    };

    /**
     * Fetch a single job offer by its ID.
     */
    getJobById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            // Find the job using your repository
            const job = await this.repository.findById(id as string);

            if (!job) {
                res.status(404).json({ message: 'Job not found.' });
                return;
            }

            res.status(200).json(job);
        } catch (error) {
            console.error('Fetch Job By ID Error:', error);
            res.status(500).json({ message: 'Internal server error while fetching the job.' });
        }
    };

    /**
     * Retrieves all job offers a candidate has applied to.
     */
    getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const candidateId = req.user?.id;
            if (!candidateId) return;

            const jobs = await JobOffer.find({ 'applicants.candidate': candidateId })
                .select('title status createdAt applicants')
                .lean();

            const myApplications = jobs.map((job: any) => {
                const myAppRecord = job.applicants.find((app: any) => app.candidate.toString() === candidateId.toString());
                return {
                    jobId: job._id,
                    jobTitle: job.title,
                    jobStatus: job.status,
                    myStatus: myAppRecord?.status || 'Unknown',
                    appliedAt: myAppRecord?.appliedAt
                };
            }).sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime());

            res.status(200).json(myApplications);
        } catch (error) {
            console.error('Fetch My Applications Error:', error);
            res.status(500).json({ message: 'Internal server error while fetching your applications.' });
        }
    };

    /**
     * Withdraw an application from a job offer.
     * Prevents withdrawal if the job offer is already closed.
     */
    withdrawApplication = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            // 1. Find the job
            const job = await this.repository.findById(id as string);

            if (!job) {
                res.status(404).json({ message: 'Job not found.' });
                return;
            }

            // 2. Safely check the condition: Is the job closed?
            const currentStatus = job.status?.toUpperCase();
            if (currentStatus === 'CLOSED' || job.isActive === false) {
                res.status(400).json({ message: 'You cannot withdraw from a job that is already closed.' });
                return;
            }

            // 3. Remove the candidate from the applicants array safely
            job.applicants = job.applicants.filter((app: any) => {
                const candidateId = app.candidate ? app.candidate.toString() : app.toString();
                return candidateId !== userId;
            });

            await job.save();

            res.status(200).json({ message: 'Application successfully withdrawn.' });
        } catch (error) {
            console.error('Withdrawal Error:', error);
            res.status(500).json({ message: 'Internal server error while withdrawing application.' });
        }
    };


}

export const jobOfferController = new JobOfferController();