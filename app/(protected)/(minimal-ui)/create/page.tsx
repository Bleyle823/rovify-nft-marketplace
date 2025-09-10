import { Metadata } from 'next';
import CreateEventPage from '@/components/CreateEventPage';

export const metadata: Metadata = {
    title: 'Create Event',
    description: 'Create a new event with NFT tickets',
};

export default function CreateEvent() {
    return <CreateEventPage />;
}