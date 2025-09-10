import { Metadata } from 'next';
import PreferencesPage from '@/components/user-dashboard/UserPreferences';

export const metadata: Metadata = {
    title: 'User Preferences',
    description: 'User preferences management dashboard',
};

export default function UserPreferences() {
    return <PreferencesPage />;
}   