// src/routes/userRoutes.ts
import { Router } from 'express';
import { userController } from '../controllers/userContoller';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';

const router = Router();


/**
 * @route GET /api/users
 * @description Get all users for the Admin panel (paginated)
 * @access Private (ADMIN)
 */
router.get('/', protect, restrictTo('ADMIN'), userController.getAllUsers);

/**
 * Uploads a profile picture or company logo (JPEG/PNG/WEBP).
 * * @name PUT /profile-picture
 * @function
 * @memberof module:routers/users
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Auth protection middleware
 * @param {callback} middleware - Multer file parsing middleware
 * @param {callback} middleware - Controller logic
 */
router.put(
    '/profile-picture',
    protect,                                   // Authenticate user
    uploadMiddleware.single('profilePicture'), // Parse the file into RAM
    userController.uploadProfilePicture        // Send to S3
);

/**
 * Updates the 'Open to Work' status for candidates.
 * * @name PATCH /status
 * @function
 * @memberof module:routers/users
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Auth protection middleware
 * @param {callback} middleware - Controller logic
 */
router.patch('/status', protect, userController.toggleJobStatus);

/**
 * Toggles saving or unsaving a job offer.
 * * @name PATCH /saved-jobs/:jobId
 * @function
 * @memberof module:routers/users
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Auth protection middleware
 * @param {callback} middleware - Controller logic
 */
router.patch('/saved-jobs/:jobId', protect, userController.toggleSavedJob);

/**
 * @route GET /api/users/saved-jobs
 * @description Get the full job details for all saved jobs
 * @access Private (Candidate)
 */
router.get('/saved-jobs', protect, userController.getSavedJobs);

export default router;