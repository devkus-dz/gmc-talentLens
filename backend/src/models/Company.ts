import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
    name: string;
    logoUrl?: string;
    website?: string;
    industry?: string;
    description?: string;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CompanySchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    logoUrl: { type: String, default: null },
    website: { type: String, trim: true },
    industry: { type: String, trim: true },
    description: { type: String },
    location: { type: String },
}, {
    timestamps: true
});

export default mongoose.model<ICompany>('Company', CompanySchema);