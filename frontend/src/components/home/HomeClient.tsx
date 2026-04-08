"use client";

import React, { useState, useEffect, JSX } from 'react';
import Link from 'next/link';
import { Bot, Zap, MousePointerClick, GitMerge } from 'lucide-react';
import Logo from '@/components/ui/Logo';

/**
 * Renders the interactive UI for the Landing Page.
 * Checks local session to dynamically render Dashboard links.
 * @returns {JSX.Element} The client-side landing page UI.
 */
export default function HomeClient(): JSX.Element {
    const [user, setUser] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse user from local storage");
            }
        }
        setIsLoaded(true);
    }, []);

    /**
     * Determines the correct dashboard route based on user role.
     * @returns {string} The dashboard URL.
     */
    const getDashboardLink = (): string => {
        if (!user) return '/auth/login';
        switch (user.role) {
            case 'ADMIN': return '/admin/dashboard';
            case 'RECRUITER': return '/recruiter/dashboard';
            case 'CANDIDATE': return '/candidate/dashboard';
            default: return '/auth/login';
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0D17] text-[#e5e7eb] font-sans selection:bg-indigo-500/30 overflow-hidden relative">

            {/* Ambient Background Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#0B0D17]/80 backdrop-blur-xl border-b border-[#1F2438]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Logo />
                    <div className="flex items-center gap-4">
                        {!isLoaded ? (
                            <div className="w-24 h-10 bg-[#1F2438] animate-pulse rounded-full"></div>
                        ) : user ? (
                            <Link href={getDashboardLink()} className="btn btn-sm h-10 px-6 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white border-none shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.6)]">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/login" className="text-sm font-bold hover:text-white transition-colors">Log in</Link>
                                <Link href="/auth/register" className="btn btn-sm h-10 px-6 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white border-none shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.6)]">
                                    Join Talent Pool
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-40 pb-24 relative z-10">
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-6">
                            Hire Smarter.<br />
                            Land Faster.<br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                                Powered by AI.
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-[#e5e7eb]/60 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            The next-generation ATS that uses AI to score candidates, automate pipelines, and connect top talent with top companies instantly.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            {!isLoaded ? (
                                <div className="w-56 h-14 bg-[#1F2438] animate-pulse rounded-full"></div>
                            ) : user ? (
                                <Link href={getDashboardLink()} className="btn h-14 px-8 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white border-none shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] w-full sm:w-auto text-lg font-bold">
                                    Go to My Workspace
                                </Link>
                            ) : (
                                <Link href="/auth/register" className="btn h-14 px-8 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white border-none shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] w-full sm:w-auto text-lg font-bold">
                                    Create Candidate Profile
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 w-full relative hidden lg:block">
                        <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
                        <div className="relative bg-[#141726] border border-[#1F2438] rounded-3xl p-2 shadow-2xl aspect-4/3 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/TalentLens-candidate.JPG')] opacity-50  bg-center bg-no-repeat bg-cover"></div>
                            <div className="absolute top-4 right-4 bg-[#0B0D17] border border-[#1F2438] rounded-full px-4 py-2 flex items-center gap-2">
                                <SparklesIcon className="w-4 h-4 text-purple-400" />
                                <span className="text-xs font-bold tracking-widest uppercase">AI Match: 98%</span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Bento Box Features */}
                <div className="mb-32">
                    <h2 className="text-3xl font-bold mb-10 border-b border-indigo-500/30 pb-4 inline-block">Precision Engineering for HR.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">

                        <div className="md:col-span-2 bg-[#141726] rounded-3xl p-8 border border-[#1F2438] flex flex-col justify-between group hover:border-indigo-500/30 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-[#0B0D17] border border-[#1F2438] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Bot className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-3">AI Resume Parsing</h3>
                                <p className="text-[#e5e7eb]/60 text-sm max-w-md leading-relaxed">Extract deep insights, not just keywords. Our LLM-powered engine understands context, seniority, and soft skills with 99.8% accuracy.</p>
                            </div>
                        </div>

                        <div className="md:col-span-1 md:row-span-2 bg-[#141726] rounded-3xl p-8 border border-[#1F2438] flex flex-col justify-end relative overflow-hidden group hover:border-purple-500/30 transition-colors">

                            {/* screenshot background */}
                            <div className="absolute inset-0 bg-[url('/TalentLens-pipeline.jpg')] bg-contain bg-top bg-no-repeat opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>

                            {/* Gradient overlay so the text stays readable at the bottom */}
                            <div className="absolute inset-0 bg-linear-to-t from-[#141726] via-[#141726]/80 to-transparent"></div>

                            <div className="w-12 h-12 rounded-full bg-[#0B0D17] border border-[#1F2438] flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
                                <GitMerge className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-3">Drag & Drop Pipelines</h3>
                                <p className="text-[#e5e7eb]/60 text-sm leading-relaxed">A Kanban experience designed for speed. Move candidates between stages with instant automation triggers.</p>
                            </div>
                        </div>

                        <div className="md:col-span-1 bg-[#141726] rounded-3xl p-8 border border-[#1F2438] flex flex-col justify-between group hover:border-indigo-500/30 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-[#0B0D17] border border-[#1F2438] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MousePointerClick className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">1-Click Apply</h3>
                                <p className="text-[#e5e7eb]/60 text-sm leading-relaxed">Eliminate friction. Candidates can apply from anywhere in seconds with verified profiles.</p>
                            </div>
                        </div>

                        <div className="md:col-span-1 bg-[#141726] rounded-3xl p-8 border border-[#1F2438] flex flex-col justify-between group hover:border-indigo-500/30 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-[#0B0D17] border border-[#1F2438] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Automated Scoring</h3>
                                <p className="text-[#e5e7eb]/60 text-sm leading-relaxed">Instant fit-score calculation based on your custom job requirements and cultural markers.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Minimal Footer */}
            <footer className="border-t border-[#1F2438] bg-[#0B0D17] pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                    <div className="max-w-md">
                        <Logo />
                        <p className="text-[#e5e7eb]/40 text-sm mt-4 leading-relaxed">
                            Connecting exceptional talent with industry-leading companies. TalentLens leverages advanced AI to eliminate hiring friction, ensuring the perfect fit for every role.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm tracking-widest uppercase mb-4 text-[#e5e7eb]">Legal</h4>
                        <ul className="space-y-2 text-sm text-[#e5e7eb]/50">
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 border-t border-[#1F2438] pt-8 flex justify-between items-center text-[10px] sm:text-xs text-[#e5e7eb]/30 font-bold tracking-widest uppercase">
                    <p>© {new Date().getFullYear()} TALENTLENS. ALL RIGHTS RESERVED.</p>
                </div>
            </footer>
        </div>
    );
}

/**
 * Inline SVG component for Sparkles.
 * @param {React.SVGProps<SVGSVGElement>} props - SVG attributes.
 * @returns {JSX.Element}
 */
function SparklesIcon(props: React.SVGProps<SVGSVGElement>): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
    );
}