import { Metadata } from 'next';
import ReportsPage from '@/components/organiser-dashboard/ReportsPage';

export const metadata: Metadata = {
    title: 'Reports Management',
    description: 'Reports management dashboard for organisers',
};

export default function ReportsCenter() {
    return <ReportsPage />;
}   