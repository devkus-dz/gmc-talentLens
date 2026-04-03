"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CandidateJobCard from '@/components/ui/CandidateJobCard';
import api from '@/lib/api';

interface CandidateJobsClientProps {
    initialJobs: any[];
    initialAppliedIds: string[];
    initialSavedIds: string[];
}

export default function CandidateJobsClient({ initialJobs, initialAppliedIds, initialSavedIds }: CandidateJobsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [jobs, setJobs] = useState(initialJobs);
    const [appliedIds, setAppliedIds] = useState<string[]>(initialAppliedIds);
    const [savedIds, setSavedIds] = useState<string[]>(initialSavedIds);

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [isSearching, setIsSearching] = useState(false);
    const [showSavedOnly, setShowSavedOnly] = useState(false);

    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            setSearchTerm(query);
            setIsSearching(true);
            api.get(`/jobs?search=${encodeURIComponent(query)}`)
                .then(res => setJobs(res.data.data || res.data))
                .catch(error => console.error("Search failed:", error))
                .finally(() => setIsSearching(false));
        } else {
            setSearchTerm('');
            setJobs(initialJobs);
        }
    }, [searchParams, initialJobs]);

    const handleSearch = () => {
        if (searchTerm.trim()) {
            router.push(`/candidate/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            router.push(`/candidate/jobs`);
        }
    };

    const handleApply = async (jobId: string) => {
        try {
            setAppliedIds(prev => [...prev, jobId]);
            await api.post(`/jobs/${jobId}/apply`);
            router.refresh();
        } catch (error: any) {
            setAppliedIds(prev => prev.filter(id => id !== jobId));
            alert(error.response?.data?.message || "Failed to apply.");
        }
    };

    const handleToggleSave = async (jobId: string) => {
        const isCurrentlySaved = savedIds.includes(jobId);
        setSavedIds(prev => isCurrentlySaved ? prev.filter(id => id !== jobId) : [...prev, jobId]);
        try {
            await api.patch(`/users/saved-jobs/${jobId}`);
        } catch (error) {
            setSavedIds(prev => isCurrentlySaved ? [...prev, jobId] : prev.filter(id => id !== jobId));
            console.error("Failed to toggle save:", error);
        }
    };

    // The Magic Link Route!
    const viewJobDetails = (jobId: string) => {
        router.push(`/candidate/jobs/${jobId}`);
    };

    const displayedJobs = useMemo(() => {
        if (!showSavedOnly) return jobs;
        return jobs.filter(job => savedIds.includes(job._id || job.id));
    }, [jobs, showSavedOnly, savedIds]);

    return (
        <div className="flex flex-col gap-6">
            {/* Search Bar & Filter Toggle */}
            <div className="bg-base-100 p-4 rounded-3xl shadow-sm border border-base-content/5 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search for job titles, companies, or keywords..."
                        className="input input-bordered w-full pl-12 bg-base-200/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowSavedOnly(!showSavedOnly)}
                        className={`btn rounded-2xl px-5 border border-base-content/10 flex-1 md:flex-none transition-colors shadow-sm ${showSavedOnly
                                ? 'bg-secondary/10 text-secondary border-secondary/30 hover:bg-secondary/20'
                                : 'bg-base-100 text-base-content/70 hover:bg-base-200'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={showSavedOnly ? "currentColor" : "none"} stroke="currentColor" strokeWidth={showSavedOnly ? "0" : "2"} className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                        Saved
                    </button>

                    <button onClick={handleSearch} disabled={isSearching} className="btn btn-primary rounded-2xl px-8 flex-1 md:flex-none shadow-sm">
                        {isSearching ? <span className="loading loading-spinner loading-sm"></span> : 'Search'}
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2 px-2">
                    <h2 className="font-bold text-xl text-base-content">{showSavedOnly ? 'Saved Opportunities' : 'Active Opportunities'}</h2>
                    <span className="text-sm font-medium text-base-content/50">{displayedJobs.length} Results</span>
                </div>

                {displayedJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedJobs.map((job: any) => {
                            const jobId = job._id || job.id;
                            const hasApplied = appliedIds.includes(jobId);
                            const hasSaved = savedIds.includes(jobId);
                            const combinedTags = [...(job.tags || [])].slice(0, 3);

                            return (
                                <CandidateJobCard
                                    key={jobId}
                                    id={jobId}
                                    title={job.title}
                                    company={job.companyName || 'TalentLens Partner'}
                                    location={job.location || 'Remote'}
                                    type={job.employmentType}
                                    salary={job.salaryRange}
                                    experience={job.minYearsOfExperience ? `${job.minYearsOfExperience}+ Yrs Exp` : 'Entry Level'}
                                    tags={combinedTags}
                                    isApplied={hasApplied}
                                    isSaved={hasSaved}
                                    onApply={handleApply}
                                    onToggleSave={handleToggleSave}
                                    onViewDetails={viewJobDetails}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-base-100 rounded-3xl p-12 text-center border border-base-content/5 shadow-sm mt-4">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Jobs Found</h3>
                        <p className="text-base-content/60 max-w-md mx-auto">
                            {showSavedOnly ? "You haven't saved any jobs yet. Browse the board and click the heart icon to save jobs for later!" : "There are currently no active job openings matching your search. Please check back later!"}
                        </p>
                        {showSavedOnly && (
                            <button onClick={() => setShowSavedOnly(false)} className="btn btn-outline border-base-content/20 mt-6 rounded-xl">View All Jobs</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}