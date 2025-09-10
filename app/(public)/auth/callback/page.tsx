import { Metadata } from 'next';
import { Suspense } from 'react';
import GoogleAuthCallbackPage from '@/components/GoogleAuthCallbackPage';

export const metadata: Metadata = {
    title: 'Google Auth Callback | Rovify',
    description: 'Google authentication callback for Rovify',
};

export default function GoogleAuthCallback() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <GoogleAuthCallbackPage />
        </Suspense>
    );
}