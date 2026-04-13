// frontend/src/app/admin/analytics/page.tsx
import React, { JSX } from 'react';
import { fetchFromServer } from '@/lib/api-server';
import AnalyticsClient from '@/components/admin/AnalyticsClient';

/**
 * Server Component for the Admin Analytics dashboard.
 * @async
 * @component
 * @returns {Promise<JSX.Element>}
 */
export default async function AdminAnalyticsPage(): Promise<JSX.Element> {

    const res = await fetchFromServer(`/dashboard/analytics`);

    // Fallback empty state if API fails
    const data = res || { jobStatus: [], pipeline: [], activityTimeline: [] };

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