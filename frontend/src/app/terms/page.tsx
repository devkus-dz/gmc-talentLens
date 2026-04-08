import React, { JSX } from 'react';
import Link from 'next/link';
import { AlertTriangle, Bot, Shield, FileText, ArrowLeft, Scale } from 'lucide-react';
import Logo from '@/components/ui/Logo';

/**
 * Renders the Terms of Service and Privacy Policy page.
 * Details the AI processing of CVs, confidentiality agreements, and platform status.
 * @returns {JSX.Element} The Terms of Service page UI.
 */
export default function TermsPage(): JSX.Element {
    return (
        <div className="min-h-screen bg-[#0B0D17] text-[#e5e7eb] font-sans selection:bg-indigo-500/30 overflow-hidden relative">

            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Minimal Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#0B0D17]/80 backdrop-blur-xl border-b border-[#1F2438]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Logo />
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#e5e7eb]/60 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">

                {/* Header */}
                <div className="mb-12 text-center sm:text-left">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#141726] border border-[#1F2438] shadow-inner mb-6">
                        <Scale className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Terms of Service & Privacy</h1>
                    <p className="text-lg text-[#e5e7eb]/60 font-medium max-w-2xl">
                        Please read these terms carefully to understand how   TalentLens processes your data and facilitates the hiring process.
                    </p>
                </div>

                {/* Under Construction Notice */}
                <div className="bg-warning/10 border border-warning/20 rounded-3xl p-6 sm:p-8 mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-warning mb-1">Project Under Construction</h3>
                        <p className="text-sm text-warning/80 leading-relaxed">
                            TalentLens is currently in active development (Beta). Features, data handling processes, and services are subject to change without prior notice. By using the platform during this phase, you acknowledge and accept potential instability or modifications to the service.
                        </p>
                    </div>
                </div>

                {/* Terms Content */}
                <div className="space-y-8">

                    {/* Section 1: Platform Functionality */}
                    <section className="bg-[#141726] rounded-3xl p-8 border border-[#1F2438] hover:border-indigo-500/30 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#0B0D17] border border-[#1F2438] flex items-center justify-center">
                                <FileText className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold">1. Platform Functionality</h2>
                        </div>
                        <p className="text-[#e5e7eb]/70 text-sm leading-relaxed ml-14">
                            TalentLens is an advanced Applicant Tracking System (ATS) designed to bridge the gap between top-tier candidates and innovative companies. The platform utilizes automated pipelines, intelligent scoring algorithms, and a unified dashboard to streamline the recruitment lifecycle for both recruiters and applicants.
                        </p>
                    </section>

                    {/* Section 2: AI Processing & CV Uploads */}
                    <section className="bg-[#141726] rounded-3xl p-8 border border-[#1F2438] hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#0B0D17] border border-[#1F2438] flex items-center justify-center">
                                <Bot className="w-5 h-5 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold">2. AI Processing & CV Data</h2>
                        </div>
                        <p className="text-[#e5e7eb]/70 text-sm leading-relaxed ml-14 mb-4">
                            To provide our core service of automated candidate scoring and profile generation,   TalentLens employs advanced Artificial Intelligence (AI) agents and Large Language Models (LLMs).
                        </p>
                        <div className="ml-14 bg-purple-500/5 border border-purple-500/10 rounded-2xl p-5">
                            <p className="text-sm font-medium text-[#e5e7eb]/90 leading-relaxed">
                                <strong className="text-purple-400 block mb-2">Explicit Consent Requirement:</strong>
                                By uploading your Curriculum Vitae (CV) or Resume to the platform, you explicitly consent to having the document's contents parsed, read, and processed by our AI agents. This data is used solely to extract your skills, experience, and education to generate a standardized candidate profile and calculate job match scores. If you do not agree to AI processing, you must not upload your CV to the platform.
                            </p>
                        </div>
                    </section>

                    {/* Section 3: Confidentiality */}
                    <section className="bg-[#141726] rounded-3xl p-8 border border-[#1F2438] hover:border-indigo-500/30 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#0B0D17] border border-[#1F2438] flex items-center justify-center">
                                <Shield className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold">3. Confidentiality & Privacy</h2>
                        </div>
                        <p className="text-[#e5e7eb]/70 text-sm leading-relaxed ml-14">
                            We take your privacy seriously. The personal data extracted from your CV is strictly confidential and is never sold to third-party data brokers. Your profile is only visible to verified Recruiter and Company accounts registered on   TalentLens, and only when your "Open to Work" status is actively enabled or when you explicitly apply to their job listings. We employ industry-standard encryption to protect your data at rest and in transit.
                        </p>
                    </section>

                </div>

            </main>

            {/* Footer */}
            <footer className="border-t border-[#1F2438] bg-[#0B0D17] py-8 relative z-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-[#e5e7eb]/40 font-bold tracking-widest uppercase">
                        © {new Date().getFullYear()}   TALENTLENS. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-6 text-xs text-[#e5e7eb]/40 font-bold tracking-widest uppercase">
                        <span>Last Updated: April 2026</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}