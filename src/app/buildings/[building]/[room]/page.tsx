import {InfluxPoint} from '@/types/influx';
import RoomDetailChart from './room-detail-chart';
import HourStatsChart from './hour-stats-chart';
import DayStatsChart from './day-stats-chart';
import Link from 'next/link';
import { DayStatistic, HourStatistic } from '@/types/stat';
import { CircleUser } from 'lucide-react';

interface PageProps {
    params: Promise<{
        building: string;
        room: string;
    }>;
}

const jetsonBaseURL = process.env.JETSON_URL;
if (jetsonBaseURL === undefined) {
    throw new Error('Missing env var "JETSON_URL"');
}

const fetchDayStats = async (building: string, room: string) => {
    const url = new URL('/statistics/day', jetsonBaseURL);

    url.searchParams.set('building', building);
    url.searchParams.set('room', room);

    const res = await fetch(url, {
        cache: 'no-store'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data: DayStatistic[] = await res.json();
    return data;
}

const fetchHourStats = async (building: string, room: string) => {
    const url = new URL('/statistics/hour', jetsonBaseURL);

    url.searchParams.set('building', building);
    url.searchParams.set('room', room);

    const res = await fetch(url, {
        cache: 'no-store'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data: HourStatistic[] = await res.json();
    return data;
}

const fetchByBuildingAndRoom = async (building: string, room: string) => {
    const url = new URL('/query', jetsonBaseURL);

    url.searchParams.set('building', building);
    url.searchParams.set('room', room);

    const res = await fetch(url, {
        cache: 'no-store'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data: InfluxPoint[] = await res.json();
    return data;
};

// TODO: Make "Current Occupancy" say "Last Known Occupancy" if data point is older than ~10 minutes or something
export default async function RoomDetailPage({params}: PageProps) {
    const {building, room} = await params;
    const data = await fetchByBuildingAndRoom(building, room);
    const hourStats = await fetchHourStats(building, room);
    const dayStats = await fetchDayStats(building, room);

    const latestPoint = data && data.length > 0 ? data[data.length - 1] : null;

    return (
        <div className='flex flex-col mx-auto gap-6 min-h-screen max-w-[80vw] py-6'>
            <div className='flex items-center gap-2 text-sm text-gray-500'>
                <Link href='/buildings' className='hover:text-blue-500'>Buildings</Link>
                <span>/</span>
                <span>{building}</span>
                <span>/</span>
                <span>{room}</span>
            </div>

            <div>
                <h1 className='text-3xl font-bold mb-2'>
                    {building} - Room {room}
                </h1>
                {latestPoint && (
                    <div className='flex items-center gap-2 text-lg text-gray-600'>
                        <span>Last Known Occupancy:</span>
                        <span className='font-semibold flex items-center gap-1'>
                            <CircleUser className='w-5 h-5' />
                            {Math.round(latestPoint.value)} {Math.round(latestPoint.value) === 1 ? 'person' : 'people'}
                        </span>
                    </div>
                )}
            </div>

            {data && data.length > 0 ? (
                <RoomDetailChart data={data} building={building} room={room} />
            ) : (
                <div className='p-8 border rounded-lg text-center text-gray-500'>
                    No data available for this room
                </div>
            )}

            {/* Statistics Charts */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {hourStats && hourStats.length > 0 && (
                    <HourStatsChart data={hourStats} />
                )}
                {dayStats && dayStats.length > 0 && (
                    <DayStatsChart data={dayStats} />
                )}
            </div>

            {/* Show message if no stats available */}
            {(!hourStats || hourStats.length === 0) && (!dayStats || dayStats.length === 0) && (
                <div className='p-8 border rounded-lg text-center text-gray-500'>
                    No statistical data available for this room
                </div>
            )}
        </div>
    );
}

