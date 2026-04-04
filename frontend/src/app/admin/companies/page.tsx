import React, { JSX } from 'react';
import { cookies } from 'next/headers';
import CompaniesClient from '@/components/admin/CompaniesClient';

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

    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Cookie': `jwt=${token}` } : {})
    };

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    const res = await fetch(`${backendUrl}/admin/companies?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`, {
        headers,
        cache: 'no-store'
    });

    const data = res.ok ? await res.json() : { data: [], total: 0 };

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