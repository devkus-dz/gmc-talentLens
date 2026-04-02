"use client";

import React, { useState, useMemo } from 'react';
import ApplicationCard from '@/components/ui/ApplicationCard';
import Link from 'next/link';

interface CandidateApplicationsClientProps {
    initialApplications: any[];
}

const STATUS_FILTERS = ['All', 'Applied', 'In Review', 'Interview', 'Offered', 'Rejected'];

export default function CandidateApplicationsClient({ initialApplications }: CandidateApplicationsClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Filter applications dynamically based on search and tabs
    const displayedApplications = useMemo(() => {
        return initialApplications.filter(app => {
            const matchesSearch = app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = activeFilter === 'All' || app.myStatus === activeFilter;
            return matchesSearch && matchesStatus;
        });
    }, [initialApplications, searchTerm, activeFilter]);

    return (
        <div className="flex flex-col gap-6">

            {/* Search & Filter Toolbar */}
            <div className="bg-base-100 p-4 rounded-3xl shadow-sm border border-base-content/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search applications by role..."
                        className="input input-bordered w-full pl-12 bg-base-200/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {/* Scrollable Status Tabs for Mobile */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                    {STATUS_FILTERS.map(status => (
                        <button
                            key={status}
                            onClick={() => setActiveFilter(status)}
                            className={`btn btn-sm rounded-xl border-none shrink-0 ${activeFilter === status
                                    ? 'bg-primary text-primary-content shadow-sm'
                                    : 'bg-base-200/50 text-base-content/60 hover:bg-base-200 hover:text-base-content'
                                }`}
                        >
                            {status}
                            {status !== 'All' && activeFilter === status && (
                                <span className="ml-1 bg-base-100/20 px-1.5 rounded-md text-[10px]">
                                    {initialApplications.filter(a => a.myStatus === status).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Applications Grid */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2 px-2">
                    <h2 className="font-bold text-xl text-base-content">
                        {activeFilter === 'All' ? 'Application History' : `${activeFilter} Applications`}
                    </h2>
                    <span className="text-sm font-medium text-base-content/50">{displayedApplications.length} Results</span>
                </div>

                {displayedApplications.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {displayedApplications.map((app: any) => (
                            <ApplicationCard
                                key={app.jobId}
                                title={app.jobTitle}
                                company="TalentLens Partner" // Fetch real companyName from populated backend if needed
                                status={app.myStatus}
                                appliedAt={new Date(app.appliedAt).toLocaleDateString()}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-base-100 rounded-3xl p-12 text-center border border-base-content/5 shadow-sm mt-4">
                        <div className="w-16 h-16 bg-base-200/50 text-base-content/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Applications Found</h3>
                        <p className="text-base-content/60 max-w-md mx-auto mb-6">
                            {searchTerm || activeFilter !== 'All'
                                ? "We couldn't find any applications matching your current filters."
                                : "You haven't applied to any jobs yet. Head over to the Job Board to find your next opportunity!"}
                        </p>
                        {(searchTerm || activeFilter !== 'All') ? (
                            <button onClick={() => { setSearchTerm(''); setActiveFilter('All'); }} className="btn btn-outline border-base-content/20 rounded-xl">Clear Filters</button>
                        ) : (
                            <Link href="/candidate/jobs" className="btn btn-primary rounded-xl px-8 shadow-sm">Browse Job Board</Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}