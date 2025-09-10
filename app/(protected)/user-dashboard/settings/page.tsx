import { Metadata } from 'next';
import SettingsPage from '@/components/user-dashboard/UserSettings';

export const metadata: Metadata = {
    title: 'User Account Settings',
    description: 'User account settings management dashboard',
};

export default function SettingsCenter() {
    return <SettingsPage />;
}   