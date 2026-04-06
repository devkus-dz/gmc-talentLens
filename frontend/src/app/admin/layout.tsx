// src/app/admin/layout.tsx
import RoleGuard from '@/components/auth/RoleGuard';
import DashboardLayout, { NavLink } from '@/components/layout/DashboardLayout';
import { BriefcaseBusiness, Building2, ChartNoAxesCombined, LayoutDashboard, UserCog, UsersRound } from 'lucide-react';
import { ReactNode } from 'react';

const adminPrimaryLinks: NavLink[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard /> },
    { label: 'Analytics', href: '/admin/analytics', icon: <ChartNoAxesCombined /> },
    { label: 'Companies', href: '/admin/companies', icon: <Building2 /> },
    { label: 'Users', href: '/admin/users', icon: <UserCog /> },
    { label: 'Job Board', href: '/admin/jobs', icon: <BriefcaseBusiness /> },
    { label: 'Candidates', href: '/admin/candidates', icon: <UsersRound /> },

];

const adminSecondaryLinks: NavLink[] = [
    { label: 'Settings', href: '/admin/settings', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg> },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const badge = (
        <div className="bg-base-100 rounded-xl p-3 border border-base-content/5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">System Mode</p>
            <p className="text-primary font-bold text-sm mt-0.5">Admin Panel</p>
        </div>
    );

    return (
        <RoleGuard allowedRoles={['ADMIN']}>
            <DashboardLayout primaryLinks={adminPrimaryLinks} secondaryLinks={adminSecondaryLinks} topSidebarContent={badge}>
                {children}
            </DashboardLayout>
        </RoleGuard>
    );
}