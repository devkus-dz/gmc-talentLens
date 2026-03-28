// src/controllers/resumeController.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { s3Service } from '../services/s3Service';
import { geminiService } from '../services/geminiService';
import { resumeRepository } from '../repositories/ResumeRepository';
import { BaseController } from './BaseController';
import { IResume } from '../models/Resume';

/**
 * Controller handling resume (CV) upload, parsing, and data updates.
 * Inherits standard CRUD from BaseController.
 * @class ResumeController
 * @extends {BaseController<IResume>}
 */
class ResumeController extends BaseController<IResume> {
    constructor() {
        super(resumeRepository);
    }

    /**
     * Uploads a resume, parses it via Gemini AI, and saves the data to MongoDB.
     */
    upload = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.file || !req.file.buffer) {
                res.status(400).json({ message: 'No file buffer detected. Check your multer configuration.' });
                return;
            }
            if (!req.user) {
                res.status(401).json({ message: 'Unauthorized. User context missing.' });
                return;
            }

            const fileBuffer = req.file.buffer;
            const originalName = req.file.originalname;
            const mimeType = req.file.mimetype;

            console.log(`🚀 Processing file: ${originalName} (${fileBuffer.length} bytes)`);

            const parsedAiData = await geminiService.parseResume(fileBuffer, mimeType);
            const fileKey = await s3Service.uploadResume(fileBuffer, originalName, mimeType);

            console.log('✅ AI Parsing and Upload Complete!');

            const newResume = await resumeRepository.create({
                userId: req.user.id,
                fileKey: fileKey,
                firstName: parsedAiData.firstName ?? undefined,
                lastName: parsedAiData.lastName ?? undefined,
                email: parsedAiData.email ?? undefined,
                phone: parsedAiData.phone || '',
                skills: parsedAiData.skills || [],
                tags: parsedAiData.tags || [],
                locale: parsedAiData.locale || 'en',
                yearsOfExperience: parsedAiData.yearsOfExperience || 0,
                summary: parsedAiData.summary || '',
                improvementTip: parsedAiData.improvementTip || '',
                experiences: parsedAiData.experiences || [],
                education: parsedAiData.education || [],
            });

            const previewUrl = await s3Service.getPresignedUrl(fileKey);

            res.status(201).json({
                message: 'Resume successfully uploaded and analyzed by AI.',
                resumeId: newResume.id,
                parsedData: newResume,
                documentUrl: previewUrl,
            });

        } catch (error) {
            console.error('Resume Processing Error:', error);
            res.status(500).json({ message: 'Internal server error while processing the resume.' });
        }
    };

    /**
     * Retrieves the latest parsed resume for the currently authenticated candidate.
     */
    getMyResume = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;

            // Fetch the user's resumes, sort by newest first, and take the top 1
            const resumes = await resumeRepository.findPaginated({ userId }, 1, 1, { createdAt: -1 });

            if (!resumes.data || resumes.data.length === 0) {
                res.status(404).json({ message: 'No resume found for this user.' });
                return;
            }

            res.status(200).json(resumes.data[0]);
        } catch (error) {
            console.error('Fetch My Resume Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };

    /**
     * Updates specific fields of a parsed resume (e.g., adding a new experience).
     * Includes an ownership security check.
     */
    updateResume = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            // Fetch the existing resume to verify ownership
            const existingResume = await resumeRepository.findById(id as string);

            if (!existingResume) {
                res.status(404).json({ message: 'Resume not found.' });
                return;
            }

            // Security Check: Only the owner (or an Admin) can edit the resume
            if (existingResume.userId.toString() !== userId?.toString() && req.user?.role !== 'ADMIN') {
                res.status(403).json({ message: 'Forbidden. You do not own this resume.' });
                return;
            }

            // Prevent overriding critical system fields
            const updateData = { ...req.body };
            delete updateData.userId;
            delete updateData.fileKey;

            // Perform the update
            const updatedResume = await resumeRepository.update(id as string, updateData);

            res.status(200).json({
                message: 'Resume updated successfully.',
                resume: updatedResume
            });
        } catch (error) {
            console.error('Update Resume Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    };
}

export const resumeController = new ResumeController();