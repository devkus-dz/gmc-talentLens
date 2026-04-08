"use client";

import React, { useState, SyntheticEvent, JSX } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { ArrowLeft, BrainCircuit } from 'lucide-react';

/**
 * @typedef {Object} LoginResponse
 * @property {string} message
 * @property {string} [token]
 * @property {Object} user
 */

/**
 * Renders the split-screen Login page.
 * @returns {JSX.Element} The login page UI.
 */
export default function LoginPage(): JSX.Element {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handles the form submission.
     * @param {SyntheticEvent<HTMLFormElement>} e - The form event.
     * @returns {Promise<void>}
     */
    const handleLogin = async (e: SyntheticEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await api.post<any>('/auth/login', { email, password });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            localStorage.setItem('user', JSON.stringify(response.data.user));

            switch (response.data.user.role) {
                case 'ADMIN': router.push('/admin/dashboard'); break;
                case 'RECRUITER': router.push('/recruiter/dashboard'); break;
                case 'CANDIDATE': router.push('/candidate/dashboard'); break;
                default: router.push('/auth/login'); break;
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to connect. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#080808] text-[#e5e7eb] font-sans selection:bg-indigo-500/30">

            {/* Left Pane: Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-20 relative z-10 overflow-y-auto thin-scrollbar">

                <Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#e5e7eb]/50 hover:text-white transition-colors w-max mb-12">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">Welcome<br />back.</h1>
                    <p className="text-[#e5e7eb]/50 font-medium mb-10">Enter your details to access your workspace.</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#e5e7eb]/50">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@company.com" className="h-12 px-4 rounded-xl bg-[#121212] border border-[#1a1a1a] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all placeholder:text-[#e5e7eb]/20" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#e5e7eb]/50">Password</label>
                                <Link href="/auth/forgot-password" className="text-[10px] font-bold text-indigo-400 hover:underline">Forgot password?</Link>
                            </div>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="h-12 px-4 rounded-xl bg-[#121212] border border-[#1a1a1a] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all placeholder:text-[#e5e7eb]/20" />
                        </div>

                        <button type="submit" disabled={isLoading} className="h-14 mt-4 w-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center">
                            {isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Sign In'}
                        </button>
                    </form>

                    <div className="text-center mt-12 text-sm font-medium text-[#e5e7eb]/50">
                        Don't have an account? <Link href="/auth/register" className="text-white hover:underline">Sign up.</Link>
                    </div>

                    <div className="text-center mt-8 text-[9px] font-bold uppercase tracking-widest text-[#e5e7eb]/20">
                        © 2026 TALENTLENS. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </div>

            {/* Right Pane: Brand Showcase */}
            <div className="hidden lg:flex w-1/2 bg-[#121212] relative overflow-hidden items-center justify-center border-l border-[#1a1a1a]">
                <div className="absolute inset-0 bg-linear-to-bl from-indigo-600/10 via-[#121212] to-purple-600/10"></div>

                {/* Visual Representation of Dashboard Insight */}
                <div className="relative z-10 w-[450px] bg-[#080808]/80 backdrop-blur-2xl rounded-4xl border border-[#1a1a1a] p-8 shadow-2xl">
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-inner mb-6">
                        <BrainCircuit className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">Focus on the talent.<br />We'll handle the rest.</h3>
                    <p className="text-sm font-medium text-[#e5e7eb]/60 leading-relaxed mb-8">
                        The Cognitive ATS streamlines your entire hiring pipeline. Experience real-time AI matching, automated assessments, and effortless data extraction.
                    </p>
                    <div className="h-2 w-16 bg-indigo-500/30 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}