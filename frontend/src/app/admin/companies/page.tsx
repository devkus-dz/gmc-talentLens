import React, { JSX } from 'react';
import CompaniesClient from '@/components/admin/CompaniesClient';
import { fetchFromServer } from '@/lib/api-server';

/**
 * @interface CompaniesPageProps
 * @property {Promise<{ page?: string; limit?: string; search?: string }>} searchParams - URL parameters.
 */
interface CompaniesPageProps {
    searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}

/**
 * Server Component for the Admin Companies dashboard.
 * @async
 * @component
 * @param {CompaniesPageProps} props - The page props.
 * @returns {Promise<JSX.Element>}
 */
export default async function AdminCompaniesPage({ searchParams }: CompaniesPageProps): Promise<JSX.Element> {
    const resolvedParams = await searchParams;
    const page = resolvedParams.page || '1';
    const limit = resolvedParams.limit || '10';
    const search = resolvedParams.search || '';

    const res = await fetchFromServer(`/admin/companies?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

    const data = res || { data: [], total: 0 };

    return (
        <CompaniesClient
            initialCompanies={data.data || []}
            currentPage={parseInt(page, 10)}
            limit={parseInt(limit, 10)}
            totalRecords={data.total || 0}
            currentSearch={search}
        />
    );
}