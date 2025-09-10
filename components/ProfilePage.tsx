/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiUser, FiCreditCard, FiSettings, FiSliders, FiUsers, FiArchive,
    FiBarChart, FiAward, FiBookmark, FiShield, FiEdit2, FiLogOut,
    FiCheck, FiX, FiCalendar, FiMessageSquare, FiClock, FiAlertCircle,
    FiRefreshCcw, FiExternalLink, FiCopy, FiArrowRight, FiBell,
    FiHeart, FiLink, FiUpload, FiCamera, FiZap, FiTrendingUp,
    FiStar, FiEye, FiUserPlus, FiUserCheck, FiUserX, FiDownload,
    FiGrid, FiList, FiFilter, FiSearch, FiMoreHorizontal, FiHome,
    FiChevronRight, FiChevronLeft, FiMenu, FiPlus, FiMinus, FiEyeOff,
    FiLock, FiUnlock, FiMapPin, FiGlobe, FiMail, FiPhone, FiLinkedin,
    FiTwitter, FiInstagram, FiGithub, FiSave, FiTrash2, FiShare2,
    FiMoon, FiSun, FiWifi, FiWifiOff, FiVolume2, FiVolumeX, FiMic,
    FiMicOff, FiVideo, FiVideoOff, FiFileText, FiPieChart, FiActivity,
    FiDollarSign, FiSend, FiArrowUp, FiArrowDown, FiPlay, FiPause,
    FiSkipForward, FiRepeat, FiShuffle, FiTarget, FiTrendingDown,
    FiLoader, FiRotateCcw, FiLayers, FiDatabase, FiServer, FiHardDrive
} from 'react-icons/fi';
import { FaBell, FaEthereum, FaCamera, FaDiscord, FaTelegramPlane, FaBitcoin, FaSpotify, FaApple } from "react-icons/fa";
import { IoTicket, IoSparkles, IoClose, IoFlash, IoTrendingUp, IoWallet, IoGift } from "react-icons/io5";
import RoviLogo from '@/public/images/contents/rovi-logo.png';

// Enhanced Theme with more sophisticated colors
const theme = {
    colors: {
        primary: '#FF5722',
        primaryDark: '#E64A19',
        primaryLight: '#FF8A65',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        surfaceHover: '#F8F9FA',
        text: {
            primary: '#1A1A1A',
            secondary: '#666666',
            muted: '#999999'
        },
        border: '#E5E5E5',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        ethereum: '#627EEA',
        bitcoin: '#F7931A',
        gradient: {
            primary: 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)',
            success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            info: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
        }
    }
};

// Rich Mock Data
const mockUser = {
    id: 'user1',
    name: 'Joe Love',
    username: 'joe_rover',
    email: 'alex@rovify.io',
    phone: '+250 782 650-383',
    bio: 'Event enthusiast and community builder. Always seeking memorable experiences to share with friends.',
    location: 'San Francisco, CA',
    website: 'https://joe_roverohnson.dev',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=300&fit=crop',
    verified: true,
    level: 'Gold',
    levelProgress: 75,
    points: 2840,
    followers: 1234,
    following: 456,
    eventsAttended: 28,
    totalSpent: 4250,
    interests: ['Music', 'Tech', 'Art', 'Food', 'Travel', 'Crypto', 'Sports'],
    joinedDate: '2023-01-15',
    lastActive: new Date().toISOString(),
    streakDays: 12,
    socialLinks: {
        twitter: '@joe_roverohnson',
        linkedin: 'alex-johnson-dev',
        instagram: 'joe_rover_events',
        github: 'joe_roverohnson'
    },
    preferences: {
        notifications: {
            email: true,
            push: true,
            sms: false,
            eventReminders: true,
            friendActivity: true,
            promotions: false
        },
        privacy: {
            profileVisibility: 'public',
            showLocation: true,
            showEvents: true,
            allowMessages: 'friends'
        },
        display: {
            theme: 'light',
            language: 'en',
            timezone: 'PST',
            dateFormat: 'MM/DD/YYYY'
        }
    }
};

const mockFriends = [
    {
        id: '1',
        name: 'Joe Rover',
        username: 'sarahc',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b88e1f9d?w=50&h=50&fit=crop&crop=face',
        status: 'online',
        mutualEvents: 5,
        lastMessage: 'See you at the tech conference!',
        messageTime: '2m ago',
        isOnline: true
    },
    {
        id: '2',
        name: 'Marcus Reid',
        username: 'marcus',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        status: 'offline',
        mutualEvents: 3,
        lastMessage: 'Thanks for the event rec!',
        messageTime: '1h ago',
        isOnline: false
    },
    {
        id: '3',
        name: 'Emma Wilson',
        username: 'emmaw',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        status: 'online',
        mutualEvents: 8,
        lastMessage: 'Let\'s go to that music festival together',
        messageTime: '30m ago',
        isOnline: true
    }
];

const mockFriendRequests = [
    {
        id: '1',
        name: 'David Park',
        username: 'davidp',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
        mutualFriends: 3,
        requestTime: '2 hours ago',
        bio: 'Tech enthusiast and startup founder'
    },
    {
        id: '2',
        name: 'Lisa Thompson',
        username: 'lisat',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop&crop=face',
        mutualFriends: 1,
        requestTime: '1 day ago',
        bio: 'Event photographer and travel blogger'
    }
];

const mockEventHistory = [
    {
        id: '1',
        title: 'Tech Summit 2024',
        date: '2024-11-15',
        endDate: '2024-11-17',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
        status: 'attended',
        rating: 5,
        spent: 299,
        category: 'Tech',
        location: 'San Francisco, CA',
        ticketType: 'VIP',
        description: 'Amazing conference with industry leaders',
        friendsAttended: ['Joe Rover', 'Marcus Reid'],
        highlights: ['Networking', 'Keynote Speeches', 'Workshop'],
        checkInTime: '9:00 AM',
        photos: 12
    },
    {
        id: '2',
        title: 'Jazz Night Downtown',
        date: '2024-10-28',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        status: 'attended',
        rating: 4,
        spent: 85,
        category: 'Music',
        location: 'Downtown Jazz Club',
        ticketType: 'General',
        description: 'Intimate jazz performance',
        friendsAttended: ['Emma Wilson'],
        highlights: ['Live Music', 'Great Atmosphere'],
        checkInTime: '8:30 PM',
        photos: 5
    },
    {
        id: '3',
        title: 'Food & Wine Festival',
        date: '2024-09-20',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
        status: 'cancelled',
        rating: 0,
        spent: 0,
        category: 'Food',
        location: 'Napa Valley',
        ticketType: 'Premium',
        description: 'Cancelled due to weather',
        friendsAttended: [],
        refunded: true
    }
];

