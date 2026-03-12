// backend/src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

// 1. Interface TypeScript (pour l'autocomplétion)
export interface IUser extends Document {
  id: any;
  email: string;
  passwordHash: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Schéma Mongoose (pour la validation en base de données)
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['CANDIDATE', 'RECRUITER', 'ADMIN'],
      default: 'CANDIDATE'
    },
    firstName: { type: String },
    lastName: { type: String },
  },
  {
    timestamps: true, // Gère automatiquement createdAt et updatedAt
  }
);

// 3. Export du Modèle
export default mongoose.model<IUser>('User', UserSchema);