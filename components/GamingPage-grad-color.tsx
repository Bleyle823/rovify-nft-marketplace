/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
    FiCalendar, FiClock, FiArrowRight, FiUser, FiUsers,
    FiStar, FiBarChart2, FiFilter, FiHeart, FiShare2,
    FiChevronsRight, FiBookmark, FiTv, FiMap, FiGift,
    FiPlay, FiEye, FiZap, FiTrendingUp
} from 'react-icons/fi';
import { FaTrophy } from "react-icons/fa";
import {
    BsController, BsTwitch, BsDiscord, BsYoutube,
    BsNintendoSwitch, BsPlaystation, BsXbox, BsPc
} from 'react-icons/bs';
import { IoTicket, IoRocketOutline } from 'react-icons/io5';
import { SiEpicgames, SiSteam, SiRiotgames } from 'react-icons/si';

// Enhanced mock data
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
        tags: ['competitive', 'battle-royale'],
        gradient: 'from-orange-500 to-red-600'
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
        tags: ['creative', 'building'],
        gradient: 'from-green-500 to-emerald-600'
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
        tags: ['fps', 'esports'],
        gradient: 'from-purple-500 to-pink-600'
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
        tags: ['fighting', 'nintendo'],
        gradient: 'from-blue-500 to-cyan-600'
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
        nft: false,
        trending: true
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
        nft: true,
        trending: false
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
        nft: false,
        trending: true
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
        nft: true,
        trending: false
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
        tags: ['fps', 'battle-royale', 'casual'],
        growth: '+24%'
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
        tags: ['rpg', 'souls-like', 'pve'],
        growth: '+18%'
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
        tags: ['battle-royale', 'building', 'competitive'],
        growth: '+31%'
    }
];

const PLATFORMS = [
    { name: 'PC', icon: <BsPc />, color: 'from-blue-500 to-blue-600' },
    { name: 'PlayStation', icon: <BsPlaystation />, color: 'from-indigo-500 to-indigo-600' },
    { name: 'Xbox', icon: <BsXbox />, color: 'from-green-500 to-green-600' },
    { name: 'Nintendo', icon: <BsNintendoSwitch />, color: 'from-red-500 to-red-600' },
    { name: 'Steam', icon: <SiSteam />, color: 'from-gray-600 to-gray-700' },
    { name: 'Epic', icon: <SiEpicgames />, color: 'from-gray-700 to-gray-800' }
];

// Floating particles component
const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full opacity-20"
                animate={{
                    x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                    y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                    scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                    duration: Math.random() * 20 + 10,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                }}
            />
        ))}
    </div>
);

// Enhanced section component with intersection observer
type SectionProps = {
    children: React.ReactNode;
    className?: string;
    delay?: number;
};

const Section = ({ children, className = "", delay = 0 }: SectionProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay }}
            className={className}
        >
            {children}
        </motion.section>
    );
};

