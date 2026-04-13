import React, { Suspense } from 'react'; // 1. IMPORT SUSPENSE
import PageHeader from '@/components/ui/PageHeader';
import CandidateJobsClient from '@/components/candidate/CandidateJobsClient';
import { fetchFromServer } from '@/lib/api-server';

export default async function CandidateJobsPage({
    searchParams
}: {
    searchParams: Promise<{ search?: string }>
}) {
    const resolvedParams = await searchParams;
    const querySearch = resolvedParams.search ? `&search=${encodeURIComponent(resolvedParams.search)}` : '';

    const [jobsRes, appliedRes, authRes] = await Promise.all([
        fetchFromServer(`/jobs?limit=100${querySearch}`),
        fetchFromServer('/jobs/applied'),
        fetchFromServer('/auth/me')
    ]);

    const jobs = Array.isArray(jobsRes) ? jobsRes : (jobsRes?.data || []);
    const appliedJobs = Array.isArray(appliedRes) ? appliedRes : (appliedRes?.data || []);

    const appliedJobIds = appliedJobs.map((app: any) => app.jobId || app._id || app.id);
    const visibleJobs = jobs.filter((job: any) =>
        job.status === 'PUBLISHED' || appliedJobIds.includes(job._id || job.id)
    );

    const savedJobs = authRes?.user?.savedJobs || [];
    const savedJobIds = savedJobs.map((j: any) => typeof j === 'string' ? j : (j._id || j.id));

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in p-2">
            <PageHeader
                title="Job Board"
                description="Discover and apply to your next great opportunity."
            />

            <Suspense fallback={<div className="p-12 text-center w-full"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
                <CandidateJobsClient
                    initialJobs={visibleJobs}
                    initialAppliedIds={appliedJobIds}
                    initialSavedIds={savedJobIds}
                />
            </Suspense>
        </div>
    );
}