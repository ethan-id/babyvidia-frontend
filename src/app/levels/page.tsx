import dynamic from 'next/dynamic';
import {InfluxPoint} from '@/types/influx';

interface Catalog {
    [building: string]: string[];
}

const jetsonBaseURL = process.env.JETSON_URL;

const fetchCatalog = async () => {
    const url = new URL('/catalog', jetsonBaseURL);

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data: Catalog = await res.json();
    return data;
};

const fetchByBuildingAndRoom = async (building: string, room: string) => {
    const url = new URL('/query', jetsonBaseURL);

    url.searchParams.set('building', building);
    url.searchParams.set('room', room);

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data: InfluxPoint[] = await res.json();
    return data;
};

const RoomChart = dynamic(() => import('./room-chart'));

export default async function LevelsPage() {
    const catalog = await fetchCatalog();

    const dataByBuilding: Record<string, Record<string, InfluxPoint[]>> = {};

    for (const [building, rooms] of Object.entries(catalog)) {
        dataByBuilding[building] = {};
        for (const room of rooms) {
            dataByBuilding[building][room] = await fetchByBuildingAndRoom(building, room);
        }
    }

    return (
        <div className='flex flex-col gap-6 min-h-screen mx-12 my-6'>
            <h1 className='text-3xl'>/ Levels</h1>

            {Object.entries(dataByBuilding).map(([building, roomsMap]) => (
                <section
                    key={building}
                    className='mb-8'
                >
                    <h2 className='text-2xl font-bold mb-4'>{building}</h2>

                    {Object.entries(roomsMap).map(([room, points]) =>
                        points.length > 0 ? (
                            <RoomChart
                                key={room}
                                room={room}
                                data={points}
                            />
                        ) : (
                            <p
                                key={room}
                                className='text-gray-500 mb-6'
                            >
                                Room {room}: No data in the last 7 days
                            </p>
                        )
                    )}
                </section>
            ))}
        </div>
    );
}
