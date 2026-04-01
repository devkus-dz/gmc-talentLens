"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Defines the properties for the RoleGuard component.
 */
interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: Array<"ADMIN" | "CANDIDATE" | "RECRUITER">;
}

/**
 * Defines the user structure stored in localStorage.
 */
interface LocalUser {
    id: string;
    email: string;
    role: "ADMIN" | "CANDIDATE" | "RECRUITER";
    firstName: string;
    lastName: string;
}

/**
 * A security wrapper that restricts access to child components based on the user's role.
 * Redirects unauthorized users to their correct dashboard or the login page.
 * @param {RoleGuardProps} props - The required roles and the components to protect.
 * @returns {React.JSX.Element | null} The protected content or a loading state.
 */
export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (!storedUser) {
            router.push('/auth/login');
            return;
        }

        try {
            const user: LocalUser = JSON.parse(storedUser);

            if (allowedRoles.includes(user.role)) {
                setIsAuthorized(true);
            } else {
                router.push(`/${user.role.toLowerCase()}/dashboard`);
            }
        } catch (error) {
            localStorage.removeItem('user');
            router.push('/auth/login');
        }
    }, [allowedRoles, router]);

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200/50">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return <>{children}</>;
}