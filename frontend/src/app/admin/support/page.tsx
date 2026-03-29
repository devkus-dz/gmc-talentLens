// Example for src/app/admin/candidates/page.tsx
import React from 'react';

export default function CandidatesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center animate-fade-in">
            <div className="bg-base-100 rounded-4xl p-12 shadow-sm border border-base-content/5 max-w-md w-full">
                <h1 className="text-3xl font-bold text-primary mb-2">Support</h1>
                <p className="text-base-content/60">This module is currently under development.</p>
                <button className="btn btn-outline mt-6 rounded-xl">Go back to Dashboard</button>
            </div>
        </div>
    );
}