/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    FiMenu, FiBell, FiSearch, FiSettings, FiUser, FiLogOut, FiPlus,
    FiTrendingUp, FiUsers, FiDollarSign, FiCalendar, FiMessageSquare,
    FiChevronDown, FiGlobe, FiMoon, FiSun, FiHelpCircle, FiZap, FiX
} from 'react-icons/fi';
import { IoSparkles } from "react-icons/io5";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { BsTicketPerforated } from "react-icons/bs";

// Mock data
const mockorganiser = {
    id: 'org1',
    name: 'Joe Rover',
    username: 'joe_rover',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    level: 'Pro',
    points: 4720,
    activeEvents: 12,
    totalRevenue: 45000
};

const mockNotifications = [
    {
        id: '1',
        type: 'payment',
        title: 'Payment received',
        message: 'New payment of $850 for Tech Conference 2025',
        time: '2 minutes ago',
        unread: true,
        icon: <FiDollarSign className="w-4 h-4" />,
        color: 'text-emerald-600 bg-emerald-50'
    },
    {
        id: '2',
        type: 'registration',
        title: 'New registration',
        message: '25 new attendees registered for Music Festival',
        time: '15 minutes ago',
        unread: true,
        icon: <FiUsers className="w-4 h-4" />,
        color: 'text-blue-600 bg-blue-50'
    },
    {
        id: '3',
        type: 'message',
        title: 'Message from attendee',
        message: 'Question about parking arrangements',
        time: '1 hour ago',
        unread: false,
        icon: <FiMessageSquare className="w-4 h-4" />,
        color: 'text-purple-600 bg-purple-50'
    }
];

const mockQuickStats = [
    { label: 'Today\'s Sales', value: '$2,847', change: '+12%', trend: 'up', icon: <FiDollarSign className="w-4 h-4" /> },
    { label: 'Active Events', value: '12', change: '+2', trend: 'up', icon: <BsTicketPerforated className="w-4 h-4" /> },
    { label: 'Total Attendees', value: '1,247', change: '+156', trend: 'up', icon: <FiUsers className="w-4 h-4" /> }
];

const sectionDescriptions = {
    '/organiser-dashboard': 'Your event management control center',
    '/organiser-dashboard/events': 'Create and manage your events',
    '/organiser-dashboard/attendees': 'Manage event registrations and attendees',
    '/organiser-dashboard/analytics': 'Track event performance and insights',
    '/organiser-dashboard/calendar': 'Schedule and organize your events',
    '/organiser-dashboard/marketing': 'Promote your events effectively',
    '/organiser-dashboard/payments': 'Monitor revenue and payouts',
    '/organiser-dashboard/reports': 'Detailed event reports and analytics',
    '/organiser-dashboard/profile': 'Manage your organiser profile',
    '/organiser-dashboard/settings': 'Account and security settings'
};

interface HeaderProps {
    isMobile: boolean;
    onMobileMenuToggleAction: () => void;
}

