import Link from 'next/link';

const jetsonBaseURL = process.env.JETSON_URL;

const fetchMessage = async () => {
    const url = new URL('/hello', jetsonBaseURL);

    try {
        const res = await fetch(url.toString());
        if (!res.ok) {
            // throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
            return null;
        }

        const data: string = await res.text();

        return data;
    } catch {
        return null;
    }
};

export default async function Home() {
    const message = await fetchMessage();

    return (
        <main className='flex flex-col gap-6 min-h-screen items-center justify-center p-4'>
            <h1 className='text-2xl'>Server status: {message ? <span className='text-green-500'>Online</span> : <span className='text-red-500'>Offline</span>}</h1>
            <Link
                href='/levels'
                className='mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700'
            >
                Go to /levels
            </Link>
        </main>
    );
}
