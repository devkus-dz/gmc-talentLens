import { notificationRepository } from '../repositories/NotificationRepository';
import Resume from '../models/Resume';
import NotificationModel from '../models/Notification';
import { IJobOffer } from '../models/JobOffer';

/**
 * Service handling the generation and dispatching of system notifications.
 * @namespace notificationService
 */
export const notificationService = {
    /**
     * Creates a notification for a candidate when their Kanban status changes.
     * @param {string} candidateId - The ID of the candidate.
     * @param {string} jobTitle - The title of the job offer.
     * @param {string} newStatus - The new Kanban status.
     * @returns {Promise<void>}
     */
    async notifyStatusUpdate(candidateId: string, jobTitle: string, newStatus: string): Promise<void> {
        try {
            await notificationRepository.create({
                recipient: candidateId as any,
                type: 'STATUS_UPDATE',
                title: 'Application Status Updated',
                message: `Your application for "${jobTitle}" has been moved to: ${newStatus}.`,
                link: '/dashboard/candidate'
            });
        } catch (error) {
            console.error('Failed to create status notification:', error);
        }
    },

    /**
     * Finds candidates with matching tags/skills and sends them a notification for a new job.
     * Uses insertMany for optimized bulk database writing.
     * @param {IJobOffer} jobOffer - The newly created job offer document.
     * @returns {Promise<void>}
     */
    async notifyMatchingCandidates(jobOffer: IJobOffer): Promise<void> {
        try {
            const matchingResumes = await Resume.find({
                $or: [
                    { tags: { $in: jobOffer.tags } },
                    { skills: { $in: jobOffer.requiredSkills } }
                ]
            }).select('userId').lean();

            if (!matchingResumes || matchingResumes.length === 0) return;

            const uniqueUserIds = [...new Set(matchingResumes.map(r => r.userId.toString()))];

            const notifications = uniqueUserIds.map(userId => ({
                recipient: userId,
                type: 'NEW_JOB_MATCH',
                title: 'New Job Match!',
                message: `A new job "${jobOffer.title}" matches your skills and tags. Check it out!`,
                link: `/jobs/${jobOffer._id}`,
                isRead: false
            }));

            await NotificationModel.insertMany(notifications);
        } catch (error) {
            console.error('Failed to dispatch job match notifications:', error);
        }
    }
};