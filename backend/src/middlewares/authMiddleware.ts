import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/UserRepository';
import { IUser } from '../models/User';

/**
 * Extended Express Request interface to include the authenticated user.
 * @interface AuthRequest
 */
export interface AuthRequest extends Request {
    user?: IUser;
}

/**
 * Middleware to protect routes by verifying the JWT Http-Only cookie.
 * If valid, it attaches the user document to the request object.
 * * @param {AuthRequest} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token = req.cookies.jwt;

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided.' });
        return;
    }

    try {
        // Decode the token to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        // Fetch the user from the database, excluding the password hash
        const user = await userRepository.findById(decoded.id);

        if (!user) {
            res.status(401).json({ message: 'Not authorized, user not found.' });
            return;
        }

        // Attach user to the request object
        req.user = user;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        res.status(401).json({ message: 'Not authorized, token failed.' });
    }
};