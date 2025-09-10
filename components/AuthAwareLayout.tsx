'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/SideNavigation';

export default function AuthAwareLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    const isAuthPath = pathname.startsWith('/auth');

    if (isAuthPath) {
        return (
            <div className="flex flex-col min-h-screen">
                <main className="flex-1">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-4 pb-24">
                {children}
            </main>
            <BottomNavigation />
        </div>
    );
}