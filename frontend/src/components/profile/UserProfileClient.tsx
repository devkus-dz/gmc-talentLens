"use client";

import React, { JSX, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AvatarUpload from '@/components/ui/AvatarUpload';
import api from '@/lib/api';
import { Shield, User, Mail, Phone, Lock, Save, CheckCircle2 } from 'lucide-react';

interface UserProfileClientProps {
    initialUser: any;
    roleTitle?: string;
}

export default function UserProfileClient({ initialUser, roleTitle = "Account Profile" }: UserProfileClientProps): JSX.Element {
    const router = useRouter();

    const [profileForm, setProfileForm] = useState({
        firstName: initialUser?.firstName || '',
        lastName: initialUser?.lastName || '',
        phone: initialUser?.phone || '',
    });

    const [isProfileSubmitting, setIsProfileSubmitting] = useState<boolean>(false);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState<boolean>(false);

    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false, message: '', type: 'success'
    });

    // 1. Sync state if Next.js pushes fresh server props
    useEffect(() => {
        setProfileForm(prev => ({
            firstName: initialUser?.firstName || prev.firstName,
            lastName: initialUser?.lastName || prev.lastName,
            phone: initialUser?.phone || prev.phone || '',
        }));
    }, [initialUser]);

    // 2. BULLETPROOF CACHE BYPASS: Fetch fresh data on mount
    useEffect(() => {
        const fetchFreshProfile = async () => {
            try {
                // The timestamp guarantees the browser cannot use a cached HTTP response
                const res = await api.get(`/auth/me?timestamp=${new Date().getTime()}`);
                const freshUser = res.data.user || res.data;

                if (freshUser) {
                    setProfileForm({
                        firstName: freshUser.firstName || '',
                        lastName: freshUser.lastName || '',
                        phone: freshUser.phone || '', // Safely catch the phone number
                    });
                }
            } catch (error) {
                console.error("Could not background-sync profile data:", error);
            }
        };

        fetchFreshProfile();
    }, []);

    const showToast = (message: string, type: 'success' | 'error' = 'success'): void => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleProfileSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setIsProfileSubmitting(true);
        try {
            await api.patch('/users/profile', profileForm);

            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...storedUser, ...profileForm }));
            window.dispatchEvent(new Event('user-updated'));

            showToast("Profile updated successfully", "success");
            router.refresh();
        } catch (error: any) {
            showToast(error.response?.data?.message || "Failed to update profile", "error");
        } finally {
            setIsProfileSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showToast("New passwords do not match", "error");
            return;
        }
        if (passwordForm.newPassword.length < 8) {
            showToast("Password must be at least 8 characters", "error");
            return;
        }

        setIsPasswordSubmitting(true);
        try {
            await api.patch('/users/update-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            showToast("Password changed successfully", "success");
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            showToast(error.response?.data?.message || "Failed to change password", "error");
        } finally {
            setIsPasswordSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 relative animate-fade-in">
            {toast.show && (
                <div className="toast toast-top toast-center z-60">
                    <div className={`alert text-white shadow-lg ${toast.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                        {toast.type === 'error' && <Shield className="w-5 h-5 shrink-0" />}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="bg-base-100 rounded-4xl shadow-sm border border-base-content/5 overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-base-content/5 bg-base-200/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-base-content">{roleTitle}</h2>
                            <p className="text-sm text-base-content/50 mt-1">Manage your identity and contact details.</p>
                        </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-4 border border-base-content/10 p-2 pr-4 rounded-full bg-base-100">
                        <AvatarUpload
                            currentImageUrl={initialUser?.profilePictureUrl}
                            firstName={profileForm.firstName || initialUser?.firstName}
                            lastName={profileForm.lastName || initialUser?.lastName}
                            onUploadSuccess={() => showToast("Avatar updated successfully!", "success")}
                            onUploadError={(err) => showToast(err, "error")}
                        />
                        <div className="text-xs font-bold text-base-content/40 uppercase tracking-widest leading-tight">
                            Profile<br />Picture
                        </div>
                    </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="p-6 sm:p-8 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">First Name</label>
                            <div className="relative">
                                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                                <input type="text" value={profileForm.firstName} onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })} className="input input-bordered w-full pl-12 bg-base-200/50 rounded-xl" required />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">Last Name</label>
                            <div className="relative">
                                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                                <input type="text" value={profileForm.lastName} onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })} className="input input-bordered w-full pl-12 bg-base-200/50 rounded-xl" required />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                                <input type="email" value={initialUser?.email || ''} readOnly className="input input-bordered w-full pl-12 bg-base-200/30 text-base-content/50 rounded-xl cursor-not-allowed" />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">Phone Number</label>
                            <div className="relative">
                                <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                                <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="input input-bordered w-full pl-12 bg-base-200/50 rounded-xl" placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isProfileSubmitting} className="btn btn-primary rounded-xl px-8 shadow-sm">
                            {isProfileSubmitting ? <span className="loading loading-spinner loading-sm"></span> : <><Save className="w-4 h-4 mr-1" /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-base-100 rounded-4xl shadow-sm border border-base-content/5 overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-base-content/5 bg-base-200/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-base-content">Security Settings</h2>
                            <p className="text-sm text-base-content/50 mt-1">Update your password to keep your account secure.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="p-6 sm:p-8 flex flex-col gap-6">
                    <div className="form-control w-full md:max-w-md">
                        <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">Current Password</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                            <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="input input-bordered w-full pl-12 bg-base-200/50 rounded-xl" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">New Password</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                                <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="input input-bordered w-full pl-12 bg-base-200/50 rounded-xl" required minLength={8} />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label text-xs font-bold text-base-content/60 uppercase tracking-wider">Confirm New Password</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                                <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="input input-bordered w-full pl-12 bg-base-200/50 rounded-xl" required minLength={8} />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isPasswordSubmitting} className="btn btn-outline btn-error rounded-xl px-8 shadow-sm hover:text-white">
                            {isPasswordSubmitting ? <span className="loading loading-spinner loading-sm"></span> : <><Shield className="w-4 h-4 mr-1" /> Update Password</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}