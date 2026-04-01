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

                return (
                    <div key={item.id} className="flex flex-col md:flex-row gap-3 md:gap-6 w-full items-stretch group">

                        {/* LEFT SIDE */}
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

                        {/* RIGHT SIDE & ACTIONS */}
                        <div className="flex-1 w-full mt-2 md:mt-0 flex flex-col justify-center relative">
                            {/* Action Buttons (Visible on hover) */}
                            <div className="absolute -top-2 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {onEdit && <button onClick={() => onEdit(item.id)} className="btn btn-xs btn-ghost text-base-content/50 hover:text-primary">Edit</button>}
                                {onRemove && <button onClick={() => onRemove(item.id)} className="btn btn-xs btn-ghost text-base-content/50 hover:text-error">✕</button>}
                            </div>

                            {item.description ? (
                                <div className="bg-base-100 p-5 sm:p-6 rounded-2xl border border-base-content/10 text-sm text-base-content/80 leading-relaxed shadow-sm hover:shadow-md transition-shadow whitespace-pre-wrap" dir="auto">
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