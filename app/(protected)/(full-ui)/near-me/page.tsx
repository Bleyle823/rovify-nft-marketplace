import { Metadata } from 'next';
import NearbyEvents from '@/components/NearbyEventsPage';

export const metadata: Metadata = {
    title: 'Nearby Events',
    description: 'Find events near you on the map',
};

export default function NearbyEventsPage() {
    return <NearbyEvents />;
}