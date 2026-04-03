import React from 'react';
import Link from 'next/link';

export interface ApplicationCardProps {
    id?: string;
    title: string;
    company: string;
    appliedAt: string;
    status: 'Applied' | 'In Review' | 'Interview' | 'Offered' | 'Rejected' | string;
    avatarUrl?: string;
    avatarInitials?: string;
}

export default function ApplicationCard({
    id,
    title,
    company,
    appliedAt,
    status,
    avatarUrl,
    avatarInitials,
}: ApplicationCardProps) {

    let badgeClass = '';
    let dotClass = '';
    let accentBorder = null;
    let avatarPadding = '';

    switch (status) {
        case 'Applied':
            badgeClass = 'badge-primary badge-soft text-primary';
            accentBorder = 'bg-primary';
            avatarPadding = 'pl-2';
            break;
        case 'In Review':
            badgeClass = 'badge-info badge-soft text-info';
            dotClass = 'bg-info';
            break;
        case 'Interview':
            badgeClass = 'badge-warning badge-soft text-warning-content';
            dotClass = 'bg-warning';
            break;
        case 'Offered':
            badgeClass = 'badge-success badge-soft text-success-content';
            dotClass = 'bg-success';
            break;
        case 'Rejected':
            badgeClass = 'badge-error badge-soft text-error-content';
            dotClass = 'bg-error';
            break;
        default:
            badgeClass = 'bg-base-200 text-base-content border-none';
            dotClass = 'bg-base-content/40';
            break;
    }

    const CardContent = (
        <div className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-content/5 flex items-center gap-4 relative overflow-hidden hover:shadow-md transition-all hover:border-primary/20 cursor-pointer group w-full">
            {accentBorder && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBorder}`}></div>
            )}
            <div className={`avatar ${avatarPadding}`}>
                <div className="w-12 h-12 rounded-xl bg-base-200 text-base-content flex items-center justify-center text-xl overflow-hidden shadow-sm font-bold border border-base-content/5 group-hover:border-primary/20 transition-colors">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={`${company} Logo`} className="object-cover" />
                    ) : (
                        <span>{avatarInitials || company.substring(0, 2).toUpperCase()}</span>
                    )}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base leading-tight truncate group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-xs text-base-content/50 mt-1 truncate">{company} • Applied {appliedAt}</p>
            </div>
            <div className={`badge gap-1.5 py-3 px-3 rounded-xl font-medium text-xs shrink-0 ${badgeClass}`}>
                {dotClass && <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>}
                {status}
            </div>
        </div>
    );

    // If an ID is provided, make the whole card a clickable link to the Job Page!
    if (id) {
        return <Link href={`/candidate/jobs/${id}`} className="block w-full">{CardContent}</Link>;
    }

    return CardContent;
}