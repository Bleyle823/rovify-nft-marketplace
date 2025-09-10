import { Metadata } from 'next';
import Feed from '@/components/FeedPage';

export const metadata: Metadata = {
    title: 'Feed',
    description: 'Feed',
};

export default function FeedPage() {
    return <Feed />;
}   