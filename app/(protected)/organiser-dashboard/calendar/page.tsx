import { Metadata } from 'next';
import Calendar from '@/components/organiser-dashboard/CalendarPage';

export const metadata: Metadata = {
    title: 'Calendar',
    description: 'Calendar management dashboard for organisers',
};

export default function CalendarPage() {
    return <Calendar />;
}   