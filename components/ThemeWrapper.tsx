'use client';

import { useTheme } from '@/app/(protected)/provider/ThemeProvider';
import { ReactNode, useEffect } from 'react';

export default function ThemeWrapper({ children }: { children: ReactNode }) {
    const { theme } = useTheme();

    useEffect(() => {
        document.documentElement.classList.toggle('light-theme', theme === 'light');
    }, [theme]);

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${theme === 'dark'
                ? 'bg-gradient-to-br from-rovify-black to-black text-white'
                : 'bg-gradient-to-br from-gray-50 to-white text-gray-900'
                }`}
        >
            {children}
        </div>
    );
}