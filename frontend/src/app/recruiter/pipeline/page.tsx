import React from 'react';
import PipelineClient from '@/components/recruiter/PipelineClient';
import { fetchFromServer } from '@/lib/api-server';

export default async function PipelinePage({
    searchParams
}: {
    searchParams: Promise<{ job?: string }>
}) {
    const resolvedParams = await searchParams;
    const jobId = resolvedParams.job;

    const authRes = await fetchFromServer('/auth/me');
    const userId = authRes?.user?._id || authRes?.user?.id;

    let jobs = [];
    if (userId) {
        // fetch only this specific recruiter's jobs
        const jobsRes = await fetchFromServer(`/jobs?createdBy=${userId}&limit=100`);
        jobs = jobsRes?.data || [];
    }

    return <PipelineClient jobs={jobs} initialJobId={jobId} userId={userId} />;
}