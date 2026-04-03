// src/services/s3Service.ts
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    PutBucketPolicyCommand,
    PutBucketCorsCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3';
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
     */
    async uploadResume(fileBuffer: Buffer, originalName: string, mimeType: string): Promise<string> {
        try {
            const fileExtension = originalName.split('.').pop();
            const uniqueId = crypto.randomBytes(16).toString('hex');
            const fileKey = `candidates/${uniqueId}.${fileExtension}`;

            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME as string,
                Key: fileKey,
                Body: fileBuffer,
                ContentType: mimeType,
            });

            await s3Client.send(command);
            return fileKey;
        } catch (error) {
            console.error('S3 Upload Error:', error);
            throw new Error('Failed to upload file to storage.');
        }
    },

    /**
     * Generates a temporary, secure URL to read or download a file from the S3 bucket.
     */
    async getPresignedUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME as string,
                Key: fileKey,
            });

            return await getSignedUrl(s3Client, command, { expiresIn });
        } catch (error) {
            console.error('S3 Presigned URL Error:', error);
            throw new Error('Failed to generate file URL.');
        }
    },

    /**
     * Uploads a user profile image buffer to the S3 bucket.
     */
    async uploadProfileImage(fileBuffer: Buffer, originalName: string, mimeType: string): Promise<string> {
        try {
            const fileExtension = originalName.split('.').pop();
            const uniqueId = crypto.randomBytes(16).toString('hex');
            const fileKey = `profile-images/${uniqueId}.${fileExtension}`;

            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME as string,
                Key: fileKey,
                Body: fileBuffer,
                ContentType: mimeType,
            });

            await s3Client.send(command);
            return fileKey;
        } catch (error) {
            console.error('S3 Profile Image Upload Error:', error);
            throw new Error('Failed to upload profile picture to storage.');
        }
    },

    /**
     * NEW: Uploads a company logo to the S3 bucket in a dedicated folder.
     */
    async uploadCompanyLogo(fileBuffer: Buffer, originalName: string, mimeType: string): Promise<string> {
        try {
            const fileExtension = originalName.split('.').pop();
            const uniqueId = crypto.randomBytes(16).toString('hex');

            // Store explicitly in the company-images folder
            const fileKey = `company-images/${uniqueId}.${fileExtension}`;

            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME as string,
                Key: fileKey,
                Body: fileBuffer,
                ContentType: mimeType,
            });

            await s3Client.send(command);
            return fileKey;
        } catch (error) {
            console.error('S3 Company Logo Upload Error:', error);
            throw new Error('Failed to upload company logo to storage.');
        }
    },

    /**
     * Call this once when the server starts to unlock the bucket for the frontend.
     */
    async configureBucket(): Promise<void> {
        const bucketName = process.env.S3_BUCKET_NAME as string;
        try {
            const corsCommand = new PutBucketCorsCommand({
                Bucket: bucketName,
                CORSConfiguration: {
                    CORSRules: [
                        {
                            AllowedHeaders: ['*'],
                            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                            AllowedOrigins: ['*'],
                            ExposeHeaders: [],
                            MaxAgeSeconds: 3000
                        }
                    ]
                }
            });

            const policy = {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: '*',
                        Action: ['s3:GetObject'],
                        Resource: [`arn:aws:s3:::${bucketName}/*`]
                    }
                ]
            };

            const policyCommand = new PutBucketPolicyCommand({
                Bucket: bucketName,
                Policy: JSON.stringify(policy)
            });

            await s3Client.send(corsCommand);
            await s3Client.send(policyCommand);

            console.log(`✅ S3 Bucket '${bucketName}' configured with Public Read and CORS.`);
        } catch (error) {
            console.error(`❌ Failed to configure S3 Bucket policies:`, error);
        }
    },

    /**
     * Deletes any file from the S3 bucket using its exact path key.
     */
    async deleteFile(fileKey: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME as string,
                Key: fileKey,
            });

            await s3Client.send(command);
            console.log(`🗑️ Successfully deleted old file from storage: ${fileKey}`);
        } catch (error) {
            console.error(`❌ Failed to delete old file (${fileKey}):`, error);
        }
    }
};