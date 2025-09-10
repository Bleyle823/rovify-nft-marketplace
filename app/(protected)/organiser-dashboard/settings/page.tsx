import { Metadata } from 'next';
import SettingsPage from '@/components/organiser-dashboard/SettingsPage';

export const metadata: Metadata = {
    title: 'Settings',
    description: 'Settings management dashboard for organisers',
};

export default function SettingsCenter() {
    return <SettingsPage />;
}   