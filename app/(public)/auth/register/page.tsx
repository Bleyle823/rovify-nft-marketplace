import { Metadata } from 'next';
import RegisterPage from '@/components/RegisterPage';

export const metadata: Metadata = {
    title: 'Signup | Rovify',
    description: 'Sign up for your Rovify account',
};

export default function Register() {
    return <RegisterPage />;
}