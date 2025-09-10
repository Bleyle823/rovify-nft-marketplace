'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiFilter, FiSearch, FiChevronDown, FiGrid, FiList,
    FiTag, FiShoppingBag, FiAward, FiHeart, FiStar,
    FiBookmark, FiShoppingCart, FiTrendingUp, FiClock,
    FiChevronRight, FiCalendar, FiUser
} from 'react-icons/fi';
import { IoTicket } from 'react-icons/io5';
import { BsMusicNote, BsImageFill } from 'react-icons/bs';
import { RiNftFill, RiVipCrownFill } from 'react-icons/ri';

// Define TypeScript interfaces
interface MarketCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
}

interface MarketCreator {
    id: string;
    name: string;
    image: string;
    profession: string;
    verified: boolean;
    gradient: string;
}

interface MarketItem {
    id: number;
    title: string;
    type: 'tickets' | 'nfts' | 'membership' | 'merch' | 'music' | 'digital';
    price: number;
    currency: string;
    image: string;
    verified: boolean;
    rating: number;
    sales: number;
    timeLeft: string;
    creator: string;
    location?: string;
    rarity?: string;
    benefits?: string;
    size?: string;
    duration?: string;
}

interface NFTDrop {
    id: number;
    title: string;
    creator: string;
    image: string;
    status: 'upcoming' | 'live' | 'ended';
    price: string;
    date: string;
    soldPercentage?: number;
    statusLabel: string;
    buttonText: string;
    buttonAction: () => void;
    gradient: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'trending' | 'price-low-high' | 'price-high-low' | 'rating' | 'newest';

// Marketplace component
const Marketplace: React.FC = () => {
    // State management with proper types
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortOption, setSortOption] = useState<SortOption>('trending');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [wishlistedItems, setWishlistedItems] = useState<number[]>([]);
    const [isVerifiedFilter, setIsVerifiedFilter] = useState<boolean>(false);

    // Refs
    const filterRef = useRef<HTMLDivElement>(null);

    // Market categories
    const marketCategories: MarketCategory[] = [
        { id: 'all', name: 'All Items', icon: <FiShoppingBag /> },
        { id: 'tickets', name: 'Event Tickets', icon: <IoTicket /> },
        { id: 'nfts', name: 'NFT Collectibles', icon: <RiNftFill /> },
        { id: 'merch', name: 'Merchandise', icon: <FiTag /> },
        { id: 'digital', name: 'Digital Content', icon: <BsImageFill /> },
        { id: 'membership', name: 'Memberships', icon: <RiVipCrownFill /> },
        { id: 'music', name: 'Music', icon: <BsMusicNote /> }
    ];

    // NFT Drops data
    const nftDrops: NFTDrop[] = [
        {
            id: 1,
            title: "Nebula Dreams Collection",
            creator: "Cosmic Art Studios",
            image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            status: "upcoming",
            price: "Starting at 0.2 ETH",
            date: "May 20, 2025",
            statusLabel: "Upcoming",
            buttonText: "Notify Me",
            buttonAction: () => console.log("Notification set for Nebula Dreams"),
            gradient: "from-purple-600 to-blue-500"
        },
        {
            id: 2,
            title: "Golden Festival Moments",
            creator: "The Memory Collectors",
            image: "https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            status: "live",
            price: "",
            date: "Ends in 06:23:15",
            soldPercentage: 73,
            statusLabel: "Live",
            buttonText: "Buy Now",
            buttonAction: () => console.log("Buy now clicked for Golden Festival"),
            gradient: "from-amber-500 to-red-500"
        },
        {
            id: 3,
            title: "Neon City Skylines",
            creator: "Urban Digital Collective",
            image: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            status: "ended",
            price: "Sold for 2.5 ETH",
            date: "May 10, 2025",
            statusLabel: "Ended",
            buttonText: "View Collection",
            buttonAction: () => console.log("View collection clicked for Neon City"),
            gradient: "from-gray-700 to-gray-900"
        }
    ];

