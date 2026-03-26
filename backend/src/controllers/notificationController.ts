import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { notificationRepository } from '../repositories/NotificationRepository';
import NotificationModel from '../models/Notification';

/**
 * Controller handling user notification retrieval and management.
 * @namespace notificationController
 */
export const notificationController = {
    /**
     * Retrieves a paginated list of notifications for the authenticated user.
     * @param {AuthRequest} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async getMyNotifications(req: AuthRequest, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const userId = req.user?.id;

            const result = await notificationRepository.findPaginated(
                { recipient: userId },
                page,
                limit,
                { createdAt: -1 }
            );

            const unreadCount = await NotificationModel.countDocuments({ recipient: userId, isRead: false });

            res.status(200).json({
                ...result,
                unreadCount
            });
        } catch (error) {
            console.error('Fetch Notifications Error:', error);
            res.status(500).json({ message: 'Internal server error while fetching notifications.' });
        }
    },

    /**
         * Marks a specific notification as read.
         * @param {AuthRequest} req - The Express request object containing the notification ID.
         * @param {Response} res - The Express response object.
         * @returns {Promise<void>}
         */
    async markAsRead(req: AuthRequest, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;

            const updated = await notificationRepository.update(id, { isRead: true });

            if (!updated) {
                res.status(404).json({ message: 'Notification not found.' });
                return;
            }

            res.status(200).json({ message: 'Notification marked as read.', notification: updated });
        } catch (error) {
            console.error('Mark Notification Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    },

    /**
     * Marks all unread notifications for the authenticated user as read.
     * @param {AuthRequest} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            await NotificationModel.updateMany({ recipient: userId, isRead: false }, { isRead: true });

            res.status(200).json({ message: 'All notifications marked as read.' });
        } catch (error) {
            console.error('Mark All Notifications Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
};