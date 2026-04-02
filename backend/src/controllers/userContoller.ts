import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import User, { IUser } from '../models/User';
import { s3Service } from '../services/s3Service';
import { userRepository } from '../repositories/UserRepository';
import { BaseController } from './BaseController';

/**
 * Controller handling user profile updates and interactions.
 * Inherits standard CRUD from BaseController.
 */
class UserController extends BaseController<IUser> {
    constructor() {
        super(userRepository);
    }

    // ==========================================
    // OVERRIDDEN CRUD METHODS (Security Filters)
    // ==========================================

    getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const role = req.query.role as string;

            const filter: any = {};
            if (role) filter.role = role.toUpperCase();

            const result = await this.repository.findPaginated(filter, page, limit, { createdAt: -1 });

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

    updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const updateData = { ...req.body };
            delete updateData.passwordHash;
            delete updateData.role;

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

    getSavedJobs = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const user = await User.findById(req.user?.id)
                .populate({
                    path: 'savedJobs',
                    select: '-applicants'
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
                user.savedJobs.splice(jobIndex, 1);
            } else {
                user.savedJobs.push(jobId as any);
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
                { returnDocument: 'after' }
            ).select('-passwordHash');

            res.status(200).json({ message: 'Job search status updated.', user: updatedUser });
        } catch (error) {
            console.error('Job Status Update Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };

    /**
         * Uploads and updates a user's profile picture.
         * Automatically deletes the previous image from RustFS to optimize storage.
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

            // --- 1. CLEANUP PHASE: Delete the old image from S3 ---
            const user = await this.repository.findById(req.user.id);
            if (user && user.profilePictureUrl) {
                // The URL looks like: http://localhost:9000/talentlens-storage/profile-images/filename.jpg
                // We use a regex to safely extract exactly "profile-images/filename.jpg"
                const match = user.profilePictureUrl.match(/(profile-images\/[^?]+)/);
                if (match && match[1]) {
                    await s3Service.deleteFile(match[1]);
                }
            }

            // --- 2. UPLOAD NEW IMAGE ---
            const fileKey = await s3Service.uploadProfileImage(
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype
            );

            // Construct the clean public URL
            const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000';
            const bucket = process.env.S3_BUCKET_NAME || 'talentlens-storage';
            const publicUrl = `${endpoint}/${bucket}/${fileKey}`;

            // Save the new public URL to the database
            await this.repository.update(req.user.id, { profilePictureUrl: publicUrl });

            res.status(200).json({
                message: 'Profile picture uploaded successfully!',
                profilePictureUrl: publicUrl
            });
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ message: 'An internal error occurred during upload.' });
        }
    };

    /**
     * UPDATED: Removed Presigned URL logic. Now just returns the DB document.
     */
    getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const user = await User.findById(req.user?.id).select('-passwordHash');

            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            res.status(200).json(user.toObject());
        } catch (error) {
            console.error('Fetch Profile Error:', error);
            res.status(500).json({ message: 'Failed to retrieve user profile.' });
        }
    };
}

export const userController = new UserController();