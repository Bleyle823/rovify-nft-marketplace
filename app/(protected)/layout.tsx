/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import Image from 'next/image';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isLoading, user } = useAuth();

    useEffect(() => {
        console.log('🛡️ PROTECTED LAYOUT: Rendering with auth state -',
            isLoading ? 'Loading' : user ? 'Authenticated' : 'Unauthenticated');
    }, [isLoading, user]);

    if (isLoading) {
        console.log('🛡️ PROTECTED LAYOUT: Showing loading screen');
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-[#FF5722] to-[#FF7A50] rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                        <Image
                            src="/images/contents/rovi-logo.png"
                            alt="Rovi Logo"
                            width={48}
                            height={48}
                        />
                    </div>
                    <p className="mt-4 text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    console.log('🛡️ PROTECTED LAYOUT: Rendering protected content for user', user?.email);

    return children;
}