// src/routes/jobOfferRoutes.ts
import { Router } from 'express';
import { jobOfferController } from '../controllers/jobOfferController';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route GET /api/jobs
 * @description Get all job offers (paginated). Public or protected depending on your needs.
 * @access Public (or Private if you want them logged in first)
 */
// If it's public: router.get('/', jobOfferController.getAllJobOffers);
// If it requires login:
router.get('/', protect, jobOfferController.getAllJobOffers);

/**
 * @route POST /api/jobs
 * @description Create a new Job Offer
 * @access Private
 */
router.post('/', protect, jobOfferController.createJobOffer);

/**
 * @route GET /api/jobs/:id/matches
 * @description Run the Hybrid Matching Algorithm for a specific Job Offer
 * @access Private
 */
router.get('/:id/matches', protect, jobOfferController.findMatches);

/**
 * @route POST /api/jobs/:id/apply
 * @description Candidate applies for a specific job offer
 * @access Private (Candidate)
 */
router.post('/:id/apply', protect, jobOfferController.applyForJob);

/**
 * @route GET /api/jobs/:id/applicants
 * @description Get all applicants with their User and Resume data (Recruiter Kanban)
 * @access Private
 */
router.get('/:id/applicants', protect, jobOfferController.getJobApplicants);

/**
 * @route PATCH /api/jobs/:id/applicants/:candidateId/status
 * @description Update an applicant's status (Recruiter Kanban Drag & Drop)
 * @access Private
 */
router.patch(
    '/:id/applicants/:candidateId/status',
    protect,                            // 1. Ensures they are logged in
    restrictTo('RECRUITER', 'ADMIN'),   // 2. Ensures they have the right role
    jobOfferController.updateApplicantStatus
);

/**
 * @route GET /api/jobs/applied
 * @description Get all jobs the current candidate has applied to (Dashboard)
 * @access Private (Candidate)
 */
router.get('/applied', protect, jobOfferController.getMyApplications);

/**
 * @route PATCH /api/jobs/:id
 * @description Update a job offer (Requires ownership and inactive status)
 * @access Private (RECRUITER, ADMIN)
 */
router.patch('/:id', protect, restrictTo('RECRUITER', 'ADMIN'), jobOfferController.updateJobOffer);

/**
 * @route DELETE /api/jobs/:id
 * @description Delete a job offer (Requires ownership and inactive status)
 * @access Private (RECRUITER, ADMIN)
 */
router.delete('/:id', protect, restrictTo('RECRUITER', 'ADMIN'), jobOfferController.deleteJobOffer);


export default router;