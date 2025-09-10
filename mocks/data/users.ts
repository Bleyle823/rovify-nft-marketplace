import { User } from '../../types';

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'Joe RKND',
        username: 'alexr',
        email: 'alex.rivera@example.com',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop',
        bio: 'Tech enthusiast and concert lover. Always looking for the next big event!',
        interests: ['MUSIC', 'TECHNOLOGY', 'GAMING'],
        followers: 342,
        following: 156,
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        savedEvents: ['1', '4', '7'],
        attendedEvents: ['2', '5', '9'],
        createdEvents: [],
        preferences: {
            notificationTypes: ['REMINDER', 'FRIEND_GOING', 'PRICE_DROP'],
            locationRadius: 25,
            currency: 'USD'
        },
        verified: true
    },
    {
        id: '2',
        name: 'Sophia Chen',
        username: 'sophiac',
        email: 'sophia.chen@example.com',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
        bio: 'Foodie and art lover. I curate experiences worth sharing.',
        interests: ['ART', 'FOOD', 'WELLNESS'],
        followers: 578,
        following: 231,
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        savedEvents: ['3', '6', '8'],
        attendedEvents: ['1', '4', '10'],
        createdEvents: [],
        preferences: {
            notificationTypes: ['REMINDER', 'NEW_EVENT'],
            locationRadius: 10,
            currency: 'USD'
        },
        verified: true
    },
    {
        id: '3',
        name: 'Marcus Johnson',
        username: 'mjohnson',
        email: 'marcus.johnson@example.com',
        image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop',
        bio: 'Blockchain developer and crypto enthusiast. Building the future of finance.',
        interests: ['CONFERENCE', 'TECHNOLOGY', 'FINANCE'],
        followers: 1204,
        following: 342,
        walletAddress: '0x7890abcdef1234567890abcdef1234567890abcd',
        savedEvents: ['2', '5', '10'],
        attendedEvents: ['1', '4', '9'],
        createdEvents: [],
        preferences: {
            notificationTypes: ['REMINDER', 'FRIEND_GOING', 'NEW_EVENT'],
            locationRadius: 50,
            currency: 'USD'
        },
        verified: true
    },
    {
        id: '4',
        name: 'Olivia Martinez',
        username: 'oliviam',
        email: 'olivia.martinez@example.com',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
        bio: 'Film director and cinema buff. Always searching for visual inspiration.',
        interests: ['FILM', 'ART', 'MUSIC'],
        followers: 876,
        following: 234,
        walletAddress: '0xdef1234567890abcdef1234567890abcdef123456',
        savedEvents: ['4', '8', '10'],
        attendedEvents: ['2', '5', '7'],
        createdEvents: [],
        preferences: {
            notificationTypes: ['REMINDER', 'PRICE_DROP'],
            locationRadius: 30,
            currency: 'USD'
        },
        verified: false
    },
    {
        id: '5',
        name: 'Jordan Taylor',
        username: 'jtaylor',
        email: 'jordan.taylor@example.com',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop',
        bio: 'Professional gamer and esports commentator. Level up your life!',
        interests: ['GAMING', 'TECHNOLOGY', 'CONFERENCE'],
        followers: 3456,
        following: 187,
        walletAddress: '0x567890abcdef1234567890abcdef1234567890ab',
        savedEvents: ['1', '7', '10'],
        attendedEvents: ['3', '6', '8'],
        createdEvents: [],
        preferences: {
            notificationTypes: ['REMINDER', 'FRIEND_GOING', 'NEW_EVENT', 'PRICE_DROP'],
            locationRadius: 100,
            currency: 'USD'
        },
        verified: true
    }
];

export const getCurrentUser = (): User => {
    return mockUsers[0]; // Returns Joe RKND as current user
};

export const getUserById = (id: string): User | undefined => {
    return mockUsers.find(user => user.id === id);
};

export const getUsersByEvent = (eventId: string): User[] => {
    return mockUsers.filter(user =>
        user.savedEvents.includes(eventId) ||
        user.attendedEvents.includes(eventId)
    );
};

export const getFriendsGoingToEvent = (eventId: string, userId: string): User[] => {
    // In a real app, we'd have a friends table/relation
    // For mock purposes, let's assume all users are friends
    const currentUser = getUserById(userId);
    if (!currentUser) return [];

    return mockUsers.filter(user =>
        user.id !== userId &&
        (user.savedEvents.includes(eventId) || user.attendedEvents.includes(eventId))
    );
};