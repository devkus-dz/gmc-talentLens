"use client";

import React, { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { ArrowLeft, MapPin, Briefcase, CircleDollarSign, Clock, CheckCircle2 } from 'lucide-react';

/**
 * @interface JobDetailClientProps
 * @property {any} job - The job offer data object.
 * @property {boolean} [isAppliedInitially] - Whether the candidate has already applied.
 * @property {boolean} [isSavedInitially] - Whether the candidate has saved the job.
 * @property {boolean} [isAdminMode] - If true, hides all candidate-specific actions (Apply, Save, Withdraw).
 */
export interface JobDetailClientProps {
    job: any;
    isAppliedInitially?: boolean;
    isSavedInitially?: boolean;
    isAdminMode?: boolean;
}

/**
 * Renders the detailed view of a Job Offer.
 * Can be used as a standalone page (Candidate) or inside a modal (Admin/Recruiter).
 * @component
 * @param {JobDetailClientProps} props
 * @returns {JSX.Element}
 */
export default function JobDetailClient({
    job,
    isAppliedInitially = false,
    isSavedInitially = false,
    isAdminMode = false
}: JobDetailClientProps): JSX.Element {

    const router = useRouter();
    const [isApplied, setIsApplied] = useState<boolean>(isAppliedInitially);
    const [isSaved, setIsSaved] = useState<boolean>(isSavedInitially);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const jobId = job._id || job.id;
    const isJobClosed = job.status?.toUpperCase() === 'CLOSED' || job.isActive === false;

    /**
     * Handles the "1-Click Apply" action for Candidates.
     * @returns {Promise<void>}
     */
    const handleApply = async (): Promise<void> => {
        if (isApplied || isAdminMode) return;
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

    /**
     * Opens the withdrawal confirmation modal.
     * @returns {void}
     */
    const openWithdrawModal = (): void => {
        const modal = document.getElementById('withdraw_confirm_modal') as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    /**
     * Executes the application withdrawal process.
     * @returns {Promise<void>}
     */
    const executeWithdrawal = async (): Promise<void> => {
        setIsProcessing(true);
        try {
            await api.delete(`/jobs/${jobId}/withdraw`);
            setIsApplied(false);
            const modal = document.getElementById('withdraw_confirm_modal') as HTMLDialogElement;
            if (modal) modal.close();
            router.refresh();
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to withdraw.");
            const modal = document.getElementById('withdraw_confirm_modal') as HTMLDialogElement;
            if (modal) modal.close();
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Toggles the "Saved" status of the job for the Candidate.
     * @returns {Promise<void>}
     */
    const handleToggleSave = async (): Promise<void> => {
        if (isAdminMode) return;
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
                        {!isAdminMode && (
                            <Link href="/candidate/jobs" className="text-xs font-bold text-base-content/40 hover:text-primary uppercase tracking-widest flex items-center gap-1 mb-2 transition-colors w-max">
                                <ArrowLeft className="w-3 h-3" />
                                Back to Board
                            </Link>
                        )}
                        <div className="flex items-center gap-3">
                            <h1 className="font-bold text-2xl sm:text-3xl leading-tight text-base-content">{job.title}</h1>
                            {isJobClosed && <span className="badge badge-error badge-sm">CLOSED</span>}
                        </div>
                        <p className="text-primary font-semibold text-base mt-2">{job.companyName || 'TalentLens Partner'} <span className="text-base-content/30 mx-2">•</span> {job.department || 'General'}</p>
                    </div>
                </div>

                {/* Desktop Action Buttons (Hidden in Admin Mode) */}
                {!isAdminMode && (
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
                )}
            </div>

            {/* Main Content Area */}
            <div className="p-6 sm:p-10 flex-1 flex flex-col gap-10">

                {/* 4-Stat Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-base-200/50 p-5 rounded-2xl border border-base-content/5 flex flex-col justify-center items-center text-center">
                        <MapPin className="w-6 h-6 mb-2 text-base-content/40" />
                        <span className="text-xs font-bold uppercase tracking-widest text-base-content/40 block mb-1">Location</span>
                        <span className="font-semibold text-base leading-tight text-base-content">{job.location || 'Remote'}</span>
                    </div>
                    <div className="bg-base-200/50 p-5 rounded-2xl border border-base-content/5 flex flex-col justify-center items-center text-center">
                        <Briefcase className="w-6 h-6 mb-2 text-base-content/40" />
                        <span className="text-xs font-bold uppercase tracking-widest text-base-content/40 block mb-1">Type</span>
                        <span className="font-semibold text-base leading-tight text-base-content">{job.employmentType || 'Full-time'}</span>
                    </div>
                    <div className="bg-base-200/50 p-5 rounded-2xl border border-base-content/5 flex flex-col justify-center items-center text-center">
                        <CircleDollarSign className="w-6 h-6 mb-2 text-base-content/40" />
                        <span className="text-xs font-bold uppercase tracking-widest text-base-content/40 block mb-1">Salary</span>
                        <span className="font-semibold text-base leading-tight text-base-content">{job.salaryRange || 'Competitive'}</span>
                    </div>
                    <div className="bg-base-200/50 p-5 rounded-2xl border border-base-content/5 flex flex-col justify-center items-center text-center">
                        <Clock className="w-6 h-6 mb-2 text-base-content/40" />
                        <span className="text-xs font-bold uppercase tracking-widest text-base-content/40 block mb-1">Experience</span>
                        <span className="font-semibold text-base leading-tight text-base-content">{job.minYearsOfExperience ? `${job.minYearsOfExperience}+ Yrs` : 'Entry'}</span>
                    </div>
                </div>

                {/* Core Skills */}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div>
                        <h2 className="font-bold text-xl text-base-content mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-primary" />
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

            {/* Mobile Sticky Footer Actions (Hidden in Admin Mode) */}
            {!isAdminMode && (
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
            )}

            {/* THE WITHDRAWAL CONFIRMATION MODAL */}
            {!isAdminMode && (
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
            )}

        </div>
    );
}