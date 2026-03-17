// src/models/JobOffer.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IJobOffer extends Document {
    title: string;
    description: string;
    minYearsOfExperience: number;
    requiredSkills: string[];
    tags: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const JobOfferSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        minYearsOfExperience: { type: Number, default: 0 },
        requiredSkills: { type: [String], default: [] },
        tags: { type: [String], default: [] },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IJobOffer>('JobOffer', JobOfferSchema);