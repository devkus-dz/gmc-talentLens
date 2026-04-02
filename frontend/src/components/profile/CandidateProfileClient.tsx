"use client";

import React, { useState, useEffect } from 'react';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import CoreSkills from '@/components/profile/CoreSkills';
import TagsCard from '@/components/profile/TagsCard';
import Timeline from '@/components/ui/Timeline';
import CertificationsCard from '@/components/profile/CertificationsCard';
import LanguagesCard from '@/components/profile/LanguagesCard';
import AIAnalysisCard from '@/components/profile/AIAnalysisCard';
import api from '@/lib/api';

const formatForMonthInput = (dateStr: string | null | undefined): string => {
    if (!dateStr || dateStr.toLowerCase() === 'present') return '';
    if (/^\d{4}-\d{2}$/.test(dateStr)) return dateStr;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return '';
};

export default function CandidateProfileClient({
    initialUser,
    initialResume,
    initialDocumentUrl
}: {
    initialUser: any,
    initialResume: any,
    initialDocumentUrl: string | null
}) {
    // --- FIX: Manage User State Locally to prevent UI disappearing ---
    const [user, setUser] = useState(initialUser);

    useEffect(() => {
        const syncUser = () => {
            const stored = localStorage.getItem('user');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        };
        // Listen for the AvatarUpload event to update the local user state!
        window.addEventListener('user-updated', syncUser);
        return () => window.removeEventListener('user-updated', syncUser);
    }, []);

    const [resumeData, setResumeData] = useState(initialResume || null);
    const [documentUrl, setDocumentUrl] = useState(initialDocumentUrl || initialResume?.documentUrl || initialResume?.fileUrl || null);

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const [skills, setSkills] = useState<string[]>(initialResume?.skills || []);
    const [tags, setTags] = useState<string[]>(initialResume?.tags || []);
    const [languages, setLanguages] = useState<any[]>(initialResume?.languages || []);
    const [certifications, setCertifications] = useState<any[]>(initialResume?.certifications || []);
    const [experiences, setExperiences] = useState<any[]>(initialResume?.experiences || []);
    const [education, setEducation] = useState<any[]>(initialResume?.education || []);

    const [skillInput, setSkillInput] = useState('');
    const [tagInput, setTagInput] = useState('');

    const [expForm, setExpForm] = useState({ position: '', company: '', startDate: '', endDate: '', description: '' });
    const [editExpIndex, setEditExpIndex] = useState<number | null>(null);
    const [expIsCurrent, setExpIsCurrent] = useState(false);

    const [eduForm, setEduForm] = useState({ degree: '', institution: '', startDate: '', endDate: '' });
    const [editEduIndex, setEditEduIndex] = useState<number | null>(null);
    const [eduIsCurrent, setEduIsCurrent] = useState(false);

    const [langForm, setLangForm] = useState({ name: '', level: 'Native / Bilingual' });
    const [editLangIndex, setEditLangIndex] = useState<number | null>(null);

    const [certForm, setCertForm] = useState({ name: '', issuer: '', date: '' });
    const [editCertIndex, setEditCertIndex] = useState<number | null>(null);

    const openModal = (id: string) => { const m = document.getElementById(id) as HTMLDialogElement; if (m) m.showModal(); };
    const closeModal = (id: string) => { const m = document.getElementById(id) as HTMLDialogElement; if (m) m.close(); };
    const handleRemoveItem = (setter: any, index: number) => setter((prev: any[]) => prev.filter((_: any, i: number) => i !== index));

    const handleUploadSuccess = (responsePayload: any) => {
        const parsed = responsePayload.parsedData;
        setResumeData(parsed);
        setDocumentUrl(responsePayload.documentUrl);
        setSkills(parsed.skills || []);
        setTags(parsed.tags || []);
        setLanguages(parsed.languages || []);
        setCertifications(parsed.certifications || []);
        setExperiences(parsed.experiences || []);
        setEducation(parsed.education || []);
    };

    const handleSave = async () => {
        if (!resumeData?._id && !resumeData?.id) return;
        setIsSaving(true);
        try {
            await api.patch(`/resumes/${resumeData._id || resumeData.id}`, {
                skills, tags, languages, certifications, experiences, education
            });
            showToast("Profile saved successfully!", "success");
        } catch (error) {
            console.error("Save failed:", error);
            showToast("Failed to save profile.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const saveSkill = (e: React.FormEvent) => { e.preventDefault(); if (skillInput.trim()) setSkills([...skills, skillInput.trim()]); setSkillInput(''); closeModal('skill_modal'); };
    const saveTag = (e: React.FormEvent) => { e.preventDefault(); if (tagInput.trim()) setTags([...tags, tagInput.trim()]); setTagInput(''); closeModal('tag_modal'); };

    const openExpModal = (index: number | null = null) => {
        setEditExpIndex(index);
        if (index !== null) {
            const exp = experiences[index];
            const isCurr = !exp.endDate || exp.endDate.toLowerCase() === 'present';
            setExpForm({ position: exp.position || '', company: exp.company || '', startDate: formatForMonthInput(exp.startDate), endDate: isCurr ? '' : formatForMonthInput(exp.endDate), description: exp.description || '' });
            setExpIsCurrent(isCurr);
        } else {
            setExpForm({ position: '', company: '', startDate: '', endDate: '', description: '' });
            setExpIsCurrent(false);
        }
        openModal('exp_modal');
    };
    const saveExperience = (e: React.FormEvent) => {
        e.preventDefault();
        const finalExp = { ...expForm, endDate: expIsCurrent ? 'Present' : expForm.endDate };
        if (editExpIndex !== null) { const updated = [...experiences]; updated[editExpIndex] = finalExp; setExperiences(updated); }
        else { setExperiences([finalExp, ...experiences]); }
        closeModal('exp_modal');
    };

    const openEduModal = (index: number | null = null) => {
        setEditEduIndex(index);
        if (index !== null) {
            const edu = education[index];
            const isCurr = !edu.endDate || edu.endDate.toLowerCase() === 'present';
            setEduForm({ degree: edu.degree || '', institution: edu.institution || '', startDate: formatForMonthInput(edu.startDate), endDate: isCurr ? '' : formatForMonthInput(edu.endDate) });
            setEduIsCurrent(isCurr);
        } else {
            setEduForm({ degree: '', institution: '', startDate: '', endDate: '' });
            setEduIsCurrent(false);
        }
        openModal('edu_modal');
    };
    const saveEducation = (e: React.FormEvent) => {
        e.preventDefault();
        const finalEdu = { ...eduForm, endDate: eduIsCurrent ? 'Present' : eduForm.endDate };
        if (editEduIndex !== null) { const updated = [...education]; updated[editEduIndex] = finalEdu; setEducation(updated); }
        else { setEducation([finalEdu, ...education]); }
        closeModal('edu_modal');
    };

    const openLangModal = (index: number | null = null) => {
        setEditLangIndex(index);
        if (index !== null) {
            setLangForm(languages[index]);
        } else {
            setLangForm({ name: '', level: 'Professional Working' });
        }
        openModal('lang_modal');
    };

    const saveLanguage = (e: React.FormEvent) => {
        e.preventDefault();
        if (editLangIndex !== null) {
            const updated = [...languages];
            updated[editLangIndex] = langForm;
            setLanguages(updated);
        } else {
            setLanguages([...languages, langForm]);
        }
        closeModal('lang_modal');
    };

    const openCertModal = (index: number | null = null) => {
        setEditCertIndex(index);
        if (index !== null) {
            setCertForm({
                ...certifications[index],
                date: formatForMonthInput(certifications[index].date)
            });
        } else {
            setCertForm({ name: '', issuer: '', date: '' });
        }
        openModal('cert_modal');
    };

    const saveCertification = (e: React.FormEvent) => {
        e.preventDefault();
        if (editCertIndex !== null) {
            const updated = [...certifications];
            updated[editCertIndex] = certForm;
            setCertifications(updated);
        } else {
            setCertifications([...certifications, certForm]);
        }
        closeModal('cert_modal');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">

            {/* LEFT COLUMN: Upload & AI Stats */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-base-100 rounded-4xl p-6 shadow-sm border border-base-content/5 relative overflow-hidden">
                    {isUploading && (
                        <div className="absolute inset-0 bg-base-100/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                            <p className="font-bold animate-pulse" dir="auto">AI is parsing your resume...</p>
                        </div>
                    )}

                    <h2 className="font-bold text-lg mb-4">Your Resume</h2>

                    <div className="relative">
                        <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={isUploading}
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploading(true);
                                const fd = new FormData(); fd.append('pdfFile', file);
                                try {
                                    const res = await api.post('/resumes/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                                    handleUploadSuccess(res.data);
                                    showToast("Resume parsed successfully!", "success");
                                } catch (err) {
                                    showToast("Upload failed. Please try again.", "error");
                                } finally {
                                    setIsUploading(false);
                                }
                            }}
                        />
                        <div className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-3xl p-8 text-center text-primary font-medium hover:bg-primary/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 mx-auto mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                            Upload New PDF
                        </div>
                    </div>

                    {(resumeData?.fileKey || documentUrl) && (
                        <div className="mt-4 p-4 rounded-2xl bg-base-200/50 flex items-center justify-between gap-3">
                            <div className="overflow-hidden">
                                <p className="font-semibold text-sm truncate" dir="auto">
                                    {resumeData?.fileKey?.split('/').pop() || 'Resume.pdf'}
                                </p>
                                <p className="text-[10px] opacity-50">
                                    Parsed on {new Date(resumeData?.updatedAt || Date.now()).toLocaleDateString()}
                                </p>
                            </div>
                            <a href={documentUrl || `http://localhost:9000/talentlens-storage/${resumeData.fileKey}`} target="_blank" rel="noopener noreferrer" className="btn btn-xs btn-primary btn-outline shrink-0">View File</a>
                        </div>
                    )}
                </div>

                {resumeData && (
                    <AIAnalysisCard
                        score={resumeData.yearsOfExperience ? Math.min(100, resumeData.yearsOfExperience * 10) : 50}
                        primaryRole={tags[0] || 'Professional'}
                        missingSkills={[]}
                        improvementTip={resumeData.improvementTip}
                    />
                )}
            </div>

            {/* RIGHT COLUMN: Interactive Form */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-base-100 rounded-4xl p-6 sm:p-8 shadow-sm border border-base-content/5">
                    <PersonalInfoForm
                        firstName={user.firstName || resumeData?.firstName || ''}
                        lastName={user.lastName || resumeData?.lastName || ''}
                        email={user.email || resumeData?.email || ''}
                        profilePictureUrl={user.profilePictureUrl}
                        onUploadSuccess={() => showToast("Profile picture updated successfully!", "success")}
                        onUploadError={(err) => showToast(err, "error")}
                    />
                    <div className="divider opacity-30 my-8"></div>

                    {resumeData ? (
                        <>
                            <CoreSkills skills={skills} onRemoveSkill={(s) => setSkills(skills.filter(i => i !== s))} onAddSkill={() => openModal('skill_modal')} />
                            <div className="divider opacity-30 my-8"></div>

                            <TagsCard tags={tags} onRemoveTag={(t) => setTags(tags.filter(i => i !== t))} onAddTag={() => openModal('tag_modal')} />
                            <div className="divider opacity-30 my-8"></div>

                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-bold text-xl">Work Experience</h2>
                                    <button onClick={() => openExpModal(null)} type="button" className="btn btn-sm btn-ghost text-primary hover:bg-primary/10 rounded-xl">+ Add</button>
                                </div>
                                <Timeline items={experiences.map((exp, index) => ({ id: index, period: `${exp.startDate || ''} - ${exp.endDate || 'Present'}`, title: exp.position || 'Unknown Role', subtitle: exp.company || 'Unknown Company', description: exp.description || '' }))} theme="primary" onEdit={(id) => openExpModal(id as number)} onRemove={(id) => handleRemoveItem(setExperiences, id as number)} />
                            </div>
                            <div className="divider opacity-30 my-8"></div>

                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-bold text-xl">Education</h2>
                                    <button onClick={() => openEduModal(null)} type="button" className="btn btn-sm btn-ghost text-secondary hover:bg-secondary/10 rounded-xl">+ Add</button>
                                </div>
                                <Timeline items={education.map((edu, index) => ({ id: index, period: `${edu.startDate || ''} - ${edu.endDate || ''}`, title: edu.degree || 'Degree', subtitle: edu.institution || 'Institution' }))} theme="secondary" onEdit={(id) => openEduModal(id as number)} onRemove={(id) => handleRemoveItem(setEducation, id as number)} />
                            </div>
                            <div className="divider opacity-30 my-8"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <CertificationsCard certifications={certifications} onAdd={() => openCertModal(null)} onEdit={(id) => openCertModal(id)} onRemove={(id) => handleRemoveItem(setCertifications, id)} />
                                <LanguagesCard languages={languages} onAdd={() => openLangModal(null)} onEdit={(id) => openLangModal(id)} onRemove={(id) => handleRemoveItem(setLanguages, id)} />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-base-content/50"><p>Upload your resume to extract profile data.</p></div>
                    )}

                    <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-base-content/10">
                        <button type="button" onClick={() => window.location.reload()} disabled={isSaving || !resumeData} className="btn btn-ghost rounded-xl">Discard</button>
                        <button type="button" onClick={handleSave} disabled={isSaving || !resumeData} className="btn btn-primary rounded-xl px-8 shadow-md">
                            {isSaving ? <span className="loading loading-spinner loading-sm"></span> : 'Save Profile'}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}
            <dialog id="skill_modal" className="modal">
                <div className="modal-box"><h3 className="font-bold text-lg mb-4">Add New Skill</h3>
                    <form onSubmit={saveSkill}><input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="e.g., React.js" className="input input-bordered w-full" required dir="auto" />
                        <div className="modal-action"><button type="button" onClick={() => closeModal('skill_modal')} className="btn">Cancel</button><button type="submit" className="btn btn-primary">Add</button></div></form></div>
            </dialog>

            <dialog id="tag_modal" className="modal">
                <div className="modal-box"><h3 className="font-bold text-lg mb-4">Add Professional Tag</h3>
                    <form onSubmit={saveTag}><input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="e.g., Junior Level" className="input input-bordered w-full" required dir="auto" />
                        <div className="modal-action"><button type="button" onClick={() => closeModal('tag_modal')} className="btn">Cancel</button><button type="submit" className="btn btn-primary">Add</button></div></form></div>
            </dialog>

            <dialog id="exp_modal" className="modal">
                <div className="modal-box max-w-2xl"><h3 className="font-bold text-lg mb-4">{editExpIndex !== null ? 'Edit Experience' : 'Add Experience'}</h3>
                    <form onSubmit={saveExperience} className="flex flex-col gap-4">
                        <label className="form-control w-full"><div className="label pb-1"><span className="label-text text-xs">Job Title</span></div><input type="text" value={expForm.position} onChange={e => setExpForm({ ...expForm, position: e.target.value })} className="input input-bordered w-full" required dir="auto" /></label>
                        <label className="form-control w-full"><div className="label pb-1"><span className="label-text text-xs">Company</span></div><input type="text" value={expForm.company} onChange={e => setExpForm({ ...expForm, company: e.target.value })} className="input input-bordered w-full" required dir="auto" /></label>
                        <div className="flex gap-4"><label className="form-control w-full"><div className="label pb-1"><span className="label-text text-xs">Start Date</span></div><input type="month" value={expForm.startDate} onChange={e => setExpForm({ ...expForm, startDate: e.target.value })} className="input input-bordered w-full" required dir="auto" /></label>
                            <div className="w-full flex flex-col justify-start"><label className="form-control w-full"><div className="label pb-1"><span className="label-text text-xs">End Date</span></div><input type="month" value={expForm.endDate} onChange={e => setExpForm({ ...expForm, endDate: e.target.value })} disabled={expIsCurrent} required={!expIsCurrent} className="input input-bordered w-full" dir="auto" /></label>
                                <label className="label cursor-pointer justify-start gap-3 mt-2"><input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={expIsCurrent} onChange={e => setExpIsCurrent(e.target.checked)} /><span className="label-text text-xs font-medium">I currently work here</span></label></div></div>
                        <label className="form-control w-full"><div className="label pb-1"><span className="label-text text-xs">Description</span></div><textarea value={expForm.description} onChange={e => setExpForm({ ...expForm, description: e.target.value })} className="textarea textarea-bordered w-full h-32" dir="auto" /></label>
                        <div className="modal-action mt-2"><button type="button" onClick={() => closeModal('exp_modal')} className="btn">Cancel</button><button type="submit" className="btn btn-primary">Save</button></div>
                    </form></div>
            </dialog>

            <dialog id="edu_modal" className="modal">
                <div className="modal-box max-w-2xl"><h3 className="font-bold text-lg mb-4">{editEduIndex !== null ? 'Edit Education' : 'Add Education'}</h3>
                    <form onSubmit={saveEducation} className="flex flex-col gap-4">
                        <label className="form-control w-full"><div className="label pb-1"><span className="label-text text-xs">Degree / Certificate</span></div><input type="text" value={eduForm.degree} onChange={e => setEduForm({ ...eduForm, degree: e.target.value })} className="input input-bordered w-full" required dir="auto" /></label>
                        <label className="form-control w-full"><div className="label pb-1"><span className="label-text text-xs">Institution</span></div><input type="text" value={eduForm.institution} onChange={e => setEduForm({ ...eduForm, institution: e.target.value })} className="input input-bordered w-full" required dir="auto" /></label>
                        <div className="flex gap-4"><label className="form-control w-full"><div className="label pb-1"><span className="label-text text-xs">Start Date</span></div><input type="month" value={eduForm.startDate} onChange={e => setEduForm({ ...eduForm, startDate: e.target.value })} className="input input-bordered w-full" required dir="auto" /></label>
                            <div className="w-full flex flex-col justify-start"><label className="form-control w-full"><div className="label pb-1"><span className="label-text text-xs">End Date</span></div><input type="month" value={eduForm.endDate} onChange={e => setEduForm({ ...eduForm, endDate: e.target.value })} disabled={eduIsCurrent} required={!eduIsCurrent} className="input input-bordered w-full" dir="auto" /></label>
                                <label className="label cursor-pointer justify-start gap-3 mt-2"><input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={eduIsCurrent} onChange={e => setEduIsCurrent(e.target.checked)} /><span className="label-text text-xs font-medium">I currently study here</span></label></div></div>
                        <div className="modal-action mt-2"><button type="button" onClick={() => closeModal('edu_modal')} className="btn">Cancel</button><button type="submit" className="btn btn-primary">Save</button></div>
                    </form></div>
            </dialog>

            {/* Language Modal */}
            <dialog id="lang_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">{editLangIndex !== null ? 'Edit Language' : 'Add Language'}</h3>
                    <form onSubmit={saveLanguage} className="flex flex-col gap-4">
                        <label className="form-control w-full">
                            <div className="label pb-1"><span className="label-text text-xs">Language</span></div>
                            <input type="text" value={langForm.name} onChange={e => setLangForm({ ...langForm, name: e.target.value })} placeholder="e.g., English, French" className="input input-bordered w-full" required dir="auto" />
                        </label>
                        <label className="form-control w-full">
                            <div className="label pb-1"><span className="label-text text-xs">Proficiency Level</span></div>
                            <select value={langForm.level} onChange={e => setLangForm({ ...langForm, level: e.target.value })} className="select select-bordered w-full" required dir="auto">
                                <option value="Elementary">Elementary</option>
                                <option value="Limited Working">Limited Working</option>
                                <option value="Professional Working">Professional Working</option>
                                <option value="Full Professional">Full Professional</option>
                                <option value="Native / Bilingual">Native / Bilingual</option>
                            </select>
                        </label>
                        <div className="modal-action mt-2">
                            <button type="button" onClick={() => closeModal('lang_modal')} className="btn">Cancel</button>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* Certification Modal */}
            <dialog id="cert_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">{editCertIndex !== null ? 'Edit Certification' : 'Add Certification'}</h3>
                    <form onSubmit={saveCertification} className="flex flex-col gap-4">
                        <label className="form-control w-full">
                            <div className="label pb-1"><span className="label-text text-xs">Certification Name</span></div>
                            <input type="text" value={certForm.name} onChange={e => setCertForm({ ...certForm, name: e.target.value })} placeholder="e.g., AWS Certified Developer" className="input input-bordered w-full" required dir="auto" />
                        </label>
                        <label className="form-control w-full">
                            <div className="label pb-1"><span className="label-text text-xs">Issuing Organization</span></div>
                            <input type="text" value={certForm.issuer} onChange={e => setCertForm({ ...certForm, issuer: e.target.value })} placeholder="e.g., Amazon Web Services" className="input input-bordered w-full" required dir="auto" />
                        </label>
                        <label className="form-control w-full">
                            <div className="label pb-1"><span className="label-text text-xs">Issue Date (Optional)</span></div>
                            <input type="month" value={certForm.date} onChange={e => setCertForm({ ...certForm, date: e.target.value })} className="input input-bordered w-full" dir="auto" />
                        </label>
                        <div className="modal-action mt-2">
                            <button type="button" onClick={() => closeModal('cert_modal')} className="btn">Cancel</button>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* --- Global Toast Notification --- */}
            {toast && (
                <div className="toast toast-top toast-end z-100 animate-fade-in-down">
                    <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg text-white font-medium flex items-center`}>
                        {toast.type === 'success' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        )}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

        </div>
    );
}