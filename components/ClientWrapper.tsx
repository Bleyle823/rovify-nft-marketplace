'use client';

import dynamic from 'next/dynamic';

const DynamicHomePage = dynamic(() => import('@/components/HomePage'), {
    ssr: false,
    loading: () => (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-rovify-lavender rounded-full border-t-transparent"></div>
        </div>
    )
});

export default function ClientWrapper() {
    return <DynamicHomePage />;
}