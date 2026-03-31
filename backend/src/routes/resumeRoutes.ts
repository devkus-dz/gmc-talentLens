import { Router } from 'express';
import { resumeController } from '../controllers/resumeController';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';

const router = Router();

// All resume operations require authentication
router.use(protect);

/**
 * @route GET /api/resumes/me
 * @description Retrieves the candidate's most recently uploaded/parsed resume.
 * @access Private (CANDIDATE)
 */
router.get('/me', restrictTo('CANDIDATE'), resumeController.getMyResume);

/**
 * @route POST /api/resumes/upload
 * @description Uploads a candidate's resume (PDF only, max 5MB).
 * @access Private (CANDIDATE)
 */
router.post(
    '/upload',
    restrictTo('CANDIDATE'),
    uploadMiddleware.single('pdfFile'),
    resumeController.upload
);

/**
 * @route PATCH /api/resumes/:id
 * @description Updates the structured data of a parsed resume (add experience, edit skills).
 * @access Private (CANDIDATE or ADMIN)
 */
router.patch('/:id', restrictTo('CANDIDATE', 'ADMIN'), resumeController.updateResume);

export default router;