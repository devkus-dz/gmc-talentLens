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

export default function AdminLayout({ children }: { children: ReactNode }) {
    const badge = (
        <div className="bg-base-100 rounded-xl p-3 border border-base-content/5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">System Mode</p>
            <p className="text-primary font-bold text-sm mt-0.5">Admin Panel</p>
        </div>
    );

    return (
        <RoleGuard allowedRoles={['ADMIN']}>
            <DashboardLayout primaryLinks={adminPrimaryLinks} topSidebarContent={badge}>
                {children}
            </DashboardLayout>
        </RoleGuard>
    );
}