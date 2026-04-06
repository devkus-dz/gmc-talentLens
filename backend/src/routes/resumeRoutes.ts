import { Router } from 'express';
import { resumeController } from '../controllers/resumeController';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { updateResumeSchema } from '../validations/resumeValidation';

const router = Router();

router.use(protect);

router.get('/me', restrictTo('CANDIDATE'), resumeController.getMyResume);
router.get('/user/:userId', restrictTo('ADMIN', 'RECRUITER'), resumeController.getResumeByUserId);
router.post('/upload', restrictTo('CANDIDATE'), uploadMiddleware.single('pdfFile'), resumeController.upload);
router.patch('/:id', restrictTo('CANDIDATE', 'ADMIN'), validate(updateResumeSchema), resumeController.updateResume);

export default router;