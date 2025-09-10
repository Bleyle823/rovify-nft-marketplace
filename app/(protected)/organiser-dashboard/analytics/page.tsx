import { Metadata } from 'next';
import AnalyticsPage from '@/components/organiser-dashboard/AnalyticsPage';

export const metadata: Metadata = {
    title: 'Analytics',
    description: 'Analytics dashboard for organisers',
};

export default function AnalyticsCenter() {
    return <AnalyticsPage />;
}   