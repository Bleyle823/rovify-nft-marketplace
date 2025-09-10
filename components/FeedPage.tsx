/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import {
    FiHeart, FiMessageSquare, FiShare2, FiBookmark, FiMoreHorizontal,
    FiPlay, FiCalendar, FiMapPin, FiImage, FiVideo, FiPlus, FiChevronRight,
    FiX, FiCamera, FiSmile, FiClock, FiTrendingUp, FiFilter, FiAlertCircle
} from 'react-icons/fi';
import { IoTicket, IoFlame } from 'react-icons/io5';
import { BsMusicNote, BsCameraVideoFill, BsLightning } from 'react-icons/bs';
import { HiOutlineSparkles } from 'react-icons/hi';
import { FaUser } from 'react-icons/fa';
import { RiVipCrownFill } from 'react-icons/ri';

// Types
interface Memory {
    id: string;
    type: 'image' | 'video' | 'event' | 'nft';
    user: {
        id: string;
        name: string;
        avatar: string;
        isVerified?: boolean;
    };
    content: {
        media?: string;
        caption?: string;
        location?: string;
        timestamp: number; // UNIX timestamp
        eventDetails?: {
            title: string;
            date: string;
            location: string;
            ticketInfo?: string;
        };
        nftDetails?: {
            title: string;
            collection: string;
            price: string;
            currency: string;
        };
    };
    stats: {
        likes: number;
        comments: number;
        shares: number;
        isLiked?: boolean;
        isBookmarked?: boolean;
    };
    tags?: string[];
}

interface NFTCard {
    id: string;
    title: string;
    image: string;
    collection: string;
    owner: {
        name: string;
        avatar: string;
        isVerified?: boolean;
    };
    price: string;
    currency: string;
    endTime?: number; // For auction NFTs
    tags?: string[];
}

interface LiveStream {
    id: string;
    title: string;
    thumbnail: string;
    user: {
        name: string;
        avatar: string;
        isVerified?: boolean;
    };
    viewers: number;
    category: string;
    isLive: boolean;
}

// Mock data for memories/posts
const mockMemories: Memory[] = [
    {
        id: 'm1',
        type: 'image',
        user: {
            id: 'u1',
            name: 'Alex Rivera',
            avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: true
        },
        content: {
            media: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
            caption: 'Epic night at Summer Festival! The lights, music, and energy were absolutely insane 🔥 #SummerFestival2025 #NightToRemember',
            location: 'Central Park Main Stage',
            timestamp: Date.now() - 3600000 // 1 hour ago
        },
        stats: {
            likes: 243,
            comments: 42,
            shares: 18,
            isLiked: true
        },
        tags: ['SummerFestival2025', 'MusicLovers', 'NightLife']
    },
    {
        id: 'm2',
        type: 'event',
        user: {
            id: 'u2',
            name: 'TechConf Official',
            avatar: 'https://images.unsplash.com/photo-1579547945413-497e1b99f0dd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: true
        },
        content: {
            media: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
            caption: 'Tickets for the most anticipated tech conference of the year are now live! Join us for three days of innovation, networking, and inspiration.',
            timestamp: Date.now() - 86400000, // 1 day ago
            eventDetails: {
                title: 'Tech Summit 2025',
                date: 'May 15-17, 2025',
                location: 'Innovation Center, San Francisco',
                ticketInfo: 'Limited early bird NFT tickets available'
            }
        },
        stats: {
            likes: 512,
            comments: 87,
            shares: 134,
            isBookmarked: true
        },
        tags: ['TechSummit', 'Innovation', 'Web3Conference']
    },
    {
        id: 'm3',
        type: 'video',
        user: {
            id: 'u3',
            name: 'Jamie Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80'
        },
        content: {
            media: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
            caption: 'Caught this amazing moment at the acoustic set! Absolutely magical when everyone lit up their phones 💫',
            location: 'Twilight Amphitheater',
            timestamp: Date.now() - 7200000 // 2 hours ago
        },
        stats: {
            likes: 872,
            comments: 119,
            shares: 56
        },
        tags: ['LiveMusic', 'AcousticVibes', 'ConcertMoments']
    },
    {
        id: 'm4',
        type: 'nft',
        user: {
            id: 'u4',
            name: 'Crypto Gallery',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: true
        },
        content: {
            media: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
            caption: 'Just dropped: "Ethereal Memories" - our latest NFT collection capturing the essence of music festival moments. Limited edition of 50.',
            timestamp: Date.now() - 172800000, // 2 days ago
            nftDetails: {
                title: 'Ethereal Memories #28',
                collection: 'Festival Moments',
                price: '0.5',
                currency: 'ETH'
            }
        },
        stats: {
            likes: 328,
            comments: 47,
            shares: 89
        },
        tags: ['NFTArt', 'DigitalCollectibles', 'Web3']
    },
    {
        id: 'm5',
        type: 'image',
        user: {
            id: 'u5',
            name: 'Sophia Willis',
            avatar: 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: false
        },
        content: {
            media: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
            caption: 'Dancing until sunrise at the Beach Party Extravaganza! Best night of the summer so far! 🌊 #BeachVibes #DanceAllNight',
            location: 'Ocean Drive Beach',
            timestamp: Date.now() - 5400000 // 1.5 hours ago
        },
        stats: {
            likes: 312,
            comments: 28,
            shares: 14
        },
        tags: ['BeachParty', 'SummerVibes', 'Sunrise']
    },
    {
        id: 'm6',
        type: 'event',
        user: {
            id: 'u6',
            name: 'Art Collective',
            avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: true
        },
        content: {
            media: 'https://images.unsplash.com/photo-1508997449629-303059a039c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
            caption: 'Join us for an immersive art experience! "Digital Dreamscapes" exhibition opens next weekend with interactive installations and NFT displays.',
            timestamp: Date.now() - 129600000, // 1.5 days ago
            eventDetails: {
                title: 'Digital Dreamscapes Exhibition',
                date: 'May 20-27, 2025',
                location: 'Modern Gallery, New York',
                ticketInfo: 'NFT ticket holders get exclusive preview access'
            }
        },
        stats: {
            likes: 428,
            comments: 63,
            shares: 97
        },
        tags: ['DigitalArt', 'NFTExhibition', 'ImmersiveArt']
    }
];

