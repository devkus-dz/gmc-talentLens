import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { clearGlobalCache, clearUserCache } from '../middlewares/cacheMiddleware';
import User from '../models/User';
import Company from '../models/Company';
import { s3Service } from '../services/s3Service';
import bcrypt from 'bcryptjs';
import JobOffer from '../models/JobOffer';

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
            // Explicitly grabbing phone from req.body
            const { firstName, lastName, phone, companyName, website, companyDescription, industry, location } = req.body;

            // Updating the user model including the phone field
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

            // Clear the global cache !
            clearGlobalCache();

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

            // Clear the global cache !
            clearGlobalCache();

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

            // Clear the global cache !
            clearGlobalCache();

            res.status(200).json({ message: 'Job search status updated', isLookingForJob: user.isLookingForJob });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update job status' });
        }
    };

    // ==========================================
    // ADMIN ROUTES (Managing other users)
    // ==========================================

    /**
     * @route GET /api/users
     * @description Fetches all users, with optional searching, role, and job status filtering.
     */
    getAllUsers = async (req: AuthRequest | any, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const search = req.query.search as string;
            const role = req.query.role as string;
            const isLookingForJob = req.query.isLookingForJob as string;

            const query: any = {};

            // --- SECURITY DATA SCOPING: RECRUITER ISOLATION ---
            if (req.user?.role === 'RECRUITER') {
                // 1. Find all jobs owned by this recruiter
                const myJobs = await JobOffer.find({ createdBy: req.user.id }).select('applicants.candidate');
                // 2. Extract every single candidate ID that has applied to them
                const candidateIds = myJobs.flatMap(job => job.applicants.map(app => app.candidate));

                // 3. Force the search to ONLY look at those specific candidates
                query._id = { $in: candidateIds };
                query.role = 'CANDIDATE';
            } else if (role) {
                query.role = role.toUpperCase();
            }

            if (isLookingForJob !== undefined) {
                query.isLookingForJob = isLookingForJob === 'true';
            }

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

    getUserById = async (req: AuthRequest | any, res: Response): Promise<void> => {
        try {
            const user = await User.findById(req.params.id).select('-passwordHash').populate('companyId');
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // --- SECURITY DATA SCOPING ---
            // If a recruiter tries to view a profile directly via URL, ensure they applied to them!
            if (req.user?.role === 'RECRUITER' && user.role === 'CANDIDATE') {
                const hasApplied = await JobOffer.exists({
                    createdBy: req.user.id,
                    'applicants.candidate': user._id
                });

                if (!hasApplied) {
                    res.status(403).json({ message: 'Forbidden. This candidate has not applied to any of your jobs.' });
                    return;
                }
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

    updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user?.id;

            if (!currentPassword || !newPassword) {
                res.status(400).json({ message: 'Please provide both current and new passwords.' });
                return;
            }

            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
            if (!isMatch) {
                res.status(400).json({ message: 'Incorrect current password.' });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(newPassword, salt);
            await user.save();

            res.status(200).json({ message: 'Password updated successfully.' });
        } catch (error) {
            console.error('Update Password Error:', error);
            res.status(500).json({ message: 'Internal server error while updating password.' });
        }
    };
}

export const userController = new UserController();