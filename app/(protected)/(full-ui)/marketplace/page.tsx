import { Metadata } from 'next';
import Marketplace from '@/components/MarketplacePage';

export const metadata: Metadata = {
    title: 'Marketplace',
    description: 'Marketplace',
};

export default function MarketplacePage() {
    return <Marketplace />;
}   