    // Creator profiles
    const creators: MarketCreator[] = [
        {
            id: "creator1",
            name: "James Wilson",
            profession: "Music Producer",
            image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            verified: true,
            gradient: "from-blue-400 to-purple-500"
        },
        {
            id: "creator2",
            name: "Emma Chen",
            profession: "Digital Artist",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80",
            verified: true,
            gradient: "from-orange-400 to-pink-500"
        },
        {
            id: "creator3",
            name: "Miguel Santos",
            profession: "Event Organiser",
            image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            verified: true,
            gradient: "from-green-400 to-teal-500"
        },
        {
            id: "creator4",
            name: "David Kim",
            profession: "DJ / Producer",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80",
            verified: true,
            gradient: "from-indigo-400 to-purple-600"
        },
        {
            id: "creator5",
            name: "Sophia Mills",
            profession: "Fashion Designer",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            verified: true,
            gradient: "from-red-400 to-yellow-500"
        },
        {
            id: "creator6",
            name: "Thomas Wright",
            profession: "Photographer",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            verified: true,
            gradient: "from-teal-400 to-blue-500"
        }
    ];

    // Sample marketplace items with real Unsplash images
    const marketItems: MarketItem[] = [
        {
            id: 1,
            title: 'Tech Summit 2025',
            type: 'tickets',
            price: 150,
            currency: 'USD',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            verified: true,
            rating: 4.9,
            sales: 328,
            timeLeft: '2 days',
            creator: 'Tech Events Inc.',
            location: 'San Francisco, CA'
        },
        {
            id: 2,
            title: 'Summer Festival VIP Pass',
            type: 'tickets',
            price: 250,
            currency: 'USD',
            image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            verified: true,
            rating: 4.8,
            sales: 189,
            timeLeft: '3 days',
            creator: 'Summer Vibes Group',
            location: 'Miami, FL'
        },
        {
            id: 3,
            title: 'Neon Nights Artwork #042',
            type: 'nfts',
            price: 0.5,
            currency: 'ETH',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
            verified: true,
            rating: 4.7,
            sales: 12,
            timeLeft: '4 hours',
            creator: 'DigitalArtist',
            rarity: 'Rare'
        },
        {
            id: 4,
            title: 'Festival Memories Collection',
            type: 'nfts',
            price: 0.25,
            currency: 'ETH',
            image: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            verified: false,
            rating: 4.5,
            sales: 27,
            timeLeft: '1 day',
            creator: 'EventMemo',
            rarity: 'Common'
        },
        {
            id: 5,
            title: 'Event Organiser Pro Membership',
            type: 'membership',
            price: 99,
            currency: 'USD',
            image: 'https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            verified: true,
            rating: 4.9,
            sales: 421,
            timeLeft: 'Unlimited',
            creator: 'Rovify',
            benefits: '12 months access'
        },
        {
            id: 6,
            title: 'Festival Limited Edition Hoodie',
            type: 'merch',
            price: 65,
            currency: 'USD',
            image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
            verified: true,
            rating: 4.6,
            sales: 195,
            timeLeft: 'In stock',
            creator: 'Festival Gear',
            size: 'Multiple sizes'
        },
        {
            id: 7,
            title: 'DJ Set - Electronic Vibes Vol.3',
            type: 'music',
            price: 12,
            currency: 'USD',
            image: 'https://images.unsplash.com/photo-1571266028243-5c704c848f7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
            verified: true,
            rating: 4.8,
            sales: 543,
            timeLeft: 'Digital Download',
            creator: 'DJ ElectroVibe',
            duration: '120 min'
        },
        {
            id: 8,
            title: 'Virtual Photography Workshop',
            type: 'digital',
            price: 49,
            currency: 'USD',
            image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            verified: true,
            rating: 4.7,
            sales: 128,
            timeLeft: 'On-demand',
            creator: 'CapturePro',
            duration: '3 hours'
        }
    ];

    // Toggle item in wishlist
    const toggleWishlist = (itemId: number): void => {
        if (wishlistedItems.includes(itemId)) {
            setWishlistedItems(wishlistedItems.filter(id => id !== itemId));
        } else {
            setWishlistedItems([...wishlistedItems, itemId]);
        }
    };

    // Handle view mode change
    const handleViewModeChange = (mode: ViewMode): void => {
        setViewMode(mode);
    };

    // Filter items based on active category and filters
    const filteredItems = marketItems.filter(item => {
        // Filter by category
        if (activeCategory !== 'all' && item.type !== activeCategory) {
            return false;
        }

        // Filter by search query
        if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Filter by price range
        const itemPrice = item.currency === 'ETH' ? item.price * 3500 : item.price; // Simple conversion for display
        if (itemPrice < minPrice || itemPrice > maxPrice) {
            return false;
        }

        // Filter by verification status
        if (isVerifiedFilter && !item.verified) {
            return false;
        }

        return true;
    });

