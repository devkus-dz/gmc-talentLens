// frontend/src/components/admin/CandidatesClient.tsx
"use client";

import React, { useMemo, JSX } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DataTable from '@/components/ui/DataTable';
import { Ellipsis, Printer, Eye } from 'lucide-react';

/**
 * Interface representing the Candidate data structure.
 * @interface CandidateData
 */
export interface CandidateData {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl?: string;
    isActive?: boolean;
    isLookingForJob?: boolean;
    createdAt: string;
    [key: string]: any;
}

/**
 * @interface CandidatesClientProps
 */
interface CandidatesClientProps {
    initialCandidates: CandidateData[];
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

    /**
     * Updates URL state to trigger Server Component refetch.
     * Creates a fresh URL parameter state to cleanly remove cleared filters.
     * @param {number} newPage 
     * @param {number} newLimit 
     * @param {string} newSearch 
     * @param {Record<string, any>} activeFilters 
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

    const columns = useMemo(() => [
        {
            accessorKey: 'firstName',
            header: 'Candidate Info',
            cell: ({ row }: any) => {
                const candidate = row.original as CandidateData;
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
                const candidate = row.original as CandidateData;
                const totalRows = table.getRowModel().rows.length;
                const isNearBottom = row.index >= totalRows - 2 && totalRows > 3;

                return (
                    <div className={`dropdown dropdown-end ${isNearBottom ? 'dropdown-top' : ''}`}>
                        <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-primary">
                            <Ellipsis className="w-5 h-5" />
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-100 menu p-2 shadow-xl bg-base-100 rounded-2xl w-48 border border-base-content/10 mt-1 mb-1">
                            <li>
                                <Link
                                    href={`/admin/candidates/${candidate._id}`}
                                    className="flex items-center gap-2 text-primary hover:bg-primary/10 transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Profile
                                </Link>
                            </li>
                            <div className="divider my-0 opacity-30"></div>
                            <li className="disabled opacity-50">
                                <button disabled className="flex items-center gap-2 font-medium cursor-not-allowed">
                                    <Printer className="w-4 h-4" /> Print Curriculum
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

        </div>
    );
}