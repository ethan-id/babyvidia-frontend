import {InfluxPoint} from '@/types/influx';
import {BuildingsContainer} from './buildings-container';

interface Catalog {
    [building: string]: string[];
}

const jetsonBaseURL = process.env.JETSON_URL;
if (jetsonBaseURL === undefined) {
    throw new Error('Missing env var "JETSON_URL"');
}

const fetchCatalog = async () => {
    const url = new URL('/catalog', jetsonBaseURL);

    const res = await fetch(url, {
        cache: 'no-store'
    });
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

    const res = await fetch(url, {
        cache: 'no-store'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data: InfluxPoint[] = await res.json();
    return data;
};

export default async function BuildingsPage() {
    const catalog = await fetchCatalog();
    const dataByBuilding: Record<string, Record<string, InfluxPoint | null>> = {};

    for (const [building, rooms] of Object.entries(catalog)) {
        dataByBuilding[building] = {};
        if (rooms) {
            for (const room of rooms) {
                const data = await fetchByBuildingAndRoom(building, room);
                // Get the most recent data point
                dataByBuilding[building][room] = data && data.length > 0 ? data[data.length - 1] : null;
            }
        }
    }

    return (
        <div className='flex flex-col mx-auto gap-6 min-h-screen max-w-[80vw] py-6'>
            <h1 className='text-3xl'>/ Buildings</h1>
            <BuildingsContainer dataByBuilding={dataByBuilding} />
        </div>
    );
}
