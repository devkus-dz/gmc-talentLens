"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import Timeline from '@/components/ui/Timeline';
import ResumeUploadCard from '@/components/profile/ResumeUploadCard';
import AIAnalysisCard from '@/components/profile/AIAnalysisCard';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import CoreSkills from '@/components/profile/CoreSkills';

// --- MOCK DATABASE DATA (Simulating parsed Resume document) ---
const MOCK_PROFILE_DATA = {
    user: {
        firstName: "Alex",
        lastName: "Rivera",
        email: "alex.rivera@example.com"
    },
    resumeMeta: {
        fileName: "Resume_Alex_Rivera_2024.pdf",
        parsedDate: "Oct 12, 2024"
    },
    aiAnalysis: {
        score: 85,
        primaryRole: "Frontend",
        missingSkills: ["GraphQL", "AWS"]
    },
    skills: ["React.js", "TypeScript", "Tailwind CSS", "Node.js", "Figma"],
    languages: [
        { name: "English", level: "Native / Bilingual" },
        { name: "Spanish", level: "Professional Working" }
    ],
    certifications: [
        { name: "AWS Certified Developer - Associate", issuer: "Amazon Web Services", date: "2023" },
        { name: "Meta Front-End Developer Professional", issuer: "Coursera", date: "2022" }
    ],
    experience: [
        {
            id: 1,
            period: "2021 - Present",
            title: "Senior Frontend Engineer",
            subtitle: "Vercel • Remote",
            description: "Lead the development of high-performance user interfaces using React and Next.js. Improved core web vitals by 40% through advanced caching strategies and component optimization. Mentored a team of 4 junior developers."
        },
        {
            id: 2,
            period: "2018 - 2021",
            title: "UI/UX Developer",
            subtitle: "DesignHub • San Francisco, CA",
            description: "Bridged the gap between design and engineering. Built scalable design systems in Figma and translated them into reusable Tailwind CSS component libraries utilized by over 5 product teams."
        }
    ],
    education: [
        {
            id: 1,
            period: "2014 - 2018",
            title: "B.S. Computer Science",
            subtitle: "Stanford University • Stanford, CA",
            description: "Graduated with Honors. Specialized in Human-Computer Interaction. Capstone project focused on accessibility in modern web frameworks."
        }
    ]
};

export default function CandidateProfile() {
    const [profileData, setProfileData] = useState(MOCK_PROFILE_DATA);

    const handleFileSelect = (file: File) => {
        console.log("File ready for API upload:", file.name);
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setProfileData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
    };

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in p-2">
            <PageHeader
                title="Resume & Profile"
                description="Manage your uploaded resume and AI-parsed details."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Upload & AI Stats */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <ResumeUploadCard
                        fileName={profileData.resumeMeta.fileName}
                        parsedDate={profileData.resumeMeta.parsedDate}
                        onFileSelect={handleFileSelect}
                    />
                    <AIAnalysisCard
                        score={profileData.aiAnalysis.score}
                        primaryRole={profileData.aiAnalysis.primaryRole}
                        missingSkills={profileData.aiAnalysis.missingSkills}
                    />
                </div>

                {/* RIGHT COLUMN: Parsed Database Content */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-base-100 rounded-4xl p-6 sm:p-8 shadow-sm border border-base-content/5">

                        {/* 1. Personal Information */}
                        <PersonalInfoForm
                            firstName={profileData.user.firstName}
                            lastName={profileData.user.lastName}
                            email={profileData.user.email}
                        />

                        <div className="divider opacity-30 my-8"></div>

                        {/* 2. Core Skills */}
                        <CoreSkills
                            skills={profileData.skills}
                            onRemoveSkill={handleRemoveSkill}
                            onAddSkill={() => console.log('Open add skill modal')}
                        />

                        <div className="divider opacity-30 my-8"></div>

                        {/* 3. Work Experience */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold text-xl">Work Experience</h2>
                                <button className="btn btn-sm btn-ghost text-primary hover:bg-primary/10 rounded-xl">+ Add</button>
                            </div>
                            <Timeline items={profileData.experience} theme="primary" />
                        </div>

                        <div className="divider opacity-30 my-8"></div>

                        {/* 4. Education */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold text-xl">Education</h2>
                                <button className="btn btn-sm btn-ghost text-secondary hover:bg-secondary/10 rounded-xl">+ Add</button>
                            </div>
                            <Timeline items={profileData.education} theme="secondary" />
                        </div>

                        <div className="divider opacity-30 my-8"></div>

                        {/* 5. Certifications & Languages Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Certifications */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-bold text-lg">Certifications</h2>
                                    <button className="btn btn-xs btn-ghost text-primary">+</button>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {profileData.certifications.map((cert, index) => (
                                        <div key={index} className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5 flex gap-3 items-center">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 11.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm leading-tight">{cert.name}</h4>
                                                <p className="text-xs text-base-content/50 mt-0.5">{cert.issuer} • {cert.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Languages */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-bold text-lg">Languages</h2>
                                    <button className="btn btn-xs btn-ghost text-primary">+</button>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {profileData.languages.map((lang, index) => (
                                        <div key={index} className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5 flex justify-between items-center">
                                            <span className="font-bold text-sm">{lang.name}</span>
                                            <span className="badge badge-sm border-none bg-base-300 text-base-content/70">{lang.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-base-content/10">
                            <button className="btn btn-ghost rounded-xl">Discard Changes</button>
                            <button className="btn btn-primary rounded-xl px-8 shadow-md">Save Profile</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}