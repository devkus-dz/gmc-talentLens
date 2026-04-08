"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import JobCard from '@/components/ui/JobCard';
import ConfirmModal from '@/components/ui/ConfirmModal';
import CreateJobModal from './CreateJobModal';
import EditJobModal from './EditJobModal';
import api from '@/lib/api';
import { Plus, Search } from 'lucide-react';

interface RecruiterJobsClientProps {
    initialJobs: any[];
    totalPages: number;
    userId: string;
}

export default function RecruiterJobsClient({ initialJobs, totalPages, userId }: RecruiterJobsClientProps) {
    const [jobs, setJobs] = useState(initialJobs);
    const [activeTab, setActiveTab] = useState<'All' | 'Published' | 'Draft' | 'Closed'>('All');

    const [searchTerm, setSearchTerm] = useState('');
    const [isFirstRender, setIsFirstRender] = useState(true);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(totalPages > 1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [limit, setLimit] = useState(5);
    const [isChangingLimit, setIsChangingLimit] = useState(false);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<any>(null);
    const [deletingJob, setDeletingJob] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // --- NEW: Debounced Backend Search ---
    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        const fetchSearchResults = async () => {
            setIsChangingLimit(true);
            try {
                const query = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
                const res = await api.get(`/jobs?createdBy=${userId}&page=1&limit=${limit}${query}`);

                setJobs(res.data.data || []);
                setPage(1);
                setHasMore(1 < res.data.totalPages);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsChangingLimit(false);
            }
        };

        // Wait 500ms after the user stops typing before calling the API
        const timeoutId = setTimeout(() => {
            fetchSearchResults();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // --- Updated API Call with Search Query ---
    const handleLoadMore = async () => {
        if (!hasMore || isLoadingMore) return;
        setIsLoadingMore(true);
        try {
            const nextPage = page + 1;
            const query = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
            const res = await api.get(`/jobs?createdBy=${userId}&page=${nextPage}&limit=${limit}${query}`);

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

    const handleLimitChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(e.target.value);
        setLimit(newLimit);
        setPage(1);
        setIsChangingLimit(true);

        try {
            const query = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
            const res = await api.get(`/jobs?createdBy=${userId}&page=1&limit=${newLimit}${query}`);
            setJobs(res.data.data);
            setHasMore(1 < res.data.totalPages);
        } catch (error: any) {
            showToast('Failed to update items per page.', 'error');
        } finally {
            setIsChangingLimit(false);
        }
    };

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

    const handleDeleteRequest = (idOrJob: string | any) => {
        const job = typeof idOrJob === 'string' ? jobs.find(j => (j._id || j.id) === idOrJob) : idOrJob;
        if (job) {
            const applicantCount = job.applicants?.length || 0;
            if (applicantCount > 0) {
                showToast('Cannot delete a job offer that has applicants. Please close it instead.', 'error');
                return;
            }
            setEditingJob(null);
            setDeletingJob(job);
            setTimeout(() => { (document.getElementById('delete_job_modal') as HTMLDialogElement)?.showModal(); }, 50);
        }
    };

    const handleDeleteSubmit = async () => {
        setIsDeleting(true);
        try {
            const jobId = deletingJob._id || deletingJob.id;
            await api.delete(`/jobs/${jobId}`);
            setJobs(prev => prev.filter(job => (job._id || job.id) !== jobId));
            showToast('Job deleted permanently.', 'success');
            (document.getElementById('delete_job_modal') as HTMLDialogElement)?.close();
            setTimeout(() => setDeletingJob(null), 200);
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to delete job', 'error');
            (document.getElementById('delete_job_modal') as HTMLDialogElement)?.close();
            setTimeout(() => setDeletingJob(null), 200);
        } finally {
            setIsDeleting(false);
        }
    };

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
            tags: job.tags || [],
            stats: {
                applied: job.applicants?.length || 0,
                interview: job.applicants?.filter((a: any) => a.status === 'Interview').length || 0,
                offered: job.applicants?.filter((a: any) => a.status === 'Offered').length || 0,
            }
        };
    });

    // The frontend ONLY filters by the Tab now! Search happens entirely on the Backend.
    const displayedJobs = mappedJobs.filter(job => activeTab === 'All' || job.status === activeTab);
    const getTabClass = (tabName: string) => `font-semibold pb-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === tabName ? 'border-primary text-primary' : 'border-transparent text-base-content/50 hover:text-base-content/80 hover:border-base-content/20'}`;

    return (
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full animate-fade-in p-2 relative">
            {toast.show && (
                <div className="toast toast-top toast-center z-100">
                    <div className={`alert text-white shadow-lg ${toast.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <PageHeader
                title="Job Requisitions"
                description="Create, edit, and publish your job openings."
                action={
                    <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary rounded-xl shadow-md border-none w-full sm:w-auto">
                        <Plus className="w-5 h-5 mr-1" /> Post New Job
                    </button>
                }
            />

            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 text-sm mt-2 border-b border-base-content/10 pb-3">
                <div className="flex gap-6 overflow-x-auto thin-scrollbar pb-1">
                    <button onClick={() => setActiveTab('All')} className={getTabClass('All')}>All Roles <span className="badge badge-sm badge-primary badge-soft ml-1">{mappedJobs.length}</span></button>
                    <button onClick={() => setActiveTab('Published')} className={getTabClass('Published')}>Active <span className="badge badge-sm bg-base-200 border-none text-base-content/60 ml-1">{mappedJobs.filter(j => j.status === 'Published').length}</span></button>
                    <button onClick={() => setActiveTab('Draft')} className={getTabClass('Draft')}>Drafts <span className="badge badge-sm bg-base-200 border-none text-base-content/60 ml-1">{mappedJobs.filter(j => j.status === 'Draft').length}</span></button>
                    <button onClick={() => setActiveTab('Closed')} className={getTabClass('Closed')}>Closed <span className="badge badge-sm bg-base-200 border-none text-base-content/60 ml-1">{mappedJobs.filter(j => j.status === 'Closed').length}</span></button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                        <input
                            type="text"
                            placeholder="Search titles, tags, dept..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-sm input-bordered w-full pl-9 rounded-lg bg-base-100 focus:outline-primary/20"
                        />
                    </div>

                    <div className="hidden sm:block w-px h-6 bg-base-content/10"></div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <span className="text-xs font-medium opacity-60 hidden sm:inline">Show:</span>
                        <select value={limit} onChange={handleLimitChange} disabled={isChangingLimit} className="select select-bordered select-sm rounded-lg bg-base-100">
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                        </select>
                        {isChangingLimit && <span className="loading loading-spinner loading-xs ml-1 opacity-50"></span>}
                    </div>
                </div>
            </div>

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
                        {searchTerm ? 'No jobs found matching your search on the server.' : 'No jobs found in this category.'}
                    </div>
                )}

                {hasMore && activeTab === 'All' && !searchTerm && (
                    <div className="flex justify-center mt-6 mb-4">
                        <button onClick={handleLoadMore} disabled={isLoadingMore} className="btn btn-outline btn-primary rounded-xl px-10 shadow-sm">
                            {isLoadingMore ? <span className="loading loading-spinner"></span> : 'Show More Jobs'}
                        </button>
                    </div>
                )}
            </div>

            <CreateJobModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={(newJob) => { setJobs([newJob, ...jobs]); showToast('Job created successfully!', 'success'); }} />
            <EditJobModal isOpen={!!editingJob} job={editingJob} onClose={() => setEditingJob(null)} onRequestDelete={handleDeleteRequest} onSuccess={(updatedJob) => { setJobs(prev => prev.map(j => (j._id || j.id) === (updatedJob._id || updatedJob.id) ? updatedJob : j)); showToast('Job updated successfully!', 'success'); }} />

            {deletingJob && (
                <ConfirmModal id="delete_job_modal" title="Delete Job Offer" message={`Are you sure you want to permanently delete "${deletingJob?.title}"? This cannot be undone.`} confirmText="Yes, Delete Job" onConfirm={handleDeleteSubmit} isLoading={isDeleting} isDestructive={true} />
            )}
        </div>
    );
}