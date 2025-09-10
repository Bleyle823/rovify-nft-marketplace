import { Metadata } from 'next';
import AttendeesManagementPage from '@/components/organiser-dashboard/AttendeesPage';

export const metadata: Metadata = {
    title: 'Attendees Management',
    description: 'Attendees management dashboard for organisers',
};

export default function AttendeesPage() {
    return <AttendeesManagementPage />;
}   