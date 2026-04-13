import React, { JSX } from 'react';
import JobsClient from '@/components/admin/JobsClient';
import { fetchFromServer } from '@/lib/api-server';

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
    const status = resolvedParams.status;

    let fetchUrl = `/jobs?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

    // Append the status filter to the backend API call if it exists
    if (status) {
        fetchUrl += `&status=${status}`;
    }

    const res = await fetchFromServer(fetchUrl);

    const data = res || { data: [], total: 0 };

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