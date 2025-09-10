import { Metadata } from 'next';
import HistoryPage from '@/components/user-dashboard/HistoryPage';

export const metadata: Metadata = {
    title: 'History',
    description: 'History management dashboard for users',
};

export default function HistoryCenter() {
    return <HistoryPage />;
}   