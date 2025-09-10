import { Metadata } from 'next';
import WalletPage from '@/components/user-dashboard/UserWallet';

export const metadata: Metadata = {
    title: 'User Wallet',
    description: 'User wallet management dashboard',
};

export default function UserVault() {
    return <WalletPage />;
}   