// src/routes/resumeRoutes.ts
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
    protect, // 1. Check if user is logged in
    uploadMiddleware.single('pdfFile'), // 2. Intercept the file named 'pdfFile' in the form data
    resumeController.upload // 3. Execute the upload logic
);

export default router;