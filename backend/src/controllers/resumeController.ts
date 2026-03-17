// src/controllers/resumeController.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { s3Service } from '../services/s3Service';
import { geminiService } from '../services/geminiService';
import { resumeRepository } from '../repositories/ResumeRepository';

/**
 * Controller handling resume (CV) upload and AI parsing operations.
 * @namespace resumeController
 */
export const resumeController = {
    /**
     * Uploads a PDF to S3, parses it with Gemini AI, and saves the structured data to MongoDB.
     * * @param {AuthRequest} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async upload(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.file || !req.file.buffer) {
                res.status(400).json({ message: 'No file buffer detected. Check your multer storage configuration.' });
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

            // Parse AI Data to ensure buffer integrity
            const parsedAiData = await geminiService.parseResume(fileBuffer, mimeType);

            // Upload to S3
            const fileKey = await s3Service.uploadResume(fileBuffer, originalName, mimeType);

            console.log('✅ AI Parsing and Upload Complete!');

            // Save to MongoDB
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
                experiences: parsedAiData.experiences || [],
                education: parsedAiData.education || [],
            });

            const previewUrl = await s3Service.getPresignedUrl(fileKey);

            res.status(201).json({
                message: 'Resume successfully uploaded and analyzed by AI.',
                resumeId: newResume.id,
                parsedData: {
                    firstName: newResume.firstName,
                    lastName: newResume.lastName,
                    email: newResume.email,
                    phone: newResume.phone,
                    skills: newResume.skills,
                    tags: newResume.tags,
                    locale: newResume.locale,
                    yearsOfExperience: newResume.yearsOfExperience,
                    summary: newResume.summary,
                    experiences: newResume.experiences,
                    education: newResume.education,
                },
                documentUrl: previewUrl,
            });

        } catch (error) {
            console.error('Resume Processing Error:', error);
            res.status(500).json({ message: 'Internal server error while processing the resume.' });
        }
    },
};