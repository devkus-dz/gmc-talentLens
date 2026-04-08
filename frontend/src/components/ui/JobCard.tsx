import React from 'react';
import Link from 'next/link';
import { MoreVertical, Edit2, Archive, Play, Trash2, Kanban } from 'lucide-react';

export interface JobCardProps {
    id: string;
    title: string;
    department: string;
    location: string;
    createdAt: string;
    status: 'Published' | 'Draft' | 'Closed';
    stats: {
        applied: number;
        interview: number;
        offered: number;
    };
    onChangeStatus?: (id: string, newStatus: 'Published' | 'Draft' | 'Closed') => void;
    onEdit?: (id: string) => void;
    onDelete?: (idOrJob: string | any) => void;
}

export default function JobCard({
    id,
    title,
    department,
    location,
    createdAt,
    status,
    stats,
    onChangeStatus,
    onEdit,
    onDelete
}: JobCardProps) {

    const isPublished = status === 'Published';
    const isClosed = status === 'Closed';

    // The accent color strip on the left
    const accentColor = isPublished ? 'bg-success' : isClosed ? 'bg-base-content/20' : 'bg-warning/50';

    // Badge styling
    let badgeClass = 'bg-base-200 border-none text-base-content/60';
    if (isPublished) badgeClass = 'badge-success badge-soft';
    if (status === 'Draft') badgeClass = 'bg-warning/20 text-warning border-none';

    return (

        <div className={`rounded-2xl p-4 sm:p-6 border border-base-content/5 shadow-sm hover:shadow-md transition-all flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center relative bg-base-100 focus-within:z-60 hover:z-50`}>

            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${accentColor}`}></div>

            <div className={`flex-1 pl-2 w-full transition-opacity duration-300 ${isClosed ? 'opacity-50 grayscale' : status === 'Draft' ? 'opacity-80' : ''}`}>
                <div className="flex items-center gap-3 mb-2">
                    <h2 className={`text-lg sm:text-xl font-bold line-clamp-1 ${isClosed ? 'line-through text-base-content/50' : 'text-base-content'}`}>
                        {title}
                    </h2>
                    <span className={`badge text-[10px] font-bold uppercase tracking-widest py-2.5 shrink-0 ${badgeClass}`}>
                        {status}
                    </span>
                </div>
                <p className="text-xs sm:text-sm text-base-content/60 flex flex-wrap items-center gap-2">
                    {department} • {location} • <span className="text-base-content/40">Created {createdAt}</span>
                </p>
            </div>

            {/* Apply opacity ONLY to the stats section */}
            <div className={`flex justify-between sm:justify-center items-center gap-2 sm:gap-8 px-4 sm:px-6 py-4 bg-base-200/30 rounded-2xl border border-base-content/5 w-full xl:w-auto ${!isPublished ? 'grayscale opacity-60' : ''}`}>
                <div className="text-center flex-1 sm:flex-none">
                    <p className="text-xl sm:text-2xl font-bold text-base-content">{stats.applied}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-base-content/50 mt-1">Applied</p>
                </div>
                <div className="w-px h-8 bg-base-content/10 shrink-0"></div>
                <div className="text-center flex-1 sm:flex-none">
                    <p className="text-xl sm:text-2xl font-bold text-primary">{stats.interview}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-base-content/50 mt-1">Interview</p>
                </div>
                <div className="w-px h-8 bg-base-content/10 shrink-0"></div>
                <div className="text-center flex-1 sm:flex-none">
                    <p className="text-xl sm:text-2xl font-bold text-success">{stats.offered}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-base-content/50 mt-1">Offered</p>
                </div>
            </div>

            {/* This section remains fully opaque and interactive even if the job is closed! */}
            <div className="flex items-center justify-between xl:justify-end gap-6 w-full xl:w-auto mt-2 xl:mt-0 pt-4 xl:pt-0 border-t border-base-content/5 xl:border-none bg-base-100">

                {/* Toggle Switch */}
                <div className="flex flex-col items-start xl:items-end gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">
                        {isClosed ? 'Archived' : 'Accepting'}
                    </span>
                    <input
                        type="checkbox"
                        className="toggle toggle-success toggle-sm"
                        checked={isPublished}
                        disabled={isClosed}
                        onChange={(e) => onChangeStatus && onChangeStatus(id, e.target.checked ? 'Published' : 'Draft')}
                    />
                </div>

                {/* Action Dropdown */}
                <div className="dropdown dropdown-end">
                    <button tabIndex={0} className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-primary hover:bg-primary/10">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    {/* The menu relies on the parent's focus-within:z-[100] to sit perfectly on top */}
                    <ul tabIndex={0} className="dropdown-content z-60 menu p-2 shadow-2xl bg-base-100 rounded-2xl w-52 border border-base-content/10 mt-1">

                        <li>
                            <Link href={`/recruiter/pipeline?job=${id}`} className="font-bold text-primary py-3">
                                <Kanban className="w-4 h-4 opacity-80" /> View Pipeline
                            </Link>
                        </li>

                        <div className="divider my-0 opacity-30"></div>

                        <li><button onClick={() => onEdit && onEdit(id)} className="font-medium py-3"><Edit2 className="w-4 h-4 opacity-70" /> Edit Details</button></li>

                        {!isClosed && (
                            <li><button onClick={() => onChangeStatus && onChangeStatus(id, 'Closed')} className="font-medium text-warning py-3"><Archive className="w-4 h-4 opacity-70" /> Close & Archive</button></li>
                        )}
                        {isClosed && (
                            <li><button onClick={() => onChangeStatus && onChangeStatus(id, 'Draft')} className="font-medium text-info py-3"><Play className="w-4 h-4 opacity-70" /> Reopen as Draft</button></li>
                        )}

                        <div className="divider my-0 opacity-30"></div>

                        <li><button onClick={() => onDelete && onDelete(id)} className="font-medium text-error py-3"><Trash2 className="w-4 h-4 opacity-70" /> Delete Job</button></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}