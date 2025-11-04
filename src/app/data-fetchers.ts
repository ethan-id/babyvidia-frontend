import {InfluxPoint} from '@/types/influx';

type Catalog = Record<string, string[]>;

const jetsonBaseURL = process.env.JETSON_URL;
if (jetsonBaseURL === undefined) {
    throw new Error('Missing env var "JETSON_URL"');
}

export const fetchCatalog = async () => {
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

export const fetchByBuildingAndRoom = async (building: string, room: string) => {
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
