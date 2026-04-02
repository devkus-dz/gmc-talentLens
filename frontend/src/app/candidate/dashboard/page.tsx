import React from 'react';
import StatCard from '@/components/ui/StatCard';
import ApplicationCard from '@/components/ui/ApplicationCard';
import DashboardResumeCard from '@/components/dashboard/DashboardResumeCard';
import Link from 'next/link';
import { fetchFromServer } from '@/lib/api-server';

export default async function CandidateDashboard() {
    // Fetch stats, applied jobs, and resume data in parallel
    const [stats, applications, resumeRes] = await Promise.all([
        fetchFromServer('/dashboard/candidate'),
        fetchFromServer('/jobs/applied'),
        fetchFromServer('/resumes/me')
    ]);

    // Safely extract the data
    const resume = resumeRes?.parsedData || resumeRes?.resume || resumeRes || null;
    const appsList = Array.isArray(applications) ? applications : (applications?.data || []);

    // Calculate Active Interviews directly from the statusChartData payload
    const interviewCount = stats?.statusChartData?.find((s: any) => s.status === 'Interview')?.count || 0;

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in p-2">

            {/* TOP STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Applications"
                    value={stats?.totalApplications || 0}
                    theme="primary"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                />

                <StatCard
                    title="Saved Jobs"
                    value={stats?.totalSavedJobs || 0}
                    theme="secondary"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>}
                />

                <StatCard
                    title="Active Interviews"
                    value={interviewCount}
                    theme="success"
                    trendText={interviewCount > 0 ? "Action Required" : ""}
                    trendType={interviewCount > 0 ? "positive" : "neutral"}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                {/* LEFT COLUMN: Recent Applications (Limited to 4) */}
                <div className="xl:col-span-3 flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold">Recent Applications</h2>
                    <div className="flex flex-col gap-3 mt-2">
                        {appsList.length > 0 ? (
                            <>
                                {appsList.slice(0, 4).map((app: any) => (
                                    <ApplicationCard
                                        key={app.jobId}
                                        title={app.jobTitle}
                                        company="TalentLens Partner"
                                        status={app.myStatus}
                                        appliedAt={new Date(app.appliedAt).toLocaleDateString()}
                                    />
                                ))}
                                {/* Link to the future full applications page */}
                                <Link href="/candidate/applications" className="btn btn-outline border-base-content/10 bg-base-100 hover:bg-base-200 mt-2 rounded-2xl shadow-sm">
                                    View All Applications
                                </Link>
                            </>
                        ) : (
                            <div className="bg-base-100 border border-base-content/5 rounded-3xl p-10 text-center shadow-sm">
                                <p className="text-base-content/50 italic mb-4">You haven't applied to any jobs yet.</p>
                                <Link href="/candidate/jobs" className="btn btn-primary rounded-xl">Browse Job Board</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Extracted Resume Component */}
                <div className="xl:col-span-2 flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold">Resume Status</h2>
                    <div className="mt-2 h-full">
                        <DashboardResumeCard resume={resume} />
                    </div>
                </div>
            </div>
        </div>
    );
}