import React, { JSX } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import AdminProfileClient from '@/components/profile/UserProfileClient';
import { fetchFromServer } from '@/lib/api-server';

/**
 * Server Component for the Admin Profile page.
 * @async
 * @component
 * @returns {Promise<JSX.Element>}
 */
export default async function AdminProfilePage(): Promise<JSX.Element> {
    // Securely fetch the connected user's profile using the HttpOnly cookie
    const authRes = await fetchFromServer('/auth/me');
    const user = authRes?.user || null;

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full animate-fade-in p-2 sm:p-4 mb-10">
            <PageHeader
                title="Account Settings"
                description="Manage your admin profile, preferences, and system security."
            />

            {user ? (
                <AdminProfileClient initialUser={user} />
            ) : (
                <div className="p-10 text-center bg-base-100 rounded-3xl border border-base-content/5">
                    <p className="text-base-content/50">Failed to load profile data.</p>
                </div>
            )}
        </div>
    );
}