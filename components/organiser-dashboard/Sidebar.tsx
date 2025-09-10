/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    FiUser, FiCreditCard, FiSettings, FiSliders, FiUsers, FiCalendar,
    FiBarChart, FiTrendingUp, FiHome, FiChevronRight, FiChevronLeft,
    FiDollarSign, FiFileText, FiHelpCircle, FiLogOut
} from 'react-icons/fi';
import { IoSparkles } from "react-icons/io5";
import { BsTicketPerforated } from "react-icons/bs";
import { HiOutlineSparkles, HiOutlineMegaphone, HiOutlineCalendarDays } from "react-icons/hi2";
import { PiTicketBold } from 'react-icons/pi';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

// Mock organiser data
const mockorganiser = {
    id: 'org1',
    name: 'Joe Rover',
    username: 'joe_rover',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    level: 'Pro',
    points: 4720,
    activeEvents: 12,
    totalRevenue: 45000,
    badgeColor: 'from-amber-400 to-orange-500'
};

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
    section: 'main' | 'secondary';
    href: string;
    description?: string;
}

const sidebarItems: SidebarItem[] = [
    {
        id: 'organiser-dashboard',
        label: 'Dashboard',
        icon: <FiHome className="w-5 h-5" />,
        section: 'main',
        href: '/organiser-dashboard',
        description: 'Overview & insights'
    },
    {
        id: 'events',
        label: 'My Events',
        icon: <HiOutlineCalendarDays className="w-5 h-5" />,
        section: 'main',
        href: '/organiser-dashboard/events',
        description: 'Create & manage events'
    },
    {
        id: 'tickets',
        label: 'Tickets',
        icon: <PiTicketBold className="w-5 h-5" />,
        section: 'main',
        href: '/organiser-dashboard/tickets',
        description: 'All your ticketing in one place'
    },
    {
        id: 'attendees',
        label: 'Attendees',
        icon: <FiUsers className="w-5 h-5" />,
        section: 'main',
        href: '/organiser-dashboard/attendees',
        description: 'Registrations & guests'
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: <FiBarChart className="w-5 h-5" />,
        section: 'main',
        href: '/organiser-dashboard/analytics',
        description: 'Performance metrics'
    },
    {
        id: 'calendar',
        label: 'Calendar',
        icon: <FiCalendar className="w-5 h-5" />,
        section: 'main',
        href: '/organiser-dashboard/calendar',
        description: 'Schedule & timeline'
    },
    {
        id: 'marketing',
        label: 'Marketing',
        icon: <HiOutlineMegaphone className="w-5 h-5" />,
        section: 'secondary',
        href: '/organiser-dashboard/marketing',
        description: 'Promote your events'
    },
    {
        id: 'payments',
        label: 'Payments',
        icon: <FiDollarSign className="w-5 h-5" />,
        badge: 3,
        badgeColor: 'bg-emerald-500',
        section: 'secondary',
        href: '/organiser-dashboard/payments',
        description: 'Revenue & payouts'
    },
    {
        id: 'reports',
        label: 'Reports',
        icon: <FiFileText className="w-5 h-5" />,
        section: 'secondary',
        href: '/organiser-dashboard/reports',
        description: 'Detailed analytics'
    },
    {
        id: 'profile',
        label: 'Profile',
        icon: <FiUser className="w-5 h-5" />,
        section: 'secondary',
        href: '/organiser-dashboard/profile',
        description: 'Public organiser profile'
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: <FiSettings className="w-5 h-5" />,
        section: 'secondary',
        href: '/organiser-dashboard/settings',
        description: 'Account preferences'
    }
];

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapseAction: () => void;
    isMobile: boolean;
    mobileMenuOpen: boolean;
    onMobileMenuCloseAction: () => void;
}

