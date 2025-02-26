export default async function RoomPage({params}: {params: Promise<{room: string}>}) {
    const room = (await params).room;

    return (
        <div className={'flex flex-col gap-3 font-bold justify-center items-center text-2xl min-h-screen'}>
            <p>You are on route</p>
            <p className='font-light italic'>/levels/{room},</p>
            <p>try modifying the URL</p>
            <p className={'font-extralight text-sm italic'}>(After &ldquo;/levels/&ldquo;)</p>
        </div>
    );
}
