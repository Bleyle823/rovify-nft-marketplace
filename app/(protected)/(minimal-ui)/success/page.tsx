import SuccessPage from '@/components/SuccessPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Success',
    description: 'Your action has been completed successfully.',
};

function isValidSuccessType(type: string): type is 'event' | 'ticket' | 'profile' | 'general' {
    return ['event', 'ticket', 'profile', 'general'].includes(type);
}

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Success({ searchParams }: Props) {
    const query = await searchParams;

    const typeParam = (query.type as string) || 'general';
    const type = isValidSuccessType(typeParam) ? typeParam : 'general';

    return <SuccessPage type={type} />;
}