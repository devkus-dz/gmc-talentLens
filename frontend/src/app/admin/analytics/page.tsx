import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full animate-fade-in p-2 h-full">
            <PageHeader
                title="Analytics & Reporting"
                description="System-wide metrics and hiring conversion rates."
            />

            <div className="flex-1 flex items-center justify-center min-h-[500px]">
                <EmptyState
                    title="Module Under Construction"
                    description="We are currently building the visual charting engines for the analytics dashboard. Check back soon."
                    action={<button className="btn btn-primary rounded-xl">Notify Me</button>}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                    }
                />
            </div>
        </div>
    );
}