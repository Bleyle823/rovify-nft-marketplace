'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export function useDebugAuth() {
    const auth = useAuth();

    useEffect(() => {
        console.log('🔍 DEBUG AUTH STATUS:', {
            authenticated: !!auth.user,
            isLoading: auth.isLoading,
            user: auth.user ? {
                id: auth.user.id,
                email: auth.user.email,
                name: auth.user.name
            } : null
        });
    }, [auth.user, auth.isLoading]);

    return auth;
}