'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUI } from '@/context/UIContext';

interface FloatingActionManagerProps {
    children: ReactNode;
}

export default function FloatingActionManager({ children }: FloatingActionManagerProps) {
    const pathname = usePathname();
    const { setBottomNavVisible } = useUI();

    useEffect(() => {
        // Detect if the current page has its own floating action button
        const hasPageFAB = document.querySelector('[data-fab="true"]') !== null;

        // Hide bottom nav FAB if page has its own
        setBottomNavVisible(!hasPageFAB);

        // Pages that should never show the bottom nav FAB
        const fabDisabledPages = ['/create', '/checkout', '/payment'];
        const shouldDisableFAB = fabDisabledPages.some(page => pathname.includes(page));

        if (shouldDisableFAB) {
            setBottomNavVisible(false);
        }

        return () => {
            setBottomNavVisible(true);
        };
    }, [pathname, setBottomNavVisible]);

    return <>{children}</>;
}