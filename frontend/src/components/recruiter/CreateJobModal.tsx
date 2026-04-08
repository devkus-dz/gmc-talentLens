"use client";

import React, { useState } from 'react';
import api from '@/lib/api';
import { Briefcase, FileText, Zap, Eye, X, AlertCircle } from 'lucide-react';

interface CreateJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newJob: any) => void;
}

export default function CreateJobModal({ isOpen, onClose, onSuccess }: CreateJobModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: '', description: '', department: '', location: '',
        employmentType: 'Full-time', salaryRange: '', minYearsOfExperience: 0, status: 'DRAFT',
        requiredSkills: [] as string[], tags: [] as string[]
    });

    const [skillInput, setSkillInput] = useState('');
    const [tagInput, setTagInput] = useState('');

    if (!isOpen) return null;

    const handleAddArrayItem = (e: React.KeyboardEvent | React.MouseEvent, type: 'skill' | 'tag') => {
        if ('key' in e && e.key !== 'Enter') return;
        e.preventDefault();

        if (type === 'skill' && skillInput.trim()) {
            if (!formData.requiredSkills.includes(skillInput.trim())) setFormData({ ...formData, requiredSkills: [...formData.requiredSkills, skillInput.trim()] });
            setSkillInput('');
        } else if (type === 'tag' && tagInput.trim()) {
            if (!formData.tags.includes(tagInput.trim())) setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const removeArrayItem = (itemToRemove: string, type: 'skill' | 'tag') => {
        if (type === 'skill') setFormData({ ...formData, requiredSkills: formData.requiredSkills.filter(i => i !== itemToRemove) });
        else setFormData({ ...formData, tags: formData.tags.filter(i => i !== itemToRemove) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setValidationErrors([]);

        try {
            const res = await api.post('/jobs', formData);
            onSuccess(res.data.jobOffer);
            // Reset state
            setFormData({ title: '', description: '', department: '', location: '', employmentType: 'Full-time', salaryRange: '', minYearsOfExperience: 0, status: 'DRAFT', requiredSkills: [], tags: [] });
            onClose();
        } catch (error: any) {
            const errData = error.response?.data;
            if (errData?.errors && Array.isArray(errData.errors)) {
                // If backend returns an array of field errors
                setValidationErrors(errData.errors.map((err: any) => `${err.field}: ${err.message}`));
            } else {
                setValidationErrors([errData?.message || 'Failed to create job offer.']);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">

            {/* Top-Right Validation Errors Toast */}
            {validationErrors.length > 0 && (
                <div className="toast toast-top toast-end z-100 animate-fade-in-down">
                    <div className="alert alert-error shadow-xl flex flex-col items-start gap-1 text-white border-none rounded-xl">
                        <span className="font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Please fix the following:</span>
                        <ul className="text-xs list-disc list-inside mt-1">
                            {validationErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                        </ul>
                    </div>
                </div>
            )}

            <div className="bg-base-100 w-full max-w-4xl rounded-3xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl scale-100">
                <div className="bg-base-200/50 p-6 border-b border-base-content/5 shrink-0 relative">
                    <button type="button" className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4" onClick={onClose}><X className="w-5 h-5" /></button>
                    <h3 className="font-bold text-2xl">Create New Job Offer</h3>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto thin-scrollbar flex-1">

                        <div className="bg-base-200/30 p-5 rounded-2xl border border-base-content/5">
                            <h4 className="font-bold flex items-center gap-2 mb-4 text-base-content/80"><Briefcase className="w-5 h-5 text-primary" /> Role Details</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-control sm:col-span-2">
                                    <label className="label text-xs font-bold opacity-60">Job Title *</label>
                                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="input input-bordered w-full rounded-xl" required />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs font-bold opacity-60">Department *</label>
                                    <input type="text" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="input input-bordered w-full rounded-xl" required />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs font-bold opacity-60">Location *</label>
                                    <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="input input-bordered w-full rounded-xl" required />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs font-bold opacity-60">Employment Type *</label>
                                    <select value={formData.employmentType} onChange={e => setFormData({ ...formData, employmentType: e.target.value })} className="select select-bordered w-full rounded-xl">
                                        <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option><option>Remote</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs font-bold opacity-60">Years of Experience (Min)</label>
                                    <input type="number" min="0" value={formData.minYearsOfExperience} onChange={e => setFormData({ ...formData, minYearsOfExperience: parseInt(e.target.value) || 0 })} className="input input-bordered w-full rounded-xl" />
                                </div>
                                <div className="form-control sm:col-span-2">
                                    <label className="label text-xs font-bold opacity-60">Salary Range</label>
                                    <input type="text" value={formData.salaryRange} onChange={e => setFormData({ ...formData, salaryRange: e.target.value })} className="input input-bordered w-full rounded-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-base-200/30 p-5 rounded-2xl border border-base-content/5">
                            <h4 className="font-bold flex items-center gap-2 mb-4 text-base-content/80"><FileText className="w-5 h-5 text-secondary" /> Description</h4>
                            <div className="form-control w-full">
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="textarea textarea-bordered w-full h-40 rounded-xl" placeholder="Describe the role... (Minimum 10 characters)" required minLength={10} />
                            </div>
                        </div>

                        <div className="bg-base-200/30 p-5 rounded-2xl border border-base-content/5">
                            <h4 className="font-bold flex items-center gap-2 mb-4 text-base-content/80"><Zap className="w-5 h-5 text-warning" /> AI Match Criteria</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="form-control w-full">
                                    <label className="label text-xs font-bold opacity-60 pt-0">Required Skills</label>
                                    <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                                        {formData.requiredSkills.map(skill => (
                                            <span key={skill} className="badge badge-primary gap-1 py-3 px-3 rounded-lg font-medium">{skill} <button type="button" onClick={() => removeArrayItem(skill, 'skill')} className="opacity-60 ml-1">✕</button></span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => handleAddArrayItem(e, 'skill')} className="input input-bordered w-full rounded-xl" placeholder="Type and press Enter" />
                                        <button type="button" onClick={e => handleAddArrayItem(e, 'skill')} className="btn btn-outline rounded-xl shrink-0">Add</button>
                                    </div>
                                </div>
                                <div className="form-control w-full mt-2">
                                    <label className="label text-xs font-bold opacity-60 pt-0">Search Tags</label>
                                    <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                                        {formData.tags.map(tag => (
                                            <span key={tag} className="badge badge-secondary badge-outline gap-1 py-3 px-3 rounded-lg font-medium">{tag} <button type="button" onClick={() => removeArrayItem(tag, 'tag')} className="opacity-60 ml-1">✕</button></span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => handleAddArrayItem(e, 'tag')} className="input input-bordered w-full rounded-xl" placeholder="Type and press Enter" />
                                        <button type="button" onClick={e => handleAddArrayItem(e, 'tag')} className="btn btn-outline rounded-xl shrink-0">Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-base-200/30 p-5 rounded-2xl border border-base-content/5">
                            <h4 className="font-bold flex items-center gap-2 mb-4 text-base-content/80"><Eye className="w-5 h-5 text-info" /> Visibility</h4>
                            <div className="form-control">
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="select select-bordered w-full rounded-xl">
                                    <option value="DRAFT">Save as Draft (Hidden)</option>
                                    <option value="PUBLISHED">Publish Immediately</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-base-200/30 p-4 sm:p-6 border-t border-base-content/5 shrink-0 flex justify-end gap-2">
                        <button type="button" className="btn btn-ghost rounded-xl" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary rounded-xl px-10 shadow-sm">
                            {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Create Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}