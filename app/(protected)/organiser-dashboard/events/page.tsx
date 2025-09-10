import { Metadata } from 'next';
import EventsManagementPage from '@/components/organiser-dashboard/EventsManagementPage';

export const metadata: Metadata = {
    title: 'Events Management',
    description: 'Events management dashboard for organisers',
};

export default function EventsManagementCenter() {
    return <EventsManagementPage />;
}   