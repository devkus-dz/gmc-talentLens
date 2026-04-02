"use client";

import React from 'react';

export type TimelineItem = {
    id: string | number;
    period: string;
    title: string;
    subtitle: string;
    description?: string;
    icon?: React.ReactNode;
};

interface TimelineProps {
    items: TimelineItem[];
    theme?: 'primary' | 'secondary' | 'accent' | 'neutral';
    onEdit?: (id: string | number) => void;
    onRemove?: (id: string | number) => void;
}

export default function Timeline({ items, theme = 'primary', onEdit, onRemove }: TimelineProps) {
    const themeColors = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        accent: 'text-accent',
        neutral: 'text-base-content/40',
    };

    const activeColor = themeColors[theme];

    if (!items || items.length === 0) {
        return <p className="text-sm text-base-content/50 italic">No entries added yet.</p>;
    }

    return (
        <div className="flex flex-col gap-8 w-full">
            {items.map((item, index) => {
                const isFirst = index === 0;
                const iconColor = isFirst ? activeColor : 'text-base-content/20';
                const dateColor = isFirst ? activeColor : 'text-base-content/40';
                const showSubtitleOnRight = !item.description;
                const hasActions = !!(onEdit || onRemove);

                return (
                    <div key={item.id} className="flex flex-col md:flex-row gap-3 md:gap-6 w-full items-stretch group">

                        {/* LEFT SIDE: Dates, Titles, and Actions */}
                        <div className="w-full md:w-[30%] shrink-0 flex flex-col md:items-end md:text-right">
                            <div className="flex items-center gap-2 mb-1.5 md:mb-1.5 md:block">
                                <div className={`md:hidden ${iconColor}`}>
                                    {item.icon || (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                    )}
                                </div>
                                <time className={`text-[10px] font-bold ${dateColor} tracking-widest uppercase`} dir="auto">
                                    {item.period}
                                </time>
                            </div>

                            <h3 className="text-lg font-bold leading-tight text-base-content" dir="auto">{item.title}</h3>

                            {!showSubtitleOnRight && (
                                <p className="text-sm text-base-content/50 font-medium mt-1" dir="auto">{item.subtitle}</p>
                            )}

                            {/* Action Buttons: Cleanly placed under metadata. No text overlap! */}
                            {hasActions && (
                                <div className="flex gap-2 mt-3 justify-start md:justify-end opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                    {onEdit && (
                                        <button
                                            type="button"
                                            onClick={() => onEdit(item.id)}
                                            className="btn btn-xs btn-outline border-base-content/20 font-medium text-base-content/60 hover:text-primary hover:border-primary hover:bg-primary/10 rounded-lg shadow-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
                                            Edit
                                        </button>
                                    )}
                                    {onRemove && (
                                        <button
                                            type="button"
                                            onClick={() => onRemove(item.id)}
                                            className="btn btn-xs btn-outline border-base-content/20 font-medium text-base-content/60 hover:text-error hover:border-error hover:bg-error/10 rounded-lg shadow-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* MIDDLE LINE */}
                        <div className="hidden md:flex flex-col items-center justify-start md:w-[5%] shrink-0 relative">
                            {index < items.length - 1 && <div className="absolute top-4 -bottom-8 w-px bg-base-content/10"></div>}
                            <div className={`relative z-10 bg-base-100 rounded-full pb-2 ${iconColor}`}>
                                {item.icon || (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                )}
                            </div>
                        </div>

                        {/* RIGHT SIDE: The Content */}
                        <div className="flex-1 w-full mt-2 md:mt-0 flex flex-col justify-center">
                            {item.description ? (
                                <div className="bg-base-100 p-5 sm:p-6 rounded-2xl border border-base-content/10 text-sm text-base-content/80 leading-relaxed shadow-sm whitespace-pre-wrap" dir="auto">
                                    {item.description}
                                </div>
                            ) : (
                                <div className="text-base font-medium text-base-content/70 md:pl-4" dir="auto">
                                    {item.subtitle}
                                </div>
                            )}
                        </div>

                    </div>
                );
            })}
        </div>
    );
}