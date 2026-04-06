"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import JobCard from '@/components/ui/JobCard';
import ConfirmModal from '@/components/ui/ConfirmModal';
import CreateJobModal from './CreateJobModal';
import EditJobModal from './EditJobModal';
import api from '@/lib/api';
import { Plus } from 'lucide-react';

interface RecruiterJobsClientProps {
    initialJobs: any[];
    totalPages: number;
    userId: string;
}

export default function RecruiterJobsClient({ initialJobs, totalPages, userId }: RecruiterJobsClientProps) {
    const [jobs, setJobs] = useState(initialJobs);
    const [activeTab, setActiveTab] = useState<'All' | 'Published' | 'Draft' | 'Closed'>('All');

    // --- Pagination State ---
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(totalPages > 1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // --- Limit State ---
    const [limit, setLimit] = useState(5);
    const [isChangingLimit, setIsChangingLimit] = useState(false);

    // --- Modals State ---
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<any>(null);
    const [deletingJob, setDeletingJob] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Global Toast for Success messages
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // --- Data Formatting for Job Cards ---
    const mappedJobs = jobs.map(job => {
        const statusMap: Record<string, 'Published' | 'Draft' | 'Closed'> = {
            PUBLISHED: 'Published', DRAFT: 'Draft', CLOSED: 'Closed'
        };
        return {
            id: job._id || job.id,
            title: job.title,
            department: job.department || 'General',
            location: job.location || 'Remote',
            createdAt: new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            status: statusMap[job.status] || 'Draft',
            stats: {
                applied: job.applicants?.length || 0,
                interview: job.applicants?.filter((a: any) => a.status === 'Interview').length || 0,
                offered: job.applicants?.filter((a: any) => a.status === 'Offered').length || 0,
            }
        };
    });

    const displayedJobs = mappedJobs.filter(job => activeTab === 'All' || job.status === activeTab);
    const getTabClass = (tabName: string) => `pb-1 transition-colors ${activeTab === tabName ? 'text-primary border-b-2 border-primary font-bold' : 'text-base-content/50 hover:text-base-content'}`;

    // --- Actions ---
    const handleChangeStatus = async (id: string, newStatus: 'Published' | 'Draft' | 'Closed') => {
        const backendStatus = newStatus.toUpperCase();
        try {
            await api.patch(`/jobs/${id}`, { status: backendStatus });
            setJobs(prev => prev.map(job => (job._id || job.id) === id ? { ...job, status: backendStatus } : job));
            showToast(`Job moved to ${newStatus}`, 'success');
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to update status', 'error');
        }
    };

    // CLASSIC DOM DELETE LOGIC
    const handleDeleteRequest = (idOrJob: string | any) => {
        const job = typeof idOrJob === 'string' ? jobs.find(j => (j._id || j.id) === idOrJob) : idOrJob;
        if (job) {
            const applicantCount = job.applicants?.length || 0;
            if (applicantCount > 0) {
                showToast('Cannot delete a job offer that has applicants. Please close it instead.', 'error');
                return;
            }

            setEditingJob(null); // Close edit modal if it was open
            setDeletingJob(job); // Set the state so the ConfirmModal renders

            // Wait a tiny fraction of a second for React to render the modal, then trigger the DOM open event
            setTimeout(() => {
                (document.getElementById('delete_job_modal') as HTMLDialogElement)?.showModal();
            }, 50);
        }
    };

    const handleDeleteSubmit = async () => {
        setIsDeleting(true);
        try {
            const jobId = deletingJob._id || deletingJob.id;
            await api.delete(`/jobs/${jobId}`);
            setJobs(prev => prev.filter(job => (job._id || job.id) !== jobId));
            showToast('Job deleted permanently.', 'success');

            // Close via DOM
            (document.getElementById('delete_job_modal') as HTMLDialogElement)?.close();

            // Clear state after modal close animation finishes
            setTimeout(() => setDeletingJob(null), 200);
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to delete job', 'error');
            (document.getElementById('delete_job_modal') as HTMLDialogElement)?.close();
            setTimeout(() => setDeletingJob(null), 200);
        } finally {
            setIsDeleting(false);
        }
    };

    // --- Load More Action ---
    const handleLoadMore = async () => {
        if (!hasMore || isLoadingMore) return;
        setIsLoadingMore(true);
        try {
            const nextPage = page + 1;
            const res = await api.get(`/jobs?createdBy=${userId}&page=${nextPage}&limit=${limit}`);

            const newJobs = res.data.data;
            setJobs(prev => [...prev, ...newJobs]);

            setPage(nextPage);
            setHasMore(nextPage < res.data.totalPages);
        } catch (error: any) {
            showToast('Failed to load more jobs.', 'error');
        } finally {
            setIsLoadingMore(false);
        }
    };

    // --- Handle Limit Change ---
    const handleLimitChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(e.target.value);
        setLimit(newLimit);
        setPage(1); // Reset back to page 1
        setIsChangingLimit(true);

        try {
            // Fetch fresh data with the new limit
            const res = await api.get(`/jobs?createdBy=${userId}&page=1&limit=${newLimit}`);
            setJobs(res.data.data); // Replace the entire list
            setHasMore(1 < res.data.totalPages);
        } catch (error: any) {
            showToast('Failed to update items per page.', 'error');
        } finally {
            setIsChangingLimit(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full animate-fade-in p-2 relative">

            {/* Global Success/Simple Error Toast (Center) */}
            {toast.show && (
                <div className="toast toast-top toast-center z-100">
                    <div className={`alert text-white shadow-lg ${toast.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <PageHeader
                title="Manage Jobs"
                description="Create, edit, and publish your job openings."
                action={
                    <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary rounded-xl shadow-md bg-linear-to-r from-primary to-secondary border-none w-full sm:w-auto">
                        <Plus className="w-5 h-5 mr-1" /> Post New Job
                    </button>
                }
            />

            {/* Tabs Menu & Limit Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm mt-2 border-b border-base-content/10 pb-2">
                <div className="flex gap-6 overflow-x-auto thin-scrollbar">
                    <button onClick={() => setActiveTab('All')} className={getTabClass('All')}>All Roles <span className="badge badge-sm badge-primary badge-soft ml-1">{mappedJobs.length}</span></button>
                    <button onClick={() => setActiveTab('Published')} className={getTabClass('Published')}>Active <span className="badge badge-sm bg-base-200 border-none text-base-content/60 ml-1">{mappedJobs.filter(j => j.status === 'Published').length}</span></button>
                    <button onClick={() => setActiveTab('Draft')} className={getTabClass('Draft')}>Drafts <span className="badge badge-sm bg-base-200 border-none text-base-content/60 ml-1">{mappedJobs.filter(j => j.status === 'Draft').length}</span></button>
                    <button onClick={() => setActiveTab('Closed')} className={getTabClass('Closed')}>Closed <span className="badge badge-sm bg-base-200 border-none text-base-content/60 ml-1">{mappedJobs.filter(j => j.status === 'Closed').length}</span></button>
                </div>

                {/* --- NEW: Items Per Page Dropdown --- */}
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-medium opacity-60">Show:</span>
                    <select
                        value={limit}
                        onChange={handleLimitChange}
                        disabled={isChangingLimit}
                        className="select select-bordered select-sm rounded-lg bg-base-100"
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                    {isChangingLimit && <span className="loading loading-spinner loading-xs ml-1 opacity-50"></span>}
                </div>
            </div>

            {/* Jobs List */}
            <div className="flex flex-col gap-4 mt-2">
                {displayedJobs.map(job => (
                    <JobCard
                        key={job.id}
                        {...job}
                        onChangeStatus={handleChangeStatus}
                        onEdit={(id) => setEditingJob(jobs.find(j => (j._id || j.id) === id))}
                        onDelete={handleDeleteRequest}
                    />
                ))}

                {displayedJobs.length === 0 && (
                    <div className="text-center py-12 text-base-content/50 font-medium bg-base-200/20 rounded-2xl border border-dashed border-base-content/20">
                        No jobs found in this category.
                    </div>
                )}

                {/* --- Show More Button --- */}
                {hasMore && activeTab === 'All' && (
                    <div className="flex justify-center mt-6 mb-4">
                        <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="btn btn-outline btn-primary rounded-xl px-10 shadow-sm"
                        >
                            {isLoadingMore ? <span className="loading loading-spinner"></span> : 'Show More Jobs'}
                        </button>
                    </div>
                )}
            </div>

            {/* --- MODALS --- */}
            <CreateJobModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={(newJob) => { setJobs([newJob, ...jobs]); showToast('Job created successfully!', 'success'); }}
            />

            <EditJobModal
                isOpen={!!editingJob}
                job={editingJob}
                onClose={() => setEditingJob(null)}
                onRequestDelete={handleDeleteRequest}
                onSuccess={(updatedJob) => {
                    setJobs(prev => prev.map(j => (j._id || j.id) === (updatedJob._id || updatedJob.id) ? updatedJob : j));
                    showToast('Job updated successfully!', 'success');
                }}
            />

            {/* OLD ConfirmModal called cleanly with DOM strategy */}
            {deletingJob && (
                <ConfirmModal
                    id="delete_job_modal"
                    title="Delete Job Offer"
                    message={`Are you sure you want to permanently delete "${deletingJob?.title}"? This cannot be undone.`}
                    confirmText="Yes, Delete Job"
                    onConfirm={handleDeleteSubmit}
                    isLoading={isDeleting}
                    isDestructive={true}
                />
            )}
        </div>
    );
}