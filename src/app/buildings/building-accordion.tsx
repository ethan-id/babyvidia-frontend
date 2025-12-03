'use client';

import {Accordion, AccordionItem} from '@heroui/react';
import {InfluxPoint} from '@/types/influx';
import RoomList from './room-list';
import {FC} from 'react';
import {School} from 'lucide-react';

interface BuildingAccordionProps {
    dataByBuilding: Record<string, Record<string, InfluxPoint | null>>;
}

export const BuildingAccordion: FC<BuildingAccordionProps> = ({dataByBuilding}) => {
    return (
        <Accordion>
            {Object.entries(dataByBuilding).map(([building, roomsMap]) => (
                <AccordionItem
                    startContent={<School />}
                    key={building}
                    aria-label={building}
                    title={<span className='text-black dark:text-white text-2xl font-bold'>{building}</span>}
                    subtitle={<span className='text-sm text-gray-500'>{Object.keys(roomsMap).length} rooms</span>}
                >
                    <RoomList building={building} roomsMap={roomsMap} />
                </AccordionItem>
            ))}
        </Accordion>
    );
}
