import { Router } from 'express';
import { authController } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route POST /api/auth/register
 * @description Registers a new candidate, recruiter, or admin.
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @description Authenticates a user and returns an HttpOnly cookie.
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route POST /api/auth/login
 * @description Authenticates a user and returns an HttpOnly cookie.
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route POST /api/auth/logout
 * @description Clears the HttpOnly cookie to log the user out.
 * @access Public
 */
router.post('/logout', authController.logout);

/**
 * @route GET /api/auth/me
 * @description Verifies the cookie and returns the current user's profile.
 * @access Private (Requires valid JWT)
 */
// Notice how we inject the 'protect' middleware before the controller method
router.get('/me', protect, authController.getMe);

/**
 * @route POST /api/auth/forgot-password
 * @description Generates a password reset token and sends an email.
 * @access Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route PATCH /api/auth/reset-password/:token
 * @description Resets the password using the provided secure token.
 * @access Public
 */
router.patch('/reset-password/:token', authController.resetPassword);


export default router;