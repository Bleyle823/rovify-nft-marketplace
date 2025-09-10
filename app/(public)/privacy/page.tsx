import { Metadata } from 'next';
import PrivacyPolicy from '@/components/PrivacyPolicyPage';

export const metadata: Metadata = {
    title: 'Privacy Policy | Rovify',
    description: 'Privacy Policy for Rovify',
};

export default function Privacy() {
    return <PrivacyPolicy />;
}