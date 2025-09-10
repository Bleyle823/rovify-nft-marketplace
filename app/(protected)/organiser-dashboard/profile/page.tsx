import { Metadata } from 'next';
import ProfilePage from '@/components/organiser-dashboard/ProfilePage';

export const metadata: Metadata = {
    title: 'Profile Management',
    description: 'Profile management dashboard for organisers',
};

export default function UserProfileCenter() {
    return <ProfilePage />;
}   