// Mock data for trending NFTs
const trendingNFTs: NFTCard[] = [
    {
        id: 'nft1',
        title: 'VIP Access: Summer Festival',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        collection: 'Premium Events',
        owner: {
            name: 'Festival DAO',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: true
        },
        price: '0.8',
        currency: 'ETH',
        endTime: Date.now() + 172800000, // Ends in 2 days
        tags: ['VIPAccess', 'Festival', 'ExclusivePass']
    },
    {
        id: 'nft2',
        title: 'Backstage Moment #12',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        collection: 'Concert Memories',
        owner: {
            name: 'MusicDAO',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: true
        },
        price: '0.35',
        currency: 'ETH',
        tags: ['Backstage', 'ArtistMoment', 'MusicNFT']
    },
    {
        id: 'nft3',
        title: 'TechSummit Workshop Pass',
        image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        collection: 'Conference Passes',
        owner: {
            name: 'TechConf',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: true
        },
        price: '0.2',
        currency: 'ETH',
        endTime: Date.now() + 86400000, // Ends in 1 day
        tags: ['Workshop', 'TechConference', 'LimitedPass']
    },
    {
        id: 'nft4',
        title: 'Neon Dreams #03',
        image: 'https://images.unsplash.com/photo-1633280966563-21e938b6a492?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        collection: 'Digital Artscapes',
        owner: {
            name: 'NeonCollective',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: true
        },
        price: '0.6',
        currency: 'ETH',
        tags: ['DigitalArt', 'NeonAesthetics', 'CyberArt']
    },
    {
        id: 'nft5',
        title: 'Audio Experience: DJ Set',
        image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        collection: 'Music Collectibles',
        owner: {
            name: 'SoundDAO',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: false
        },
        price: '0.15',
        currency: 'ETH',
        endTime: Date.now() + 259200000, // Ends in 3 days
        tags: ['AudioNFT', 'MusicMix', 'DJSet']
    }
];

// Mock data for live streams
const liveStreams: LiveStream[] = [
    {
        id: 'live1',
        title: 'DJ Set: Pre-Festival Warm Up',
        thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        user: {
            name: 'ElectroBeats',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: true
        },
        viewers: 1245,
        category: 'Music',
        isLive: true
    },
    {
        id: 'live2',
        title: 'Tech Talk: Future of Event NFTs',
        thumbnail: 'https://images.unsplash.com/photo-1528695042311-d13e46c1d25c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        user: {
            name: 'Web3 Events',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: true
        },
        viewers: 872,
        category: 'Technology',
        isLive: true
    },
    {
        id: 'live3',
        title: 'Backstage Tour: Summer Festival Setup',
        thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        user: {
            name: 'Festival Insider',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80'
        },
        viewers: 533,
        category: 'Behind the Scenes',
        isLive: true
    },
    {
        id: 'live4',
        title: 'Live Painting: Festival Art Wall',
        thumbnail: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        user: {
            name: 'ArtistCollective',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: true
        },
        viewers: 688,
        category: 'Art',
        isLive: true
    },
    {
        id: 'live5',
        title: 'Live from the Main Stage',
        thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        user: {
            name: 'SummerFest Official',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80',
            isVerified: true
        },
        viewers: 3245,
        category: 'Music',
        isLive: true
    }
];

