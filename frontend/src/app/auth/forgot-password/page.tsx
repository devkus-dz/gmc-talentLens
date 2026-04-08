"use client";

import React, { useState, SyntheticEvent, JSX } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import Logo from '@/components/ui/Logo';

/**
 * @typedef {Object} ForgotPasswordResponse
 * @property {string} message
 */

/**
 * Renders the centered Forgot Password page.
 * @returns {JSX.Element} The forgot password page UI.
 */
export default function ForgotPasswordPage(): JSX.Element {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Handles the submission of the email to request a reset link.
     * @param {SyntheticEvent<HTMLFormElement>} e - The form event.
     * @returns {Promise<void>}
     */
    const handleRequestReset = async (e: SyntheticEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            await api.post<any>('/auth/forgot-password', { email });
            setStatus('success');
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.response?.data?.message || 'Failed to send reset email.');
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
                        <RotateCcw className="w-6 h-6 text-indigo-400" />
                    </div>

                    <h1 className="text-3xl font-black text-white mb-3">Forgot your password?</h1>
                    <p className="text-sm font-medium text-[#e5e7eb]/50 leading-relaxed mb-10 max-w-[280px]">
                        No worries, it happens to the best of us. Enter your email and we'll send you a reset link.
                    </p>

                    {status === 'success' ? (
                        <div className="w-full flex flex-col items-center">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold px-4 py-4 rounded-2xl mb-6 w-full text-center">
                                Check your email for the reset link!
                            </div>
                            <Link href="/auth/login" className="flex items-center gap-2 text-sm font-bold text-[#e5e7eb]/50 hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Back to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleRequestReset} className="w-full flex flex-col gap-6">

                            {status === 'error' && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-3 rounded-xl text-left">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#e5e7eb]/50">Email Address</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@company.com" className="h-12 px-4 rounded-xl bg-[#121212] border border-[#1a1a1a] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all placeholder:text-[#e5e7eb]/20 w-full" />
                            </div>

                            <button type="submit" disabled={status === 'loading'} className="h-14 w-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center">
                                {status === 'loading' ? <span className="loading loading-spinner loading-sm"></span> : 'Send Reset Link'}
                            </button>

                            <div className="mt-4">
                                <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-[#e5e7eb]/50 hover:text-white transition-colors">
                                    <ArrowLeft className="w-4 h-4" /> Back to login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </main>

        </div>
    );
}