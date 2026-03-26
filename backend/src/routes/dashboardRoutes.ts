// src/routes/dashboardRoutes.ts
import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route GET /api/dashboard/candidate
 * @description Get chart data for the Candidate dashboard
 * @access Private (CANDIDATE)
 */
router.get('/candidate', protect, restrictTo('CANDIDATE'), dashboardController.getCandidateStats);

/**
 * @route GET /api/dashboard/recruiter
 * @description Get chart data for the Recruiter dashboard
 * @access Private (RECRUITER)
 */
router.get('/recruiter', protect, restrictTo('RECRUITER'), dashboardController.getRecruiterStats);

/**
 * @route GET /api/dashboard/admin
 * @description Get platform-wide chart data for the Admin dashboard
 * @access Private (ADMIN)
 */
router.get('/admin', protect, restrictTo('ADMIN'), dashboardController.getAdminStats);

export default router;