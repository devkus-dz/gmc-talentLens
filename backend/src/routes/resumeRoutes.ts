import { Router } from 'express';
import { resumeController } from '../controllers/resumeController';
import { protect } from '../middlewares/authMiddleware';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';

const router = Router();

/**
 * @route POST /api/resumes/upload
 * @description Uploads a candidate's resume (PDF only, max 5MB).
 * @access Private (Requires valid JWT)
 */
router.post(
    '/upload',
    protect, // Check if user is logged in
    uploadMiddleware.single('pdfFile'), // Intercept the file named 'pdfFile' in the form data
    resumeController.upload // Execute the upload logic
);

export default router;