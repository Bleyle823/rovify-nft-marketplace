import { Metadata } from 'next';
import FriendsView from '@/components/FriendsViewPage';

export const metadata: Metadata = {
    title: 'Friends',
    description: 'Find friends near you on the map',
};

export default function Friends() {
    return <FriendsView />;
}