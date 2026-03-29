// src/app/candidate/jobs/page.tsx
import React from 'react';

export default function JobBoard() {
    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-fade-in p-2">

            {/* 1. Page Header & Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-base-content/10 pb-4">
                <div className="flex gap-6 text-sm font-medium">
                    <button className="text-primary border-b-2 border-primary pb-1">Browse Jobs</button>
                    <button className="text-base-content/60 hover:text-base-content pb-1">Company</button>
                    <button className="text-base-content/60 hover:text-base-content pb-1">Salaries</button>
                </div>
            </div>

            {/* 2. Filters & Hero Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-center mt-2">

                {/* Filters (Takes 2 columns on desktop) */}
                <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4">
                    <div className="form-control flex-1">
                        <label className="label py-1"><span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">Role Category</span></label>
                        <select className="select select-bordered w-full bg-base-100 border-base-content/10 rounded-xl font-medium focus:outline-primary/20">
                            <option>Engineering & Tech</option>
                            <option>Design & UX</option>
                            <option>Marketing</option>
                        </select>
                    </div>

                    <div className="form-control flex-1">
                        <label className="label py-1"><span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">Job Type</span></label>
                        <select className="select select-bordered w-full bg-base-100 border-base-content/10 rounded-xl font-medium focus:outline-primary/20">
                            <option>Remote (Global)</option>
                            <option>Hybrid</option>
                            <option>On-site</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button className="btn btn-primary rounded-xl aspect-square px-0 w-12 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                        </button>
                    </div>
                </div>

                {/* Hero Banner (Takes 1 column) */}
                <div className="bg-linear-to-br from-primary to-secondary rounded-2xl p-5 text-primary-content flex justify-between items-center shadow-md">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Active Searches</p>
                        <h2 className="text-2xl font-bold leading-tight">1,248 Jobs Found</h2>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" /></svg>
                    </div>
                </div>
            </div>

            {/* 3. Job Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">

                {/* Job Card 1 */}
                <div className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-neutral text-neutral-content flex items-center justify-center overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Lumina+Labs&background=0D1117&color=fff" alt="Lumina Labs" />
                            </div>
                            <button className="text-base-content/30 hover:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M6.32 2.577a4.902 4.902 0 013.273-1.077h4.814c1.33 0 2.606.528 3.546 1.468.94.94 1.468 2.216 1.468 3.546v15a.75.75 0 01-1.155.633l-6.267-4.04-6.267 4.04a.75.75 0 01-1.155-.633V6.514A5.002 5.002 0 016.32 2.577z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        <h3 className="font-bold text-lg leading-tight">Senior Product Designer</h3>
                        <div className="flex flex-col gap-1 mt-2 text-sm text-base-content/60">
                            <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg> Lumina Labs</span>
                            <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg> Remote, San Francisco</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 mb-6">
                            <span className="badge badge-primary badge-soft text-xs py-2.5">Figma</span>
                            <span className="badge badge-primary badge-soft text-xs py-2.5">UI/UX</span>
                            <span className="badge badge-primary badge-soft text-xs py-2.5">Design Systems</span>
                        </div>
                        <button className="btn w-full bg-base-200/50 hover:bg-base-200 border-none rounded-xl font-semibold mt-auto">
                            1-Click Apply <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                </div>

                {/* Job Card 2 */}
                <div className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Nexus+AI&background=F3E8FF&color=9333EA" alt="Nexus AI" />
                            </div>
                            <button className="text-base-content/30 hover:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
                            </button>
                        </div>
                        <h3 className="font-bold text-lg leading-tight">Fullstack Engineer</h3>
                        <div className="flex flex-col gap-1 mt-2 text-sm text-base-content/60">
                            <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg> Nexus AI</span>
                            <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg> New York, NY (Hybrid)</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 mb-6">
                            <span className="badge badge-primary badge-soft text-xs py-2.5">React</span>
                            <span className="badge badge-primary badge-soft text-xs py-2.5">Node.js</span>
                            <span className="badge badge-primary badge-soft text-xs py-2.5">TypeScript</span>
                        </div>
                        <button className="btn w-full bg-base-200/50 hover:bg-base-200 border-none rounded-xl font-semibold mt-auto">
                            1-Click Apply <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                </div>

                {/* Job Card 3 */}
                <div className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-neutral text-neutral-content flex items-center justify-center overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Flow+Finance&background=0284C7&color=fff" alt="Flow Finance" />
                            </div>
                            <button className="text-base-content/30 hover:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
                            </button>
                        </div>
                        <h3 className="font-bold text-lg leading-tight">Marketing Director</h3>
                        <div className="flex flex-col gap-1 mt-2 text-sm text-base-content/60">
                            <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg> Flow Finance</span>
                            <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg> London, UK</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 mb-6">
                            <span className="badge badge-primary badge-soft text-xs py-2.5">Growth</span>
                            <span className="badge badge-primary badge-soft text-xs py-2.5">SEO</span>
                            <span className="badge badge-primary badge-soft text-xs py-2.5">Branding</span>
                        </div>
                        <button className="btn w-full bg-base-200/50 hover:bg-base-200 border-none rounded-xl font-semibold mt-auto">
                            1-Click Apply <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                </div>

            </div>

            {/* 4. Load More Button */}
            <div className="flex justify-center mt-6 mb-4">
                <button className="btn btn-outline border-base-content/20 text-base-content/70 hover:bg-base-200 hover:border-base-content/30 rounded-full px-8">
                    Load More Positions <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </button>
            </div>

        </div>
    );
}