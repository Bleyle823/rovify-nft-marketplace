import { Metadata } from 'next';
import TicketsPage from '@/components/TicketsPage';

export const metadata: Metadata = {
    title: 'My Tickets',
    description: 'Your NFT tickets and event passes',
};

export default function Tickets() {
    return <TicketsPage />;
}