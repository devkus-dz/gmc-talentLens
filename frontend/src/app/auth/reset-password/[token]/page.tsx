"use client";

import React, { useState, SyntheticEvent, JSX } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/ui/Logo';

/**
 * Defines the expected response structure from the password reset endpoint.
 * @typedef {Object} ResetPasswordResponse
 * @property {string} message
 */
interface ResetPasswordResponse {
    message: string;
}

/**
 * Renders the password reset page, capturing the token from the URL to update the password.
 * @returns {JSX.Element} The reset password page layout.
 */
export default function ResetPasswordPage(): JSX.Element {
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Handles the submission of the new password and triggers the PATCH request.
     * @param {SyntheticEvent<HTMLFormElement>} e - The form submission event.
     * @returns {Promise<void>}
     */
    const handleResetPassword = async (e: SyntheticEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setErrorMessage('Passwords do not match.');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            await api.patch<ResetPasswordResponse>(`/auth/reset-password/${token}`, {
                newPassword: password
            });
            setStatus('success');

            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);

        } catch (err: any) {
            setStatus('error');
            setErrorMessage(
                err.response?.data?.message || 'Failed to reset password. The link may be expired.'
            );
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#121212] text-[#e5e7eb] font-sans selection:bg-indigo-500/30 relative overflow-hidden">

            {/* Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-linear-to-r from-indigo-600/10 to-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Main Centered Form */}
            <main className="flex-1 flex items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-md bg-[#080808]/90 backdrop-blur-2xl rounded-4xl border border-[#1a1a1a] p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center">

                    <div className="w-14 h-14 rounded-full bg-[#121212] border border-[#1a1a1a] flex items-center justify-center mb-8 shadow-inner">
                        <Lock className="w-6 h-6 text-indigo-400" />
                    </div>

                    <h1 className="text-3xl font-black text-white mb-3">Create New Password</h1>
                    <p className="text-sm font-medium text-[#e5e7eb]/50 leading-relaxed mb-10 max-w-[280px]">
                        Please enter your new secure password below to regain access to your account.
                    </p>

                    {status === 'success' ? (
                        <div className="w-full flex flex-col items-center">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold px-4 py-4 rounded-2xl mb-6 w-full flex items-center justify-center gap-3">
                                <CheckCircle2 className="w-5 h-5" />
                                Password updated! Redirecting...
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-5">

                            {status === 'error' && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-3 rounded-xl text-left">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#e5e7eb]/50">New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    placeholder="••••••••"
                                    className="h-12 px-4 rounded-xl bg-[#121212] border border-[#1a1a1a] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all placeholder:text-[#e5e7eb]/20 w-full"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#e5e7eb]/50">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    placeholder="••••••••"
                                    className="h-12 px-4 rounded-xl bg-[#121212] border border-[#1a1a1a] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all placeholder:text-[#e5e7eb]/20 w-full"
                                />
                            </div>

                            <button type="submit" disabled={status === 'loading'} className="h-14 mt-2 w-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center">
                                {status === 'loading' ? <span className="loading loading-spinner loading-sm"></span> : 'Update Password'}
                            </button>

                            <div className="mt-4">
                                <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-[#e5e7eb]/50 hover:text-white transition-colors">
                                    <ArrowLeft className="w-4 h-4" /> Cancel and return
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </main>

        </div>
    );
}