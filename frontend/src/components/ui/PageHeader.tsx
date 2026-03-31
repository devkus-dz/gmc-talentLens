import React, { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode; // Optional button to pass in
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-base-content/10 pb-4 mb-2 shrink-0">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description && (
                    <p className="text-base-content/60 mt-1 text-sm font-medium">{description}</p>
                )}
            </div>
            {action && (
                <div className="w-full sm:w-auto">
                    {action}
                </div>
            )}
        </div>
    );
}