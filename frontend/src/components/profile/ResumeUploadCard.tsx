"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUploadZone from '@/components/ui/FileUploadZone';
import api from '@/lib/api';

interface ResumeUploadCardProps {
    fileName?: string;
    parsedDate?: string;
}

/**
 * Client component that handles the PDF upload and triggers AI parsing.
 * @param {ResumeUploadCardProps} props - The component props.
 * @returns {React.JSX.Element} The upload card UI.
 */
export default function ResumeUploadCard({ fileName, parsedDate }: ResumeUploadCardProps) {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    /**
     * Handles the file selection, sends it to Express, and refreshes the server component.
     * @param {File} file - The selected PDF file.
     */
    const handleFileSelect = async (file: File) => {
        setIsUploading(true);
        const formData = new FormData();

        // This key MUST match uploadMiddleware.single('pdfFile') in your backend resumeRoutes.ts
        formData.append('pdfFile', file);

        try {
            await api.post('/resumes/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Refreshes the current route, causing the Server Component to re-fetch the new data!
            router.refresh();
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload and parse resume. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5 flex flex-col relative overflow-hidden">
            {isUploading && (
                <div className="absolute inset-0 bg-base-100/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                    <p className="font-bold animate-pulse">Gemini AI is parsing your resume...</p>
                </div>
            )}

            <h2 className="font-bold text-lg mb-4">Your Resume</h2>

            <FileUploadZone
                label="Click or drag PDF to replace"
                helperText="Max file size: 5MB"
                onFileSelect={handleFileSelect}
            />

            {fileName && (
                <div className="mt-6 p-4 rounded-2xl bg-base-200/50 flex items-center gap-3">
                    <div className="p-2 bg-error/10 text-error rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-semibold text-sm truncate">{fileName}</p>
                        <p className="text-xs text-base-content/50">Parsed on {parsedDate}</p>
                    </div>
                </div>
            )}
        </div>
    );
}