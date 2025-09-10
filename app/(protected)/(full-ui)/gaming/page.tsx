import { Metadata } from 'next';
import GamingPage from '@/components/GamingPage';

export const metadata: Metadata = {
    title: 'Gaming',
    description: 'Gaming',
};

export default function Gaming() {
    return <GamingPage />;
}   