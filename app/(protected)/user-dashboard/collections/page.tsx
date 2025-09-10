import { Metadata } from 'next';
import CollectionsPage from '@/components/user-dashboard/CollectionsPage';

export const metadata: Metadata = {
    title: 'Collections',
    description: 'Collections management dashboard for users',
};

export default function CollectionsCenter() {
    return <CollectionsPage />;
}   