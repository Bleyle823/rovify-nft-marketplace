
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiBell, FiMenu, FiX, FiCalendar, FiMapPin,
    FiClock, FiArrowRight, FiHash, FiBookmark, FiChevronRight,
    FiHome, FiCompass, FiUser, FiHeart, FiMessageSquare, FiStar,
    FiGift, FiTrendingUp, FiZap
} from 'react-icons/fi';
import { BsCameraVideoFill, BsMusicNote } from "react-icons/bs";
import { IoTicket, IoSparkles, IoFlash } from "react-icons/io5";
import { usePathname } from 'next/navigation';
import { getCurrentUser } from '@/mocks/data/users';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

// COMMENTED OUT: Live notification interface
// interface LiveNotification {
//     id: string;
//     type: 'event' | 'friend' | 'message' | 'like' | 'ticket' | 'reminder';
//     content: string;
//     timestamp: number;
// }

interface User {
    id: string;
    name: string;
    image: string;
    verified: boolean;
}

interface HeaderProps {
    isSidebarExpanded?: boolean;
}

export default function Header({ isSidebarExpanded = false }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // COMMENTED OUT: Notification states
    // const [showNotifications, setShowNotifications] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState('for-you');
    const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

    // COMMENTED OUT: Enhanced notification center state with queue management
    // const [liveNotifications, setLiveNotifications] = useState<LiveNotification[]>([
    //     {
    //         id: '1',
    //         type: 'friend',
    //         content: 'Chloe just arrived to the party',
    //         timestamp: Date.now()
    //     }
    // ]);
    // const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
    // const [showLiveNotification, setShowLiveNotification] = useState(true);
    // const [showMobileNotification, setShowMobileNotification] = useState(true);
    // const [isNotificationPaused, setIsNotificationPaused] = useState(false);
    // const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    // const hideNotificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // const queueTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const featuredIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    // COMMENTED OUT: Notification refs
    // const notificationsRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const mobileNavRef = useRef<HTMLDivElement>(null);

    // COMMENTED OUT: Enhanced notification types with better variety
    // const possibleNotifications: Omit<LiveNotification, 'id' | 'timestamp'>[] = [
    //     { type: 'friend', content: 'Chloe just arrived to the party' },
    //     { type: 'friend', content: 'Alex is now attending Tech Summit 2025' },
    //     { type: 'event', content: 'Summer Festival 2025 starts in 3 hours' },
    //     { type: 'message', content: 'New message from Sarah about the event' },
    //     { type: 'like', content: 'Jamie liked your RSVP to Crypto Meetup' },
    //     { type: 'ticket', content: 'Your NFT tickets for Neon Nights are ready' },
    //     { type: 'event', content: 'Startup pitch competition is trending now' },
    //     { type: 'reminder', content: 'Mindfulness Retreat starts tomorrow' },
    //     { type: 'friend', content: 'Miguel and 3 others joined Web3 Hackathon' },
    //     { type: 'message', content: 'Event organiser sent you important details' }
    // ];

    // COMMENTED OUT: Enhanced notifications data
    // const notifications = [
    //     {
    //         id: '1',
    //         type: 'event',
    //         title: 'Event Starting Soon',
    //         content: 'Tech Summit 2025 starts in 3 hours - Don\'t miss the opening keynote!',
    //         image: '/images/events/tech-summit.jpg',
    //         time: '2 hours ago',
    //         read: false,
    //         link: '/events/tech-summit-2025',
    //         priority: 'high'
    //     },
    //     {
    //         id: '2',
    //         type: 'message',
    //         title: 'New Message',
    //         content: 'Sarah sent you a message about the Culinary Masterclass venue change',
    //         time: '4 hours ago',
    //         read: true,
    //         link: '/messages/sarah',
    //         priority: 'medium'
    //     },
    //     {
    //         id: '3',
    //         type: 'system',
    //         title: 'Tickets Confirmed',
    //         content: 'Your premium NFT tickets for Neon Nights have been confirmed and transferred',
    //         time: '1 day ago',
    //         read: false,
    //         link: '/tickets/neon-nights',
    //         priority: 'high'
    //     },
    //     {
    //         id: '4',
    //         type: 'reminder',
    //         title: 'Upcoming Event',
    //         content: 'Mindfulness Retreat starts tomorrow at 9 AM - Prepare your meditation setup',
    //         time: '2 days ago',
    //         read: true,
    //         link: '/events/mindfulness-retreat',
    //         priority: 'low'
    //     }
    // ];

    const recentSearches = [
        'Tech conferences 2025',
        'Music festivals near me',
        'Cooking workshops this weekend',
        'Free events today'
    ];

    const popularCategories = [
        { name: 'Music', icon: <BsMusicNote />, color: 'text-purple-500', bgColor: 'bg-purple-50' },
        { name: 'Tech', icon: <FiHash />, color: 'text-blue-500', bgColor: 'bg-blue-50' },
        { name: 'Art', icon: <IoSparkles />, color: 'text-pink-500', bgColor: 'bg-pink-50' },
        { name: 'Wellness', icon: <FiHeart />, color: 'text-green-500', bgColor: 'bg-green-50' },
        { name: 'Free Events', icon: <FiStar />, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
        { name: 'This Weekend', icon: <FiCalendar />, color: 'text-indigo-500', bgColor: 'bg-indigo-50' }
    ];

    const navigationTabs = [
        { id: 'for-you', label: 'For you', href: '/home', icon: <FiHome /> },
        { id: 'nearby', label: 'Nearby', href: '/near-me', icon: <FiMapPin /> },
        // { id: 'friends', label: 'Friends', href: '/rovies', icon: <FiUser /> }
    ];

    // Enhanced featured content - one card per scroll with auto-next
    const featuredContent = [
        {
            id: '1',
            title: '🎉 Summer Festival 2025',
            subtitle: 'Early bird tickets - 50% OFF',
            description: 'Join thousands for the ultimate music weekend',
            cta: 'Get Tickets',
            gradient: 'from-purple-500 via-pink-500 to-red-500',
            link: '/events/summer-festival'
        },
        {
            id: '2',
            title: '⚡ Premium Membership',
            subtitle: 'Unlock exclusive events & perks',
            description: 'VIP access, priority booking, and special discounts',
            cta: 'Upgrade Now',
            gradient: 'from-blue-500 via-cyan-500 to-teal-500',
            link: '/premium'
        },
        {
            id: '3',
            title: '🎯 Trending This Week',
            subtitle: 'Top 10 events near you',
            description: 'Discover the hottest events in your area',
            cta: 'Explore',
            gradient: 'from-orange-500 via-red-500 to-pink-500',
            link: '/trending'
        },
        {
            id: '4',
            title: '🎵 Live Shows Tonight',
            subtitle: 'Don\'t miss out',
            description: 'Amazing live performances happening now',
            cta: 'See All',
            gradient: 'from-green-500 via-teal-500 to-blue-500',
            link: '/live'
        }
    ];

    // Sync activeTab with pathname
    useEffect(() => {
        if (pathname === '/home') {
            setActiveTab('for-you');
        } else if (pathname.includes('/near-me')) {
            setActiveTab('nearby');
        } else if (pathname === '/rovies') {
            setActiveTab('friends');
        }
    }, [pathname]);

    // Auto-scroll featured content
    useEffect(() => {
        featuredIntervalRef.current = setInterval(() => {
            setCurrentFeaturedIndex(prev =>
                prev === featuredContent.length - 1 ? 0 : prev + 1
            );
        }, 4000); // Change every 4 seconds

        return () => {
            if (featuredIntervalRef.current) {
                clearInterval(featuredIntervalRef.current);
            }
        };
    }, [featuredContent.length]);

    // COMMENTED OUT: Enhanced notification management with intelligent queue system
    // useEffect(() => {
    //     const addRandomNotification = () => {
    //         const randomIndex = Math.floor(Math.random() * possibleNotifications.length);
    //         const newNotification = {
    //             ...possibleNotifications[randomIndex],
    //             id: `notification-${Date.now()}`,
    //             timestamp: Date.now()
    //         };

    //         setLiveNotifications(prev => [newNotification, ...prev].slice(0, 5));
    //         setShowLiveNotification(true);
    //         setShowMobileNotification(true);

    //         // Auto-dismiss oldest notification after 6 seconds if not paused
    //         if (!isNotificationPaused) {
    //             if (queueTimeoutRef.current) {
    //                 clearTimeout(queueTimeoutRef.current);
    //             }
    //             queueTimeoutRef.current = setTimeout(() => {
    //                 if (!isNotificationPaused) {
    //                     setLiveNotifications(prev => {
    //                         if (prev.length > 0) {
    //                             return prev.slice(0, -1); // Remove oldest
    //                         }
    //                         return prev;
    //                     });
    //                 }
    //             }, 6000);
    //         }
    //     };

    //     const setupNextNotification = () => {
    //         const randomDelay = Math.floor(Math.random() * 12000) + 8000; // 8-20 seconds
    //         return setTimeout(addRandomNotification, randomDelay);
    //     };

    //     const timeout = setupNextNotification();
    //     return () => {
    //         clearTimeout(timeout);
    //         if (queueTimeoutRef.current) {
    //             clearTimeout(queueTimeoutRef.current);
    //         }
    //     };
    // }, [possibleNotifications, isNotificationPaused]);

    // COMMENTED OUT: Auto-cycle through mobile notifications
    // useEffect(() => {
    //     if (isMobile && liveNotifications.length > 0 && showMobileNotification && !isNotificationPaused) {
    //         hideNotificationTimeoutRef.current = setTimeout(() => {
    //             setShowMobileNotification(false);
    //             // Show next notification after a brief pause
    //             setTimeout(() => {
    //                 setLiveNotifications(prev => {
    //                     if (prev.length > 1) {
    //                         setShowMobileNotification(true);
    //                         return prev.slice(1); // Remove first, show next
    //                     }
    //                     return prev;
    //                 });
    //             }, 500);
    //         }, 6000);
    //     }

    //     return () => {
    //         if (hideNotificationTimeoutRef.current) {
    //             clearTimeout(hideNotificationTimeoutRef.current);
    //         }
    //     };
    // }, [isMobile, liveNotifications.length, showMobileNotification, isNotificationPaused]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);

        // Simulate user loading
        const timer = setTimeout(() => {
            setCurrentUser(getCurrentUser());
            setIsLoading(false);
        }, 1000);

        // Handle outside clicks
        const handleClickOutside = (event: MouseEvent) => {
            // COMMENTED OUT: Notification outside click handling
            // if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
            //     setShowNotifications(false);
            // }

            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearch(false);
            }

            if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node) &&
                !(event.target as Element)?.closest('.mobile-menu-button')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', checkMobile);
            document.removeEventListener('mousedown', handleClickOutside);
            clearTimeout(timer);
            // COMMENTED OUT: Notification cleanup
            // if (notificationIntervalRef.current) {
            //     clearInterval(notificationIntervalRef.current);
            // }
            // if (hideNotificationTimeoutRef.current) {
            //     clearTimeout(hideNotificationTimeoutRef.current);
            // }
            // if (queueTimeoutRef.current) {
            //     clearTimeout(queueTimeoutRef.current);
            // }
            if (featuredIntervalRef.current) {
                clearInterval(featuredIntervalRef.current);
            }
        };
    }, []);

    // COMMENTED OUT: Notification toggle functions
    // const toggleNotifications = useCallback((e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     setShowNotifications(!showNotifications);
    //     if (!showNotifications) {
    //         setShowSearch(false);
    //     }
    // }, [showNotifications]);

    const toggleSearch = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setShowSearch(!showSearch);
        if (!showSearch) {
            // COMMENTED OUT: Close notifications when opening search
            // setShowNotifications(false);
        }
    }, [showSearch]);

    const toggleMobileMenu = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    }, [isMenuOpen]);

    const closeMobileMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            setShowSearch(false);
        }
    };

    // COMMENTED OUT: Enhanced notification icon function
    // const getNotificationIcon = (type: LiveNotification['type']) => {
    //     const iconMap = {
    //         event: <FiCalendar className="w-4 h-4" />,
    //         friend: <FiUser className="w-4 h-4" />,
    //         message: <FiMessageSquare className="w-4 h-4" />,
    //         like: <FiHeart className="w-4 h-4" />,
    //         ticket: <IoTicket className="w-4 h-4" />,
    //         reminder: <FiClock className="w-4 h-4" />
    //     };
    //     return iconMap[type] || <FiBell className="w-4 h-4" />;
    // };

    // COMMENTED OUT: Notification color schemes
    // const getNotificationColors = (type: LiveNotification['type']) => {
    //     const colorMap = {
    //         event: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' },
    //         friend: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-500' },
    //         message: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-500' },
    //         like: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' },
    //         ticket: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-500' },
    //         reminder: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: 'text-indigo-500' }
    //     };
    //     return colorMap[type] || { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-500' };
    // };

    // COMMENTED OUT: Unread notification count
    // const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <>
            {/* COMMENTED OUT: iOS-style Mobile Notification at Top */}
            {/* <AnimatePresence>
                {isMobile && liveNotifications.length > 0 && showMobileNotification && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            duration: 0.5
                        }}
                        className="fixed top-0 left-0 right-0 z-[60] mx-4 mt-2"
                        style={{ paddingTop: 'env(safe-area-inset-top)' }}
                        onMouseEnter={() => setIsNotificationPaused(true)}
                        onMouseLeave={() => setIsNotificationPaused(false)}
                    >
                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            className={`
                                px-4 py-3 ${getNotificationColors(liveNotifications[0].type).bg} 
                                bg-white/95 backdrop-blur-xl rounded-2xl flex items-center shadow-xl
                                border ${getNotificationColors(liveNotifications[0].type).border}
                            `}
                            style={{
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                            }}
                            onClick={() => setShowMobileNotification(false)}
                        >
                            <div className="w-2 h-12 bg-[#FF5722] rounded-full mr-3" />
                            <div className={`w-8 h-8 rounded-xl ${getNotificationColors(liveNotifications[0].type).bg} flex items-center justify-center mr-3 border border-white/50`}>
                                <span className={getNotificationColors(liveNotifications[0].type).icon}>
                                    {getNotificationIcon(liveNotifications[0].type)}
                                </span>
                            </div>
                            <div className="flex-1">
                                <span className={`text-sm font-semibold ${getNotificationColors(liveNotifications[0].type).text}`}>
                                    {liveNotifications[0].content}
                                </span>
                                <div className="text-xs text-gray-500 mt-0.5">Just now</div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="ml-2 w-6 h-6 rounded-full bg-gray-200/50 hover:bg-gray-300/50 flex items-center justify-center"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMobileNotification(false);
                                }}
                            >
                                <FiX className="w-3 h-3 text-gray-600" />
                            </motion.button>

                            {liveNotifications.length > 1 && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#FF5722] to-[#E64A19] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                    <span className="text-white text-xs font-bold">{liveNotifications.length}</span>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence> */}

            {/* COMMENTED OUT: Top-Right Notification Toast System */}
            {/* <div className="fixed top-20 right-4 z-[60] max-w-sm space-y-3">
                <AnimatePresence mode="popLayout">
                    {!isMobile && liveNotifications.slice(0, 4).map((notification, index) => {
                        const isVisible = showLiveNotification && index < 3;
                        if (!isVisible) return null;

                        const colors = getNotificationColors(notification.type);
                        const isLatest = index === 0;

                        return (
                            <motion.div
                                key={notification.id}
                                layout
                                initial={{
                                    y: -100,
                                    opacity: 0,
                                    scale: 0.8,
                                    x: 50
                                }}
                                animate={{
                                    y: index * 12,
                                    opacity: isLatest ? 1 : 0.7 - (index * 0.15),
                                    scale: isLatest ? 1 : 0.95 - (index * 0.05),
                                    x: index * 8,
                                    zIndex: 100 - index
                                }}
                                exit={{
                                    y: -100,
                                    opacity: 0,
                                    scale: 0.6,
                                    x: 100,
                                    transition: { duration: 0.4, ease: "backIn" }
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                    delay: index * 0.1
                                }}
                                className="relative cursor-pointer group"
                                style={{ zIndex: 100 - index }}
                                onMouseEnter={() => setIsNotificationPaused(true)}
                                onMouseLeave={() => setIsNotificationPaused(false)}
                            >
                                [Complete notification card content would be here]
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div> */}

            <header
                ref={headerRef}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${scrolled
                    ? 'py-2 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50'
                    : 'py-4 bg-white/90 backdrop-blur-lg'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo and Navigation */}
                        <div className="flex items-center gap-8">
                            {/* Enhanced Logo */}
                            <Link href="/" className="flex items-center gap-3 group">
                                <motion.div
                                    className="h-11 w-11 bg-gradient-to-br from-[#FF5722] to-[#E64A19] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 overflow-hidden group-hover:shadow-xl group-hover:shadow-orange-500/30 transition-all duration-300"
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Image
                                        // src={RoviLogo}
                                        src="/images/contents/rovi-logo.png"
                                        alt="Rovify Logo"
                                        width={28}
                                        height={28}
                                        className="object-contain"
                                    />
                                </motion.div>
                                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hidden sm:block group-hover:from-[#FF5722] group-hover:to-[#E64A19] transition-all duration-300">
                                    rovify
                                </span>
                            </Link>

                            {/* Enhanced Desktop Navigation */}
                            <div className="hidden lg:block">
                                <div className="relative flex items-center bg-gray-50/80 rounded-2xl p-1.5 backdrop-blur-sm">
                                    {navigationTabs.map((tab) => (
                                        <Link
                                            key={tab.id}
                                            href={tab.href}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`relative px-6 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl flex items-center gap-2 ${activeTab === tab.id
                                                ? 'text-white bg-gradient-to-r from-[#FF5722] to-[#E64A19] shadow-lg shadow-orange-500/25'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                                                }`}
                                        >
                                            <span className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`}>
                                                {tab.icon}
                                            </span>
                                            {tab.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Right Side Actions */}
                        <div className="flex items-center gap-3">
                            {/* Cute Compact Search */}
                            <div className="relative" ref={searchRef}>
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -0.5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/90 border border-gray-200/60 shadow-md backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-lg hover:border-gray-300/80 transition-all duration-200"
                                    onClick={toggleSearch}
                                >
                                    <FiSearch className="w-4.5 h-4.5" />
                                </motion.button>

                                <AnimatePresence>
                                    {showSearch && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className={`absolute top-12 z-50 bg-white/98 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden ${isMobile
                                                ? 'fixed left-4 right-4 top-20 max-w-none'
                                                : 'right-0 w-80'
                                                }`}
                                            style={{
                                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.9)'
                                            }}
                                        >
                                            <div className="p-5">
                                                <form onSubmit={handleSearchSubmit}>
                                                    <div className="relative mb-5">
                                                        <motion.input
                                                            initial={{ scale: 0.98, opacity: 0.8 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            whileFocus={{ scale: 1.01 }}
                                                            type="text"
                                                            placeholder="Search events..."
                                                            className="w-full py-3 text-sm pl-10 pr-4 bg-gray-50/60 rounded-xl border border-gray-200/60 focus:ring-1 focus:ring-[#FF5722]/30 focus:border-[#FF5722]/50 transition-all text-gray-700 placeholder-gray-400 font-medium hover:bg-gray-50/80 focus:bg-white/80"
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <motion.div
                                                            initial={{ scale: 0.9 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                        >
                                                            <FiSearch className="w-4 h-4" />
                                                        </motion.div>
                                                        {searchQuery && (
                                                            <motion.button
                                                                initial={{ scale: 0, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                type="button"
                                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200/80 hover:bg-gray-300/80 flex items-center justify-center transition-all"
                                                                onClick={() => setSearchQuery('')}
                                                            >
                                                                <FiX className="w-3 h-3 text-gray-600" />
                                                            </motion.button>
                                                        )}
                                                    </div>
                                                </form>

                                                {/* Cute Recent Searches */}
                                                {recentSearches.length > 0 && (
                                                    <div className="mb-5">
                                                        <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                                                            <FiClock className="w-3.5 h-3.5" />
                                                            Recent
                                                        </h3>
                                                        <div className="space-y-1">
                                                            {recentSearches.slice(0, 3).map((search, index) => (
                                                                <motion.button
                                                                    key={index}
                                                                    whileHover={{ x: 2, backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    className="flex items-center w-full px-3 py-2.5 rounded-lg text-left text-sm text-gray-600 transition-all group"
                                                                    onClick={() => setSearchQuery(search)}
                                                                >
                                                                    <FiClock className="w-3.5 h-3.5 mr-3 text-gray-400 group-hover:text-gray-500" />
                                                                    <span className="group-hover:text-gray-800 truncate">{search}</span>
                                                                </motion.button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Cute Popular Categories */}
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                                                        <IoSparkles className="w-3.5 h-3.5" />
                                                        Popular
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {popularCategories.slice(0, 4).map((category, index) => (
                                                            <Link
                                                                href={`/discover?category=${category.name.toLowerCase()}`}
                                                                key={index}
                                                                onClick={() => setShowSearch(false)}
                                                            >
                                                                <motion.div
                                                                    whileHover={{ scale: 1.02, y: -1 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    className={`flex items-center px-3 py-3 rounded-xl text-xs transition-all group ${category.bgColor} hover:shadow-sm border border-white/50`}
                                                                >
                                                                    <span className={`w-4 h-4 flex items-center justify-center mr-2.5 ${category.color}`}>
                                                                        {category.icon}
                                                                    </span>
                                                                    <span className={`font-semibold ${category.color} truncate`}>{category.name}</span>
                                                                </motion.div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {isLoading ? (
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                            ) : currentUser ? (
                                <>
                                    {/* COMMENTED OUT: ENHANCED Notification Bell with Attention Indicators */}
                                    {/* <div className="relative" ref={notificationsRef}>
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={toggleNotifications}
                                            className="relative w-11 h-11 rounded-2xl flex items-center justify-center bg-white/90 border border-gray-200/50 shadow-lg backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl hover:border-gray-300 transition-all duration-300"
                                        >
                                            <FiBell className="w-5 h-5" />

                                            {unreadCount > 0 && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white"
                                                >
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </motion.span>
                                            )}

                                            {liveNotifications.length > 0 && (
                                                <>
                                                    <motion.div
                                                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5722]"
                                                        animate={{
                                                            scale: [1, 1.3, 1],
                                                            opacity: [0.7, 0.3, 0.7]
                                                        }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    />
                                                    <motion.div
                                                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5722]"
                                                        animate={{
                                                            scale: [1, 1.6, 1],
                                                            opacity: [0.5, 0, 0.5]
                                                        }}
                                                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                                    />
                                                </>
                                            )}
                                        </motion.button>

                                        <AnimatePresence>
                                            {showNotifications && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 15, scale: 0.9 }}
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                    className="absolute right-0 top-14 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
                                                    style={{
                                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)',
                                                    }}
                                                >
                                                    [Complete notification dropdown content would be here]
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div> */}

                                    {/* Enhanced DAO Button */}
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="hidden sm:block"
                                    >
                                        <Link href="/dao">
                                            <button className="h-11 px-6 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200/50 rounded-2xl shadow-lg text-gray-900 hover:from-gray-100 hover:to-gray-200 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                                                <span className="font-semibold text-sm">DAO</span>
                                            </button>
                                        </Link>
                                    </motion.div>

                                    {/* Enhanced Connect Wallet Button */}
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="hidden sm:block"
                                    >
                                        <Link href="#">
                                            <button className="h-11 px-6 bg-gradient-to-r from-[#FF5722] to-[#E64A19] rounded-2xl shadow-lg shadow-orange-500/25 text-white hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300">
                                                <span className="font-semibold text-sm whitespace-nowrap">Connect Wallet</span>
                                            </button>
                                        </Link>
                                    </motion.div>

                                    {/* Enhanced Mobile Menu Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="mobile-menu-button lg:hidden w-11 h-11 rounded-2xl flex items-center justify-center bg-white/90 border border-gray-200/50 shadow-lg backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl hover:border-gray-300 transition-all duration-300"
                                        onClick={toggleMobileMenu}
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={isMenuOpen ? 'close' : 'open'}
                                                initial={{ rotate: -90, opacity: 0 }}
                                                animate={{ rotate: 0, opacity: 1 }}
                                                exit={{ rotate: 90, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                                            </motion.div>
                                        </AnimatePresence>
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors hidden sm:block"
                                    >
                                        Log In
                                    </Link>

                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href="/signup"
                                            className="bg-gradient-to-r from-[#FF5722] to-[#E64A19] hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 px-6 py-2.5 rounded-2xl text-white text-sm font-semibold shadow-lg inline-block"
                                        >
                                            Sign Up
                                        </Link>
                                    </motion.div>

                                    {/* Mobile Menu Button for Non-authenticated */}
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="mobile-menu-button lg:hidden w-11 h-11 rounded-2xl flex items-center justify-center bg-white/90 border border-gray-200/50 shadow-lg backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl hover:border-gray-300 transition-all duration-300"
                                        onClick={toggleMobileMenu}
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={isMenuOpen ? 'close' : 'open'}
                                                initial={{ rotate: -90, opacity: 0 }}
                                                animate={{ rotate: 0, opacity: 1 }}
                                                exit={{ rotate: 90, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                                            </motion.div>
                                        </AnimatePresence>
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Streamlined Mobile Navigation Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        ref={mobileNavRef}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="fixed top-[72px] left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-2xl z-40 lg:hidden max-h-[calc(100vh-72px)] overflow-y-auto"
                    >
                        <div className="p-6">
                            {/* One Card Per Scroll with Auto-Next Featured Content */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <IoSparkles className="w-5 h-5 text-[#FF5722]" />
                                    Featured for You
                                </h3>

                                <div className="relative overflow-hidden rounded-3xl">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentFeaturedIndex}
                                            initial={{ x: 300, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -300, opacity: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30
                                            }}
                                            className="w-full"
                                        >
                                            <Link
                                                href={featuredContent[currentFeaturedIndex].link}
                                                className={`block p-6 rounded-3xl bg-gradient-to-br ${featuredContent[currentFeaturedIndex].gradient} text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]`}
                                                onClick={closeMobileMenu}
                                            >
                                                <div className="relative">
                                                    <h4 className="font-bold text-xl mb-2 leading-tight">
                                                        {featuredContent[currentFeaturedIndex].title}
                                                    </h4>
                                                    <p className="text-white/90 text-base mb-1 font-medium">
                                                        {featuredContent[currentFeaturedIndex].subtitle}
                                                    </p>
                                                    <p className="text-white/80 text-sm mb-4 leading-relaxed">
                                                        {featuredContent[currentFeaturedIndex].description}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                                                            {featuredContent[currentFeaturedIndex].cta}
                                                            <FiArrowRight className="w-4 h-4 ml-2" />
                                                        </span>

                                                        {/* Progress indicators */}
                                                        <div className="flex gap-1">
                                                            {featuredContent.map((_, index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentFeaturedIndex
                                                                        ? 'bg-white scale-125'
                                                                        : 'bg-white/50'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Link href="/dao" onClick={closeMobileMenu} className="block">
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 w-full py-5 px-6 rounded-2xl text-gray-900 font-semibold text-base transition-all flex items-center justify-between shadow-lg border border-gray-200/50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-200/80 flex items-center justify-center shadow-sm">
                                                <FiHash className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <span className="block font-bold">DAO</span>
                                                <span className="text-sm text-gray-500">Governance & Voting</span>
                                            </div>
                                        </div>
                                        <FiChevronRight className="w-5 h-5 text-gray-400" />
                                    </motion.div>
                                </Link>

                                <Link href="#" onClick={closeMobileMenu} className="block">
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-gradient-to-r from-[#FF5722]/10 to-[#E64A19]/10 hover:from-[#FF5722]/20 hover:to-[#E64A19]/20 w-full py-5 px-6 rounded-2xl text-[#FF5722] font-semibold text-base transition-all flex items-center justify-between shadow-lg border border-[#FF5722]/20"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#FF5722]/10 flex items-center justify-center shadow-sm">
                                                <IoFlash className="w-5 h-5 text-[#FF5722]" />
                                            </div>
                                            <div>
                                                <span className="block font-bold">Connect Wallet</span>
                                                <span className="text-sm text-[#FF5722]/70">Link your crypto wallet</span>
                                            </div>
                                        </div>
                                        <FiChevronRight className="w-5 h-5" />
                                    </motion.div>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* COMMENTED OUT: Enhanced Global Styles for notifications */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(300%) skewX(-12deg); }
                }
                
                .animate-shimmer {
                    background: linear-gradient(
                        90deg,
                        #f0f0f0 25%,
                        #e0e0e0 50%,
                        #f0f0f0 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }
                
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                /* Enhanced scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
                
                /* Enhanced content spacing */
                @media (min-width: 768px) {
                    .main-content {
                        margin-left: 5rem;
                        padding-top: 5rem;
                    }
                }
                
                @media (max-width: 767px) {
                    .main-content {
                        padding-top: 6rem;
                        padding-bottom: 6rem;
                    }
                }
                
                /* Enhanced glassmorphism */
                .glass-effect {
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                /* Enhanced mobile safe area */
                @supports (padding: max(0px)) {
                    .mobile-safe-area {
                        padding-left: max(1rem, env(safe-area-inset-left));
                        padding-right: max(1rem, env(safe-area-inset-right));
                    }
                }

                /* COMMENTED OUT: Enhanced notification attention system */
                /* .notification-attention {
                    position: relative;
                }
                
                .notification-attention::before {
                    content: '';
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 16px;
                    height: 16px;
                    background: radial-gradient(circle, #FF5722 0%, transparent 70%);
                    border-radius: 50%;
                    animation: attention-pulse 2s infinite;
                }
                
                @keyframes attention-pulse {
                    0%, 100% { 
                        transform: scale(1); 
                        opacity: 0.8; 
                    }
                    50% { 
                        transform: scale(1.4); 
                        opacity: 0.3; 
                    }
                }
                
                .notification-card-enhanced {
                    box-shadow: 
                        0 20px 35px -10px rgba(0, 0, 0, 0.15),
                        0 0 0 1px rgba(255, 255, 255, 0.9),
                        0 2px 8px rgba(255, 87, 34, 0.1);
                }
                
                @keyframes notification-entrance {
                    0% {
                        transform: translateY(-100px) translateX(50px) scale(0.8);
                        opacity: 0;
                    }
                    60% {
                        transform: translateY(10px) translateX(-5px) scale(1.05);
                        opacity: 0.9;
                    }
                    100% {
                        transform: translateY(0) translateX(0) scale(1);
                        opacity: 1;
                    }
                }
                
                .notification-entrance {
                    animation: notification-entrance 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                } */

                /* Cute search component styles */
                .search-input-focus {
                    transform: scale(1.01);
                    background: rgba(255, 255, 255, 0.9);
                    border-color: rgba(255, 87, 34, 0.4);
                    box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.1);
                }

                .search-category-hover {
                    transform: translateY(-1px) scale(1.02);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                /* Cute micro-interactions */
                @keyframes cute-bounce {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }

                .cute-bounce {
                    animation: cute-bounce 0.3s ease-in-out;
                }

                /* Enhanced search suggestions hover */
                .search-suggestion:hover {
                    background: rgba(249, 250, 251, 0.8);
                    transform: translateX(2px);
                    border-radius: 8px;
                }
            `}</style>
        </>
    );
}

{/* 
function QuickActionButton({ icon, label, href, onClose }: { 
    icon: React.ReactNode, 
    label: string, 
    href: string,
    onClose: () => void
}) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.includes(href);

    return (
        <Link href={href} className="flex flex-col items-center justify-center group flex-shrink-0" onClick={onClose}>
            <motion.div 
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`p-3 rounded-2xl mb-1 transition-all duration-300 ${
                    isActive
                        ? 'bg-gradient-to-br from-[#FF5722] to-[#E64A19] text-white shadow-lg shadow-orange-500/25'
                        : 'bg-gray-50/80 text-gray-600 hover:bg-gray-100/80 border border-gray-200/50'
                }`}
            >
                <div className="w-5 h-5">{icon}</div>
            </motion.div>
            <span className={`text-xs font-medium transition-colors ${
                isActive ? 'text-[#FF5722]' : 'text-gray-600 group-hover:text-gray-900'
            }`}>
                {label}
            </span>
        </Link>
    );
}
*/}