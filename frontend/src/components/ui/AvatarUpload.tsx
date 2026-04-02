"use client";

import React, { useState, useRef } from 'react';
import api from '@/lib/api';

interface AvatarUploadProps {
    currentImageUrl?: string | null;
    firstName?: string;
    lastName?: string;
    onUploadSuccess?: (newUrl: string) => void;
    onUploadError?: (error: string) => void;
}

export default function AvatarUpload({
    currentImageUrl,
    firstName = '',
    lastName = '',
    onUploadSuccess,
    onUploadError
}: AvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Strict 5MB limit check before hitting the server
        if (file.size > 5 * 1024 * 1024) {
            onUploadError?.("File size must be less than 5MB");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        // The field name 'profilePicture' MUST match uploadMiddleware.single('profilePicture')
        formData.append('profilePicture', file);

        try {
            const res = await api.put('/users/profile-picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const newUrl = res.data.profilePictureUrl;
            setPreviewUrl(newUrl);

            // Update localStorage so the Navbar and other components see the new image
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                user.profilePictureUrl = newUrl;
                localStorage.setItem('user', JSON.stringify(user));

                // Dispatch a custom event so the Navbar updates without a page reload!
                window.dispatchEvent(new Event('user-updated'));
            }

            onUploadSuccess?.(newUrl);
        } catch (err: any) {
            onUploadError?.(err.response?.data?.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const initials = `${firstName.charAt(0) || ''}${lastName.charAt(0) || ''}`.toUpperCase() || 'U';

    return (
        <div className="relative group cursor-pointer inline-block shrink-0">
            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
            />

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`avatar placeholder ${isUploading ? 'opacity-50' : ''} transition-opacity`}
            >
                <div className="bg-base-200 text-base-content w-20 h-20 rounded-full border-2 border-base-content/10 shadow-sm overflow-hidden group-hover:border-primary transition-colors">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Profile" className="object-cover w-full h-full" />
                    ) : (
                        <span className="text-2xl font-bold">{initials}</span>
                    )}
                </div>
            </div>

            {/* Hover Camera Overlay */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-base-content/60 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-base-100"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
            </div>

            {/* Loading Spinner */}
            {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-100/50 rounded-full backdrop-blur-[2px]">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                </div>
            )}
        </div>
    );
}