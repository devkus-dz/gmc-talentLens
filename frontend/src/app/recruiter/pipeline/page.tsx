// src/app/recruiter/pipeline/page.tsx
import React from 'react';

export default function PipelineKanban() {
    return (
        // Added flex-1 and min-h-0 to ensure it doesn't collapse on mobile
        <div className="flex flex-col gap-6 flex-1 min-h-0 max-w-[1600px] mx-auto w-full animate-fade-in p-2">

            {/* 1. Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kanban Pipeline</h1>
                    <p className="text-base-content/60 mt-1 text-sm">Drag and drop candidates to update their status.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select className="select select-bordered select-sm rounded-xl bg-base-100 border-base-content/10 font-medium flex-1 md:flex-none">
                        <option>All Active Jobs</option>
                        <option>Senior Product Designer</option>
                        <option>Fullstack Engineer</option>
                    </select>
                    <button className="btn btn-sm btn-outline border-base-content/20 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>
                        Filter
                    </button>
                </div>
            </div>

            {/* 2. The Kanban Board (Fluid height for mobile support) */}
            <div className="flex-1 flex overflow-x-auto gap-4 sm:gap-6 pb-6 w-full thin-scrollbar snap-x snap-mandatory">

                {/* Column 1: Applied */}
                {/* FIXED MOBILE WIDTH: Takes up 85vw on mobile, 320px on desktop */}
                <div className="min-w-[85vw] sm:min-w-[320px] w-[85vw] sm:w-[320px] bg-base-200/30 rounded-4xl p-4 flex flex-col border border-base-content/5 snap-center shrink-0 h-full">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="font-bold text-base-content/70 uppercase tracking-widest text-xs">Applied <span className="ml-2 badge badge-sm bg-base-300 border-none font-bold text-base-content/70">12</span></h3>
                    </div>
                    <div className="flex-1 overflow-y-auto thin-scrollbar flex flex-col gap-3 pb-20">
                        <div className="bg-base-100 rounded-2xl p-4 border border-base-content/5 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="avatar"><div className="w-8 h-8 rounded-full"><img src="https://ui-avatars.com/api/?name=F+B&background=f3f4f6" alt="Avatar" /></div></div>
                                    <h4 className="font-bold text-sm">Felix Brown</h4>
                                </div>
                                <span className="badge badge-sm border-none bg-base-200 text-base-content/70 font-bold">72%</span>
                            </div>
                            <p className="text-xs text-base-content/50 mb-3 truncate">Applied for: Senior Product Designer</p>
                            <div className="flex gap-2">
                                <span className="badge bg-base-200/50 border-none text-[10px] px-2 py-2">Figma</span>
                                <span className="badge bg-base-200/50 border-none text-[10px] px-2 py-2">UX</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: In Review */}
                <div className="min-w-[85vw] sm:min-w-[320px] w-[85vw] sm:w-[320px] bg-primary/5 rounded-4xl p-4 flex flex-col border border-primary/10 snap-center shrink-0 h-full">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="font-bold text-primary uppercase tracking-widest text-xs">In Review <span className="ml-2 badge badge-sm bg-primary/20 text-primary border-none font-bold">08</span></h3>
                    </div>
                    <div className="flex-1 overflow-y-auto thin-scrollbar flex flex-col gap-3 pb-20">
                        <div className="bg-base-100 rounded-2xl p-4 border border-base-content/5 shadow-md relative overflow-hidden cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                                <div className="flex items-center gap-3">
                                    <div className="avatar"><div className="w-8 h-8 rounded-full"><img src="https://ui-avatars.com/api/?name=M+J&background=0D1117&color=fff" alt="Avatar" /></div></div>
                                    <h4 className="font-bold text-sm">Maya Jenkins</h4>
                                </div>
                                <span className="badge badge-sm border-none bg-primary text-primary-content font-bold">89%</span>
                            </div>
                            <p className="text-xs text-base-content/50 mb-3 pl-2 truncate">Applied for: Fullstack Engineer</p>
                        </div>
                    </div>
                </div>

                {/* Column 3: Interview */}
                <div className="min-w-[85vw] sm:min-w-[320px] w-[85vw] sm:w-[320px] bg-warning/5 rounded-4xl p-4 flex flex-col border border-warning/10 snap-center shrink-0 h-full">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="font-bold text-warning uppercase tracking-widest text-xs">Interview <span className="ml-2 badge badge-sm bg-warning/20 text-warning border-none font-bold">05</span></h3>
                    </div>
                    <div className="flex-1 overflow-y-auto thin-scrollbar flex flex-col gap-3 pb-20">
                        <div className="bg-base-100 rounded-2xl p-4 border border-base-content/5 shadow-sm cursor-grab active:cursor-grabbing hover:border-warning/50 transition-colors relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-warning"></div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                                <div className="flex items-center gap-3">
                                    <div className="avatar"><div className="w-8 h-8 rounded-full"><img src="https://ui-avatars.com/api/?name=S+W&background=0284c7&color=fff" alt="Avatar" /></div></div>
                                    <h4 className="font-bold text-sm">Sam Wilson</h4>
                                </div>
                                <span className="badge badge-sm border-none bg-base-200 text-base-content/70 font-bold">92%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 4: Offered */}
                <div className="min-w-[85vw] sm:min-w-[320px] w-[85vw] sm:w-[320px] bg-info/5 rounded-4xl p-4 flex flex-col border border-info/10 snap-center shrink-0 h-full">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="font-bold text-info uppercase tracking-widest text-xs">Offered <span className="ml-2 badge badge-sm bg-info/20 text-info border-none font-bold">02</span></h3>
                    </div>
                    <div className="flex-1 overflow-y-auto thin-scrollbar flex flex-col gap-3 pb-20">
                        <div className="h-32 border-2 border-dashed border-info/20 rounded-2xl flex items-center justify-center text-info/50 text-sm font-medium">
                            Drop candidate here
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}