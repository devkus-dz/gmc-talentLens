import mongoose, { Schema, Document } from 'mongoose';

/**
 * TypeScript Interface for the User Document.
 */
export interface IUser extends Document {
  id: any;
  email: string;
  passwordHash: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  profilePictureUrl?: string;

  firstName?: string;
  lastName?: string;
  isLookingForJob?: boolean;
  savedJobs?: mongoose.Types.ObjectId[];

  // --- FIELDS FOR PASSWORD RESET ---
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isActive: boolean;

  companyId?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['CANDIDATE', 'RECRUITER', 'ADMIN'], default: 'CANDIDATE' },
    profilePictureUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },

    firstName: {
      type: String,
      required: function (this: IUser) { return this.role === 'CANDIDATE'; }
    },
    lastName: {
      type: String,
      required: function (this: IUser) { return this.role === 'CANDIDATE'; }
    },
    isLookingForJob: {
      type: Boolean,
      default: function (this: IUser) { return this.role === 'CANDIDATE' ? true : undefined; }
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobOffer' }],

    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      default: null
    },

    // --- FIELDS FOR PASSWORD RESET ---
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },

  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);