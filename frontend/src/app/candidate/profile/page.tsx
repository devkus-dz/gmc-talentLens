import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import CandidateProfileClient from '@/components/profile/CandidateProfileClient';
import { fetchFromServer } from '@/lib/api-server';

export default async function CandidateProfile() {
    const [authRes, resumeRes] = await Promise.all([
        fetchFromServer('/auth/me'),
        fetchFromServer('/resumes/me')
    ]);

    const user = authRes?.user || {};

    // Explicitly grab the resume data AND the documentUrl!
    const resume = resumeRes?.parsedData || resumeRes?.resume || resumeRes || null;
    const documentUrl = resumeRes?.documentUrl || null; // <-- Added this

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in p-2">
            <PageHeader
                title="Resume & Profile"
                description="Manage your uploaded resume and AI-parsed details."
            />

            {/* Pass the explicitly extracted URL down */}
            <CandidateProfileClient
                initialUser={user}
                initialResume={resume}
                initialDocumentUrl={documentUrl}
            />
        </div>
    );
}