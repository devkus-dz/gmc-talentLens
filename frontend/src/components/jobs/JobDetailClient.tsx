"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import ConfirmModal from '@/components/ui/ConfirmModal'; // <-- IMPORTED THE MODAL

interface JobDetailClientProps {
    job: any;
    isAppliedInitially: boolean;
    isSavedInitially: boolean;
}

export default function JobDetailClient({ job, isAppliedInitially, isSavedInitially }: JobDetailClientProps) {
    const router = useRouter();
    const [isApplied, setIsApplied] = useState(isAppliedInitially);
    const [isSaved, setIsSaved] = useState(isSavedInitially);
    const [isProcessing, setIsProcessing] = useState(false); // Changed from isApplying to isProcessing for shared state

    const jobId = job._id || job.id;
    const isJobClosed = job.status?.toUpperCase() === 'CLOSED' || job.isActive === false;

    const handleApply = async () => {
        if (isApplied) return;
        setIsProcessing(true);
        try {
            await api.post(`/jobs/${jobId}/apply`);
            setIsApplied(true);
            router.refresh();
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to apply.");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- MODAL & WITHDRAWAL LOGIC ---
    const openWithdrawModal = () => {
        const modal = document.getElementById('withdraw_confirm_modal') as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    const executeWithdrawal = async () => {
        setIsProcessing(true);
        try {
            await api.delete(`/jobs/${jobId}/withdraw`);
            setIsApplied(false);

            // Close the modal upon success
            const modal = document.getElementById('withdraw_confirm_modal') as HTMLDialogElement;
            if (modal) modal.close();

            router.refresh();
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to withdraw.");

            // Close modal on failure too, so they aren't stuck
            const modal = document.getElementById('withdraw_confirm_modal') as HTMLDialogElement;
            if (modal) modal.close();
        } finally {
            setIsProcessing(false);
        }
    };
    // --------------------------------

    const handleToggleSave = async () => {
        const currentlySaved = isSaved;
        setIsSaved(!currentlySaved);
        try {
            await api.patch(`/users/saved-jobs/${jobId}`);
        } catch (error) {
            setIsSaved(currentlySaved);
            console.error("Failed to toggle save:", error);
        }
    };

    return (
        <div className="bg-base-100 rounded-4xl shadow-sm border border-base-content/5 flex flex-col relative overflow-hidden">

            {/* Header Area */}
            <div className="p-6 sm:p-10 border-b border-base-content/10 flex flex-col sm:flex-row justify-between items-start gap-6 bg-base-200/20">
                <div className="flex gap-5 items-start w-full">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-base-100 items-center justify-center flex shrink-0 border border-base-content/10 shadow-sm">
                        <span className="text-2xl sm:text-3xl font-bold text-base-content/50">
                            {(job.companyName || 'TL').substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <Link href="/candidate/jobs" className="text-xs font-bold text-base-content/40 hover:text-primary uppercase tracking-widest flex items-center gap-1 mb-2 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>
                            Back to Board
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="font-bold text-2xl sm:text-3xl leading-tight text-base-content">{job.title}</h1>
                            {isJobClosed && <span className="badge badge-error badge-sm">CLOSED</span>}
                        </div>
                        <p className="text-primary font-semibold text-base mt-2">{job.companyName || 'TalentLens Partner'} <span className="text-base-content/30 mx-2">•</span> {job.department || 'General'}</p>
                    </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden sm:flex flex-col gap-2 shrink-0 min-w-[180px]">
                    {isApplied ? (
                        <div className="flex flex-col gap-2">
                            <button className="btn btn-success text-success-content rounded-xl shadow-sm w-full no-animation pointer-events-none">
                                Applied ✓
                            </button>
                            <button
                                onClick={openWithdrawModal}
                                disabled={isProcessing || isJobClosed}
                                className="btn btn-outline btn-error btn-sm rounded-xl w-full"
                                title={isJobClosed ? "Cannot withdraw from a closed job" : "Withdraw your application"}
                            >
                                {isProcessing ? <span className="loading loading-spinner loading-xs"></span> : 'Withdraw Application'}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleApply}
                            disabled={isProcessing || isJobClosed}
                            className="btn btn-primary rounded-xl shadow-sm w-full"
                        >
                            {isProcessing ? <span className="loading loading-spinner loading-sm"></span> : isJobClosed ? 'Job Closed' : '1-Click Apply'}
                        </button>
                    )}

                    <button
                        onClick={handleToggleSave}
                        className={`btn btn-outline border-base-content/20 rounded-xl w-full mt-1 ${isSaved ? 'bg-secondary/10 text-secondary border-secondary/30' : 'bg-base-100'}`}
                    >
                        {isSaved ? 'Saved in Wishlist' : 'Save for Later'}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6 sm:p-10 flex-1 flex flex-col gap-10">

                {/* 4-Stat Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-base-200/50 p-5 rounded-2xl border border-base-content/5 flex flex-col justify-center items-center text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mb-2 text-base-content/40"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                        <span className="text-xs font-bold uppercase tracking-widest text-base-content/40 block mb-1">Location</span>
                        <span className="font-semibold text-base leading-tight text-base-content">{job.location || 'Remote'}</span>
                    </div>
                    <div className="bg-base-200/50 p-5 rounded-2xl border border-base-content/5 flex flex-col justify-center items-center text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mb-2 text-base-content/40"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>
                        <span className="text-xs font-bold uppercase tracking-widest text-base-content/40 block mb-1">Type</span>
                        <span className="font-semibold text-base leading-tight text-base-content">{job.employmentType || 'Full-time'}</span>
                    </div>
                    <div className="bg-base-200/50 p-5 rounded-2xl border border-base-content/5 flex flex-col justify-center items-center text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mb-2 text-base-content/40"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-xs font-bold uppercase tracking-widest text-base-content/40 block mb-1">Salary</span>
                        <span className="font-semibold text-base leading-tight text-base-content">{job.salaryRange || 'Competitive'}</span>
                    </div>
                    <div className="bg-base-200/50 p-5 rounded-2xl border border-base-content/5 flex flex-col justify-center items-center text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mb-2 text-base-content/40"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                        <span className="text-xs font-bold uppercase tracking-widest text-base-content/40 block mb-1">Experience</span>
                        <span className="font-semibold text-base leading-tight text-base-content">{job.minYearsOfExperience ? `${job.minYearsOfExperience}+ Yrs` : 'Entry'}</span>
                    </div>
                </div>

                {/* Core Skills */}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div>
                        <h2 className="font-bold text-xl text-base-content mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" /></svg>
                            Core Requirements
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {job.requiredSkills.map((skill: string) => (
                                <span key={skill} className="badge badge-lg bg-primary/10 text-primary border-primary/20 font-semibold py-4 px-4 rounded-xl">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Full Description */}
                <div>
                    <h2 className="font-bold text-xl text-base-content mb-4">About the Role</h2>
                    <div className="text-base text-base-content/80 leading-relaxed whitespace-pre-wrap bg-base-200/20 p-6 rounded-2xl border border-base-content/5">
                        {job.description}
                    </div>
                </div>

                {/* Categories/Tags */}
                {job.tags && job.tags.length > 0 && (
                    <div className="pt-4 border-t border-base-content/10">
                        <h4 className="font-bold text-xs text-base-content/40 mb-3 uppercase tracking-widest">Job Categories</h4>
                        <div className="flex flex-wrap gap-2">
                            {job.tags.map((tag: string) => (
                                <span key={tag} className="badge bg-base-200 border-none text-base-content/70 font-medium py-3 px-3 rounded-lg">{tag}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sticky Footer Actions */}
            <div className="sm:hidden p-4 border-t border-base-content/10 bg-base-100/95 backdrop-blur-md sticky bottom-0 z-10 flex gap-3">
                <button
                    onClick={handleToggleSave}
                    className={`btn btn-outline border-base-content/20 rounded-xl flex-1 ${isSaved ? 'bg-secondary/10 text-secondary border-secondary/30' : 'bg-base-100'}`}
                >
                    {isSaved ? 'Saved' : 'Save'}
                </button>

                {isApplied ? (
                    <button
                        onClick={openWithdrawModal}
                        disabled={isProcessing || isJobClosed}
                        className="btn btn-error btn-outline rounded-xl shadow-sm flex-1"
                    >
                        {isProcessing ? <span className="loading loading-spinner loading-sm"></span> : 'Withdraw'}
                    </button>
                ) : (
                    <button
                        onClick={handleApply}
                        disabled={isProcessing || isJobClosed}
                        className="btn btn-primary rounded-xl shadow-sm flex-1"
                    >
                        {isProcessing ? <span className="loading loading-spinner loading-sm"></span> : isJobClosed ? 'Closed' : 'Apply'}
                    </button>
                )}
            </div>

            {/* THE WITHDRAWAL CONFIRMATION MODAL */}
            <ConfirmModal
                id="withdraw_confirm_modal"
                title="Withdraw Application?"
                message="Are you sure you want to withdraw your application for this role? You can re-apply later as long as the job offer remains open."
                confirmText="Yes, Withdraw"
                cancelText="Keep Application"
                onConfirm={executeWithdrawal}
                isLoading={isProcessing}
                isDestructive={true}
            />

        </div>
    );
}