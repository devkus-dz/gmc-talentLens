import { Router } from 'express';
import { jobOfferController } from '../controllers/jobOfferController';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { createJobSchema, updateJobSchema, updateApplicantStatusSchema } from '../validations/jobValidation';

const router = Router();

router.get('/', protect, jobOfferController.getAllJobOffers);
router.get('/applied', protect, jobOfferController.getMyApplications);
router.get('/:id', protect, jobOfferController.getJobById);

router.post('/', protect, restrictTo('RECRUITER', 'ADMIN'), validate(createJobSchema), jobOfferController.createJobOffer);

router.get('/:id/matches', protect, jobOfferController.findMatches);
router.post('/:id/apply', protect, restrictTo('CANDIDATE'), jobOfferController.applyForJob);
router.get('/:id/applicants', protect, jobOfferController.getJobApplicants);
router.delete('/:id/withdraw', protect, restrictTo('CANDIDATE'), jobOfferController.withdrawApplication);

router.patch('/:id/applicants/:candidateId/status', protect, restrictTo('RECRUITER', 'ADMIN'), validate(updateApplicantStatusSchema), jobOfferController.updateApplicantStatus);

router.patch('/:id', protect, restrictTo('RECRUITER', 'ADMIN'), validate(updateJobSchema), jobOfferController.updateJobOffer);
router.delete('/:id', protect, restrictTo('RECRUITER', 'ADMIN'), jobOfferController.deleteJobOffer);

export default router;