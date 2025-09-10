/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
    FiCalendar, FiClock, FiUsers, FiDollarSign, FiTrendingUp,
    FiTrendingDown, FiCamera, FiMessageSquare, FiShare2, FiAward
} from 'react-icons/fi';
import { IoFlash, IoSparkles, IoWallet, IoTicket } from "react-icons/io5";

// Mock data for the dashboard
const mockUser = {
    name: 'Joe Love',
    level: 'Gold',
    levelProgress: 75,
    points: 2840,
    streakDays: 12,
    eventsAttended: 28,
    followers: 1234,
    totalSpent: 4250,
};

const mockWalletData = {
    balance: { usd: 4250.30 },
};

const mockFriends = [
    { id: '1', isOnline: true },
    { id: '2', isOnline: false },
    { id: '3', isOnline: true },
];

const mockUpcomingEvents = [
    {
        id: 'upcoming1',
        title: 'AI & Machine Learning Summit',
        date: '2025-01-15',
        time: '9:00 AM',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        location: 'Convention Center',
        price: 199,
        daysUntil: 25,
    },
    {
        id: 'upcoming2',
        title: 'Electronic Music Festival',
        date: '2025-02-02',
        time: '6:00 PM',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
        location: 'Outdoor Venue',
        price: 89,
        daysUntil: 43,
    }
];

const mockRecentActivity = [
    { id: '1', type: 'event_joined', user: 'Joe Rover', event: 'AI Summit', time: '10 min ago', icon: FiCalendar },
    { id: '2', type: 'friend_added', user: 'Marcus Reid', event: '', time: '1 hour ago', icon: FiUsers },
    { id: '3', type: 'event_shared', user: 'Emma Wilson', event: 'Music Festival', time: '2 hours ago', icon: FiShare2 },
    { id: '4', type: 'ticket_purchased', user: 'You', event: 'Food Expo', time: '1 day ago', icon: IoTicket },
    { id: '5', type: 'achievement_unlocked', user: 'You', event: 'Social Butterfly', time: '2 days ago', icon: FiAward }
];

// Enhanced StatCard component
const StatCard = ({ title, value, subtitle, icon, trend, className = "", gradient = false }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    className?: string;
    gradient?: boolean;
}) => (
    <motion.div
        className={`${gradient ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' : 'bg-white'} rounded-2xl p-6 border ${gradient ? 'border-orange-300' : 'border-gray-100'} hover:shadow-xl transition-all duration-300 ${className}`}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${gradient ? 'bg-white/20' : 'bg-orange-50'}`}>
                {icon}
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-sm font-medium ${gradient ? 'text-white/80' :
                    trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                    {trend === 'up' && <FiTrendingUp className="w-4 h-4" />}
                    {trend === 'down' && <FiTrendingDown className="w-4 h-4" />}
                </div>
            )}
        </div>
        <div>
            <p className={`text-3xl font-bold mb-1 ${gradient ? 'text-white' : 'text-gray-900'}`}>{value}</p>
            <p className={`text-sm ${gradient ? 'text-white/80' : 'text-gray-600'}`}>{title}</p>
            {subtitle && <p className={`text-xs mt-1 ${gradient ? 'text-white/60' : 'text-gray-500'}`}>{subtitle}</p>}
        </div>
    </motion.div>
);

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="mb-6 lg:mb-0">
                        <motion.h1
                            className="text-4xl font-bold mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Welcome back, {mockUser.name.split(' ')[0]}! 👋
                        </motion.h1>
                        <motion.p
                            className="text-orange-100 text-lg mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            You have {mockUpcomingEvents.length} upcoming events this week
                        </motion.p>
                        <motion.div
                            className="flex items-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-2">
                                <IoFlash className="w-5 h-5" />
                                <span className="font-semibold">{mockUser.streakDays} day streak</span>
                            </div>
                            <div className="w-px h-6 bg-white/30"></div>
                            <div className="flex items-center gap-2">
                                <IoSparkles className="w-5 h-5" />
                                <span className="font-semibold">{mockUser.level} Level</span>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        className="text-center lg:text-right"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-3xl font-bold mb-2">{mockUser.points}</div>
                            <div className="text-orange-100 mb-3">Reward Points</div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div
                                    className="bg-white rounded-full h-2 transition-all duration-1000"
                                    style={{ width: `${mockUser.levelProgress}%` }}
                                ></div>
                            </div>
                            <div className="text-sm text-orange-100 mt-2">{mockUser.levelProgress}% to Platinum</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Events This Year"
                    value={mockUser.eventsAttended}
                    subtitle="+6 from last year"
                    icon={<FiCalendar className="w-6 h-6 text-orange-500" />}
                    trend="up"
                />
                <StatCard
                    title="Active Friends"
                    value={mockFriends.filter(f => f.isOnline).length}
                    subtitle={`${mockUser.followers} total followers`}
                    icon={<FiUsers className="w-6 h-6 text-blue-500" />}
                    trend="up"
                />
                <StatCard
                    title="Wallet Value"
                    value={`$${mockWalletData.balance.usd.toLocaleString()}`}
                    subtitle="+5.2% this week"
                    icon={<IoWallet className="w-6 h-6 text-green-500" />}
                    trend="up"
                />
                <StatCard
                    title="Total Spent"
                    value={`$${mockUser.totalSpent}`}
                    subtitle="Across all events"
                    icon={<FiDollarSign className="w-6 h-6 text-purple-500" />}
                    trend="neutral"
                />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Events */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                        <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                            View all
                        </button>
                    </div>
                    <div className="space-y-4">
                        {mockUpcomingEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                className="flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:shadow-md transition-all cursor-pointer"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                            >
                                <div className="flex w-full">
                                    <div style={{ width: 120, minWidth: 120, height: 80, position: 'relative' }}>
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover rounded-lg"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="flex-1 pl-4">
                                        <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                            <div className="flex items-center gap-1">
                                                <FiCalendar className="w-4 h-4" />
                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FiClock className="w-4 h-4" />
                                                <span>{event.time}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-orange-600">${event.price}</span>
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                                {event.daysUntil} days
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions & Activity */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <motion.button
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl p-3 font-semibold transition-all shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                🎯 Find Events
                            </motion.button>
                            <motion.button
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-3 font-semibold transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                👥 Invite Friends
                            </motion.button>
                            <motion.button
                                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-3 font-semibold transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                🎫 My Tickets
                            </motion.button>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {mockRecentActivity.slice(0, 4).map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                        <activity.icon className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{activity.user} {activity.type.replace('_', ' ')}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}