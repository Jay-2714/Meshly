'use client';
import { useRouter } from 'next/navigation';

export default function LandingComponent() {
    const router = useRouter();

    return (
        <div className='flex h-screen w-screen flex-col overflow-hidden justify-center items-center '>
            <h1>MESHLY</h1>
            <button
                className='flex items-center justify-center _3d w-48 h-12 bg-blueColor text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blueColor transition-colors duration-300    '
                onClick={() => router.push('/home')}
            >
                GET STARTED
            </button>
        </div>
    );
}