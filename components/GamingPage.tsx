/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiCalendar, FiClock, FiArrowRight, FiUser, FiUsers,
    FiStar, FiBarChart2, FiFilter, FiHeart, FiShare2,
    FiChevronsRight, FiBookmark, FiTv, FiMap, FiGift
} from 'react-icons/fi';
import { FaTrophy } from "react-icons/fa";

import {
    BsController, BsTwitch, BsDiscord, BsYoutube,
    BsNintendoSwitch, BsPlaystation, BsXbox, BsPc
} from 'react-icons/bs';
import { IoTicket, IoRocketOutline } from 'react-icons/io5';
import { SiEpicgames, SiSteam, SiRiotgames } from 'react-icons/si';

// Mock data for gaming page
const FEATURED_EVENTS = [
    {
        id: 'e1',
        title: 'Apex Legends Championship',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070',
        date: 'Sat, 7th June',
        location: 'Online + Los Angeles',
        price: '$25',
        attendees: 3485,
        category: 'Tournament',
        verified: true,
        game: 'Apex Legends',
        organiser: 'EFG Esports',
        tags: ['competitive', 'battle-royale']
    },
    {
        id: 'e2',
        title: 'Minecraft Community Build Festival',
        image: 'https://images.unsplash.com/photo-1627856014754-2907e2355302?q=80&w=2070',
        date: 'Fri, 13th June',
        location: 'Online',
        price: 'Free',
        attendees: 12769,
        category: 'Community',
        verified: true,
        game: 'Minecraft',
        organiser: 'BlockBuilders',
        tags: ['creative', 'building']
    },
    {
        id: 'e3',
        title: 'Valorant Pro Series Qualifiers',
        image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=2070',
        date: 'Wed, 11th June',
        location: 'Online',
        price: 'Free to watch',
        attendees: 8254,
        category: 'Tournament',
        verified: true,
        game: 'Valorant',
        organiser: 'Riot Games',
        tags: ['fps', 'esports']
    },
    {
        id: 'e4',
        title: 'Super Smash Bros Ultimate Showdown',
        image: 'https://images.unsplash.com/photo-1579324983557-7e4b95ceedd9?q=80&w=1932',
        date: 'Sat, 21st June',
        location: 'Tokyo Game Center',
        price: '$15',
        attendees: 764,
        category: 'Tournament',
        verified: false,
        game: 'Super Smash Bros',
        organiser: 'Smash Community JP',
        tags: ['fighting', 'nintendo']
    }
];

const LIVE_STREAMS = [
    {
        id: 's1',
        title: 'GTA RP - Sheriff Kyle Day 45',
        streamer: 'MoonMoon',
        game: 'Grand Theft Auto V',
        viewers: 24892,
        thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071',
        avatar: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?q=80&w=1974',
        tags: ['roleplay', 'funny'],
        nft: false
    },
    {
        id: 's2',
        title: 'LEAGUE CLIMB TO CHALLENGER - DAY 3',
        streamer: 'Tyler1',
        game: 'League of Legends',
        viewers: 48215,
        thumbnail: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2070',
        avatar: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=2078',
        tags: ['competitive', 'high-skilled'],
        nft: true
    },
    {
        id: 's3',
        title: 'Speedrunning Mario 64 - WR Attempts',
        streamer: 'Simply',
        game: 'Super Mario 64',
        viewers: 12503,
        thumbnail: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=2070',
        avatar: 'https://images.unsplash.com/photo-1582509696537-e67d6e0613ca?q=80&w=1974',
        tags: ['speedrun', 'world-record'],
        nft: false
    },
    {
        id: 's4',
        title: 'Valorant Immortal Ranked with Subscribers',
        streamer: 'Shroud',
        game: 'Valorant',
        viewers: 35874,
        thumbnail: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=2070',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780',
        tags: ['fps', 'high-skilled'],
        nft: true
    }
];

