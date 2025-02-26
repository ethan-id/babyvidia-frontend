import Link from "next/link";

const ExampleRow = () => (
    <div className='flex border p-2 gap-12 items-center border-slate-200 min-h-[50px] rounded-xl'>
        <p className='font-bold'>Room 130a:</p>
        <p>2/4 seats available</p>
        <Link href={'/levels/change-me'}>Click me to see route params example</Link>
    </div>
);

export default async function LevelsPage() {
    return (
        <div className='flex flex-col gap-6 min-h-screen mx-12 my-6'>
            <p className={'text-3xl'}>{'/ Levels'}</p>
            <div className='flex flex-col justify-center gap-3'>
                <ExampleRow/>
                <ExampleRow/>
                <ExampleRow/>
                <ExampleRow/>
                <ExampleRow/>
                <ExampleRow/>
            </div>
        </div>
    );
}
