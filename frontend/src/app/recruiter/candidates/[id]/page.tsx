import React, { JSX } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { fetchFromServer } from '@/lib/api-server';

// Reuse your existing read-only profile components
import CoreSkills from '@/components/profile/CoreSkills';
import TagsCard from '@/components/profile/TagsCard';
import Timeline from '@/components/ui/Timeline';
import CertificationsCard from '@/components/profile/CertificationsCard';
import LanguagesCard from '@/components/profile/LanguagesCard';
import AIAnalysisCard from '@/components/profile/AIAnalysisCard';
import PrintButton from '@/components/ui/PrintButton';

interface RecruiterCandidateProfilePageProps {
    params: Promise<{ id: string }>;
}

/**
 * Server Component to display a Candidate's full read-only profile for Recruiters.
 */
export default async function RecruiterCandidateProfilePage({ params }: RecruiterCandidateProfilePageProps): Promise<JSX.Element> {
    const resolvedParams = await params;
    const candidateId = resolvedParams.id;

    let user = null;
    let resume = null;

    try {
        // Securely Fetch User and Resume Details using your server utility
        const [userRes, resumeRes] = await Promise.all([
            fetchFromServer(`/users/${candidateId}`),
            fetchFromServer(`/resumes/user/${candidateId}`)
        ]);

        user = userRes?.data || userRes;
        resume = resumeRes?.data || resumeRes;
    } catch (error) {
        console.error("Failed to load candidate profile", error);
    }

    if (!user) {
        return (
            <div className="p-8 text-center mt-20">
                <h2 className="text-2xl font-bold text-base-content">Candidate Not Found</h2>
                <p className="text-base-content/60 mt-2">The requested profile does not exist or has been removed.</p>
                <Link href="/recruiter/jobs" className="btn btn-primary mt-6">Back to Job Board</Link>
            </div>
        );
    }

    // Safely extract resume data arrays
    const skills = resume?.skills || [];
    const tags = resume?.tags || [];
    const experiences = resume?.experiences || [];
    const education = resume?.education || [];
    const certifications = resume?.certifications || [];
    const languages = resume?.languages || [];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in pb-20">

            {/* --- HEADER ACTIONS --- */}
            <div className="print:hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <Link href="/recruiter/jobs" className="btn btn-sm btn-ghost gap-2 hover:bg-base-200">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Jobs
                </Link>

                <PrintButton />
            </div>

            {/* --- PROFILE LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">

                {/* LEFT COLUMN: User Info & AI */}
                <div className="lg:col-span-1 flex flex-col gap-6">

                    {/* Basic Info Card */}
                    <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5 flex flex-col items-center text-center">
                        <div className="avatar placeholder mb-4">
                            {user.profilePictureUrl ? (
                                <div className="w-28 h-28 rounded-full border-4 border-base-100 shadow-lg overflow-hidden">
                                    <img src={user.profilePictureUrl} alt="Avatar" className="object-cover w-full h-full" />
                                </div>
                            ) : (
                                <div className="bg-primary text-primary-content rounded-full w-28 h-28 flex items-center justify-center border-4 border-base-100 shadow-lg">
                                    <span className="text-4xl font-bold uppercase">{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</span>
                                </div>
                            )}
                        </div>

                        <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>

                        <div className="flex items-center gap-2 text-base-content/60 font-medium mt-2 text-sm">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${user.email}`} className="hover:text-primary transition-colors">{user.email}</a>
                        </div>

                        <div className="mt-5 w-full pt-5 border-t border-base-content/10">
                            {user.isLookingForJob ? (
                                <span className="badge badge-success badge-lg badge-soft w-full py-4 font-bold">Open to Work</span>
                            ) : (
                                <span className="badge badge-ghost badge-lg w-full py-4 font-medium text-base-content/60">Currently Employed</span>
                            )}
                        </div>
                    </div>

                    {/* AI Analysis (Only shows if a resume is parsed) */}
                    {resume && (
                        <AIAnalysisCard
                            score={resume.yearsOfExperience ? Math.min(100, resume.yearsOfExperience * 10) : 50}
                            primaryRole={tags[0] || 'Professional'}
                            missingSkills={[]}
                            improvementTip={resume.improvementTip}
                        />
                    )}
                </div>

                {/* RIGHT COLUMN: Curriculum Vitae Data */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-base-100 rounded-4xl p-6 sm:p-8 shadow-sm border border-base-content/5">

                        {resume ? (
                            <>
                                {/* By not passing onAdd/onRemove/onEdit props, these components automatically become read-only! */}
                                <CoreSkills skills={skills} />

                                <div className="divider opacity-30 my-8"></div>

                                <TagsCard tags={tags} />

                                <div className="divider opacity-30 my-8"></div>

                                {/* Work Experience */}
                                <div>
                                    <h2 className="font-bold text-xl mb-6">Work Experience</h2>
                                    <Timeline
                                        theme="primary"
                                        items={experiences.map((exp: any, index: number) => ({
                                            id: index,
                                            period: `${exp.startDate || ''} - ${exp.endDate || 'Present'}`,
                                            title: exp.position || 'Unknown Role',
                                            subtitle: exp.company || 'Unknown Company',
                                            description: exp.description || ''
                                        }))}
                                    />
                                </div>

                                <div className="divider opacity-30 my-8"></div>

                                {/* Education */}
                                <div>
                                    <h2 className="font-bold text-xl mb-6">Education</h2>
                                    <Timeline
                                        theme="secondary"
                                        items={education.map((edu: any, index: number) => ({
                                            id: index,
                                            period: `${edu.startDate || ''} - ${edu.endDate || ''}`,
                                            title: edu.degree || 'Degree',
                                            subtitle: edu.institution || 'Institution'
                                        }))}
                                    />
                                </div>

                                <div className="divider opacity-30 my-8"></div>

                                {/* Certifications & Languages Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <CertificationsCard certifications={certifications} />
                                    <LanguagesCard languages={languages} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <div className="bg-base-200/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-base-content/30"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-base-content">No Resume Data</h3>
                                <p className="text-base-content/50 mt-1">This candidate has not uploaded a resume or completed their profile yet.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}