// src/middlewares/authMiddleware.ts
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
 * Middleware to protect routes by verifying the JWT.
 * Checks both Http-Only cookies (for the frontend) and Bearer tokens (for API clients like Bruno).
 * If valid, it attaches the user document to the request object.
 */
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token;

    // 1. Check for the token in Cookies (Standard Frontend approach)
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    // 2. Check for the token in the Authorization header (Bruno/Postman approach)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided.' });
        return;
    }

    try {
        // Decode the token to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        // Fetch the user from the database
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

/**
 * Middleware to restrict route access based on user roles.
 * Must be used AFTER the `protect` middleware.
 * * @param {...string[]} roles - The allowed roles (e.g., 'RECRUITER', 'ADMIN').
 */
export const restrictTo = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        // If there is no user, or the user's role is not in the allowed list, block them
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                message: 'Forbidden. You do not have permission to perform this action.'
            });
            return;
        }

        // If they pass the check, move to the next middleware/controller
        next();
    };
};