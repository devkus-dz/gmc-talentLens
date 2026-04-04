"use client";

import React, { JSX } from 'react';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';
import {
    Building2,
    Users,
    Briefcase,
    UserCheck,
    ShieldAlert,
    PlusCircle,
    List,
    FileText,
    Globe,
    Shield
} from 'lucide-react';

/**
 * @interface DashboardClientProps
 * @property {any} stats - The aggregated statistics object fetched from the backend.
 */
interface DashboardClientProps {
    stats: any;
}

/**
 * Interactive Client Component for the main Admin Dashboard overview.
 * Built strictly with Lucide React icons for a clean, maintainable UI.
 * @component
 * @param {DashboardClientProps} props - The injected stats data.
 * @returns {JSX.Element}
 */
export default function DashboardClient({ stats }: DashboardClientProps): JSX.Element {

    // Fallback safe state in case the backend fails to provide data
    const safeStats = stats || {
        companies: { total: 0 },
        users: { total: 0, recruiters: 0, candidates: 0, banned: 0 },
        jobs: { total: 0, active: 0 },
        applications: { total: 0 }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in pb-20">

            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Platform Overview</h1>
                    <p className="text-base-content/60 text-sm mt-1">Real-time statistics and quick actions for the TalentLens ecosystem.</p>
                </div>
                <Link href="/admin/companies" className="btn btn-primary rounded-xl w-full sm:w-auto shadow-sm min-h-[44px]">
                    <PlusCircle className="w-5 h-5" />
                    Provision Client
                </Link>
            </div>

            {/* --- PRIMARY STATS GRID --- */}
            <h2 className="text-lg font-bold text-base-content mb-4 px-2 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Ecosystem Health
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                <StatCard
                    title="B2B Companies"
                    value={safeStats.companies.total}
                    theme="primary"
                    icon={<Building2 className="w-6 h-6" />}
                />
                <StatCard
                    title="Total Users"
                    value={safeStats.users.total}
                    theme="secondary"
                    icon={<Users className="w-6 h-6" />}
                />
                <StatCard
                    title="Job Offers"
                    value={safeStats.jobs.total}
                    trendText={`${safeStats.jobs.active} Active`}
                    trendType="positive"
                    theme="accent"
                    icon={<Briefcase className="w-6 h-6" />}
                />
                <StatCard
                    title="Total Applications"
                    value={safeStats.applications.total}
                    theme="info"
                    icon={<FileText className="w-6 h-6" />}
                />
            </div>

            {/* --- SECONDARY STATS GRID (Admin Moderation Focus) --- */}
            <h2 className="text-lg font-bold text-base-content mb-4 px-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-warning" />
                Moderation & Roles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
                <StatCard
                    title="Recruiters"
                    value={safeStats.users.recruiters}
                    trendText="Verified"
                    trendType="neutral"
                    theme="neutral"
                    icon={<UserCheck className="w-6 h-6" />}
                />
                <StatCard
                    title="Candidates"
                    value={safeStats.users.candidates}
                    theme="success"
                    icon={<Users className="w-6 h-6" />}
                />
                <StatCard
                    title="Banned Accounts"
                    value={safeStats.users.banned}
                    trendText="Action Required"
                    trendType={safeStats.users.banned > 0 ? "negative" : "neutral"}
                    theme="error"
                    icon={<ShieldAlert className="w-6 h-6" />}
                />
            </div>

            {/* --- QUICK LINKS / NAVIGATION --- */}
            <h2 className="text-lg font-bold text-base-content mb-4 px-2">Command Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/companies" className="bg-base-100 p-5 rounded-2xl border border-base-content/5 hover:border-primary/30 hover:shadow-md transition-all flex items-center justify-between group min-h-[60px]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-base-content">Companies</h4>
                            <p className="text-xs text-base-content/50">Manage B2B Workspaces</p>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/users" className="bg-base-100 p-5 rounded-2xl border border-base-content/5 hover:border-primary/30 hover:shadow-md transition-all flex items-center justify-between group min-h-[60px]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-base-content">Directory</h4>
                            <p className="text-xs text-base-content/50">Moderate all users</p>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/jobs" className="bg-base-100 p-5 rounded-2xl border border-base-content/5 hover:border-primary/30 hover:shadow-md transition-all flex items-center justify-between group min-h-[60px]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <List className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-base-content">Job Listings</h4>
                            <p className="text-xs text-base-content/50">Monitor platform jobs</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}