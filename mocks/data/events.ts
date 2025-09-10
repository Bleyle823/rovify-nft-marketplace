import { Event } from '../../types';

export const mockEvents: Event[] = [
    {
        id: '1',
        title: 'Neon Nights: Electronic Music Festival',
        description: 'Experience the ultimate electronic music festival with world-class DJs and immersive visual experiences in the heart of downtown.',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
        date: new Date('2025-06-15T20:00:00'),
        endDate: new Date('2025-06-16T04:00:00'),
        location: {
            name: 'Metropolis Amphitheater',
            address: '123 Main Street, Downtown',
            city: 'Metropolis',
            coordinates: { lat: 40.7128, lng: -74.006 }
        },
        organiser: {
            id: '1',
            name: 'Electric Dreams Productions',
            image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2070&auto=format&fit=crop',
            verified: true
        },
        category: 'MUSIC',
        subcategory: 'Electronic',
        price: {
            min: 75,
            max: 250,
            currency: 'USD',
            amount: 0
        },
        hasNftTickets: true,
        totalTickets: 2000,
        soldTickets: 1200,
        tags: ['electronic', 'music', 'festival', 'nightlife'],
        attendees: ['2', '3', '5', '7'],
        likes: 342,
        comments: 56,
        shares: 89,
        venue: undefined,
        imageUrl: undefined,
        popularity: undefined
    },
    {
        id: '2',
        title: 'Tech Summit 2025',
        description: 'Join industry leaders and innovators for the biggest tech conference of the year. Network, learn, and discover the latest advancements.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
        date: new Date('2025-07-10T09:00:00'),
        endDate: new Date('2025-07-12T18:00:00'),
        location: {
            name: 'Innovation Center',
            address: '500 Technology Parkway',
            city: 'Silicon Heights',
            coordinates: { lat: 37.7749, lng: -122.4194 }
        },
        organiser: {
            id: '2',
            name: 'Future Forward Inc.',
            image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2081&auto=format&fit=crop',
            verified: true
        },
        category: 'CONFERENCE',
        subcategory: 'Technology',
        price: {
            min: 299,
            max: 999,
            currency: 'USD',
            amount: 0
        },
        hasNftTickets: true,
        totalTickets: 5000,
        soldTickets: 3750,
        tags: ['technology', 'innovation', 'networking', 'conference'],
        attendees: ['1', '4', '6', '8'],
        likes: 520,
        comments: 148,
        shares: 276,
        venue: undefined,
        imageUrl: undefined,
        popularity: undefined
    },
    {
        id: '3',
        title: 'Culinary Masterclass',
        description: 'Learn the secrets of gourmet cooking from world-renowned chefs in this hands-on masterclass with premium ingredients and techniques.',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop',
        date: new Date('2025-05-25T11:00:00'),
        endDate: new Date('2025-05-25T15:00:00'),
        location: {
            name: 'Gourmet Academy',
            address: '45 Flavor Street',
            city: 'Culinary Heights',
            coordinates: { lat: 34.0522, lng: -118.2437 }
        },
        organiser: {
            id: '3',
            name: 'Elite Dining Experiences',
            image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1954&auto=format&fit=crop',
            verified: false
        },
        category: 'WORKSHOP',
        subcategory: 'Cooking',
        price: {
            min: 150,
            max: 150,
            currency: 'USD',
            amount: 0
        },
        hasNftTickets: false,
        totalTickets: 30,
        soldTickets: 26,
        tags: ['cooking', 'food', 'masterclass', 'gourmet'],
        attendees: ['2', '5', '9'],
        likes: 87,
        comments: 23,
        shares: 14,
        venue: undefined,
        imageUrl: undefined,
        popularity: undefined
    },
    {
        id: '4',
        title: 'Urban Art Exhibition',
        description: 'Discover the vibrant world of street art with this curated exhibition featuring local and international artists pushing boundaries.',
        image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1972&auto=format&fit=crop',
        date: new Date('2025-06-05T10:00:00'),
        endDate: new Date('2025-07-05T19:00:00'),
        location: {
            name: 'Metropolitan Gallery',
            address: '78 Canvas Street',
            city: 'Artville',
            coordinates: { lat: 51.5074, lng: -0.1278 }
        },
        organiser: {
            id: '4',
            name: 'Contemporary Arts Collective',
            image: 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=1932&auto=format&fit=crop',
            verified: true
        },
        category: 'ART',
        subcategory: 'Exhibition',
        price: {
            min: 15,
            max: 25,
            currency: 'USD',
            amount: 0
        },
        hasNftTickets: true,
        totalTickets: 1000,
        soldTickets: 450,
        tags: ['art', 'exhibition', 'urban', 'contemporary'],
        attendees: ['1', '3', '7', '10'],
        likes: 215,
        comments: 47,
        shares: 83,
        venue: undefined,
        imageUrl: undefined,
        popularity: undefined
    },
    {
        id: '5',
        title: 'Crypto & DeFi Symposium',
        description: 'Navigate the future of finance with experts in blockchain, cryptocurrency, and decentralized finance at this exclusive event.',
        image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2070&auto=format&fit=crop',
        date: new Date('2025-08-20T13:00:00'),
        endDate: new Date('2025-08-21T18:00:00'),
        location: {
            name: 'Blockchain Center',
            address: '256 Hash Avenue',
            city: 'Cryptopia',
            coordinates: { lat: 25.7617, lng: -80.1918 }
        },
        organiser: {
            id: '5',
            name: 'Decentralized Futures',
            image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=1974&auto=format&fit=crop',
            verified: true
        },
        category: 'CONFERENCE',
        subcategory: 'Finance',
        price: {
            min: 199,
            max: 599,
            currency: 'USD',
            amount: 0
        },
        hasNftTickets: true,
        totalTickets: 1500,
        soldTickets: 950,
        tags: ['crypto', 'blockchain', 'defi', 'finance', 'web3'],
        attendees: ['2', '4', '6', '8'],
        likes: 412,
        comments: 97,
        shares: 156,
        venue: undefined,
        imageUrl: undefined,
        popularity: undefined
    },
    {
        id: '6',
        title: 'Mindfulness Retreat',
        description: 'Escape the daily grind with this weekend wellness retreat featuring meditation, yoga, and holistic health practices in nature.',
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070&auto=format&fit=crop',
        date: new Date('2025-09-10T08:00:00'),
        endDate: new Date('2025-09-12T16:00:00'),
        location: {
            name: 'Serenity Gardens',
            address: '108 Zen Path',
            city: 'Tranquil Valley',
            coordinates: { lat: 39.7392, lng: -104.9903 }
        },
        organiser: {
            id: '6',
            name: 'Harmonious Living',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop',
            verified: false
        },
        category: 'WELLNESS',
        subcategory: 'Retreat',
        price: {
            min: 350,
            max: 650,
            currency: 'USD',
            amount: 0
        },
        hasNftTickets: false,
        totalTickets: 50,
        soldTickets: 32,
        tags: ['wellness', 'meditation', 'yoga', 'retreat', 'mindfulness'],
        attendees: ['3', '5', '9'],
        likes: 176,
        comments: 41,
        shares: 28,
        venue: undefined,
        imageUrl: undefined,
        popularity: undefined
    },
    {
        id: '7',
        title: 'eSports Championship Finals',
        description: 'Witness the ultimate gaming showdown as top teams compete for glory and massive prizes in this electrifying championship.',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
        date: new Date('2025-07-25T12:00:00'),
        endDate: new Date('2025-07-25T22:00:00'),
        location: {
            name: 'Digital Arena',
            address: '1337 Gamer Boulevard',
            city: 'Pixel City',
            coordinates: { lat: 47.6062, lng: -122.3321 }
        },
        organiser: {
            id: '7',
            name: 'Pro Gaming League',
            image: 'https://images.unsplash.com/photo-1548344840-6d3df8c76de7?q=80&w=2070&auto=format&fit=crop',
            verified: true
        },
        category: 'GAMING',
        subcategory: 'eSports',
        price: {
            min: 45,
            max: 120,
            currency: 'USD',
            amount: 0
        },
        hasNftTickets: true,
        totalTickets: 3000,
        soldTickets: 2700,
        tags: ['gaming', 'esports', 'tournament', 'championship'],
        attendees: ['1', '4', '8', '10'],
        likes: 890,
        comments: 320,
        shares: 415,
        venue: undefined,
        imageUrl: undefined,
        popularity: undefined
    },
    {
        id: '8',
        title: 'Indie Film Festival',
        description: 'Celebrate independent cinema with screenings, director Q&As, and workshops showcasing the next generation of filmmaking talent.',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop',
        date: new Date('2025-08-05T10:00:00'),
        endDate: new Date('2025-08-10T23:00:00'),
        location: {
            name: 'Cinematheque',
            address: '24 Frame Lane',
            city: 'Filmville',
            coordinates: { lat: 34.0522, lng: -118.2437 }
        },
        organiser: {
            id: '8',
            name: 'Independent Cinema Collective',
            image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop',
            verified: true
        },
        category: 'FILM',
        subcategory: 'Festival',
        price: {
            min: 30,
            max: 150,
            currency: 'USD',
            amount: 0
        },
        hasNftTickets: true,
        totalTickets: 2500,
        soldTickets: 1100,
        tags: ['film', 'cinema', 'festival', 'independent', 'movies'],
        attendees: ['2', '5', '7', '9'],
        likes: 310,
        comments: 86,
        shares: 124,
        venue: undefined,
        imageUrl: undefined,
        popularity: undefined
    },
    {
        id: '9',
        title: 'Vintage Car Show',
        description: 'Marvel at pristine classic automobiles from the golden age of motoring at this prestigious exhibition of vintage vehicles.',
        image: 'https://images.unsplash.com/photo-1591293835940-934a7c4f2d9b?q=80&w=2000&auto=format&fit=crop',
        date: new Date('2025-06-28T09:00:00'),
        endDate: new Date('2025-06-29T17:00:00'),
        location: {
            name: 'Heritage Motor Park',
            address: '1955 Classic Drive',
            city: 'Motorville',
            coordinates: { lat: 42.3601, lng: -71.0589 }
        },
        organiser: {
            id: '9',
            name: 'Classic Automobile Society',
            image: 'https://images.unsplash.com/photo-1596609548086-85bbf8ddb6b9?q=80&w=1970&auto=format&fit=crop',
            verified: false
        },
        category: 'AUTOMOTIVE',
        subcategory: 'Exhibition',
        price: {
            min: 25,
            max: 40,
            currency: 'USD',
            amount: 0
        },
        hasNftTickets: false,
        totalTickets: 1200,
        soldTickets: 850,
        tags: ['cars', 'vintage', 'automotive', 'exhibition'],
        attendees: ['1', '3', '6'],
        likes: 245,
        comments: 52,
        shares: 73,
        venue: undefined,
        imageUrl: undefined,
        popularity: undefined
    },
    {
        id: '10',
        title: 'Immersive Virtual Reality Experience',
        description: 'Step into the future with cutting-edge VR technology offering mind-bending interactive experiences across multiple virtual worlds.',
        image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=2012&auto=format&fit=crop',
        date: new Date('2025-07-15T10:00:00'),
        endDate: new Date('2025-09-15T20:00:00'),
        location: {
            name: 'Future Reality Center',
            address: '404 Virtual Avenue',
            city: 'Neo Metropolis',
            coordinates: { lat: 37.7749, lng: -122.4194 }
        },
        organiser: {
            id: '10',
            name: 'Immersive Technologies',
            image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?q=80&w=1974&auto=format&fit=crop',
            verified: true
        },
        category: 'TECHNOLOGY',
        subcategory: 'Virtual Reality',
        price: {
            min: 35,
            max: 60,
            currency: 'USD',
            amount: 0
        },
        hasNftTickets: true,
        totalTickets: 4000,
        soldTickets: 2100,
        tags: ['vr', 'technology', 'immersive', 'experience', 'virtual reality'],
        attendees: ['2', '4', '7', '9'],
        likes: 615,
        comments: 183,
        shares: 267,
        venue: undefined,
        imageUrl: undefined,
        popularity: undefined
    }
];

export const getEventById = (id: string): Event | undefined => {
    return mockEvents.find(event => event.id === id);
};

export const getEventsByCategory = (category: string): Event[] => {
    return mockEvents.filter(event => event.category === category.toUpperCase());
};

export const getUpcomingEvents = (): Event[] => {
    const now = new Date();
    return mockEvents
        .filter(event => new Date(event.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getTrendingEvents = (): Event[] => {
    return [...mockEvents]
        .sort((a, b) => (b.likes + b.shares) - (a.likes + a.shares))
        .slice(0, 5);
};

export const getNftEvents = (): Event[] => {
    return mockEvents.filter(event => event.hasNftTickets);
};