    // Sort items based on selected option
    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortOption) {
            case 'price-low-high':
                return (a.currency === 'ETH' ? a.price * 3500 : a.price) - (b.currency === 'ETH' ? b.price * 3500 : b.price);
            case 'price-high-low':
                return (b.currency === 'ETH' ? b.price * 3500 : b.price) - (a.currency === 'ETH' ? a.price * 3500 : a.price);
            case 'rating':
                return b.rating - a.rating;
            case 'newest':
                return b.id - a.id;
            case 'trending':
            default:
                return b.sales - a.sales;
        }
    });

    // Handle click outside filter dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle select change for sort options
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setSortOption(e.target.value as SortOption);
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(e.target.value);
    };

    // Handle price input change with validation
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max'): void => {
        const value = parseInt(e.target.value) || 0;
        if (type === 'min') {
            setMinPrice(value);
        } else {
            setMaxPrice(value);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Marketplace Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
                <p className="text-gray-600">Discover tickets, NFTs, merchandise, and more from your favorite events and creators</p>
            </div>

            {/* Featured Items Carousel */}
            <div className="rounded-2xl mb-10 overflow-hidden">
                {/* Header with background */}
                <div className="bg-gradient-to-r from-[#FF5722] to-[#FF8C42] p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center">
                            <FiTrendingUp className="mr-2" />
                            Featured Collections
                        </h2>
                        <button className="text-sm font-medium text-white hover:text-white/90 flex items-center">
                            See All
                            <FiChevronDown className="ml-1 rotate-270" />
                        </button>
                    </div>
                </div>

                {/* Featured items with enhanced styling */}
                <div className="bg-gradient-to-b from-[#FF5722]/5 to-white p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Highlight Festival NFT collection */}
                        <motion.div
                            className="col-span-1 sm:col-span-2 lg:col-span-2 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                    alt="Featured Collection"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6 text-white">
                                    <span className="bg-[#FF5722] text-white text-xs font-medium px-2 py-1 rounded-md">FEATURED</span>
                                    <h3 className="text-2xl font-bold mt-2">Live Music NFT Collection</h3>
                                    <p className="text-white/90 mt-1">Exclusive memories from top festivals</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center">
                                            <img
                                                src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80"
                                                alt="Creator"
                                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                            />
                                            <div className="ml-2">
                                                <p className="text-xs font-medium">Created by</p>
                                                <p className="text-sm font-bold">MusicMoments</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-white/90 bg-black/40 px-3 py-1 rounded-full text-sm">
                                            <FiClock className="mr-2" />
                                            Ends in 2 days
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
                                    >
                                        <FiHeart />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Regular featured items */}
                        {marketItems.slice(0, 3).map(item => (
                            <motion.div
                                key={`featured-${item.id}`}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="relative h-40">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => toggleWishlist(item.id)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${wishlistedItems.includes(item.id)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/80 text-gray-600 hover:text-red-500'
                                                }`}
                                        >
                                            <FiHeart />
                                        </motion.button>
                                    </div>
                                    {item.verified && (
                                        <div className="absolute top-2 left-2">
                                            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md flex items-center">
                                                <FiAward className="mr-1" />
                                                Verified
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                        <div className="flex justify-between items-center">
                                            <div className="text-white text-xs flex items-center">
                                                <FiClock className="mr-1" />
                                                {item.timeLeft}
                                            </div>
                                            <div className="text-white text-xs flex items-center">
                                                <FiStar className="text-yellow-400 mr-1" />
                                                {item.rating}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 mb-1 truncate">{item.title}</h3>
                                    <div className="flex justify-between items-center">
                                        <div className="text-[#FF5722] font-semibold">
                                            {item.price} {item.currency}
                                        </div>
                                        <div className="text-xs text-gray-500 rounded-full bg-gray-100 px-2 py-0.5">
                                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* NFT Drops Section */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <RiNftFill className="mr-2 text-[#FF5722]" />
                        Exclusive NFT Drops
                    </h2>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                        View Calendar
                        <FiCalendar className="ml-2" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {nftDrops.map(drop => (
                        <motion.div
                            key={drop.id}
                            className={`bg-gradient-to-br ${drop.gradient} rounded-xl overflow-hidden shadow-lg relative group`}
                            whileHover={{ y: -5 }}
                        >
                            <div className="absolute inset-0 bg-black/30 transition-opacity"></div>
                            <img
                                src={drop.image}
                                alt={drop.title}
                                className={`w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-500 ${drop.status === 'ended' ? 'grayscale' : ''}`}
                            />

                            {drop.status === 'live' && (
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <span className="animate-pulse bg-red-500 text-white text-xs uppercase font-bold tracking-wider px-2 py-1 rounded flex items-center">
                                        <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                                        Live Now
                                    </span>
                                </div>
                            )}

                            {drop.status === 'ended' && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12">
                                    <span className="text-2xl font-bold uppercase tracking-wider bg-red-500/80 text-white px-6 py-2 rounded backdrop-blur-sm border-2 border-white/50">
                                        Sold Out
                                    </span>
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black to-transparent">
                                <div className="mb-3 flex justify-between items-center">
                                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${drop.status === 'upcoming' ? 'bg-pink-500' :
                                        drop.status === 'live' ? 'bg-red-500' : 'bg-gray-500'
                                        } text-white`}>
                                        {drop.statusLabel}
                                    </span>
                                    <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                        {drop.date}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{drop.title}</h3>
                                <p className="text-white/80 text-sm mb-3">By {drop.creator}</p>
                                <div className="flex justify-between items-center">
                                    <div className="text-white font-medium">
                                        {drop.status === 'live' && drop.soldPercentage ? (
                                            <span className="text-green-300">{drop.soldPercentage}% sold</span>
                                        ) : (
                                            drop.price
                                        )}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={drop.buttonAction}
                                        className={`${drop.status === 'upcoming' ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30' :
                                            drop.status === 'live' ? 'bg-white text-red-500 hover:bg-gray-100' :
                                                'bg-white/10 text-white/70 hover:bg-white/20'
                                            } px-3 py-1 rounded-lg text-sm transition-colors ${drop.status === 'live' ? 'font-medium' : ''
                                            }`}
                                    >
                                        {drop.buttonText}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Popular Creators Section */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <FiUser className="mr-2 text-[#FF5722]" />
                        Popular Creators
                    </h2>
                    <button className="text-sm font-medium text-[#FF5722] hover:underline flex items-center">
                        View All
                        <FiChevronRight className="ml-1" />
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {creators.map(creator => (
                        <motion.div
                            key={creator.id}
                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 text-center group"
                            whileHover={{ y: -5 }}
                        >
                            <div className={`h-24 bg-gradient-to-r ${creator.gradient} relative`}>
                                <div className="absolute -bottom-8 inset-x-0 flex justify-center">
                                    <img
                                        src={creator.image}
                                        alt={creator.name}
                                        className="w-16 h-16 rounded-full border-4 border-white object-cover group-hover:scale-105 transition-transform"
                                    />
                                </div>
                            </div>
                            <div className="pt-10 pb-4 px-4">
                                <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                                <p className="text-xs text-gray-500 mb-2">{creator.profession}</p>
                                {creator.verified && (
                                    <div className="flex items-center justify-center text-xs">
                                        <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full flex items-center">
                                            <FiAward className="mr-1" />
                                            Verified
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Category Navigation */}
            <div className="overflow-x-auto pb-2 mb-6">
                <div className="flex space-x-2 min-w-max">
                    {marketCategories.map(category => (
                        <motion.button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-lg flex items-center ${activeCategory === category.id
                                ? 'bg-[#FF5722] text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search in marketplace..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full py-2.5 pl-10 pr-4 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all text-gray-700"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FiSearch className="w-5 h-5" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* View Mode Switcher */}
                    <div className="bg-white border border-gray-200 rounded-lg flex overflow-hidden shadow-sm">
                        <motion.button
                            whileHover={{ backgroundColor: viewMode !== 'list' ? 'rgba(255, 242, 238, 0.5)' : undefined }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewModeChange('list')}
                            className={`p-2 xs:p-2.5 transition-colors duration-300 flex items-center ${viewMode === 'list'
                                ? 'bg-[#FF5722]/10 text-[#FF5722]'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            aria-label="List view"
                        >
                            <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="sr-only sm:not-sr-only sm:ml-1.5 text-xs sm:text-sm hidden md:inline">List</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ backgroundColor: viewMode !== 'grid' ? 'rgba(255, 242, 238, 0.5)' : undefined }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewModeChange('grid')}
                            className={`p-2 xs:p-2.5 transition-colors duration-300 flex items-center ${viewMode === 'grid'
                                ? 'bg-[#FF5722]/10 text-[#FF5722]'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            aria-label="Grid view"
                        >
                            <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="sr-only sm:not-sr-only sm:ml-1.5 text-xs sm:text-sm hidden md:inline">Grid</span>
                        </motion.button>
                    </div>

                    {/* Sort Options */}
                    <div className="relative">
                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-2 pr-8 appearance-none shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                        >
                            <option value="trending">Trending</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                            <option value="newest">Newest</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Filters Button */}
                    <div className="relative" ref={filterRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-3 py-2 rounded-lg border flex items-center gap-2 text-sm font-medium ${activeFilters.length > 0 || isVerifiedFilter
                                ? 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                } shadow-sm transition-colors duration-200`}
                        >
                            <FiFilter size={16} />
                            Filters
                            {(activeFilters.length > 0 || isVerifiedFilter) && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-5 h-5 rounded-full bg-[#FF5722] text-white text-xs flex items-center justify-center"
                                >
                                    {activeFilters.length + (isVerifiedFilter ? 1 : 0)}
                                </motion.span>
                            )}
                        </motion.button>

                        {/* Filters Dropdown */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-30"
                                >
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                                        <div className="mb-4">
                                            <div className="flex justify-between mb-2">
                                                <div className="w-1/2 pr-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Min"
                                                        value={minPrice}
                                                        onChange={(e) => handlePriceChange(e, 'min')}
                                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <div className="w-1/2 pl-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Max"
                                                        value={maxPrice}
                                                        onChange={(e) => handlePriceChange(e, 'max')}
                                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="3000"
                                                step="50"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                                className="w-full accent-[#FF5722]"
                                            />
                                        </div>

                                        {/* Verification Filter */}
                                        <div className="mb-4">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isVerifiedFilter}
                                                    onChange={() => setIsVerifiedFilter(!isVerifiedFilter)}
                                                    className="w-4 h-4 accent-[#FF5722]"
                                                />
                                                <span className="text-sm text-gray-700">Verified items only</span>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <button
                                                onClick={() => {
                                                    setActiveFilters([]);
                                                    setMinPrice(0);
                                                    setMaxPrice(1000);
                                                    setIsVerifiedFilter(false);
                                                }}
                                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                            >
                                                Clear all
                                            </button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setShowFilters(false)}
                                                className="px-4 py-2 bg-[#FF5722] text-white rounded-lg text-sm font-medium shadow-sm hover:bg-[#E64A19] transition-colors duration-200"
                                            >
                                                Apply Filters
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Marketplace Items */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                {sortedItems.length > 0 ? (
                    sortedItems.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 ${viewMode === 'list' ? 'flex' : ''
                                }`}
                            whileHover={{ y: -4 }}
                        >
                            <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'h-48'}`}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleWishlist(item.id)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${wishlistedItems.includes(item.id)
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white/80 text-gray-600 hover:text-red-500'
                                            }`}
                                    >
                                        <FiHeart />
                                    </motion.button>
                                </div>
                                {item.verified && (
                                    <div className="absolute top-2 left-2">
                                        <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md flex items-center">
                                            <FiAward className="mr-1" />
                                            Verified
                                        </div>
                                    </div>
                                )}
                                {item.timeLeft && (
                                    <div className="absolute bottom-2 left-2">
                                        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                                            <FiClock className="mr-1" />
                                            {item.timeLeft}
                                        </div>
                                    </div>
                                )}
                                <div className="absolute bottom-2 right-2">
                                    <div className="bg-[#FF5722] text-white text-xs px-2 py-1 rounded-md">
                                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                                <h3 className="font-medium text-gray-900 text-lg mb-1 truncate">{item.title}</h3>
                                <p className="text-sm text-gray-500 mb-2">By {item.creator}</p>

                                <div className="flex justify-between items-center mb-3">
                                    <div className="text-[#FF5722] font-semibold">
                                        {item.price} {item.currency}
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <FiStar className="text-yellow-500 mr-1" />
                                        {item.rating} ({item.sales})
                                    </div>
                                </div>

                                {viewMode === 'list' && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {item.location || item.rarity || item.duration || item.benefits || item.size || 'Limited edition item'}
                                    </p>
                                )}

                                <div className="flex space-x-2">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="flex-1 py-2 px-4 bg-[#FF5722] text-white text-sm font-medium rounded-lg shadow-sm hover:bg-[#E64A19] transition-colors flex items-center justify-center"
                                    >
                                        <FiShoppingCart className="mr-2" />
                                        Buy Now
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="py-2 px-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <FiBookmark />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center bg-gray-50 rounded-xl">
                        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                            <FiShoppingBag className="text-gray-400 w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-1">No items found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search query</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {sortedItems.length > 0 && (
                <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="px-4 py-2 bg-[#FF5722] text-white rounded-lg font-medium">
                            1
                        </button>
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                            2
                        </button>
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                            3
                        </button>
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marketplace;