export default function Header({ isMobile, onMobileMenuToggleAction }: HeaderProps) {
    const pathname = usePathname();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [quickStatsOpen, setQuickStatsOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const searchRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Get current section info
    const getCurrentSection = () => {
        if (pathname === '/organiser-dashboard') return 'dashboard';
        const lastSegment = pathname.split('/').pop() || 'dashboard';
        return lastSegment === 'organiser-dashboard' ? 'dashboard' : lastSegment;
    };

    const getSectionDisplayName = (section: string) => {
        const displayNames: Record<string, string> = {
            'organiser-dashboard': 'Dashboard',
            'dashboard': 'Dashboard',
            'events': 'My Events',
            'attendees': 'Attendees',
            'analytics': 'Analytics',
            'calendar': 'Calendar',
            'marketing': 'Marketing',
            'payments': 'Payments',
            'reports': 'Reports',
            'profile': 'Profile',
            'settings': 'Settings'
        };
        return displayNames[section] || section.charAt(0).toUpperCase() + section.slice(1);
    };

    const currentSection = getCurrentSection();
    const sectionDisplayName = getSectionDisplayName(currentSection);
    const unreadCount = mockNotifications.filter(n => n.unread).length;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle escape key for mobile search
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && searchOpen) {
                setSearchOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [searchOpen]);

    return (
        <>
            <header className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3 z-30">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 via-white/80 to-purple-50/50 backdrop-blur-xl"></div>

                <div className="relative flex items-center justify-between">
                    {/* Left Section */}
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <motion.button
                                onClick={onMobileMenuToggleAction}
                                className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiMenu className="w-5 h-5 text-gray-700" />
                            </motion.button>
                        )}

                        {/* Page Title & Breadcrumb */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-purple-800 bg-clip-text text-transparent truncate">
                                    {sectionDisplayName}
                                </h1>
                                <motion.div
                                    className="hidden md:flex items-center gap-1 flex-shrink-0"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                                    <span className="text-sm text-gray-500 font-medium">
                                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </motion.div>
                            </div>
                            <p className="text-sm text-gray-600 hidden md:block truncate">
                                {sectionDescriptions[pathname as keyof typeof sectionDescriptions]}
                            </p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
                        {/* Search */}
                        <div className="relative" ref={searchRef}>
                            <motion.button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2 sm:p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiSearch className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Theme Toggle - Hidden on very small screens */}
                        <motion.button
                            onClick={() => setDarkMode(!darkMode)}
                            className="hidden xs:block p-2 sm:p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AnimatePresence mode="wait">
                                {darkMode ? (
                                    <motion.div
                                        key="sun"
                                        initial={{ rotate: -180, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 180, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FiSun className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="moon"
                                        initial={{ rotate: 180, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -180, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FiMoon className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Notifications */}
                        <div className="relative" ref={notificationsRef}>
                            <motion.button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="relative p-2 sm:p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiBell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <motion.span
                                        className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </motion.span>
                                )}
                            </motion.button>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <motion.button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5 hover:bg-gray-100 rounded-xl transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="relative">
                                    <Image
                                        src={mockorganiser.image}
                                        alt={mockorganiser.name}
                                        width={36}
                                        height={36}
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover shadow-md ring-2 ring-white"
                                    />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className="text-sm font-semibold text-gray-900">{mockorganiser.name}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-600">{mockorganiser.level}</span>
                                        <div className="flex items-center gap-1">
                                            <IoSparkles className="w-3 h-3 text-amber-500" />
                                            <span className="text-xs font-medium text-amber-600">{mockorganiser.points}</span>
                                        </div>
                                    </div>
                                </div>
                                <FiChevronDown className="w-4 h-4 text-gray-500 hidden lg:block" />
                            </motion.button>
                        </div>

                        {/* Create Event Button */}
                        <motion.button
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl text-sm lg:text-base flex items-center gap-1.5 sm:gap-2"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiZap className="w-4 h-4" />
                            <span className="hidden sm:inline lg:hidden">Create</span>
                            <span className="hidden lg:inline">Create Event</span>
                            <span className="sm:hidden">+</span>
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Mobile Search Overlay */}
            <AnimatePresence>
                {searchOpen && isMobile && (
                    <motion.div
                        className="fixed inset-0 bg-white/95 backdrop-blur-xl z-50 sm:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-4">
                            <div className="flex items-center gap-3 mb-6">
                                <motion.button
                                    onClick={() => setSearchOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiX className="w-5 h-5 text-gray-700" />
                                </motion.button>
                                <h2 className="text-xl font-bold text-gray-900">Search</h2>
                            </div>

                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search events, attendees, reports..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-orange-500 text-base"
                                    autoFocus
                                />
                            </div>

                            {searchQuery === '' && (
                                <div className="mt-8">
                                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</p>
                                    <div className="space-y-2">
                                        {[
                                            { icon: <FiPlus className="w-5 h-5" />, label: 'Create new event' },
                                            { icon: <FiUsers className="w-5 h-5" />, label: 'View attendees' },
                                            { icon: <FiDollarSign className="w-5 h-5" />, label: 'Check payments' }
                                        ].map((action, index) => (
                                            <motion.button
                                                key={action.label}
                                                className="w-full flex items-center gap-4 p-4 hover:bg-orange-50 rounded-2xl transition-colors text-left"
                                                whileHover={{ x: 4 }}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <div className="text-orange-600">{action.icon}</div>
                                                <span className="text-base text-gray-700">{action.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Search Dropdown */}
            <AnimatePresence>
                {searchOpen && !isMobile && (
                    <motion.div
                        className="absolute right-4 sm:right-6 lg:right-8 top-16 sm:top-20 w-80 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl shadow-purple-500/10 p-4 z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search events, attendees, reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 text-sm"
                                autoFocus
                            />
                        </div>

                        {searchQuery === '' && (
                            <div className="mt-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Actions</p>
                                <div className="space-y-1">
                                    {[
                                        { icon: <FiPlus className="w-4 h-4" />, label: 'Create new event', shortcut: '⌘N' },
                                        { icon: <FiUsers className="w-4 h-4" />, label: 'View attendees', shortcut: '⌘A' },
                                        { icon: <FiDollarSign className="w-4 h-4" />, label: 'Check payments', shortcut: '⌘P' }
                                    ].map((action, index) => (
                                        <motion.button
                                            key={action.label}
                                            className="w-full flex items-center gap-3 p-2 hover:bg-orange-50 rounded-lg transition-colors text-left"
                                            whileHover={{ x: 4 }}
                                        >
                                            <div className="text-orange-600">{action.icon}</div>
                                            <span className="flex-1 text-sm text-gray-700">{action.label}</span>
                                            <span className="text-xs text-gray-400">{action.shortcut}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Notifications Dropdown */}
            <AnimatePresence>
                {notificationsOpen && (
                    <motion.div
                        className={`absolute ${isMobile ? 'inset-x-4 top-16' : 'right-4 sm:right-6 lg:right-8 top-16 sm:top-20 w-96'} bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl shadow-purple-500/10 z-50`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-4 border-b border-gray-200/50">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-900">Notifications</h3>
                                <span className="text-sm text-orange-600 font-medium">{unreadCount} new</span>
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {mockNotifications.map((notification, index) => (
                                <motion.div
                                    key={notification.id}
                                    className={`p-4 border-b border-gray-100/50 hover:bg-orange-50/50 transition-colors cursor-pointer ${notification.unread ? 'bg-blue-50/30' : ''
                                        }`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ x: 4 }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${notification.color}`}>
                                            {notification.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-900 text-sm">{notification.title}</p>
                                                {notification.unread && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-4">
                            <button className="w-full text-sm text-orange-600 hover:text-orange-700 font-medium">
                                View all notifications
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Dropdown */}
            <AnimatePresence>
                {profileOpen && (
                    <motion.div
                        className={`absolute ${isMobile ? 'inset-x-4 top-16' : 'right-4 sm:right-6 lg:right-8 top-16 sm:top-20 w-72'} bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl shadow-purple-500/10 z-50`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Profile Header */}
                        <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-orange-50/50 to-purple-50/50">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={mockorganiser.image}
                                    alt={mockorganiser.name}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 rounded-xl object-cover shadow-md"
                                />
                                <div>
                                    <p className="font-bold text-gray-900">{mockorganiser.name}</p>
                                    <p className="text-sm text-orange-600">{mockorganiser.level} organiser</p>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1">
                                            <IoSparkles className="w-3 h-3 text-amber-500" />
                                            <span className="text-xs font-medium">{mockorganiser.points} points</span>
                                        </div>
                                        <div className="text-xs text-gray-600">{mockorganiser.activeEvents} active events</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                            {[
                                { icon: <FiUser className="w-4 h-4" />, label: 'View Profile', href: '/organiser-dashboard/profile' },
                                { icon: <FiSettings className="w-4 h-4" />, label: 'Account Settings', href: '/organiser-dashboard/settings' },
                                { icon: <HiOutlineLightBulb className="w-4 h-4" />, label: 'Tips & Tutorials', href: '#' },
                                { icon: <FiHelpCircle className="w-4 h-4" />, label: 'Help & Support', href: '#' },
                                { icon: <FiGlobe className="w-4 h-4" />, label: 'Language', href: '#', badge: 'EN' }
                            ].map((item, index) => (
                                <motion.button
                                    key={item.label}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl transition-colors text-left"
                                    whileHover={{ x: 4 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="text-gray-600">{item.icon}</div>
                                    <span className="flex-1 text-sm text-gray-700">{item.label}</span>
                                    {item.badge && (
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                            {item.badge}
                                        </span>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Sign Out */}
                        <div className="p-2 border-t border-gray-200/50">
                            <motion.button
                                className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors text-left group"
                                whileHover={{ x: 4 }}
                            >
                                <FiLogOut className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                                <span className="text-sm text-gray-700 group-hover:text-red-600">Sign Out</span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}