export default function ModernGamingPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [activeEventIndex, setActiveEventIndex] = useState(0);
    const [isDesktop, setIsDesktop] = useState(true);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 300], [0, -50]);
    const y2 = useTransform(scrollY, [0, 300], [0, -100]);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveEventIndex(prev =>
                prev === FEATURED_EVENTS.length - 1 ? 0 : prev + 1
            );
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const getFilteredEvents = () => {
        if (activeTab === 'all') return FEATURED_EVENTS;
        if (activeTab === 'tournaments') return FEATURED_EVENTS.filter(e => e.category === 'Tournament');
        if (activeTab === 'community') return FEATURED_EVENTS.filter(e => e.category === 'Community');
        return FEATURED_EVENTS;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16 pb-20 relative overflow-hidden">
            <FloatingParticles />

            {/* Ultra-Modern Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <motion.div
                        style={{ y: y1 }}
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/30 to-pink-500/30 rounded-full filter blur-3xl"
                    />
                    <motion.div
                        style={{ y: y2 }}
                        className="absolute bottom-1/4 right-1/3 w-[32rem] h-[32rem] bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full filter blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-full filter blur-2xl"
                    />
                </div>

                {/* Mesh Gradient Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_70%)]" />

                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="mb-8"
                        >
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="p-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl shadow-2xl"
                                >
                                    <BsController className="w-12 h-12 text-white" />
                                </motion.div>
                                <h1 className="text-6xl sm:text-8xl font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-orange-400 bg-clip-text text-transparent">
                                    ROVIFY
                                </h1>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="relative"
                            >
                                <h2 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                                    Gaming Universe
                                </h2>
                                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-purple-500/20 blur-xl rounded-full" />
                            </motion.div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.7 }}
                            className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
                        >
                            Experience the future of gaming. Connect, compete, and conquer in our ultra-modern ecosystem designed for the next generation of gamers.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.9 }}
                            className="flex flex-wrap justify-center gap-6 mb-16"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(251, 113, 33, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-2xl text-white font-bold text-lg transition-all duration-300 shadow-2xl relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <IoRocketOutline className="w-5 h-5" />
                                    Launch Experience
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white font-bold text-lg transition-all duration-300 border border-white/30 shadow-2xl"
                            >
                                Explore Communities
                            </motion.button>
                        </motion.div>

                        {/* Enhanced Platform Badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1.1 }}
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto"
                        >
                            {PLATFORMS.map((platform, index) => (
                                <motion.div
                                    key={platform.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 + index * 0.1 }}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    className={`relative group cursor-pointer`}
                                >
                                    <div className={`p-6 bg-gradient-to-br ${platform.color} rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:shadow-3xl`}>
                                        <div className="text-white text-2xl mb-2 flex justify-center">
                                            {platform.icon}
                                        </div>
                                        <span className="text-white text-sm font-bold block text-center">{platform.name}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Featured Event Banner */}
                        <Section>
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10" />

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeEventIndex}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.8 }}
                                        className="relative w-full aspect-[16/9] overflow-hidden"
                                    >
                                        <Image
                                            src={FEATURED_EVENTS[activeEventIndex].image}
                                            alt={FEATURED_EVENTS[activeEventIndex].title}
                                            fill
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            style={{ objectFit: 'cover' }}
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    </motion.div>
                                </AnimatePresence>

                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeEventIndex}
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -30, opacity: 0 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <div className="flex flex-wrap gap-3 mb-4">
                                                <span className={`px-4 py-2 bg-gradient-to-r ${FEATURED_EVENTS[activeEventIndex].gradient} text-white rounded-full text-sm font-bold shadow-lg`}>
                                                    {FEATURED_EVENTS[activeEventIndex].category}
                                                </span>
                                                <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/30">
                                                    {FEATURED_EVENTS[activeEventIndex].game}
                                                </span>
                                                {FEATURED_EVENTS[activeEventIndex].verified && (
                                                    <span className="px-4 py-2 bg-blue-500/80 backdrop-blur-md text-white rounded-full text-sm font-medium flex items-center gap-2 border border-blue-300/30">
                                                        <FiStar className="w-4 h-4" />
                                                        Verified
                                                    </span>
                                                )}
                                            </div>

                                            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                                                {FEATURED_EVENTS[activeEventIndex].title}
                                            </h2>

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                                <div className="flex items-center gap-2 text-white/90">
                                                    <FiCalendar className="w-5 h-5" />
                                                    <span className="text-sm font-medium">{FEATURED_EVENTS[activeEventIndex].date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/90">
                                                    <FiMap className="w-5 h-5" />
                                                    <span className="text-sm font-medium">{FEATURED_EVENTS[activeEventIndex].location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/90">
                                                    <IoTicket className="w-5 h-5" />
                                                    <span className="text-sm font-medium">{FEATURED_EVENTS[activeEventIndex].price}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/90">
                                                    <FiUsers className="w-5 h-5" />
                                                    <span className="text-sm font-medium">{FEATURED_EVENTS[activeEventIndex].attendees.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-xl text-white font-bold transition-all duration-300 shadow-lg"
                                                >
                                                    Register Now
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white font-medium transition-all duration-300 border border-white/30 flex items-center gap-2"
                                                >
                                                    <FiShare2 className="w-4 h-4" />
                                                    Share
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all duration-300 border border-white/30"
                                                >
                                                    <FiHeart className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Enhanced Navigation Dots */}
                                <div className="absolute bottom-6 right-8 z-30 flex gap-2">
                                    {FEATURED_EVENTS.map((_, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => setActiveEventIndex(index)}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.8 }}
                                            className={`transition-all duration-300 rounded-full ${index === activeEventIndex
                                                ? 'w-8 h-3 bg-gradient-to-r from-orange-400 to-pink-500 shadow-lg'
                                                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* Live Streams Section */}
                        <Section delay={0.2}>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                                        <FiTv className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-white">Live Streams</h2>
                                        <p className="text-gray-400">Watch the best streamers live</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-2 transition-colors"
                                >
                                    View All
                                    <FiArrowRight className="w-4 h-4" />
                                </motion.button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {LIVE_STREAMS.slice(0, 4).map((stream, index) => (
                                    <motion.div
                                        key={stream.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -5 }}
                                        className="group relative"
                                    >
                                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                                            <Image
                                                src={stream.thumbnail}
                                                alt={stream.title}
                                                width={600}
                                                height={176}
                                                className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-110"
                                                style={{ objectFit: 'cover' }}
                                                priority={index === 0}
                                            />

                                            {/* Live Indicator */}
                                            <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-black rounded-full flex items-center gap-2 shadow-lg">
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                    className="w-2 h-2 rounded-full bg-white"
                                                />
                                                LIVE
                                            </div>

                                            {/* Viewer Count */}
                                            <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-sm font-bold rounded-full flex items-center gap-1">
                                                <FiEye className="w-4 h-4" />
                                                {stream.viewers.toLocaleString()}
                                            </div>

                                            {/* Trending Badge */}
                                            {stream.trending && (
                                                <div className="absolute bottom-3 left-3 px-2 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                                    <FiTrendingUp className="w-3 h-3" />
                                                    Trending
                                                </div>
                                            )}

                                            {/* Platform Icon */}
                                            <div className="absolute bottom-3 right-3 w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                                <BsTwitch className="text-white w-5 h-5" />
                                            </div>

                                            {/* Play Overlay */}
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30"
                                                >
                                                    <FiPlay className="w-8 h-8 text-white ml-1" />
                                                </motion.div>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Image
                                                    src={stream.avatar}
                                                    alt={stream.streamer}
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                                                />
                                                <div>
                                                    <h3 className="font-bold text-white">{stream.streamer}</h3>
                                                    <p className="text-sm text-gray-400">{stream.game}</p>
                                                </div>
                                            </div>

                                            <h4 className="font-bold text-white mb-4 leading-tight line-clamp-2">
                                                {stream.title}
                                            </h4>

                                            <div className="flex gap-2 mb-4">
                                                {stream.tags.map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-lg">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl text-white font-bold transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <FiPlay className="w-4 h-4" />
                                                Watch Stream
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Section>

                        {/* Enhanced Communities Section */}
                        <Section delay={0.4}>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                                        <FiUsers className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-white">Gaming Communities</h2>
                                        <p className="text-gray-400">Connect with fellow gamers</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {GAMING_COMMUNITIES.map((community, index) => (
                                    <motion.div
                                        key={community.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="group"
                                    >
                                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                                            <div className="relative h-40">
                                                <Image
                                                    src={community.banner}
                                                    alt={community.name}
                                                    fill
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    style={{ objectFit: 'cover' }}
                                                    priority={index === 0}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <Image
                                                                src={community.avatar}
                                                                alt={community.name}
                                                                width={64}
                                                                height={64}
                                                                className="w-16 h-16 rounded-xl object-cover border-2 border-white/20 shadow-lg"
                                                            />
                                                            {community.verified && (
                                                                <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                                                    <FiStar className="w-3 h-3 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-black text-white">{community.name}</h3>
                                                            <p className="text-white/80 flex items-center gap-2">
                                                                <BsController className="w-4 h-4" />
                                                                {community.game}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold flex items-center gap-2">
                                                            <FiUsers className="w-4 h-4" />
                                                            {community.members.toLocaleString()}
                                                        </div>
                                                        <div className="text-green-400 text-sm font-bold mt-1 flex items-center gap-1">
                                                            <FiTrendingUp className="w-3 h-3" />
                                                            {community.growth}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <p className="text-gray-300 mb-4 leading-relaxed">{community.description}</p>

                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {community.tags.map(tag => (
                                                        <span key={tag} className="px-3 py-1 bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-gray-300 text-sm rounded-full border border-gray-600/30">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex gap-3">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl text-white font-bold transition-all duration-300"
                                                        >
                                                            Join Community
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            className="p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-colors border border-gray-600/30"
                                                        >
                                                            <BsDiscord className="w-5 h-5 text-indigo-400" />
                                                        </motion.button>
                                                    </div>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        className="px-4 py-3 bg-gray-700/30 hover:bg-gray-600/30 rounded-xl text-gray-300 font-medium transition-colors border border-gray-600/30"
                                                    >
                                                        View Details
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Section>
                    </div>

                    {/* Enhanced Right Sidebar */}
                    <div className="space-y-8">
                        {/* Trending Games Widget */}
                        <Section delay={0.6}>
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
                                <div className="p-6 border-b border-gray-700/50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                                            <FiZap className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-black text-white">Trending Games</h2>
                                    </div>
                                    <p className="text-gray-400 text-sm">Most popular games right now</p>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        {['Elden Ring', 'Fortnite', 'Valorant', 'Minecraft', 'GTA V'].map((game, index) => (
                                            <motion.div
                                                key={game}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ x: 5 }}
                                                className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-all duration-300 cursor-pointer group"
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                                    index === 1 ? 'bg-gradient-to-r from-gray-500 to-gray-600' :
                                                        index === 2 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                                                            'bg-gradient-to-r from-gray-600 to-gray-700'
                                                    }`}>
                                                    {index + 1}
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors">{game}</h3>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className={`text-xs py-1 px-3 rounded-full font-bold ${index === 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'
                                                        }`}>
                                                        +{Math.floor(Math.random() * 30) + 5}%
                                                    </div>
                                                    <FiTrendingUp className={`w-4 h-4 ${index === 0 ? 'text-green-400' : 'text-gray-500'
                                                        }`} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Quick Stats */}
                        <Section delay={0.8}>
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl p-6">
                                <h3 className="text-xl font-black text-white mb-6">Platform Stats</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-xl border border-orange-500/20">
                                        <div className="text-2xl font-black text-orange-400">2.4M+</div>
                                        <div className="text-sm text-gray-400">Active Gamers</div>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                                        <div className="text-2xl font-black text-purple-400">15K+</div>
                                        <div className="text-sm text-gray-400">Live Streams</div>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                                        <div className="text-2xl font-black text-green-400">850+</div>
                                        <div className="text-sm text-gray-400">Tournaments</div>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
                                        <div className="text-2xl font-black text-cyan-400">5.2K+</div>
                                        <div className="text-sm text-gray-400">Communities</div>
                                    </div>
                                </div>
                            </div>
                        </Section>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
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

                .shadow-3xl {
                    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
                }
            `}</style>
        </div>
    );
}