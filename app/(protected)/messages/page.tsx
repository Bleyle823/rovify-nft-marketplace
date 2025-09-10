import { Metadata } from 'next';
import EchoCenter from '@/components/EchoCenter';

export const metadata: Metadata = {
    title: 'Rovy Echo',
    description: 'Marketplace',
};

export default function MarketplacePage() {
    return <EchoCenter />;
}   