"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonalInfoForm from './PersonalInfoForm';
import CoreSkills from './CoreSkills';
import TagsCard from './TagsCard';
import Timeline from '../ui/Timeline';
import CertificationsCard from './CertificationsCard';
import LanguagesCard from './LanguagesCard';
import api from '@/lib/api';

interface ProfileEditorProps {
    initialUser: any;
    initialResume: any;
}

export default function ProfileEditor({ initialUser, initialResume }: ProfileEditorProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const [user, setUser] = useState({
        firstName: initialUser?.firstName || initialResume?.firstName || '',
        lastName: initialUser?.lastName || initialResume?.lastName || '',
        email: initialUser?.email || initialResume?.email || ''
    });

    const [skills, setSkills] = useState<string[]>(initialResume?.skills || []);
    const [tags, setTags] = useState<string[]>(initialResume?.tags || []);

    // --- Action Handlers ---

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(prev => prev.filter(s => s !== skillToRemove));
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(prev => prev.filter(t => t !== tagToRemove));
    };

    const handleDiscard = () => {
        // Reset all states back to the initial server props
        setUser({
            firstName: initialUser?.firstName || initialResume?.firstName || '',
            lastName: initialUser?.lastName || initialResume?.lastName || '',
            email: initialUser?.email || initialResume?.email || ''
        });
        setSkills(initialResume?.skills || []);
        setTags(initialResume?.tags || []);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {

            await api.patch('/users/profile', {
                firstName: user.firstName,
                lastName: user.lastName
            });

            await api.patch(`/resumes/${initialResume._id || initialResume.id}`, {
                skills,
                tags
            });

            router.refresh();
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to save profile:", error);
            alert("Failed to save profile changes.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-base-100 rounded-4xl p-6 sm:p-8 shadow-sm border border-base-content/5">
            {/* Wired the PersonalInfoForm to the new user state */}
            <PersonalInfoForm
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                onChangeFirstName={(val) => setUser({ ...user, firstName: val })}
                onChangeLastName={(val) => setUser({ ...user, lastName: val })}
            />

            <div className="divider opacity-30 my-8"></div>

            {initialResume ? (
                <>
                    <CoreSkills
                        skills={skills}
                        onRemoveSkill={handleRemoveSkill}
                        onAddSkill={() => {/* Implement Add Modal Later */ }}
                    />

                    <div className="divider opacity-30 my-8"></div>

                    <TagsCard
                        tags={tags}
                        onRemoveTag={handleRemoveTag}
                        onAddTag={() => {/* Implement Add Modal Later */ }}
                    />

                    <div className="divider opacity-30 my-8"></div>

                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-xl">Work Experience</h2>
                            <button className="btn btn-sm btn-ghost text-primary hover:bg-primary/10 rounded-xl">+ Add</button>
                        </div>
                        <Timeline
                            items={initialResume.experiences?.map((exp: any, index: number) => ({
                                id: index,
                                period: `${exp.startDate || ''} - ${exp.endDate || 'Present'}`,
                                title: exp.position || 'Unknown Role',
                                subtitle: exp.company || 'Unknown Company',
                                description: exp.description || ''
                            })) || []}
                            theme="primary"
                        />
                    </div>

                    <div className="divider opacity-30 my-8"></div>

                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-xl">Education</h2>
                            <button className="btn btn-sm btn-ghost text-secondary hover:bg-secondary/10 rounded-xl">+ Add</button>
                        </div>
                        <Timeline
                            items={initialResume.education?.map((edu: any, index: number) => ({
                                id: index,
                                period: `${edu.startDate || ''} - ${edu.endDate || ''}`,
                                title: edu.degree || 'Degree',
                                subtitle: edu.institution || 'Institution'
                            })) || []}
                            theme="secondary"
                        />
                    </div>

                    <div className="divider opacity-30 my-8"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <CertificationsCard certifications={initialResume.certifications || []} />
                        <LanguagesCard languages={initialResume.languages || []} />
                    </div>
                </>
            ) : (
                <div className="text-center py-12 text-base-content/50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 mx-auto mb-4 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <p>Upload your resume to see your AI-extracted profile data.</p>
                </div>
            )}

            <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-base-content/10">
                <button
                    onClick={handleDiscard}
                    disabled={isSaving}
                    className="btn btn-ghost rounded-xl"
                >
                    Discard Changes
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn btn-primary rounded-xl px-8 shadow-md"
                >
                    {isSaving ? <span className="loading loading-spinner loading-sm"></span> : 'Save Profile'}
                </button>
            </div>
        </div>
    );
}