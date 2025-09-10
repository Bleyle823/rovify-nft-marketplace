import { Metadata } from 'next';
import WalletPage from '@/components/organiser-dashboard/WalletPage';

export const metadata: Metadata = {
    title: 'Wallet',
    description: 'Wallet management dashboard for organisers',
};

export default function WalletCenter() {
    return <WalletPage />;
}   