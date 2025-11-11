'use client';

import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from 'recharts';
import {HourStatistic} from '@/types/stat';

interface HourStatsChartProps {
    data: HourStatistic[];
}

export default function HourStatsChart({data}: HourStatsChartProps) {
    const formatHour = (hour: number) => {
        if (hour === 0) return '12 AM';
        if (hour === 12) return '12 PM';
        if (hour < 12) return `${hour} AM`;
        return `${hour - 12} PM`;
    };

    const chartData = data.map((stat) => ({
        ...stat,
        hourLabel: formatHour(stat.hour),
    }));

    return (
        <div className='w-full'>
            <div className='mb-4'>
                <h2 className='text-xl font-semibold'>Average Occupancy by Hour</h2>
                <p className='text-sm text-gray-500 mt-1'>
                    Historical average occupancy for each hour of the day
                </p>
            </div>

            <div className='w-full h-96 border rounded-lg p-4'>
                <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis
                            dataKey='hourLabel'
                            tick={{fontSize: 12}}
                            angle={-45}
                            textAnchor='end'
                            height={80}
                        />
                        <YAxis
                            label={{
                                value: 'Average People',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 10
                            }}
                        />
                        <Tooltip
                            formatter={(value: number) => [
                                `${value.toFixed(2)} ${value === 1 ? 'person' : 'people'}`,
                                'Average Occupancy'
                            ]}
                            labelFormatter={(label) => `Time: ${label}`}
                        />
                        <Legend />
                        <Bar
                            dataKey='average'
                            name='Average Occupancy'
                            fill='#3182ce'
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {data.length === 0 && (
                <p className='text-center text-gray-500 mt-4'>
                    No hourly statistics available
                </p>
            )}
        </div>
    );
}

