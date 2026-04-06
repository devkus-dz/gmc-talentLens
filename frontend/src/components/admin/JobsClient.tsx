"use client";

import React, { useState, useMemo, JSX } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import DataTable from '@/components/ui/DataTable';
import ConfirmModal from '@/components/ui/ConfirmModal';
import JobDetailClient from '@/components/jobs/JobDetailClient';
import { Ellipsis, AlertCircle } from 'lucide-react';

interface JobsClientProps {
    initialJobs: any[];
    currentPage: number;
    limit: number;
    totalRecords: number;
    currentSearch: string;
}

export default function JobsClient({
    initialJobs,
    currentPage,
    limit,
    totalRecords,
    currentSearch
}: JobsClientProps): JSX.Element {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [isEditSubmitting, setIsEditSubmitting] = useState<boolean>(false);
    const [isActionSubmitting, setIsActionSubmitting] = useState<boolean>(false);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({ show: false, message: '', type: 'success' });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success'): void => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const updateUrlState = (newPage: number, newLimit: number, newSearch: string, activeFilters?: Record<string, any>): void => {
        // Clone current params so we don't lose filters when paginating or searching
        const params = new URLSearchParams(searchParams.toString());

        params.set('page', newPage.toString());
        params.set('limit', newLimit.toString());

        if (newSearch) {
            params.set('search', newSearch);
        } else {
            params.delete('search');
        }

        if (activeFilters !== undefined) {
            params.delete('status');

            Object.keys(activeFilters).forEach(key => {
                if (activeFilters[key]) {
                    params.set(key, activeFilters[key]);
                }
            });
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const openViewModal = (job: any): void => {
        setSelectedJob(job);
        (document.getElementById('view_job_modal') as HTMLDialogElement)?.showModal();
    };

    const openEditModal = (job: any): void => {
        setSelectedJob({ ...job, status: job.status || (job.isActive ? 'PUBLISHED' : 'DRAFT') });
        (document.getElementById('edit_job_modal') as HTMLDialogElement)?.showModal();
    };

    const openDeleteModal = (job: any): void => {
        setSelectedJob(job);
        (document.getElementById('delete_job_modal') as HTMLDialogElement)?.showModal();
    };

    const closeModals = (): void => {
        setSelectedJob(null);
        (document.getElementById('view_job_modal') as HTMLDialogElement)?.close();
        (document.getElementById('edit_job_modal') as HTMLDialogElement)?.close();
        (document.getElementById('delete_job_modal') as HTMLDialogElement)?.close();
        router.refresh();
    };

    const handleEditSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setIsEditSubmitting(true);
        try {
            await api.patch(`/jobs/${selectedJob._id || selectedJob.id}`, selectedJob);
            closeModals();
            showToast("Job offer updated successfully", "success");
        } catch (error: any) {
            // Displays the exact backend message (e.g., "Change status to DRAFT first")
            showToast(error.response?.data?.message || "Failed to update job offer", "error");
        } finally {
            setIsEditSubmitting(false);
        }
    };

    const handleDelete = async (): Promise<void> => {
        setIsActionSubmitting(true);
        try {
            await api.delete(`/jobs/${selectedJob._id || selectedJob.id}`);
            closeModals();
            showToast("Job offer deleted successfully", "success");
        } catch (error) {
            showToast("Failed to delete job offer", "error");
            closeModals();
        } finally {
            setIsActionSubmitting(false);
        }
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'title',
            header: 'Job Title',
            cell: (info: any) => <span className="font-bold">{info.getValue()}</span>
        },
        {
            accessorKey: 'companyName',
            header: 'Company',
            cell: (info: any) => info.getValue() || 'Platform'
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: (info: any) => info.getValue() || 'Remote'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info: any) => {
                const status = info.getValue()?.toUpperCase();
                if (status === 'PUBLISHED') return <span className="badge badge-success badge-sm text-success-content">Published</span>;
                if (status === 'DRAFT') return <span className="badge badge-warning badge-sm">Draft</span>;
                return <span className="badge badge-ghost badge-sm">Closed</span>;
            }
        },
        {
            accessorKey: 'createdAt',
            header: 'Posted On',
            cell: (info: any) => new Date(info.getValue()).toLocaleDateString()
        },
        {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            cell: ({ row, table }: any) => {
                const totalRows = table.getRowModel().rows.length;
                const isNearBottom = row.index >= totalRows - 2 && totalRows > 3;

                return (
                    <div className={`dropdown dropdown-end ${isNearBottom ? 'dropdown-top' : ''}`}>
                        <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-primary">
                            <Ellipsis className="w-5 h-5" />
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-100 menu p-2 shadow-xl bg-base-100 rounded-2xl w-40 border border-base-content/10 mt-1 mb-1">
                            <li><button onClick={() => openViewModal(row.original)} className="font-medium text-primary">View Details</button></li>
                            <li><button onClick={() => openEditModal(row.original)} className="font-medium">Quick Edit</button></li>
                            <div className="divider my-0"></div>
                            <li><button onClick={() => openDeleteModal(row.original)} className="text-error font-medium">Delete</button></li>
                        </ul>
                    </div>
                );
            }
        }
    ], []);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in pb-20 relative">
            {toast.show && (
                <div className="toast toast-top toast-center z-100">
                    <div className={`alert text-white shadow-lg ${toast.type === 'error' ? 'alert-error' : toast.type === 'info' ? 'alert-info' : 'alert-success'}`}>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Platform Job Offers</h1>
                    <p className="text-base-content/60 text-sm mt-1">Moderate and manage all job postings created by recruiters.</p>
                </div>
            </div>

            <div className="bg-base-100 rounded-4xl border border-base-content/5 shadow-sm p-4 sm:p-6 overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={initialJobs}
                    initialSearchValue={currentSearch}
                    onSearchSubmit={(val: string) => updateUrlState(1, limit, val)}
                    filterConfigs={[
                        {
                            id: 'status',
                            label: 'Job Status',
                            type: 'select',
                            options: [
                                { label: 'Published (Active)', value: 'PUBLISHED' },
                                { label: 'Draft', value: 'DRAFT' },
                                { label: 'Closed', value: 'CLOSED' }
                            ]
                        }
                    ]}
                    onFilterSubmit={(filters: Record<string, any>) => updateUrlState(1, limit, currentSearch, filters)}
                    totalRecords={totalRecords}
                    pageIndex={currentPage}
                    pageSize={limit}
                    onPageChange={(page) => updateUrlState(page, limit, currentSearch)}
                    onPageSizeChange={(size) => updateUrlState(1, size, currentSearch)}
                />
            </div>

            {/* --- VIEW DETAILS MODAL --- */}
            <dialog id="view_job_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-0 max-w-4xl bg-transparent shadow-none relative">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-100 bg-base-100/50 hover:bg-base-200 shadow-sm" onClick={closeModals}>✕</button>
                    </form>
                    {selectedJob && <JobDetailClient job={selectedJob} isAdminMode={true} />}
                </div>
                <form method="dialog" className="modal-backdrop"><button onClick={closeModals}>close</button></form>
            </dialog>

            {/* --- EDIT MODAL (WITH STATUS CONTROL) --- */}
            <dialog id="edit_job_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-6 rounded-3xl">
                    <h3 className="font-bold text-lg mb-4">Quick Edit Job Offer</h3>
                    {selectedJob && (
                        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">

                            {/* Explicit warning for Admins about the Draft rule */}
                            {selectedJob.status === 'PUBLISHED' && (
                                <div className="alert alert-warning shadow-sm rounded-xl py-2 px-4 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span className="text-xs font-medium">To modify job details, you must first change the status to <b>DRAFT</b> and save.</span>
                                </div>
                            )}

                            <div className="form-control">
                                <label className="label text-xs font-bold opacity-60">Status</label>
                                <select
                                    value={selectedJob.status}
                                    onChange={e => setSelectedJob({
                                        ...selectedJob,
                                        status: e.target.value,
                                        isActive: e.target.value === 'PUBLISHED'
                                    })}
                                    className="select select-bordered w-full rounded-xl bg-base-100"
                                >
                                    <option value="PUBLISHED">Published (Active)</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label text-xs font-bold opacity-60">Job Title</label>
                                <input type="text" value={selectedJob.title} onChange={e => setSelectedJob({ ...selectedJob, title: e.target.value })} className="input input-bordered w-full rounded-xl" required disabled={selectedJob.status === 'PUBLISHED'} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label text-xs font-bold opacity-60">Department</label>
                                    <input type="text" value={selectedJob.department || ''} onChange={e => setSelectedJob({ ...selectedJob, department: e.target.value })} className="input input-bordered w-full rounded-xl" disabled={selectedJob.status === 'PUBLISHED'} />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs font-bold opacity-60">Location</label>
                                    <input type="text" value={selectedJob.location || ''} onChange={e => setSelectedJob({ ...selectedJob, location: e.target.value })} className="input input-bordered w-full rounded-xl" disabled={selectedJob.status === 'PUBLISHED'} />
                                </div>
                            </div>

                            <div className="modal-action mt-4">
                                <button type="button" className="btn btn-ghost rounded-xl" onClick={closeModals}>Cancel</button>
                                <button type="submit" disabled={isEditSubmitting} className="btn btn-primary rounded-xl px-8">
                                    {isEditSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop"><button onClick={closeModals}>close</button></form>
            </dialog>

            {/* --- DELETE MODAL --- */}
            <ConfirmModal
                id="delete_job_modal"
                title="Delete Job Offer"
                message={`Are you sure you want to delete ${selectedJob?.title}?`}
                confirmText="Delete Job"
                onConfirm={handleDelete}
                isLoading={isActionSubmitting}
                isDestructive={true}
            />
        </div>
    );
}