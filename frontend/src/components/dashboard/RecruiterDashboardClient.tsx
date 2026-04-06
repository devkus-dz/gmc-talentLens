"use client";

import React, { JSX } from 'react';
import dynamic from 'next/dynamic';
import StatCard from '@/components/ui/StatCard';
import { Briefcase, Users, CheckCircle, Clock } from 'lucide-react';

const ApplicationsTimelineChart = dynamic(() => import('@/components/charts/ApplicationsTimelineChart'), { ssr: false });
const PipelineFunnelChart = dynamic(() => import('@/components/charts/PipelineFunnelChart'), { ssr: false });
const JobStatusPieChart = dynamic(() => import('@/components/charts/JobStatusPieChart'), { ssr: false });

interface RecruiterDashboardProps {
    data?: {
        jobs?: { total: number; active: number; inactive: number; };
        totalApplicants?: number;
        pipelineChartData?: { status: string; count: number }[];
        activityTimeline?: { month: string; applications: number }[];
        jobStatus?: { name: string; value: number }[];
    }
}

export default function RecruiterDashboardClient({ data }: RecruiterDashboardProps): JSX.Element {

    const jobs = data?.jobs || { total: 0, active: 0, inactive: 0 };
    const totalApplicants = data?.totalApplicants || 0;
    const pipelineChartData = data?.pipelineChartData || [];
    const activityTimeline = data?.activityTimeline || [];
    const jobStatus = data?.jobStatus || [];

    const interviewCount = pipelineChartData.find(p => p.status === 'Interview')?.count || 0;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Jobs Posted" value={jobs.total} theme="neutral" icon={<Briefcase className="w-6 h-6" />} />
                <StatCard title="Active Jobs" value={jobs.active} theme="success" trendText={`${jobs.inactive} Drafts / Closed`} icon={<CheckCircle className="w-6 h-6" />} />
                <StatCard title="Total Applicants" value={totalApplicants} theme="primary" icon={<Users className="w-6 h-6" />} />
                <StatCard title="Interviews" value={interviewCount} theme="warning" icon={<Clock className="w-6 h-6" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

                {/* Timeline Chart (Full Width) */}
                <div className="card bg-base-100 shadow-sm border border-base-content/5 col-span-1 lg:col-span-2">
                    <div className="card-body">
                        <h3 className="card-title">Applicant Traffic (Last 6 Months)</h3>
                        <ApplicationsTimelineChart data={activityTimeline} />
                    </div>
                </div>

                {/* Pipeline Funnel */}
                <div className="card bg-base-100 shadow-sm border border-base-content/5">
                    <div className="card-body">
                        <h3 className="card-title">Pipeline Health</h3>
                        {/* Map the status/count to the stage/candidates format the Recharts component expects */}
                        <PipelineFunnelChart data={pipelineChartData.map(p => ({ stage: p.status, candidates: p.count }))} />
                    </div>
                </div>

                {/* Job Status Pie Chart */}
                <div className="card bg-base-100 shadow-sm border border-base-content/5">
                    <div className="card-body">
                        <h3 className="card-title">My Job Offers Distribution</h3>
                        <JobStatusPieChart data={jobStatus} />
                    </div>
                </div>

            </div>
        </div>
    );
}