import React from 'react';

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
    onDelete?: (id: string) => void;
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

    // Visual states based on the 3 statuses
    const cardOpacity = isClosed ? 'opacity-50 grayscale bg-base-200/50' : status === 'Draft' ? 'opacity-75' : '';
    const accentColor = isPublished ? 'bg-success' : isClosed ? 'bg-base-content/20' : 'bg-warning/50';

    let badgeClass = 'bg-base-200 border-none text-base-content/60';
    if (isPublished) badgeClass = 'badge-success badge-soft';
    if (status === 'Draft') badgeClass = 'bg-warning/20 text-warning border-none';

    return (
        <div className={`rounded-2xl p-4 sm:p-6 border border-base-content/5 shadow-sm hover:shadow-md transition-all flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center relative overflow-hidden ${cardOpacity}`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor}`}></div>

            <div className="flex-1 pl-2 w-full">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className={`text-lg sm:text-xl font-bold line-clamp-1 ${isClosed ? 'line-through text-base-content/60' : ''}`}>
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

            <div className={`flex justify-between sm:justify-center items-center gap-2 sm:gap-8 px-4 sm:px-6 py-4 bg-base-100 rounded-2xl border border-base-content/5 w-full xl:w-auto ${!isPublished ? 'grayscale opacity-60' : ''}`}>
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

            <div className="flex items-center justify-between xl:justify-end gap-6 w-full xl:w-auto mt-2 xl:mt-0 pt-4 xl:pt-0 border-t border-base-content/5 xl:border-none">

                {/* Toggle Switch (Disabled if Closed) */}
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

                <div className="dropdown dropdown-end">
                    <button tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
                    </button>
                    <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-44 border border-base-content/10">
                        <li><button onClick={() => onEdit && onEdit(id)} className="font-medium">Edit Job</button></li>
                        {!isClosed && (
                            <li><button onClick={() => onChangeStatus && onChangeStatus(id, 'Closed')} className="font-medium text-warning">Close & Archive</button></li>
                        )}
                        {isClosed && (
                            <li><button onClick={() => onChangeStatus && onChangeStatus(id, 'Draft')} className="font-medium text-info">Reopen as Draft</button></li>
                        )}
                        <div className="divider my-0 opacity-30"></div>
                        <li><button onClick={() => onDelete && onDelete(id)} className="font-medium text-error">Delete</button></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}