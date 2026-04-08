'use client';

import React, { JSX } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ApplicationsTimelineChartProps {
    data: { month: string; applications: number }[];
}

export default function ApplicationsTimelineChart({ data }: ApplicationsTimelineChartProps): JSX.Element {

    return (
        <div className="w-full mt-4">
            <ResponsiveContainer width="100%" height={320} minWidth={1}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="applications" stroke="#8884d8" fillOpacity={1} fill="url(#colorApps)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}