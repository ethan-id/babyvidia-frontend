import {Row} from './row';

interface InfluxPoint {
    time: string;
    value: number;
}

const fetchByBuildingAndRoom = async (building: string, room: string) => {
    const url = new URL('http://jetsonnano-02.ece.iastate.edu:8080/query');

    url.searchParams.set('building', building);
    url.searchParams.set('roomID', room);

    const res = await fetch(url.toString());
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data: InfluxPoint[] = await res.json();
    return data;
};

export default async function LevelsPage() {
    const data = await fetchByBuildingAndRoom('Library', 'fakeID');

    return (
        <div className='flex flex-col gap-6 min-h-screen mx-12 my-6'>
            <p className={'text-3xl'}>{'/ Levels'}</p>
            <div className='flex flex-col justify-center gap-3'>
                {data.map((point) => (
                    <Row
                        building={'Library'}
                        capacity={point.value}
                        key={point.time}
                        room={'fakeID'}
                    />
                ))}
            </div>
        </div>
    );
}
