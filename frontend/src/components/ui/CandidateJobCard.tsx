import React from 'react';

export interface CandidateJobCardProps {
    id: string;
    title: string;
    company: string;
    location: string;
    type?: string;
    salary?: string;
    experience?: string;
    logoUrl?: string;
    tags: string[];
    isSaved?: boolean;
    isApplied?: boolean;
    onToggleSave?: (id: string) => void;
    onApply?: (id: string) => void;
    onViewDetails?: (id: string) => void;
}

export default function CandidateJobCard({
    id,
    title,
    company,
    location,
    type,
    salary,
    experience,
    logoUrl,
    tags,
    isSaved = false,
    isApplied = false,
    onToggleSave,
    onApply,
    onViewDetails
}: CandidateJobCardProps) {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
            <div className="card-body p-5 sm:p-6 flex flex-col flex-1">

                {/* Header: Logo & Save Button */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center overflow-hidden shrink-0 border border-base-content/5">
                            {logoUrl ? (
                                <img src={logoUrl} alt={company} className="object-cover w-full h-full" />
                            ) : (
                                <span className="text-xl font-bold text-base-content/50">{company.substring(0, 2).toUpperCase()}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight line-clamp-1" title={title}>{title}</h3>
                            <p className="text-sm font-bold text-primary mt-0.5">{company}</p>
                        </div>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleSave && onToggleSave(id); }}
                        className={`transition-colors shrink-0 p-1 rounded-full hover:bg-base-200 ${isSaved ? 'text-secondary' : 'text-base-content/30 hover:text-secondary'}`}
                        aria-label={isSaved ? "Unsave job" : "Save job"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isSaved ? "0" : "2"} className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                    </button>
                </div>

                {/* Clean, Vertical Metadata */}
                <div className="flex flex-col gap-2.5 mt-2 text-sm text-base-content/70 font-medium">
                    <div className="flex items-center gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 shrink-0 opacity-60"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                        <span className="truncate">{location}</span>
                    </div>
                    {type && (
                        <div className="flex items-center gap-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 shrink-0 opacity-60"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>
                            <span className="truncate">{type}</span>
                        </div>
                    )}
                    {salary && (
                        <div className="flex items-center gap-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 shrink-0 opacity-60"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="truncate">{salary}</span>
                        </div>
                    )}
                    {experience && (
                        <div className="flex items-center gap-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 shrink-0 opacity-60"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                            <span className="truncate">{experience}</span>
                        </div>
                    )}
                </div>

                {/* Sleek Outlined Tags */}
                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                    {tags.map((tag, index) => (
                        <span key={index} className="badge bg-base-100 border border-base-content/10 text-base-content/60 text-[10px] uppercase font-bold tracking-wider py-3 px-3 rounded-lg">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto pt-2 flex gap-3">
                    <button
                        onClick={() => onViewDetails && onViewDetails(id)}
                        className="btn btn-outline border-base-content/20 flex-1 rounded-xl font-semibold hover:bg-base-200 hover:border-base-content/30 hover:text-base-content"
                    >
                        Details
                    </button>
                    <button
                        onClick={() => !isApplied && onApply && onApply(id)}
                        disabled={isApplied}
                        className={`btn flex-1 border-none rounded-xl font-semibold ${isApplied
                                ? 'bg-success/10 text-success cursor-not-allowed'
                                : 'bg-primary text-primary-content hover:bg-primary/90 shadow-sm'
                            }`}
                    >
                        {isApplied ? 'Applied ✓' : 'Apply Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}