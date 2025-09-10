import { Metadata } from 'next';
import MarketingPage from '@/components/organiser-dashboard/MarketingPage';

export const metadata: Metadata = {
    title: 'Marketing Center',
    description: 'Marketing center for organisers to manage their marketing campaigns and strategies',
};

export default function MarketingCenter() {
    return <MarketingPage />;
}   