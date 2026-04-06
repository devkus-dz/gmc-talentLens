'use client';

import React, { JSX } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PipelineFunnelChartProps {
    data: { stage: string; candidates: number }[];
}

export default function PipelineFunnelChart({ data }: PipelineFunnelChartProps): JSX.Element {
    return (
        <div className="w-full mt-4">
            <ResponsiveContainer width="100%" height={256} minWidth={1}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="candidates" fill="#00C49F" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}