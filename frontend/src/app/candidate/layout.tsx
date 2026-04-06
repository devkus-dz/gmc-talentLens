import DashboardLayout, { NavLink } from '@/components/layout/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import { ReactNode } from 'react';
import { BriefcaseBusiness, ContactRound, FileUp, LayoutDashboard } from 'lucide-react';

const candidateLinks: NavLink[] = [
    { label: 'Dashboard', href: '/candidate/dashboard', icon: <LayoutDashboard /> },
    { label: 'Job Board', href: '/candidate/jobs', icon: <BriefcaseBusiness /> },
    { label: 'Applications', href: '/candidate/applications', icon: <FileUp /> },
    { label: 'Profile', href: '/candidate/profile', icon: <ContactRound /> },
];

/**
 * The layout wrapper for all Candidate routes, rendering the sidebar
 * and enforcing role-based access control.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child page components to render.
 * @returns {React.JSX.Element} The secured candidate layout.
 */
export default function CandidateLayout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard allowedRoles={['CANDIDATE']}>
            <DashboardLayout primaryLinks={candidateLinks}>
                {children}
            </DashboardLayout>
        </RoleGuard>
    );
}