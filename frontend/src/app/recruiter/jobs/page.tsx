// src/app/recruiter/jobs/page.tsx
import React from 'react';

export default function ManageJobs() {
    return (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full animate-fade-in p-2">

            {/* 1. Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-content/10 pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Jobs</h1>
                    <p className="text-base-content/60 mt-1 text-sm">Create, edit, and publish your job openings.</p>
                </div>

                <button className="btn btn-primary rounded-xl shadow-md bg-linear-to-r from-primary to-secondary border-none w-full sm:w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Post New Job
                </button>
            </div>

            {/* 2. Tabs */}
            <div className="flex gap-6 text-sm font-medium mt-2">
                <button className="text-primary border-b-2 border-primary pb-1">All Roles <span className="badge badge-sm badge-primary badge-soft ml-1">14</span></button>
                <button className="text-base-content/50 hover:text-base-content pb-1">Active <span className="badge badge-sm bg-base-200 border-none text-base-content/60 ml-1">12</span></button>
                <button className="text-base-content/50 hover:text-base-content pb-1">Drafts <span className="badge badge-sm bg-base-200 border-none text-base-content/60 ml-1">2</span></button>
            </div>

            {/* 3. Job List */}
            <div className="flex flex-col gap-4 mt-2">

                {/* Active Job Card */}
                <div className="bg-base-100 rounded-2xl p-4 sm:p-6 border border-base-content/5 shadow-sm hover:shadow-md transition-shadow flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-success"></div>

                    <div className="flex-1 pl-2 w-full">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-lg sm:text-xl font-bold line-clamp-1">Senior Product Designer</h2>
                            <span className="badge badge-success badge-soft text-[10px] font-bold uppercase tracking-widest py-2.5 shrink-0">Published</span>
                        </div>
                        <p className="text-xs sm:text-sm text-base-content/60 flex flex-wrap items-center gap-2">
                            Engineering • Remote • <span className="text-base-content/40">Created Oct 12</span>
                        </p>
                    </div>

                    {/* FIXED MOBILE OVERFLOW: Adjusted gaps, paddings, and added flex-1 to center items */}
                    <div className="flex justify-between sm:justify-center items-center gap-2 sm:gap-8 px-4 sm:px-6 py-4 bg-base-200/30 rounded-2xl border border-base-content/5 w-full xl:w-auto">
                        <div className="text-center flex-1 sm:flex-none">
                            <p className="text-xl sm:text-2xl font-bold text-base-content">42</p>
                            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-base-content/50 mt-1">Applied</p>
                        </div>
                        <div className="w-px h-8 bg-base-content/10 shrink-0"></div>
                        <div className="text-center flex-1 sm:flex-none">
                            <p className="text-xl sm:text-2xl font-bold text-primary">8</p>
                            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-base-content/50 mt-1">Interview</p>
                        </div>
                        <div className="w-px h-8 bg-base-content/10 shrink-0"></div>
                        <div className="text-center flex-1 sm:flex-none">
                            <p className="text-xl sm:text-2xl font-bold text-success">1</p>
                            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-base-content/50 mt-1">Offered</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between xl:justify-end gap-6 w-full xl:w-auto mt-2 xl:mt-0 pt-4 xl:pt-0 border-t border-base-content/5 xl:border-none">
                        <div className="flex flex-col items-start xl:items-end gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">Accepting</span>
                            <input type="checkbox" className="toggle toggle-success toggle-sm" defaultChecked />
                        </div>

                        <div className="dropdown dropdown-end">
                            <button tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
                            </button>
                            <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-40 border border-base-content/10">
                                <li><a className="font-medium">Edit Job</a></li>
                                <li><a className="font-medium text-error">Delete</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}