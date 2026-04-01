import React from 'react';
import StatCard from '@/components/ui/StatCard';
import ApplicationCard from '@/components/ui/ApplicationCard';
import { fetchFromServer } from '@/lib/api-server';

/**
 * Server Component: Candidate Dashboard
 * Fetches real-time statistics and application status from the Express backend.
 */
export default async function CandidateDashboard() {
    // Fetch data in parallel for performance
    const [stats, applications] = await Promise.all([
        fetchFromServer('/dashboard/candidate'),
        fetchFromServer('/jobs/applied')
    ]);

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in p-2">

            {/* TOP STATS ROW - Using real backend data */}
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
                    title="Profile Views"
                    value="156" // This can be added to user model later
                    theme="info"
                    trendText="High Visibility"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                {/* LEFT COLUMN: Real Applications List */}
                <div className="xl:col-span-3 flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold">Recent Applications</h2>
                    <div className="flex flex-col gap-3 mt-4">
                        {applications && applications.length > 0 ? (
                            applications.map((app: any) => (
                                <ApplicationCard
                                    key={app.jobId}
                                    title={app.jobTitle}
                                    company="Company" // You can populate this in backend controller
                                    status={app.myStatus}
                                    appliedAt={new Date(app.appliedAt).toLocaleDateString()}
                                />
                            ))
                        ) : (
                            <p className="text-base-content/50 italic">You haven't applied to any jobs yet.</p>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Profile Summary - Keep as Client Component for Uploads */}
                <div className="xl:col-span-2 flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold">Resume Status</h2>
                    <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5">
                        {/* We will build a small client wrapper for the upload part next */}
                        <p className="text-sm text-base-content/70">Manage your AI-parsed skills and resume files here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}