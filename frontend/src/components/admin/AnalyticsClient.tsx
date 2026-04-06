'use client';

import React, { JSX } from 'react';
import dynamic from 'next/dynamic';

// 1. Import dynamic from next
// 2. Dynamically import the charts and explicitly disable SSR. 
// This guarantees Recharts only measures the container after the browser layout is fully painted.
const ApplicationsTimelineChart = dynamic(
    () => import('@/components/charts/ApplicationsTimelineChart'),
    { ssr: false, loading: () => <div className="w-full h-80 bg-base-200 animate-pulse rounded-xl" /> }
);

const PipelineFunnelChart = dynamic(
    () => import('@/components/charts/PipelineFunnelChart'),
    { ssr: false, loading: () => <div className="w-full h-64 bg-base-200 animate-pulse rounded-xl" /> }
);

const JobStatusPieChart = dynamic(
    () => import('@/components/charts/JobStatusPieChart'),
    { ssr: false, loading: () => <div className="w-full h-64 bg-base-200 animate-pulse rounded-xl" /> }
);

/**
 * @interface AnalyticsClientProps
 */
interface AnalyticsClientProps {
    jobStatus: { name: string; value: number }[];
    pipeline: { stage: string; candidates: number }[];
    activityTimeline: { month: string; applications: number }[];
}

/**
 * Client component to render the Analytics Dashboard Layout.
 * @component
 * @param {AnalyticsClientProps} props - The aggregated analytics data.
 * @returns {JSX.Element}
 */
export default function AnalyticsClient({ jobStatus, pipeline, activityTimeline }: AnalyticsClientProps): JSX.Element {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-base-content">Platform Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Applications Timeline */}
                <div className="card bg-base-100 shadow-xl col-span-1 lg:col-span-2">
                    <div className="card-body">
                        <h3 className="card-title">Applications Over Time (6 Months)</h3>
                        <ApplicationsTimelineChart data={activityTimeline} />
                    </div>
                </div>

                {/* Candidate Pipeline */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title">Candidate Pipeline</h3>
                        <PipelineFunnelChart data={pipeline} />
                    </div>
                </div>

                {/* Job Status Distribution */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title">Job Offer Distribution</h3>
                        <JobStatusPieChart data={jobStatus} />
                    </div>
                </div>

            </div>
        </div>
    );
}