'use client';

import {Chip} from '@heroui/react';
import {InfluxPoint} from '@/types/influx';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {CircleUser} from 'lucide-react';

interface RoomListProps {
    building: string;
    roomsMap: Record<string, InfluxPoint | null>;
}

const getTimeAgo = (timestamp: string, now: number) => {
    const then = new Date(timestamp).getTime();
    const diffMs = now - then;

    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `${days} day${days !== 1 ? 's' : ''} ago`;
};

export default function RoomList({building, roomsMap}: RoomListProps) {
    const [currentTime, setCurrentTime] = useState(Date.now());

    // Update the time every minute to keep "X mins ago" accurate
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {Object.entries(roomsMap).map(([room, latestPoint]) => (
                <Link
                    key={room}
                    href={`/buildings/${encodeURIComponent(building)}/${encodeURIComponent(room)}`}
                    className='flex flex-col p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer hover:border-blue-400'
                >
                    <div className='flex items-center justify-between mb-2'>
                        <span className='text-lg font-medium'>Room {room}</span>
                        {latestPoint ? (
                            <Chip
                                color={'success'}
                                variant='flat'
                                startContent={<CircleUser />}
                            >
                                {Math.round(latestPoint.value)}
                            </Chip>
                        ) : (
                            <Chip
                                color='default'
                                variant='flat'
                            >
                                No data
                            </Chip>
                        )}
                    </div>
                    {latestPoint && (
                        <span className='text-xs text-gray-500'>
                            Last updated {getTimeAgo(latestPoint.time, currentTime)}
                        </span>
                    )}
                </Link>
            ))}
        </div>
    );
}
