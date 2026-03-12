import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/UserRepository';
import { AuthRequest } from '../middlewares/authMiddleware';

/**
 * Generates a JSON Web Token for authenticated users.
 * * @param {string} userId - The unique identifier of the user.
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
     * Registers a new user, hashes their password, and sets an HttpOnly JWT cookie.
     * * @param {Request} req - The Express request object containing user details in the body.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, firstName, lastName, role } = req.body;

            const existingUser = await userRepository.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: 'User already exists with this email.' });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser = await userRepository.create({
                email,
                passwordHash,
                firstName,
                lastName,
                role: role || 'CANDIDATE',
            });

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
                },
            });
        } catch (error) {
            console.error('Registration Error:', error);
            res.status(500).json({ message: 'Internal server error during registration.' });
        }
    },

    /**
     * Authenticates a user, verifies credentials, and sets an HttpOnly JWT cookie.
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
                },
            });
        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({ message: 'Internal server error during login.' });
        }
    },

    /**
    * Logs out the user by clearing the JWT Http-Only cookie.
    * * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @returns {void}
    */
    logout(req: Request, res: Response): void {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0), // Set expiration date to the past to delete it
        });

        res.status(200).json({ message: 'Logged out successfully.' });
    },

    /**
     * Returns the currently authenticated user's data (Profile check).
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
            }
        });
    },
};