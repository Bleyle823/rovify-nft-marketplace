import { Metadata } from 'next';
import Dashboard from '@/components/organiser-dashboard/Dashboard';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Dashboard for organisers',
};

export default function OrganiserDashboard() {
    return <Dashboard />;
}   