import { Metadata } from 'next';
import PaymentsPage from '@/components/organiser-dashboard/PaymentPage';

export const metadata: Metadata = {
    title: 'Payments Management',
    description: 'Payments management dashboard for organisers',
};

export default function LedgerCenter() {
    return <PaymentsPage />;
}   