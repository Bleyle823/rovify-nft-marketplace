import { Metadata } from 'next';
import DAOComponent from '@/components/DAOComponent';

export const metadata: Metadata = {
    title: 'DAO',
    description: 'DAO',
};

export default function Friends() {
    return <DAOComponent />;
}   