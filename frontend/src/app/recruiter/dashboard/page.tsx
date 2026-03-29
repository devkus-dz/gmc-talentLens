// src/app/recruiter/dashboard/page.tsx
import React from 'react';

export default function RecruiterDashboard() {
    return (
        <div className="flex flex-col gap-8 max-w-[1600px] mx-auto w-full animate-fade-in pb-24 lg:pb-8">

            {/* Top Stats Grid (Mapped to Backend Aggregations) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">

                {/* Stat 1: Active Jobs (isActive: true) */}
                <div className="bg-base-100 rounded-2xl p-5 shadow-sm border border-base-content/5 flex flex-col justify-between hover:border-primary/30 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>
                        </div>
                        <span className="badge badge-sm border-none bg-success/10 text-success font-bold">+2</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-base-content">12</h2>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-base-content/50 mt-1">Active Jobs</p>
                    </div>
                </div>

                {/* Stat 2: Total Candidates ($sum of applicants array) */}
                <div className="bg-base-100 rounded-2xl p-5 shadow-sm border border-base-content/5 flex flex-col justify-between hover:border-secondary/30 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                        </div>
                        <span className="badge badge-sm border-none bg-success/10 text-success font-bold">+148</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-base-content">842</h2>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-base-content/50 mt-1">Total Pipeline</p>
                    </div>
                </div>

                {/* Stat 3: In Interview (status: 'Interview') */}
                <div className="bg-base-100 rounded-2xl p-5 shadow-sm border border-base-content/5 flex flex-col justify-between hover:border-warning/30 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>
                        </div>
                        <span className="badge badge-sm border-none bg-base-200 text-base-content/60 font-bold">This Week</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-base-content">24</h2>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-base-content/50 mt-1">Interviews Scheduled</p>
                    </div>
                </div>

                {/* Stat 4: Offers Sent (status: 'Offered') */}
                <div className="bg-base-100 rounded-2xl p-5 shadow-sm border border-base-content/5 flex flex-col justify-between hover:border-info/30 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
                        </div>
                        <span className="badge badge-sm border-none bg-base-200 text-base-content/60 font-bold">Pending</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-base-content">5</h2>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-base-content/50 mt-1">Offers Extended</p>
                    </div>
                </div>

            </div>

            {/* 2. AI Match Finder Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4">AI Match Finder</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Job Detail Left Card */}
                    <div className="lg:col-span-2 bg-base-200/50 rounded-4xl p-6 lg:p-8 border border-base-content/5 relative group cursor-pointer hover:bg-base-200 transition-colors">
                        <button className="absolute top-6 right-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.158 3.71 3.71 1.159-1.157a2.625 2.625 0 000-3.711z" /><path d="M10.731 15.698a7.5 7.5 0 003.768-6.57L8.4 5.03A7.46 7.46 0 005.03 8.4l4.098 4.098a7.5 7.5 0 001.603 3.2z" clipRule="evenodd" /></svg>
                        </button>
                        <h3 className="text-2xl font-bold">Senior Product Designer</h3>
                        <p className="text-base-content/60 text-sm mt-1 mb-6">Engineering • Remote • Full-time</p>

                        <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-3">Key Requirements</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="badge bg-base-100 border-none px-4 py-3 rounded-xl text-xs font-medium shadow-sm">Design Systems</span>
                            <span className="badge bg-base-100 border-none px-4 py-3 rounded-xl text-xs font-medium shadow-sm">Tailwind CSS</span>
                            <span className="badge bg-base-100 border-none px-4 py-3 rounded-xl text-xs font-medium shadow-sm">8+ Years Exp</span>
                        </div>

                        <p className="text-base-content/80 text-sm leading-relaxed max-w-2xl">
                            Looking for a designer who understands the intersection of high-end UI patterns and scalable component architecture...
                        </p>
                    </div>

                    {/* Top Match Right Card */}
                    <div className="lg:col-span-1 bg-base-100 rounded-4xl p-6 lg:p-8 shadow-sm border border-base-content/5 flex items-center gap-6">
                        <div className="radial-progress text-primary border-4 border-primary/10 font-bold bg-base-100" style={{ "--value": 94, "--size": "5rem", "--thickness": "0.3rem" } as any} role="progressbar">
                            <span className="text-base-content">94%</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg">Alex Rivera</h4>
                            <p className="text-xs text-base-content/60 mt-0.5">Former Lead at Vercel</p>
                            <p className="text-xs text-primary font-medium italic mt-3">"Deep expertise in React-based design systems."</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Recruitment Pipeline Kanban */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Recruitment Pipeline</h2>

                {/* Horizontal Scrolling Container */}
                <div className="flex overflow-x-auto gap-6 pb-6 snap-x hide-scrollbar">

                    {/* Column 1: Applied */}
                    <div className="min-w-[320px] w-[320px] shrink-0 snap-start flex flex-col gap-4">
                        <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base-content">Applied</h3>
                                <span className="badge badge-sm border-none bg-base-200 text-base-content/70 font-bold">12</span>
                            </div>
                            <button className="text-base-content/40 hover:text-base-content"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg></button>
                        </div>

                        {/* Candidate Card */}
                        <div className="bg-base-100 rounded-2xl p-4 border border-base-content/10 shadow-sm cursor-pointer hover:border-primary/30 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-3">
                                    <div className="avatar">
                                        <div className="w-10 h-10 rounded-full"><img src="https://ui-avatars.com/api/?name=Felix+Brown&background=f3f4f6" alt="Avatar" /></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Felix Brown</h4>
                                        <p className="text-[10px] text-base-content/50">2 hours ago</p>
                                    </div>
                                </div>
                                <span className="badge badge-sm border-none bg-base-200 text-base-content/70 font-bold">72%</span>
                            </div>
                            <div className="flex gap-2 mb-4">
                                <span className="badge bg-base-200/50 border-none text-[10px] px-2 py-2">Figma</span>
                                <span className="badge bg-base-200/50 border-none text-[10px] px-2 py-2">UX</span>
                                <span className="badge bg-base-200/50 border-none text-[10px] px-2 py-2">Motion</span>
                            </div>
                            <div className="flex justify-between items-center text-base-content/40">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: In Review (Active Column Styling) */}
                    <div className="min-w-[320px] w-[320px] shrink-0 snap-start flex flex-col gap-4">
                        <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-primary">In Review</h3>
                                <span className="badge badge-sm border-none bg-primary/10 text-primary font-bold">08</span>
                            </div>
                            <button className="text-base-content/40 hover:text-base-content"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg></button>
                        </div>

                        {/* Active Candidate Card */}
                        <div className="bg-base-100 rounded-2xl p-4 border border-base-content/10 shadow-md relative overflow-hidden cursor-pointer">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                            <div className="flex justify-between items-start mb-3 pl-2">
                                <div className="flex gap-3">
                                    <div className="avatar">
                                        <div className="w-10 h-10 rounded-full"><img src="https://ui-avatars.com/api/?name=Maya+Jenkins&background=0D1117&color=fff" alt="Avatar" /></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Maya Jenkins</h4>
                                        <p className="text-[10px] text-base-content/50">1 day ago</p>
                                    </div>
                                </div>
                                <span className="badge badge-sm border-none bg-primary text-primary-content font-bold">89%</span>
                            </div>
                            <div className="flex gap-2 mb-4 pl-2">
                                <span className="badge bg-base-200/50 border-none text-[10px] px-2 py-2">Design Ops</span>
                                <span className="badge bg-base-200/50 border-none text-[10px] px-2 py-2">Team Lead</span>
                            </div>
                            <div className="flex justify-between items-center text-base-content/40 pl-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg>
                                <div className="flex items-center gap-1 text-[10px] font-medium"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 2d left</div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Interview */}
                    <div className="min-w-[320px] w-[320px] shrink-0 snap-start flex flex-col gap-4">
                        <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-primary">Interview</h3>
                                <span className="badge badge-sm border-none bg-primary/10 text-primary font-bold">05</span>
                            </div>
                            <button className="text-base-content/40 hover:text-base-content"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg></button>
                        </div>

                        {/* Active Candidate Card with Zoom Link */}
                        <div className="bg-base-100 rounded-2xl p-4 border border-base-content/10 shadow-md relative overflow-hidden cursor-pointer">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                            <div className="flex justify-between items-start mb-3 pl-2">
                                <div className="flex gap-3">
                                    <div className="avatar">
                                        <div className="w-10 h-10 rounded-full"><img src="https://ui-avatars.com/api/?name=Sam+Wilson&background=0284c7&color=fff" alt="Avatar" /></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Sam Wilson</h4>
                                        <p className="text-[10px] text-base-content/50">Today @ 2:00 PM</p>
                                    </div>
                                </div>
                                <span className="badge badge-sm border-none bg-primary text-primary-content font-bold">92%</span>
                            </div>

                            <div className="bg-primary/5 text-primary text-[10px] font-bold py-2 px-3 rounded-lg mb-4 ml-2 flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" /></svg>
                                Zoom link attached
                            </div>

                            <div className="flex justify-between items-center text-base-content/40 pl-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" /></svg>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Floating Action Button for creating new jobs */}
            <button className="btn btn-primary btn-circle btn-lg fixed bottom-24 lg:bottom-12 right-6 lg:right-12 shadow-[0_10px_20px_-10px_rgba(0,47,187,0.5)] z-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </button>

        </div>
    );
}