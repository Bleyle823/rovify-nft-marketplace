/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiHome, FiUsers, FiCalendar, FiTag, FiDollarSign,
    FiSettings, FiMenu, FiX, FiLogOut, FiBell, FiSearch,
    FiBarChart, FiShield, FiGlobe, FiHelpCircle, FiChevronDown,
    FiActivity, FiDatabase, FiMail
} from 'react-icons/fi';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

interface AdminLayoutProps {
    children: ReactNode;
}

interface MenuItem {
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    badge?: number;
    description?: string;
    group: 'main' | 'management' | 'system';
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const menuItems: MenuItem[] = [
        {
            name: 'Dashboard',
            href: '/admin',
            icon: FiHome,
            description: 'Overview & analytics',
            group: 'main'
        },
        {
            name: 'Analytics',
            href: '/admin/analytics',
            icon: FiBarChart,
            description: 'Detailed insights',
            group: 'main'
        },
        {
            name: 'Users',
            href: '/admin/users',
            icon: FiUsers,
            badge: 3,
            description: 'User management',
            group: 'management'
        },
        {
            name: 'Events',
            href: '/admin/events',
            icon: FiCalendar,
            description: 'Event oversight',
            group: 'management'
        },
        {
            name: 'Tickets',
            href: '/admin/tickets',
            icon: FiTag,
            description: 'Ticket analytics',
            group: 'management'
        },
        {
            name: 'Transactions',
            href: '/admin/transactions',
            icon: FiDollarSign,
            description: 'Financial data',
            group: 'management'
        },
        {
            name: 'Security',
            href: '/admin/security',
            icon: FiShield,
            description: 'Access control',
            group: 'system'
        },
        {
            name: 'Settings',
            href: '/admin/settings',
            icon: FiSettings,
            description: 'System config',
            group: 'system'
        },
    ];

    const groupedMenuItems = {
        main: menuItems.filter(item => item.group === 'main'),
        management: menuItems.filter(item => item.group === 'management'),
        system: menuItems.filter(item => item.group === 'system'),
    };

    const isActivePath = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    const MenuGroup = ({ title, items }: { title: string; items: MenuItem[] }) => (
        <div className="mb-8">
            {!sidebarCollapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                    {title}
                </h3>
            )}
            <div className="space-y-1">
                {items.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${isActivePath(item.href)
                            ? 'bg-orange-50 text-orange-600 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        <div className={`flex items-center justify-center w-5 h-5 ${isActivePath(item.href) ? 'text-orange-600' : 'text-gray-500 group-hover:text-gray-700'
                            }`}>
                            <item.icon className="w-5 h-5" />
                        </div>

                        {!sidebarCollapsed && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">{item.name}</span>
                                        {item.badge && (
                                            <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[18px] text-center">
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                    {item.description && (
                                        <p className="text-xs text-gray-500 group-hover:text-gray-600 mt-0.5">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {isActivePath(item.href) && (
                            <motion.div
                                className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-full"
                                layoutId="activeIndicator"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl border-r border-gray-200 flex flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
                animate={{ width: sidebarCollapsed ? 80 : 280 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {/* Logo & Collapse */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    {!sidebarCollapsed ? (
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
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
                                <span className="text-xl font-bold text-gray-900">rovify</span>
                                <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full ml-2">
                                    ADMIN
                                </span>
                            </div>
                        </Link>
                    ) : (
                        <div className="h-9 w-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
                            <span className="text-white font-bold text-lg">R</span>
                        </div>
                    )}

                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <motion.div
                            animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FiChevronDown className="w-4 h-4 transform rotate-90" />
                        </motion.div>
                    </button>

                    {/* Mobile close button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-6 py-6 overflow-y-auto">
                    <MenuGroup title="Overview" items={groupedMenuItems.main} />
                    <MenuGroup title="Management" items={groupedMenuItems.management} />
                    <MenuGroup title="System" items={groupedMenuItems.system} />
                </nav>

                {/* Admin Profile */}
                <div className="p-6 border-t border-gray-200">
                    {!sidebarCollapsed ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-semibold">
                                    AD
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-900">Admin User</h4>
                                    <p className="text-xs text-gray-500 truncate">admin@rovify.io</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 py-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                    <FiHelpCircle className="w-4 h-4" />
                                    Help
                                </button>
                                <button className="flex-1 py-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                    <FiLogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-semibold">
                                AD
                            </div>
                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                <FiLogOut className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-70'}`} style={{ marginLeft: sidebarCollapsed ? '80px' : '280px' }}>
                {/* Enhanced Header */}
                <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-6 py-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiMenu className="w-6 h-6 text-gray-700" />
                        </button>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-md mx-4">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search users, events, transactions..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center gap-4">
                            {/* System Status */}
                            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                All Systems Operational
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                <FiBell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
                            </button>

                            {/* Quick Actions */}
                            <Link
                                href="/"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 text-sm font-medium rounded-lg transition-colors"
                            >
                                <FiGlobe className="w-4 h-4" />
                                View Site
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}