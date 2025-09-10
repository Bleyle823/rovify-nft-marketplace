'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface UseAuthOptionsProps {
    redirectIfAuthenticated?: string;
    redirectIfUnauthenticated?: string;
}

export function useAuthOptions(
    options: UseAuthOptionsProps = {}
): ReturnType<typeof useAuth> {
    const auth = useAuth();
    const router = useRouter();

    // Handle custom redirects
    useEffect(() => {
        if (auth.isLoading) return;

        if (auth.isAuthenticated && options.redirectIfAuthenticated) {
            console.log(`🎯 AUTH: Custom redirect to ${options.redirectIfAuthenticated}`);
            router.push(options.redirectIfAuthenticated);
        } else if (!auth.isAuthenticated && options.redirectIfUnauthenticated) {
            console.log(`🎯 AUTH: Custom redirect to ${options.redirectIfUnauthenticated}`);
            router.push(options.redirectIfUnauthenticated);
        }
    }, [auth.isAuthenticated, auth.isLoading, router, options]);

    return auth;
}
