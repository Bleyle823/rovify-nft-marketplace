import { Metadata } from 'next';
import AnalyticsPage from '@/components/user-dashboard/AnalyticsPage';

export const metadata: Metadata = {
    title: 'Analytics',
    description: 'Analytics dashboard for users',
};

export default function AnalyticsCenter() {
    return <AnalyticsPage />;
}   