'use client';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import {InfluxPoint} from '@/types/influx';
import { useMemo } from 'react';

interface RoomChartProps {
    data: InfluxPoint[];
    room: string;
}

export default function RoomChart({data, room}: RoomChartProps) {
    const oneDayMs = 24 * 60 * 1000;
    const cutoff = Date.now() - oneDayMs;

    const filteredData = useMemo(() => data.filter((point) => {
        const t = new Date(point.time).getTime();
        return t >= cutoff;
    }), [data, cutoff]);

    return (
        <div className='w-full h-64 mb-6'>
            <h3 className='text-xl font-semibold mb-2'>Room {room}</h3>
            <ResponsiveContainer
                width='100%'
                height='100%'
            >
                <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                        dataKey='time'
                        tick={{fontSize: 12}}
                        tickFormatter={(t) => new Date(t).toLocaleTimeString()}
                    />
                    <YAxis label={{value: 'Capacity', angle: -90, position: 'insideLeft', offset: 10}} />
                    <Tooltip labelFormatter={(t) => new Date(t).toLocaleString()} />
                    <Line
                        type='monotone'
                        dataKey='value'
                        name='Capacity'
                        dot={false}
                        stroke='#3182ce'
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
