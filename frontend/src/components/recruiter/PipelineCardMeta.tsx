import React from 'react';
import { BrainCircuit, Eye } from 'lucide-react';
import Link from 'next/link';

interface PipelineCardMetaProps {
    app: any;
    isClosedJob: boolean;
}

export default function PipelineCardMeta({ app, isClosedJob }: PipelineCardMetaProps) {
    const hasAiScore = app.aiScore !== undefined && app.aiScore !== null;

    // --- Score Badge Logic ---
    let scoreBadge = null;
    if (hasAiScore) {
        let colorClass = 'bg-error/10 text-error';
        if (app.aiScore >= 80) colorClass = 'bg-success/15 text-success';
        else if (app.aiScore >= 60) colorClass = 'bg-warning/15 text-warning-content';

        scoreBadge = (
            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${colorClass}`}>
                ⭐ {app.aiScore}% Match
            </span>
        );
    } else if (isClosedJob) {
        scoreBadge = <span className="text-[10px] font-medium bg-base-200 text-base-content/50 px-2 py-1 rounded-md">Unscored</span>;
    } else if (app.resume?.yearsOfExperience !== undefined) {
        scoreBadge = <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-md">{Math.min(100, app.resume.yearsOfExperience * 10)}% Exp</span>;
    }

    // --- Breakdown Progress Bars ---
    let breakdownElements = null;
    if (app.aiScores) {
        breakdownElements = Object.entries(app.aiScores)
            .filter(([key]) => key !== 'overallScore')
            .map(([key, value]) => {
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                    <div key={key} className="flex justify-between items-center text-[10px] mb-1.5">
                        <span className="text-base-content/60 font-medium">{formattedKey}</span>
                        <div className="flex items-center gap-2">
                            <progress className="progress progress-primary w-12" value={value as number} max="100"></progress>
                            <span className="font-bold text-base-content/80 w-6 text-right">{String(value)}</span>
                        </div>
                    </div>
                );
            });
    }

    return (
        <div
            className="w-full mt-3 pt-3 border-t border-base-content/5"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            {app.aiExplanation ? (
                <details className="group cursor-pointer">
                    <summary className="list-none flex items-center justify-between select-none outline-none">
                        {scoreBadge}
                        <div className="flex items-center gap-1">
                            {/* --- NEW: View Full Profile Link --- */}
                            <Link
                                href={`/recruiter/candidates/${app.candidate._id || app.candidate.id}`}
                                target="_blank"
                                className="btn btn-xs btn-ghost text-base-content/50 hover:text-primary px-1.5"
                                title="View Full Profile"
                            >
                                <Eye className="w-4 h-4" />
                            </Link>

                            <div className="text-[10px] font-bold text-primary flex items-center gap-1 hover:text-primary-focus transition-colors">
                                Insights <BrainCircuit className="w-3 h-3" />
                            </div>
                        </div>
                    </summary>

                    <div className="mt-3 p-3 bg-base-200/50 rounded-xl border border-base-content/10 shadow-inner">
                        {breakdownElements && breakdownElements.length > 0 && (
                            <div className="mb-2 pb-2 border-b border-base-content/10">
                                {breakdownElements}
                            </div>
                        )}
                        <p className="text-[11px] text-base-content/80 italic leading-relaxed">
                            "{app.aiExplanation}"
                        </p>
                    </div>
                </details>
            ) : (
                <div className="flex items-center justify-between">
                    {scoreBadge}

                    {/* --- View Full Profile Link (Fallback if no insights yet) --- */}
                    <Link
                        href={`/recruiter/candidates/${app.candidate._id || app.candidate.id}`}
                        target="_blank"
                        className="btn btn-xs btn-ghost text-base-content/50 hover:text-primary px-1.5"
                        title="View Full Profile"
                    >
                        <Eye className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}