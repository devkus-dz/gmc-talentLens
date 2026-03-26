import mongoose, { Schema, Document } from 'mongoose';

/**
 * @interface INotification
 * Represents a system notification for a user.
 */
export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    type: 'STATUS_UPDATE' | 'NEW_JOB_MATCH' | 'SYSTEM';
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
    {
        recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: {
            type: String,
            enum: ['STATUS_UPDATE', 'NEW_JOB_MATCH', 'SYSTEM'],
            required: true
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        link: { type: String, default: null },
        isRead: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);