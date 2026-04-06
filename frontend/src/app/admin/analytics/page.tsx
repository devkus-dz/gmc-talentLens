// frontend/src/app/admin/analytics/page.tsx
import React, { JSX } from 'react';
import { cookies } from 'next/headers';
import AnalyticsClient from '@/components/admin/AnalyticsClient';

/**
 * Server Component for the Admin Analytics dashboard.
 * @async
 * @component
 * @returns {Promise<JSX.Element>}
 */
export default async function AdminAnalyticsPage(): Promise<JSX.Element> {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Cookie': `jwt=${token}` } : {})
    };

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    // Fetch analytics data (Replace '/dashboard/analytics' with your actual route)
    const res = await fetch(`${backendUrl}/dashboard/analytics`, { headers, cache: 'no-store' });

    // Fallback empty state if API fails
    const defaultData = { jobStatus: [], pipeline: [], activityTimeline: [] };
    const data = res.ok ? await res.json() : defaultData;

    return (
        <div className="p-6">
            <AnalyticsClient
                jobStatus={data.jobStatus || []}
                pipeline={data.pipeline || []}
                activityTimeline={data.activityTimeline || []}
            />
        </div>
    );
}