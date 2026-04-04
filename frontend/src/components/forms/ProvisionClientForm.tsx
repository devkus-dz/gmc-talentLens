"use client";

import React, { useState, useRef, JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { Building2, User, Globe, MapPin, Briefcase, Mail, Lock, Upload, Image as ImageIcon } from 'lucide-react';

/**
 * @constant
 * @type {z.ZodObject<any>}
 */
const provisionSchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    website: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    industry: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Must be a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * @typedef {z.infer<typeof provisionSchema>} ProvisionFormData
 */
type ProvisionFormData = z.infer<typeof provisionSchema>;

/**
 * @interface ProvisionClientFormProps
 * @property {() => void} [onSuccess] 
 */
interface ProvisionClientFormProps {
    onSuccess?: () => void;
}

/**
 * @component
 * @param {ProvisionClientFormProps} props 
 * @returns {JSX.Element}
 */
export default function ProvisionClientForm({ onSuccess }: ProvisionClientFormProps): JSX.Element {
    const [serverError, setServerError] = useState<string>('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProvisionFormData>({
        resolver: zodResolver(provisionSchema),
        defaultValues: {
            companyName: '', website: '', industry: '', location: '', description: '',
            firstName: '', lastName: '', email: '', password: ''
        }
    });

    /**
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     * @returns {void}
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    /**
     * @async
     * @param {ProvisionFormData} data 
     * @returns {Promise<void>}
     */
    const onSubmit = async (data: ProvisionFormData): Promise<void> => {
        setServerError('');
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });
            if (logoFile) {
                formData.append('logo', logoFile);
            }

            await api.post('/admin/provision-client', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            reset();
            setLogoFile(null);
            setLogoPreview(null);
            if (onSuccess) onSuccess();
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Failed to provision client.');
        }
    };

    return (
        <div className="bg-base-100 rounded-4xl shadow-sm overflow-hidden w-full">
            <div className="p-6 sm:p-10 border-b border-base-content/10 bg-base-200/20">
                <h2 className="text-2xl font-bold text-base-content flex items-center gap-3">
                    <Building2 className="w-7 h-7 text-primary" />
                    Provision New B2B Client
                </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-10 flex flex-col gap-10">
                {serverError && <div className="p-4 bg-error/10 text-error rounded-xl text-sm font-medium">{serverError}</div>}

                <section>
                    <h3 className="text-lg font-bold border-b border-base-content/10 pb-2 mb-6 text-base-content/80">Company Information</h3>

                    <div className="flex flex-col sm:flex-row gap-6 mb-6 items-start">
                        <div
                            className="w-24 h-24 rounded-2xl border-2 border-dashed border-base-content/20 flex flex-col items-center justify-center bg-base-200/50 cursor-pointer hover:bg-base-200 transition-colors relative overflow-hidden shrink-0"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <ImageIcon className="w-8 h-8 text-base-content/40 mb-1" />
                                    <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest">Logo</span>
                                </>
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">Company Name *</label>
                            <input {...register('companyName')} type="text" className={`input w-full bg-base-200/50 rounded-xl ${errors.companyName ? 'input-error' : 'input-bordered border-base-content/10'}`} placeholder="Acme Corp" />
                            {errors.companyName && <span className="text-error text-xs mt-1">{errors.companyName.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">Website</label>
                            <input {...register('website')} type="url" className="input input-bordered w-full bg-base-200/50 rounded-xl" placeholder="https://acme.com" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">Industry</label>
                            <input {...register('industry')} type="text" className="input input-bordered w-full bg-base-200/50 rounded-xl" placeholder="e.g. Technology" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">Location</label>
                            <input {...register('location')} type="text" className="input input-bordered w-full bg-base-200/50 rounded-xl" placeholder="City, Country" />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">Description</label>
                            <input {...register('description')} type="text" className="input input-bordered w-full bg-base-200/50 rounded-xl" placeholder="Short description" />
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-bold border-b border-base-content/10 pb-2 mb-6 text-base-content/80">Initial Recruiter Account</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">First Name *</label>
                            <input {...register('firstName')} type="text" className="input input-bordered w-full bg-base-200/50 rounded-xl" required />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">Last Name *</label>
                            <input {...register('lastName')} type="text" className="input input-bordered w-full bg-base-200/50 rounded-xl" required />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">Work Email *</label>
                            <input {...register('email')} type="email" className="input input-bordered w-full bg-base-200/50 rounded-xl" required />
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">Temporary Password *</label>
                            <input {...register('password')} type="text" className="input input-bordered w-full bg-base-200/50 rounded-xl" required minLength={8} />
                        </div>
                    </div>
                </section>

                <div className="border-t border-base-content/10 pt-6 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary rounded-xl px-10 shadow-sm">
                        {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Provision Client'}
                    </button>
                </div>
            </form>
        </div>
    );
}