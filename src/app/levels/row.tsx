import Link from 'next/link';
import {FC} from 'react';

interface RowProps {
    building: string;
    room: string;
    capacity: number;
}

export const Row: FC<RowProps> = ({building, room, capacity}) => (
    <div className='flex border p-2 gap-12 items-center border-slate-200 min-h-[50px] rounded-xl'>
        <p className='font-bold'>{building}</p>
        <p className='font-bold'>{room}</p>
        <p>{capacity}</p>
        <Link href={'/levels/change-me'}>Click me to see route params example</Link>
    </div>
)
