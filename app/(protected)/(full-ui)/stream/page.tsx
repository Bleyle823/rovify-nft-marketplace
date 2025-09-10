import { Metadata } from 'next';
import StreamsPage from '@/components/StreamPage';

export const metadata: Metadata = {
    title: 'Streams',
    description: 'Find streams near you on the map',
};

export default function Streams() {
    return <StreamsPage />;
}