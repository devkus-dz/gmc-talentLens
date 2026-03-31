import React from 'react';

interface AIAnalysisCardProps {
    score: number;
    primaryRole: string;
    missingSkills: string[];
}

export default function AIAnalysisCard({ score, primaryRole, missingSkills }: AIAnalysisCardProps) {
    return (
        <div className="bg-linear-to-br from-primary/5 to-secondary/5 rounded-4xl p-6 border border-primary/10 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" /></svg>
                <span className="font-bold text-primary text-sm">AI Profile Analysis</span>
            </div>
            <p className="text-sm leading-relaxed text-base-content/80 mb-4">
                Your profile is highly optimized for {primaryRole} roles. However, adding{' '}
                {missingSkills.map((skill, i) => (
                    <span key={skill}>
                        <span className="font-semibold text-primary">{skill}</span>
                        {i < missingSkills.length - 1 ? ' or ' : ''}
                    </span>
                ))}{' '}
                to your skills could increase your match rate.
            </p>
            <div className="w-full bg-base-200 rounded-full h-2 mb-1">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${score}%` }}></div>
            </div>
            <p className="text-xs text-right text-base-content/50 font-medium mt-1">{score}% Complete</p>
        </div>
    );
}