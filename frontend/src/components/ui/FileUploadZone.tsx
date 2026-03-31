"use client";

import React from 'react';

interface FileUploadZoneProps {
    label?: string;
    helperText?: string;
    onFileSelect?: (file: File) => void;
}

export default function FileUploadZone({
    label = "Click or drag PDF to upload",
    helperText = "Max file size: 5MB",
    onFileSelect
}: FileUploadZoneProps) {

    return (
        <div className="border-2 border-dashed border-base-content/20 bg-base-200/30 hover:bg-base-200/60 transition-colors rounded-3xl flex flex-col items-center justify-center p-8 cursor-pointer group relative">
            <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0 && onFileSelect) {
                        onFileSelect(e.target.files[0]);
                    }
                }}
            />
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            </div>
            <p className="font-medium text-sm text-center">{label}</p>
            <p className="text-xs text-base-content/50 mt-1 text-center">{helperText}</p>
        </div>
    );
}