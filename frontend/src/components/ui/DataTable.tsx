"use client";

import React, { useState } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table';

// Generics allow this table to accept ANY data structure!
interface DataTableProps<TData> {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    searchPlaceholder?: string;
    actionButtonLabel?: string;
    onActionClick?: () => void;
}

export default function DataTable<TData>({
    columns,
    data,
    searchPlaceholder = "Search...",
    actionButtonLabel,
    onActionClick
}: DataTableProps<TData>) {
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    return (
        <div className="flex flex-col gap-6">

            {/* Toolbar: Search and Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="input bg-base-200/50 border-none focus:outline-primary/20 rounded-xl w-full pl-11 text-sm font-medium"
                    />
                </div>
                <div className="flex gap-3 w-full sm:w-auto shrink-0">
                    <button className="btn btn-outline border-base-content/10 bg-base-200/30 hover:bg-base-200 rounded-xl flex-1 sm:flex-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>
                        Filter
                    </button>
                    {actionButtonLabel && (
                        <button onClick={onActionClick} className="btn btn-primary rounded-xl flex-1 sm:flex-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            {actionButtonLabel}
                        </button>
                    )}
                </div>
            </div>

            {/* The Table */}
            <div className="overflow-x-auto rounded-xl border border-base-content/5 thin-scrollbar">
                <table className="table w-full border-collapse">
                    <thead className="bg-base-200/50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="border-b border-base-content/5">
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="py-4 text-[10px] font-bold uppercase tracking-widest text-base-content/50">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-base-200/30 transition-colors border-b border-base-content/5 last:border-none">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="h-24 text-center text-base-content/50 font-medium">
                                    No results found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-4">
                <span className="text-xs font-medium text-base-content/60">
                    Showing page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <div className="join">
                    <button
                        className="join-item btn btn-sm btn-outline border-base-content/10 bg-base-100 hover:bg-base-200"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <button
                        className="join-item btn btn-sm btn-primary"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                </div>
            </div>

        </div>
    );
}