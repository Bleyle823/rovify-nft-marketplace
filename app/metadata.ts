import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | Rovify',
        default: 'Rovify | NFT Event Ticketing'
    },
    description: 'Discover and book amazing events with NFT tickets',
    metadataBase: new URL('https://app.rovify.io'),
};