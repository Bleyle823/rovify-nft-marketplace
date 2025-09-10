import { Metadata } from 'next';
import ProfilePage from '@/components/ProfilePage';

export const metadata: Metadata = {
    title: 'My Profile',
    description: 'Manage your profile, events, and tickets',
};

export default function Profile() {
    return <ProfilePage />;
}