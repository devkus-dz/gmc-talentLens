// src/models/Resume.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience {
    company: string | null;
    position: string | null;
    startDate: string | null;
    endDate: string | null;
    description: string | null;
}

export interface IEducation {
    institution: string | null;
    degree: string | null;
    startDate: string | null;
    endDate: string | null;
}

export interface IResume extends Document {
    id: any;
    userId: mongoose.Types.ObjectId;
    fileKey: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    skills: string[];
    yearsOfExperience: number;
    summary: string;
    experiences: IExperience[];
    education: IEducation[];
    tags: string[];
    locale: string;
    createdAt: Date;
    updatedAt: Date;
}

// Sub-schema for Education
const EducationSchema = new Schema<IEducation>({
    institution: { type: String, default: null },
    degree: { type: String, default: null },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
}, { _id: false }); // _id: false prevents Mongoose from creating separate IDs for every single education entry

// Sub-schema for Experience
const ExperienceSchema = new Schema<IExperience>({
    company: { type: String, default: null },
    position: { type: String, default: null },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
    description: { type: String, default: null },
}, { _id: false });

const ResumeSchema: Schema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        fileKey: {
            type: String,
            required: true
        },
        firstName: { type: String, default: null },
        lastName: { type: String, default: null },
        email: { type: String, default: null },
        phone: { type: String, default: null },
        skills: { type: [String], default: [] },
        tags: { type: [String], default: [] },
        locale: { type: String, default: 'en' },
        yearsOfExperience: { type: Number, default: 0 },
        summary: { type: String, default: null },
        experiences: { type: [ExperienceSchema], default: [] },
        education: { type: [EducationSchema], default: [] },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IResume>('Resume', ResumeSchema);