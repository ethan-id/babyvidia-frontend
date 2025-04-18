'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';

export default function Home() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://jetsonnano-02.ece.iastate.edu:8080/hello')
            .then((res) => res.text())
            .then((data) => setMessage(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <main className='flex flex-col gap-4 min-h-screen items-center justify-center'>
            <h1 className='text-2xl'>{message || 'Loading...'}</h1>
            <Link href={'/levels'}>Go to /levels</Link>
        </main>
    );
}
