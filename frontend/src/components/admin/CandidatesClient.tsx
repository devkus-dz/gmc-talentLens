"use client";

import React, { useState, useMemo, JSX } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import DataTable from '@/components/ui/DataTable';
import { Ellipsis, Printer, Eye, Mail, Phone, MapPin } from 'lucide-react';

/**
 * @interface CandidatesClientProps
 */
interface CandidatesClientProps {
    initialCandidates: any[];
    currentPage: number;
    limit: number;
    totalRecords: number;
    currentSearch: string;
}

/**
 * Interactive Candidates directory for Platform Administrators.
 * @component
 * @param {CandidatesClientProps} props 
 * @returns {JSX.Element}
 */
export default function CandidatesClient({
    initialCandidates,
    currentPage,
    limit,
    totalRecords,
    currentSearch
}: CandidatesClientProps): JSX.Element {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

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
     * Opens the modal containing the Candidate's detailed profile.
     * @param {any} candidate 
     * @returns {void}
     */
    const openProfileModal = (candidate: any): void => {
        setSelectedCandidate(candidate);
        (document.getElementById('view_candidate_modal') as HTMLDialogElement)?.showModal();
    };

    const closeModals = (): void => {
        setSelectedCandidate(null);
        (document.getElementById('view_candidate_modal') as HTMLDialogElement)?.close();
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'firstName',
            header: 'Candidate Info',
            cell: ({ row }: any) => {
                const candidate = row.original;
                const isBanned = candidate.isActive === false;
                return (
                    <div className={`flex items-center gap-3 ${isBanned ? 'opacity-50 grayscale' : ''}`}>
                        <div className="avatar placeholder shrink-0">
                            {candidate.profilePictureUrl ? (
                                <div className="w-10 h-10 rounded-full border border-base-content/10 overflow-hidden">
                                    <img src={candidate.profilePictureUrl} alt={candidate.firstName} className="object-cover w-full h-full" />
                                </div>
                            ) : (
                                <div className="bg-base-200 text-base-content rounded-full w-10 h-10 flex items-center justify-center">
                                    <span className="text-xs font-bold uppercase">{candidate.firstName?.charAt(0)}{candidate.lastName?.charAt(0)}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="font-bold text-sm">{candidate.firstName} {candidate.lastName}</div>
                            <div className="text-xs text-base-content/50">{candidate.email}</div>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: 'isLookingForJob',
            header: 'Job Status',
            cell: (info: any) => (
                info.getValue()
                    ? <span className="badge badge-success badge-sm badge-outline">Open to Work</span>
                    : <span className="badge badge-ghost badge-sm text-base-content/50">Not Looking</span>
            )
        },
        {
            accessorKey: 'createdAt',
            header: 'Joined On',
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
                        <ul tabIndex={0} className="dropdown-content z-100 menu p-2 shadow-xl bg-base-100 rounded-2xl w-48 border border-base-content/10 mt-1 mb-1">
                            <li>
                                <button onClick={() => openProfileModal(row.original)} className="font-medium text-primary">
                                    <Eye className="w-4 h-4 mr-1" /> View Full Profile
                                </button>
                            </li>
                            <div className="divider my-0"></div>
                            <li className="disabled opacity-50">
                                <button disabled className="font-medium cursor-not-allowed">
                                    <Printer className="w-4 h-4 mr-1" /> Print Curriculum
                                </button>
                            </li>
                        </ul>
                    </div>
                );
            }
        }
    ], []);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in pb-20 relative">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Candidate Directory</h1>
                    <p className="text-base-content/60 text-sm mt-1">Browse and oversee all registered talent in the platform.</p>
                </div>
            </div>

            <div className="bg-base-100 rounded-4xl border border-base-content/5 shadow-sm p-4 sm:p-6 overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={initialCandidates}
                    initialSearchValue={currentSearch}
                    onSearchSubmit={(val: string) => updateUrlState(1, limit, val)}

                    filterConfigs={[
                        {
                            id: 'isLookingForJob',
                            label: 'Job Status',
                            type: 'select',
                            options: [
                                { label: 'Open to Work', value: 'true' },
                                { label: 'Not Looking', value: 'false' }
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

            {/* --- VIEW PROFILE MODAL --- */}
            <dialog id="view_candidate_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-0 max-w-2xl bg-base-100 shadow-2xl rounded-3xl overflow-hidden">

                    {selectedCandidate && (
                        <div>
                            {/* Profile Header Banner */}
                            <div className="bg-primary/5 p-8 border-b border-primary/10 relative">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/50" onClick={closeModals}>✕</button>
                                </form>
                                <div className="flex items-center gap-6">
                                    <div className="avatar placeholder shrink-0">
                                        {selectedCandidate.profilePictureUrl ? (
                                            <div className="w-24 h-24 rounded-full border-4 border-base-100 shadow-sm">
                                                <img src={selectedCandidate.profilePictureUrl} alt="Avatar" className="object-cover w-full h-full" />
                                            </div>
                                        ) : (
                                            <div className="bg-primary text-primary-content rounded-full w-24 h-24 flex items-center justify-center border-4 border-base-100 shadow-sm">
                                                <span className="text-3xl font-bold uppercase">{selectedCandidate.firstName?.charAt(0)}{selectedCandidate.lastName?.charAt(0)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-base-content">{selectedCandidate.firstName} {selectedCandidate.lastName}</h2>
                                        <p className="text-base-content/60 font-medium text-sm mb-2">Registered Candidate</p>
                                        {selectedCandidate.isLookingForJob ? (
                                            <span className="badge badge-success badge-sm badge-soft">Open to Work</span>
                                        ) : (
                                            <span className="badge badge-ghost badge-sm text-base-content/50">Currently Employed</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Profile Details Body */}
                            <div className="p-8 flex flex-col gap-6">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-3">Contact Information</h3>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3 text-sm text-base-content/80">
                                            <Mail className="w-4 h-4 opacity-50" />
                                            <a href={`mailto:${selectedCandidate.email}`} className="hover:text-primary transition-colors">{selectedCandidate.email}</a>
                                        </div>
                                        {/* Future Expansion: Add Phone / Location below once integrated into User Model */}
                                    </div>
                                </div>

                                <div className="bg-base-200/50 rounded-2xl p-6 border border-base-content/5 text-center mt-4">
                                    <p className="text-sm font-medium text-base-content/60">
                                        Detailed CV and AI parsed profile view is currently under development.
                                    </p>
                                    <button disabled className="btn btn-outline border-base-content/20 rounded-xl mt-4 btn-sm">
                                        <Printer className="w-4 h-4 mr-1" />
                                        Print Curriculum (Coming Soon)
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop"><button onClick={closeModals}>close</button></form>
            </dialog>

        </div>
    );
}