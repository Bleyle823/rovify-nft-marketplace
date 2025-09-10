import { Metadata } from 'next';
import { Suspense } from 'react';
import LoginPage from '@/components/LoginPage';

export const metadata: Metadata = {
    title: 'Login | Rovify',
    description: 'Sign in to your Rovify account',
};

export default function Login() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginPage />
        </Suspense>
    );
}