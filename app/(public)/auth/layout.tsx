import { Metadata } from 'next';
import AuthLayoutClient from '@/components/AuthLayoutClient';

export const metadata: Metadata = {
    title: 'Authentication | Rovify',
    description: 'Sign in or create an account on Rovify',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <AuthLayoutClient>{children}</AuthLayoutClient>;
}