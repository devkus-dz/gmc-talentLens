import React from 'react';
import { fetchFromServer } from '@/lib/api-server';
import JobDetailClient from '@/components/jobs/JobDetailClient';
import Link from 'next/link';

export default async function CandidateJobDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    // Await the dynamic URL parameters (Next.js 15 standard)
    const resolvedParams = await params;
    const jobId = resolvedParams.id;

    try {
        // Fetch the specific job, the user's applied list, and their saved list in parallel
        const [jobRes, appliedRes, authRes] = await Promise.all([
            fetchFromServer(`/jobs/${jobId}`),
            fetchFromServer('/jobs/applied'),
            fetchFromServer('/auth/me')
        ]);

        const job = jobRes?.data || jobRes;

        // If the job was deleted or the ID is wrong, show a friendly error
        if (!job || !job.title) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
                    <div className="w-20 h-20 bg-base-200 text-base-content/30 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h2 className="text-3xl font-bold">Job Not Found</h2>
                    <p className="text-base-content/60 max-w-sm mb-4">This job may have been closed by the recruiter or the link has expired.</p>
                    <Link href="/candidate/jobs" className="btn btn-primary rounded-xl px-8 shadow-sm">
                        Back to Job Board
                    </Link>
                </div>
            );
        }

        // Check if the user has already applied
        const appliedJobs = Array.isArray(appliedRes) ? appliedRes : (appliedRes?.data || []);
        const isAppliedInitially = appliedJobs.some((app: any) =>
            app.jobId === jobId || app._id === jobId || app.id === jobId
        );

        // Check if the user has saved the job
        const savedJobs = authRes?.user?.savedJobs || [];
        const isSavedInitially = savedJobs.some((j: any) =>
            (typeof j === 'string' ? j : (j._id || j.id)) === jobId
        );

        return (
            <div className="max-w-4xl mx-auto w-full animate-fade-in p-2 sm:p-4 mb-10">
                <JobDetailClient
                    job={job}
                    isAppliedInitially={isAppliedInitially}
                    isSavedInitially={isSavedInitially}
                />
            </div>
        );

    } catch (error) {
        console.error("Failed to load job page:", error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
                <h2 className="text-2xl font-bold">Something went wrong</h2>
                <p className="text-base-content/60 max-w-sm mb-4">We encountered an error loading this job description. Please try again later.</p>
                <Link href="/candidate/jobs" className="btn btn-primary rounded-xl">
                    Back to Job Board
                </Link>
            </div>
        );
    }
}