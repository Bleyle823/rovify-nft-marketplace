/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    FiUser, FiCreditCard, FiSettings, FiSliders, FiUsers, FiArchive,
    FiBarChart, FiBookmark, FiHome, FiChevronRight, FiChevronLeft,
    FiMenu, FiBell
} from 'react-icons/fi';
import { IoSparkles } from "react-icons/io5";
import RoviLogo from '@/public/images/contents/rovi-logo.png';

const mockUser = {
    id: 'user1',
    name: 'Joe Love',
    username: 'joe_rover',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    level: 'Gold',
    points: 2840,
};

const mockFriendRequests = [
    { id: '1', name: 'David Park' },
    { id: '2', name: 'Lisa Thompson' }
];

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    section: 'main' | 'secondary';
    href: string;
}

const sidebarItems: SidebarItem[] = [
    { id: 'user-dashboard', label: 'Dashboard', icon: <FiHome className="w-5 h-5" />, section: 'main', href: '/user-dashboard' },
    { id: 'profile', label: 'Profile', icon: <FiUser className="w-5 h-5" />, section: 'main', href: '/user-dashboard/profile' },
    { id: 'wallet', label: 'Wallet', icon: <FiCreditCard className="w-5 h-5" />, section: 'main', href: '/user-dashboard/wallet' },
    { id: 'friends', label: 'Friends', icon: <FiUsers className="w-5 h-5" />, badge: 2, section: 'main', href: '/user-dashboard/friends' },
    { id: 'history', label: 'History', icon: <FiArchive className="w-5 h-5" />, section: 'main', href: '/user-dashboard/history' },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart className="w-5 h-5" />, section: 'secondary', href: '/user-dashboard/analytics' },
    { id: 'collections', label: 'Collections', icon: <FiBookmark className="w-5 h-5" />, section: 'secondary', href: '/user-dashboard/collections' },
    { id: 'preferences', label: 'Preferences', icon: <FiSliders className="w-5 h-5" />, section: 'secondary', href: '/user-dashboard/preferences' },
    { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" />, section: 'secondary', href: '/user-dashboard/settings' }
];

const sectionDescriptions = {
    '/user-dashboard': 'Your personal event control center',
    '/user-dashboard/profile': 'Manage your public profile and achievements',
    '/user-dashboard/wallet': 'Manage your crypto wallet and transactions',
    '/user-dashboard/friends': 'Connect with other event enthusiasts',
    '/user-dashboard/history': 'View your complete event history',
    '/user-dashboard/analytics': 'Insights into your event patterns',
    '/user-dashboard/collections': 'Your saved events and wishlists',
    '/user-dashboard/preferences': 'Customize your Rovify experience',
    '/user-dashboard/settings': 'Account and security settings'
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Get current section name from pathname
    const getCurrentSection = () => {
        if (pathname === '/user-dashboard') return 'dashboard';
        const lastSegment = pathname.split('/').pop() || 'dashboard';
        return lastSegment === 'user-dashboard' ? 'dashboard' : lastSegment;
    };

    const getSectionDisplayName = (section: string) => {
        const displayNames: Record<string, string> = {
            'user-dashboard': 'Dashboard',
            'dashboard': 'Dashboard',
            'profile': 'Profile',
            'wallet': 'Wallet',
            'friends': 'Friends',
            'history': 'History',
            'analytics': 'Analytics',
            'collections': 'Collections',
            'preferences': 'Preferences',
            'settings': 'Settings'
        };
        return displayNames[section] || section.charAt(0).toUpperCase() + section.slice(1);
    };

    const currentSection = getCurrentSection();
    const sectionDisplayName = getSectionDisplayName(currentSection);

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

    const handleNavigation = (href: string) => {
        router.push(href);
        if (isMobile) setMobileMenuOpen(false);
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Mobile Menu Overlay */}
            {isMobile && mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <motion.div
                className={`${isMobile ? 'fixed' : 'relative'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50 shadow-xl h-full ${isMobile
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

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-8">
                        {/* Main Section */}
                        <div>
                            {(!sidebarCollapsed || isMobile) && (
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Main</p>
                            )}
                            <div className="space-y-2">
                                {sidebarItems.filter(item => item.section === 'main').map((item, index) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <motion.button
                                            key={item.id}
                                            onClick={() => handleNavigation(item.href)}
                                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all relative overflow-hidden group ${isActive
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
                                            <div className={`relative ${isActive ? 'text-white' : ''} ${sidebarCollapsed && !isMobile ? 'text-xl' : ''}`}>
                                                {item.icon}
                                            </div>

                                            {(!sidebarCollapsed || isMobile) && (
                                                <>
                                                    <span className="flex-1 font-medium">{item.label}</span>
                                                    {item.badge && (
                                                        <motion.span
                                                            className={`text-xs rounded-full px-2 py-1 font-bold min-w-[20px] text-center ${isActive
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
                                    );
                                })}
                            </div>
                        </div>

                        {/* Secondary Section */}
                        <div>
                            {(!sidebarCollapsed || isMobile) && (
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">More</p>
                            )}
                            <div className="space-y-2">
                                {sidebarItems.filter(item => item.section === 'secondary').map((item, index) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <motion.button
                                            key={item.id}
                                            onClick={() => handleNavigation(item.href)}
                                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all relative overflow-hidden group ${isActive
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
                                            <div className={`relative ${isActive ? 'text-white' : ''} ${sidebarCollapsed && !isMobile ? 'text-xl' : ''}`}>
                                                {item.icon}
                                            </div>

                                            {(!sidebarCollapsed || isMobile) && <span className="flex-1 font-medium">{item.label}</span>}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
                    <motion.div
                        className={`flex items-center gap-3 ${(sidebarCollapsed && !isMobile) ? 'justify-center' : ''}`}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="relative">
                            <Image
                                src={mockUser.image}
                                alt={mockUser.name}
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
                                <p className="text-sm font-bold text-gray-900 truncate">{mockUser.name}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-gray-600 truncate">{mockUser.level} Member</p>
                                    <div className="flex items-center gap-1">
                                        <IoSparkles className="w-3 h-3 text-orange-500" />
                                        <span className="text-xs font-medium text-orange-600">{mockUser.points}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* HEADER */}
                <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 flex-shrink-0 z-30">
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
                                    {sectionDisplayName}
                                </h1>
                                <p className="text-sm text-gray-600 hidden sm:block">
                                    {sectionDescriptions[pathname as keyof typeof sectionDescriptions]}
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

                {/* CONTENT AREA */}
                <main className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="p-4 sm:p-6 lg:p-8"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}