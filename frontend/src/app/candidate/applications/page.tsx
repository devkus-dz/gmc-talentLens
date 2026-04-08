import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import CandidateApplicationsClient from '@/components/candidate/CandidateApplicationsClient';
import { fetchFromServer } from '@/lib/api-server';

export default async function CandidateApplicationsPage() {
    // Fetch the user's applied jobs from the secure server utility
    const applicationsRes = await fetchFromServer('/jobs/applied');

    // Ensure we handle the data structure robustly
    const applications = Array.isArray(applicationsRes) ? applicationsRes : (applicationsRes?.data || []);

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in p-2">
            <PageHeader
                title="My Applications"
                description="Track the status of your applications and upcoming interviews."
            />

            {/* Hand off data to the interactive client component */}
            <CandidateApplicationsClient initialApplications={applications} />
        </div>
    );
}