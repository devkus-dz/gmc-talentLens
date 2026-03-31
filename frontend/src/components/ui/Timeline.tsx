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
}

export default function Timeline({ items, theme = 'primary' }: TimelineProps) {
    const themeColors = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        accent: 'text-accent',
        neutral: 'text-base-content/40',
    };

    const activeColor = themeColors[theme];

    return (
        <div className="flex flex-col gap-8 w-full">
            {items.map((item, index) => {
                const isFirst = index === 0;
                const iconColor = isFirst ? activeColor : 'text-base-content/20';
                const dateColor = isFirst ? activeColor : 'text-base-content/40';

                return (
                    // Notice: Changed to items-stretch so the middle column reaches the bottom of the row
                    <div key={item.id} className="flex flex-col md:flex-row gap-3 md:gap-6 w-full items-stretch">

                        {/* LEFT SIDE: Meta Data */}
                        <div className="w-full md:w-[30%] shrink-0 flex flex-col md:items-end md:text-right">
                            <div className="flex items-center gap-2 mb-1.5 md:mb-1.5 md:block">
                                <div className={`md:hidden ${iconColor}`}>
                                    {item.icon || (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <time className={`text-[10px] font-bold ${dateColor} tracking-widest uppercase`}>
                                    {item.period}
                                </time>
                            </div>

                            <h3 className="text-lg font-bold leading-tight text-base-content">{item.title}</h3>
                            <p className="text-sm text-base-content/50 font-medium mt-1">{item.subtitle}</p>
                        </div>

                        {/* MIDDLE: The Snap Icon AND The Connecting Line */}
                        {/* Notice the relative positioning here */}
                        <div className="hidden md:flex flex-col items-center justify-start md:w-[5%] shrink-0 relative">

                            {/* THE MAGIC LINE: Extends past the bottom of the div to cross the gap-8 (-bottom-8) */}
                            {index < items.length - 1 && (
                                <div className="absolute top-4 -bottom-8 w-px bg-base-content/10"></div>
                            )}

                            {/* The Icon (given a solid background to sit on top of the line cleanly) */}
                            <div className={`relative z-10 bg-base-100 rounded-full pb-2 ${iconColor}`}>
                                {item.icon || (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* RIGHT SIDE: The Description */}
                        <div className="flex-1 w-full mt-2 md:mt-0">
                            {item.description && (
                                <div className="bg-base-100 p-5 sm:p-6 rounded-2xl border border-base-content/10 text-sm text-base-content/80 leading-relaxed shadow-sm hover:shadow-md transition-shadow">
                                    {item.description}
                                </div>
                            )}
                        </div>

                    </div>
                );
            })}
        </div>
    );
}