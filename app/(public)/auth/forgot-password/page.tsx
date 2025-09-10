import { Metadata } from 'next';
import ForgotPasswordPage from '@/components/ForgotPasswordPage';

export const metadata: Metadata = {
    title: 'Forgot Password | Rovify',
    description: 'Reset your Rovify account password',
};

export default function ForgotPassword() {
    return <ForgotPasswordPage />;
}