/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import {
    FiUsers, FiCalendar, FiTag, FiDollarSign,
    FiArrowUp, FiArrowDown, FiTrendingUp, FiEye,
    FiMoreHorizontal, FiFilter, FiDownload, FiRefreshCw,
    FiActivity, FiGlobe, FiCreditCard, FiStar, FiMapPin
} from 'react-icons/fi';
import { motion } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: string;
    change: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    subtitle?: string;
    isLoading?: boolean;
}

const StatCard = ({ title, value, change, icon: Icon, color, subtitle, isLoading = false }: StatCardProps) => (
    <motion.div
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200"
        whileHover={{ y: -2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        {isLoading ? (
            <div className="animate-pulse">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
        ) : (
            <>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <p className="text-gray-500 text-sm font-medium">{title}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
                        {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
                    </div>
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${color}15` }}
                    >
                        <Icon style={{ color }} className="w-6 h-6" />
                    </div>
                </div>

                <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change >= 0 ? (
                        <FiArrowUp className="w-4 h-4" />
                    ) : (
                        <FiArrowDown className="w-4 h-4" />
                    )}
                    <span className="font-semibold">{Math.abs(change)}%</span>
                    <span className="text-gray-500">vs. last period</span>
                </div>
            </>
        )}
    </motion.div>
);

interface Activity {
    id: number;
    type: 'event' | 'user' | 'ticket' | 'transaction';
    action: string;
    user: string;
    event?: string;
    location?: string;
    amount?: string;
    time: string;
}

const ActivityItem = ({ activity, index }: { activity: Activity, index: number }) => (
    <motion.div
        className="py-4 flex items-center gap-4 hover:bg-gray-50 rounded-lg px-2 transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
    >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'event' ? 'bg-blue-100' :
            activity.type === 'user' ? 'bg-green-100' :
                activity.type === 'ticket' ? 'bg-orange-100' :
                    'bg-purple-100'
            }`}>
            {activity.type === 'event' && <FiCalendar className="text-blue-600 w-5 h-5" />}
            {activity.type === 'user' && <FiUsers className="text-green-600 w-5 h-5" />}
            {activity.type === 'ticket' && <FiTag className="text-orange-600 w-5 h-5" />}
            {activity.type === 'transaction' && <FiDollarSign className="text-purple-600 w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span className="font-medium text-orange-600">{activity.user}</span>
                {activity.event && (
                    <>
                        <span>•</span>
                        <span className="truncate">{activity.event}</span>
                    </>
                )}
                {activity.location && (
                    <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <FiMapPin className="w-3 h-3" />
                            {activity.location}
                        </span>
                    </>
                )}
            </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
            {activity.amount && (
                <span className="font-semibold text-green-600">{activity.amount}</span>
            )}
            <span>{activity.time}</span>
        </div>
    </motion.div>
);

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('7d');

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Enhanced mock data
    const stats = [
        {
            title: 'Total Users',
            value: '2,845',
            change: 12.5,
            icon: FiUsers,
            color: '#FF5722',
            subtitle: '234 new this week'
        },
        {
            title: 'Active Events',
            value: '187',
            change: 8.1,
            icon: FiCalendar,
            color: '#4CAF50',
            subtitle: '23 ending soon'
        },
        {
            title: 'Tickets Sold',
            value: '12,472',
            change: 23.8,
            icon: FiTag,
            color: '#2196F3',
            subtitle: '1,247 this week'
        },
        {
            title: 'Revenue',
            value: '$92,485',
            change: -3.2,
            icon: FiDollarSign,
            color: '#9C27B0',
            subtitle: 'MTD: $284,751'
        },
    ];

    // Enhanced recent activity
    const recentActivity: Activity[] = [
        {
            id: 1,
            type: 'event',
            action: 'New event created',
            user: 'Joe RKND',
            event: 'Tech Summit 2025',
            location: 'San Francisco',
            time: '10 minutes ago'
        },
        {
            id: 2,
            type: 'ticket',
            action: 'VIP ticket purchased',
            user: 'Sophia Chen',
            event: 'Neon Nights Festival',
            amount: '$299',
            time: '25 minutes ago'
        },
        {
            id: 3,
            type: 'user',
            action: 'New user registration',
            user: 'Marcus Johnson',
            location: 'New York',
            time: '1 hour ago'
        },
        {
            id: 4,
            type: 'event',
            action: 'Event details updated',
            user: 'Olivia Martinez',
            event: 'Urban Art Exhibition',
            time: '2 hours ago'
        },
        {
            id: 5,
            type: 'transaction',
            action: 'Ticket transferred via NFT',
            user: 'Jordan Taylor',
            event: 'Crypto & DeFi Symposium',
            amount: '0.15 ETH',
            time: '3 hours ago'
        },
    ];

    const quickActions = [
        { name: 'Create Event', icon: FiCalendar, color: 'bg-blue-500', href: '/admin/events/new' },
        { name: 'View Analytics', icon: FiTrendingUp, color: 'bg-green-500', href: '/admin/analytics' },
        { name: 'Manage Users', icon: FiUsers, color: 'bg-orange-500', href: '/admin/users' },
        { name: 'System Settings', icon: FiActivity, color: 'bg-purple-500', href: '/admin/settings' },
    ];

    const topEvents = [
        { id: 1, name: 'Tech Summit 2025', attendees: 1247, revenue: '$37,410', rating: 4.8 },
        { id: 2, name: 'Neon Nights Festival', attendees: 892, revenue: '$26,760', rating: 4.9 },
        { id: 3, name: 'Urban Art Exhibition', attendees: 456, revenue: '$13,680', rating: 4.7 },
        { id: 4, name: 'Culinary Masterclass', attendees: 234, revenue: '$7,020', rating: 4.6 },
    ];

    return (
        <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">Monitor your platform&apos;s performance and key metrics</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                        {['24h', '7d', '30d', '90d'].map((period) => (
                            <button
                                key={period}
                                onClick={() => setTimeFilter(period)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${timeFilter === period
                                    ? 'bg-orange-500 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                        <FiRefreshCw className="w-4 h-4" />
                        Refresh
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
                        <FiDownload className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        {...stat}
                        isLoading={isLoading}
                    />
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <motion.button
                            key={action.name}
                            className={`${action.color} hover:opacity-90 text-white rounded-xl p-4 text-left transition-all group`}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <action.icon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-sm">{action.name}</p>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Enhanced Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                            <p className="text-sm text-gray-600">Track your platform&apos;s financial performance</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-100 text-orange-600">Revenue</button>
                            <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">Transactions</button>
                        </div>
                    </div>

                    {/* Enhanced Chart Placeholder */}
                    <div className="h-64 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center border-2 border-dashed border-orange-200">
                        <div className="text-center">
                            <FiTrendingUp className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">Revenue Chart Visualization</p>
                            <p className="text-sm text-gray-500 mt-1">Chart.js or Recharts integration here</p>
                        </div>
                    </div>
                </div>

                {/* Top Events */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Top Events</h3>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <FiMoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {topEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 text-sm truncate">{event.name}</h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <FiUsers className="w-3 h-3" />
                                            {event.attendees}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiStar className="w-3 h-3" />
                                            {event.rating}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-green-600 text-sm">{event.revenue}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enhanced Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                        <p className="text-sm text-gray-600">Real-time platform events and user actions</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">
                            <FiFilter className="w-4 h-4" />
                            Filter
                        </button>
                        <button className="px-4 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                            View All
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {recentActivity.map((activity, index) => (
                        <ActivityItem key={activity.id} activity={activity} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}