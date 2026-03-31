"use client";

import React, { useState } from 'react';
import CandidateJobCard from '@/components/ui/CandidateJobCard';

// 1. Expanded Mock Data (6 jobs now)
const MOCK_JOBS = [
    { id: 'job-1', title: 'Senior Product Designer', company: 'Lumina Labs', location: 'Remote, San Francisco', logoUrl: 'https://ui-avatars.com/api/?name=Lumina+Labs&background=0D1117&color=fff', tags: ['Figma', 'UI/UX', 'Design Systems'], isSaved: true },
    { id: 'job-2', title: 'Fullstack Engineer', company: 'Nexus AI', location: 'New York, NY (Hybrid)', logoUrl: 'https://ui-avatars.com/api/?name=Nexus+AI&background=F3E8FF&color=9333EA', tags: ['React', 'Node.js', 'TypeScript'], isSaved: false },
    { id: 'job-3', title: 'Marketing Director', company: 'Flow Finance', location: 'London, UK', logoUrl: 'https://ui-avatars.com/api/?name=Flow+Finance&background=0284C7&color=fff', tags: ['Growth', 'SEO', 'Branding'], isSaved: false },
    { id: 'job-4', title: 'DevOps Engineer', company: 'CloudSync', location: 'Remote, Global', logoUrl: 'https://ui-avatars.com/api/?name=Cloud+Sync&background=10B981&color=fff', tags: ['AWS', 'Docker', 'CI/CD'], isSaved: false },
    { id: 'job-5', title: 'UX Researcher', company: 'DesignHub', location: 'Berlin, DE', logoUrl: 'https://ui-avatars.com/api/?name=Design+Hub&background=333&color=fff', tags: ['User Testing', 'Interviews', 'Figma'], isSaved: true },
    { id: 'job-6', title: 'Backend Developer', company: 'Stellar AI', location: 'Remote, US', logoUrl: 'https://ui-avatars.com/api/?name=Stellar+AI&background=0F172A&color=fff', tags: ['Python', 'Django', 'PostgreSQL'], isSaved: false },
    { id: 'job-7', title: 'Backend Developer', company: 'Stellar AI', location: 'Remote, US', logoUrl: 'https://ui-avatars.com/api/?name=Stellar+AI&background=0F172A&color=fff', tags: ['Python', 'Django', 'PostgreSQL'], isSaved: false }
];

export default function CandidateJobBoard() {
    const [jobs, setJobs] = useState(MOCK_JOBS);

    // 2. Pagination & Loading State
    const [visibleCount, setVisibleCount] = useState(3);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleSave = (id: string) => {
        setJobs(prev => prev.map(job => job.id === id ? { ...job, isSaved: !job.isSaved } : job));
    };

    const handleApply = (id: string) => {
        console.log(`Applying for job: ${id}`);
    };

    // 3. The Lazy Load Simulation
    const handleLoadMore = () => {
        setIsLoading(true); // Start spinner

        // Simulate a network request delay (800ms)
        setTimeout(() => {
            setVisibleCount(prev => prev + 3); // Reveal 3 more jobs
            setIsLoading(false); // Stop spinner
        }, 800);
    };

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-fade-in p-2">
            {/* Page Header & Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-base-content/10 pb-4">
                <div className="flex gap-6 text-sm font-medium">
                    <button className="text-primary border-b-2 border-primary pb-1">Browse Jobs</button>
                    <button className="text-base-content/60 hover:text-base-content pb-1">Company</button>
                    <button className="text-base-content/60 hover:text-base-content pb-1">Salaries</button>
                </div>
            </div>

            {/* Filters & Hero Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-center mt-2">
                <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4">
                    <div className="form-control flex-1">
                        <label className="label py-1"><span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">Role Category</span></label>
                        <select className="select select-bordered w-full bg-base-100 border-base-content/10 rounded-xl font-medium focus:outline-primary/20">
                            <option>Engineering & Tech</option>
                            <option>Design & UX</option>
                            <option>Marketing</option>
                        </select>
                    </div>

                    <div className="form-control flex-1">
                        <label className="label py-1"><span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">Job Type</span></label>
                        <select className="select select-bordered w-full bg-base-100 border-base-content/10 rounded-xl font-medium focus:outline-primary/20">
                            <option>Remote (Global)</option>
                            <option>Hybrid</option>
                            <option>On-site</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button className="btn btn-primary rounded-xl aspect-square px-0 w-12 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                        </button>
                    </div>
                </div>

                <div className="bg-linear-to-br from-primary to-secondary rounded-2xl p-5 text-primary-content flex justify-between items-center shadow-md">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Active Searches</p>
                        <h2 className="text-2xl font-bold leading-tight">1,248 Jobs Found</h2>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" /></svg>
                    </div>
                </div>
            </div>

            {/* 4. Job Cards Grid (Sliced by visibleCount) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
                {jobs.slice(0, visibleCount).map(job => (
                    <CandidateJobCard
                        key={job.id}
                        {...job}
                        onToggleSave={handleToggleSave}
                        onApply={handleApply}
                    />
                ))}
            </div>

            {/* 5. Load More Button Logic */}
            {visibleCount < jobs.length && (
                <div className="flex justify-center mt-6 mb-4">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="btn btn-outline border-base-content/20 text-base-content/70 hover:bg-base-200 hover:border-base-content/30 rounded-full px-8 disabled:bg-transparent disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Loading...
                            </>
                        ) : (
                            <>
                                Load More Positions <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}