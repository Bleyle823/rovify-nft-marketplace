import { Ticket } from '../../types';

// Define a proper type for NFT metadata
interface NftMetadata {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
        trait_type: string;
        value: string | number | boolean;
    }>;
}

export const mockTickets: Ticket[] = [
    {
        id: '1',
        eventId: '1',
        ownerId: '1',
        type: 'VIP',
        price: 250,
        currency: 'USD',
        purchaseDate: new Date('2025-04-10T14:32:11'),
        isNft: true,
        tokenId: '12345',
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        transferable: true,
        status: 'ACTIVE',
        seatInfo: null,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TICKET-EVENT1-VIP-12345',
        metadata: {
            issuer: 'Rovify',
            edition: 'First Release',
            perks: ['Early Access', 'Merchandise', 'Backstage Pass']
        }
    },
    {
        id: '2',
        eventId: '2',
        ownerId: '1',
        type: 'PREMIUM',
        price: 599,
        currency: 'USD',
        purchaseDate: new Date('2025-03-22T09:15:43'),
        isNft: true,
        tokenId: '23456',
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        transferable: true,
        status: 'ACTIVE',
        seatInfo: null,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TICKET-EVENT2-PREMIUM-23456',
        metadata: {
            issuer: 'Rovify',
            edition: 'Limited',
            perks: ['VIP Lounge', 'Workshop Access', 'Digital Swag']
        }
    },
    {
        id: '3',
        eventId: '4',
        ownerId: '1',
        type: 'GENERAL',
        price: 25,
        currency: 'USD',
        purchaseDate: new Date('2025-05-01T16:20:09'),
        isNft: true,
        tokenId: '34567',
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        transferable: true,
        status: 'ACTIVE',
        seatInfo: null,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TICKET-EVENT4-GENERAL-34567',
        metadata: {
            issuer: 'Rovify',
            edition: 'Standard',
            perks: ['Exhibition Catalog', 'Artist Meet']
        }
    },
    {
        id: '4',
        eventId: '7',
        ownerId: '1',
        type: 'PREMIUM',
        price: 120,
        currency: 'USD',
        purchaseDate: new Date('2025-04-28T10:45:22'),
        isNft: true,
        tokenId: '45678',
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        transferable: true,
        status: 'ACTIVE',
        seatInfo: {
            section: 'Front',
            row: 'A',
            seat: '12'
        },
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TICKET-EVENT7-PREMIUM-45678',
        metadata: {
            issuer: 'Rovify',
            edition: 'Gamer',
            perks: ['Player Meet & Greet', 'Exclusive Merch']
        }
    },
    {
        id: '5',
        eventId: '5',
        ownerId: '3',
        type: 'VIP',
        price: 499,
        currency: 'USD',
        purchaseDate: new Date('2025-04-15T08:30:11'),
        isNft: true,
        tokenId: '56789',
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        transferable: true,
        status: 'ACTIVE',
        seatInfo: null,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TICKET-EVENT5-VIP-56789',
        metadata: {
            issuer: 'Rovify',
            edition: 'Crypto Whale',
            perks: ['Speaker Dinner', 'Private Networking', 'Recorded Sessions']
        }
    },
    {
        id: '6',
        eventId: '10',
        ownerId: '5',
        type: 'EARLY_BIRD',
        price: 35,
        currency: 'USD',
        purchaseDate: new Date('2025-03-05T14:12:09'),
        isNft: true,
        tokenId: '67890',
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        transferable: true,
        status: 'ACTIVE',
        seatInfo: {
            timeSlot: '2025-07-20T14:00:00'
        },
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TICKET-EVENT10-EARLY-67890',
        metadata: {
            issuer: 'Rovify',
            edition: 'First Access',
            perks: ['Skip The Line', 'Extended Sessions']
        }
    },
    {
        id: '7',
        eventId: '8',
        ownerId: '2',
        type: 'FESTIVAL_PASS',
        price: 150,
        currency: 'USD',
        purchaseDate: new Date('2025-05-02T11:05:33'),
        isNft: true,
        tokenId: '78901',
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        transferable: true,
        status: 'ACTIVE',
        seatInfo: null,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TICKET-EVENT8-FESTIVAL-78901',
        metadata: {
            issuer: 'Rovify',
            edition: 'Cinephile',
            perks: ['All Screenings', 'Director Talks', 'After Parties']
        }
    }
];

export const getUserTickets = (userId: string): Ticket[] => {
    return mockTickets.filter(ticket => ticket.ownerId === userId);
};

export const getTicketById = (id: string): Ticket | undefined => {
    return mockTickets.find(ticket => ticket.id === id);
};

export const getTicketsByEvent = (eventId: string): Ticket[] => {
    return mockTickets.filter(ticket => ticket.eventId === eventId);
};

export const verifyTicket = (ticketId: string): boolean => {
    const ticket = getTicketById(ticketId);
    return !!ticket && ticket.status === 'ACTIVE';
};

export const getNftTicketMetadata = (tokenId: string): NftMetadata | null => {
    const ticket = mockTickets.find(ticket => ticket.tokenId === tokenId);
    if (!ticket) return null;

    // Define with an index signature to allow string lookups
    const eventTypeToImage: { [key: string]: string } = {
        '1': 'https://images.unsplash.com/photo-1646267852348-1ae945b7d4d6?q=80&w=1932&auto=format&fit=crop', // Music event NFT
        '2': 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1932&auto=format&fit=crop', // Tech event NFT
        '4': 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=2070&auto=format&fit=crop', // Art event NFT
        '5': 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1932&auto=format&fit=crop', // Crypto event NFT
        '7': 'https://images.unsplash.com/photo-1636489953081-c4ebbd50fa3a?q=80&w=2071&auto=format&fit=crop', // Gaming event NFT
        '8': 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop', // Film event NFT
        '10': 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?q=80&w=2070&auto=format&fit=crop', // VR event NFT
        'default': 'https://images.unsplash.com/photo-1646267852348-1ae945b7d4d6?q=80&w=1932&auto=format&fit=crop'
    };

    const nftImage = eventTypeToImage[ticket.eventId] || eventTypeToImage.default;

    return {
        name: `Rovify Event Ticket #${ticket.tokenId}`,
        description: `Official NFT ticket for event #${ticket.eventId}`,
        image: nftImage,
        attributes: [
            { trait_type: 'Event ID', value: ticket.eventId },
            { trait_type: 'Ticket Type', value: ticket.type },
            { trait_type: 'Transferable', value: ticket.transferable ? 'Yes' : 'No' },
            ...Object.entries(ticket.metadata).map(([key, value]) => {
                return {
                    trait_type: key,
                    value: value === null ? 'N/A' : (Array.isArray(value) ? value.join(', ') : value)
                };
            })
        ]
    };
};