import { Metadata } from 'next';
import TermsPage from '@/components/TermsPage';

export const metadata: Metadata = {
    title: 'Terms of Service | Rovify',
    description: 'Terms of Service for Rovify',
};

export default function Terms() {
    return <TermsPage />;
}