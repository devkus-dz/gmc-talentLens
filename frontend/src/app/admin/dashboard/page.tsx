// src/app/admin/dashboard/page.tsx
"use client";

import React, { useState } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

// 1. Define our User Data Type
type User = {
    id: string;
    name: string;
    email: string;
    role: 'RECRUITER' | 'CANDIDATE' | 'ADMIN';
    joinedDate: string;
    isActive: boolean;
    avatarUrl: string;
};

// 2. Mock Data based on your design
const mockUsers: User[] = [
    { id: '1', name: 'Elena Rodriguez', email: 'elena.r@talentlens.ai', role: 'RECRUITER', joinedDate: 'Joined 2 days ago', isActive: true, avatarUrl: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=0D1117&color=fff' },
    { id: '2', name: 'Marcus Chen', email: 'm.chen@outlook.com', role: 'CANDIDATE', joinedDate: 'Joined 1 week ago', isActive: true, avatarUrl: 'https://ui-avatars.com/api/?name=Marcus+Chen&background=f3f4f6' },
    { id: '3', name: 'Sarah Jenkins', email: 's.jenkins@talentlens.ai', role: 'ADMIN', joinedDate: 'System Admin', isActive: true, avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0284c7&color=fff' },
    { id: '4', name: 'David Miller', email: 'david.m@gmail.com', role: 'CANDIDATE', joinedDate: 'Deactivated 2h ago', isActive: false, avatarUrl: 'https://ui-avatars.com/api/?name=David+Miller&background=d1d5db&color=fff' },
];

const columnHelper = createColumnHelper<User>();

export default function AdminDashboard() {
    const [data, setData] = useState(() => [...mockUsers]);

    // 3. Define TanStack Columns
    const columns = [
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

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Macro Dashboard Stats</h1>
                <p className="text-base-content/60 mt-1 text-sm">Supervisory overview of TalentLens ecosystem</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5 text-primary"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-2">Total Users</p>
                    <h2 className="text-4xl font-bold text-primary mb-2">5,240</h2>
                    <p className="text-xs font-medium text-primary flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.62-5.327l-3.048-.817a.75.75 0 01-.53-.919z" clipRule="evenodd" /></svg> +12% from last month</p>
                </div>

                <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5 text-secondary"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32"><path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c6.771.925 11.25 7.154 11.25 14.295v.75a.75.75 0 01-.75.75H2.25a.75.75 0 01-.75-.75v-.75c0-7.141 4.48-13.37 11.25-14.295V5.25z" clipRule="evenodd" /></svg></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-2">Total Jobs</p>
                    <h2 className="text-4xl font-bold text-secondary mb-2">1,120</h2>
                    <p className="text-xs font-medium text-secondary flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.665-1.533.64-3.227 1.054-5.006 1.196v1.35h2.083a.75.75 0 010 1.5H6.75a.75.75 0 010-1.5h2.083v-1.35A23.639 23.639 0 013.83 13.204C2.694 12.73 2 11.666 2 10.54V7.07c0-1.32.947-2.488 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.328a41.146 41.146 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25z" clipRule="evenodd" /></svg> 84 active listings today</p>
                </div>

                <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5 text-base-content"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32"><path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" /></svg></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-2">Total Applications</p>
                    <h2 className="text-4xl font-bold text-base-content mb-2">25k+</h2>
                    <p className="text-xs font-medium text-base-content/60 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-primary"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" /></svg> AI matched 8.2k candidates</p>
                </div>
            </div>

            {/* TanStack Data Table Section */}
            <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5 mt-2 flex flex-col gap-6">

                {/* Table Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input type="text" placeholder="Search by name, email or role..." className="input bg-base-200/50 border-none focus:outline-primary/20 rounded-xl w-full pl-11 text-sm font-medium" />
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button className="btn btn-outline border-base-content/10 bg-base-200/30 hover:bg-base-200 rounded-xl flex-1 sm:flex-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>
                            Filter
                        </button>
                        <button className="btn btn-primary rounded-xl flex-1 sm:flex-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            Add User
                        </button>
                    </div>
                </div>

                {/* The DaisyUI Table mapped with TanStack Logic */}
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
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-base-200/30 transition-colors border-b border-base-content/5 last:border-none">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-medium text-base-content/60">Showing 4 of 5,240 results</span>
                    <div className="join">
                        <button className="join-item btn btn-sm btn-outline border-base-content/10 bg-base-100 hover:bg-base-200">Previous</button>
                        <button className="join-item btn btn-sm btn-primary">Next</button>
                    </div>
                </div>

            </div>
        </div>
    );
}