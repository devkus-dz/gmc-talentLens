"use client";

import React, { useState } from 'react';
import { createColumnHelper, ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import DataTable from '@/components/ui/DataTable';

// Define our User Data Type
type User = {
    id: string;
    name: string;
    email: string;
    role: 'RECRUITER' | 'CANDIDATE' | 'ADMIN';
    joinedDate: string;
    isActive: boolean;
    avatarUrl: string;
};

// Mock Data based on your design
const mockUsers: User[] = [
    { id: '1', name: 'Elena Rodriguez', email: 'elena.r@talentlens.ai', role: 'RECRUITER', joinedDate: 'Joined 2 days ago', isActive: true, avatarUrl: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=0D1117&color=fff' },
    { id: '2', name: 'Marcus Chen', email: 'm.chen@outlook.com', role: 'CANDIDATE', joinedDate: 'Joined 1 week ago', isActive: true, avatarUrl: 'https://ui-avatars.com/api/?name=Marcus+Chen&background=f3f4f6' },
    { id: '3', name: 'Sarah Jenkins', email: 's.jenkins@talentlens.ai', role: 'ADMIN', joinedDate: 'System Admin', isActive: true, avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0284c7&color=fff' },
    { id: '4', name: 'David Miller', email: 'david.m@gmail.com', role: 'CANDIDATE', joinedDate: 'Deactivated 2h ago', isActive: false, avatarUrl: 'https://ui-avatars.com/api/?name=David+Miller&background=d1d5db&color=fff' },
];

const columnHelper = createColumnHelper<User>();

export default function AdminDashboard() {
    const [data, setData] = useState(() => [...mockUsers]);

    // Define TanStack Columns
    const columns: ColumnDef<User, any>[] = [
        columnHelper.accessor('name', {
            header: 'Avatar & Name',
            cell: info => (
                <div className={`flex items-center gap-3 ${!info.row.original.isActive ? 'opacity-50 grayscale' : ''}`}>
                    <div className="avatar">
                        <div className="w-10 h-10 rounded-full">
                            <img src={info.row.original.avatarUrl} alt={info.getValue()} />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold text-sm">{info.getValue()}</div>
                        <div className="text-xs text-base-content/50">{info.row.original.joinedDate}</div>
                    </div>
                </div>
            ),
        }),
        columnHelper.accessor('email', {
            header: 'Email Address',
            cell: info => <span className={`text-sm ${!info.row.original.isActive ? 'opacity-50' : ''}`}>{info.getValue()}</span>,
        }),
        columnHelper.accessor('role', {
            header: 'Role',
            cell: info => {
                const role = info.getValue();
                let badgeClass = 'bg-base-200 text-base-content';
                if (role === 'RECRUITER') badgeClass = 'bg-primary/10 text-primary border-primary/20';
                if (role === 'ADMIN') badgeClass = 'bg-secondary/10 text-secondary border-secondary/20';

                return <span className={`badge badge-sm border font-bold text-[10px] uppercase tracking-wider ${badgeClass} ${!info.row.original.isActive ? 'opacity-50' : ''}`}>{role}</span>;
            },
        }),
        columnHelper.accessor('isActive', {
            header: 'Status',
            cell: info => (
                <input
                    type="checkbox"
                    className="toggle toggle-primary toggle-sm"
                    checked={info.getValue()}
                    readOnly
                />
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: () => (
                <button className="btn btn-ghost btn-sm text-error hover:bg-error/10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                </button>
            ),
        }),
    ];

    // 4. Initialize TanStack Table
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full animate-fade-in p-2">

            {/* 1. Using the new PageHeader component */}
            <PageHeader
                title="Macro Dashboard Stats"
                description="Supervisory overview of TalentLens ecosystem"
            />

            {/* 2. Using the new StatCard component */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Users"
                    value="5,240"
                    theme="primary"
                    trendText="+12% from last month"
                    trendUp={true}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>}
                />
                <StatCard
                    title="Total Jobs"
                    value="1,120"
                    theme="secondary"
                    trendText="84 active today"
                    trendUp={true}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c6.771.925 11.25 7.154 11.25 14.295v.75a.75.75 0 01-.75.75H2.25a.75.75 0 01-.75-.75v-.75c0-7.141 4.48-13.37 11.25-14.295V5.25z" clipRule="evenodd" /></svg>}
                />
                <StatCard
                    title="Total Applications"
                    value="25k+"
                    theme="neutral"
                    trendText="8.2k AI Matched"
                    trendUp={true}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" /></svg>}
                />
            </div>

            {/* TanStack Data Table Section */}
            <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5 mt-2 flex flex-col gap-6">
                <DataTable
                    columns={columns}
                    data={data}
                    searchPlaceholder="Search by name, email or role..."
                    actionButtonLabel="Add User"
                    onActionClick={() => console.log('Open Add User Modal!')}
                />
            </div>
        </div>
    );
}