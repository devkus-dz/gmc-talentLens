"use client";

import React, { useState, useMemo, JSX } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import DataTable from '@/components/ui/DataTable';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Ellipsis } from 'lucide-react';

/**
 * @interface UsersClientProps
 * @property {any[]} initialUsers - Paginated array of user objects.
 * @property {any[]} companies - Array of available companies.
 * @property {number} currentPage - Current active page.
 * @property {number} limit - Current rows per page.
 * @property {number} totalRecords - Total count of users in DB.
 * @property {string} currentSearch - Current search query.
 */
interface UsersClientProps {
    initialUsers: any[];
    companies: any[];
    currentPage: number;
    limit: number;
    totalRecords: number;
    currentSearch: string;
}

/**
 * Interactive Users dashboard interface utilizing the DataTable component.
 * Features dynamic dropdown positioning to prevent table overflow clipping.
 * @component
 * @param {UsersClientProps} props - Initial state from Server Component.
 * @returns {JSX.Element}
 */
export default function UsersClient({
    initialUsers,
    companies,
    currentPage,
    limit,
    totalRecords,
    currentSearch
}: UsersClientProps): JSX.Element {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEditSubmitting, setIsEditSubmitting] = useState<boolean>(false);
    const [isActionSubmitting, setIsActionSubmitting] = useState<boolean>(false);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({ show: false, message: '', type: 'success' });

    /**
     * Triggers a temporary toast notification.
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

        if (newSearch) {
            params.set('search', newSearch);
        }

        // Apply only the explicitly active filters
        Object.keys(activeFilters).forEach(key => {
            if (activeFilters[key]) {
                params.set(key, activeFilters[key]);
            }
        });

        router.push(`${pathname}?${params.toString()}`);
    };

    /**
     * @param {any} user - User to edit.
     * @returns {void}
     */
    const openEditModal = (user: any): void => {
        setSelectedUser({ ...user, companyId: user.companyId?._id || user.companyId || '' });
        (document.getElementById('edit_user_modal') as HTMLDialogElement)?.showModal();
    };

    /**
     * @param {any} user - User to delete.
     * @returns {void}
     */
    const openDeleteModal = (user: any): void => {
        setSelectedUser(user);
        (document.getElementById('delete_user_modal') as HTMLDialogElement)?.showModal();
    };

    /**
     * @param {any} user - User to ban/unban.
     * @returns {void}
     */
    const openStatusModal = (user: any): void => {
        setSelectedUser(user);
        (document.getElementById('status_user_modal') as HTMLDialogElement)?.showModal();
    };

    /**
     * @returns {void}
     */
    const closeModals = (): void => {
        setSelectedUser(null);
        (document.getElementById('edit_user_modal') as HTMLDialogElement)?.close();
        (document.getElementById('delete_user_modal') as HTMLDialogElement)?.close();
        (document.getElementById('status_user_modal') as HTMLDialogElement)?.close();
        router.refresh();
    };

    /**
     * @async
     * @param {React.FormEvent} e - Form event.
     * @returns {Promise<void>}
     */
    const handleEditSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setIsEditSubmitting(true);
        try {
            const payload = { ...selectedUser };
            if (!payload.companyId) payload.companyId = null;
            await api.patch(`/users/${selectedUser._id}`, payload);
            closeModals();
            showToast("User updated successfully", "success");
        } catch (error) {
            showToast("Failed to update user", "error");
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
            await api.delete(`/users/${selectedUser._id}`);
            closeModals();
            showToast("User deleted successfully", "success");
        } catch (error) {
            showToast("Failed to delete user", "error");
            closeModals();
        } finally {
            setIsActionSubmitting(false);
        }
    };

    /**
     * @async
     * @returns {Promise<void>}
     */
    const handleToggleStatus = async (): Promise<void> => {
        setIsActionSubmitting(true);
        try {
            await api.patch(`/users/${selectedUser._id}/toggle-active`);
            closeModals();
            showToast(`User ${selectedUser.isActive ? 'deactivated' : 'activated'} successfully`, "success");
        } catch (error) {
            showToast("Failed to change user status", "error");
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
            accessorKey: 'firstName',
            header: 'User',
            cell: ({ row }: any) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="avatar placeholder shrink-0">
                            {user.profilePictureUrl ? (
                                <div className="w-8 h-8 rounded-full border border-base-content/10 overflow-hidden shadow-sm">
                                    <img src={user.profilePictureUrl} alt={user.firstName} className="object-cover w-full h-full" />
                                </div>
                            ) : (
                                <div className="bg-base-200 text-base-content rounded-full w-8 h-8 flex items-center justify-center border border-base-content/5 shadow-sm">
                                    <span className="text-xs font-bold uppercase">
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="font-bold">{user.firstName} {user.lastName}</div>
                            <div className="text-xs opacity-50">{user.email}</div>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: (info: any) => {
                const role = info.getValue();
                let badgeClass = 'badge-ghost';
                if (role === 'RECRUITER') badgeClass = 'badge-primary badge-outline';
                if (role === 'ADMIN') badgeClass = 'badge-secondary';
                return <span className={`badge badge-sm ${badgeClass}`}>{role}</span>;
            }
        },
        {
            accessorKey: 'companyId',
            header: 'Company',
            cell: ({ row }: any) => {
                const company = row.original.companyId;
                if (!company) return <span className="text-base-content/40 text-xs italic">Unassigned</span>;
                return <span className="font-medium text-sm">{company.name}</span>;
            }
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: (info: any) => (
                info.getValue()
                    ? <span className="badge badge-success badge-sm text-success-content">Active</span>
                    : <span className="badge badge-error badge-sm text-error-content">Banned</span>
            )
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
                            <li><button onClick={() => openEditModal(row.original)} className="font-medium">Edit Profile</button></li>
                            <li>
                                <button onClick={() => openStatusModal(row.original)} className="text-warning font-medium">
                                    {row.original.isActive ? 'Ban User' : 'Unban User'}
                                </button>
                            </li>
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

            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-base-content">User Directory</h1>
                <p className="text-base-content/60 text-sm mt-1">Manage candidates, assign recruiters to companies, and moderate accounts.</p>
            </div>

            {/* Added Card Wrapper to match other pages */}
            <div className="bg-base-100 rounded-4xl border border-base-content/5 shadow-sm p-4 sm:p-6">
                <DataTable
                    columns={columns}
                    data={initialUsers}
                    initialSearchValue={currentSearch}
                    onSearchSubmit={(val: string) => updateUrlState(1, limit, val)}
                    filterConfigs={[
                        {
                            id: 'role',
                            label: 'User Role',
                            type: 'select',
                            options: [
                                { label: 'Administrators', value: 'ADMIN' },
                                { label: 'Recruiters', value: 'RECRUITER' },
                                { label: 'Candidates', value: 'CANDIDATE' }
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

            <dialog id="edit_user_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-6 rounded-3xl">
                    <h3 className="font-bold text-lg mb-4">Edit User Profile</h3>
                    {selectedUser && (
                        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label text-xs font-bold opacity-60">First Name</label>
                                    <input type="text" value={selectedUser.firstName} onChange={e => setSelectedUser({ ...selectedUser, firstName: e.target.value })} className="input input-bordered w-full rounded-xl" required />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs font-bold opacity-60">Last Name</label>
                                    <input type="text" value={selectedUser.lastName} onChange={e => setSelectedUser({ ...selectedUser, lastName: e.target.value })} className="input input-bordered w-full rounded-xl" required />
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label text-xs font-bold opacity-60">Role</label>
                                <select value={selectedUser.role} onChange={e => setSelectedUser({ ...selectedUser, role: e.target.value })} className="select select-bordered w-full rounded-xl">
                                    <option value="CANDIDATE">Candidate</option>
                                    <option value="RECRUITER">Recruiter</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            {selectedUser.role === 'RECRUITER' && (
                                <div className="form-control bg-base-200/50 p-4 rounded-xl border border-base-content/5 mt-2">
                                    <label className="label text-xs font-bold opacity-60 pt-0">Assign to Company</label>
                                    <select value={selectedUser.companyId} onChange={e => setSelectedUser({ ...selectedUser, companyId: e.target.value })} className="select select-bordered w-full rounded-xl bg-base-100">
                                        <option value="">-- Unassigned --</option>
                                        {companies.map(company => <option key={company._id} value={company._id}>{company.name}</option>)}
                                    </select>
                                </div>
                            )}
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

            <ConfirmModal
                id="status_user_modal"
                title={selectedUser?.isActive ? "Ban User Account" : "Activate User Account"}
                message={selectedUser?.isActive ? `Are you sure you want to ban ${selectedUser?.email}?` : `Are you sure you want to restore access for ${selectedUser?.email}?`}
                confirmText={selectedUser?.isActive ? "Ban User" : "Activate User"}
                onConfirm={handleToggleStatus}
                isLoading={isActionSubmitting}
                isDestructive={selectedUser?.isActive ? true : false}
            />

            <ConfirmModal
                id="delete_user_modal"
                title="Delete User Permanently"
                message={`Are you sure you want to permanently delete ${selectedUser?.email}?`}
                confirmText="Permanently Delete"
                onConfirm={handleDelete}
                isLoading={isActionSubmitting}
                isDestructive={true}
            />
        </div>
    );
}