import React, { JSX } from 'react';
import UserProfileClient from '@/components/profile/UserProfileClient';
import { fetchFromServer } from '@/lib/api-server';

// --- NEW: Forces Next.js to always fetch fresh data from the DB ---
export const dynamic = 'force-dynamic';

export default async function RecruiterProfilePage(): Promise<JSX.Element> {

    let userData = null;
    try {
        const res = await fetchFromServer('/auth/me');
        userData = res?.user || res;
    } catch (error) {
        console.error("Failed to load recruiter profile data:", error);
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
            <UserProfileClient initialUser={userData} />
        </div>
    );
}