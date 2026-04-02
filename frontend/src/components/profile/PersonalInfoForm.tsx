import React from 'react';
import AvatarUpload from '@/components/ui/AvatarUpload';

interface PersonalInfoFormProps {
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl?: string | null;
    onUploadSuccess?: (newUrl: string) => void;
    onUploadError?: (error: string) => void;
}

export default function PersonalInfoForm({
    firstName,
    lastName,
    email,
    profilePictureUrl,
    onUploadSuccess,
    onUploadError
}: PersonalInfoFormProps) {
    return (
        <div>
            {/* Header with inline Avatar Upload */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="font-bold text-xl">Personal Information</h2>
                    <p className="text-sm text-base-content/50 mt-1">Manage your core identity and contact details.</p>
                </div>
                <AvatarUpload
                    currentImageUrl={profilePictureUrl}
                    firstName={firstName}
                    lastName={lastName}
                    onUploadSuccess={onUploadSuccess}
                    onUploadError={onUploadError}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                {/* First Name */}
                <label className="form-control w-full">
                    <div className="label pb-1">
                        <span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                            First Name
                        </span>
                    </div>
                    <input
                        type="text"
                        defaultValue={firstName}
                        placeholder="e.g. Jane"
                        className="input input-bordered w-full bg-base-200/30 border-base-content/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm font-medium"
                    />
                </label>

                {/* Last Name */}
                <label className="form-control w-full">
                    <div className="label pb-1">
                        <span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                            Last Name
                        </span>
                    </div>
                    <input
                        type="text"
                        defaultValue={lastName}
                        placeholder="e.g. Doe"
                        className="input input-bordered w-full bg-base-200/30 border-base-content/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm font-medium"
                    />
                </label>

                {/* Email Address - Spans both columns on desktop */}
                <label className="form-control w-full sm:col-span-2">
                    <div className="label pb-1">
                        <span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                            Email Address
                        </span>
                    </div>
                    <input
                        type="email"
                        defaultValue={email}
                        readOnly
                        className="input input-bordered w-full bg-base-200/30 border-base-content/10 text-base-content/60 rounded-xl text-sm font-medium cursor-not-allowed"
                    />
                </label>

            </div>
        </div>
    );
}