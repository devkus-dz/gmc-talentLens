"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';

// 1. Define the Candidate Type
type Candidate = {
    id: string;
    name: string;
    email: string;
    topSkill: string;
    status: 'ACTIVE' | 'INACTIVE' | 'HIRED';
    avatarUrl: string;
};

// 2. Mock Data
const mockCandidates: Candidate[] = [
    { id: '1', name: 'Marcus Chen', email: 'm.chen@outlook.com', topSkill: 'React.js', status: 'ACTIVE', avatarUrl: 'https://ui-avatars.com/api/?name=Marcus+Chen&background=f3f4f6' },
    { id: '2', name: 'Diana Prince', email: 'diana.p@gmail.com', topSkill: 'Product Strategy', status: 'HIRED', avatarUrl: 'https://ui-avatars.com/api/?name=Diana+Prince&background=0284c7&color=fff' },
    { id: '3', name: 'David Miller', email: 'david.m@gmail.com', topSkill: 'Figma', status: 'INACTIVE', avatarUrl: 'https://ui-avatars.com/api/?name=David+Miller&background=d1d5db&color=fff' },
];

const columnHelper = createColumnHelper<Candidate>();

const columns: ColumnDef<Candidate, any>[] = [
    columnHelper.accessor('name', {
        header: 'Candidate Info',
        cell: info => (
            <div className={`flex items-center gap-3 ${info.row.original.status === 'INACTIVE' ? 'opacity-50 grayscale' : ''}`}>
                <div className="avatar"><div className="w-10 h-10 rounded-full"><img src={info.row.original.avatarUrl} alt={info.getValue()} /></div></div>
                <div>
                    <div className="font-bold text-sm">{info.getValue()}</div>
                    <div className="text-xs text-base-content/50">{info.row.original.email}</div>
                </div>
            </div>
        ),
    }),
    columnHelper.accessor('topSkill', {
        header: 'Top Skill',
        cell: info => <span className="badge badge-sm bg-base-200/50 border-none px-3 py-2 font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
        header: 'Account Status',
        cell: info => {
            const status = info.getValue();
            let badgeClass = 'bg-base-200 text-base-content/60';
            if (status === 'ACTIVE') badgeClass = 'bg-success/10 text-success';
            if (status === 'HIRED') badgeClass = 'bg-primary/10 text-primary';

            return <span className={`badge badge-sm border-none font-bold text-[10px] uppercase tracking-wider ${badgeClass}`}>{status}</span>;
        },
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: () => (
            <button className="btn btn-ghost btn-sm text-base-content/50 hover:text-primary">View Profile</button>
        ),
    }),
];

export default function AdminCandidatesPage() {
    const [data] = useState(() => [...mockCandidates]);

    return (
        <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full animate-fade-in p-2">
            <PageHeader
                title="Candidate Directory"
                description="Global overview of all registered talent in the system."
            />

            <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5">
                <DataTable
                    columns={columns}
                    data={data}
                    searchPlaceholder="Search candidates by name, email, or skill..."
                />
            </div>
        </div>
    );
}