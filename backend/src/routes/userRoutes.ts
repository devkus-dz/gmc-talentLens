// src/routes/userRoutes.ts
import { Router } from 'express';
import { userController } from '../controllers/userContoller';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';

const router = Router();

// ==========================================
// 1. STATIC & SPECIFIC ROUTES (Must go first)
// ==========================================

/**
 * @route GET /api/users
 * @description Get all users for the Admin panel (paginated)
 * @access Private (ADMIN)
 */
router.get('/', protect, restrictTo('ADMIN'), userController.getAllUsers);

/**
 * @route GET /api/users/saved-jobs
 * @description Get the full job details for all saved jobs
 * @access Private (Candidate)
 */
router.get('/saved-jobs', protect, userController.getSavedJobs);

/**
 * Uploads a profile picture or company logo (JPEG/PNG/WEBP).
 * @name PUT /profile-picture
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
 * @name PATCH /status
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
 * @name PATCH /saved-jobs/:jobId
 * @function
 * @memberof module:routers/users
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Auth protection middleware
 * @param {callback} middleware - Controller logic
 */
router.patch('/saved-jobs/:jobId', protect, userController.toggleSavedJob);


// ==========================================
// 2. DYNAMIC ID ROUTES (Must go last)
// ==========================================

/**
 * @route GET /api/users/:id
 * @description Get a single user by ID
 * @access Private (ADMIN)
 */
router.get('/:id', protect, restrictTo('ADMIN'), userController.getUserById);

/**
 * @route PATCH /api/users/:id
 * @description Update a user's basic information
 * @access Private (ADMIN)
 */
router.patch('/:id', protect, restrictTo('ADMIN'), userController.updateUser);

/**
 * @route DELETE /api/users/:id
 * @description Permanently delete a user from the database
 * @access Private (ADMIN)
 */
router.delete('/:id', protect, restrictTo('ADMIN'), userController.delete);

/**
 * @route PATCH /api/users/:id/toggle-active
 * @description Activate or deactivate a user account
 * @access Private (ADMIN)
 */
router.patch('/:id/toggle-active', protect, restrictTo('ADMIN'), userController.toggleUserStatus);


export default router;