import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicant {
    candidate: mongoose.Types.ObjectId;
    status: 'Applied' | 'In Review' | 'Interview' | 'Offered' | 'Rejected';
    appliedAt: Date;
}

export interface IJobOffer extends Document {
    id: string;
    isActive: boolean;
    title: string;
    description: string;
    department: string;
    location: string;
    employmentType: string;
    salaryRange: string;
    minYearsOfExperience: number;
    requiredSkills: string[];
    tags: string[];
    applicants: IApplicant[];
    createdBy: mongoose.Types.ObjectId;

    // --- NEW COMPANY FIELDS ---
    companyId?: mongoose.Types.ObjectId;
    companyName?: string;
    companyLogo?: string;
    // --------------------------

    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
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
        isActive: { type: Boolean, default: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        department: { type: String, default: 'General' },
        location: { type: String, default: 'Remote' },
        employmentType: { type: String, default: 'Full-time' },
        salaryRange: { type: String, default: 'Competitive' },
        minYearsOfExperience: { type: Number, default: 0 },
        requiredSkills: { type: [String], default: [] },
        tags: { type: [String], default: [] },
        applicants: { type: [ApplicantSchema], default: [] },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

        // --- COMPANY FIELDS ---
        companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: false },
        companyName: { type: String, required: false },
        companyLogo: { type: String, required: false },
        // --------------------------

        status: {
            type: String,
            enum: ['DRAFT', 'PUBLISHED', 'CLOSED'],
            default: 'DRAFT'
        },
    },
    { timestamps: true }
);

export default mongoose.model<IJobOffer>('JobOffer', JobOfferSchema);