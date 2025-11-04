'use client';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from 'recharts';
import {InfluxPoint} from '@/types/influx';
import {useMemo, useState} from 'react';
import {Button, ButtonGroup} from '@heroui/react';

interface RoomDetailChartProps {
    data: InfluxPoint[];
    building: string;
    room: string;
}

type TimeRange = '1h' | '6h' | '24h' | '7d' | 'all';

export default function RoomDetailChart({data}: RoomDetailChartProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('24h');

    const filteredData = useMemo(() => {
        const now = Date.now();
        let cutoff: number;

        switch (timeRange) {
            case '1h':
                cutoff = now - 60 * 60 * 1000;
                break;
            case '6h':
                cutoff = now - 6 * 60 * 60 * 1000;
                break;
            case '24h':
                cutoff = now - 24 * 60 * 60 * 1000;
                break;
            case '7d':
                cutoff = now - 7 * 24 * 60 * 60 * 1000;
                break;
            case 'all':
                cutoff = 0;
                break;
            default:
                cutoff = now - 24 * 60 * 60 * 1000;
        }

        return data.filter((point) => {
            const t = new Date(point.time).getTime();
            return t >= cutoff;
        });
    }, [data, timeRange]);

    const formatXAxis = (timestamp: string) => {
        const date = new Date(timestamp);
        if (timeRange === '1h' || timeRange === '6h') {
            return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        } else if (timeRange === '24h') {
            return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        } else {
            return date.toLocaleDateString([], {month: 'short', day: 'numeric'});
        }
    };

    return (
        <div className='w-full'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold'>Occupancy Over Time</h2>
                <ButtonGroup size='sm' variant='flat'>
                    <Button
                        onPress={() => setTimeRange('1h')}
                        color={timeRange === '1h' ? 'primary' : 'default'}
                    >
                        1H
                    </Button>
                    <Button
                        onPress={() => setTimeRange('6h')}
                        color={timeRange === '6h' ? 'primary' : 'default'}
                    >
                        6H
                    </Button>
                    <Button
                        onPress={() => setTimeRange('24h')}
                        color={timeRange === '24h' ? 'primary' : 'default'}
                    >
                        24H
                    </Button>
                    <Button
                        onPress={() => setTimeRange('7d')}
                        color={timeRange === '7d' ? 'primary' : 'default'}
                    >
                        7D
                    </Button>
                    <Button
                        onPress={() => setTimeRange('all')}
                        color={timeRange === 'all' ? 'primary' : 'default'}
                    >
                        All
                    </Button>
                </ButtonGroup>
            </div>

            <div className='w-full h-96 border rounded-lg p-4'>
                <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis
                            dataKey='time'
                            tick={{fontSize: 12}}
                            tickFormatter={formatXAxis}
                        />
                        <YAxis
                            label={{
                                value: 'People',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 10
                            }}
                        />
                        <Tooltip
                            labelFormatter={(t) => new Date(t).toLocaleString()}
                            formatter={(value: number) => [`${Math.round(value)} ${Math.round(value) === 1 ? 'person' : 'people'}`, 'Occupancy']}
                        />
                        <Legend />
                        <Line
                            type='monotone'
                            dataKey='value'
                            name='Occupancy'
                            dot={false}
                            stroke='#3182ce'
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {filteredData.length === 0 && (
                <p className='text-center text-gray-500 mt-4'>
                    No data available for the selected time range
                </p>
            )}
        </div>
    );
}

