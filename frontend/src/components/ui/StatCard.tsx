import React, { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    theme: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'neutral';
    trendText?: string;
    trendType?: 'positive' | 'negative' | 'neutral';
}

export default function StatCard({
    title,
    value,
    icon,
    theme,
    trendText,
    trendType = 'neutral'
}: StatCardProps) {

    // Map out the specific icon colors and the card's hover border colors
    const themeStyles = {
        primary: { icon: 'text-primary bg-primary/10', cardHover: 'hover:border-primary/30' },
        secondary: { icon: 'text-secondary bg-secondary/10', cardHover: 'hover:border-secondary/30' },
        accent: { icon: 'text-accent bg-accent/10', cardHover: 'hover:border-accent/30' },
        info: { icon: 'text-info bg-info/10', cardHover: 'hover:border-info/30' },
        success: { icon: 'text-success bg-success/10', cardHover: 'hover:border-success/30' },
        warning: { icon: 'text-warning bg-warning/10', cardHover: 'hover:border-warning/30' },
        error: { icon: 'text-error bg-error/10', cardHover: 'hover:border-error/30' },
        neutral: { icon: 'text-base-content bg-base-200', cardHover: 'hover:border-base-content/30' },
    };

    const { icon: iconClass, cardHover } = themeStyles[theme];

    // Map the trend badge colors
    let badgeClass = 'bg-base-200 text-base-content/60'; // Default neutral (for "Pending", "This Week")
    if (trendType === 'positive') badgeClass = 'bg-success/10 text-success';
    if (trendType === 'negative') badgeClass = 'bg-error/10 text-error';

    return (
        <div className={`bg-base-100 rounded-2xl p-5 shadow-sm border border-base-content/5 flex flex-col justify-between cursor-pointer group transition-all hover:shadow-md ${cardHover}`}>

            <div className="flex justify-between items-start mb-4">
                {/* The icon container scales up when the parent group is hovered */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${iconClass}`}>
                    {icon}
                </div>

                {trendText && (
                    <span className={`badge badge-sm border-none font-bold py-2.5 px-3 ${badgeClass}`}>
                        {trendText}
                    </span>
                )}
            </div>

            <div>
                <h2 className="text-3xl font-bold text-base-content">{value}</h2>
                <p className="text-[11px] font-bold uppercase tracking-widest text-base-content/50 mt-1">{title}</p>
            </div>
        </div>
    );
}