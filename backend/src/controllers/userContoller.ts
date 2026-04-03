import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import User from '../models/User';
import Company from '../models/Company';
import { s3Service } from '../services/s3Service';

class UserController {

    /**
     * Get current logged-in user profile
     */
    getMe = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const user = await User.findById(req.user?.id).select('-password').populate('companyId');
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    /**
     * Update user profile & linked company
     */
    updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const { firstName, lastName, phone, companyName, website, companyDescription, industry, location } = req.body;

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { firstName, lastName, phone },
                { new: true, runValidators: true }
            ).select('-password');

            if (!updatedUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            if (updatedUser.role === 'RECRUITER' && updatedUser.companyId) {
                const companyUpdates: any = {};
                if (companyName) companyUpdates.name = companyName;
                if (website) companyUpdates.website = website;
                if (companyDescription) companyUpdates.description = companyDescription;
                if (industry) companyUpdates.industry = industry;
                if (location) companyUpdates.location = location;

                if (Object.keys(companyUpdates).length > 0) {
                    await Company.findByIdAndUpdate(updatedUser.companyId, companyUpdates);
                }
            }

            const finalUser = await User.findById(userId).select('-password').populate('companyId');
            res.status(200).json({ message: 'Profile updated successfully', user: finalUser });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error while updating profile.' });
        }
    };

    uploadProfilePicture = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.file || !req.user?.id) {
                res.status(400).json({ message: 'No image file provided.' });
                return;
            }

            const user = await User.findById(req.user.id);
            if (user && user.profilePictureUrl) {
                const match = user.profilePictureUrl.match(/(profile-images\/[^?]+)/);
                if (match && match[1]) await s3Service.deleteFile(match[1]);
            }

            const fileKey = await s3Service.uploadProfileImage(req.file.buffer, req.file.originalname, req.file.mimetype);
            const publicUrl = `${process.env.S3_ENDPOINT || 'http://localhost:9000'}/${process.env.S3_BUCKET_NAME || 'talentlens-storage'}/${fileKey}`;

            await User.findByIdAndUpdate(req.user.id, { profilePictureUrl: publicUrl });

            res.status(200).json({ message: 'Profile picture uploaded successfully!', profilePictureUrl: publicUrl });
        } catch (error) {
            res.status(500).json({ message: 'An internal error occurred during upload.' });
        }
    };

    toggleSavedJob = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { jobId } = req.params;
            const user = await User.findById(req.user?.id);

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const isSaved = user.savedJobs?.includes(jobId as any);
            if (isSaved) {
                user.savedJobs = user.savedJobs?.filter((id) => id.toString() !== jobId) as any;
            } else {
                user.savedJobs?.push(jobId as any);
            }

            await user.save();
            res.status(200).json({ message: isSaved ? 'Job removed from saved list' : 'Job saved successfully', savedJobs: user.savedJobs });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update saved jobs' });
        }
    };

    getSavedJobs = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const user = await User.findById(req.user?.id).populate('savedJobs');
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({ data: user.savedJobs });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch saved jobs' });
        }
    };

    toggleJobStatus = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const user = await User.findById(req.user?.id);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            user.isLookingForJob = !user.isLookingForJob;
            await user.save();
            res.status(200).json({ message: 'Job search status updated', isLookingForJob: user.isLookingForJob });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update job status' });
        }
    };

    // ==========================================
    // 2. ADMIN ROUTES (Managing other users)
    // ==========================================

    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const search = req.query.search as string;
            const query: any = {};
            if (search) {
                query.$or = [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            const users = await User.find(query)
                .select('-passwordHash')
                .populate('companyId')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await User.countDocuments(query);

            res.status(200).json({ data: users, total, page, totalPages: Math.ceil(total / limit) });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch users' });
        }
    };

    getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await User.findById(req.params.id).select('-passwordHash').populate('companyId');
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({ data: user });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch user' });
        }
    };

    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-passwordHash');
            if (!updatedUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({ message: 'User updated successfully', data: updatedUser });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update user' });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete user' });
        }
    };

    toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            user.isActive = !user.isActive;
            await user.save();
            res.status(200).json({ message: `User account ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
        } catch (error) {
            res.status(500).json({ message: 'Failed to toggle user status' });
        }
    };
}

export const userController = new UserController();