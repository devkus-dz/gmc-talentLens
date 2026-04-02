import React from 'react';
import Link from 'next/link';

export default function DashboardResumeCard({ resume }: { resume: any }) {
    if (!resume) {
        return (
            <div className="bg-base-100 rounded-4xl p-8 shadow-sm border border-base-content/5 text-center flex flex-col items-center justify-center min-h-[250px]">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </div>
                <h3 className="text-lg font-bold mb-2">No Resume Found</h3>
                <p className="text-sm text-base-content/60 mb-6 max-w-xs">Upload your CV to let our AI build your profile and match you with jobs.</p>
                <Link href="/candidate/profile" className="btn btn-primary rounded-xl px-8 shadow-sm">
                    Upload Resume
                </Link>
            </div>
        );
    }

    const lastUpdated = new Date(resume.updatedAt).toLocaleDateString();

    return (
        <div className="bg-base-100 rounded-4xl p-6 sm:p-8 shadow-sm border border-base-content/5 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-success/10 text-success rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 11.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">Profile Active</h3>
                        <p className="text-[10px] uppercase tracking-widest text-base-content/50 font-bold mt-0.5">Parsed on {lastUpdated}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
                <div className="bg-base-200/50 rounded-2xl p-4 border border-base-content/5">
                    <span className="text-xs font-bold text-base-content/40 uppercase tracking-widest block mb-1">Detected Seniority</span>
                    <span className="font-semibold text-base-content">{resume.yearsOfExperience ? `${resume.yearsOfExperience}+ Years` : 'Entry Level'}</span>
                </div>

                <div>
                    <span className="text-xs font-bold text-base-content/40 uppercase tracking-widest block mb-2">Top Skills</span>
                    <div className="flex flex-wrap gap-2">
                        {resume.skills?.slice(0, 4).map((skill: string) => (
                            <span key={skill} className="badge bg-primary/5 text-primary border-none font-medium py-3 px-3 rounded-lg">{skill}</span>
                        ))}
                        {resume.skills?.length > 4 && (
                            <span className="badge bg-base-200 border-none font-medium py-3 px-2 rounded-lg text-base-content/50">+{resume.skills.length - 4}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-base-content/10">
                <Link href="/candidate/profile" className="btn btn-outline border-base-content/20 w-full rounded-xl hover:bg-base-200 hover:border-base-content/30 hover:text-base-content">
                    Update Profile & Resume
                </Link>
            </div>
        </div>
    );
}