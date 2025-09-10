import { Metadata } from 'next';
import DiscoverPage from '@/components/DiscoverPage';

export const metadata: Metadata = {
    title: 'Discover Events',
    description: 'Find events near you on the map',
};

export default function Discover() {
    return <DiscoverPage />;
}