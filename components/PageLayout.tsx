'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import SideNavigation from '@/components/SideNavigation';
import { useUI } from '@/context/UIContext';

export default function PageLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { isMobile, showSideNav, showHeader } = useUI();

    // Check if current path is an auth path
    const isAuthPath = pathname.startsWith('/auth');

    if (isAuthPath) {
        // For auth pages, render only the content without Header and SideNavigation
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <main className="flex-1">
                    {children}
                </main>
            </div>
        );
    }

    // For regular app pages, render with conditional Header and SideNavigation
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {showHeader && <Header />}

            <main className={`flex-1 container mx-auto px-4 pt-4 ${showHeader ? 'pt-20' : 'pt-4'} ${isMobile ? 'pb-24' : 'pb-8'}`}>
                {children}
            </main>

            {showSideNav && <SideNavigation isOrganiser={false} />}
        </div>
    );
}