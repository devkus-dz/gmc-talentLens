import React, { JSX } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import RecruiterDashboardClient from '@/components/dashboard/RecruiterDashboardClient';
import { fetchFromServer } from '@/lib/api-server';

export default async function RecruiterDashboardPage(): Promise<JSX.Element> {

    // Fetch the data on the server side securely
    let data = null;
    try {
        data = await fetchFromServer('/dashboard/recruiter');
    } catch (error) {
        console.error("Failed to load recruiter dashboard data:", error);
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <PageHeader
                title="Recruitment Overview"
                description="Monitor your active postings and track candidate pipeline health."
            />

            {/* Pass the fetched data to the Client Component */}
            <RecruiterDashboardClient data={data} />
        </div>
    );
}