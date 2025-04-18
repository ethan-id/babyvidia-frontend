import {Row} from './row';

interface Catalog {
    [building: string]: string[];
}

const fetchCatalog = async () => {
    const url = new URL('http://jetsonnano-02.ece.iastate.edu:8080/catalog');

    const res = await fetch(url.toString());
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data: Catalog = await res.json();
    return data;
};

interface InfluxPoint {
    time: string;
    value: number;
}

const fetchByBuildingAndRoom = async (building: string, room: string) => {
    const url = new URL('http://jetsonnano-02.ece.iastate.edu:8080/query');

    url.searchParams.set('building', building);
    url.searchParams.set('room', room);

    const res = await fetch(url.toString());
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data: InfluxPoint[] = await res.json();
    return data;
};

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

                    {Object.entries(roomsMap).map(([room, points]) => (
                        <div
                            key={room}
                            className='mb-6'
                        >
                            <h3 className='text-xl font-semibold mb-2'>Room {room}</h3>

                            <div className='flex flex-col gap-2'>
                                {points?.map((point) => (
                                    <Row
                                        key={point.time}
                                        capacity={point.value}
                                        time={point.time}
                                    />
                                ))}
                                {points?.length === 0 && <p className='text-gray-500'>No data in the last 7 days</p>}
                            </div>
                        </div>
                    ))}
                </section>
            ))}
        </div>
    );
}
