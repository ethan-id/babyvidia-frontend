'use client';

import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from 'recharts';
import {DayStatistic} from '@/types/stat';

interface DayStatsChartProps {
    data: DayStatistic[];
}

export default function DayStatsChart({data}: DayStatsChartProps) {
    // Sort days in proper week order
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    const sortedData = [...data].sort((a, b) => {
        return dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week);
    });

    return (
        <div className='w-full'>
            <div className='mb-4'>
                <h2 className='text-xl font-semibold'>Average Occupancy by Day of Week</h2>
                <p className='text-sm text-gray-500 mt-1'>
                    Historical average occupancy for each day of the week
                </p>
            </div>

            <div className='w-full h-96 border rounded-lg p-4'>
                <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={sortedData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis
                            dataKey='day_of_week'
                            tick={{fontSize: 12}}
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
                            labelFormatter={(label) => `Day: ${label}`}
                        />
                        <Legend />
                        <Bar
                            dataKey='average'
                            name='Average Occupancy'
                            fill='#10b981'
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {data.length === 0 && (
                <p className='text-center text-gray-500 mt-4'>
                    No daily statistics available
                </p>
            )}
        </div>
    );
}

