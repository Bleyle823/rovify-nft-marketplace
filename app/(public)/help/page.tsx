import { Metadata } from 'next';
import FAQPage from '@/components/FAQPage';

export const metadata: Metadata = {
    title: 'Help Center | Rovify',
    description: 'Help Center for Rovify',
};

export default function Help() {
    return <FAQPage />;
}