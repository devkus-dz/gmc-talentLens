import React, { JSX } from 'react';
import DashboardClient from '@/components/admin/DashboardClient';
import { fetchFromServer } from '@/lib/api-server';

/**
 * Server Component that handles initial data fetching for the Admin Overview Dashboard.
 * Securely calls the /dashboard/admin route using the forwarded JWT cookie.
 * @async
 * @component
 * @returns {Promise<JSX.Element>}
 */
export default async function AdminDashboardPage(): Promise<JSX.Element> {

    const res = await fetchFromServer('/dashboard/admin');

    // Extract the data payload
    const statsData = res?.data || null;

    return <DashboardClient stats={statsData} />;
}