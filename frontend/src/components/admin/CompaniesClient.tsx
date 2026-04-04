"use client";

import React, { useState, useMemo, JSX } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import DataTable from '@/components/ui/DataTable';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ProvisionClientForm from '@/components/forms/ProvisionClientForm';
import { Ellipsis } from 'lucide-react';

/**
 * @interface CompaniesClientProps
 * @property {any[]} initialCompanies - Paginated array of company objects.
 * @property {number} currentPage - Current active page.
 * @property {number} limit - Current rows per page.
 * @property {number} totalRecords - Total count of companies in DB.
 * @property {string} currentSearch - Current search query.
 */
interface CompaniesClientProps {
    initialCompanies: any[];
    currentPage: number;
    limit: number;
    totalRecords: number;
    currentSearch: string;
}

/**
 * Interactive Companies dashboard interface.
 * @component
 * @param {CompaniesClientProps} props - Initial state from Server Component.
 * @returns {JSX.Element}
 */
export default function CompaniesClient({
    initialCompanies,
    currentPage,
    limit,
    totalRecords,
    currentSearch
}: CompaniesClientProps): JSX.Element {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [isEditSubmitting, setIsEditSubmitting] = useState<boolean>(false);
    const [isActionSubmitting, setIsActionSubmitting] = useState<boolean>(false);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({ show: false, message: '', type: 'success' });

    /**
     * @param {string} message - Message to display.
     * @param {'success' | 'error' | 'info'} [type='success'] - Styling type.
     * @returns {void}
     */
    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success'): void => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    /**
         * Updates URL state to trigger Server Component refetch.
         * Creates a fresh URL parameter state to cleanly remove cleared filters.
         */
    const updateUrlState = (newPage: number, newLimit: number, newSearch: string, activeFilters: Record<string, any> = {}): void => {
        const params = new URLSearchParams();
        params.set('page', newPage.toString());
        params.set('limit', newLimit.toString());

        if (newSearch) params.set('search', newSearch);

        Object.keys(activeFilters).forEach(key => {
            if (activeFilters[key]) params.set(key, activeFilters[key]);
        });

        router.push(`${pathname}?${params.toString()}`);
    };

    /**
     * @returns {void}
     */
    const openProvisionModal = (): void => {
        (document.getElementById('provision_modal') as HTMLDialogElement)?.showModal();
    };

    /**
         * @param {any} company 
         * @returns {void}
         */
    const openEditModal = (company: any): void => {
        setSelectedCompany(company);
        setLogoFile(null);
        setLogoPreview(company.logoUrl || null);
        (document.getElementById('edit_modal') as HTMLDialogElement)?.showModal();
    };

    /**
     * @param {any} company - Company to delete.
     * @returns {void}
     */
    const openDeleteModal = (company: any): void => {
        setSelectedCompany(company);
        (document.getElementById('delete_confirm_modal') as HTMLDialogElement)?.showModal();
    };

    /**
     * @returns {void}
     */
    const closeModals = (): void => {
        setSelectedCompany(null);
        (document.getElementById('provision_modal') as HTMLDialogElement)?.close();
        (document.getElementById('edit_modal') as HTMLDialogElement)?.close();
        (document.getElementById('delete_confirm_modal') as HTMLDialogElement)?.close();
        router.refresh();
    };

    /**
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     * @returns {void}
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    /**
         * @async
         * @param {React.FormEvent} e 
         * @returns {Promise<void>}
         */
    const handleEditSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setIsEditSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', selectedCompany.name);
            if (selectedCompany.industry) formData.append('industry', selectedCompany.industry);
            if (selectedCompany.location) formData.append('location', selectedCompany.location);
            if (selectedCompany.website) formData.append('website', selectedCompany.website);
            if (selectedCompany.description) formData.append('description', selectedCompany.description);
            if (logoFile) formData.append('logo', logoFile);

            await api.patch(`/admin/companies/${selectedCompany._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            closeModals();
            showToast("Company updated successfully", "success");
        } catch (error) {
            showToast("Failed to update company", "error");
        } finally {
            setIsEditSubmitting(false);
        }
    };

    /**
     * @async
     * @returns {Promise<void>}
     */
    const handleDelete = async (): Promise<void> => {
        setIsActionSubmitting(true);
        try {
            await api.delete(`/admin/companies/${selectedCompany._id}`);
            closeModals();
            showToast("Company deleted successfully", "success");
        } catch (error) {
            showToast("Failed to delete company", "error");
            closeModals();
        } finally {
            setIsActionSubmitting(false);
        }
    };

    /**
         * @type {Array<Object>}
         */
    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Company',
            cell: ({ row }: any) => {
                const company = row.original;
                return (
                    <div className="flex items-center gap-4">
                        <div className="avatar placeholder">
                            {company.logoUrl ? (
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-base-content/10 shadow-sm p-1.5 flex items-center justify-center shrink-0">
                                    <img src={company.logoUrl} alt={company.name} className="object-contain w-full h-full" />
                                </div>
                            ) : (
                                <div className="bg-primary/10 text-primary rounded-xl w-14 h-14 flex items-center justify-center font-bold text-xl border border-primary/20 shadow-sm shrink-0">
                                    <span>{company.name.substring(0, 2).toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="font-bold text-base-content text-base">{company.name}</div>
                            {company.website && (
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-primary hover:underline"
                                >
                                    {company.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: 'industry',
            header: 'Industry',
            cell: (info: any) => info.getValue() || 'N/A'
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: (info: any) => (
                <span className="truncate max-w-[150px] inline-block">
                    {info.getValue() || 'N/A'}
                </span>
            )
        },
        {
            accessorKey: 'createdAt',
            header: 'Joined',
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
                            <li><button onClick={() => openEditModal(row.original)} className="font-medium">Edit Details</button></li>
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-base-content">B2B Clients</h1>
                    <p className="text-base-content/60 text-sm mt-1">Manage onboarded companies and their workspaces.</p>
                </div>
                <button onClick={openProvisionModal} className="btn btn-primary rounded-xl w-full sm:w-auto shadow-sm min-h-[44px]">
                    Provision New Client
                </button>
            </div>

            <div className="bg-base-100 rounded-4xl border border-base-content/5 shadow-sm p-4 overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={initialCompanies}
                    initialSearchValue={currentSearch}
                    onSearchSubmit={(val: string) => updateUrlState(1, limit, val)}

                    filterConfigs={[]}
                    onFilterSubmit={(filters: Record<string, any>) => updateUrlState(1, limit, currentSearch, filters)}

                    totalRecords={totalRecords}
                    pageIndex={currentPage}
                    pageSize={limit}
                    onPageChange={(page) => updateUrlState(page, limit, currentSearch)}
                    onPageSizeChange={(size) => updateUrlState(1, size, currentSearch)}
                />
            </div>

            <dialog id="provision_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-0 max-w-4xl bg-transparent shadow-none">
                    <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-50 text-base-content/50" onClick={closeModals}>✕</button></form>
                    <ProvisionClientForm onSuccess={() => { closeModals(); showToast("Company successfully provisioned!", "success"); }} />
                </div>
                <form method="dialog" className="modal-backdrop"><button onClick={closeModals}>close</button></form>
            </dialog>

            <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-6 rounded-3xl max-w-2xl">
                    <h3 className="font-bold text-lg mb-6">Edit Company Details</h3>
                    {selectedCompany && (
                        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">

                            <div className="flex flex-col sm:flex-row gap-6 mb-2 items-center sm:items-start">
                                <div
                                    className="w-24 h-24 rounded-2xl border-2 border-dashed border-base-content/20 flex flex-col items-center justify-center bg-base-200/50 cursor-pointer hover:bg-base-200 transition-colors relative overflow-hidden shrink-0"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" className="w-full h-full p-1 object-contain overflow-hidden bg-white flex items-center justify-center shrink-0" />
                                    ) : (
                                        <span className="text-[10px] font-bold text-base-content/50 uppercase">Logo</span>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="label text-xs font-bold opacity-60">Company Name *</label>
                                    <input type="text" value={selectedCompany.name} onChange={e => setSelectedCompany({ ...selectedCompany, name: e.target.value })} className="input input-bordered w-full rounded-xl" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label text-xs font-bold opacity-60">Website</label>
                                    <input type="url" value={selectedCompany.website || ''} onChange={e => setSelectedCompany({ ...selectedCompany, website: e.target.value })} className="input input-bordered w-full rounded-xl" />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs font-bold opacity-60">Industry</label>
                                    <input type="text" value={selectedCompany.industry || ''} onChange={e => setSelectedCompany({ ...selectedCompany, industry: e.target.value })} className="input input-bordered w-full rounded-xl" />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs font-bold opacity-60">Location</label>
                                    <input type="text" value={selectedCompany.location || ''} onChange={e => setSelectedCompany({ ...selectedCompany, location: e.target.value })} className="input input-bordered w-full rounded-xl" />
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label text-xs font-bold opacity-60">Company Description</label>
                                <textarea value={selectedCompany.description || ''} onChange={e => setSelectedCompany({ ...selectedCompany, description: e.target.value })} className="textarea textarea-bordered w-full rounded-xl h-24"></textarea>
                            </div>
                            <div className="modal-action mt-6">
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

            <ConfirmModal
                id="delete_confirm_modal"
                title="Delete Company"
                message={`Are you sure you want to delete ${selectedCompany?.name}? This action cannot be undone.`}
                confirmText="Delete Company"
                onConfirm={handleDelete}
                isLoading={isActionSubmitting}
                isDestructive={true}
            />
        </div>
    );
}