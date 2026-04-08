"use client";

import React, { JSX, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    SortingState,
} from '@tanstack/react-table';
import { Search, Filter, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';

export interface FilterConfig {
    id: string;
    label: string;
    type: 'select' | 'date-range';
    options?: { label: string; value: string }[];
}

export interface DataTableProps<TData> {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    initialSearchValue?: string;
    onSearchSubmit?: (val: string) => void;
    filterConfigs?: FilterConfig[];
    onFilterSubmit?: (filters: Record<string, any>) => void;
    totalRecords?: number;
    pageIndex?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
}

export default function DataTable<TData>({
    columns,
    data,
    initialSearchValue = '',
    onSearchSubmit,
    filterConfigs = [],
    onFilterSubmit,
    totalRecords = 0,
    pageIndex = 1,
    pageSize = 10,
    onPageChange,
    onPageSizeChange
}: DataTableProps<TData>): JSX.Element {
    const [localSearch, setLocalSearch] = useState<string>(initialSearchValue);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [localFilters, setLocalFilters] = useState<Record<string, any>>({});

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const handleLocalSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (onSearchSubmit) onSearchSubmit(localSearch);
    };

    const handleFilterChange = (key: string, value: any): void => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = (): void => {
        if (onFilterSubmit) onFilterSubmit(localFilters);
        (document.activeElement as HTMLElement)?.blur();
    };

    const clearFilters = (e: React.MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        setLocalFilters({});
        if (onFilterSubmit) onFilterSubmit({});
        (document.activeElement as HTMLElement)?.blur();
    };

    const clearSearch = () => {
        setLocalSearch('');
        if (onSearchSubmit) onSearchSubmit('');
    };

    return (
        <div className="w-full flex flex-col gap-4">

            {/* --- TOP BAR --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-40">

                {/* Larger, Original Search Input */}
                <div className="w-full sm:w-auto flex-1">
                    {onSearchSubmit && (
                        <form onSubmit={handleLocalSubmit} className="relative w-full sm:max-w-md flex items-center">
                            <input
                                type="text"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                placeholder="Search records..."
                                /* Re-added pl-5 to keep text away from the left border, pr-20 for the right buttons */
                                className="input input-bordered w-full pl-5 pr-20 rounded-2xl min-h-[48px] shadow-sm focus:outline-primary/20 text-sm bg-base-100"
                            />

                            {/* Icons positioned exclusively on the right */}
                            <div className="absolute right-2 flex items-center gap-1">
                                {localSearch && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-error"
                                        title="Clear search"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-primary hover:bg-primary/10"
                                    title="Search"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Filters Dropdown (Restored to min-h-[48px] to perfectly match the input height) */}
                <div className="w-full sm:w-auto flex justify-end">
                    {filterConfigs.length > 0 && (
                        <div className="dropdown dropdown-end w-full sm:w-auto">
                            <label
                                tabIndex={0}
                                className="btn bg-base-100 border-base-content/10 hover:border-primary/30 hover:bg-base-100 rounded-2xl px-6 min-h-[48px] shadow-sm transition-all flex items-center gap-2 font-medium w-full sm:w-auto"
                            >
                                <Filter className="w-4 h-4 text-base-content/70" />
                                <span className="text-sm">Filters</span>

                                {Object.keys(localFilters).length > 0 && (
                                    <span className="w-2 h-2 rounded-full bg-primary ml-1"></span>
                                )}
                            </label>

                            <div tabIndex={0} className="dropdown-content z-50 p-5 shadow-2xl bg-base-100 rounded-3xl w-80 border border-base-content/10 mt-2">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-xs text-base-content/60 uppercase tracking-widest">Active Filters</h3>
                                    {Object.keys(localFilters).length > 0 && (
                                        <span className="badge badge-sm badge-primary">{Object.keys(localFilters).length}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 thin-scrollbar">
                                    {filterConfigs.map(f => (
                                        <div key={f.id} className="form-control">
                                            <label className="label text-xs font-semibold opacity-70 p-0 pb-1.5">{f.label}</label>

                                            {f.type === 'select' && (
                                                <select
                                                    className="select select-bordered w-full rounded-xl bg-base-100 focus:bg-base-100 shadow-sm"
                                                    value={localFilters[f.id] || ''}
                                                    onChange={e => handleFilterChange(f.id, e.target.value)}
                                                >
                                                    <option value="">All Categories</option>
                                                    {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                </select>
                                            )}

                                            {f.type === 'date-range' && (
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-base-content/40 uppercase w-8">From</span>
                                                        <input
                                                            type="date"
                                                            className="input input-bordered input-sm w-full rounded-lg text-sm bg-base-100 shadow-sm"
                                                            value={localFilters[`${f.id}_from`] || ''}
                                                            onChange={e => handleFilterChange(`${f.id}_from`, e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-base-content/40 uppercase w-8">To</span>
                                                        <input
                                                            type="date"
                                                            className="input input-bordered input-sm w-full rounded-lg text-sm bg-base-100 shadow-sm"
                                                            value={localFilters[`${f.id}_to`] || ''}
                                                            onChange={e => handleFilterChange(`${f.id}_to`, e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-base-content/5">
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        disabled={Object.keys(localFilters).length === 0}
                                        className="btn btn-ghost btn-sm text-error hover:bg-error/10 rounded-xl"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="button"
                                        onClick={applyFilters}
                                        className="btn btn-primary btn-sm rounded-xl px-6 shadow-sm"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- TABLE CONTENT --- */}
            <div className="overflow-x-auto w-full rounded-3xl border border-base-content/5 bg-base-100 min-h-[350px] relative z-10 shadow-sm">
                <table className="table w-full">
                    <thead className="bg-base-200/40 text-base-content/60">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b border-base-content/5">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className={`py-5 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${header.column.getCanSort() ? 'cursor-pointer hover:bg-base-200/80 hover:text-base-content select-none' : ''}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && (
                                                <span className="text-base-content/40">
                                                    {{
                                                        asc: <ArrowUp className="w-3 h-3 text-primary" />,
                                                        desc: <ArrowDown className="w-3 h-3 text-primary" />
                                                    }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="w-3 h-3 opacity-50" />}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-base-200/30 border-b border-base-content/5 last:border-none transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="py-4 text-sm">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="h-40 text-center">
                                    <div className="flex flex-col items-center justify-center text-base-content/40">
                                        <Search className="w-8 h-8 mb-2 opacity-50" />
                                        <span className="font-medium">No records found.</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- COMPACT PAGINATION --- */}
            {(totalRecords > 0) && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-2 px-2 gap-4">
                    <div className="text-xs sm:text-sm font-medium text-base-content/60 text-center sm:text-left">
                        Showing {Math.min(((pageIndex - 1) * pageSize) + 1, totalRecords)} to {Math.min(pageIndex * pageSize, totalRecords)} of <span className="font-bold text-base-content">{totalRecords}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-base-200/50 rounded-lg px-2 py-1">
                            <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest hidden sm:inline">Show</span>
                            <select
                                value={pageSize}
                                onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                                className="select select-ghost select-sm h-7 min-h-0 px-2 font-bold focus:bg-base-100 text-xs"
                            >
                                {[10, 20, 50, 100].map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button onClick={() => onPageChange?.(pageIndex - 1)} disabled={pageIndex === 1} className="btn btn-sm btn-outline border-base-content/10 rounded-lg px-3 hover:bg-base-200 hover:text-base-content text-xs">Prev</button>
                            <button onClick={() => onPageChange?.(pageIndex + 1)} disabled={pageIndex * pageSize >= totalRecords} className="btn btn-sm btn-outline border-base-content/10 rounded-lg px-3 hover:bg-base-200 hover:text-base-content text-xs">Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}