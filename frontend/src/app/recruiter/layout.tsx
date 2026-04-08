// src/app/recruiter/layout.tsx
import RoleGuard from '@/components/auth/RoleGuard';
import DashboardLayout, { NavLink } from '@/components/layout/DashboardLayout';
import { BriefcaseBusiness, LayoutDashboard, SquareKanban } from 'lucide-react';
import { ReactNode } from 'react';

const recruiterLinks: NavLink[] = [
    { label: 'Overview', href: '/recruiter/dashboard', icon: <LayoutDashboard /> },
    { label: 'Jobs', href: '/recruiter/jobs', icon: <BriefcaseBusiness /> },
    { label: 'Pipeline', href: '/recruiter/pipeline', icon: <SquareKanban /> },
];

export default function RecruiterLayout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard allowedRoles={['RECRUITER']}>
            <DashboardLayout primaryLinks={recruiterLinks}>
                {children}
            </DashboardLayout>
        </RoleGuard>
    );
}