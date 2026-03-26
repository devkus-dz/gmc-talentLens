// src/controllers/userController.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import User from '../models/User';
import { s3Service } from '../services/s3Service';
import { userRepository } from '../repositories/UserRepository';

/**
 * Controller handling user profile updates and interactions.
 * @namespace userController
 */
export const userController = {
    /**
     * Uploads and updates a user's profile picture or company logo.
     * * Execution Steps:
     * 1. Validates the existence of the image file in the request.
     * 2. Uploads the image buffer to the S3 bucket using the S3 service.
     * 3. Retrieves the permanent file key for the image.
     * 4. Updates the User document in MongoDB with the new key.
     * * @param {AuthRequest} req - The Express request object containing the file and authenticated user.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async uploadProfilePicture(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No image file provided.' });
                return;
            }

            // Guard clause to ensure the user is authenticated
            if (!req.user || !req.user.id) {
                res.status(401).json({ message: 'Unauthorized. User ID missing.' });
                return;
            }

            const fileKey = await s3Service.uploadProfileImage(
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype
            );

            const userId = req.user.id;
            await User.findByIdAndUpdate(userId, { profilePictureKey: fileKey });

            res.status(200).json({
                message: 'Profile picture uploaded successfully!',
                fileKey: fileKey
            });

        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ message: 'An internal error occurred during upload.' });
        }
    },

    /**
     * Toggles the candidate's 'Open to Work' status.
     * * Execution Steps:
     * 1. Extracts the boolean status from the request body.
     * 2. Updates the `isLookingForJob` field for the authenticated user.
     * 3. Returns the updated user profile without the password hash.
     * * @param {AuthRequest} req - The Express request object containing the new status.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async toggleJobStatus(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { isLookingForJob } = req.body;

            if (typeof isLookingForJob !== 'boolean') {
                res.status(400).json({ message: 'Invalid status provided. Must be a boolean.' });
                return;
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.user?.id,
                { isLookingForJob },
                { new: true }
            ).select('-passwordHash');

            res.status(200).json({ message: 'Job search status updated.', user: updatedUser });
        } catch (error) {
            console.error('Job Status Update Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    },

    /**
     * Adds or removes a Job Offer ID from the user's saved jobs array.
     * * Execution Steps:
     * 1. Finds the authenticated user in the database.
     * 2. Initializes the `savedJobs` array if dealing with a legacy user document.
     * 3. Checks if the provided Job ID already exists in the array.
     * 4. If it exists, removes it (unsave). If it doesn't exist, adds it (save).
     * 5. Persists the changes to MongoDB and returns the updated array.
     * * @param {AuthRequest} req - The Express request object containing the job ID in params.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async toggleSavedJob(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { jobId } = req.params;
            const user = await User.findById(req.user?.id);

            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            if (!user.savedJobs) {
                user.savedJobs = [];
            }

            const jobIndex = user.savedJobs.indexOf(jobId as any);

            if (jobIndex > -1) {
                user.savedJobs.splice(jobIndex, 1); // Unsave
            } else {
                user.savedJobs.push(jobId as any); // Save
            }

            await user.save();

            res.status(200).json({
                message: jobIndex > -1 ? 'Job removed from saved list.' : 'Job saved successfully.',
                savedJobs: user.savedJobs
            });
        } catch (error) {
            console.error('Saved Job Toggle Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    },

    /**
     * Retrieves the authenticated user's profile and generates pre-signed URLs for their files.
     * @param {AuthRequest} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async getUserProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            // Fetch the user without exposing the password hash
            const user = await User.findById(req.user?.id).select('-passwordHash');

            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            // Convert the Mongoose document to a plain JS object
            const userProfile = user.toObject();

            // Generate a pre-signed URL if the user has a profile picture
            if (userProfile.profilePictureUrl) {
                userProfile.profilePictureUrl = await s3Service.getPresignedUrl(
                    userProfile.profilePictureUrl,
                    3600 // URL valid for 1 hour
                );
            }

            res.status(200).json(userProfile);
        } catch (error) {
            console.error('Fetch Profile Error:', error);
            res.status(500).json({ message: 'Failed to retrieve user profile.' });
        }
    },

    /**
     * Retrieves a paginated list of all users.
     * @access Private (ADMIN only)
     * * @param {AuthRequest} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const role = req.query.role as string; // Optional: filter by role

            const filter: any = {};
            if (role) {
                filter.role = role.toUpperCase();
            }

            // We use the new BaseRepository method via userRepository!
            const result = await userRepository.findPaginated(
                filter,
                page,
                limit,
                { createdAt: -1 }, // Sort newest first
                // don't populate anything heavy here to keep the admin list fast
            );

            // Strip passwordHashes from the result before sending to frontend
            const safeData = result.data.map(user => {
                const userObj = user.toObject();
                delete userObj.passwordHash;
                return userObj;
            });

            res.status(200).json({
                ...result,
                data: safeData // Replace the data array with the safe version
            });
        } catch (error) {
            console.error('Fetch Users Error:', error);
            res.status(500).json({ message: 'Internal server error while fetching users.' });
        }
    },

    /**
     * Retrieves the full details of all job offers the candidate has saved.
     * @access Private (Candidate)
     */
    async getSavedJobs(req: AuthRequest, res: Response): Promise<void> {
        try {
            // Fetch the user and populate the savedJobs array
            const user = await User.findById(req.user?.id)
                .populate({
                    path: 'savedJobs',
                    select: '-applicants' // Don't send other people's application data to the candidate!
                })
                .lean();

            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            res.status(200).json({
                totalSaved: user.savedJobs?.length || 0,
                savedJobs: user.savedJobs || []
            });
        } catch (error) {
            console.error('Fetch Saved Jobs Error:', error);
            res.status(500).json({ message: 'Internal server error while fetching saved jobs.' });
        }
    },
};