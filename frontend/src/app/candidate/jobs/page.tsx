import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import CandidateJobsClient from '@/components/jobs/CandidateJobsClient';
import { fetchFromServer } from '@/lib/api-server';

export default async function CandidateJobsPage() {
    // Fetch jobs, applied jobs, and the user's profile in parallel
    const [jobsRes, appliedRes, authRes] = await Promise.all([
        fetchFromServer('/jobs'),
        fetchFromServer('/jobs/applied'),
        fetchFromServer('/auth/me')
    ]);

    const jobs = Array.isArray(jobsRes) ? jobsRes : (jobsRes?.data || []);
    const appliedJobs = Array.isArray(appliedRes) ? appliedRes : (appliedRes?.data || []);

    // Extract applied IDs
    const appliedJobIds = appliedJobs.map((app: any) => app.jobId || app._id || app.id);

    // Extract saved IDs from the user object
    const savedJobs = authRes?.user?.savedJobs || [];
    // Ensure we are getting the string IDs (whether backend populated them or not)
    const savedJobIds = savedJobs.map((j: any) => typeof j === 'string' ? j : (j._id || j.id));

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in p-2">
            <PageHeader
                title="Job Board"
                description="Discover and apply to your next great opportunity."
            />

            {/* Hand off data to the Client Wrapper */}
            <CandidateJobsClient
                initialJobs={jobs}
                initialAppliedIds={appliedJobIds}
                initialSavedIds={savedJobIds}
            />
        </div>
    );
}