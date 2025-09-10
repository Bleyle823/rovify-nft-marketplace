'use client';

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import RoviLogo from '@/public/images/contents/rovi-logo.png';
import ClientWrapper from '@/components/ClientWrapper';
import { useEffect } from 'react';

export default function Home() {
    const { isLoading, user } = useAuth();

    useEffect(() => {
        console.log('🏠 HOME PAGE: Rendering with auth state -',
            isLoading ? 'Loading' : user ? 'Authenticated' : 'Unauthenticated');
    }, [isLoading, user]);

    if (isLoading) {
        console.log('🏠 HOME PAGE: Showing loading screen');
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-[#FF5722] to-[#FF7A50] rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                        <Image
                            src={RoviLogo}
                            alt="Rovify Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <p className="mt-4 text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    console.log('🏠 HOME PAGE: Rendering client wrapper for user', user?.email);
    return <ClientWrapper />;
}