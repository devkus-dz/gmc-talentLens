import React from 'react';

export interface ApplicationCardProps {
    id?: string;
    title: string;
    company: string;
    appliedAt: string;
    status: 'New Match' | 'Reviewing' | 'Interview' | 'Offered' | 'Rejected';
    avatarUrl?: string;
    avatarInitials?: string; // Fallback if no image is provided
}

export default function ApplicationCard({
    title,
    company,
    appliedAt,
    status,
    avatarUrl,
    avatarInitials,
}: ApplicationCardProps) {

    // Dynamic Status Mapping
    let badgeClass = '';
    let dotClass = '';
    let accentBorder = null;
    let avatarPadding = '';

    switch (status) {
        case 'New Match':
            badgeClass = 'badge-primary badge-soft text-primary';
            accentBorder = 'bg-primary';
            avatarPadding = 'pl-2';
            break;
        case 'Interview':
            badgeClass = 'badge-success badge-soft text-success-content';
            dotClass = 'bg-success';
            break;
        case 'Offered':
            badgeClass = 'badge-info badge-soft text-info-content';
            dotClass = 'bg-info';
            break;
        case 'Rejected':
            badgeClass = 'badge-error badge-soft text-error-content';
            dotClass = 'bg-error';
            break;
        case 'Reviewing':
        default:
            badgeClass = 'bg-base-200 text-base-content border-none';
            dotClass = 'bg-base-content/40';
            break;
    }

    return (
        <div className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-content/5 flex items-center gap-4 relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer">

            {/* Dynamic Left Accent Border (Only renders if accentBorder has a color) */}
            {accentBorder && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBorder}`}></div>
            )}

            {/* Avatar (Image or Initials) */}
            <div className={`avatar ${avatarPadding}`}>
                <div className="w-12 h-12 rounded-xl bg-base-300 text-base-content flex items-center justify-center text-xl overflow-hidden shadow-sm font-bold">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={`${company} Logo`} className="object-cover" />
                    ) : (
                        <span>{avatarInitials || company.substring(0, 2).toUpperCase()}</span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className="font-bold text-base leading-tight">{title}</h3>
                <p className="text-xs text-base-content/50 mt-1">{company} • Applied {appliedAt}</p>
            </div>

            {/* Status Badge */}
            <div className={`badge gap-1.5 py-3 px-3 rounded-xl font-medium text-xs ${badgeClass}`}>
                {dotClass && <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>}
                {status}
            </div>

        </div>
    );
}