import React, { JSX } from 'react';
import Link from 'next/link';
import { Users, Briefcase, ChevronRight, SearchX } from 'lucide-react';
import { fetchFromServer } from '@/lib/api-server';

interface GlobalSearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

/**
 * Server Component that executes a unified global search across Candidates and Jobs for Recruiters.
 */
export default async function RecruiterGlobalSearchPage({ searchParams }: GlobalSearchPageProps): Promise<JSX.Element> {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q || '';

    let candidates = [];
    let jobs = [];

    if (query.trim().length > 0) {
        const encodedQuery = encodeURIComponent(query);

        // Execute search requests in parallel
        // We explicitly pass role=CANDIDATE to ensure recruiters only search the talent pool
        const [candidatesRes, jobsRes] = await Promise.all([
            fetchFromServer(`/users?role=CANDIDATE&search=${encodedQuery}&limit=10`),
            fetchFromServer(`/jobs?search=${encodedQuery}&limit=10`)
        ]);

        candidates = candidatesRes?.data || [];
        jobs = jobsRes?.data || [];
    }

    const totalResults = candidates.length + jobs.length;

    return (
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in pb-20">
            <div className="mb-8 border-b border-base-content/10 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Search Results</h1>
                <p className="text-base-content/60 text-sm mt-1">
                    {query ? `Found ${totalResults} results for "${query}"` : 'Enter a search query in the navbar to begin.'}
                </p>
            </div>

            {query && totalResults === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-base-100 rounded-4xl border border-base-content/5 shadow-sm">
                    <SearchX className="w-16 h-16 text-base-content/20 mb-4" />
                    <h3 className="text-xl font-bold text-base-content">No matches found</h3>
                    <p className="text-base-content/50 mt-2 max-w-md">Try adjusting your search terms or double-checking for typos.</p>
                </div>
            )}

            <div className="flex flex-col gap-8">

                {/* Candidates Section */}
                {candidates.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2 px-2">
                            <Users className="w-5 h-5 text-secondary" /> Candidates Pool
                        </h2>
                        <div className="bg-base-100 rounded-4xl border border-base-content/5 shadow-sm overflow-hidden flex flex-col">
                            {candidates.map((user: any) => (
                                <Link
                                    href={`/recruiter/candidates/${user._id || user.id}`}
                                    key={user._id || user.id}
                                    className="p-5 border-b border-base-content/5 hover:bg-base-200/50 transition-colors flex justify-between items-center group last:border-none"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="avatar placeholder">
                                            {user.profilePictureUrl ? (
                                                <div className="w-12 h-12 rounded-full">
                                                    <img src={user.profilePictureUrl} alt="Avatar" />
                                                </div>
                                            ) : (
                                                <div className="bg-secondary/10 text-secondary rounded-full w-12 h-12 flex items-center justify-center font-bold">
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base-content text-lg">{user.firstName} {user.lastName}</h4>
                                            <p className="text-sm text-base-content/50">{user.email}</p>
                                        </div>
                                    </div>

                                    {user.isLookingForJob && (
                                        <span className="badge badge-success badge-sm badge-soft ml-auto mr-4 hidden sm:inline-flex">Open to Work</span>
                                    )}

                                    <ChevronRight className="w-5 h-5 text-base-content/30 group-hover:text-primary transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Jobs Section */}
                {jobs.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2 px-2">
                            <Briefcase className="w-5 h-5 text-primary" /> Job Offers
                        </h2>
                        <div className="bg-base-100 rounded-4xl border border-base-content/5 shadow-sm overflow-hidden flex flex-col">
                            {jobs.map((job: any) => (
                                <Link
                                    href={`/recruiter/pipeline?job=${job._id || job.id}`}
                                    key={job._id || job.id}
                                    className="p-5 border-b border-base-content/5 hover:bg-base-200/50 transition-colors flex justify-between items-center group last:border-none"
                                >
                                    <div>
                                        <h4 className="font-bold text-base-content text-lg">{job.title}</h4>
                                        <p className="text-sm text-base-content/50">{job.department} • {job.location}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`badge badge-sm uppercase tracking-widest text-[10px] font-bold ${job.status === 'PUBLISHED' ? 'badge-success badge-soft' :
                                                job.status === 'CLOSED' ? 'bg-base-200 text-base-content/50 border-none' :
                                                    'bg-warning/20 text-warning border-none'
                                            }`}>
                                            {job.status}
                                        </span>
                                        <ChevronRight className="w-5 h-5 text-base-content/30 group-hover:text-primary transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}