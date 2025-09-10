/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiCalendar, FiClock, FiUsers, FiDollarSign, FiTrendingUp,
    FiTrendingDown, FiEye, FiMessageSquare, FiShare2, FiAward,
    FiMapPin, FiPlus, FiArrowUpRight, FiTarget, FiZap, FiStar
} from 'react-icons/fi';
import { IoFlash, IoSparkles, IoWallet, IoTicket, IoTrendingUp } from "react-icons/io5";
import { HiOutlineSparkles, HiOutlineFire } from "react-icons/hi2";
import { BsTicketPerforated, BsLightningCharge } from "react-icons/bs";

// Enhanced mock data for organizer dashboard
const mockOrganizer = {
    name: 'Joe Rover',
    level: 'Pro',
    levelProgress: 85,
    points: 4720,
    streakDays: 18,
    eventsCreated: 45,
    totalAttendees: 12847,
    totalRevenue: 145250,
    monthlyGrowth: 23.5,
    rating: 4.9,
    completedEvents: 38
};

const mockQuickStats = [
    {
        id: 'revenue',
        title: 'Monthly Revenue',
        value: '$12,847',
        change: '+23.5%',
        trend: 'up' as const,
        icon: <FiDollarSign className="w-6 h-6" />,
        color: 'from-emerald-500 to-green-600',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600'
    },
    {
        id: 'events',
        title: 'Active Events',
        value: '12',
        change: '+3',
        trend: 'up' as const,
        icon: <BsTicketPerforated className="w-6 h-6" />,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600'
    },
    {
        id: 'attendees',
        title: 'Total Attendees',
        value: '2,847',
        change: '+412',
        trend: 'up' as const,
        icon: <FiUsers className="w-6 h-6" />,
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600'
    },
    {
        id: 'rating',
        title: 'Avg Rating',
        value: '4.9',
        change: '+0.2',
        trend: 'up' as const,
        icon: <FiStar className="w-6 h-6" />,
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600'
    }
];

const mockUpcomingEvents = [
    {
        id: 'event1',
        title: 'AI & Machine Learning Summit 2025',
        date: '2025-07-15',
        time: '9:00 AM',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        location: 'Tech Convention Center',
        price: 299,
        attendees: 847,
        capacity: 1000,
        daysUntil: 24,
        status: 'selling_fast',
        category: 'Technology'
    },
    {
        id: 'event2',
        title: 'Electronic Music Festival',
        date: '2025-07-28',
        time: '6:00 PM',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
        location: 'Downtown Arena',
        price: 129,
        attendees: 1247,
        capacity: 2000,
        daysUntil: 37,
        status: 'on_sale',
        category: 'Music'
    },
    {
        id: 'event3',
        title: 'Startup Pitch Competition',
        date: '2025-08-05',
        time: '2:00 PM',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        location: 'Innovation Hub',
        price: 89,
        attendees: 156,
        capacity: 200,
        daysUntil: 45,
        status: 'new',
        category: 'Business'
    }
];

const mockRecentActivity = [
    { id: '1', type: 'ticket_sale', event: 'AI Summit', amount: '$299', time: '2 min ago', icon: IoTicket },
    { id: '2', type: 'new_registration', event: 'Music Festival', count: '5 attendees', time: '15 min ago', icon: FiUsers },
    { id: '3', type: 'review_received', event: 'Tech Meetup', rating: '5 stars', time: '1 hour ago', icon: FiStar },
    { id: '4', type: 'milestone_reached', event: 'Startup Pitch', milestone: '100 registrations', time: '3 hours ago', icon: FiTarget },
    { id: '5', type: 'payment_received', event: 'Music Festival', amount: '$1,547', time: '5 hours ago', icon: FiDollarSign }
];

const mockTrendingMetrics = [
    { label: 'Event Views', value: '24.7K', change: '+12.5%', trend: 'up' },
    { label: 'Conversion Rate', value: '8.4%', change: '+2.1%', trend: 'up' },
    { label: 'Avg Ticket Price', value: '$147', change: '+$23', trend: 'up' },
    { label: 'Customer Retention', value: '92%', change: '+5%', trend: 'up' }
];

