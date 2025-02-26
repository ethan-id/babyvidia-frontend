export default async function RoomPage({params}: {params: Promise<{room: string}>}) {
    const room = (await params).room;

    return (
        <div className={'flex justify-center items-center text-4xl min-h-screen'}>
            <p>You are on on page /levels/{room}. Try modifying the last section of the URL</p>
        </div>
    );
}
