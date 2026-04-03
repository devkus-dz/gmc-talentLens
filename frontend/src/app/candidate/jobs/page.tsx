import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import CandidateJobsClient from '@/components/jobs/CandidateJobsClient';
import { fetchFromServer } from '@/lib/api-server';

// Next.js passes searchParams automatically to Server Components
export default async function CandidateJobsPage({
    searchParams
}: {
    searchParams: Promise<{ search?: string }>
}) {
    // Await the search parameters (Next.js 15 requirement)
    const resolvedParams = await searchParams;
    const querySearch = resolvedParams.search ? `?search=${encodeURIComponent(resolvedParams.search)}` : '';

    // Pass the querySearch to the backend route so it filters immediately on the server!
    const [jobsRes, appliedRes, authRes] = await Promise.all([
        fetchFromServer(`/jobs${querySearch}`),
        fetchFromServer('/jobs/applied'),
        fetchFromServer('/auth/me')
    ]);

    const jobs = Array.isArray(jobsRes) ? jobsRes : (jobsRes?.data || []);
    const appliedJobs = Array.isArray(appliedRes) ? appliedRes : (appliedRes?.data || []);

    const appliedJobIds = appliedJobs.map((app: any) => app.jobId || app._id || app.id);

    const savedJobs = authRes?.user?.savedJobs || [];
    const savedJobIds = savedJobs.map((j: any) => typeof j === 'string' ? j : (j._id || j.id));

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in p-2">
            <PageHeader
                title="Job Board"
                description="Discover and apply to your next great opportunity."
            />

            <CandidateJobsClient
                initialJobs={jobs}
                initialAppliedIds={appliedJobIds}
                initialSavedIds={savedJobIds}
            />
        </div>
    );
}