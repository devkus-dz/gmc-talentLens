'use client';

import React, { JSX } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';

interface JobStatusPieChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function JobStatusPieChart({ data }: JobStatusPieChartProps): JSX.Element {
    const coloredData = data.map((entry, index) => ({
        ...entry,
        fill: COLORS[index % COLORS.length]
    }));

    return (
        <div className="w-full mt-4">
            <ResponsiveContainer width="100%" height={256} minWidth={1}>
                <PieChart>
                    <Pie
                        data={coloredData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}