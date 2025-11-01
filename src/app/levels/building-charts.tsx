import {InfluxPoint} from '@/types/influx';
import {FC} from 'react';
import RoomChart from './room-chart';

interface Props {
    roomsMap: Record<string, InfluxPoint[]>;
}

export const BuildingCharts: FC<Props> = ({roomsMap}) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {Object.entries(roomsMap).map(([room, points]) =>
                points?.length > 0 ? (
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
                        Room {room}: No data recently
                    </p>
                )
            )}
        </div>
    );
};
