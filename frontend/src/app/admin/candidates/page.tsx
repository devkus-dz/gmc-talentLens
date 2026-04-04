import React, { JSX } from 'react';
import { cookies } from 'next/headers';
import CandidatesClient from '@/components/admin/CandidatesClient';
import { fetchFromServer } from '@/lib/api-server';

/**
 * @interface CandidatesPageProps
 * @property {Promise<{ page?: string; limit?: string; search?: string }>} searchParams
 */
interface CandidatesPageProps {
    searchParams: Promise<{
        isLookingForJob: any; page?: string; limit?: string; search?: string
    }>;
}

/**
 * Server Component for the Admin Candidates directory.
 * @async
 * @component
 * @param {CandidatesPageProps} props
 * @returns {Promise<JSX.Element>}
 */
export default async function AdminCandidatesPage({ searchParams }: CandidatesPageProps): Promise<JSX.Element> {
    const resolvedParams = await searchParams;
    const page = resolvedParams.page || '1';
    const limit = resolvedParams.limit || '10';
    const search = resolvedParams.search || '';
    const isLookingForJob = resolvedParams.isLookingForJob;


    let queryStr = `?role=CANDIDATE&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
    if (isLookingForJob !== undefined) {
        queryStr += `&isLookingForJob=${isLookingForJob}`;
    }

    const data = await fetchFromServer(`/users${queryStr}`);

    const candidates = data?.data || [];
    const totalRecords = data?.total || 0;

    return (
        <CandidatesClient
            initialCandidates={candidates}
            currentPage={parseInt(page, 10)}
            limit={parseInt(limit, 10)}
            totalRecords={totalRecords}
            currentSearch={search}
        />
    );
}