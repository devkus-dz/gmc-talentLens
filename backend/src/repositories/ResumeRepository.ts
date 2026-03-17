// src/repositories/ResumeRepository.ts
import { BaseRepository } from './BaseRepository';
import ResumeModel, { IResume } from '../models/Resume';

/**
 * Repository handling database operations for Resumes.
 * Inherits all standard CRUD operations from BaseRepository.
 */
class ResumeRepository extends BaseRepository<IResume> {
    constructor() {
        super(ResumeModel);
    }

    /**
     * Finds all resumes uploaded by a specific user.
     * * @param {string} userId - The ID of the user.
     * @returns {Promise<IResume[]>} An array of resumes.
     */
    async findByUserId(userId: string): Promise<IResume[]> {
        return await this.model.find({ userId });
    }
}

export const resumeRepository = new ResumeRepository();