const mockWalletData = {
    address: '0x742d35Cc6565C42cAA5b8e8a8b02b9eF3D5d2D8B',
    balance: {
        eth: 2.4567,
        usd: 4250.30,
        btc: 0.0123
    },
    portfolio: [
        { symbol: 'ETH', name: 'Ethereum', amount: 2.4567, value: 4250.30, change: 5.2, logo: '/crypto/eth.png' },
        { symbol: 'BTC', name: 'Bitcoin', amount: 0.0123, value: 650.20, change: -2.1, logo: '/crypto/btc.png' },
        { symbol: 'USDC', name: 'USD Coin', amount: 500, value: 500.00, change: 0.0, logo: '/crypto/usdc.png' }
    ],
    transactions: [
        {
            id: '1',
            type: 'event_purchase',
            amount: '-0.15 ETH',
            usdValue: '-$260.50',
            event: 'Tech Summit 2024',
            date: '2024-11-15',
            status: 'completed',
            hash: '0xabc123...',
            gasUsed: '21000'
        },
        {
            id: '2',
            type: 'deposit',
            amount: '+1.0 ETH',
            usdValue: '+$1,735.50',
            event: 'Wallet Top-up',
            date: '2024-11-10',
            status: 'completed',
            hash: '0xdef456...',
            gasUsed: '21000'
        },
        {
            id: '3',
            type: 'friend_transfer',
            amount: '-0.05 ETH',
            usdValue: '-$86.75',
            event: 'Sent to @sarahc',
            date: '2024-11-08',
            status: 'completed',
            hash: '0x789xyz...',
            gasUsed: '21000'
        }
    ],
    recentActivity: [
        { action: 'Received NFT ticket', event: 'Tech Summit 2024', time: '2 hours ago', type: 'nft' },
        { action: 'Staked 1.5 ETH', event: 'Ethereum 2.0', time: '1 day ago', type: 'defi' },
        { action: 'Swapped 0.1 BTC → ETH', event: 'DEX Trade', time: '3 days ago', type: 'swap' }
    ]
};

const mockAnalytics = {
    spending: {
        thisMonth: 245,
        lastMonth: 180,
        yearTotal: 2840,
        categories: [
            { name: 'Music', amount: 120, events: 3, color: '#8B5CF6', trend: 15 },
            { name: 'Tech', amount: 85, events: 2, color: '#3B82F6', trend: -5 },
            { name: 'Food', amount: 40, events: 1, color: '#10B981', trend: 25 }
        ]
    },
    attendance: {
        thisYear: 28,
        lastYear: 22,
        totalHours: 156,
        monthlyData: [2, 3, 1, 4, 2, 3, 4, 2, 3, 2, 1, 3],
        categoryBreakdown: {
            'Music': 12,
            'Tech': 8,
            'Food': 4,
            'Art': 3,
            'Sports': 1
        }
    },
    social: {
        newFriends: 12,
        eventsWithFriends: 18,
        invitesSent: 25,
        invitesReceived: 15,
        networkGrowth: 8.5
    },
    insights: [
        'You spend 40% more on weekend events',
        'Your favorite event time is 7-9 PM',
        'You attend 60% more events with friends',
        'Tech events have your highest satisfaction rating'
    ]
};

const mockUpcomingEvents = [
    {
        id: 'upcoming1',
        title: 'AI & Machine Learning Summit',
        date: '2025-01-15',
        time: '9:00 AM',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        location: 'Convention Center',
        ticketType: 'Early Bird',
        price: 199,
        daysUntil: 25,
        reminder: true
    },
    {
        id: 'upcoming2',
        title: 'Electronic Music Festival',
        date: '2025-02-02',
        time: '6:00 PM',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
        location: 'Outdoor Venue',
        ticketType: 'General',
        price: 89,
        daysUntil: 43,
        reminder: false
    }
];

const mockRecentActivity = [
    { id: '1', type: 'event_joined', user: 'Joe Rover', event: 'AI Summit', time: '10 min ago', icon: FiCalendar },
    { id: '2', type: 'friend_added', user: 'Marcus Reid', event: '', time: '1 hour ago', icon: FiUserPlus },
    { id: '3', type: 'event_shared', user: 'Emma Wilson', event: 'Music Festival', time: '2 hours ago', icon: FiShare2 },
    { id: '4', type: 'ticket_purchased', user: 'You', event: 'Food Expo', time: '1 day ago', icon: IoTicket },
    { id: '5', type: 'achievement_unlocked', user: 'You', event: 'Social Butterfly', time: '2 days ago', icon: FiAward }
];

