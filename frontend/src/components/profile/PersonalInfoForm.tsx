import React from 'react';
import AvatarUpload from '@/components/ui/AvatarUpload';

interface PersonalInfoFormProps {
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl?: string | null;
    isLookingForJob?: boolean;
    onUploadSuccess?: (newUrl: string) => void;
    onUploadError?: (error: string) => void;
    onToggleStatus?: () => void;
    onChangeFirstName: (val: string) => void; // Added handler
    onChangeLastName: (val: string) => void;  // Added handler
}

export default function PersonalInfoForm({
    firstName,
    lastName,
    email,
    profilePictureUrl,
    isLookingForJob = false,
    onUploadSuccess,
    onUploadError,
    onToggleStatus,
    onChangeFirstName,
    onChangeLastName
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
                        value={firstName}
                        onChange={(e) => onChangeFirstName(e.target.value)}
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
                        value={lastName}
                        onChange={(e) => onChangeLastName(e.target.value)}
                        placeholder="e.g. Doe"
                        className="input input-bordered w-full bg-base-200/30 border-base-content/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm font-medium"
                    />
                </label>

                {/* Email Address */}
                <label className="form-control w-full sm:col-span-2">
                    <div className="label pb-1">
                        <span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                            Email Address
                        </span>
                    </div>
                    <input
                        type="email"
                        value={email}
                        readOnly
                        className="input input-bordered w-full bg-base-200/30 border-base-content/10 text-base-content/60 rounded-xl text-sm font-medium cursor-not-allowed"
                    />
                </label>

                {/* Job Visibility Toggle */}
                <div className="sm:col-span-2 mt-4 p-5 rounded-2xl border border-base-content/10 bg-base-200/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-bold text-base-content">Open to Work</h3>
                        <p className="text-xs text-base-content/60 mt-1">
                            When active, your profile is visible to recruiters. Turn off to hide from candidate searches.
                        </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                        <span className={`text-xs font-bold uppercase ${isLookingForJob ? 'text-success' : 'text-base-content/40'}`}>
                            {isLookingForJob ? 'Visible' : 'Hidden'}
                        </span>
                        <input
                            type="checkbox"
                            className="toggle toggle-success"
                            checked={isLookingForJob}
                            onChange={onToggleStatus}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}