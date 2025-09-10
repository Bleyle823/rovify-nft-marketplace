import { Metadata } from 'next';
import FriendsPage from '@/components/user-dashboard/FriendsPage';

export const metadata: Metadata = {
    title: 'Friends',
    description: 'Friends management dashboard for users',
};

export default function Rovers() {
    return <FriendsPage />;
}   