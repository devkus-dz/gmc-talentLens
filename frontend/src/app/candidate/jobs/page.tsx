import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import CandidateJobCard from '@/components/ui/CandidateJobCard';
import { fetchFromServer } from '@/lib/api-server';

export default async function CandidateJobsPage() {
    // Fetch jobs from the backend (Ensure this matches your backend route in ROUTES.md)
    // We also fetch the user's applied jobs so we can mark them as "Applied" in the UI
    const [jobsRes, appliedRes] = await Promise.all([
        fetchFromServer('/jobs'),
        fetchFromServer('/jobs/applied')
    ]);

    // Ensure we have arrays even if the API returns empty/null
    const jobs = Array.isArray(jobsRes) ? jobsRes : (jobsRes?.data || []);
    const appliedJobs = Array.isArray(appliedRes) ? appliedRes : (appliedRes?.data || []);

    // Create an array of job IDs the user has already applied to for easy checking
    const appliedJobIds = appliedJobs.map((app: any) => app.jobId || app._id);

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in p-2">
            <PageHeader
                title="Job Board"
                description="Discover and apply to your next great opportunity."
            />

            {/* --- Search & Filter Bar --- */}
            <div className="bg-base-100 p-4 rounded-3xl shadow-sm border border-base-content/5 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search for job titles, keywords, or companies..."
                        className="input input-bordered w-full pl-12 bg-base-200/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <select className="select select-bordered bg-base-200/50 rounded-2xl border-none md:w-48">
                    <option>All Types</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                </select>
                <button className="btn btn-primary rounded-2xl px-8">Search</button>
            </div>

            {/* --- Job Listings Grid --- */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2 px-2">
                    <h2 className="font-bold text-xl text-base-content">Recommended Jobs</h2>
                    <span className="text-sm font-medium text-base-content/50">{jobs.length} Results</span>
                </div>

                {jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job: any) => {
                            const hasApplied = appliedJobIds.includes(job._id || job.id);

                            return (
                                <CandidateJobCard
                                    key={job._id || job.id}
                                    id={job._id || job.id}
                                    title={job.title}
                                    company={job.companyName || 'TalentLens Partner'}
                                    location={job.location || 'Remote'}
                                    type={job.employmentType || 'Full-time'}
                                    salary={job.salaryRange || 'Competitive'}
                                    description={job.description}
                                    postedAt={new Date(job.createdAt).toLocaleDateString()}
                                    isApplied={hasApplied}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-base-100 rounded-3xl p-12 text-center border border-base-content/5 shadow-sm">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Jobs Available</h3>
                        <p className="text-base-content/60 max-w-md mx-auto">There are currently no job openings that match your criteria. Check back later or adjust your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}