const mockCollections = [
    {
        id: '1',
        name: 'Wishlist',
        count: 12,
        description: 'Events I want to attend',
        color: 'from-pink-500 to-rose-500',
        icon: FiHeart,
        events: [
            { id: '1', title: 'Coachella 2025', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=150&fit=crop' },
            { id: '2', title: 'TED Conference', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=150&fit=crop' }
        ]
    },
    {
        id: '2',
        name: 'Saved for Later',
        count: 8,
        description: 'Events to check out',
        color: 'from-blue-500 to-indigo-500',
        icon: FiBookmark,
        events: [
            { id: '3', title: 'Art Gallery Opening', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop' }
        ]
    },
    {
        id: '3',
        name: 'Favorites',
        count: 5,
        description: 'My top events',
        color: 'from-yellow-500 to-orange-500',
        icon: FiStar,
        events: []
    }
];

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    section: 'main' | 'secondary';
}

type ActiveSection = 'dashboard' | 'profile' | 'wallet' | 'friends' | 'history' | 'analytics' | 'collections' | 'preferences' | 'settings';

export default function UserDashboard() {
    const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentUser, setCurrentUser] = useState(mockUser);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUser, setEditingUser] = useState(mockUser);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
    const [walletTab, setWalletTab] = useState<'overview' | 'transactions' | 'portfolio'>('overview');
    const [historyFilter, setHistoryFilter] = useState<'all' | 'attended' | 'cancelled'>('all');
    const [historySort, setHistorySort] = useState<'date' | 'rating' | 'spent'>('date');
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState(mockFriends);
    const [friendRequests, setFriendRequests] = useState(mockFriendRequests);
    const [userPreferences, setUserPreferences] = useState(mockUser.preferences);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

    // File refs
    const profileImageRef = useRef<HTMLInputElement>(null);
    const coverImageRef = useRef<HTMLInputElement>(null);

    // Responsive handling
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false);
            }
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const sidebarItems: SidebarItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <FiHome className="w-5 h-5" />, section: 'main' },
        { id: 'profile', label: 'Profile', icon: <FiUser className="w-5 h-5" />, section: 'main' },
        { id: 'wallet', label: 'Wallet', icon: <FiCreditCard className="w-5 h-5" />, section: 'main' },
        { id: 'friends', label: 'Friends', icon: <FiUsers className="w-5 h-5" />, badge: friendRequests.length, section: 'main' },
        { id: 'history', label: 'History', icon: <FiArchive className="w-5 h-5" />, section: 'main' },
        { id: 'analytics', label: 'Analytics', icon: <FiBarChart className="w-5 h-5" />, section: 'secondary' },
        { id: 'collections', label: 'Collections', icon: <FiBookmark className="w-5 h-5" />, section: 'secondary' },
        { id: 'preferences', label: 'Preferences', icon: <FiSliders className="w-5 h-5" />, section: 'secondary' },
        { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" />, section: 'secondary' }
    ];

    // Enhanced handlers
    const handleImageUpload = useCallback((type: 'profile' | 'cover', file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            if (type === 'profile') {
                setEditingUser(prev => ({ ...prev, image: imageUrl }));
            } else {
                setEditingUser(prev => ({ ...prev, coverImage: imageUrl }));
            }
        };
        reader.readAsDataURL(file);
    }, []);

    const handleAcceptFriend = useCallback((requestId: string) => {
        const request = friendRequests.find(r => r.id === requestId);
        if (request) {
            setFriends(prev => [...prev, {
                id: request.id,
                name: request.name,
                username: request.username,
                image: request.image,
                status: 'offline',
                mutualEvents: 0,
                lastMessage: '',
                messageTime: '',
                isOnline: false
            }]);
            setFriendRequests(prev => prev.filter(r => r.id !== requestId));
        }
    }, [friendRequests]);

    const handleDeclineFriend = useCallback((requestId: string) => {
        setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    }, []);

    const handleSaveProfile = useCallback(() => {
        setCurrentUser(editingUser);
        setIsEditing(false);
    }, [editingUser]);

    const handlePreferenceChange = useCallback((section: string, key: string, value: boolean | string) => {
        setUserPreferences(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof typeof prev],
                [key]: value
            }
        }));
    }, []);

    // Enhanced components
    const StatCard = ({ title, value, subtitle, icon, trend, className = "", gradient = false }: {
        title: string;
        value: string | number;
        subtitle?: string;
        icon: React.ReactNode;
        trend?: 'up' | 'down' | 'neutral';
        className?: string;
        gradient?: boolean;
    }) => (
        <motion.div
            className={`${gradient ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' : 'bg-white'} rounded-2xl p-6 border ${gradient ? 'border-orange-300' : 'border-gray-100'} hover:shadow-xl transition-all duration-300 ${className}`}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${gradient ? 'bg-white/20' : 'bg-orange-50'}`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${gradient ? 'text-white/80' :
                        trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                        {trend === 'up' && <FiTrendingUp className="w-4 h-4" />}
                        {trend === 'down' && <FiTrendingDown className="w-4 h-4" />}
                    </div>
                )}
            </div>
            <div>
                <p className={`text-3xl font-bold mb-1 ${gradient ? 'text-white' : 'text-gray-900'}`}>{value}</p>
                <p className={`text-sm ${gradient ? 'text-white/80' : 'text-gray-600'}`}>{title}</p>
                {subtitle && <p className={`text-xs mt-1 ${gradient ? 'text-white/60' : 'text-gray-500'}`}>{subtitle}</p>}
            </div>
        </motion.div>
    );

    // DASHBOARD SECTION - ENHANCED
    const renderDashboard = () => (
        <div className="space-y-8 h-full">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="mb-6 lg:mb-0">
                        <motion.h1
                            className="text-4xl font-bold mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Welcome back, {currentUser.name.split(' ')[0]}! 👋
                        </motion.h1>
                        <motion.p
                            className="text-orange-100 text-lg mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            You have {mockUpcomingEvents.length} upcoming events this week
                        </motion.p>
                        <motion.div
                            className="flex items-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-2">
                                <IoFlash className="w-5 h-5" />
                                <span className="font-semibold">{currentUser.streakDays} day streak</span>
                            </div>
                            <div className="w-px h-6 bg-white/30"></div>
                            <div className="flex items-center gap-2">
                                <IoSparkles className="w-5 h-5" />
                                <span className="font-semibold">{currentUser.level} Level</span>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        className="text-center lg:text-right"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-3xl font-bold mb-2">{currentUser.points}</div>
                            <div className="text-orange-100 mb-3">Reward Points</div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div
                                    className="bg-white rounded-full h-2 transition-all duration-1000"
                                    style={{ width: `${currentUser.levelProgress}%` }}
                                ></div>
                            </div>
                            <div className="text-sm text-orange-100 mt-2">{currentUser.levelProgress}% to Platinum</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Events This Year"
                    value={currentUser.eventsAttended}
                    subtitle="+6 from last year"
                    icon={<FiCalendar className="w-6 h-6 text-orange-500" />}
                    trend="up"
                />
                <StatCard
                    title="Active Friends"
                    value={friends.filter(f => f.isOnline).length}
                    subtitle={`${currentUser.followers} total followers`}
                    icon={<FiUsers className="w-6 h-6 text-blue-500" />}
                    trend="up"
                />
                <StatCard
                    title="Wallet Value"
                    value={`$${mockWalletData.balance.usd.toLocaleString()}`}
                    subtitle="+5.2% this week"
                    icon={<IoWallet className="w-6 h-6 text-green-500" />}
                    trend="up"
                />
                <StatCard
                    title="Total Spent"
                    value={`$${currentUser.totalSpent}`}
                    subtitle="Across all events"
                    icon={<FiDollarSign className="w-6 h-6 text-purple-500" />}
                    trend="neutral"
                />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Events */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                        <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                            View all
                        </button>
                    </div>
                    <div className="space-y-4">
                        {mockUpcomingEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                className="flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:shadow-md transition-all cursor-pointer"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                            >
                                <div className="flex w-full">
                                    <div style={{ width: 120, minWidth: 120, height: 80, position: 'relative' }}>
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover rounded-lg"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="flex-1 pl-4">
                                        <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                            <div className="flex items-center gap-1">
                                                <FiCalendar className="w-4 h-4" />
                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FiClock className="w-4 h-4" />
                                                <span>{event.time}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-orange-600">${event.price}</span>
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                                {event.daysUntil} days
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions & Activity */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <motion.button
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl p-3 font-semibold transition-all shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                🎯 Find Events
                            </motion.button>
                            <motion.button
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-3 font-semibold transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                👥 Invite Friends
                            </motion.button>
                            <motion.button
                                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-3 font-semibold transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                🎫 My Tickets
                            </motion.button>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {mockRecentActivity.slice(0, 4).map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                        <activity.icon className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{activity.user} {activity.type.replace('_', ' ')}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // PROFILE SECTION - FULLY FUNCTIONAL
    const renderProfile = () => (
        <div className="space-y-8 h-full">
            {/* Cover & Profile Image */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="relative h-48 bg-gradient-to-r from-orange-400 to-orange-600">
                    <Image
                        src={isEditing ? editingUser.coverImage : currentUser.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                        fill
                        sizes="(max-width: 1024px) 100vw, 100vw"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    {isEditing && (
                        <button
                            onClick={() => coverImageRef.current?.click()}
                            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
                        >
                            <FiCamera className="w-4 h-4" />
                        </button>
                    )}
                    <input
                        ref={coverImageRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload('cover', e.target.files[0])}
                    />
                </div>

                <div className="px-8 pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-2xl border-4 border-white overflow-hidden shadow-xl">
                                <Image
                                    src={isEditing ? editingUser.image : currentUser.image}
                                    alt={currentUser.name}
                                    className="w-full h-full object-cover"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 128px"
                                    style={{ objectFit: 'cover' }}
                                    priority
                                />
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => profileImageRef.current?.click()}
                                    className="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    <FiCamera className="w-3 h-3" />
                                </button>
                            )}
                            <input
                                ref={profileImageRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleImageUpload('profile', e.target.files[0])}
                            />
                        </div>

                        <div className="mt-4 sm:mt-0">
                            {!isEditing ? (
                                <motion.button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiEdit2 className="w-4 h-4" />
                                    Edit Profile
                                </motion.button>
                            ) : (
                                <div className="flex gap-3">
                                    <motion.button
                                        onClick={handleSaveProfile}
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiCheck className="w-4 h-4" />
                                        Save
                                    </motion.button>
                                    <motion.button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditingUser(currentUser);
                                        }}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiX className="w-4 h-4" />
                                        Cancel
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editingUser.name}
                                            onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                                            className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-orange-500 focus:outline-none"
                                        />
                                    ) : (
                                        <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                                    )}
                                    {currentUser.verified && (
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <FiCheck className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-600 mb-1">@{currentUser.username}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-1">
                                        <FiMapPin className="w-4 h-4" />
                                        <span>{currentUser.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FiCalendar className="w-4 h-4" />
                                        <span>Joined {new Date(currentUser.joinedDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {isEditing ? (
                                    <textarea
                                        value={editingUser.bio}
                                        onChange={(e) => setEditingUser(prev => ({ ...prev, bio: e.target.value }))}
                                        rows={3}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-gray-700">{currentUser.bio}</p>
                                )}
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editingUser.email}
                                            onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{currentUser.email}</p>
                                    )}
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editingUser.phone}
                                            onChange={(e) => setEditingUser(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{currentUser.phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Interests */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentUser.interests.map((interest, index) => (
                                        <span
                                            key={index}
                                            className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Stats & Social */}
                        <div className="space-y-6">
                            {/* Stats */}
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Events Attended</span>
                                        <span className="font-semibold">{currentUser.eventsAttended}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Followers</span>
                                        <span className="font-semibold">{currentUser.followers}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Following</span>
                                        <span className="font-semibold">{currentUser.following}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Points</span>
                                        <span className="font-semibold text-orange-600">{currentUser.points}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Social Links</h3>
                                <div className="space-y-3">
                                    {Object.entries(currentUser.socialLinks).map(([platform, handle]) => (
                                        <div key={platform} className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                                {platform === 'twitter' && <FiTwitter className="w-4 h-4 text-blue-500" />}
                                                {platform === 'linkedin' && <FiLinkedin className="w-4 h-4 text-blue-600" />}
                                                {platform === 'instagram' && <FiInstagram className="w-4 h-4 text-pink-500" />}
                                                {platform === 'github' && <FiGithub className="w-4 h-4 text-gray-700" />}
                                            </div>
                                            <span className="text-gray-700 capitalize">{handle}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // WALLET SECTION - ENHANCED
    const renderWallet = () => (
        <div className="space-y-8 h-full">
            {/* Wallet Header */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Wallet Overview</h1>
                        <p className="text-indigo-100 mb-4">Manage your crypto assets and transactions</p>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Connected to Ethereum Mainnet</span>
                        </div>
                    </div>
                    <div className="mt-6 lg:mt-0">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-3xl font-bold mb-1">${mockWalletData.balance.usd.toLocaleString()}</div>
                            <div className="text-indigo-100 text-sm">Total Portfolio Value</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Navigation */}
            <div className="bg-white rounded-xl p-2 border border-gray-100 flex overflow-x-auto">
                {(['overview', 'transactions', 'portfolio'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setWalletTab(tab)}
                        className={`px-6 py-3 rounded-lg font-medium transition-all flex-1 min-w-0 ${walletTab === tab
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Wallet Content */}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={walletTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        {walletTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                                {/* Portfolio Summary */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Asset Breakdown</h3>
                                        <div className="space-y-4">
                                            {mockWalletData.portfolio.map((asset, index) => (
                                                <motion.div
                                                    key={asset.symbol}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                                                            {asset.symbol === 'ETH' && <FaEthereum className="w-6 h-6 text-white" />}
                                                            {asset.symbol === 'BTC' && <FaBitcoin className="w-6 h-6 text-white" />}
                                                            {asset.symbol === 'USDC' && <FiDollarSign className="w-6 h-6 text-white" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{asset.symbol}</h4>
                                                            <p className="text-sm text-gray-600">{asset.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">${asset.value.toLocaleString()}</p>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-sm text-gray-600">{asset.amount}</span>
                                                            <span className={`text-sm font-medium ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {asset.change >= 0 ? '+' : ''}{asset.change}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                                        <div className="space-y-4">
                                            {mockWalletData.recentActivity.map((activity, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'nft' ? 'bg-purple-100' :
                                                        activity.type === 'defi' ? 'bg-blue-100' : 'bg-green-100'
                                                        }`}>
                                                        {activity.type === 'nft' && <IoTicket className="w-5 h-5 text-purple-600" />}
                                                        {activity.type === 'defi' && <FiLayers className="w-5 h-5 text-blue-600" />}
                                                        {activity.type === 'swap' && <FiRefreshCcw className="w-5 h-5 text-green-600" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{activity.action}</p>
                                                        <p className="text-sm text-gray-600">{activity.event}</p>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{activity.time}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-6">Quick Actions</h3>
                                        <div className="space-y-4">
                                            <motion.button
                                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-all"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiPlus className="w-5 h-5 mr-2 inline" />
                                                Add Funds
                                            </motion.button>
                                            <motion.button
                                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-all"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiSend className="w-5 h-5 mr-2 inline" />
                                                Send Crypto
                                            </motion.button>
                                            <motion.button
                                                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-all"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiRefreshCcw className="w-5 h-5 mr-2 inline" />
                                                Swap Tokens
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Wallet Info */}
                                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-4">Wallet Info</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Address</span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(mockWalletData.address)}
                                                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                                                >
                                                    <span className="font-mono">{mockWalletData.address.slice(0, 6)}...{mockWalletData.address.slice(-4)}</span>
                                                    <FiCopy className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Network</span>
                                                <span className="font-medium">Ethereum</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Status</span>
                                                <span className="text-green-600 font-medium">Connected</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {walletTab === 'transactions' && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">All</button>
                                        <button className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg text-sm font-medium">Events</button>
                                        <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">Transfers</button>
                                    </div>
                                </div>
                                <div className="space-y-4 overflow-y-auto">
                                    {mockWalletData.transactions.map((tx, index) => (
                                        <motion.div
                                            key={tx.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'event_purchase' ? 'bg-orange-100' :
                                                    tx.type === 'deposit' ? 'bg-green-100' : 'bg-blue-100'
                                                    }`}>
                                                    {tx.type === 'event_purchase' && <IoTicket className="w-6 h-6 text-orange-600" />}
                                                    {tx.type === 'deposit' && <FiArrowDown className="w-6 h-6 text-green-600" />}
                                                    {tx.type === 'friend_transfer' && <FiSend className="w-6 h-6 text-blue-600" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{tx.event}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <span>{new Date(tx.date).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <button className="text-orange-600 hover:underline">
                                                            {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-semibold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'}`}>
                                                    {tx.amount}
                                                </p>
                                                <p className="text-sm text-gray-600">{tx.usdValue}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {walletTab === 'portfolio' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Portfolio Distribution</h3>
                                    <div className="space-y-6">
                                        {mockWalletData.portfolio.map((asset, index) => {
                                            const percentage = (asset.value / mockWalletData.balance.usd) * 100;
                                            return (
                                                <div key={asset.symbol} className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">{asset.symbol}</span>
                                                        <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <motion.div
                                                            className={`h-2 rounded-full ${index === 0 ? 'bg-orange-500' :
                                                                index === 1 ? 'bg-blue-500' : 'bg-green-500'
                                                                }`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percentage}%` }}
                                                            transition={{ duration: 1, delay: index * 0.2 }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Performance</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                                            <div>
                                                <p className="text-sm text-gray-600">24h Change</p>
                                                <p className="font-bold text-green-600">+$127.50</p>
                                            </div>
                                            <FiTrendingUp className="w-8 h-8 text-green-600" />
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                                            <div>
                                                <p className="text-sm text-gray-600">7d Change</p>
                                                <p className="font-bold text-blue-600">+$445.20</p>
                                            </div>
                                            <FiTrendingUp className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                                            <div>
                                                <p className="text-sm text-gray-600">30d Change</p>
                                                <p className="font-bold text-purple-600">+$892.75</p>
                                            </div>
                                            <FiTrendingUp className="w-8 h-8 text-purple-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );

    // FRIENDS SECTION - ENHANCED
    const renderFriends = () => (
        <div className="space-y-8 h-full">
            {/* Friends Header */}
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Your Social Network</h1>
                <p className="text-blue-100 mb-4">Connect, share, and experience events together</p>
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{friends.length}</div>
                        <div className="text-blue-100 text-sm">Friends</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{friends.filter(f => f.isOnline).length}</div>
                        <div className="text-blue-100 text-sm">Online</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{friendRequests.length}</div>
                        <div className="text-blue-100 text-sm">Pending</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden space-y-8">
                {/* Friend Requests */}
                {friendRequests.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Friend Requests</h2>
                            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                                {friendRequests.length} pending
                            </span>
                        </div>
                        <div className="space-y-4">
                            {friendRequests.map((request, index) => (
                                <motion.div
                                    key={request.id}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Image
                                        src={request.image}
                                        alt={request.name}
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{request.name}</h3>
                                        <p className="text-sm text-gray-600">@{request.username} • {request.mutualFriends} mutual friends</p>
                                        <p className="text-xs text-gray-500 mt-1">{request.bio}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <motion.button
                                            onClick={() => handleAcceptFriend(request.id)}
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Accept
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDeclineFriend(request.id)}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Decline
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Friends List */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 flex-1 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <h2 className="text-xl font-bold text-gray-900">Friends ({friends.length})</h2>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search friends..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white border border-transparent focus:border-orange-500"
                                />
                            </div>
                            <motion.button
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiUserPlus className="w-4 h-4" />
                                Add Friend
                            </motion.button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-96">
                        {friends.filter(friend =>
                            friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            friend.username.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((friend, index) => (
                            <motion.div
                                key={friend.id}
                                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedFriend(friend.id)}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="relative">
                                        <Image
                                            src={friend.image}
                                            alt={friend.name}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 rounded-full object-cover"
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                            }`}></div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                                        <p className="text-sm text-gray-600">@{friend.username}</p>
                                    </div>
                                </div>

                                {friend.lastMessage && (
                                    <div className="mb-3 p-2 bg-white rounded-lg">
                                        <p className="text-sm text-gray-700 truncate">{friend.lastMessage}</p>
                                        <span className="text-xs text-gray-500">{friend.messageTime}</span>
                                    </div>
                                )}

                                <p className="text-sm text-gray-600 mb-3">{friend.mutualEvents} events together</p>

                                <div className="flex gap-2">
                                    <motion.button
                                        className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FiMessageSquare className="w-4 h-4 mr-1 inline" />
                                        Message
                                    </motion.button>
                                    <motion.button
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FiCalendar className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // HISTORY SECTION - ENHANCED
    const renderHistory = () => {
        const filteredHistory = mockEventHistory.filter(event => {
            if (historyFilter === 'all') return true;
            return event.status === historyFilter;
        }).sort((a, b) => {
            if (historySort === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (historySort === 'rating') return b.rating - a.rating;
            if (historySort === 'spent') return b.spent - a.spent;
            return 0;
        });

        return (
            <div className="space-y-8 h-full">
                {/* History Header */}
                <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Event History</h1>
                    <p className="text-purple-100 mb-4">Track your event journey and memories</p>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{mockEventHistory.length}</div>
                            <div className="text-purple-100 text-sm">Total Events</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{mockEventHistory.filter(e => e.status === 'attended').length}</div>
                            <div className="text-purple-100 text-sm">Attended</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">${mockEventHistory.reduce((sum, e) => sum + e.spent, 0)}</div>
                            <div className="text-purple-100 text-sm">Total Spent</div>
                        </div>
                    </div>
                </div>

                {/* Filters & Controls */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {(['all', 'attended', 'cancelled'] as const).map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setHistoryFilter(filter)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${historyFilter === filter
                                            ? 'bg-orange-500 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={historySort}
                                onChange={(e) => setHistorySort(e.target.value as 'date' | 'rating' | 'spent')}
                                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            >
                                <option value="date">Sort by Date</option>
                                <option value="rating">Sort by Rating</option>
                                <option value="spent">Sort by Amount</option>
                            </select>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                <FiDownload className="w-4 h-4 mr-2 inline" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Events List */}
                <div className="flex-1 overflow-y-auto space-y-6">
                    {filteredHistory.map((event, index) => (
                        <motion.div
                            key={event.id}
                            className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="flex flex-col lg:flex-row">
                                <div className="lg:w-1/3 relative h-48 lg:h-auto">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'attended' ? 'bg-green-100 text-green-700' :
                                            event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    {event.photos && (
                                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                                            <FiCamera className="w-3 h-3 mr-1 inline" />
                                            {event.photos}
                                        </div>
                                    )}
                                </div>

                                <div className="lg:w-2/3 p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <FiCalendar className="w-4 h-4" />
                                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FiMapPin className="w-4 h-4" />
                                                    <span>{event.location}</span>
                                                </div>
                                                {event.checkInTime && (
                                                    <div className="flex items-center gap-1">
                                                        <FiClock className="w-4 h-4" />
                                                        <span>{event.checkInTime}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-700 mb-3">{event.description}</p>

                                            {event.highlights && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {event.highlights.map((highlight, i) => (
                                                        <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                                            {highlight}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {event.friendsAttended.length > 0 && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FiUsers className="w-4 h-4" />
                                                    <span>With {event.friendsAttended.join(', ')}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-right mt-4 sm:mt-0">
                                            {event.rating > 0 && (
                                                <div className="flex items-center gap-1 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar key={i} className={`w-4 h-4 ${i < event.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                            )}
                                            <div className="text-lg font-bold text-gray-900 mb-1">
                                                {event.refunded ? 'Refunded' : `$${event.spent}`}
                                            </div>
                                            <div className="text-sm text-gray-600">{event.ticketType}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    };

    // ANALYTICS SECTION - NEW IMPLEMENTATION
    const renderAnalytics = () => (
        <div className="space-y-8 h-full">
            {/* Analytics Header */}
            <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
                <p className="text-emerald-100 mb-4">Insights into your event patterns and preferences</p>
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{mockAnalytics.attendance.thisYear}</div>
                        <div className="text-emerald-100 text-sm">Events This Year</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">${mockAnalytics.spending.yearTotal}</div>
                        <div className="text-emerald-100 text-sm">Total Spent</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{mockAnalytics.social.newFriends}</div>
                        <div className="text-emerald-100 text-sm">New Friends</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8">
                {/* Spending Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Spending by Category</h3>
                        <div className="space-y-4">
                            {mockAnalytics.spending.categories.map((category, index) => (
                                <motion.div
                                    key={category.name}
                                    className="space-y-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{category.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">${category.amount}</span>
                                            <span className={`text-xs font-medium ${category.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {category.trend > 0 ? '+' : ''}{category.trend}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <motion.div
                                            className="h-2 rounded-full"
                                            style={{ backgroundColor: category.color }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(category.amount / Math.max(...mockAnalytics.spending.categories.map(c => c.amount))) * 100}%` }}
                                            transition={{ duration: 1, delay: index * 0.2 }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Attendance</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">This Year</span>
                                <span className="font-semibold">{mockAnalytics.attendance.thisYear} events</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Last Year</span>
                                <span className="font-semibold">{mockAnalytics.attendance.lastYear} events</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Hours</span>
                                <span className="font-semibold">{mockAnalytics.attendance.totalHours}h</span>
                            </div>

                            {/* Monthly Chart Simulation */}
                            <div className="mt-6">
                                <div className="flex items-end justify-between h-32 gap-1">
                                    {mockAnalytics.attendance.monthlyData.map((events, month) => (
                                        <motion.div
                                            key={month}
                                            className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t flex-1"
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(events / Math.max(...mockAnalytics.attendance.monthlyData)) * 100}%` }}
                                            transition={{ duration: 1, delay: month * 0.1 }}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                                        <span key={month}>{month}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown & Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Event Category Breakdown</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(mockAnalytics.attendance.categoryBreakdown).map(([category, count], index) => (
                                <motion.div
                                    key={category}
                                    className="bg-gray-50 rounded-xl p-4 text-center"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                                    <div className="text-sm text-gray-600">{category}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">AI Insights</h3>
                        <div className="space-y-4">
                            {mockAnalytics.insights.map((insight, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                >
                                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiZap className="w-3 h-3 text-white" />
                                    </div>
                                    <p className="text-sm text-gray-700">{insight}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Social Analytics */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Social Engagement</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">{mockAnalytics.social.newFriends}</div>
                            <div className="text-sm text-gray-600">New Friends</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">{mockAnalytics.social.eventsWithFriends}</div>
                            <div className="text-sm text-gray-600">Events with Friends</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">{mockAnalytics.social.invitesSent}</div>
                            <div className="text-sm text-gray-600">Invites Sent</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">+{mockAnalytics.social.networkGrowth}%</div>
                            <div className="text-sm text-gray-600">Network Growth</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // COLLECTIONS SECTION - NEW IMPLEMENTATION
    const renderCollections = () => (
        <div className="space-y-8 h-full">
            {/* Collections Header */}
            <div className="bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Event Collections</h1>
                <p className="text-violet-100 mb-4">Organize and save events that catch your eye</p>
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{mockCollections.reduce((sum, col) => sum + col.count, 0)}</div>
                        <div className="text-violet-100 text-sm">Saved Events</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{mockCollections.length}</div>
                        <div className="text-violet-100 text-sm">Collections</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8">
                {/* Collections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockCollections.map((collection, index) => (
                        <motion.div
                            key={collection.id}
                            className={`bg-gradient-to-br ${collection.color} rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            onClick={() => setSelectedCollection(collection.id)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <collection.icon className="w-8 h-8" />
                                <span className="text-2xl font-bold">{collection.count}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{collection.name}</h3>
                            <p className="text-white/80 text-sm">{collection.description}</p>
                        </motion.div>
                    ))}

                    {/* Add New Collection */}
                    <motion.div
                        className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-orange-500 hover:text-orange-500 cursor-pointer transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiPlus className="w-8 h-8 mb-4" />
                        <span className="font-semibold">Create Collection</span>
                    </motion.div>
                </div>

                {/* Collection Details */}
                {selectedCollection && (
                    <motion.div
                        className="bg-white rounded-2xl p-6 border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {(() => {
                            const collection = mockCollections.find(c => c.id === selectedCollection);
                            if (!collection) return null;

                            return (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${collection.color} rounded-xl flex items-center justify-center text-white`}>
                                                <collection.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{collection.name}</h3>
                                                <p className="text-gray-600">{collection.count} events</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedCollection(null)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <FiX className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {collection.events.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {collection.events.map((event, eventIndex) => (
                                                <motion.div
                                                    key={event.id}
                                                    className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: eventIndex * 0.1 }}
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <div className="aspect-video relative">
                                                        <Image
                                                            src={event.image}
                                                            alt={event.title}
                                                            className="w-full h-full object-cover"
                                                            fill
                                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <div className="p-4">
                                                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <collection.icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500">No events in this collection yet</p>
                                            <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                                Add Events
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </motion.div>
                )}
            </div>
        </div>
    );

    // PREFERENCES SECTION - NEW IMPLEMENTATION
    const renderPreferences = () => (
        <div className="space-y-8 h-full">
            {/* Preferences Header */}
            <div className="bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Preferences</h1>
                <p className="text-indigo-100">Customize your Rovify experience</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8">
                {/* Notifications */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FiBell className="w-6 h-6 text-orange-500" />
                        Notifications
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(userPreferences.notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <h4 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                    <p className="text-sm text-gray-600">
                                        {key === 'email' && 'Receive notifications via email'}
                                        {key === 'push' && 'Browser push notifications'}
                                        {key === 'sms' && 'Text message notifications'}
                                        {key === 'eventReminders' && 'Reminders about upcoming events'}
                                        {key === 'friendActivity' && 'Updates about friend activities'}
                                        {key === 'promotions' && 'Special offers and promotions'}
                                    </p>
                                </div>
                                <motion.button
                                    onClick={() => handlePreferenceChange('notifications', key, !value)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-orange-500' : 'bg-gray-300'}`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                                        animate={{ x: value ? 26 : 2 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                </motion.button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Privacy */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FiShield className="w-6 h-6 text-green-500" />
                        Privacy Settings
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <label className="block font-medium text-gray-900 mb-2">Profile Visibility</label>
                            <select
                                value={userPreferences.privacy.profileVisibility}
                                onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            >
                                <option value="public">Public</option>
                                <option value="friends">Friends Only</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                            <label className="block font-medium text-gray-900 mb-2">Who can message you</label>
                            <select
                                value={userPreferences.privacy.allowMessages}
                                onChange={(e) => handlePreferenceChange('privacy', 'allowMessages', e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            >
                                <option value="everyone">Everyone</option>
                                <option value="friends">Friends Only</option>
                                <option value="none">No One</option>
                            </select>
                        </div>

                        {['showLocation', 'showEvents'].map((key) => (
                            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <h4 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                    <p className="text-sm text-gray-600">
                                        {key === 'showLocation' && 'Display your location on your profile'}
                                        {key === 'showEvents' && 'Show your event attendance publicly'}
                                    </p>
                                </div>
                                <motion.button
                                    onClick={() => handlePreferenceChange('privacy', key, !userPreferences.privacy[key as keyof typeof userPreferences.privacy])}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${userPreferences.privacy[key as keyof typeof userPreferences.privacy] ? 'bg-orange-500' : 'bg-gray-300'}`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                                        animate={{ x: userPreferences.privacy[key as keyof typeof userPreferences.privacy] ? 26 : 2 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                </motion.button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Display Settings */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FiSettings className="w-6 h-6 text-blue-500" />
                        Display Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <label className="block font-medium text-gray-900 mb-2">Theme</label>
                            <select
                                value={userPreferences.display.theme}
                                onChange={(e) => handlePreferenceChange('display', 'theme', e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                            <label className="block font-medium text-gray-900 mb-2">Language</label>
                            <select
                                value={userPreferences.display.language}
                                onChange={(e) => handlePreferenceChange('display', 'language', e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                            </select>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                            <label className="block font-medium text-gray-900 mb-2">Timezone</label>
                            <select
                                value={userPreferences.display.timezone}
                                onChange={(e) => handlePreferenceChange('display', 'timezone', e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            >
                                <option value="PST">Pacific Standard Time</option>
                                <option value="EST">Eastern Standard Time</option>
                                <option value="GMT">Greenwich Mean Time</option>
                                <option value="CET">Central European Time</option>
                            </select>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                            <label className="block font-medium text-gray-900 mb-2">Date Format</label>
                            <select
                                value={userPreferences.display.dateFormat}
                                onChange={(e) => handlePreferenceChange('display', 'dateFormat', e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            >
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // SETTINGS SECTION - NEW IMPLEMENTATION
    const renderSettings = () => (
        <div className="space-y-8 h-full">
            {/* Settings Header */}
            <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-black rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
                <p className="text-gray-300">Manage your account and security settings</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8">
                {/* Account Information */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FiUser className="w-6 h-6 text-orange-500" />
                        Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={currentUser.name}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                value={currentUser.username}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={currentUser.email}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                            <input
                                type="text"
                                value={new Date(currentUser.joinedDate).toLocaleDateString()}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <motion.button
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Edit Information
                        </motion.button>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FiLock className="w-6 h-6 text-red-500" />
                        Security
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h4 className="font-medium text-gray-900">Change Password</h4>
                                <p className="text-sm text-gray-600">Update your account password</p>
                            </div>
                            <motion.button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Change
                            </motion.button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                                <p className="text-sm text-gray-600">Add an extra layer of security</p>
                            </div>
                            <motion.button
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Enable
                            </motion.button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h4 className="font-medium text-gray-900">Login History</h4>
                                <p className="text-sm text-gray-600">View recent login activity</p>
                            </div>
                            <motion.button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Connected Apps */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FiLink className="w-6 h-6 text-blue-500" />
                        Connected Apps
                    </h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Google Calendar', icon: FiCalendar, connected: true },
                            { name: 'Spotify', icon: FaSpotify, connected: true },
                            { name: 'Apple Music', icon: FaApple, connected: false },
                            { name: 'Discord', icon: FaDiscord, connected: false }
                        ].map((app, index) => (
                            <div key={app.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <app.icon className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">{app.name}</h4>
                                        <p className="text-sm text-gray-600">
                                            {app.connected ? 'Connected' : 'Not connected'}
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${app.connected
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {app.connected ? 'Disconnect' : 'Connect'}
                                </motion.button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl p-6 border border-red-200">
                    <h3 className="text-xl font-bold text-red-600 mb-6 flex items-center gap-3">
                        <FiAlertCircle className="w-6 h-6" />
                        Danger Zone
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                            <div>
                                <h4 className="font-medium text-gray-900">Export Data</h4>
                                <p className="text-sm text-gray-600">Download a copy of your data</p>
                            </div>
                            <motion.button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Export
                            </motion.button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                            <div>
                                <h4 className="font-medium text-red-600">Delete Account</h4>
                                <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                            </div>
                            <motion.button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Delete
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Main render method
    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return renderDashboard();
            case 'profile':
                return renderProfile();
            case 'wallet':
                return renderWallet();
            case 'friends':
                return renderFriends();
            case 'history':
                return renderHistory();
            case 'analytics':
                return renderAnalytics();
            case 'collections':
                return renderCollections();
            case 'preferences':
                return renderPreferences();
            case 'settings':
                return renderSettings();
            default:
                return renderDashboard();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Menu Overlay */}
            {isMobile && mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Enhanced Sidebar with Fixed Width */}
            <motion.div
                className={`${isMobile ? 'fixed' : 'relative'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50 shadow-xl h-screen ${isMobile
                    ? `${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
                    : sidebarCollapsed ? 'w-20' : 'w-64'
                    }`}
                initial={false}
            >
                {/* Logo & Collapse Button */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        {(!sidebarCollapsed || isMobile) && (
                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">
                                        <Image
                                            // src={RoviLogo}
                                            src="/images/contents/rovi-logo.png"
                                            alt="Rovify Logo"
                                            width={28}
                                            height={28}
                                            className="object-contain"
                                        />
                                    </span>
                                </div>
                                <div>
                                    <span className="font-bold text-gray-900 text-lg">Rovify</span>
                                    <div className="text-xs text-orange-600 font-medium">Dashboard</div>
                                </div>
                            </motion.div>
                        )}

                        {sidebarCollapsed && !isMobile && (
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
                                <span className="text-white font-bold text-lg">R</span>
                            </div>
                        )}

                        {!isMobile && (
                            <motion.button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {sidebarCollapsed ? <FiChevronRight className="w-4 h-4" /> : <FiChevronLeft className="w-4 h-4" />}
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Enhanced Navigation with scroll */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-8">
                        {/* Main Section */}
                        <div>
                            {(!sidebarCollapsed || isMobile) && (
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Main</p>
                            )}
                            <div className="space-y-2">
                                {sidebarItems.filter(item => item.section === 'main').map((item, index) => (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveSection(item.id as ActiveSection);
                                            if (isMobile) setMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all relative overflow-hidden group ${activeSection === item.id
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                            } ${sidebarCollapsed && !isMobile ? 'justify-center' : ''}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ x: sidebarCollapsed && !isMobile ? 0 : 4, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        title={sidebarCollapsed && !isMobile ? item.label : undefined}
                                    >
                                        {/* Enhanced active indicator for collapsed state */}
                                        {activeSection === item.id && sidebarCollapsed && !isMobile && (
                                            <motion.div
                                                className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                                                layoutId="activeIndicator"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        <div className={`relative ${activeSection === item.id ? 'text-white' : ''} ${sidebarCollapsed && !isMobile ? 'text-xl' : ''}`}>
                                            {item.icon}
                                        </div>

                                        {(!sidebarCollapsed || isMobile) && (
                                            <>
                                                <span className="flex-1 font-medium">{item.label}</span>
                                                {item.badge && (
                                                    <motion.span
                                                        className={`text-xs rounded-full px-2 py-1 font-bold min-w-[20px] text-center ${activeSection === item.id
                                                            ? 'bg-white text-orange-600'
                                                            : 'bg-orange-500 text-white'
                                                            }`}
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        {item.badge}
                                                    </motion.span>
                                                )}
                                            </>
                                        )}

                                        {/* Badge for collapsed state */}
                                        {item.badge && sidebarCollapsed && !isMobile && (
                                            <motion.span
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                {item.badge}
                                            </motion.span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Secondary Section */}
                        <div>
                            {(!sidebarCollapsed || isMobile) && (
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">More</p>
                            )}
                            <div className="space-y-2">
                                {sidebarItems.filter(item => item.section === 'secondary').map((item, index) => (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveSection(item.id as ActiveSection);
                                            if (isMobile) setMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all relative overflow-hidden group ${activeSection === item.id
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                            } ${sidebarCollapsed && !isMobile ? 'justify-center' : ''}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (index + 5) * 0.1 }}
                                        whileHover={{ x: sidebarCollapsed && !isMobile ? 0 : 4, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        title={sidebarCollapsed && !isMobile ? item.label : undefined}
                                    >
                                        {/* Enhanced active indicator for collapsed state */}
                                        {activeSection === item.id && sidebarCollapsed && !isMobile && (
                                            <motion.div
                                                className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                                                layoutId="activeIndicator"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        <div className={`relative ${activeSection === item.id ? 'text-white' : ''} ${sidebarCollapsed && !isMobile ? 'text-xl' : ''}`}>
                                            {item.icon}
                                        </div>

                                        {(!sidebarCollapsed || isMobile) && <span className="flex-1 font-medium">{item.label}</span>}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Enhanced User Profile Footer */}
                <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
                    <motion.div
                        className={`flex items-center gap-3 ${(sidebarCollapsed && !isMobile) ? 'justify-center' : ''}`}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="relative">
                            <Image
                                src={currentUser.image}
                                alt={currentUser.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-xl object-cover shadow-md"
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        {(!sidebarCollapsed || isMobile) && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-gray-600 truncate">{currentUser.level} Member</p>
                                    <div className="flex items-center gap-1">
                                        <IoSparkles className="w-3 h-3 text-orange-500" />
                                        <span className="text-xs font-medium text-orange-600">{currentUser.points}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {/* Main Content with Independent Scroll */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Enhanced Header */}
                <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 flex-shrink-0 z-30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {isMobile && (
                                <motion.button
                                    onClick={() => setMobileMenuOpen(true)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiMenu className="w-5 h-5" />
                                </motion.button>
                            )}
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent capitalize">
                                    {activeSection}
                                </h1>
                                <p className="text-sm text-gray-600 hidden sm:block">
                                    {activeSection === 'dashboard' && 'Your personal event control center'}
                                    {activeSection === 'profile' && 'Manage your public profile and achievements'}
                                    {activeSection === 'wallet' && 'Manage your crypto wallet and transactions'}
                                    {activeSection === 'friends' && 'Connect with other event enthusiasts'}
                                    {activeSection === 'history' && 'View your complete event history'}
                                    {activeSection === 'analytics' && 'Insights into your event patterns'}
                                    {activeSection === 'collections' && 'Your saved events and wishlists'}
                                    {activeSection === 'preferences' && 'Customize your Rovify experience'}
                                    {activeSection === 'settings' && 'Account and security settings'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                                    <FiBell className="w-5 h-5" />
                                    <motion.span
                                        className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </button>
                            </motion.div>
                            <motion.button
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                🎯 Find Events
                            </motion.button>
                        </div>
                    </div>
                </header>

                {/* Page Content with Independent Scroll */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="h-full"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}