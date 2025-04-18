import Link from 'next/link';
import {FC} from 'react';

interface RowProps {
    capacity: number;
    time: string;
}

export const Row: FC<RowProps> = ({capacity, time}) => {
    const date = new Date(time);

    return (
        <div className='flex border p-2 gap-12 items-center border-slate-200 min-h-[50px] rounded-xl justify-between'>
            <p>Capacity: {capacity}</p>
            <p>Timestamp: {date.toLocaleDateString()} {date.toLocaleTimeString()}</p>
            <Link href={'/levels/change-me'}>Click me to see route params example</Link>
        </div>
    ) 
}