// Main Feed Component
export default function Feed() {
    const [activeTab, setActiveTab] = useState<'all' | 'memories' | 'events' | 'nfts' | 'live'>('all');
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showStoryCreation, setShowStoryCreation] = useState(true);
    const storyCreationRef = useRef<HTMLDivElement>(null);
    const feedScrollRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [hasNewContent, setHasNewContent] = useState(false);

    // Track scroll position
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleScroll = () => {
            setScrollPosition(window.scrollY);

            if (window.scrollY > 100) {
                setShowStoryCreation(false);
            } else {
                setShowStoryCreation(true);
            }

            // If scrolled to top, mark as viewed
            if (window.scrollY === 0) {
                setHasNewContent(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Simulate new content arriving
        const newContentTimer = setTimeout(() => {
            if (scrollPosition > 300) {
                setHasNewContent(true);
            }
        }, 20000);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(newContentTimer);
        };
    }, [scrollPosition]);

    // Handle new content notification
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setHasNewContent(false);
    };

    // Filter memories based on active tab
    const getFilteredContent = () => {
        switch (activeTab) {
            case 'memories':
                return mockMemories.filter(memory => memory.type === 'image' || memory.type === 'video');
            case 'events':
                return mockMemories.filter(memory => memory.type === 'event');
            case 'nfts':
                return mockMemories.filter(memory => memory.type === 'nft');
            default:
                return mockMemories;
        }
    };

    const filteredMemories = getFilteredContent();

    // Format timestamp to relative time
    const formatRelativeTime = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + 'y';

        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + 'mo';

        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + 'd';

        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + 'h';

        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + 'm';

        return 'just now';
    };

    // Toast notification handler
    const showToastNotification = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return (
        <div ref={feedScrollRef} className="pb-20 bg-gray-50/50">
            {/* Story Creation Area - Slides up when scrolling */}
            <AnimatePresence>
                {showStoryCreation && (
                    <motion.div
                        ref={storyCreationRef}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4 overflow-hidden"
                    >
                        <div className="relative mx-auto max-w-2xl bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden backdrop-blur-md">
                            <div className="p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FF5722] ring-2 ring-[#FF5722]/20">
                                        <Image
                                            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80"
                                            alt="Your Avatar"
                                            width={40}
                                            height={40}
                                            className="object-cover"
                                        />
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setIsPostModalOpen(true)}
                                        className="flex-1 bg-gray-50 rounded-full px-5 py-3 text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors shadow-inner"
                                    >
                                        What&apos;s happening at your event?
                                    </motion.div>
                                </div>

                                <div className="flex justify-between pt-3 border-t border-gray-100">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setIsPostModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors group"
                                    >
                                        <div className="p-2 rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                                            <FiImage className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Photo</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setIsPostModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors group"
                                    >
                                        <div className="p-2 rounded-full bg-red-500/10 text-red-500 group-hover:bg-red-500/20 transition-colors">
                                            <FiVideo className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Video</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setIsPostModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-purple-50 transition-colors group"
                                    >
                                        <div className="p-2 rounded-full bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20 transition-colors">
                                            <BsMusicNote className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Music</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setIsPostModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-green-50 transition-colors group"
                                    >
                                        <div className="p-2 rounded-full bg-green-500/10 text-green-500 group-hover:bg-green-500/20 transition-colors">
                                            <IoTicket className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Event</span>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Glowing accent border at the top */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-[#FF5722] animate-shimmer"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Feed Tabs & Filters */}
            <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-2xl mx-auto px-4 flex justify-between items-center py-2">
                    <div className="flex space-x-1 overflow-x-auto no-scrollbar">
                        <TabButton
                            label="For You"
                            isActive={activeTab === 'all'}
                            onClick={() => setActiveTab('all')}
                        />
                        <TabButton
                            label="Memories"
                            isActive={activeTab === 'memories'}
                            onClick={() => setActiveTab('memories')}
                        />
                        <TabButton
                            label="Events"
                            isActive={activeTab === 'events'}
                            onClick={() => setActiveTab('events')}
                        />
                        <TabButton
                            label="NFTs"
                            isActive={activeTab === 'nfts'}
                            onClick={() => setActiveTab('nfts')}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFilterModalOpen(true)}
                        className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <FiFilter className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline">Filter</span>
                    </motion.button>
                </div>
            </div>

            {/* Main Feed Content */}
            <div className="max-w-2xl mx-auto pt-5 px-4">
                {/* Live Streams Horizontal Scroll */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-gray-900">Live Now</h2>
                            <div className="px-1.5 py-0.5 bg-red-500/10 rounded-md">
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-xs font-medium text-red-600">{liveStreams.length}</span>
                                </div>
                            </div>
                        </div>
                        <Link href="/streaming" className="text-sm font-medium text-[#FF5722] flex items-center group">
                            See All <FiChevronRight className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto pb-3 -mx-4 px-4 flex space-x-4 scrollbar-hide">
                        {liveStreams.map(stream => (
                            <LiveStreamCard key={stream.id} stream={stream} />
                        ))}

                        {/* Start your own stream button */}
                        <div className="flex-shrink-0 w-40 sm:w-48 h-56 rounded-xl overflow-hidden relative group border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-white">
                            <div className="bg-[#FF5722]/10 w-14 h-14 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <BsCameraVideoFill className="text-[#FF5722] w-6 h-6" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">Go Live</p>
                            <p className="text-xs text-gray-500 text-center px-2 mt-1">Share your event experience in real-time</p>

                            <Link href="/streaming/create" className="mt-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-[#FF5722]/10 hover:bg-[#FF5722]/20 text-[#FF5722] font-medium text-sm py-2 px-4 rounded-full transition-colors"
                                >
                                    Start Streaming
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* NFT Showcase */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-gray-900">Trending NFTs</h2>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
                                <BsLightning className="text-amber-500 w-3 h-3" />
                                <span className="text-xs font-medium text-gray-700">Hot</span>
                            </div>
                        </div>
                        <Link href="/nft-marketplace" className="text-sm font-medium text-[#FF5722] flex items-center group">
                            Explore <FiChevronRight className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto pb-4 -mx-4 px-4 flex space-x-4 scrollbar-hide">
                        {trendingNFTs.map(nft => (
                            <NFTCard key={nft.id} nft={nft} />
                        ))}

                        {/* Create NFT button */}
                        <div className="flex-shrink-0 w-40 sm:w-48 h-64 rounded-xl overflow-hidden relative group border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-white">
                            <div className="bg-[#FF5722]/10 w-14 h-14 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <HiOutlineSparkles className="text-[#FF5722] w-6 h-6" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">Create NFT</p>
                            <p className="text-xs text-gray-500 text-center px-2 mt-1">Mint your event moments as digital collectibles</p>

                            <Link href="/nft/create" className="mt-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-[#FF5722]/10 hover:bg-[#FF5722]/20 text-[#FF5722] font-medium text-sm py-2 px-4 rounded-full transition-colors"
                                >
                                    Start Creating
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Feed Content */}
                <div className="space-y-6">
                    {filteredMemories.length > 0 ? (
                        filteredMemories.map((memory, index) => (
                            <motion.div
                                key={memory.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                            >
                                <MemoryCard
                                    memory={memory}
                                    formatTime={formatRelativeTime}
                                    showToast={showToastNotification}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12 px-4 bg-white rounded-2xl shadow-sm border border-gray-100"
                        >
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FiAlertCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-700 mb-3">No content found in this category.</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab('all')}
                                className="mt-3 px-5 py-2.5 bg-[#FF5722] text-white font-medium rounded-full hover:bg-[#E64A19] transition-colors"
                            >
                                View all content
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* New Content Notification */}
            <AnimatePresence>
                {hasNewContent && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 left-0 right-0 flex justify-center z-40"
                        onClick={scrollToTop}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#FF5722] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                            <IoFlame className="w-4 h-4" />
                            <span className="text-sm font-medium">New content available</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Create Button - Mobile Only */}
            {isMobile && (
                <motion.button
                    onClick={() => setIsPostModalOpen(true)}
                    className="fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-[#FF5722] to-[#FF7A50] flex items-center justify-center shadow-lg"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(255, 87, 34, 0.3)" }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <FiPlus className="text-white w-6 h-6" />
                    <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping-slow"></div>
                </motion.button>
            )}

            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-28 left-0 right-0 flex justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl max-w-xs mx-4">
                            <p className="text-sm text-center">{toastMessage}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Post Creation Modal */}
            <AnimatePresence>
                {isPostModalOpen && (
                    <PostCreationModal
                        onClose={() => setIsPostModalOpen(false)}
                        onPost={(type) => {
                            setIsPostModalOpen(false);
                            showToastNotification(`Your ${type} has been posted successfully!`);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Filter Modal */}
            <AnimatePresence>
                {isFilterModalOpen && (
                    <FilterModal
                        onClose={() => setIsFilterModalOpen(false)}
                        onApply={() => {
                            setIsFilterModalOpen(false);
                            showToastNotification('Filters applied successfully');
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Global Styles */}
            <style jsx global>{`
                .scrollbar-hide, .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .scrollbar-hide::-webkit-scrollbar, .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                
                @keyframes pulse-ring {
                    0% { box-shadow: 0 0 0 0 rgba(255, 87, 34, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(255, 87, 34, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 87, 34, 0); }
                }
                
                .live-indicator {
                    animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
                }
                
                .bookmark-enter {
                    animation: bookmark-bounce 0.5s ease-in-out;
                }
                
                @keyframes bookmark-bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
                
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                .animate-shimmer {
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite linear;
                }
                
                @keyframes ping-slow {
                    0% { transform: scale(1); opacity: 0.2; }
                    50% { opacity: 0.1; }
                    100% { transform: scale(1.8); opacity: 0; }
                }
                
                .animate-ping-slow {
                    animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                
                @keyframes blob-pulse {
                    0% { transform: scale(1); }
                    33% { transform: scale(1.1); }
                    66% { transform: scale(0.9); }
                    100% { transform: scale(1); }
                }
                
                .animate-blob {
                    animation: blob-pulse 4s infinite ease-in-out;
                }
                
                .animate-blob-delay {
                    animation: blob-pulse 4s infinite ease-in-out;
                    animation-delay: 2s;
                }
                
                .card-hover {
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                }
                
                .card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 20px -10px rgba(0, 0, 0, 0.1);
                }
                
                .like-animation {
                    animation: like-pulse 0.3s ease-in-out;
                }
                
                @keyframes like-pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

// Feed Tab Button Component with enhanced animation
function TabButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
    return (
        <motion.button
            onClick={onClick}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors relative overflow-hidden ${isActive
                ? 'text-[#FF5722]'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {label}
            {isActive && (
                <motion.div
                    layoutId="activeFeedTab"
                    className="absolute inset-0 bg-[#FF5722]/10 rounded-xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </motion.button>
    );
}

// Enhanced Memory/Post Card Component
function MemoryCard({
    memory,
    formatTime,
    showToast
}: {
    memory: Memory;
    formatTime: (timestamp: number) => string;
    showToast: (message: string) => void;
}) {
    const [isLiked, setIsLiked] = useState(memory.stats.isLiked || false);
    const [isBookmarked, setIsBookmarked] = useState(memory.stats.isBookmarked || false);
    const [likeCount, setLikeCount] = useState(memory.stats.likes);
    const [showOptions, setShowOptions] = useState(false);
    const [likeAnimation, setLikeAnimation] = useState(false);
    const cardControls = useAnimation();
    const tagScrollRef = useRef<HTMLDivElement>(null);

    const handleLike = () => {
        if (isLiked) {
            setLikeCount(prev => prev - 1);
            showToast('Memory unliked');
        } else {
            setLikeCount(prev => prev + 1);
            setLikeAnimation(true);
            showToast('Memory liked');

            // Reset animation state after animation completes
            setTimeout(() => {
                setLikeAnimation(false);
            }, 300);
        }
        setIsLiked(!isLiked);
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        showToast(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');

        // Add bookmark animation
        const bookmarkButton = document.getElementById(`bookmark-${memory.id}`);
        if (bookmarkButton) {
            bookmarkButton.classList.add('bookmark-enter');
            setTimeout(() => {
                bookmarkButton.classList.remove('bookmark-enter');
            }, 500);
        }
    };

    const handleShare = () => {
        showToast('Sharing options opened');
    };

    return (
        <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover"
            whileHover={{ y: -3 }}
            animate={cardControls}
        >
            {/* Card Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href={`/profile/${memory.user.id}`}>
                        <motion.div
                            className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100 hover:ring-[#FF5722]/20 transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Image
                                src={memory.user.avatar || '/assets/avatars/default.jpg'}
                                alt={memory.user.name}
                                width={44}
                                height={44}
                                className="object-cover"
                            />
                            {memory.user.isVerified && (
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#FF5722] rounded-full flex items-center justify-center border-2 border-white">
                                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white" fill="currentColor">
                                        <path d="M9.58 18l-5.3-5.3 1.41-1.41L9.58 15.17l8.83-8.83 1.41 1.41z" />
                                    </svg>
                                </div>
                            )}
                        </motion.div>
                    </Link>

                    <div>
                        <Link href={`/profile/${memory.user.id}`}>
                            <h3 className="font-semibold text-gray-900 leading-tight flex items-center gap-1 hover:text-[#FF5722] transition-colors">
                                {memory.user.name}
                                {memory.user.isVerified && (
                                    <span className="inline-block w-4 h-4 bg-[#FF5722] rounded-full flex-shrink-0 items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white" fill="currentColor">
                                            <path d="M9.58 18l-5.3-5.3 1.41-1.41L9.58 15.17l8.83-8.83 1.41 1.41z" />
                                        </svg>
                                    </span>
                                )}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            {memory.content.location && (
                                <>
                                    <FiMapPin className="w-3 h-3" />
                                    <span className="hover:text-[#FF5722] cursor-pointer transition-colors">
                                        {memory.content.location}
                                    </span>
                                    <span className="mx-1">•</span>
                                </>
                            )}
                            <span>{formatTime(memory.content.timestamp)}</span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowOptions(!showOptions)}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <FiMoreHorizontal className="text-gray-600" />
                    </motion.button>

                    <AnimatePresence>
                        {showOptions && (
                            <motion.div
                                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10 overflow-hidden"
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                            >
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2">
                                    <FiAlertCircle className="w-4 h-4 text-gray-500" />
                                    Report content
                                </button>
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2">
                                    <FiX className="w-4 h-4 text-gray-500" />
                                    Not interested
                                </button>
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2">
                                    <FiShare2 className="w-4 h-4 text-gray-500" />
                                    Share via...
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Media Content */}
            {memory.content.media && (
                <div className="relative">
                    {memory.type === 'video' ? (
                        <div className="aspect-video bg-black relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.button
                                    className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border-2 border-white/70"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiPlay className="w-6 h-6 text-white ml-1" />
                                </motion.button>
                            </div>
                            <Image
                                src={memory.content.media}
                                alt="Video thumbnail"
                                width={600}
                                height={400}
                                className="object-cover w-full h-full"
                            />

                            {/* Video Duration Indicator */}
                            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-white text-xs font-medium">
                                3:24
                            </div>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden">
                            <Image
                                src={memory.content.media}
                                alt={memory.content.caption || 'Memory image'}
                                width={600}
                                height={memory.type === 'event' || memory.type === 'nft' ? 400 : 600}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />

                            {/* Double tap to like overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <AnimatePresence>
                                    {likeAnimation && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1.5 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <FiHeart className="w-20 h-20 text-white fill-white drop-shadow-lg" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {/* Special overlays for different types */}
                    {memory.type === 'event' && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                                    <FiCalendar className="text-[#FF5722] w-5 h-5" />
                                </div>

                                <div className="text-white">
                                    <h3 className="font-semibold text-lg">{memory.content.eventDetails?.title}</h3>
                                    <p className="text-sm text-white/90">{memory.content.eventDetails?.date}</p>
                                    <p className="text-sm text-white/90">{memory.content.eventDetails?.location}</p>

                                    <Link href={`/events/${memory.id}`}>
                                        <motion.button
                                            className="mt-2 bg-[#FF5722] hover:bg-[#E64A19] px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 shadow-md"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <IoTicket className="w-4 h-4" />
                                            Get Tickets
                                        </motion.button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {memory.type === 'nft' && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg py-1 px-3 shadow-lg">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse"></div>
                                <span className="text-xs font-medium text-gray-900">NFT</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* NFT Details Section */}
            {memory.type === 'nft' && memory.content.nftDetails && (
                <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-medium text-gray-900">{memory.content.nftDetails.title}</h3>
                            <p className="text-sm text-gray-600">{memory.content.nftDetails.collection}</p>
                        </div>

                        <div className="text-right">
                            <p className="font-semibold text-gray-900 flex items-center gap-1">
                                <span className="text-sm text-gray-600">Price:</span>
                                {memory.content.nftDetails.price} {memory.content.nftDetails.currency}
                            </p>
                            <Link href={`/nft/${memory.id}`}>
                                <motion.button
                                    className="mt-1 bg-[#FF5722]/10 text-[#FF5722] px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#FF5722]/20 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    View NFT
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Caption */}
            {memory.content.caption && (
                <div className="px-4 py-3">
                    <p className="text-gray-800 whitespace-pre-line">
                        {memory.content.caption}
                    </p>

                    {memory.tags && memory.tags.length > 0 && (
                        <div
                            className="flex flex-nowrap gap-1.5 mt-2 overflow-x-auto no-scrollbar"
                            ref={tagScrollRef}
                        >
                            {memory.tags.map(tag => (
                                <Link href={`/discover/tag/${tag}`} key={tag}>
                                    <span className="inline-block px-2 py-0.5 bg-[#FF5722]/5 text-[#FF5722] text-xs font-medium rounded-full hover:bg-[#FF5722]/10 transition-colors">
                                        #{tag}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Interaction Bar */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <motion.button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 ${isLiked ? 'text-[#FF5722]' : 'text-gray-600 hover:text-[#FF5722]'} transition-colors`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        animate={likeAnimation ? { scale: [1, 1.5, 1] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        <FiHeart
                            className={`w-5 h-5 ${isLiked ? 'fill-[#FF5722] stroke-[#FF5722]' : ''}`}
                        />
                        <span className={`text-sm font-medium ${isLiked ? 'text-[#FF5722]' : ''}`}>
                            {likeCount}
                        </span>
                    </motion.button>

                    <Link href={`/memory/${memory.id}?action=comment`}>
                        <motion.button
                            className="flex items-center gap-1.5 text-gray-600 hover:text-[#FF5722] transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiMessageSquare className="w-5 h-5" />
                            <span className="text-sm font-medium">{memory.stats.comments}</span>
                        </motion.button>
                    </Link>

                    <motion.button
                        className="flex items-center gap-1.5 text-gray-600 hover:text-[#FF5722] transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleShare}
                    >
                        <FiShare2 className="w-5 h-5" />
                        <span className="text-sm font-medium">{memory.stats.shares}</span>
                    </motion.button>
                </div>

                <motion.button
                    id={`bookmark-${memory.id}`}
                    onClick={handleBookmark}
                    className={`text-gray-600 hover:text-[#FF5722] transition-colors`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FiBookmark
                        className={`w-5 h-5 ${isBookmarked ? 'text-[#FF5722] fill-[#FF5722]' : ''}`}
                    />
                </motion.button>
            </div>
        </motion.div>
    );
}

// Enhanced NFT Card Component
function NFTCard({ nft }: { nft: NFTCard }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    const [isHovering, setIsHovering] = useState(false);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 100);
        y.set(yPct * 100);
    }

    return (
        <motion.div
            className="flex-shrink-0 w-40 sm:w-48 rounded-xl overflow-hidden shadow-md border border-gray-100 bg-white relative"
            whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.2 } }}
            onMouseMove={handleMouseMove}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
            <div
                className="relative aspect-square overflow-hidden"
                style={{
                    transformStyle: "preserve-3d",
                    transform: "translateZ(20px)"
                }}
            >
                <Image
                    src={nft.image}
                    alt={nft.title}
                    width={200}
                    height={200}
                    className={`object-cover w-full h-full transition-transform duration-700 ${isHovering ? 'scale-110' : 'scale-100'}`}
                />

                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg py-1 px-2 z-10">
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-xs font-medium text-white">NFT</span>
                    </div>
                </div>

                {/* Price Tag */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg py-1 px-2 shadow-md z-10">
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-gray-900">{nft.price} {nft.currency}</span>
                    </div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

            <div className="p-3 relative" style={{ transformStyle: "preserve-3d", transform: "translateZ(10px)" }}>
                <h3 className="font-medium text-gray-900 truncate">{nft.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{nft.collection}</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-white">
                            <Image
                                src={nft.owner.avatar}
                                alt={nft.owner.name}
                                width={20}
                                height={20}
                                className="object-cover"
                            />
                        </div>
                        <span className="text-xs text-gray-700 truncate max-w-[60px]">{nft.owner.name}</span>
                        {nft.owner.isVerified && (
                            <span className="inline-block w-3 h-3 bg-[#FF5722] rounded-full flex-shrink-0 items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-2 h-2 text-white" fill="currentColor">
                                    <path d="M9.58 18l-5.3-5.3 1.41-1.41L9.58 15.17l8.83-8.83 1.41 1.41z" />
                                </svg>
                            </span>
                        )}
                    </div>
                </div>

                {nft.endTime && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-600 bg-gray-50 rounded-full px-2 py-0.5">
                        <FiClock className="w-3 h-3 text-amber-500" />
                        <span>Ends in {Math.floor((nft.endTime - Date.now()) / 3600000)}h</span>
                    </div>
                )}

                <Link href={`/nft/${nft.id}`}>
                    <motion.button
                        className="w-full mt-2 bg-[#FF5722]/10 hover:bg-[#FF5722]/20 text-[#FF5722] font-medium text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
                    >
                        <RiVipCrownFill className="w-3 h-3" />
                        View Details
                    </motion.button>
                </Link>
            </div>

            {/* Glowing effect on hover */}
            <AnimatePresence>
                {isHovering && (
                    <motion.div
                        className="absolute inset-0 -z-10 opacity-50 blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.15 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            background: 'linear-gradient(45deg, #FF5722, #FFB74D, #FF9800)',
                            borderRadius: '16px',
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Enhanced Live Stream Card Component
function LiveStreamCard({ stream }: { stream: LiveStream }) {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <Link href={`/streaming/${stream.id}`}>
            <motion.div
                className="flex-shrink-0 w-40 sm:w-48 h-56 rounded-xl overflow-hidden shadow-md border border-gray-100 bg-white relative group"
                whileHover={{ scale: 1.03, y: -5 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
            >
                <div className="relative aspect-[3/4]">
                    <Image
                        src={stream.thumbnail}
                        alt={stream.title}
                        width={200}
                        height={260}
                        className={`object-cover w-full h-full transition-transform duration-700 ${isHovering ? 'scale-110' : 'scale-100'}`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    {stream.isLive && (
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg py-1 px-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 live-indicator"></div>
                            <span className="text-xs font-medium text-white">LIVE</span>
                        </div>
                    )}

                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg py-1 px-2">
                        <div className="flex items-center gap-1">
                            <FaUser className="w-3 h-3 text-white" />
                            <span className="text-xs font-medium text-white">{stream.viewers.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-medium text-white text-sm line-clamp-1">{stream.title}</h3>

                    <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-white/30 ring-2 ring-black/20">
                            <Image
                                src={stream.user.avatar}
                                alt={stream.user.name}
                                width={20}
                                height={20}
                                className="object-cover"
                            />
                        </div>
                        <span className="text-xs text-white/90">{stream.user.name}</span>
                        {stream.user.isVerified && (
                            <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#FF5722] mt-0.5" fill="currentColor">
                                <path d="M9.58 18l-5.3-5.3 1.41-1.41L9.58 15.17l8.83-8.83 1.41 1.41z" />
                            </svg>
                        )}
                    </div>

                    <div className="mt-1 flex items-center">
                        <span className="text-xs text-white/90 bg-white/10 px-2 py-0.5 rounded-full">{stream.category}</span>
                    </div>
                </div>

                <motion.div
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovering ? 1 : 0 }}
                >
                    <motion.div
                        className="w-12 h-12 rounded-full bg-[#FF5722]/80 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300"
                        initial={{ scale: 0 }}
                        animate={{ scale: isHovering ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <FiPlay className="w-5 h-5 text-white ml-1" />
                    </motion.div>
                </motion.div>

                {/* Blob effect behind the card */}
                <AnimatePresence>
                    {isHovering && (
                        <motion.div
                            className="absolute -inset-4 -z-10 opacity-50 blur-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-red-400/50 rounded-full animate-blob"></div>
                            <div className="absolute top-1/2 right-0 w-full h-full bg-orange-400/50 rounded-full animate-blob-delay"></div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Link>
    );
}

// Enhanced Post Creation Modal
function PostCreationModal({ onClose, onPost }: { onClose: () => void; onPost: (type: string) => void }) {
    const [postText, setPostText] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [location, setLocation] = useState('');
    const [postType, setPostType] = useState<'memory' | 'event' | 'nft'>('memory');
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // Handle outside click to close
    const modalContentRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Mock file selection
    const handleFileSelection = (type: 'image' | 'video') => {
        // This would be replaced with actual file input logic
        const mockImageUrl = type === 'image'
            ? 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
            : 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80';

        setSelectedMedia(mockImageUrl);
        setMediaType(type);
    };

    const handlePost = () => {
        setIsProcessing(true);

        // Simulate posting delay
        setTimeout(() => {
            onPost(postType);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
                ref={modalContentRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden mx-4"
            >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {currentStep === 1 && (
                            <>
                                <div className="w-6 h-6 rounded-full bg-[#FF5722]/10 flex items-center justify-center text-[#FF5722] text-sm font-medium">1</div>
                                Create Memory
                            </>
                        )}
                        {currentStep === 2 && (
                            <>
                                <div className="w-6 h-6 rounded-full bg-[#FF5722]/10 flex items-center justify-center text-[#FF5722] text-sm font-medium">2</div>
                                {postType === 'memory' ? 'Add Details' :
                                    postType === 'event' ? 'Event Details' : 'NFT Details'}
                            </>
                        )}
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <FiX className="text-gray-600" />
                    </motion.button>
                </div>

                <div className="p-4">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#FF5722]/20">
                                        <Image
                                            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80"
                                            alt="Your Avatar"
                                            width={40}
                                            height={40}
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <textarea
                                            placeholder="What's happening at your event?"
                                            value={postText}
                                            onChange={(e) => setPostText(e.target.value)}
                                            className="w-full border-0 focus:ring-0 text-gray-800 placeholder-gray-400 resize-none h-20 bg-transparent"
                                        />

                                        {selectedMedia && (
                                            <div className="relative mt-2 rounded-xl overflow-hidden">
                                                <Image
                                                    src={selectedMedia}
                                                    alt="Selected media"
                                                    width={500}
                                                    height={mediaType === 'video' ? 280 : 400}
                                                    className="object-cover w-full rounded-xl"
                                                />

                                                {mediaType === 'video' && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <motion.button
                                                            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <FiPlay className="w-5 h-5 text-white ml-1" />
                                                        </motion.button>
                                                    </div>
                                                )}

                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => {
                                                        setSelectedMedia(null);
                                                        setMediaType(null);
                                                    }}
                                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                                                >
                                                    <FiX className="text-white" />
                                                </motion.button>
                                            </div>
                                        )}

                                        {/* Location input */}
                                        <div className="flex items-center gap-2 mt-3 text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                                            <FiMapPin className="w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Add location"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="border-0 p-0 text-sm focus:ring-0 placeholder-gray-400 bg-transparent w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between border-t border-gray-100 pt-3 items-center">
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleFileSelection('image')}
                                            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors group"
                                        >
                                            <FiImage className="text-blue-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleFileSelection('video')}
                                            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors group"
                                        >
                                            <FiVideo className="text-red-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-purple-50 transition-colors group"
                                        >
                                            <BsMusicNote className="text-purple-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-amber-50 transition-colors group"
                                        >
                                            <FiSmile className="text-amber-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </motion.button>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setCurrentStep(2)}
                                        className={`px-4 py-2 rounded-full font-medium text-sm ${postText.trim() || selectedMedia
                                            ? 'bg-[#FF5722] hover:bg-[#E64A19] text-white shadow-md'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            } transition-colors`}
                                        disabled={!postText.trim() && !selectedMedia}
                                    >
                                        Continue
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="mb-5">
                                    <h3 className="font-medium text-gray-800 mb-2">Choose post type:</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setPostType('memory')}
                                            className={`px-4 py-3 rounded-lg flex flex-col items-center gap-1 ${postType === 'memory'
                                                ? 'bg-[#FF5722]/10 border-2 border-[#FF5722] text-[#FF5722]'
                                                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                                                } transition-colors`}
                                        >
                                            <FiImage className="w-5 h-5" />
                                            <span className="text-sm font-medium">Memory</span>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setPostType('event')}
                                            className={`px-4 py-3 rounded-lg flex flex-col items-center gap-1 ${postType === 'event'
                                                ? 'bg-[#FF5722]/10 border-2 border-[#FF5722] text-[#FF5722]'
                                                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                                                } transition-colors`}
                                        >
                                            <FiCalendar className="w-5 h-5" />
                                            <span className="text-sm font-medium">Event</span>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setPostType('nft')}
                                            className={`px-4 py-3 rounded-lg flex flex-col items-center gap-1 ${postType === 'nft'
                                                ? 'bg-[#FF5722]/10 border-2 border-[#FF5722] text-[#FF5722]'
                                                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                                                } transition-colors`}
                                        >
                                            <HiOutlineSparkles className="w-5 h-5" />
                                            <span className="text-sm font-medium">NFT</span>
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Dynamic fields based on post type */}
                                <AnimatePresence mode="wait">
                                    {postType === 'event' && (
                                        <motion.div
                                            key="event-fields"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-3"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Summer Festival 2025"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-[#FF5722] focus:border-[#FF5722] text-gray-800"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                                                    <input
                                                        type="date"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-[#FF5722] focus:border-[#FF5722] text-gray-800"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., Central Park"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-[#FF5722] focus:border-[#FF5722] text-gray-800"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Info</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Free entry or $20 per person"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-[#FF5722] focus:border-[#FF5722] text-gray-800"
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {postType === 'nft' && (
                                        <motion.div
                                            key="nft-fields"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-3"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">NFT Title</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Ethereal Memories #28"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-[#FF5722] focus:border-[#FF5722] text-gray-800"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Festival Moments"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-[#FF5722] focus:border-[#FF5722] text-gray-800"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., 0.5"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-[#FF5722] focus:border-[#FF5722] text-gray-800"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-[#FF5722] focus:border-[#FF5722] text-gray-800">
                                                        <option>ETH</option>
                                                        <option>SOL</option>
                                                        <option>MATIC</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {postType === 'memory' && (
                                        <motion.div
                                            key="memory-fields"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-3"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Add Tags</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., SummerFestival, MusicLovers (comma separated)"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-[#FF5722] focus:border-[#FF5722] text-gray-800"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
                                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-[#FF5722] focus:border-[#FF5722] text-gray-800">
                                                    <option>Public - Anyone can see</option>
                                                    <option>Event attendees only</option>
                                                    <option>Friends only</option>
                                                </select>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="mt-6 flex justify-between">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setCurrentStep(1)}
                                        className="px-4 py-2 rounded-full font-medium text-sm border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handlePost}
                                        className="px-6 py-2 rounded-full font-medium text-sm bg-[#FF5722] hover:bg-[#E64A19] text-white transition-colors flex items-center gap-2 shadow-md"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            'Post Now'
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-3 text-xs text-gray-500">
                        Your post will be visible to everyone at this event and can be featured in the Rovify discover feed.
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Enhanced Filter Modal Component
function FilterModal({ onClose, onApply }: { onClose: () => void; onApply: () => void }) {
    const modalContentRef = useRef<HTMLDivElement>(null);
    const [filterType, setFilterType] = useState<string>('all');
    const [filterTime, setFilterTime] = useState<string>('all-time');
    const [filterSort, setFilterSort] = useState<string>('trending');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
                ref={modalContentRef}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden m-4"
            >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FiFilter className="text-[#FF5722] w-5 h-5" />
                        Filter Content
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <FiX className="text-gray-600" />
                    </motion.button>
                </div>

                <div className="p-5">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                                <FiImage className="text-gray-500 w-4 h-4" />
                                Content Type
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <FilterButton
                                    label="All Content"
                                    isActive={filterType === 'all'}
                                    onClick={() => setFilterType('all')}
                                />
                                <FilterButton
                                    label="Photos"
                                    isActive={filterType === 'photos'}
                                    onClick={() => setFilterType('photos')}
                                />
                                <FilterButton
                                    label="Videos"
                                    isActive={filterType === 'videos'}
                                    onClick={() => setFilterType('videos')}
                                />
                                <FilterButton
                                    label="Events"
                                    isActive={filterType === 'events'}
                                    onClick={() => setFilterType('events')}
                                />
                                <FilterButton
                                    label="NFTs"
                                    isActive={filterType === 'nfts'}
                                    onClick={() => setFilterType('nfts')}
                                />
                                <FilterButton
                                    label="Live Streams"
                                    isActive={filterType === 'streams'}
                                    onClick={() => setFilterType('streams')}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                                <FiClock className="text-gray-500 w-4 h-4" />
                                Time Period
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <FilterButton
                                    label="All Time"
                                    isActive={filterTime === 'all-time'}
                                    onClick={() => setFilterTime('all-time')}
                                />
                                <FilterButton
                                    label="Today"
                                    isActive={filterTime === 'today'}
                                    onClick={() => setFilterTime('today')}
                                />
                                <FilterButton
                                    label="This Week"
                                    isActive={filterTime === 'week'}
                                    onClick={() => setFilterTime('week')}
                                />
                                <FilterButton
                                    label="This Month"
                                    isActive={filterTime === 'month'}
                                    onClick={() => setFilterTime('month')}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                                <FiTrendingUp className="text-gray-500 w-4 h-4" />
                                Sort By
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <FilterButton
                                    label="Trending"
                                    isActive={filterSort === 'trending'}
                                    onClick={() => setFilterSort('trending')}
                                />
                                <FilterButton
                                    label="Most Recent"
                                    isActive={filterSort === 'recent'}
                                    onClick={() => setFilterSort('recent')}
                                />
                                <FilterButton
                                    label="Most Liked"
                                    isActive={filterSort === 'liked'}
                                    onClick={() => setFilterSort('liked')}
                                />
                                <FilterButton
                                    label="Most Shared"
                                    isActive={filterSort === 'shared'}
                                    onClick={() => setFilterSort('shared')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Reset
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onApply}
                            className="flex-1 px-4 py-3 bg-[#FF5722] hover:bg-[#E64A19] rounded-xl text-white font-medium transition-colors shadow-md"
                        >
                            Apply Filters
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Filter Button Component
function FilterButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                ? 'bg-[#FF5722]/10 border-2 border-[#FF5722] text-[#FF5722] shadow-sm'
                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
        >
            {label}
        </motion.button>
    );
}