const GAMING_COMMUNITIES = [
    {
        id: 'c1',
        name: 'Warzone Warriors',
        game: 'Call of Duty: Warzone',
        members: 24853,
        avatar: 'https://images.unsplash.com/photo-1620336655052-b57986f5a26a?q=80&w=1780',
        banner: 'https://images.unsplash.com/photo-1507457379470-08b800bebc67?q=80&w=1909',
        verified: true,
        description: 'The premier community for Warzone players of all skill levels.',
        tags: ['fps', 'battle-royale', 'casual']
    },
    {
        id: 'c2',
        name: 'Elden Ring Adventurers',
        game: 'Elden Ring',
        members: 38291,
        avatar: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=1964',
        banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2084',
        verified: true,
        description: 'Share tips, strategies, and discover hidden secrets in the Lands Between.',
        tags: ['rpg', 'souls-like', 'pve']
    },
    {
        id: 'c3',
        name: 'Fortnite Fortress',
        game: 'Fortnite',
        members: 56721,
        avatar: 'https://images.unsplash.com/photo-1621075160523-b936ad96132a?q=80&w=1780',
        banner: 'https://images.unsplash.com/photo-1600861194942-f883de0dba96?q=80&w=2069',
        verified: true,
        description: 'Build, battle, and earn Victory Royales together!',
        tags: ['battle-royale', 'building', 'competitive']
    }
];

const GAMING_NFTS = [
    {
        id: 'n1',
        name: 'Legendary Dragon Mount',
        game: 'World of Warcraft',
        price: '0.85 ETH',
        thumbnail: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1780',
        creator: 'Blizzard',
        verified: true,
        ending: '2d 4h',
        bidders: 24
    },
    {
        id: 'n2',
        name: 'Ultra Rare Knife Skin',
        game: 'CS:GO',
        price: '1.2 ETH',
        thumbnail: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?q=80&w=2105',
        creator: 'Valve',
        verified: true,
        ending: '5h 23m',
        bidders: 38
    },
    {
        id: 'n3',
        name: 'Limited Edition Character',
        game: 'Apex Legends',
        price: '0.5 ETH',
        thumbnail: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1854',
        creator: 'EA',
        verified: true,
        ending: '6d 12h',
        bidders: 16
    },
    {
        id: 'n4',
        name: 'Founder\'s Edition Game Pass',
        game: 'Star Citizen',
        price: '3.2 ETH',
        thumbnail: 'https://images.unsplash.com/photo-1494587351196-bbf5f29cff42?q=80&w=2071',
        creator: 'Roberts Space Industries',
        verified: false,
        ending: '1d 8h',
        bidders: 7
    }
];

const TRENDING_GAMES = [
    'Elden Ring',
    'Fortnite',
    'Valorant',
    'Minecraft',
    'Grand Theft Auto V',
    'League of Legends',
    'Apex Legends',
    'Call of Duty: Warzone'
];

const PLATFORMS = [
    { name: 'PC', icon: <BsPc />, color: 'bg-blue-500' },
    { name: 'PlayStation', icon: <BsPlaystation />, color: 'bg-indigo-600' },
    { name: 'Xbox', icon: <BsXbox />, color: 'bg-green-600' },
    { name: 'Nintendo', icon: <BsNintendoSwitch />, color: 'bg-red-500' },
    { name: 'Steam', icon: <SiSteam />, color: 'bg-gray-700' },
    { name: 'Epic', icon: <SiEpicgames />, color: 'bg-gray-800' }
];

