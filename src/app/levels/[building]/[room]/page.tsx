import {InfluxPoint} from '@/types/influx';
import RoomDetailChart from './room-detail-chart';
import Link from 'next/link';
import { DayStatistic, HourStatistic, Statistic } from '@/types/stat';

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
// TODO: Show more data about the room, use the new statistics by day/hour endpoint
export default async function RoomDetailPage({params}: PageProps) {
    const {building, room} = await params;
    const data = await fetchByBuildingAndRoom(building, room);
    const hourStats = await fetchHourStats(building, room);
    const dayStats = await fetchDayStats(building, room);

    console.log(hourStats, dayStats);

    const latestPoint = data && data.length > 0 ? data[data.length - 1] : null;

    return (
        <div className='flex flex-col mx-auto gap-6 min-h-screen max-w-[80vw] py-6'>
            <div className='flex items-center gap-2 text-sm text-gray-500'>
                <Link href='/levels' className='hover:text-blue-500'>Levels</Link>
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
                        <span>Current Occupancy:</span>
                        <span className='font-semibold flex items-center gap-1'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                                className='w-5 h-5'
                            >
                                <path d='M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z' />
                            </svg>
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
        </div>
    );
}

