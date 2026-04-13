import React, { JSX } from 'react';
import { cookies } from 'next/headers';
import { fetchFromServer } from '@/lib/api-server';
import UsersClient from '@/components/admin/UsersClient';

/**
 * @interface UsersPageProps
 * @property {Promise<{ page?: string; limit?: string; search?: string }>} searchParams - Next.js async search parameters.
 */
interface UsersPageProps {
    searchParams: Promise<{
        role: any; page?: string; limit?: string; search?: string
    }>;
}

/**
 * Server Component for the Admin Users dashboard.
 * @async
 * @component
 * @param {UsersPageProps} props - The page props.
 * @returns {Promise<JSX.Element>}
 */
export default async function AdminUsersPage({ searchParams }: UsersPageProps): Promise<JSX.Element> {
    const resolvedParams = await searchParams;
    const page = resolvedParams.page || '1';
    const limit = resolvedParams.limit || '10';
    const search = resolvedParams.search || '';

    const roleFilter = resolvedParams.role ? `&role=${resolvedParams.role}` : '';

    const usersRes = await fetchFromServer(`/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}${roleFilter}`);
    const companiesRes = await fetchFromServer(`/admin/companies`);

    const usersData = usersRes || { data: [], total: 0 };
    const companiesData = companiesRes || { data: [] };

    return (
        <UsersClient
            initialUsers={usersData.data || []}
            companies={companiesData.data || []}
            currentPage={parseInt(page, 10)}
            limit={parseInt(limit, 10)}
            totalRecords={usersData.total || 0}
            currentSearch={search}
        />
    );
}