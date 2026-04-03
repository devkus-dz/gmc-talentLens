// src/routes/userRoutes.ts
import { Router } from 'express';
import { userController } from '../controllers/userContoller';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';

const router = Router();

// ==========================================
// 1. SELF-SERVICE ROUTES (Must go first)
// ==========================================

// Get the full list of saved job details (Candidate)
router.get('/saved-jobs', protect, userController.getSavedJobs);

// Toggle saving or unsaving a job offer (Candidate)
router.patch('/saved-jobs/:jobId', protect, userController.toggleSavedJob);

// Update own profile (Candidate & Recruiter)
router.patch('/profile', protect, userController.updateProfile);

// Toggle the 'Open to Work' status (Candidate)
router.patch('/status', protect, userController.toggleJobStatus);

// Upload a profile picture
router.put(
    '/profile-picture',
    protect,
    uploadMiddleware.single('profilePicture'),
    userController.uploadProfilePicture
);


// ==========================================
// 2. ADMIN ROUTES (Managing other users)
// ==========================================

// Get all users (paginated)
router.get('/', protect, restrictTo('ADMIN'), userController.getAllUsers);

// Get a single user by ID
router.get('/:id', protect, restrictTo('ADMIN'), userController.getUserById);

// Admin updates a user's basic information/role
router.patch('/:id', protect, restrictTo('ADMIN'), userController.updateUser);

// Activate or deactivate a user account (Ban/Unban)
router.patch('/:id/toggle-active', protect, restrictTo('ADMIN'), userController.toggleUserStatus);

// Permanently delete a user
router.delete('/:id', protect, restrictTo('ADMIN'), userController.delete);

export default router;