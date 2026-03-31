import React from 'react';

export interface CandidateJobCardProps {
    id: string;
    title: string;
    company: string;
    location: string;
    logoUrl?: string;
    tags: string[];
    isSaved?: boolean;
    onToggleSave?: (id: string) => void;
    onApply?: (id: string) => void;
}

export default function CandidateJobCard({
    id,
    title,
    company,
    location,
    logoUrl,
    tags,
    isSaved = false,
    onToggleSave,
    onApply
}: CandidateJobCardProps) {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
            <div className="card-body p-6 flex flex-col flex-1">

                {/* Header: Logo & Save Button */}
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center overflow-hidden shrink-0">
                        {logoUrl ? (
                            <img src={logoUrl} alt={company} className="object-cover w-full h-full" />
                        ) : (
                            <span className="text-xl font-bold text-base-content/50">{company.substring(0, 2).toUpperCase()}</span>
                        )}
                    </div>

                    <button
                        onClick={() => onToggleSave && onToggleSave(id)}
                        className={`transition-colors ${isSaved ? 'text-primary' : 'text-base-content/30 hover:text-primary'}`}
                        aria-label={isSaved ? "Unsave job" : "Save job"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isSaved ? "0" : "2"} className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                    </button>
                </div>

                {/* Title & Meta */}
                <h3 className="font-bold text-lg leading-tight">{title}</h3>
                <div className="flex flex-col gap-1 mt-2 text-sm text-base-content/60">
                    <span className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                        <span className="truncate">{company}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                        <span className="truncate">{location}</span>
                    </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                    {tags.map((tag, index) => (
                        <span key={index} className="badge badge-primary badge-soft text-xs py-2.5 px-3 border-none">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Action Button (Pushed to bottom using mt-auto) */}
                <button
                    onClick={() => onApply && onApply(id)}
                    className="btn w-full bg-base-200/50 hover:bg-base-200 border-none rounded-xl font-semibold mt-auto"
                >
                    1-Click Apply <span aria-hidden="true">&rarr;</span>
                </button>
            </div>
        </div>
    );
}