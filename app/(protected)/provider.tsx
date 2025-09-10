'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/app/(protected)/provider/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </AuthProvider>
    );
}