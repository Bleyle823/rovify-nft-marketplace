import { Metadata } from 'next';
import TicketsPage from '@/components/organiser-dashboard/TicketsPage';

export const metadata: Metadata = {
    title: 'Tickets Management',
    description: 'Tickets management dashboard for organisers',
};

export default function TicketingCenter() {
    return <TicketsPage />;
}   