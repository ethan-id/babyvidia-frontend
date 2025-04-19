'use client';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import {InfluxPoint} from '@/types/influx';

interface RoomChartProps {
    data: InfluxPoint[];
    room: string;
}

export default function RoomChart({data, room}: RoomChartProps) {
    return (
        <div className='w-full h-64 mb-6'>
            <h3 className='text-xl font-semibold mb-2'>Room {room}</h3>
            <ResponsiveContainer
                width='100%'
                height='100%'
            >
                <LineChart data={data}>
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
