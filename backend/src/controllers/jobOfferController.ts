// src/controllers/jobOfferController.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import JobOffer from '../models/JobOffer';
import Resume from '../models/Resume';
import { geminiService } from '../services/geminiService';

export const jobOfferController = {
    /**
     * Creates a new Job Offer in the database.
     */
    async createJobOffer(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { title, description, minYearsOfExperience, requiredSkills, tags } = req.body;

            const newJobOffer = await JobOffer.create({
                title,
                description,
                minYearsOfExperience,
                requiredSkills,
                tags
            });

            res.status(201).json({ message: 'Job offer created successfully', jobOffer: newJobOffer });
        } catch (error) {
            console.error('Error creating Job Offer:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    },

    /**
     * THE HYBRID MATCHING ALGORITHM
     * Finds the best candidates for a specific Job Offer using MongoDB + Gemini.
     */
    async findMatches(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const jobOffer = await JobOffer.findById(id);

            if (!jobOffer) {
                res.status(404).json({ message: 'Job offer not found.' });
                return;
            }

            console.log(`🔎 Starting Hybrid Match for: ${jobOffer.title}`);

            // =========================================================
            // PHASE 1: THE FAST FILTER (MongoDB)
            // =========================================================
            // We want candidates who have AT LEAST ONE matching tag OR skill.
            // AND we give a 1-year grace period for experience (e.g., if job needs 5, we accept 4+).
            const minimumExperience = Math.max(0, jobOffer.minYearsOfExperience - 1);

            const fastFilterQuery = {
                yearsOfExperience: { $gte: minimumExperience },
                $or: [
                    { tags: { $in: jobOffer.tags } },
                    { skills: { $in: jobOffer.requiredSkills } }
                ]
            };

            // .lean() converts Mongoose documents to raw JSON objects, which makes it much 
            // faster and easier to pass directly into our Gemini service.
            // We limit to 20 to protect your Gemini API budget and reduce latency.
            const preFilteredCandidates = await Resume.find(fastFilterQuery)
                .limit(20)
                .lean();

            if (preFilteredCandidates.length === 0) {
                res.status(200).json({
                    message: 'No baseline candidates found in the database for this offer.',
                    matches: []
                });
                return;
            }

            console.log(`✅ Fast Filter complete. Found ${preFilteredCandidates.length} potential candidates. Sending to AI...`);

            // =========================================================
            // PHASE 2: THE DEEP AI READ (Gemini)
            // =========================================================
            // Format the job offer into a clean text block for the AI to read
            const jobOfferText = `
                Job Title: ${jobOffer.title}
                Required Minimum Experience: ${jobOffer.minYearsOfExperience} years
                Key Required Skills: ${jobOffer.requiredSkills.join(', ')}
                Description: ${jobOffer.description}
            `;

            // Call the service we wrote earlier
            const evaluatedMatches = await geminiService.evaluateCandidates(jobOfferText, preFilteredCandidates);

            // =========================================================
            // PHASE 3: FORMATTING THE RESPONSE
            // =========================================================
            // The AI only returns { resumeId, matchScore, explanation }. 
            // We need to merge that back with the candidate's basic info so your frontend UI has names and emails to display!
            const finalResults = evaluatedMatches.map(aiMatch => {
                // Find the original candidate data that matches the AI's returned ID
                const candidateObj = preFilteredCandidates.find(c => c._id.toString() === aiMatch.resumeId);

                return {
                    resumeId: aiMatch.resumeId,
                    scores: aiMatch.scores,
                    explanation: aiMatch.explanation,
                    candidate: {
                        firstName: candidateObj?.firstName || 'Unknown',
                        lastName: candidateObj?.lastName || '',
                        email: candidateObj?.email || '',
                        yearsOfExperience: candidateObj?.yearsOfExperience,
                        currentTitle: candidateObj?.experiences[0]?.position || 'N/A' // Grabs their most recent job title
                    }
                };
            });

            res.status(200).json({
                message: `Successfully evaluated ${preFilteredCandidates.length} candidates.`,
                totalEvaluated: preFilteredCandidates.length,
                matches: finalResults // Already sorted highest-to-lowest by the Gemini service
            });

        } catch (error) {
            console.error('Hybrid Matching Error:', error);
            res.status(500).json({ message: 'Internal server error during candidate matching.' });
        }
    },

    /**
     * Allows a candidate to apply (postulate) for a job using their existing profile.
     * * Execution Steps:
     * 1. Validates the Job ID and User context.
     * 2. Checks if the candidate has already applied to prevent duplicates.
     * 3. Pushes the candidate's ID into the JobOffer's applicants array.
     */
    async applyForJob(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id: jobId } = req.params; // Get Job ID from the URL
            const candidateId = req.user?.id;

            if (!candidateId) {
                res.status(401).json({ message: 'Unauthorized. User context missing.' });
                return;
            }

            const jobOffer = await JobOffer.findById(jobId);

            if (!jobOffer) {
                res.status(404).json({ message: 'Job offer not found.' });
                return;
            }

            if (!jobOffer.isActive) {
                res.status(400).json({ message: 'This job offer is no longer active.' });
                return;
            }

            // Check if the candidate is already in the applicants array
            const alreadyApplied = jobOffer.applicants.some(
                (applicant) => applicant.candidate.toString() === candidateId
            );

            if (alreadyApplied) {
                res.status(400).json({ message: 'You have already applied for this job.' });
                return;
            }

            // Push the new application to the array
            jobOffer.applicants.push({
                candidate: candidateId as any,
                status: 'Applied',
                appliedAt: new Date()
            });

            await jobOffer.save();

            res.status(200).json({
                message: 'Successfully applied for the job!',
                jobTitle: jobOffer.title
            });

        } catch (error) {
            console.error('Apply for Job Error:', error);
            res.status(500).json({ message: 'Internal server error while applying.' });
        }
    },

    /**
     * Retrieves all applicants for a specific job offer to populate the Kanban board.
     * It merges the User data (name, email) with their Resume data (skills, experience).
     * @access Private (Recruiter)
     */
    async getJobApplicants(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id: jobId } = req.params;

            // Fetch the job and populate the candidate's basic User info
            // We use .lean() to get a plain JSON object instead of a heavy Mongoose document
            const jobOffer = await JobOffer.findById(jobId)
                .populate({
                    path: 'applicants.candidate',
                    select: 'firstName lastName email profilePictureUrl'
                })
                .lean();

            if (!jobOffer) {
                res.status(404).json({ message: 'Job offer not found.' });
                return;
            }

            // Extract all candidate IDs from the applicants array
            const candidateIds = jobOffer.applicants.map((app: any) => app.candidate._id);

            // Fetch all Resumes belonging to these candidates in one single, fast query
            const resumes = await Resume.find({ userId: { $in: candidateIds } }).lean();

            // Merge the Resume data into the applicant objects
            const applicantsWithResumes = jobOffer.applicants.map((app: any) => {
                const candidateResume = resumes.find(
                    (r) => r.userId.toString() === app.candidate._id.toString()
                );

                return {
                    ...app,
                    // Attach the resume so the frontend has skills, summary, and the S3 fileKey!
                    resume: candidateResume || null
                };
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
    },

    /**
     * Updates an applicant's status in the Kanban board (e.g., drag and drop).
     * @access Private (Recruiter)
     */
    async updateApplicantStatus(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id: jobId, candidateId } = req.params;
            const { status } = req.body;

            const validStatuses = ['Applied', 'In Review', 'Interview', 'Offered', 'Rejected'];

            if (!validStatuses.includes(status)) {
                res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
                return;
            }

            // Find the specific job, look inside the applicants array for this candidate,
            // and use the positional operator ($) to update ONLY their status.
            const updatedJob = await JobOffer.findOneAndUpdate(
                { _id: jobId, 'applicants.candidate': candidateId },
                { $set: { 'applicants.$.status': status } },
                { returnDocument: 'after' }
            );

            if (!updatedJob) {
                res.status(404).json({ message: 'Job offer or applicant not found.' });
                return;
            }

            res.status(200).json({ message: `Candidate moved to ${status}.` });

        } catch (error) {
            console.error('Update Applicant Status Error:', error);
            res.status(500).json({ message: 'Internal server error while updating status.' });
        }
    },

    /**
     * Retrieves a paginated and dynamically filtered list of Job Offers.
     * Supports filtering by search term, skills, and maximum required experience.
     */
    async getAllJobOffers(req: AuthRequest, res: Response): Promise<void> {
        try {
            // Parse query parameters
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;
            const skills = req.query.skills as string;
            const maxExperience = req.query.maxExperience as string;

            // Build the dynamic filter object
            const filter: any = {};

            // Non-admins only see active jobs
            if (!req.user || req.user.role !== 'ADMIN') {
                filter.isActive = true;
            }

            // FILTER: Text search in the job title
            if (search) {
                filter.title = { $regex: search, $options: 'i' };
            }

            // FILTER: Skills (Checks if the job requires ANY of the provided skills)
            if (skills) {
                const skillsArray = skills.split(',').map(skill => skill.trim());
                // Use $in to find jobs that contain at least one of the requested skills
                filter.requiredSkills = { $in: skillsArray };
            }

            // FILTER: Experience (Show jobs where the required experience is <= candidate's experience)
            if (maxExperience) {
                filter.minYearsOfExperience = { $lte: parseInt(maxExperience) };
            }

            // Execute query using our paginated logic
            const result = await JobOffer.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                // We exclude the heavy applicants array here to keep the list fast
                .select('-applicants');

            const total = await JobOffer.countDocuments(filter);

            res.status(200).json({
                data: result,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            console.error('Fetch Jobs Error:', error);
            res.status(500).json({ message: 'Internal server error while fetching jobs.' });
        }
    },

    /**
     * Retrieves all job offers a candidate has applied to, including their current Kanban status.
     * @access Private (Candidate)
     */
    async getMyApplications(req: AuthRequest, res: Response): Promise<void> {
        try {
            const candidateId = req.user?.id;

            if (!candidateId) {
                res.status(401).json({ message: 'Unauthorized.' });
                return;
            }

            // Find all jobs where this candidate's ID is in the applicants array
            const jobs = await JobOffer.find({ 'applicants.candidate': candidateId })
                .select('title isActive createdAt applicants') // Only grab what we need to display
                .lean();

            // Format the output so the candidate only sees THEIR application status, 
            // not the data of other candidates who applied to the same job!
            const myApplications = jobs.map((job: any) => {
                const myAppRecord = job.applicants.find(
                    (app: any) => app.candidate.toString() === candidateId.toString()
                );

                return {
                    jobId: job._id,
                    jobTitle: job.title,
                    isJobActive: job.isActive,
                    myStatus: myAppRecord?.status || 'Unknown',
                    appliedAt: myAppRecord?.appliedAt
                };
            });

            // Sort so the most recent applications appear at the top
            myApplications.sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime());

            res.status(200).json(myApplications);
        } catch (error) {
            console.error('Fetch My Applications Error:', error);
            res.status(500).json({ message: 'Internal server error while fetching your applications.' });
        }
    }
};