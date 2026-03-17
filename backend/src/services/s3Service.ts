// src/services/s3Service.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize the S3 Client.
 * Note: forcePathStyle MUST be true when using local S3 clones like RustFS or MinIO.
 */
const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT as string,
    region: process.env.S3_REGION as string,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY as string,
        secretAccessKey: process.env.S3_SECRET_KEY as string,
    },
    forcePathStyle: true,
});

/**
 * Service to interact with the S3-compatible storage (RustFS / AWS S3).
 * @namespace s3Service
 */
export const s3Service = {
    /**
     * Uploads a file buffer to the S3 bucket and returns the unique file key.
     * * @param {Buffer} fileBuffer - The binary data of the file (usually from multer).
     * @param {string} originalName - The original name of the uploaded file (e.g., 'resume.pdf').
     * @param {string} mimeType - The MIME type of the file (e.g., 'application/pdf').
     * @returns {Promise<string>} The unique key (filename) generated for the S3 bucket.
     * @throws {Error} If the upload process fails.
     */
    async uploadResume(fileBuffer: Buffer, originalName: string, mimeType: string): Promise<string> {
        try {
            // 1. Generate a secure, unique filename to prevent overwriting existing files
            const fileExtension = originalName.split('.').pop();
            const uniqueId = crypto.randomBytes(16).toString('hex');
            const fileKey = `candidates/${uniqueId}.${fileExtension}`;

            // 2. Prepare the upload command
            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME as string,
                Key: fileKey,
                Body: fileBuffer,
                ContentType: mimeType,
            });

            // 3. Send to RustFS
            await s3Client.send(command);

            return fileKey;
        } catch (error) {
            console.error('S3 Upload Error:', error);
            throw new Error('Failed to upload file to storage.');
        }
    },

    /**
     * Generates a temporary, secure URL to read or download a file from the S3 bucket.
     * This is useful for keeping the bucket private but allowing the frontend to view the PDF.
     * * @param {string} fileKey - The unique key of the file in the S3 bucket.
     * @param {number} expiresIn - Number of seconds until the URL expires (default: 3600s / 1 hour).
     * @returns {Promise<string>} The presigned URL.
     */
    async getPresignedUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME as string,
                Key: fileKey,
            });

            // Generate a URL that is valid for the specified duration
            const url = await getSignedUrl(s3Client, command, { expiresIn });
            return url;
        } catch (error) {
            console.error('S3 Presigned URL Error:', error);
            throw new Error('Failed to generate file URL.');
        }
    }
};