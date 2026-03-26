// src/controllers/resumeController.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { s3Service } from '../services/s3Service';
import { geminiService } from '../services/geminiService';
import { resumeRepository } from '../repositories/ResumeRepository';

/**
 * Controller handling resume (CV) upload and AI parsing operations.
 * * Execution Steps:
 * 1. Validates the presence of the uploaded file buffer and user context.
 * 2. Passes the file buffer to the Gemini service for data extraction and tip generation.
 * 3. Uploads the raw PDF file to AWS S3 / MinIO.
 * 4. Persists the AI-extracted data (including the improvement tip) to MongoDB.
 * 5. Generates a pre-signed URL for document preview and returns the full payload.
 * * @namespace resumeController
 */
export const resumeController = {
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
                    improvementTip: newResume.improvementTip,
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