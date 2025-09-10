import { Metadata } from 'next';
import ProfilePage from '@/components/user-dashboard/ProfilePage';

export const metadata: Metadata = {
    title: 'User Profile',
    description: 'User profile management dashboard',
};

export default function ProfileCenter() {
    return <ProfilePage />;
}   