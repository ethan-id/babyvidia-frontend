'use client';

import {InfluxPoint} from '@/types/influx';
import {BuildingAccordion} from './building-accordion';
import {Search} from './search';
import {FC, useState} from 'react';

interface BuildingsContainerProps {
    dataByBuilding: Record<string, Record<string, InfluxPoint | null>>;
}

export const BuildingsContainer: FC<BuildingsContainerProps> = ({dataByBuilding}) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter buildings based on search query
    const filteredData = Object.entries(dataByBuilding).reduce((acc, [building, roomsMap]) => {
        if (building.toLowerCase().includes(searchQuery.toLowerCase())) {
            acc[building] = roomsMap;
        }
        return acc;
    }, {} as Record<string, Record<string, InfluxPoint | null>>);

    return (
        <>
            <Search onChange={setSearchQuery} />
            {Object.keys(filteredData).length > 0 ? (
                <BuildingAccordion dataByBuilding={filteredData} />
            ) : (
                <div className='text-center text-gray-500 py-8'>
                    No buildings found matching &quot;{searchQuery}&quot;
                </div>
            )}
        </>
    );
};

