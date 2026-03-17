// src/middlewares/uploadMiddleware.ts
import multer from 'multer';
import { Request } from 'express';

/**
 * Configure Multer to use memory storage.
 * This keeps the uploaded file in RAM (Buffer) instead of writing it to the local disk.
 */
const storage = multer.memoryStorage();

/**
 * File filter to ensure only PDF files are uploaded.
 * Checks both the MIME type and the file extension for better resilience with API clients.
 * * @param {Request} req - The Express request object.
 * @param {Express.Multer.File} file - The file object provided by Multer.
 * @param {multer.FileFilterCallback} cb - The callback to indicate acceptance or rejection.
 */
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
): void => {
    console.log(`[Upload Debug] File Name: ${file.originalname} | MIME Type: ${file.mimetype}`);

    const allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Received: ${file.mimetype}. Only PDF and Images (JPG/PNG/WEBP) are allowed.`));
    }
};

/**
 * The configured Multer middleware instance.
 * Limits file size to 5MB to prevent Denial of Service (DoS) attacks.
 * @namespace uploadMiddleware
 */
export const uploadMiddleware = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 Megabytes
    },
});