export default function Sidebar({
    collapsed,
    onToggleCollapseAction,
    isMobile,
    mobileMenuOpen,
    onMobileMenuCloseAction
}: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const handleNavigation = (href: string) => {
        router.push(href);
        if (isMobile) onMobileMenuCloseAction();
    };

    const sidebarVariants = {
        expanded: { width: 280 },
        collapsed: { width: 88 }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (index: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: index * 0.05,
                duration: 0.3,
                ease: "easeOut"
            }
        })
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && mobileMenuOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onMobileMenuCloseAction}
                />
            )}

            {/* Sidebar */}
            <motion.div
                className={`${isMobile ? 'fixed' : 'relative'} bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col z-50 h-full shadow-2xl shadow-purple-500/10 ${isMobile
                    ? `${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-72`
                    : ''
                    }`}
                variants={!isMobile ? sidebarVariants : {}}
                animate={!isMobile ? (collapsed ? 'collapsed' : 'expanded') : 'expanded'}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRight: '1px solid rgba(148, 163, 184, 0.1)'
                }}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200/30 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <AnimatePresence mode="wait">
                            {(!collapsed || isMobile) && (
                                <motion.div
                                    className="flex items-center gap-4"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                            <Image
                                                src="/images/contents/rovi-logo.png"
                                                alt="Rovify Logo"
                                                width={24}
                                                height={24}
                                                className="object-contain relative z-10"
                                                onError={(e) => {
                                                    // Fallback
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = '<span class="text-white font-bold text-lg relative z-10">R</span>';
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                                            <HiOutlineSparkles className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900 text-xl tracking-tight">Rovify</h2>
                                        <p className="text-sm text-orange-600 font-medium">Event organiser</p>
                                    </div>
                                </motion.div>
                            )}

                            {collapsed && !isMobile && (
                                <motion.div
                                    className="mx-auto"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                        <Image
                                            src="/images/contents/rovi-logo.png"
                                            alt="Rovify Logo"
                                            width={20}
                                            height={20}
                                            className="object-contain relative z-10"
                                            onError={(e) => {
                                                // Fallback 
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    parent.innerHTML = '<span class="text-white font-bold text-sm relative z-10">R</span>';
                                                }
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!isMobile && (
                            <motion.button
                                onClick={onToggleCollapseAction}
                                className="p-2.5 hover:bg-orange-50 rounded-xl transition-all duration-200 group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    animate={{ rotate: collapsed ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FiChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-orange-600" />
                                </motion.div>
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
                    <div className="space-y-8">
                        {/* Main Section */}
                        <div>
                            <AnimatePresence>
                                {(!collapsed || isMobile) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 px-3 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                                            Management
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="space-y-2">
                                {sidebarItems.filter(item => item.section === 'main').map((item, index) => {
                                    const isActive = pathname === item.href;
                                    const isHovered = hoveredItem === item.id;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            custom={index}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            <motion.button
                                                onClick={() => handleNavigation(item.href)}
                                                onMouseEnter={() => setHoveredItem(item.id)}
                                                onMouseLeave={() => setHoveredItem(null)}
                                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 relative overflow-hidden group ${isActive
                                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-700'
                                                    } ${collapsed && !isMobile ? 'justify-center px-3' : ''}`}
                                                whileHover={{ scale: 1.02, x: collapsed && !isMobile ? 0 : 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                title={collapsed && !isMobile ? item.label : undefined}
                                            >
                                                {/* Active indicator */}
                                                {isActive && (
                                                    <motion.div
                                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                                                        layoutId="activeIndicator"
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                )}

                                                {/* Icon */}
                                                <div className={`relative flex-shrink-0 ${isActive ? 'text-white' : ''} ${collapsed && !isMobile ? 'text-xl' : ''}`}>
                                                    {item.icon}

                                                    {/* Badge on collapsed sidebar */}
                                                    {item.badge && collapsed && !isMobile && (
                                                        <motion.span
                                                            className={`absolute -top-2 -right-2 w-5 h-5 ${item.badgeColor || 'bg-orange-500'} text-white text-xs rounded-full flex items-center justify-center font-bold`}
                                                            animate={{ scale: [1, 1.1, 1] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                        >
                                                            {item.badge}
                                                        </motion.span>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <AnimatePresence>
                                                    {(!collapsed || isMobile) && (
                                                        <motion.div
                                                            className="flex-1 min-w-0"
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -10 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="min-w-0">
                                                                    <p className="font-semibold truncate">{item.label}</p>
                                                                    {item.description && (
                                                                        <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500'
                                                                            }`}>
                                                                            {item.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                {item.badge && (
                                                                    <motion.span
                                                                        className={`text-xs rounded-full px-2.5 py-1 font-bold ml-2 ${isActive
                                                                            ? 'bg-white/20 text-white'
                                                                            : `${item.badgeColor || 'bg-orange-500'} text-white`
                                                                            }`}
                                                                        animate={{ scale: [1, 1.05, 1] }}
                                                                        transition={{ duration: 2, repeat: Infinity }}
                                                                    >
                                                                        {item.badge}
                                                                    </motion.span>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Secondary Section */}
                        <div>
                            <AnimatePresence>
                                {(!collapsed || isMobile) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 px-3 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                                            Business
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="space-y-2">
                                {sidebarItems.filter(item => item.section === 'secondary').map((item, index) => {
                                    const isActive = pathname === item.href;
                                    const adjustedIndex = index + 5; // Offset for animation delay

                                    return (
                                        <motion.div
                                            key={item.id}
                                            custom={adjustedIndex}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            <motion.button
                                                onClick={() => handleNavigation(item.href)}
                                                onMouseEnter={() => setHoveredItem(item.id)}
                                                onMouseLeave={() => setHoveredItem(null)}
                                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 relative overflow-hidden group ${isActive
                                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-700'
                                                    } ${collapsed && !isMobile ? 'justify-center px-3' : ''}`}
                                                whileHover={{ scale: 1.02, x: collapsed && !isMobile ? 0 : 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                title={collapsed && !isMobile ? item.label : undefined}
                                            >
                                                {/* Active indicator */}
                                                {isActive && (
                                                    <motion.div
                                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                                                        layoutId="activeIndicatorSecondary"
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                )}

                                                {/* Icon */}
                                                <div className={`relative flex-shrink-0 ${isActive ? 'text-white' : ''} ${collapsed && !isMobile ? 'text-xl' : ''}`}>
                                                    {item.icon}

                                                    {/* Badge on collapsed sidebar */}
                                                    {item.badge && collapsed && !isMobile && (
                                                        <motion.span
                                                            className={`absolute -top-2 -right-2 w-5 h-5 ${item.badgeColor || 'bg-orange-500'} text-white text-xs rounded-full flex items-center justify-center font-bold`}
                                                            animate={{ scale: [1, 1.1, 1] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                        >
                                                            {item.badge}
                                                        </motion.span>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <AnimatePresence>
                                                    {(!collapsed || isMobile) && (
                                                        <motion.div
                                                            className="flex-1 min-w-0"
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -10 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="min-w-0">
                                                                    <p className="font-semibold truncate">{item.label}</p>
                                                                    {item.description && (
                                                                        <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500'
                                                                            }`}>
                                                                            {item.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                {item.badge && (
                                                                    <motion.span
                                                                        className={`text-xs rounded-full px-2.5 py-1 font-bold ml-2 ${isActive
                                                                            ? 'bg-white/20 text-white'
                                                                            : `${item.badgeColor || 'bg-orange-500'} text-white`
                                                                            }`}
                                                                        animate={{ scale: [1, 1.05, 1] }}
                                                                        transition={{ duration: 2, repeat: Infinity }}
                                                                    >
                                                                        {item.badge}
                                                                    </motion.span>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-gray-200/30 bg-gradient-to-r from-gray-50/50 to-orange-50/30 backdrop-blur-sm">
                    <motion.div
                        className={`flex items-center gap-4 ${collapsed && !isMobile ? 'justify-center' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg ring-2 ring-white/50">
                                <Image
                                    src={mockorganiser.image}
                                    alt={mockorganiser.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                    priority
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 border-2 border-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {(!collapsed || isMobile) && (
                                <motion.div
                                    className="flex-1 min-w-0"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <p className="text-sm font-bold text-gray-900 truncate">{mockorganiser.name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-xs text-gray-600 truncate">{mockorganiser.level} organiser</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 bg-gradient-to-r ${mockorganiser.badgeColor} rounded-full animate-pulse`}></div>
                                            <span className="text-xs font-semibold text-orange-600">{mockorganiser.points}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {(!collapsed || isMobile) && (
                                <motion.button
                                    className="p-2 hover:bg-red-50 rounded-xl transition-colors group"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    title="Sign out"
                                >
                                    <FiLogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}