export default function GamingPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [activeEventIndex, setActiveEventIndex] = useState(0);
    const [isDesktop, setIsDesktop] = useState(true);
    const eventSliderRef = useRef<HTMLDivElement>(null);
    const nftSliderRef = useRef<HTMLDivElement>(null);

    // Handle window resize and determine if desktop or mobile
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto cycle through featured events
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveEventIndex(prev =>
                prev === FEATURED_EVENTS.length - 1 ? 0 : prev + 1
            );
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    // Filter functions for event tabs
    const getFilteredEvents = () => {
        if (activeTab === 'all') return FEATURED_EVENTS;
        if (activeTab === 'tournaments') return FEATURED_EVENTS.filter(e => e.category === 'Tournament');
        if (activeTab === 'community') return FEATURED_EVENTS.filter(e => e.category === 'Community');
        return FEATURED_EVENTS;
    };

    // Slider navigation controls
    const scrollSlider = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (!ref.current) return;

        const scrollAmount = direction === 'left'
            ? -ref.current.clientWidth * 0.8
            : ref.current.clientWidth * 0.8;

        ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-16 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                {/* Background Graphics */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#FF5722] rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl"></div>
                    <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
                </div>

                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071"
                        alt="Gaming background"
                        fill
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-800/90 mix-blend-multiply"></div>
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

                <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-10">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <BsController className="w-8 h-8 text-[#FF5722]" />
                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                                Rovify <span className="text-[#FF5722]">Gaming</span>
                            </h1>
                        </div>

                        <p className="text-lg sm:text-xl text-gray-300 mb-8">
                            Your all-in-one hub for gaming events, streams, and digital collectibles.
                            Connect with fellow gamers and never miss another tournament.
                        </p>

                        <div className="flex flex-wrap justify-center gap-3">
                            <button className="px-6 py-3 bg-[#FF5722] hover:bg-[#E64A19] rounded-xl font-medium transition-colors shadow-lg">
                                Explore Events
                            </button>
                            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-medium transition-colors border border-white/30">
                                Join Communities
                            </button>
                        </div>

                        {/* Gaming Platform Badges */}
                        <div className="mt-12 flex flex-wrap justify-center gap-4">
                            {PLATFORMS.map((platform, index) => (
                                <motion.div
                                    key={platform.name}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full"
                                >
                                    <div className={`w-6 h-6 rounded-full ${platform.color} flex items-center justify-center`}>
                                        <div className="text-white text-sm">
                                            {platform.icon}
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">{platform.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Featured Events & Streams */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Featured Event Banner */}
                        <section className="relative overflow-hidden rounded-2xl shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeEventIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative w-full aspect-[16/9]"
                                >
                                    <Image
                                        src={FEATURED_EVENTS[activeEventIndex].image}
                                        alt={FEATURED_EVENTS[activeEventIndex].title}
                                        fill
                                        className="object-cover"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-20">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeEventIndex}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-[#FF5722] text-white py-1 px-3 rounded-full text-xs font-medium">
                                                {FEATURED_EVENTS[activeEventIndex].category}
                                            </span>
                                            <span className="bg-white/20 backdrop-blur-sm text-white py-1 px-3 rounded-full text-xs font-medium">
                                                {FEATURED_EVENTS[activeEventIndex].game}
                                            </span>
                                            {FEATURED_EVENTS[activeEventIndex].verified && (
                                                <span className="bg-blue-500/80 text-white py-1 px-3 rounded-full text-xs font-medium flex items-center gap-1">
                                                    <FiStar className="w-3 h-3" />
                                                    Verified
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                            {FEATURED_EVENTS[activeEventIndex].title}
                                        </h2>

                                        <div className="flex flex-wrap gap-4 mb-4">
                                            <div className="flex items-center gap-1 text-white/90">
                                                <FiCalendar className="w-4 h-4" />
                                                <span className="text-sm">{FEATURED_EVENTS[activeEventIndex].date}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-white/90">
                                                <FiMap className="w-4 h-4" />
                                                <span className="text-sm">{FEATURED_EVENTS[activeEventIndex].location}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-white/90">
                                                <IoTicket className="w-4 h-4" />
                                                <span className="text-sm">{FEATURED_EVENTS[activeEventIndex].price}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-white/90">
                                                <FiUsers className="w-4 h-4" />
                                                <span className="text-sm">{FEATURED_EVENTS[activeEventIndex].attendees.toLocaleString()} attending</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <button className="px-5 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] rounded-xl text-white font-medium transition-colors shadow-md">
                                                Register Now
                                            </button>
                                            <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium transition-colors flex items-center gap-2">
                                                <FiShare2 className="w-4 h-4" />
                                                Share
                                            </button>
                                            <button className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white transition-colors">
                                                <FiHeart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Navigation Dots */}
                            <div className="absolute bottom-2 right-5 sm:bottom-5 sm:right-8 z-30 flex gap-1.5">
                                {FEATURED_EVENTS.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveEventIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${index === activeEventIndex
                                            ? 'bg-white w-4'
                                            : 'bg-white/40 hover:bg-white/60'
                                            }`}
                                        aria-label={`View event ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Gaming Events Section */}
                        <section>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-2xl font-bold text-gray-800">Upcoming Tournaments & Events</h2>
                                <Link
                                    href="/gaming/events"
                                    className="text-[#FF5722] hover:text-[#E64A19] font-medium flex items-center gap-1 transition-colors"
                                >
                                    View All
                                    <FiArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'all'
                                        ? 'bg-[#FF5722] text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    All Events
                                </button>
                                <button
                                    onClick={() => setActiveTab('tournaments')}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'tournaments'
                                        ? 'bg-[#FF5722] text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    Tournaments
                                </button>
                                <button
                                    onClick={() => setActiveTab('community')}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'community'
                                        ? 'bg-[#FF5722] text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    Community Events
                                </button>
                                <button className="px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 flex items-center gap-1">
                                    <FiFilter className="w-4 h-4" />
                                    Filters
                                </button>
                            </div>

                            {/* Events Grid/Slider */}
                            <div className="relative">
                                <div
                                    ref={eventSliderRef}
                                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-px-4"
                                >
                                    {getFilteredEvents().map((event) => (
                                        <div
                                            key={event.id}
                                            className="flex-none w-80 snap-start bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group"
                                        >
                                            <div className="relative h-40 overflow-hidden">
                                                <Image
                                                    src={event.image}
                                                    alt={event.title}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                                    <div className="flex gap-1">
                                                        <span className="bg-white/20 backdrop-blur-sm text-white py-0.5 px-2 rounded-full text-xs">
                                                            {event.game}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="absolute top-3 right-3 w-8 h-8 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors">
                                                    <FiHeart className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{event.title}</h3>
                                                <div className="flex flex-col gap-1.5 mb-3">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <FiCalendar className="w-4 h-4 text-gray-400" />
                                                        <span>{event.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <FiMap className="w-4 h-4 text-gray-400" />
                                                        <span className="truncate">{event.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <IoTicket className="w-4 h-4 text-gray-400" />
                                                        <span>{event.price}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <Link
                                                        href={`/gaming/events/${event.id}`}
                                                        className="py-2 px-4 bg-[#FF5722]/10 hover:bg-[#FF5722]/20 rounded-lg text-[#FF5722] text-sm font-medium transition-colors flex items-center gap-1"
                                                    >
                                                        View Details
                                                        <FiArrowRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <span className="text-xs text-gray-500">{event.attendees.toLocaleString()} attending</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation Controls (Desktop) */}
                                {isDesktop && (
                                    <>
                                        <button
                                            onClick={() => {
                                                if (eventSliderRef.current) {
                                                    scrollSlider(eventSliderRef as React.RefObject<HTMLDivElement>, 'left');
                                                }
                                            }}
                                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 border border-gray-200 hover:bg-gray-50"
                                        >
                                            <FiChevronsRight className="w-5 h-5 rotate-180 text-gray-600" />
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (eventSliderRef.current) {
                                                    scrollSlider(eventSliderRef as React.RefObject<HTMLDivElement>, 'right');
                                                }
                                            }}
                                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 border border-gray-200 hover:bg-gray-50"
                                        >
                                            <FiChevronsRight className="w-5 h-5 text-gray-600" />
                                        </button>

                                    </>
                                )}
                            </div>
                        </section>

                        {/* Live Streams Section */}
                        <section>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-2xl font-bold text-gray-800">Live Now</h2>
                                <Link
                                    href="/gaming/streams"
                                    className="text-[#FF5722] hover:text-[#E64A19] font-medium flex items-center gap-1 transition-colors"
                                >
                                    All Streams
                                    <FiArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {LIVE_STREAMS.slice(0, 4).map((stream) => (
                                    <div
                                        key={stream.id}
                                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group"
                                    >
                                        <div className="relative">
                                            <div className="relative h-44 overflow-hidden">
                                                <Image
                                                    src={stream.thumbnail}
                                                    alt={stream.title}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />

                                                {/* Live indicator */}
                                                <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                                    LIVE
                                                </div>

                                                {/* Viewer count */}
                                                <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs font-medium rounded backdrop-blur-sm flex items-center gap-1">
                                                    <FiUser className="w-3 h-3" />
                                                    {stream.viewers.toLocaleString()}
                                                </div>

                                                {/* Stream platform icon */}
                                                <div className="absolute bottom-3 right-3 w-8 h-8 bg-[#6441A4] rounded-lg flex items-center justify-center shadow-md">
                                                    <BsTwitch className="text-white w-5 h-5" />
                                                </div>

                                                {/* NFT badge for premium streams */}
                                                {stream.nft && (
                                                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-[#FF5722]/90 text-white text-xs font-bold rounded flex items-center gap-1 shadow-md">
                                                        NFT ACCESS
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                                    <Image
                                                        src={stream.avatar}
                                                        alt={stream.streamer}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 line-clamp-1">{stream.streamer}</h3>
                                                    <p className="text-xs text-gray-500">{stream.game}</p>
                                                </div>
                                            </div>

                                            <h4 className="font-bold text-gray-800 mb-3 line-clamp-1">{stream.title}</h4>

                                            <div className="flex gap-1 mb-3">
                                                {stream.tags.map(tag => (
                                                    <span key={tag} className="bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <Link
                                                    href={`/gaming/streams/${stream.id}`}
                                                    className="py-2 px-4 bg-gray-900 hover:bg-black rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-1"
                                                >
                                                    <FiTv className="w-4 h-4" />
                                                    Watch Stream
                                                </Link>

                                                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                                                    <FiBookmark className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Gaming Communities Section */}
                        <section>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-2xl font-bold text-gray-800">Popular Communities</h2>
                                <Link
                                    href="/gaming/communities"
                                    className="text-[#FF5722] hover:text-[#E64A19] font-medium flex items-center gap-1 transition-colors"
                                >
                                    Browse All
                                    <FiArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                {GAMING_COMMUNITIES.map((community) => (
                                    <div
                                        key={community.id}
                                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="relative h-32 overflow-hidden">
                                            <Image
                                                src={community.banner}
                                                alt={community.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                                            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end">
                                                <div className="mr-4 relative">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg">
                                                        <Image
                                                            src={community.avatar}
                                                            alt={community.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    {community.verified && (
                                                        <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                                            <FiStar className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-white">{community.name}</h3>
                                                    <p className="text-white/80 text-sm flex items-center gap-1">
                                                        <BsController className="w-3.5 h-3.5" />
                                                        {community.game}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-end">
                                                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-1.5">
                                                        <FiUsers className="w-4 h-4" />
                                                        {community.members.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <p className="text-gray-600 mb-4">{community.description}</p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {community.tags.map(tag => (
                                                    <span key={tag} className="bg-gray-100 text-gray-700 py-1 px-3 rounded-full text-xs">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    <button className="py-2 px-4 bg-[#FF5722] hover:bg-[#E64A19] rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-1">
                                                        Join Community
                                                    </button>
                                                    <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                                        <BsDiscord className="w-5 h-5 text-[#5865F2]" />
                                                    </button>
                                                </div>

                                                <Link
                                                    href={`/gaming/communities/${community.id}`}
                                                    className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column - NFT Marketplace & Widget */}
                    <div className="space-y-8">
                        {/* Gaming NFTs Section */}
                        <section className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <div className="p-5 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-1">
                                    <h2 className="text-xl font-bold text-gray-800">Gaming NFTs</h2>
                                    <Link
                                        href="/gaming/nfts"
                                        className="text-[#FF5722] hover:text-[#E64A19] text-sm font-medium flex items-center gap-1 transition-colors"
                                    >
                                        View All
                                        <FiArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                                <p className="text-gray-500 text-sm">Exclusive digital items and collectibles</p>
                            </div>

                            <div className="relative">
                                <div
                                    ref={nftSliderRef}
                                    className="flex gap-3 p-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                                >
                                    {GAMING_NFTS.map((nft) => (
                                        <div
                                            key={nft.id}
                                            className="flex-none w-40 snap-start group"
                                        >
                                            <div className="relative h-40 w-40 rounded-xl overflow-hidden mb-2 shadow-md group-hover:shadow-lg transition-shadow">
                                                <Image
                                                    src={nft.thumbnail}
                                                    alt={nft.name}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />

                                                {/* Remaining time badge */}
                                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs py-1 px-2 rounded flex items-center gap-1">
                                                    <FiClock className="w-3 h-3" />
                                                    {nft.ending}
                                                </div>

                                                {/* Verified badge */}
                                                {nft.verified && (
                                                    <div className="absolute top-2 left-2 bg-blue-500/80 backdrop-blur-sm text-white text-xs p-1 rounded-full">
                                                        <FiStar className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">{nft.name}</h3>
                                            <p className="text-xs text-gray-500 mb-1">{nft.game}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-gray-900">{nft.price}</span>
                                                <span className="text-xs text-gray-500">{nft.bidders} bids</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation Controls */}
                                <button
                                    onClick={() => scrollSlider(nftSliderRef, 'left')}
                                    className="absolute top-1/2 left-1 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
                                    aria-label="Previous NFTs"
                                >
                                    <FiChevronsRight className="w-4 h-4 rotate-180 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => scrollSlider(nftSliderRef, 'right')}
                                    className="absolute top-1/2 right-1 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
                                    aria-label="Next NFTs"
                                >
                                    <FiChevronsRight className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            <div className="p-5 bg-gray-50 border-t border-gray-100">
                                <button className="w-full py-2.5 bg-[#FF5722] hover:bg-[#E64A19] rounded-xl text-white font-medium transition-colors shadow-sm flex items-center justify-center gap-2">
                                    <FiGift className="w-4 h-4" />
                                    Explore Marketplace
                                </button>
                            </div>
                        </section>

                        {/* Trending Games Widget */}
                        <section className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <div className="p-5 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800">Trending Games</h2>
                            </div>

                            <div className="p-5">
                                <div className="space-y-4">
                                    {TRENDING_GAMES.slice(0, 5).map((game, index) => (
                                        <div
                                            key={game}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                index === 1 ? 'bg-gray-200 text-gray-700' :
                                                    index === 2 ? 'bg-amber-100 text-amber-700' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                <span className="text-sm font-bold">{index + 1}</span>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{game}</h3>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <div className={`text-xs py-0.5 px-2 rounded ${index === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {index === 0 ? '+24%' : index === 1 ? '+17%' : index === 2 ? '+12%' : '+8%'}
                                                </div>
                                                <FiBarChart2 className={`w-4 h-4 ${index === 0 ? 'text-green-500' : 'text-gray-400'
                                                    }`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <Link
                                        href="/gaming/trending"
                                        className="text-[#FF5722] hover:text-[#E64A19] font-medium text-sm flex items-center justify-center gap-1 transition-colors"
                                    >
                                        See All Trending Games
                                        <FiArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Upcoming Tournaments Widget */}
                        <section className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <div className="p-5 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800">Major Tournaments</h2>
                            </div>

                            <div className="p-5">
                                <div className="space-y-4">
                                    <div className="rounded-xl overflow-hidden border border-gray-200 group hover:border-[#FF5722]/40 transition-colors">
                                        <div className="relative h-24">
                                            <Image
                                                src="https://images.unsplash.com/photo-1629380108599-8b9fe6aad568?q=80&w=2070"
                                                alt="League of Legends World Championship"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            <div className="absolute bottom-2 left-3 text-white">
                                                <h3 className="font-bold">LoL Worlds 2025</h3>
                                                <p className="text-xs text-white/80">$2,500,000 Prize Pool</p>
                                            </div>
                                            <div className="absolute top-2 right-2 bg-[#FF5722] text-white text-xs py-0.5 px-2 rounded">
                                                Major
                                            </div>
                                        </div>
                                        <div className="p-3 bg-gradient-to-r from-gray-50 to-white">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <FiCalendar className="w-3.5 h-3.5 text-gray-500" />
                                                    <span className="text-gray-700">Oct 15 - Nov 12</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <FiMap className="w-3.5 h-3.5 text-gray-500" />
                                                    <span className="text-gray-700">Seoul, Korea</span>
                                                </div>
                                            </div>
                                            <button className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors flex items-center justify-center gap-1">
                                                <FaTrophy className="w-4 h-4" />
                                                View Tournament
                                            </button>
                                        </div>
                                    </div>

                                    <div className="rounded-xl overflow-hidden border border-gray-200 group hover:border-[#FF5722]/40 transition-colors">
                                        <div className="relative h-24">
                                            <Image
                                                src="https://images.unsplash.com/photo-1605979399824-ea0e037c8b1c?q=80&w=2070"
                                                alt="CS:GO Major Championship"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            <div className="absolute bottom-2 left-3 text-white">
                                                <h3 className="font-bold">CS:GO Stockholm Major</h3>
                                                <p className="text-xs text-white/80">$1,000,000 Prize Pool</p>
                                            </div>
                                            <div className="absolute top-2 right-2 bg-[#FF5722] text-white text-xs py-0.5 px-2 rounded">
                                                Major
                                            </div>
                                        </div>
                                        <div className="p-3 bg-gradient-to-r from-gray-50 to-white">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <FiCalendar className="w-3.5 h-3.5 text-gray-500" />
                                                    <span className="text-gray-700">Aug 24 - Sep 5</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <FiMap className="w-3.5 h-3.5 text-gray-500" />
                                                    <span className="text-gray-700">Stockholm, Sweden</span>
                                                </div>
                                            </div>
                                            <button className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors flex items-center justify-center gap-1">
                                                <FaTrophy className="w-4 h-4" />
                                                View Tournament
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <Link
                                        href="/gaming/tournaments"
                                        className="text-[#FF5722] hover:text-[#E64A19] font-medium text-sm flex items-center justify-center gap-1 transition-colors"
                                    >
                                        View Major Tournaments
                                        <FiArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* CSS for background grid pattern */}
            <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
}