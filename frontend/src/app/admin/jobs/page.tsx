"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';

// 1. Define the Job Type
type AdminJob = {
    id: string;
    title: string;
    department: string;
    recruiterName: string;
    applicants: number;
    isActive: boolean;
};

// 2. Mock Data
const mockJobs: AdminJob[] = [
    { id: '1', title: 'Senior Product Designer', department: 'Engineering', recruiterName: 'Elena Rodriguez', applicants: 42, isActive: true },
    { id: '2', title: 'Fullstack Engineer', department: 'Engineering', recruiterName: 'Elena Rodriguez', applicants: 18, isActive: true },
    { id: '3', title: 'Marketing Director', department: 'Marketing', recruiterName: 'System Admin', applicants: 0, isActive: false },
];

const columnHelper = createColumnHelper<AdminJob>();

const columns: ColumnDef<AdminJob, any>[] = [
    columnHelper.accessor('title', {
        header: 'Job Title & Dept',
        cell: info => (
            <div className={!info.row.original.isActive ? 'opacity-50' : ''}>
                <div className="font-bold text-sm">{info.getValue()}</div>
                <div className="text-xs text-base-content/50">{info.row.original.department}</div>
            </div>
        ),
    }),
    columnHelper.accessor('recruiterName', {
        header: 'Assigned Recruiter',
        cell: info => <span className={`text-sm font-medium ${!info.row.original.isActive ? 'opacity-50' : ''}`}>{info.getValue()}</span>,
    }),
    columnHelper.accessor('applicants', {
        header: 'Total Pipeline',
        cell: info => (
            <div className={`flex items-center gap-2 ${!info.row.original.isActive ? 'opacity-50' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-base-content/40"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" /></svg>
                <span className="font-bold text-sm">{info.getValue()}</span>
            </div>
        ),
    }),
    columnHelper.accessor('isActive', {
        header: 'Status',
        cell: info => (
            <span className={`badge badge-sm border-none font-bold text-[10px] uppercase tracking-wider ${info.getValue() ? 'bg-success/10 text-success' : 'bg-base-200 text-base-content/60'}`}>
                {info.getValue() ? 'Active' : 'Closed'}
            </span>
        ),
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: () => (
            <button className="btn btn-ghost btn-sm text-base-content/50 hover:text-primary">Manage</button>
        ),
    }),
];

export default function AdminJobsPage() {
    const [data] = useState(() => [...mockJobs]);

    return (
        <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full animate-fade-in p-2">
            <PageHeader
                title="Global Job Board"
                description="Manage and oversee all active and closed job requisitions."
            />

            <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5">
                <DataTable
                    columns={columns}
                    data={data}
                    searchPlaceholder="Search jobs by title or department..."
                />
            </div>
        </div>
    );
}