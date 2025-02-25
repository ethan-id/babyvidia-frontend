import React, {Suspense} from 'react';

const fakeFetchExample = async () => {
    return new Promise((resolve) => {
        setTimeout(resolve, 2500, 'test');
    });
};

// Async component that fetches and renders data
async function HomeContent() {
    const data = await fakeFetchExample();

    return <div className='m-24 text-center text-3xl'>{JSON.stringify(data)}</div>;
}

// Main page component wrapped in Suspense
export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HomeContent />
        </Suspense>
    );
}
