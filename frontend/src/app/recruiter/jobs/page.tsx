"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import JobCard, { JobCardProps } from '@/components/ui/JobCard';

const MOCK_JOBS: JobCardProps[] = [
    { id: '1', title: 'Senior Product Designer', department: 'Engineering', location: 'Remote', createdAt: 'Oct 12', status: 'Published', stats: { applied: 42, interview: 8, offered: 1 } },
    { id: '2', title: 'Frontend Engineer', department: 'Engineering', location: 'New York (Hybrid)', createdAt: 'Oct 20', status: 'Draft', stats: { applied: 0, interview: 0, offered: 0 } },
    // Added a Closed Job!
    { id: '3', title: 'Marketing Director', department: 'Marketing', location: 'London, UK', createdAt: 'Sep 05', status: 'Closed', stats: { applied: 124, interview: 12, offered: 1 } }
];

export default function ManageJobs() {
    const [jobs, setJobs] = useState(MOCK_JOBS);
    const [activeTab, setActiveTab] = useState<'All' | 'Published' | 'Draft' | 'Closed'>('All');

    const handleChangeStatus = (id: string, newStatus: 'Published' | 'Draft' | 'Closed') => {
        setJobs(prev => prev.map(job => job.id === id ? { ...job, status: newStatus } : job));
    };

    // Filter jobs based on the active tab
    const displayedJobs = jobs.filter(job => activeTab === 'All' || job.status === activeTab);

    // Helper for tab styling
    const getTabClass = (tabName: string) =>
        `pb-1 transition-colors ${activeTab === tabName ? 'text-primary border-b-2 border-primary font-bold' : 'text-base-content/50 hover:text-base-content'}`;

    return (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full animate-fade-in p-2">
            <PageHeader
                title="Manage Jobs"
                description="Create, edit, and publish your job openings."
                action={
                    <button className="btn btn-primary rounded-xl shadow-md bg-linear-to-r from-primary to-secondary border-none w-full sm:w-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Post New Job
                    </button>
                }
            />

            {/* Tabs Menu */}
            <div className="flex gap-6 text-sm mt-2 border-b border-base-content/10">
                <button onClick={() => setActiveTab('All')} className={getTabClass('All')}>
                    All Roles <span className="badge badge-sm badge-primary badge-soft ml-1">{jobs.length}</span>
                </button>
                <button onClick={() => setActiveTab('Published')} className={getTabClass('Published')}>
                    Active <span className="badge badge-sm bg-base-200 border-none text-base-content/60 ml-1">{jobs.filter(j => j.status === 'Published').length}</span>
                </button>
                <button onClick={() => setActiveTab('Draft')} className={getTabClass('Draft')}>
                    Drafts <span className="badge badge-sm bg-base-200 border-none text-base-content/60 ml-1">{jobs.filter(j => j.status === 'Draft').length}</span>
                </button>
                <button onClick={() => setActiveTab('Closed')} className={getTabClass('Closed')}>
                    Closed <span className="badge badge-sm bg-base-200 border-none text-base-content/60 ml-1">{jobs.filter(j => j.status === 'Closed').length}</span>
                </button>
            </div>

            <div className="flex flex-col gap-4 mt-2">
                {displayedJobs.map(job => (
                    <JobCard
                        key={job.id}
                        {...job}
                        onChangeStatus={handleChangeStatus}
                    />
                ))}
                {displayedJobs.length === 0 && (
                    <div className="text-center py-12 text-base-content/50 font-medium bg-base-200/20 rounded-2xl border border-dashed border-base-content/20">
                        No jobs found in this category.
                    </div>
                )}
            </div>
        </div>
    );
}