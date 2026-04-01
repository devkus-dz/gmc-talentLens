import React from 'react';

interface AIAnalysisCardProps {
    score: number;
    primaryRole: string;
    missingSkills?: string[];
    improvementTip?: string;
}

export default function AIAnalysisCard({ score, primaryRole, missingSkills = [], improvementTip }: AIAnalysisCardProps) {
    return (
        <div className="bg-primary/5 rounded-4xl p-6 sm:p-8 border border-primary/10">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary text-primary-content rounded-xl shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-primary">AI Profile Match</h3>
                    {/* Changed from "Analyzed by Gemini" to "AI Analysis" */}
                    <p className="text-xs text-primary/70 font-medium tracking-wide uppercase">AI Analysis</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-base-content/70">Profile Strength</span>
                    <span className="text-2xl font-black text-primary">{score}%</span>
                </div>
                <progress className="progress progress-primary w-full h-2.5" value={score} max="100"></progress>
            </div>

            <div className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-content/5 mb-6">
                <span className="text-xs font-bold text-base-content/40 uppercase tracking-widest block mb-1">Detected Role</span>
                <span className="font-semibold text-base-content" dir="auto">{primaryRole}</span>
            </div>

            <div className="mb-2">
                <span className="text-xs font-bold text-base-content/40 uppercase tracking-widest block mb-2">AI Suggestion</span>
                <p className="text-sm leading-relaxed text-base-content/80" dir="auto">
                    {improvementTip || "Your profile is well structured. Consider adding more quantifiable achievements to your experience section."}
                </p>
            </div>
        </div>
    );
}