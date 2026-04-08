"use client";

import React, { useState, SyntheticEvent, JSX } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { ArrowLeft, BrainCircuit } from 'lucide-react';

/**
 * @typedef {Object} RegisterResponse
 * @property {string} message
 * @property {Object} user
 */

/**
 * Renders the split-screen Registration page strictly for Candidates.
 * @returns {JSX.Element} The registration page UI.
 */
export default function RegisterPage(): JSX.Element {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handles the form submission for Candidate Registration.
     * @param {SyntheticEvent<HTMLFormElement>} e - The form event.
     * @returns {Promise<void>}
     */
    const handleRegister = async (e: SyntheticEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Hardcoded to CANDIDATE as Companies are onboarded via Admin
            const response = await api.post<any>('/auth/register', {
                firstName, lastName, email, password, role: 'CANDIDATE'
            });

            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (response.data.user.role === 'CANDIDATE') {
                router.push('/candidate/dashboard');
            } else {
                router.push('/auth/login');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create account.');
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
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">Join <br /> TalentLens.</h1>
                    <p className="text-[#e5e7eb]/50 font-medium mb-10">Create your profile to get discovered by top companies.</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#e5e7eb]/50">First Name</label>
                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="John" className="h-12 px-4 rounded-xl bg-[#121212] border border-[#1a1a1a] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all placeholder:text-[#e5e7eb]/20" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#e5e7eb]/50">Last Name</label>
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Doe" className="h-12 px-4 rounded-xl bg-[#121212] border border-[#1a1a1a] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all placeholder:text-[#e5e7eb]/20" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#e5e7eb]/50">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@company.com" className="h-12 px-4 rounded-xl bg-[#121212] border border-[#1a1a1a] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all placeholder:text-[#e5e7eb]/20" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#e5e7eb]/50">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="••••••••" className="h-12 px-4 rounded-xl bg-[#121212] border border-[#1a1a1a] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all placeholder:text-[#e5e7eb]/20" />
                        </div>

                        <button type="submit" disabled={isLoading} className="h-14 mt-4 w-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center">
                            {isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Create Profile'}
                        </button>
                    </form>

                    <div className="text-center mt-12 text-sm font-medium text-[#e5e7eb]/50">
                        Already have an account? <Link href="/auth/login" className="text-white hover:underline">Log in.</Link>
                    </div>

                    <div className="text-center mt-8 text-[9px] font-bold uppercase tracking-widest text-[#e5e7eb]/20">
                        © {new Date().getFullYear()} TALENTLENS. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </div>

            {/* Right Pane: Brand Showcase */}
            <div className="hidden lg:flex w-1/2 bg-[#121212] relative overflow-hidden items-center justify-center border-l border-[#1a1a1a]">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-600/10 via-[#121212] to-purple-600/10"></div>

                {/* Visual Representation of the Candidate Analysis Card */}
                <div className="relative z-10 w-[450px] bg-[#080808]/80 backdrop-blur-2xl rounded-4xl border border-[#1a1a1a] p-8 shadow-2xl flex flex-col gap-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Deep Intelligence</p>
                            <h3 className="text-2xl font-bold text-white">Candidate Analysis</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#121212] border border-[#1a1a1a] flex items-center justify-center shadow-inner">
                            <BrainCircuit className="w-5 h-5 text-purple-400" />
                        </div>
                    </div>

                    <div className="bg-[#121212] rounded-2xl p-5 border border-[#1a1a1a] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-linear-to-tr from-gray-700 to-gray-600 rounded-xl overflow-hidden shrink-0"></div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-white leading-none">Marcus Sterling</h4>
                                    <span className="text-[9px] font-black uppercase bg-purple-500 text-white px-2 py-0.5 rounded-md">Senior Lead</span>
                                </div>
                                <p className="text-xs text-[#e5e7eb]/60 font-medium">Principal Systems Architect</p>
                                <div className="mt-3 w-32 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                                    <div className="h-full bg-linear-to-r from-indigo-500 to-purple-500 w-[98%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-white block leading-none">98%</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#e5e7eb]/40">Match</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#121212] rounded-2xl p-5 border border-[#1a1a1a]">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#e5e7eb]/40 mb-3">Technical Core</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-[10px] font-medium bg-[#080808] border border-[#1a1a1a] px-2 py-1 rounded-md text-[#e5e7eb]/70">React</span>
                                <span className="text-[10px] font-medium bg-[#080808] border border-[#1a1a1a] px-2 py-1 rounded-md text-[#e5e7eb]/70">Node.js</span>
                                <span className="text-[10px] font-medium bg-[#080808] border border-[#1a1a1a] px-2 py-1 rounded-md text-[#e5e7eb]/70">Tailwind</span>
                            </div>
                        </div>
                        <div className="bg-[#121212] rounded-2xl p-5 border border-[#1a1a1a]">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#e5e7eb]/40 mb-2">AI Insights</p>
                            <p className="text-[10px] italic text-[#e5e7eb]/60 leading-relaxed">
                                "Exceptional alignment with high-concurrency requirements and system reliability benchmarks."
                            </p>
                        </div>
                    </div>

                    <div className="absolute -bottom-5 -right-5 bg-[#080808] border border-[#1a1a1a] rounded-full px-5 py-3 shadow-xl flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-white">Available for Interview</span>
                    </div>
                </div>

                <div className="absolute bottom-12 text-center w-full">
                    <p className="text-sm font-medium text-[#e5e7eb]/60">
                        Let <span className="text-white font-bold">AI</span> scan your resume and match you<br />with top-tier opportunities instantly.
                    </p>
                </div>
            </div>
        </div>
    );
}