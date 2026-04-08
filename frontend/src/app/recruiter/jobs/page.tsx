import React, { JSX } from 'react';
import RecruiterJobsClient from '@/components/recruiter/RecruiterJobsClient';
import { fetchFromServer } from '@/lib/api-server';

export default async function ManageJobsPage(): Promise<JSX.Element> {

    // Get the current user to find their ID
    const authRes = await fetchFromServer('/auth/me');
    const userId = authRes?.user?._id || authRes?.user?.id;

    let myJobs = [];
    let totalPages = 1;

    if (userId) {
        // Fetch only the FIRST page (limit 5)
        const jobsRes = await fetchFromServer(`/jobs?createdBy=${userId}&page=1&limit=5`);
        myJobs = jobsRes?.data || [];
        totalPages = jobsRes?.totalPages || 1;
    }

    // Pass the initial data, the total pages, and the user ID to the Client
    return <RecruiterJobsClient initialJobs={myJobs} totalPages={totalPages} userId={userId} />;
}