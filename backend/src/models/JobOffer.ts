// src/models/JobOffer.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicant {
    candidate: mongoose.Types.ObjectId;
    status: 'Applied' | 'In Review' | 'Interview' | 'Offered' | 'Rejected';
    appliedAt: Date;
}

export interface IJobOffer extends Document {
    title: string;
    description: string;
    minYearsOfExperience: number;
    requiredSkills: string[];
    tags: string[];
    applicants: IApplicant[];
    createdBy: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ApplicantSchema = new Schema<IApplicant>({
    candidate: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['Applied', 'In Review', 'Interview', 'Offered', 'Rejected'],
        default: 'Applied'
    },
    appliedAt: { type: Date, default: Date.now }
}, { _id: true });

const JobOfferSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        minYearsOfExperience: { type: Number, default: 0 },
        requiredSkills: { type: [String], default: [] },
        tags: { type: [String], default: [] },
        applicants: { type: [ApplicantSchema], default: [] },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IJobOffer>('JobOffer', JobOfferSchema);