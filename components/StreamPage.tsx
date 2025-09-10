/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useRef, RefObject, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    FiHeart, FiMessageSquare, FiShare2, FiBookmark, FiUser, FiUsers, FiMoreHorizontal,
    FiClock, FiDollarSign, FiChevronLeft, FiChevronRight, FiFilter, FiArrowLeft,
    FiX, FiCheckCircle, FiDownload, FiGift, FiPlus, FiPlay, FiEye, FiBell
} from 'react-icons/fi';
import {
    BsMusicNote, BsPlayFill, BsBroadcast, BsStars, BsFillLightningChargeFill,
    BsCamera, BsFilter, BsCameraReels, BsChevronDown, BsTrophy
} from 'react-icons/bs';
import { IoTicket } from 'react-icons/io5';
import { CiStreamOn } from 'react-icons/ci';
import { HiOutlineSparkles } from 'react-icons/hi';
import { MdOutlineVideoCall } from 'react-icons/md';

// Define interfaces for data structures
interface Tag {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
    icon: React.ReactNode;
}

interface StreamThumbnail {
    id: string;
    thumbnail: string;
    views: number;
}

interface Creator {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    followers: number;
    category: string;
    verified: boolean;
    recentStreams: StreamThumbnail[];
}

interface BaseStream {
    id: string;
    title: string;
    creator: string;
    creatorImage: string;
    category: string;
    nftAvailable: boolean;
    ticketPrice: string;
    thumbnail: string;
    tags: string[];
}

interface LiveStream extends BaseStream {
    viewers: number;
    isLive: boolean;
    startedAt: string;
}

interface UpcomingStream extends BaseStream {
    interestedCount: number;
    startTime: string;
}

interface ChatMessage {
    id: number;
    user: string;
    message: string;
    time: string;
    avatar: string;
}

// Component props interfaces
interface StreamCardProps {
    stream: LiveStream | UpcomingStream;
    activeTab: string;
    onClick: () => void;
}

interface StreamViewerProps {
    stream: LiveStream;
    chatMessages: ChatMessage[];
    onClose: () => void;
}

interface CreateStreamModalProps {
    onClose: () => void;
}

const StreamsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'following'>('live');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [featuredStream, setFeaturedStream] = useState<LiveStream | null>(null);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [showCreateStream, setShowCreateStream] = useState<boolean>(false);
    const streamRowRef = useRef<HTMLDivElement>(null);
    const creatorRowRef = useRef<HTMLDivElement>(null);
    const [isHoveringFeatured, setIsHoveringFeatured] = useState(false);

    // Mock data for categories
    const categories: Category[] = [
        { id: 'all', name: 'All', icon: <BsStars className="w-4 h-4" /> },
        { id: 'music', name: 'Music', icon: <BsMusicNote className="w-4 h-4" /> },
        { id: 'events', name: 'Events', icon: <IoTicket className="w-4 h-4" /> },
        { id: 'gaming', name: 'Gaming', icon: <BsFillLightningChargeFill className="w-4 h-4" /> },
        { id: 'art', name: 'Art', icon: <HiOutlineSparkles className="w-4 h-4" /> }
    ];

    // Mock data for featured stream with Unsplash image
    const mockFeaturedStream: LiveStream = useMemo(() => ({
        id: 'stream1',
        title: 'Summer Festival 2025 - Live from Main Stage',
        creator: 'Electronic Vibes',
        creatorImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
        viewers: 4823,
        nftAvailable: true,
        ticketPrice: '0.05 ETH',
        category: 'music',
        isLive: true,
        thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
        tags: ['festival', 'electronic', 'summer'],
        startedAt: 'Started 45 min ago'
    }), []);

    // Mock data for streams with Unsplash images
    const liveStreams: LiveStream[] = [
        {
            id: 'stream1',
            title: 'Summer Festival 2025 - Live from Main Stage',
            creator: 'Electronic Vibes',
            creatorImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
            viewers: 4823,
            nftAvailable: true,
            ticketPrice: '0.05 ETH',
            category: 'music',
            isLive: true,
            thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80',
            tags: ['festival', 'electronic', 'summer'],
            startedAt: 'Started 45 min ago'
        },
        {
            id: 'stream2',
            title: 'Web3 Hackathon Final Presentations',
            creator: 'Tech Innovators DAO',
            creatorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
            viewers: 1249,
            nftAvailable: true,
            ticketPrice: 'Free',
            category: 'events',
            isLive: true,
            thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80',
            tags: ['tech', 'hackathon', 'web3'],
            startedAt: 'Started 1 hr ago'
        },
        {
            id: 'stream3',
            title: 'Crypto Art Gallery Opening - VR Experience',
            creator: 'Metaverse Arts',
            creatorImage: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?auto=format&fit=crop&w=120&q=80',
            viewers: 832,
            nftAvailable: true,
            ticketPrice: '0.01 ETH',
            category: 'art',
            isLive: true,
            thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80',
            tags: ['nft', 'gallery', 'art'],
            startedAt: 'Started 2 hrs ago'
        },
        {
            id: 'stream4',
            title: 'DJ SET: Midnight Grooves with Luna',
            creator: 'Luna Beats',
            creatorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
            viewers: 2103,
            nftAvailable: false,
            ticketPrice: 'Free',
            category: 'music',
            isLive: true,
            thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80',
            tags: ['dj', 'electronic', 'house'],
            startedAt: 'Started 30 min ago'
        },
        {
            id: 'stream5',
            title: 'NFT Minting Party - Cosmic Collection',
            creator: 'Cosmic Creators',
            creatorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
            viewers: 1567,
            nftAvailable: true,
            ticketPrice: 'Whitelist',
            category: 'events',
            isLive: true,
            thumbnail: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&w=600&q=80',
            tags: ['nft', 'minting', 'launch'],
            startedAt: 'Started 15 min ago'
        },
        {
            id: 'stream6',
            title: 'Charity Concert for Ocean Cleanup',
            creator: 'Green Earth Foundation',
            creatorImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=120&q=80',
            viewers: 3298,
            nftAvailable: true,
            ticketPrice: '0.02 ETH',
            category: 'music',
            isLive: true,
            thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80',
            tags: ['charity', 'concert', 'environment'],
            startedAt: 'Started 1 hr ago'
        }
    ];

    const upcomingStreams: UpcomingStream[] = [
        {
            id: 'upcoming1',
            title: 'Blockchain Summit 2025 - Keynote Speech',
            creator: 'Crypto Network',
            creatorImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
            interestedCount: 1245,
            nftAvailable: true,
            ticketPrice: '0.1 ETH',
            category: 'events',
            startTime: 'Starts in 2 hours',
            thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80',
            tags: ['blockchain', 'crypto', 'summit']
        },
        {
            id: 'upcoming2',
            title: 'Virtual Fashion Show - Digital Couture',
            creator: 'Meta Fashion House',
            creatorImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=120&q=80',
            interestedCount: 879,
            nftAvailable: true,
            ticketPrice: '0.03 ETH',
            category: 'art',
            startTime: 'Tomorrow, 8 PM EST',
            thumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
            tags: ['fashion', 'virtual', 'design']
        },
        {
            id: 'upcoming3',
            title: 'Classic Game Tournament - Community Challenge',
            creator: 'Retro Gamers',
            creatorImage: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&w=120&q=80',
            interestedCount: 523,
            nftAvailable: false,
            ticketPrice: 'Free',
            category: 'gaming',
            startTime: 'Starts in 5 hours',
            thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
            tags: ['gaming', 'tournament', 'retro']
        }
    ];

    const followingStreams: (LiveStream | UpcomingStream)[] = [
        ...liveStreams.slice(0, 2),
        ...upcomingStreams.slice(0, 1)
    ];

    // Mock data for trending creators with Unsplash images
    const trendingCreators: Creator[] = [
        {
            id: 'creator1',
            name: 'Maya Starlight',
            handle: '@mayastar',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
            followers: 24750,
            category: 'Music',
            verified: true,
            recentStreams: [
                { id: 's1', thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=240&q=80', views: 8750 },
                { id: 's2', thumbnail: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=240&q=80', views: 7245 },
                { id: 's3', thumbnail: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=240&q=80', views: 6890 }
            ]
        },
        {
            id: 'creator2',
            name: 'CryptoVision',
            handle: '@cryptovision',
            avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=120&q=80',
            followers: 18930,
            category: 'Tech',
            verified: true,
            recentStreams: [
                { id: 's1', thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=240&q=80', views: 7125 },
                { id: 's2', thumbnail: 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?auto=format&fit=crop&w=240&q=80', views: 4980 },
                { id: 's3', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=240&q=80', views: 5360 }
            ]
        },
        {
            id: 'creator3',
            name: 'NFT Galaxy',
            handle: '@nftgalaxy',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
            followers: 31250,
            category: 'Art',
            verified: true,
            recentStreams: [
                { id: 's1', thumbnail: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=240&q=80', views: 12500 },
                { id: 's2', thumbnail: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&w=240&q=80', views: 9780 },
                { id: 's3', thumbnail: 'https://images.unsplash.com/photo-1581985673473-0784a7a44e39?auto=format&fit=crop&w=240&q=80', views: 10240 }
            ]
        },
        {
            id: 'creator4',
            name: 'DJ Pulse',
            handle: '@djpulse',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
            followers: 42805,
            category: 'Music',
            verified: true,
            recentStreams: [
                { id: 's1', thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=240&q=80', views: 15670 },
                { id: 's2', thumbnail: 'https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?auto=format&fit=crop&w=240&q=80', views: 12380 },
                { id: 's3', thumbnail: 'https://images.unsplash.com/photo-1571266752264-7a8e77930cf9?auto=format&fit=crop&w=240&q=80', views: 13920 }
            ]
        },
        {
            id: 'creator5',
            name: 'MetaVentures',
            handle: '@metaventures',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
            followers: 27430,
            category: 'Gaming',
            verified: false,
            recentStreams: [
                { id: 's1', thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=240&q=80', views: 9320 },
                { id: 's2', thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=240&q=80', views: 7650 },
                { id: 's3', thumbnail: 'https://images.unsplash.com/photo-1586182987320-4f17e36750df?auto=format&fit=crop&w=240&q=80', views: 8470 }
            ]
        },
        {
            id: 'creator6',
            name: 'Digital Nomad',
            handle: '@dignomad',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
            followers: 15670,
            category: 'Travel',
            verified: false,
            recentStreams: [
                { id: 's1', thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=240&q=80', views: 5230 },
                { id: 's2', thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=240&q=80', views: 4680 },
                { id: 's3', thumbnail: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=240&q=80', views: 4970 }
            ]
        }
    ];

    // Mock data for chat messages with Unsplash images
    const chatMessages: ChatMessage[] = [
        { id: 1, user: 'CryptoAlex', message: 'This set is incredible! 🔥', time: '2m ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
        { id: 2, user: 'NFT_Collector', message: 'Who\'s got the drop link?', time: '1m ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80' },
        { id: 3, user: 'MetaverseJane', message: 'First time catching this live, totally worth it!', time: '45s ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80' },
        { id: 4, user: 'BlockchainBob', message: 'Bought the NFT, love the perks!', time: '30s ago', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80' },
        { id: 5, user: 'TechNomad', message: 'Vibes are immaculate tonight ✨', time: '20s ago', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80' }
    ];

    // Effect to set the featured stream
    useEffect(() => {
        setFeaturedStream(mockFeaturedStream);
    }, [mockFeaturedStream]);

    // Function to horizontally scroll the stream row
    const scrollRow = (ref: RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
        if (ref.current) {
            const scrollAmount = direction === 'left' ? -320 : 320;
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Function to get streams based on active tab
    const getActiveStreams = (): (LiveStream | UpcomingStream)[] => {
        if (activeTab === 'live') return liveStreams;
        if (activeTab === 'upcoming') return upcomingStreams;
        return followingStreams;
    };

    // Function to filter streams by category
    const getFilteredStreams = (): (LiveStream | UpcomingStream)[] => {
        const streams = getActiveStreams();
        if (activeFilter === 'all') return streams;
        return streams.filter(stream => stream.category === activeFilter);
    };

    // Format numbers for display (e.g. 1.2K, 4.5M)
    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main content container with padding for side nav */}
            <div className="md:ml-20 pt-4 pb-20">
                {/* Create Stream Modal */}
                <AnimatePresence>
                    {showCreateStream && (
                        <CreateStreamModal onClose={() => setShowCreateStream(false)} />
                    )}
                </AnimatePresence>

                {!isFullscreen && (
                    <div className="relative mx-4 mb-6">
                        {/* Featured Stream Banner */}
                        <motion.div
                            className="relative aspect-video max-h-[450px] w-full overflow-hidden rounded-2xl shadow-xl"
                            onHoverStart={() => setIsHoveringFeatured(true)}
                            onHoverEnd={() => setIsHoveringFeatured(false)}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {featuredStream && (
                                <>
                                    {/* Event Alert - Notification Bar */}
                                    <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white py-2 px-4 z-30 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FiBell className="mr-2" />
                                            <span className="text-sm font-medium">Summer Festival 2025 starts in 3 hours</span>
                                        </div>
                                        <button className="text-white/80 hover:text-white">
                                            <FiX />
                                        </button>
                                    </div>

                                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                                    <Image
                                        src={featuredStream.thumbnail}
                                        alt={featuredStream.title}
                                        fill
                                        className="object-cover transition-transform duration-10000 hover:scale-105"
                                        priority
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[1]"></div>

                                    {/* Live indicator */}
                                    <div className="absolute top-14 left-5 flex items-center z-20">
                                        <motion.div
                                            className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-md"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></div>
                                            LIVE
                                        </motion.div>
                                        <motion.div
                                            className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full ml-2 flex items-center shadow-md"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <FiEye className="mr-1.5" />
                                            {featuredStream.viewers.toLocaleString()}
                                        </motion.div>
                                    </div>

                                    {/* NFT Badge */}
                                    {featuredStream.nftAvailable && (
                                        <motion.div
                                            className="absolute top-14 right-5 bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-md z-20"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <BsStars className="mr-1.5" />
                                            NFT ACCESS
                                        </motion.div>
                                    )}

                                    {/* Play button */}
                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center group z-20"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                    >
                                        <Link href={`/streaming/${featuredStream.id}`}>
                                            <motion.div
                                                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 border border-white/40 shadow-lg"
                                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <div className="w-16 h-16 rounded-full bg-[#FF5722] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                                    <BsPlayFill className="w-8 h-8 text-white" />
                                                </div>
                                            </motion.div>
                                        </Link>
                                    </motion.div>

                                    {/* Stream info overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                                        <div className="flex items-start gap-4">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                <Image
                                                    src={featuredStream.creatorImage}
                                                    alt={featuredStream.creator}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full border-2 border-white/50 shadow-lg"
                                                />
                                            </motion.div>
                                            <div className="flex-1">
                                                <motion.h3
                                                    className="text-white font-bold text-2xl md:text-3xl text-shadow-sm"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.7 }}
                                                >
                                                    {featuredStream.title}
                                                </motion.h3>
                                                <motion.div
                                                    className="flex items-center mt-2"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.8 }}
                                                >
                                                    <span className="text-white/90 text-sm font-medium">{featuredStream.creator}</span>
                                                    <span className="mx-2 text-white/50">•</span>
                                                    <span className="text-white/70 text-xs">{featuredStream.startedAt}</span>
                                                </motion.div>
                                                <motion.div
                                                    className="flex flex-wrap gap-2 mt-3"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.9 }}
                                                >
                                                    {featuredStream.tags.map(tag => (
                                                        <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full shadow-sm">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </motion.div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex gap-2">
                                                <motion.button
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 1, type: "spring" }}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-md"
                                                >
                                                    <FiHeart className="w-5 h-5" />
                                                </motion.button>
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 1.1, type: "spring" }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Link href={`/streaming/${featuredStream.id}`} className="flex h-10 px-5 items-center justify-center gap-2 bg-[#FF5722] rounded-full text-white font-medium text-sm hover:bg-[#E64A19] transition-colors shadow-md">
                                                        Watch Now
                                                    </Link>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* Stream Browser */}
                <div className={`px-4 ${isFullscreen ? 'hidden' : 'block'}`}>
                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap justify-between items-center mb-6">
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab('live')}
                                className={`px-5 py-2.5 text-sm font-medium rounded-full shadow-md ${activeTab === 'live'
                                    ? 'bg-[#FF5722] text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full ${activeTab === 'live' ? 'bg-white animate-pulse' : 'bg-[#FF5722]'} mr-2`}></div>
                                    Live Now
                                </div>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab('upcoming')}
                                className={`px-5 py-2.5 text-sm font-medium rounded-full shadow-md ${activeTab === 'upcoming'
                                    ? 'bg-[#FF5722] text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <FiClock className={`w-4 h-4 ${activeTab === 'upcoming' ? 'text-white' : 'text-[#FF5722]'} mr-1.5`} />
                                    Upcoming
                                </div>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab('following')}
                                className={`px-5 py-2.5 text-sm font-medium rounded-full shadow-md ${activeTab === 'following'
                                    ? 'bg-[#FF5722] text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <FiUser className={`w-4 h-4 ${activeTab === 'following' ? 'text-white' : 'text-[#FF5722]'} mr-1.5`} />
                                    Following
                                </div>
                            </motion.button>
                        </div>

                        {/* Create Stream Button - Hidden on mobile, handled by fixed button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCreateStream(true)}
                            className="hidden md:flex h-11 px-5 items-center justify-center gap-2 bg-gradient-to-r from-[#FF5722] to-[#FF8A65] rounded-full text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all"
                        >
                            <CiStreamOn className="w-5 h-5" />
                            Start Streaming
                        </motion.button>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center justify-between mb-6 overflow-x-auto hide-scrollbar pb-2">
                        <div className="flex gap-2">
                            {categories.map(category => (
                                <motion.button
                                    key={category.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveFilter(category.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center whitespace-nowrap shadow-md ${activeFilter === category.id
                                        ? 'bg-[#FF5722]/10 text-[#FF5722] border border-[#FF5722]/30'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="mr-1.5">{category.icon}</span>
                                    {category.name}
                                </motion.button>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full text-sm text-gray-700 border border-gray-200 hover:border-gray-300 shadow-md"
                        >
                            <FiFilter className="w-4 h-4" />
                            Filter
                        </motion.button>
                    </div>

                    {/* Stream Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
                    >
                        {getFilteredStreams().map((stream, idx) => (
                            <motion.div
                                key={stream.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <StreamCard
                                    stream={stream}
                                    activeTab={activeTab}
                                    onClick={() => setIsFullscreen(true)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Trending Creators Section */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF5722] to-orange-400 flex items-center justify-center shadow-md">
                                    <BsTrophy className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Trending Creators</h3>
                            </div>
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => scrollRow(creatorRowRef as RefObject<HTMLDivElement>, 'left')}
                                    className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-md"
                                >
                                    <FiChevronLeft className="w-5 h-5" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => scrollRow(creatorRowRef as RefObject<HTMLDivElement>, 'right')}
                                    className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-md"
                                >
                                    <FiChevronRight className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        <div
                            ref={creatorRowRef}
                            className="flex overflow-x-auto gap-5 pb-4 hide-scrollbar snap-x"
                        >
                            {trendingCreators.map((creator) => (
                                <motion.div
                                    key={creator.id}
                                    className="flex-shrink-0 w-72 snap-start"
                                    whileHover={{ y: -5 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FF5722]/20">
                                                    <Image
                                                        src={creator.avatar}
                                                        alt={creator.name}
                                                        width={48}
                                                        height={48}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                {creator.verified && (
                                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[8px] border-2 border-white shadow-md">
                                                        ✓
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{creator.name}</h4>
                                                <p className="text-xs text-gray-500">{formatNumber(creator.followers)} followers</p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="ml-auto px-3 py-1 bg-[#FF5722]/10 text-[#FF5722] text-xs font-medium rounded-full hover:bg-[#FF5722]/15 transition-colors"
                                            >
                                                Follow
                                            </motion.button>
                                        </div>

                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                            {creator.recentStreams.map((stream, idx) => (
                                                <div key={idx} className="h-20 rounded-lg overflow-hidden bg-gray-100 relative shadow-sm group">
                                                    <Image
                                                        src={stream.thumbnail}
                                                        alt="Stream thumbnail"
                                                        width={80}
                                                        height={60}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    {/* Play button overlay on hover */}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform">
                                                            <FiPlay className="w-3 h-3 text-[#FF5722] ml-0.5" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] px-1.5 py-0.5 rounded-full shadow-sm">
                                                        {formatNumber(stream.views)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stream Viewer - only visible when fullscreen */}
                {isFullscreen && featuredStream && (
                    <StreamViewer
                        stream={featuredStream}
                        chatMessages={chatMessages}
                        onClose={() => setIsFullscreen(false)}
                    />
                )}
            </div>

            {/* Mobile Tab Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg md:hidden">
                <div className="flex justify-around items-center h-16 px-2">
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`flex flex-col items-center justify-center w-1/3 h-full ${activeTab === 'live' ? 'text-[#FF5722]' : 'text-gray-500'
                            }`}
                    >
                        <div className={`w-2 h-2 rounded-full ${activeTab === 'live' ? 'bg-[#FF5722] animate-pulse' : 'bg-transparent'} mb-1`}></div>
                        <span className="text-xs font-medium">Live Now</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`flex flex-col items-center justify-center w-1/3 h-full ${activeTab === 'upcoming' ? 'text-[#FF5722]' : 'text-gray-500'
                            }`}
                    >
                        <FiClock className={`w-4 h-4 mb-1 ${activeTab === 'upcoming' ? 'text-[#FF5722]' : ''}`} />
                        <span className="text-xs font-medium">Upcoming</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('following')}
                        className={`flex flex-col items-center justify-center w-1/3 h-full ${activeTab === 'following' ? 'text-[#FF5722]' : 'text-gray-500'
                            }`}
                    >
                        <FiUser className={`w-4 h-4 mb-1 ${activeTab === 'following' ? 'text-[#FF5722]' : ''}`} />
                        <span className="text-xs font-medium">Following</span>
                    </button>
                </div>
            </div>

            {/* Mobile Start Streaming Button */}
            <motion.div
                className="fixed right-5 bottom-20 md:hidden z-40"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" }}
            >
                <motion.button
                    onClick={() => setShowCreateStream(true)}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF8A65] flex items-center justify-center shadow-lg"
                >
                    <CiStreamOn className="w-6 h-6 text-white" />
                </motion.button>
            </motion.div>

            {/* Global Styles */}
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
                
                .animate-gradient {
                    background-size: 300% 300%;
                    animation: gradient 3s ease infinite;
                }
                
                .text-shadow-sm {
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }
            `}</style>
        </div>
    );
};

// Stream Card Component
const StreamCard: React.FC<StreamCardProps> = ({ stream, activeTab, onClick }) => {
    // Type guard to check if the stream is a LiveStream
    const isLiveStream = (stream: LiveStream | UpcomingStream): stream is LiveStream => {
        return 'viewers' in stream && 'isLive' in stream;
    };

    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all h-full"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Link href={`/streaming/${stream.id}`} onClick={onClick}>
                <div className="relative aspect-video">
                    <Image
                        src={stream.thumbnail}
                        alt={stream.title}
                        width={600}
                        height={350}
                        className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                    />

                    {/* Play button overlay on hover */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center"
                            >
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border border-white/40"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#FF5722] flex items-center justify-center">
                                        <BsPlayFill className="w-6 h-6 text-white ml-1" />
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Overlay info */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
                        {activeTab === 'live' && isLiveStream(stream) ? (
                            <>
                                <div className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-md">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
                                    LIVE
                                </div>
                                <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center shadow-md">
                                    <FiUsers className="mr-1" />
                                    {stream.viewers.toLocaleString()}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-indigo-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-md">
                                    <FiClock className="mr-1" />
                                    {!isLiveStream(stream) ? stream.startTime : ''}
                                </div>
                                <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center shadow-md">
                                    <FiUsers className="mr-1" />
                                    {!isLiveStream(stream) ? stream.interestedCount.toLocaleString() : '0'}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bottom badges */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-10">
                        {/* Price tag */}
                        {stream.ticketPrice && (
                            <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center shadow-md">
                                <FiDollarSign className="mr-1" />
                                {stream.ticketPrice}
                            </div>
                        )}

                        {/* NFT badge */}
                        {stream.nftAvailable && (
                            <div className="bg-purple-500/90 text-white text-xs px-2.5 py-1 rounded-full flex items-center shadow-md">
                                <BsStars className="mr-1" />
                                NFT
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            <div className="p-3.5">
                <Link href={`/streaming/${stream.id}`} onClick={onClick}>
                    <h3 className="font-medium text-gray-900 hover:text-[#FF5722] transition-colors">
                        {stream.title}
                    </h3>
                </Link>

                <div className="flex items-center mt-2.5">
                    <Image
                        src={stream.creatorImage}
                        alt={stream.creator}
                        width={26}
                        height={26}
                        className="rounded-full mr-2 border border-gray-200"
                    />
                    <span className="text-sm text-gray-700">{stream.creator}</span>

                    <div className="ml-auto flex gap-1.5">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <FiHeart className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <FiBookmark className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {stream.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// Create Stream Modal Component
const CreateStreamModal: React.FC<CreateStreamModalProps> = ({ onClose }) => {
    const [step, setStep] = useState<number>(1);
    const [title, setTitle] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [enableNFT, setEnableNFT] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string | null>('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80');

    const categories: { id: string; name: string; icon: React.ReactNode }[] = [
        { id: 'music', name: 'Music', icon: <BsMusicNote className="w-5 h-5" /> },
        { id: 'events', name: 'Events', icon: <IoTicket className="w-5 h-5" /> },
        { id: 'gaming', name: 'Gaming', icon: <BsFillLightningChargeFill className="w-5 h-5" /> },
        { id: 'art', name: 'Art', icon: <HiOutlineSparkles className="w-5 h-5" /> }
    ];

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = () => {
        console.log({
            title,
            category,
            description,
            isPrivate,
            enableNFT
        });
        // Here you would create the stream
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl overflow-hidden w-full max-w-xl mx-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#FF5722] to-[#FF8A65] p-5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-white font-bold text-xl">Start Streaming</h3>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="text-white hover:text-gray-200"
                        >
                            <FiX className="w-6 h-6" />
                        </motion.button>
                    </div>

                    {/* Steps indicator */}
                    <div className="flex justify-between mt-5 px-8 pt-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex flex-col items-center">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 ${s === step
                                        ? 'bg-white text-[#FF5722]'
                                        : s < step
                                            ? 'bg-white/30 text-white'
                                            : 'bg-white/10 text-white/60'
                                        }`}
                                >
                                    {s < step ? <FiCheckCircle className="w-5 h-5" /> : s}
                                </motion.div>
                                <span className={`text-xs ${s === step
                                    ? 'text-white font-medium'
                                    : 'text-white/60'
                                    }`}>
                                    {s === 1 ? 'Details' : s === 2 ? 'Stream Setup' : 'Preview'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {/* Step 1: Stream Details */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Stream Title*
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter a catchy title for your stream"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Category*
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {categories.map((cat) => (
                                        <motion.button
                                            key={cat.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => setCategory(cat.id)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${category === cat.id
                                                ? 'border-[#FF5722] bg-[#FF5722]/5 text-[#FF5722]'
                                                : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${category === cat.id ? 'bg-[#FF5722]/10' : 'bg-gray-100'}`}>
                                                {cat.icon}
                                            </div>
                                            <span className="font-medium">{cat.name}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Tell viewers what your stream is about..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-6">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="private"
                                        checked={isPrivate}
                                        onChange={() => setIsPrivate(!isPrivate)}
                                        className="w-4 h-4 text-[#FF5722] border-gray-300 rounded focus:ring-[#FF5722]"
                                    />
                                    <label htmlFor="private" className="ml-2 text-sm text-gray-700">
                                        Private Stream
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="nft"
                                        checked={enableNFT}
                                        onChange={() => setEnableNFT(!enableNFT)}
                                        className="w-4 h-4 text-[#FF5722] border-gray-300 rounded focus:ring-[#FF5722]"
                                    />
                                    <label htmlFor="nft" className="ml-2 text-sm text-gray-700">
                                        Enable NFT Access
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Stream Setup */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3">Choose Stream Source</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="p-5 border border-gray-300 hover:border-[#FF5722] rounded-xl flex flex-col items-center justify-center bg-white hover:bg-[#FF5722]/5 transition-colors"
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <BsCamera className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">Camera</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="p-5 border border-gray-300 hover:border-[#FF5722] rounded-xl flex flex-col items-center justify-center bg-white hover:bg-[#FF5722]/5 transition-colors"
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <BsCameraReels className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">Screen</span>
                                    </motion.button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Upload Thumbnail (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                                    {previewImage ? (
                                        <div className="relative mx-auto w-full max-w-xs aspect-video rounded-lg overflow-hidden shadow-md">
                                            <Image
                                                src={previewImage}
                                                alt="Preview"
                                                width={350}
                                                height={200}
                                                className="object-cover w-full h-full"
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setPreviewImage(null)}
                                                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center shadow-sm"
                                            >
                                                <FiX className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <FiDownload className="w-6 h-6 text-gray-500" />
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Drag & drop a thumbnail image, or{' '}
                                                <span className="text-[#FF5722] font-medium">Browse</span>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Recommended: 1280x720 (16:9)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {enableNFT && (
                                <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                                    <h4 className="font-medium text-purple-900 flex items-center gap-2 mb-4">
                                        <BsStars className="w-5 h-5 text-purple-600" />
                                        NFT Access Settings
                                    </h4>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                                Price (ETH)
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="0.05"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                                Supply Limit
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="100"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Preview */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg">
                                <div className="relative aspect-video">
                                    {previewImage ? (
                                        <Image
                                            src={previewImage}
                                            alt="Stream preview"
                                            width={600}
                                            height={350}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                                            <div className="text-center">
                                                <div className="mb-4">
                                                    <div className="w-16 h-16 bg-[#FF5722] rounded-full mx-auto flex items-center justify-center">
                                                        <BsPlayFill className="w-8 h-8" />
                                                    </div>
                                                </div>
                                                <h3 className="text-white font-bold">{title || 'Your Stream Title'}</h3>
                                                <p className="text-gray-300 text-sm mt-2">Ready to go live</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stream controls overlay */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="text-center">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className="mb-4"
                                            >
                                                <div className="w-16 h-16 bg-[#FF5722] rounded-full mx-auto flex items-center justify-center shadow-lg">
                                                    <BsPlayFill className="w-8 h-8 text-white" />
                                                </div>
                                            </motion.div>
                                            <h3 className="text-white font-bold text-xl text-shadow-sm">{title || 'Your Stream Title'}</h3>
                                            <p className="text-white/80 text-sm mt-2 text-shadow-sm">Ready to go live</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                                                <Image
                                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                                                    alt="Your avatar"
                                                    width={40}
                                                    height={40}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Your Name</p>
                                                <p className="text-xs text-gray-500">0 viewers</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {isPrivate && (
                                                <span className="bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                    <FiUser className="w-3 h-3" />
                                                    Private
                                                </span>
                                            )}

                                            {enableNFT && (
                                                <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                    <BsStars className="w-3 h-3" />
                                                    NFT
                                                </span>
                                            )}

                                            {category && (
                                                <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full shadow-sm">
                                                    {categories.find(c => c.id === category)?.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                                <h4 className="text-blue-800 font-medium flex items-center gap-2">
                                    <FiCheckCircle className="w-5 h-5 text-blue-600" />
                                    Ready to Stream
                                </h4>
                                <p className="text-blue-700 text-sm mt-2">
                                    Your stream is set up and ready to go. Click &quot;Go Live&quot; to start streaming to your audience.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-6 flex justify-between">
                        {step > 1 ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleBack}
                                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-md"
                            >
                                Back
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-md"
                            >
                                Cancel
                            </motion.button>
                        )}

                        {step < 3 ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNext}
                                className="px-6 py-2.5 bg-[#FF5722] text-white font-medium rounded-lg hover:bg-[#E64A19] disabled:opacity-50 shadow-md"
                                disabled={step === 1 && (!title || !category)}
                            >
                                Next
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmit}
                                className="px-8 py-2.5 bg-[#FF5722] text-white font-medium rounded-lg hover:bg-[#E64A19] flex items-center gap-2 shadow-md"
                            >
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                                Go Live
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Stream Viewer Component
const StreamViewer: React.FC<StreamViewerProps> = ({ stream, chatMessages, onClose }) => {
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [showInfo, setShowInfo] = useState<boolean>(true);
    const [comment, setComment] = useState<string>('');
    const [chatInput, setChatInput] = useState<string>('');

    return (
        <div className="fixed inset-0 bg-black z-50 md:ml-20">
            {/* Back button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-5 left-5 z-20 bg-black/50 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            >
                <FiArrowLeft className="w-5 h-5" />
            </motion.button>

            <div className="flex flex-col md:flex-row h-full">
                {/* Video Area */}
                <div className="relative flex-grow flex items-center justify-center bg-black">
                    <div className="relative w-full h-full">
                        <Image
                            src={stream.thumbnail}
                            alt={stream.title}
                            fill
                            className="object-contain"
                            priority
                        />

                        {/* Overlay controls - toggle visibility on click */}
                        <div
                            className={`absolute inset-0 transition-opacity duration-300 ${showInfo ? 'opacity-100' : 'opacity-0'}`}
                            onClick={() => setShowInfo(!showInfo)}
                        >
                            {/* Top gradient */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none"></div>

                            {/* Bottom gradient */}
                            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>

                            {/* Stream info */}
                            <div className="absolute top-5 right-5 bg-black/50 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full flex items-center shadow-md">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                                LIVE • {stream.viewers.toLocaleString()} watching
                            </div>

                            {/* Bottom info bar */}
                            <div className="absolute bottom-5 left-5 right-20 flex items-end justify-between pointer-events-none">
                                <div>
                                    <h2 className="text-white font-bold text-2xl md:text-3xl text-shadow-sm">{stream.title}</h2>
                                    <div className="flex items-center mt-2.5">
                                        <Image
                                            src={stream.creatorImage}
                                            alt={stream.creator}
                                            width={36}
                                            height={36}
                                            className="rounded-full border-2 border-white/30 shadow-md"
                                        />
                                        <span className="ml-2.5 text-white text-sm font-medium">{stream.creator}</span>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="ml-3 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs pointer-events-auto shadow-md hover:bg-white/30 transition-colors"
                                        >
                                            Follow
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-4 pointer-events-auto">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
                                        className={`flex flex-col items-center ${isLiked ? 'text-red-500' : 'text-white'}`}
                                    >
                                        <div className={`w-11 h-11 rounded-full ${isLiked ? 'bg-white/30' : 'bg-black/40'} backdrop-blur-md flex items-center justify-center shadow-md`}>
                                            <FiHeart className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs mt-1.5">12.4K</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex flex-col items-center text-white"
                                    >
                                        <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center shadow-md">
                                            <FiMessageSquare className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs mt-1.5">4.2K</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex flex-col items-center text-white"
                                    >
                                        <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center shadow-md">
                                            <FiShare2 className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs mt-1.5">Share</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }}
                                        className={`flex flex-col items-center ${isBookmarked ? 'text-[#FF5722]' : 'text-white'}`}
                                    >
                                        <div className={`w-11 h-11 rounded-full ${isBookmarked ? 'bg-white/30' : 'bg-black/40'} backdrop-blur-md flex items-center justify-center shadow-md`}>
                                            <FiBookmark className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs mt-1.5">Save</span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Sidebar */}
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full md:w-80 lg:w-96 h-64 md:h-full bg-white md:bg-gray-50 border-t md:border-l border-gray-200 flex flex-col"
                >
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                        <h3 className="font-semibold text-gray-900">Live Chat</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{stream.viewers.toLocaleString()} watching</span>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100"
                            >
                                <FiMoreHorizontal className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {chatMessages.map(message => (
                            <motion.div
                                key={message.id}
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Image
                                    src={message.avatar}
                                    alt={message.user}
                                    width={36}
                                    height={36}
                                    className="rounded-full flex-shrink-0"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 text-sm">{message.user}</span>
                                        <span className="text-xs text-gray-500">{message.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-0.5">{message.message}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Comment input */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                                    alt="Your avatar"
                                    width={36}
                                    height={36}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-grow bg-gray-100 rounded-full px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && chatInput.trim()) {
                                        setChatInput('');
                                    }
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 flex-shrink-0 rounded-full bg-[#FF5722] flex items-center justify-center text-white disabled:opacity-50 shadow-md"
                                disabled={!chatInput.trim()}
                            >
                                <FiMessageSquare className="w-4 h-4" />
                            </motion.button>
                        </div>

                        {/* Purchase NFT button */}
                        {stream.nftAvailable && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full mt-3 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg"
                            >
                                <BsStars className="w-4 h-4" />
                                Purchase NFT Access ({stream.ticketPrice})
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default StreamsPage;