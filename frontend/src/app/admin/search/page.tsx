import React, { JSX } from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Building2, Users, Briefcase, ChevronRight, SearchX } from 'lucide-react';
import { fetchFromServer } from '@/lib/api-server';

/**
 * @interface GlobalSearchPageProps
 * @property {Promise<{ q?: string }>} searchParams
 */
interface GlobalSearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

/**
 * Server Component that executes a unified global search across Users, Companies, and Jobs.
 * @async
 * @component
 * @param {GlobalSearchPageProps} props
 * @returns {Promise<JSX.Element>}
 */
export default async function AdminGlobalSearchPage({ searchParams }: GlobalSearchPageProps): Promise<JSX.Element> {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q || '';

    let users = [];
    let companies = [];
    let jobs = [];

    if (query.trim().length > 0) {
        const encodedQuery = encodeURIComponent(query);

        // Execute all 3 search requests in parallel for maximum performance
        const [usersRes, companiesRes, jobsRes] = await Promise.all([
            fetchFromServer(`/users?search=${encodedQuery}&limit=5`),
            fetchFromServer(`/admin/companies?search=${encodedQuery}&limit=5`),
            fetchFromServer(`/jobs?search=${encodedQuery}&limit=5`)
        ]);

        users = usersRes?.data || [];
        companies = companiesRes?.data || [];
        jobs = jobsRes?.data || [];
    }

    const totalResults = users.length + companies.length + jobs.length;

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
                {/* Companies Section */}
                {companies.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2 px-2">
                            <Building2 className="w-5 h-5 text-primary" /> Companies
                        </h2>
                        <div className="bg-base-100 rounded-4xl border border-base-content/5 shadow-sm overflow-hidden flex flex-col">
                            {companies.map((company: any) => (
                                <Link href="/admin/companies" key={company._id} className="p-5 border-b border-base-content/5 hover:bg-base-200/50 transition-colors flex justify-between items-center group last:border-none">
                                    <div>
                                        <h4 className="font-bold text-base-content text-lg">{company.name}</h4>
                                        <p className="text-sm text-base-content/50">{company.industry || 'General'} • {company.location || 'Remote'}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-base-content/30 group-hover:text-primary transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Users Section */}
                {users.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2 px-2">
                            <Users className="w-5 h-5 text-secondary" /> Users Directory
                        </h2>
                        <div className="bg-base-100 rounded-4xl border border-base-content/5 shadow-sm overflow-hidden flex flex-col">
                            {users.map((user: any) => (
                                <Link href={user.role === 'CANDIDATE' ? '/admin/candidates' : '/admin/users'} key={user._id} className="p-5 border-b border-base-content/5 hover:bg-base-200/50 transition-colors flex justify-between items-center group last:border-none">
                                    <div>
                                        <h4 className="font-bold text-base-content text-lg">{user.firstName} {user.lastName}</h4>
                                        <p className="text-sm text-base-content/50">{user.email}</p>
                                    </div>
                                    <span className="badge badge-sm badge-outline opacity-60 mr-4">{user.role}</span>
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
                            <Briefcase className="w-5 h-5 text-accent" /> Job Offers
                        </h2>
                        <div className="bg-base-100 rounded-4xl border border-base-content/5 shadow-sm overflow-hidden flex flex-col">
                            {jobs.map((job: any) => (
                                <Link href="/admin/jobs" key={job._id} className="p-5 border-b border-base-content/5 hover:bg-base-200/50 transition-colors flex justify-between items-center group last:border-none">
                                    <div>
                                        <h4 className="font-bold text-base-content text-lg">{job.title}</h4>
                                        <p className="text-sm text-base-content/50">{job.companyName || 'TalentLens Partner'}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-base-content/30 group-hover:text-primary transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}