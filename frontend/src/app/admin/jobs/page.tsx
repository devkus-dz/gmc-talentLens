// frontend/src/app/admin/jobs/page.tsx
import React, { JSX } from 'react';
import { cookies } from 'next/headers';
import JobsClient from '@/components/admin/JobsClient';

/**
 * @interface JobsPageProps
 * @property {Promise<{ page?: string; limit?: string; search?: string; status?: string }>} searchParams - URL parameters.
 */
interface JobsPageProps {
    searchParams: Promise<{
        status?: string; page?: string; limit?: string; search?: string
    }>;
}

/**
 * Server Component for the Admin Jobs dashboard.
 * @async
 * @component
 * @param {JobsPageProps} props - The page props.
 * @returns {Promise<JSX.Element>}
 */
export default async function AdminJobsPage({ searchParams }: JobsPageProps): Promise<JSX.Element> {
    const resolvedParams = await searchParams;
    const page = resolvedParams.page || '1';
    const limit = resolvedParams.limit || '10';
    const search = resolvedParams.search || '';

    // Changed from `isActive` to `status` to match your backend updates
    const status = resolvedParams.status;

    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Cookie': `jwt=${token}` } : {})
    };

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    let fetchUrl = `${backendUrl}/jobs?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

    // Append the status filter to the backend API call if it exists
    if (status) {
        fetchUrl += `&status=${status}`;
    }

    const res = await fetch(fetchUrl, { headers, cache: 'no-store' });

    const data = res.ok ? await res.json() : { data: [], total: 0 };

    return (
        <JobsClient
            initialJobs={data.data || []}
            currentPage={parseInt(page, 10)}
            limit={parseInt(limit, 10)}
            totalRecords={data.total || 0}
            currentSearch={search}
        />
    );
}