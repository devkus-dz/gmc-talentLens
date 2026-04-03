// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { userRepository } from '../repositories/UserRepository';
import { AuthRequest } from '../middlewares/authMiddleware';
import { emailService } from '../services/emailService';

/**
 * Generates a JSON Web Token for authenticated users.
 * @param {string} userId - The unique identifier of the user.
 * @returns {string} The signed JWT.
 */
const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
    });
};

/**
 * Controller handling authentication logic.
 * @namespace authController
 */
export const authController = {
    /**
     * Registers a new CANDIDATE user, hashes their password, and sets an HttpOnly JWT cookie.
     * Note: Recruiters and Admins MUST be provisioned by the system administrator.
     * * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async register(req: Request, res: Response): Promise<void> {
        try {
            const {
                email, password, role,
                firstName, lastName
            } = req.body;

            // 1. HARD SECURITY BLOCK: Only Candidates can use public registration.
            // (Company/Recruiter creation is strictly handled by Admin onboarding).
            if (role === 'RECRUITER' || role === 'ADMIN') {
                res.status(403).json({ message: 'Recruiter and Admin accounts must be provisioned by a system administrator.' });
                return;
            }

            const existingUser = await userRepository.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: 'User already exists with this email.' });
                return;
            }

            if (!firstName || !lastName) {
                res.status(400).json({ message: 'First and Last name are required for registration.' });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // Dynamically construct the payload. Role is forced to CANDIDATE.
            const userData: any = {
                email,
                passwordHash,
                role: 'CANDIDATE',
                firstName,
                lastName
            };

            const newUser = await userRepository.create(userData);
            const token = generateToken(newUser.id);

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(201).json({
                message: 'User registered successfully.',
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    role: newUser.role,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    profilePictureUrl: newUser.profilePictureUrl,
                    isLookingForJob: newUser.isLookingForJob,
                    savedJobs: newUser.savedJobs || [],
                },
            });
        } catch (error) {
            console.error('Registration Error:', error);
            res.status(500).json({ message: 'Internal server error during registration.' });
        }
    },

    /**
     * Authenticates a user, verifies credentials, and sets an HttpOnly JWT cookie.
     * Execution Steps:
     * 1. Finds the user by their email.
     * 2. Compares the provided password against the stored bcrypt hash.
     * 3. Generates a new JWT and attaches it to the response as an HttpOnly cookie.
     * 4. Returns the sanitized user profile (including role-specific data) to the client.
     * * @param {Request} req - The Express request object containing email and password.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const user = await userRepository.findOne({ email });
            if (!user) {
                res.status(401).json({ message: 'Invalid email or password.' });
                return;
            }

            if (user.isActive === false) {
                res.status(403).json({ message: 'This account has been deactivated. Please contact support.' });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);

            if (!isMatch) {
                res.status(401).json({ message: 'Invalid email or password.' });
                return;
            }

            const token = generateToken(user.id);

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                message: 'Login successful.',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePictureUrl: user.profilePictureUrl,
                    isLookingForJob: user.isLookingForJob,
                    savedJobs: user.savedJobs || [],
                    companyId: user.companyId || null // Ensure we pass the company linkage to the frontend
                },
            });
        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({ message: 'Internal server error during login.' });
        }
    },

    /**
     * Logs out the user by clearing the JWT Http-Only cookie.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {void}
     */
    logout(req: Request, res: Response): void {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0),
        });

        res.status(200).json({ message: 'Logged out successfully.' });
    },

    /**
     * Returns the currently authenticated user's data (Profile check).
     * Execution Steps:
     * 1. Checks if the `req.user` object was successfully populated by the authMiddleware.
     * 2. Returns the complete sanitized user profile to restore frontend state on page reload.
     * * @param {AuthRequest} req - The extended Express request object containing the user.
     * @param {Response} res - The Express response object.
     * @returns {void}
     */
    getMe(req: AuthRequest, res: Response): void {
        if (!req.user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        res.status(200).json({
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                profilePictureUrl: req.user.profilePictureUrl,
                isLookingForJob: req.user.isLookingForJob,
                savedJobs: req.user.savedJobs || [],
                companyId: req.user.companyId || null,
            }
        });
    },

    /**
     * Initiates the password recovery flow by generating a secure token and emailing it.
     * @param {Request} req - The Express request object containing the user's email.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const user = await userRepository.findOne({ email });

            if (!user) {
                res.status(404).json({ message: 'No user found with that email address.' });
                return;
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

            await userRepository.update(user.id, {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: Date.now() + 3600000 // 1 Hour
            });

            const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;

            await emailService.sendPasswordResetEmail(user.email, resetUrl);

            res.status(200).json({ message: 'Password reset link sent to your email.' });
        } catch (error) {
            console.error('Forgot Password Error:', error);
            res.status(500).json({ message: 'Internal server error during password reset request.' });
        }
    },

    /**
     * Validates the reset token and updates the user's password.
     * @param {Request} req - The Express request object containing the token (params) and new password (body).
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;

            const hashedToken = crypto.createHash('sha256').update(token as string).digest('hex');

            const user = await userRepository.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                res.status(400).json({ message: 'Invalid or expired password reset token.' });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(newPassword, salt);

            await userRepository.update(user.id, {
                passwordHash: passwordHash,
                $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 } // Clears the fields
            });

            res.status(200).json({ message: 'Password has been successfully reset. You can now log in.' });
        } catch (error) {
            console.error('Reset Password Error:', error);
            res.status(500).json({ message: 'Internal server error during password reset.' });
        }
    },
};