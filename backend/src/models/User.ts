// backend/src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

/**
 * TypeScript Interface for the User Document.
 * Includes optional fields (`?`) because a Candidate won't have a companyName, 
 * and a Recruiter won't have an isLookingForJob flag.
 */
export interface IUser extends Document {
  id: any;
  // Shared Auth Fields
  email: string;
  passwordHash: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  profilePictureUrl?: string; // Used for candidate face OR company logo

  // Candidate-Specific Fields
  firstName?: string;
  lastName?: string;
  isLookingForJob?: boolean;
  savedJobs?: mongoose.Types.ObjectId[];

  // Recruiter/Company-Specific Fields
  companyName?: string;
  website?: string;
  companyDescription?: string;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Schema definition with Conditional Validation.
 */
const UserSchema: Schema = new Schema(
  {
    // --- SHARED FIELDS ---
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['CANDIDATE', 'RECRUITER', 'ADMIN'], default: 'CANDIDATE' },
    profilePictureUrl: { type: String, default: null },

    // --- CANDIDATE FIELDS ---
    firstName: {
      type: String,
      // Only required if the user is a Candidate
      required: function (this: IUser) { return this.role === 'CANDIDATE'; }
    },
    lastName: {
      type: String,
      required: function (this: IUser) { return this.role === 'CANDIDATE'; }
    },
    isLookingForJob: {
      type: Boolean,
      // Defaults to true only if they are a candidate
      default: function (this: IUser) { return this.role === 'CANDIDATE' ? true : undefined; }
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobOffer' }],

    // --- RECRUITER FIELDS ---
    companyName: {
      type: String,
      // Only required if the user is a Recruiter
      required: function (this: IUser) { return this.role === 'RECRUITER'; }
    },
    website: { type: String },
    companyDescription: { type: String }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);