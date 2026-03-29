// src/app/candidate/profile/page.tsx
import React from 'react';

export default function CandidateProfile() {
    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in p-2">

            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-base-content">Resume & Profile</h1>
                <p className="text-base-content/60 mt-1 text-sm">Manage your uploaded resume and AI-parsed details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* =========================================
                        LEFT COLUMN: Upload & AI Analysis
                        ========================================= */}
                <div className="lg:col-span-1 flex flex-col gap-6">

                    {/* Resume Upload Card */}
                    <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5 flex flex-col">
                        <h2 className="font-bold text-lg mb-4">Your Resume</h2>

                        {/* Drag & Drop Zone */}
                        <div className="border-2 border-dashed border-base-content/20 bg-base-200/30 hover:bg-base-200/60 transition-colors rounded-3xl flex flex-col items-center justify-center p-8 cursor-pointer group">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                            </div>
                            <p className="font-medium text-sm text-center">Click or drag PDF to replace</p>
                            <p className="text-xs text-base-content/50 mt-1 text-center">Max file size: 5MB</p>
                        </div>

                        {/* Current File Info */}
                        <div className="mt-6 p-4 rounded-2xl bg-base-200/50 flex items-center gap-3">
                            <div className="p-2 bg-error/10 text-error rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold text-sm truncate">Resume_Alex_2024.pdf</p>
                                <p className="text-xs text-base-content/50">Parsed on Oct 12, 2024</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis Card */}
                    <div className="bg-linear-to-br from-primary/5 to-secondary/5 rounded-4xl p-6 border border-primary/10 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" /></svg>
                            <span className="font-bold text-primary text-sm">AI Profile Analysis</span>
                        </div>
                        <p className="text-sm leading-relaxed text-base-content/80 mb-4">
                            Your profile is highly optimized for Frontend roles. However, adding <span className="font-semibold text-primary">GraphQL</span> or <span className="font-semibold text-primary">AWS</span> to your skills could increase your match rate for Fullstack positions by 24%.
                        </p>
                        <div className="w-full bg-base-200 rounded-full h-2 mb-1">
                            <div className="bg-primary h-2 rounded-full w-[85%]"></div>
                        </div>
                        <p className="text-xs text-right text-base-content/50 font-medium mt-1">85% Complete</p>
                    </div>

                </div>

                {/* =========================================
            RIGHT COLUMN: Form & Data
            ========================================= */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-base-100 rounded-4xl p-6 sm:p-8 shadow-sm border border-base-content/5">

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-xl">Personal Information</h2>
                            <button className="btn btn-sm btn-ghost text-primary hover:bg-primary/10 rounded-xl">Edit</button>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="form-control">
                                <label className="label py-1"><span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">First Name</span></label>
                                <input type="text" defaultValue="Alex" className="input bg-base-200/50 border-transparent focus:border-primary/30 rounded-xl text-sm font-medium" />
                            </div>
                            <div className="form-control">
                                <label className="label py-1"><span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">Last Name</span></label>
                                <input type="text" defaultValue="Rivera" className="input bg-base-200/50 border-transparent focus:border-primary/30 rounded-xl text-sm font-medium" />
                            </div>
                            <div className="form-control sm:col-span-2">
                                <label className="label py-1"><span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">Email Address</span></label>
                                <input type="email" defaultValue="alex.rivera@example.com" className="input bg-base-200/50 border-transparent focus:border-primary/30 rounded-xl text-sm font-medium" />
                            </div>
                        </div>

                        <div className="divider opacity-30"></div>

                        {/* Skills Section */}
                        <div className="mb-8">
                            <h2 className="font-bold text-xl mb-4">Core Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                <span className="badge badge-lg border-primary/20 text-primary bg-primary/5 rounded-xl py-4 px-4 font-medium">React.js <button className="ml-2 hover:text-error">×</button></span>
                                <span className="badge badge-lg border-primary/20 text-primary bg-primary/5 rounded-xl py-4 px-4 font-medium">TypeScript <button className="ml-2 hover:text-error">×</button></span>
                                <span className="badge badge-lg border-primary/20 text-primary bg-primary/5 rounded-xl py-4 px-4 font-medium">Tailwind CSS <button className="ml-2 hover:text-error">×</button></span>
                                <span className="badge badge-lg border-primary/20 text-primary bg-primary/5 rounded-xl py-4 px-4 font-medium">Node.js <button className="ml-2 hover:text-error">×</button></span>
                                <span className="badge badge-lg border-primary/20 text-primary bg-primary/5 rounded-xl py-4 px-4 font-medium">Figma <button className="ml-2 hover:text-error">×</button></span>
                                <button className="badge badge-lg border-dashed border-base-content/30 text-base-content/60 bg-transparent rounded-xl py-4 px-4 hover:bg-base-200 transition-colors cursor-pointer">+ Add Skill</button>
                            </div>
                        </div>

                        <div className="divider opacity-30"></div>

                        {/* Experience Timeline */}
                        <div>
                            <h2 className="font-bold text-xl mb-6">Work Experience</h2>
                            <ul className="timeline timeline-vertical timeline-snap-icon max-md:timeline-compact">

                                {/* Experience 1 */}
                                <li>
                                    <div className="timeline-middle text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div className="timeline-start md:text-end mb-6 md:mb-0">
                                        <time className="text-xs font-bold text-primary tracking-widest uppercase">2021 - Present</time>
                                        <h3 className="text-lg font-bold mt-1">Senior Frontend Engineer</h3>
                                        <p className="text-sm text-base-content/60 font-medium">Vercel • Remote</p>
                                    </div>
                                    <div className="timeline-end md:ml-4 mb-6 bg-base-200/30 p-4 rounded-2xl border border-base-content/5 text-sm text-base-content/80 leading-relaxed">
                                        Lead the development of high-performance user interfaces using React and Next.js. Improved core web vitals by 40% through advanced caching strategies and component optimization.
                                    </div>
                                    <hr className="bg-primary/20" />
                                </li>

                                {/* Experience 2 */}
                                <li>
                                    <hr className="bg-primary/20" />
                                    <div className="timeline-middle text-base-content/30">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div className="timeline-start md:text-end mb-6 md:mb-0">
                                        <time className="text-xs font-bold text-base-content/40 tracking-widest uppercase">2018 - 2021</time>
                                        <h3 className="text-lg font-bold mt-1">UI/UX Developer</h3>
                                        <p className="text-sm text-base-content/60 font-medium">DesignHub • San Francisco, CA</p>
                                    </div>
                                    <div className="timeline-end md:ml-4 mb-6 bg-base-200/30 p-4 rounded-2xl border border-base-content/5 text-sm text-base-content/80 leading-relaxed">
                                        Bridged the gap between design and engineering. Built scalable design systems in Figma and translated them into reusable Tailwind CSS component libraries.
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-base-content/10">
                            <button className="btn btn-ghost rounded-xl">Cancel</button>
                            <button className="btn btn-primary rounded-xl px-8 shadow-md">Save Changes</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}