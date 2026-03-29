// src/app/candidate/dashboard/page.tsx
import React from 'react';

export default function CandidateDashboard() {
    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in p-2">

            {/* 1. TOP STATS ROW (3 Separate Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat 1 */}
                <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        </div>
                        <span className="badge badge-primary badge-soft text-xs font-medium py-2.5">+2 this week</span>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-base-content">12</h2>
                        <p className="text-base-content/60 text-sm font-medium mt-1">Total Applications</p>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-base-content">5</h2>
                        <p className="text-base-content/60 text-sm font-medium mt-1">Saved Jobs</p>
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-info/10 flex items-center justify-center text-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <span className="text-info text-xs font-bold">High Visibility</span>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-base-content">156</h2>
                        <p className="text-base-content/60 text-sm font-medium mt-1">Profile Views</p>
                    </div>
                </div>
            </div>

            {/* 2. MAIN SPLIT CONTENT (3/5 and 2/5 Ratio) */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

                {/* LEFT COLUMN: My Applications (Takes up 3 out of 5 columns) */}
                <div className="xl:col-span-3 flex flex-col gap-4">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-2xl font-semibold">My Applications</h2>
                        <button className="text-primary font-medium text-sm hover:underline flex items-center gap-1">
                            View All <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>

                    {/* App Card 1 - Note the blue accent border on the left */}
                    <div className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-content/5 flex items-center gap-4 relative overflow-hidden">
                        {/* Left accent border placeholder if needed, design shows it on the 3rd card, let's put it there instead */}
                        <div className="avatar">
                            <div className="w-12 h-12 rounded-xl bg-neutral text-neutral-content flex items-center justify-center text-xl overflow-hidden shadow-sm">
                                <img src="https://ui-avatars.com/api/?name=Tech+Corp&background=222&color=fff" alt="Logo" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-base leading-tight">React Developer</h3>
                            <p className="text-xs text-base-content/50 mt-1">TechCorp • Applied 3 days ago</p>
                        </div>
                        <div className="badge badge-success badge-soft gap-1.5 py-3 px-3 rounded-xl font-medium text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                            Interview
                        </div>
                    </div>

                    {/* App Card 2 */}
                    <div className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-content/5 flex items-center gap-4">
                        <div className="avatar">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl overflow-hidden shadow-sm">
                                <img src="https://ui-avatars.com/api/?name=Design+Hub&background=333&color=fff" alt="Logo" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-base leading-tight">Senior UI Designer</h3>
                            <p className="text-xs text-base-content/50 mt-1">DesignHub • Applied 1 week ago</p>
                        </div>
                        <div className="badge badge-neutral badge-soft gap-1.5 py-3 px-3 rounded-xl font-medium text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-base-content/40"></span>
                            Reviewing
                        </div>
                    </div>

                    {/* App Card 3 - With Left Accent border */}
                    <div className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-content/5 flex items-center gap-4 relative overflow-hidden">
                        {/* The Blue Left Accent line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>

                        <div className="avatar pl-2">
                            <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center text-lg font-bold shadow-sm">
                                ST
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-base leading-tight">Fullstack Engineer</h3>
                            <p className="text-xs text-base-content/50 mt-1">Stellar AI • Applied 2 hours ago</p>
                        </div>
                        <div className="badge badge-primary badge-soft gap-1.5 py-3 px-3 rounded-xl font-medium text-xs text-primary">
                            New Match
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Resume & Profile (Takes up 2 out of 5 columns) */}
                <div className="xl:col-span-2 flex flex-col gap-4">
                    <div className="mb-1">
                        <h2 className="text-2xl font-semibold">Resume & Profile</h2>
                    </div>

                    <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5 flex flex-col h-full">

                        {/* Upload Area / Current Resume */}
                        <div className="flex flex-col items-center justify-center mb-6 pt-4">
                            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-base-content/20 bg-base-200/50 flex flex-col items-center justify-center text-base-content/50 mb-4 cursor-pointer hover:bg-base-200 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Update</span>
                            </div>
                            <h3 className="font-bold text-lg text-base-content">Resume_Alex_2024.pdf</h3>
                            <p className="text-xs text-base-content/50 mt-1">Last updated Oct 12, 2024</p>
                        </div>

                        <div className="divider my-0"></div>

                        {/* AI Improvement Tip Box */}
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mt-6">
                            <div className="flex items-center gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
                                </svg>
                                <span className="font-bold text-primary text-sm">AI Improvement Tip</span>
                            </div>
                            <p className="text-xs leading-relaxed text-base-content/70">
                                Your profile is missing "GraphQL" skills mentioned in 3 of your saved jobs. Adding this could increase match rate by 24%.
                            </p>
                        </div>

                        {/* AI Extracted Skills */}
                        <div className="mt-6 mb-8">
                            <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest mb-3 block">AI-Extracted Skills</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="badge badge-outline border-primary/20 text-primary bg-primary/5 text-xs py-2.5">React.js</span>
                                <span className="badge badge-outline border-primary/20 text-primary bg-primary/5 text-xs py-2.5">TypeScript</span>
                                <span className="badge badge-outline border-primary/20 text-primary bg-primary/5 text-xs py-2.5">Tailwind CSS</span>
                                <span className="badge badge-outline border-primary/20 text-primary bg-primary/5 text-xs py-2.5">Node.js</span>
                                <span className="badge badge-outline border-primary/20 text-primary bg-primary/5 text-xs py-2.5">Figma</span>
                                <button className="badge badge-outline border-base-content/20 text-base-content/60 text-xs py-2.5 hover:bg-base-200">+ Add</button>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button className="btn btn-primary w-full rounded-xl mt-auto shadow-md">
                            Edit Full Profile
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}