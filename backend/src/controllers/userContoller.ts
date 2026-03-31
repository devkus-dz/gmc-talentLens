import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import User, { IUser } from '../models/User';
import { s3Service } from '../services/s3Service';
import { userRepository } from '../repositories/UserRepository';
import { BaseController } from './BaseController'; // <-- Import the new BaseController

/**
 * Controller handling user profile updates and interactions.
 * Inherits standard CRUD from BaseController.
 * @class UserController
 * @extends {BaseController<IUser>}
 */
class UserController extends BaseController<IUser> {
    deleteUser(arg0: string, protect: (req: AuthRequest, res: Response<any, Record<string, any>>, next: import("express").NextFunction) => Promise<void>, arg2: (req: AuthRequest, res: Response<any, Record<string, any>>, next: import("express").NextFunction) => void, deleteUser: any) {
        throw new Error('Method not implemented.');
    }
    constructor() {
        super(userRepository); // Pass the UserRepository to the BaseController
    }

    // ==========================================
    // OVERRIDDEN CRUD METHODS (Security Filters)
    // ==========================================

    /**
     * Retrieves a paginated list of all users.
     * Overridden to strip passwords and handle role filtering.
     */
    getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const role = req.query.role as string;

            const filter: any = {};
            if (role) filter.role = role.toUpperCase();

            const result = await this.repository.findPaginated(filter, page, limit, { createdAt: -1 });

            // Strip passwords
            const safeData = result.data.map(user => {
                const userObj = user.toObject();
                delete userObj.passwordHash;
                return userObj;
            });

            res.status(200).json({ ...result, data: safeData });
        } catch (error) {
            console.error('Fetch Users Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };

    /**
     * Retrieves a single user by ID.
     * Overridden to strip the password hash.
     */
    getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const user = await this.repository.findById(id as string);

            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            const userObj = user.toObject();
            delete userObj.passwordHash;

            res.status(200).json(userObj);
        } catch (error) {
            console.error('Get User By ID Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };

    /**
     * Updates a user's basic information (Admin override).
     * Overridden to prevent accidental password or role updates.
     */
    updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const updateData = { ...req.body };
            delete updateData.passwordHash; // Protect password
            delete updateData.role;         // Protect role

            const updatedUser = await this.repository.update(id as string, updateData);

            if (!updatedUser) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            const userObj = updatedUser.toObject();
            delete userObj.passwordHash;

            res.status(200).json({ message: 'User updated successfully.', user: userObj });
        } catch (error) {
            console.error('Update User Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };

    // ==========================================
    // CUSTOM METHODS (Specific to User Logic)
    // ==========================================

    /**
     * Toggles a user's active status (Activate / Deactivate).
     */
    toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const user = await this.repository.findById(id as string);

            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            const newStatus = !user.isActive;
            await this.repository.update(id as string, { isActive: newStatus });

            res.status(200).json({ message: newStatus ? 'User activated.' : 'User deactivated.', isActive: newStatus });
        } catch (error) {
            console.error('Toggle Status Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };

    // ==========================================
    // CANDIDATE METHODS (Restored Logic)
    // ==========================================

    /**
     * Retrieves the full details of all job offers the candidate has saved.
     */
    getSavedJobs = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            // We use the raw User model here because we need Mongoose's powerful .populate()
            const user = await User.findById(req.user?.id)
                .populate({
                    path: 'savedJobs',
                    select: '-applicants' // Hide other applicants' data
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
    };

    /**
     * Toggles saving or unsaving a job offer.
     */
    toggleSavedJob = async (req: AuthRequest, res: Response): Promise<void> => {
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
    };

    /**
     * Toggles the candidate's 'Open to Work' status.
     */
    toggleJobStatus = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { isLookingForJob } = req.body;

            if (typeof isLookingForJob !== 'boolean') {
                res.status(400).json({ message: 'Invalid status provided. Must be a boolean.' });
                return;
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.user?.id,
                { isLookingForJob },
                { returnDocument: 'after' } // Updated to use modern Mongoose syntax
            ).select('-passwordHash');

            res.status(200).json({ message: 'Job search status updated.', user: updatedUser });
        } catch (error) {
            console.error('Job Status Update Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };

    /**
     * Uploads and updates a user's profile picture.
     */
    uploadProfilePicture = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No image file provided.' });
                return;
            }

            if (!req.user || !req.user.id) {
                res.status(401).json({ message: 'Unauthorized. User ID missing.' });
                return;
            }

            const fileKey = await s3Service.uploadProfileImage(
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype
            );

            await this.repository.update(req.user.id, { profilePictureUrl: fileKey });

            res.status(200).json({
                message: 'Profile picture uploaded successfully!',
                fileKey: fileKey
            });
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ message: 'An internal error occurred during upload.' });
        }
    };

    /**
     * Retrieves the authenticated user's profile.
     */
    getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const user = await User.findById(req.user?.id).select('-passwordHash');

            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            const userProfile = user.toObject();

            if (userProfile.profilePictureUrl) {
                userProfile.profilePictureUrl = await s3Service.getPresignedUrl(
                    userProfile.profilePictureUrl,
                    3600
                );
            }

            res.status(200).json(userProfile);
        } catch (error) {
            console.error('Fetch Profile Error:', error);
            res.status(500).json({ message: 'Failed to retrieve user profile.' });
        }
    };
}

// Export a single instantiated instance of the class
export const userController = new UserController();