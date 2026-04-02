"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CandidateJobCard from '@/components/ui/CandidateJobCard';
import api from '@/lib/api';

interface CandidateJobsClientProps {
    initialJobs: any[];
    initialAppliedIds: string[];
    initialSavedIds: string[];
}

export default function CandidateJobsClient({ initialJobs, initialAppliedIds, initialSavedIds }: CandidateJobsClientProps) {
    const router = useRouter();

    const [jobs, setJobs] = useState(initialJobs);
    const [appliedIds, setAppliedIds] = useState<string[]>(initialAppliedIds);
    const [savedIds, setSavedIds] = useState<string[]>(initialSavedIds);

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // New State for filtering saved jobs
    const [showSavedOnly, setShowSavedOnly] = useState(false);

    const [selectedJob, setSelectedJob] = useState<any | null>(null);

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

    const handleSearch = async () => {
        setIsSearching(true);
        try {
            const res = await api.get(`/jobs?search=${encodeURIComponent(searchTerm)}`);
            setJobs(res.data.data || res.data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const openDetailsModal = (jobId: string) => {
        const job = jobs.find(j => (j._id || j.id) === jobId);
        if (job) {
            setSelectedJob(job);
            const modal = document.getElementById('job_details_modal') as HTMLDialogElement;
            if (modal) modal.showModal();
        }
    };

    // Filter jobs before rendering based on the toggle state
    const displayedJobs = useMemo(() => {
        if (!showSavedOnly) return jobs;
        return jobs.filter(job => savedIds.includes(job._id || job.id));
    }, [jobs, showSavedOnly, savedIds]);

    return (
        <>
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
                        placeholder="Search for job titles or keywords..."
                        className="input input-bordered w-full pl-12 bg-base-200/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div className="flex gap-3">
                    {/* The Toggle Button */}
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
                                    onViewDetails={openDetailsModal}
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

            {/* --- IMPROVED UI: FULL OFFER MODAL --- */}
            <dialog id="job_details_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-0 sm:rounded-4xl max-w-3xl bg-base-100 flex flex-col max-h-[90vh]">
                    {selectedJob && (
                        <>
                            {/* Sticky Header */}
                            <div className="p-5 sm:p-8 border-b border-base-content/10 flex justify-between items-start sticky top-0 bg-base-100/95 backdrop-blur-md z-20">
                                <div className="flex gap-4 items-center pr-4">
                                    <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-base-200 items-center justify-center shrink-0 border border-base-content/5">
                                        <span className="text-xl font-bold text-base-content/50">
                                            {(selectedJob.companyName || 'TL').substring(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl sm:text-2xl leading-tight text-base-content">{selectedJob.title}</h3>
                                        <p className="text-primary font-semibold text-sm mt-1">{selectedJob.companyName || 'TalentLens Partner'} <span className="text-base-content/30 mx-1">•</span> {selectedJob.department || 'General'}</p>
                                    </div>
                                </div>
                                <form method="dialog" className="shrink-0">
                                    <button className="btn btn-sm btn-circle btn-ghost bg-base-200 hover:bg-base-300 border-none text-base-content/60">✕</button>
                                </form>
                            </div>

                            {/* Scrollable Body */}
                            <div className="p-5 sm:p-8 overflow-y-auto flex-1 flex flex-col gap-8 thin-scrollbar">

                                {/* Info Grid (Stacks to 2 cols on mobile, 4 on desktop) */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5 flex flex-col justify-center items-center text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mb-1.5 text-base-content/40"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 block mb-0.5">Location</span>
                                        <span className="font-semibold text-sm leading-tight text-base-content">{selectedJob.location || 'Remote'}</span>
                                    </div>
                                    <div className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5 flex flex-col justify-center items-center text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mb-1.5 text-base-content/40"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 block mb-0.5">Type</span>
                                        <span className="font-semibold text-sm leading-tight text-base-content">{selectedJob.employmentType || 'Full-time'}</span>
                                    </div>
                                    <div className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5 flex flex-col justify-center items-center text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mb-1.5 text-base-content/40"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 block mb-0.5">Salary</span>
                                        <span className="font-semibold text-sm leading-tight text-base-content">{selectedJob.salaryRange || 'Competitive'}</span>
                                    </div>
                                    <div className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5 flex flex-col justify-center items-center text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mb-1.5 text-base-content/40"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 block mb-0.5">Experience</span>
                                        <span className="font-semibold text-sm leading-tight text-base-content">{selectedJob.minYearsOfExperience ? `${selectedJob.minYearsOfExperience}+ Yrs` : 'Entry'}</span>
                                    </div>
                                </div>

                                {/* Prominent Core Skills */}
                                {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
                                    <div>
                                        <h4 className="font-bold text-base text-base-content mb-3 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" /></svg>
                                            Core Requirements
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedJob.requiredSkills.map((skill: string) => (
                                                <span key={skill} className="badge badge-lg bg-primary/10 text-primary border-primary/20 font-semibold py-4 px-4 rounded-xl">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="divider my-0 opacity-30"></div>

                                {/* Description */}
                                <div>
                                    <h4 className="font-bold text-base text-base-content mb-3">About the Role</h4>
                                    <div className="text-sm text-base-content/80 leading-relaxed whitespace-pre-wrap">
                                        {selectedJob.description}
                                    </div>
                                </div>

                                {/* Secondary Tags */}
                                {selectedJob.tags && selectedJob.tags.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-bold text-sm text-base-content/50 mb-3 uppercase tracking-wider">Job Categories</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedJob.tags.map((tag: string) => (
                                                <span key={tag} className="badge bg-base-200 border-none text-base-content/70 font-medium py-3 px-3 rounded-lg">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sticky Footer / Actions */}
                            <div className="p-4 sm:p-6 border-t border-base-content/10 flex flex-col-reverse sm:flex-row justify-end gap-3 bg-base-100 z-10 sticky bottom-0">
                                <button
                                    onClick={() => handleToggleSave(selectedJob._id || selectedJob.id)}
                                    className={`btn btn-outline border-base-content/20 rounded-xl px-6 ${savedIds.includes(selectedJob._id || selectedJob.id) ? 'bg-secondary/10 text-secondary border-secondary/30 hover:bg-secondary/20 hover:border-secondary/50' : 'bg-base-100 hover:bg-base-200'}`}
                                >
                                    {savedIds.includes(selectedJob._id || selectedJob.id) ? 'Saved in Wishlist' : 'Save for Later'}
                                </button>
                                <button
                                    onClick={() => {
                                        handleApply(selectedJob._id || selectedJob.id);
                                        const modal = document.getElementById('job_details_modal') as HTMLDialogElement;
                                        if (modal) modal.close();
                                    }}
                                    disabled={appliedIds.includes(selectedJob._id || selectedJob.id)}
                                    className="btn btn-primary rounded-xl px-8 shadow-sm"
                                >
                                    {appliedIds.includes(selectedJob._id || selectedJob.id) ? 'Applied ✓' : '1-Click Apply'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}