import { BaseRepository } from './BaseRepository';
import NotificationModel, { INotification } from '../models/Notification';

/**
 * Repository handling database operations for Notifications.
 * Inherits all standard CRUD and pagination operations from BaseRepository.
 * @class NotificationRepository
 * @extends {BaseRepository<INotification>}
 */
class NotificationRepository extends BaseRepository<INotification> {
    constructor() {
        super(NotificationModel);
    }
}

export const notificationRepository = new NotificationRepository();