// Enhanced StatCard component
const StatCard = ({
    stat,
    index,
    gradient = false
}: {
    stat: typeof mockQuickStats[0],
    index: number,
    gradient?: boolean
}) => (
    <motion.div
        className={`${gradient ? `bg-gradient-to-br ${stat.color}` : 'bg-white'} rounded-2xl p-6 border ${gradient ? 'border-white/20' : 'border-gray-100'} hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        {/* Background decoration */}
        <div className={`absolute -top-4 -right-4 w-20 h-20 ${gradient ? 'bg-white/10' : stat.bgColor} rounded-full blur-xl opacity-60`}></div>

        <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${gradient ? 'bg-white/20' : stat.bgColor} ${gradient ? 'text-white' : stat.textColor}`}>
                    {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${gradient ? 'text-white/90' : stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {stat.trend === 'up' ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                    {stat.change}
                </div>
            </div>
            <div>
                <p className={`text-3xl font-bold mb-1 ${gradient ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                <p className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-gray-600'}`}>{stat.title}</p>
            </div>
        </div>
    </motion.div>
);

// EventCard component
const EventCard = ({ event, index }: { event: typeof mockUpcomingEvents[0], index: number }) => {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'selling_fast':
                return { bg: 'bg-red-100', text: 'text-red-700', icon: <HiOutlineFire className="w-3 h-3" /> };
            case 'new':
                return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <HiOutlineSparkles className="w-3 h-3" /> };
            default:
                return { bg: 'bg-green-100', text: 'text-green-700', icon: <IoTrendingUp className="w-3 h-3" /> };
        }
    };

    const statusStyle = getStatusStyle(event.status);
    const fillPercentage = (event.attendees / event.capacity) * 100;

    return (
        <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2, scale: 1.01 }}
        >
            <div className="flex gap-4">
                <div className="relative flex-shrink-0">
                    <div style={{ width: 100, height: 80, position: 'relative' }}>
                        <Image
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover rounded-xl"
                            fill
                            sizes="100px"
                        />
                    </div>
                    <div className={`absolute -top-2 -right-2 ${statusStyle.bg} ${statusStyle.text} px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                        {statusStyle.icon}
                        {event.status.replace('_', ' ')}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-orange-600 transition-colors">
                            {event.title}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                            {event.daysUntil} days
                        </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                            <FiCalendar className="w-4 h-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FiClock className="w-4 h-4" />
                            <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FiMapPin className="w-4 h-4" />
                            <span className="truncate">{event.location}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-orange-600">${event.price}</span>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiUsers className="w-4 h-4" />
                                <span>{event.attendees}/{event.capacity}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${fillPercentage}%` }}
                                    transition={{ delay: index * 0.2, duration: 1 }}
                                />
                            </div>
                            <span className="text-xs text-gray-500">{Math.round(fillPercentage)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function Dashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
                className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="mb-6 lg:mb-0 flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-4xl lg:text-5xl font-bold mb-3">
                                Welcome back, {mockOrganizer.name.split(' ')[0]}!
                                <motion.span
                                    animate={{ rotate: [0, 20, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    className="inline-block ml-2"
                                >
                                    👋
                                </motion.span>
                            </h1>
                            <p className="text-orange-100 text-lg mb-6">
                                You have {mockUpcomingEvents.length} active events • {mockOrganizer.totalAttendees.toLocaleString()} total attendees this year
                            </p>

                            <div className="flex items-center gap-6 flex-wrap">
                                <motion.div
                                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <BsLightningCharge className="w-5 h-5" />
                                    <span className="font-semibold">{mockOrganizer.streakDays} day streak</span>
                                </motion.div>
                                <motion.div
                                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <IoSparkles className="w-5 h-5" />
                                    <span className="font-semibold">{mockOrganizer.level} Level</span>
                                </motion.div>
                                <motion.div
                                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <FiStar className="w-5 h-5" />
                                    <span className="font-semibold">{mockOrganizer.rating} Rating</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        className="text-center lg:text-right"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-white/30">
                            <div className="text-4xl lg:text-5xl font-bold mb-3">{mockOrganizer.points.toLocaleString()}</div>
                            <div className="text-orange-100 mb-4 text-lg">Reward Points</div>
                            <div className="relative">
                                <div className="w-full bg-white/20 rounded-full h-3 mb-3">
                                    <motion.div
                                        className="bg-white rounded-full h-3 transition-all duration-1000"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${mockOrganizer.levelProgress}%` }}
                                        transition={{ delay: 0.8, duration: 1.2 }}
                                    ></motion.div>
                                </div>
                                <div className="text-sm text-orange-100">{mockOrganizer.levelProgress}% to Platinum Level</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockQuickStats.map((stat, index) => (
                    <StatCard
                        key={stat.id}
                        stat={stat}
                        index={index}
                        gradient={index === 0}
                    />
                ))}
            </div>

            {/* Trending Metrics */}
            <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <IoTrendingUp className="w-6 h-6 text-orange-500" />
                        Trending Metrics
                    </h2>
                    <span className="text-sm text-gray-500">Last 30 days</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mockTrendingMetrics.map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                            <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
                            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                                <FiTrendingUp className="w-3 h-3" />
                                {metric.change}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Events Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Upcoming Events */}
                    <motion.div
                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FiCalendar className="w-6 h-6 text-orange-500" />
                                Upcoming Events
                            </h2>
                            <div className="flex items-center gap-3">
                                <motion.button
                                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Create Event
                                </motion.button>
                                <button className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1">
                                    View all
                                    <FiArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {mockUpcomingEvents.map((event, index) => (
                                <EventCard key={event.id} event={event} index={index} />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Content */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <motion.div
                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                    >
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiZap className="w-5 h-5 text-orange-500" />
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: '🎯 Create Event', color: 'from-orange-500 to-orange-600' },
                                { label: '📊 View Analytics', color: 'from-blue-500 to-blue-600' },
                                { label: '💰 Check Payments', color: 'from-emerald-500 to-emerald-600' },
                                { label: '📱 Marketing Tools', color: 'from-purple-500 to-purple-600' }
                            ].map((action, index) => (
                                <motion.button
                                    key={action.label}
                                    className={`w-full bg-gradient-to-r ${action.color} hover:shadow-lg text-white rounded-xl p-3 font-semibold transition-all text-sm`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.2 + index * 0.1 }}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {action.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 }}
                    >
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiMessageSquare className="w-5 h-5 text-orange-500" />
                            Recent Activity
                        </h3>
                        <div className="space-y-3">
                            {mockRecentActivity.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50/50 transition-colors cursor-pointer group"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.6 + index * 0.1 }}
                                    whileHover={{ x: 4 }}
                                >
                                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                        <activity.icon className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {activity.type.replace('_', ' ').split(' ').map(word =>
                                                word.charAt(0).toUpperCase() + word.slice(1)
                                            ).join(' ')}
                                        </p>
                                        <p className="text-xs text-gray-600 truncate">
                                            {activity.event} • {activity.amount || activity.count || activity.rating || activity.milestone}
                                        </p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}