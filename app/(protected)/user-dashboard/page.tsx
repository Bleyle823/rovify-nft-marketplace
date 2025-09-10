import DashboardPage from '@/components/user-dashboard/Dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Dashboard for users',
};

export default function UserDashboard() {
    return <DashboardPage />;
}   