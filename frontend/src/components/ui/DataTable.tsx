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
import { Search, Filter, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

/**
 * @interface FilterConfig
 * @property {string} id - The internal key for the filter.
 * @property {string} label - The display label.
 * @property {'select' | 'date-range'} type - The type of filter input.
 * @property {{label: string, value: string}[]} [options] - Values for select type.
 */
export interface FilterConfig {
    id: string;
    label: string;
    type: 'select' | 'date-range';
    options?: { label: string; value: string }[];
}

/**
 * @interface DataTableProps
 * @template TData
 */
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

/**
 * Advanced Data Table supporting sorting, pagination, and multi-format filtering.
 * @component
 * @template TData
 * @param {DataTableProps<TData>} props
 * @returns {JSX.Element}
 */
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

    /**
     * @param {React.FormEvent} e 
     * @returns {void}
     */
    const handleLocalSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (onSearchSubmit) onSearchSubmit(localSearch);
    };

    /**
     * @param {string} key 
     * @param {any} value 
     * @returns {void}
     */
    const handleFilterChange = (key: string, value: any): void => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    /**
     * @returns {void}
     */
    const applyFilters = (): void => {
        if (onFilterSubmit) onFilterSubmit(localFilters);
        (document.activeElement as HTMLElement)?.blur();
    };

    /**
     * @param {React.MouseEvent} e
     * @returns {void}
     */
    const clearFilters = (e: React.MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        setLocalFilters({});
        if (onFilterSubmit) onFilterSubmit({});
        (document.activeElement as HTMLElement)?.blur();
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 relative z-60">
                {onSearchSubmit && (
                    <form onSubmit={handleLocalSubmit} className="relative w-full sm:max-w-md group">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            placeholder="Search records..."
                            className="input input-bordered w-full pl-12 pr-16 bg-base-100 rounded-2xl min-h-[48px]"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm rounded-xl text-primary">
                            Search
                        </button>
                    </form>
                )}

                {filterConfigs.length > 0 && (
                    <div className="dropdown dropdown-end w-full sm:w-auto">
                        <label tabIndex={0} className="btn btn-outline border-base-content/10 bg-base-100 rounded-2xl w-full sm:w-auto flex items-center gap-2 min-h-[48px]">
                            <Filter className="w-4 h-4" />
                            Filters
                            <ChevronDown className="w-4 h-4 opacity-50" />
                        </label>
                        <div tabIndex={0} className="dropdown-content z-100 p-5 shadow-2xl bg-base-100 rounded-3xl w-80 border border-base-content/10 mt-2">
                            <h3 className="font-bold text-sm mb-4 text-base-content/80 uppercase tracking-widest">Active Filters</h3>

                            <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
                                {filterConfigs.map(f => (
                                    <div key={f.id} className="form-control">
                                        <label className="label text-xs font-semibold opacity-70 p-0 pb-1">{f.label}</label>

                                        {f.type === 'select' && (
                                            <select
                                                className="select select-bordered w-full rounded-xl"
                                                value={localFilters[f.id] || ''}
                                                onChange={e => handleFilterChange(f.id, e.target.value)}
                                            >
                                                <option value="">All</option>
                                                {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                            </select>
                                        )}

                                        {f.type === 'date-range' && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="date"
                                                    className="input input-bordered w-full rounded-xl text-sm"
                                                    value={localFilters[`${f.id}_from`] || ''}
                                                    onChange={e => handleFilterChange(`${f.id}_from`, e.target.value)}
                                                />
                                                <span className="text-base-content/40 text-xs">to</span>
                                                <input
                                                    type="date"
                                                    className="input input-bordered w-full rounded-xl text-sm"
                                                    value={localFilters[`${f.id}_to`] || ''}
                                                    onChange={e => handleFilterChange(`${f.id}_to`, e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-base-content/10">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="btn btn-ghost btn-sm text-error rounded-xl"
                                >
                                    Clear All
                                </button>
                                <button
                                    type="button"
                                    onClick={applyFilters}
                                    className="btn btn-primary btn-sm rounded-xl px-6"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto w-full rounded-3xl border border-base-content/5 bg-base-100 min-h-[350px] relative z-50">
                <table className="table w-full">
                    <thead className="bg-base-200/40 text-base-content/60">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b border-base-content/5">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className={`py-5 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${header.column.getCanSort() ? 'cursor-pointer hover:bg-base-200/50 select-none' : ''}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && (
                                                <span className="text-base-content/40">
                                                    {{
                                                        asc: <ArrowUp className="w-3 h-3 text-primary" />,
                                                        desc: <ArrowDown className="w-3 h-3 text-primary" />
                                                    }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="w-3 h-3" />}
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
                                <tr key={row.id} className="hover:bg-base-200/20 border-b border-base-content/5 last:border-none">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="py-4 text-sm">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="h-40 text-center text-base-content/50 font-medium">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {(totalRecords > 0) && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-2 px-2 gap-4">
                    <div className="text-sm font-medium text-base-content/60">
                        Showing {Math.min(((pageIndex - 1) * pageSize) + 1, totalRecords)} to {Math.min(pageIndex * pageSize, totalRecords)} of <span className="font-bold text-base-content">{totalRecords}</span> records
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                            className="select select-bordered select-sm rounded-xl font-medium"
                        >
                            {[10, 20, 50, 100].map(size => (
                                <option key={size} value={size}>Show {size}</option>
                            ))}
                        </select>
                        <div className="flex items-center gap-2">
                            <button onClick={() => onPageChange?.(pageIndex - 1)} disabled={pageIndex === 1} className="btn btn-sm btn-outline rounded-xl px-4">Previous</button>
                            <button onClick={() => onPageChange?.(pageIndex + 1)} disabled={pageIndex * pageSize >= totalRecords} className="btn btn-sm btn-outline rounded-xl px-4">Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}