/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiTrendingUp, FiTrendingDown, FiUsers, FiDollarSign, FiEye,
    FiCalendar, FiClock, FiMapPin, FiTarget, FiPercent, FiArrowUpRight,
    FiArrowDownRight, FiBarChart, FiPieChart, FiActivity, FiDownload,
    FiFilter, FiRefreshCw, FiChevronDown, FiStar, FiShare2
} from 'react-icons/fi';
import { IoSparkles, IoTrendingUp, IoFlash } from "react-icons/io5";
import { HiOutlineSparkles, HiOutlineFire, HiOutlineChartBar } from "react-icons/hi2";
import { BsTicketPerforated, BsLightningCharge } from "react-icons/bs";

// Mock analytics data
const mockAnalyticsData = {
    overview: {
        totalRevenue: 524750,
        revenueGrowth: 23.5,
        totalEvents: 45,
        eventsGrowth: 12.5,
        totalAttendees: 12847,
        attendeesGrowth: 18.2,
        conversionRate: 8.4,
        conversionGrowth: 2.1,
        avgTicketPrice: 147,
        priceGrowth: 15.6,
        customerSatisfaction: 4.8,
        satisfactionGrowth: 0.3
    },
    timeframe: '30 days',
    lastUpdated: 'Updated 2 minutes ago'
};

const mockRevenueData = [
    { month: 'Jan', revenue: 45000, events: 8, attendees: 2400 },
    { month: 'Feb', revenue: 52000, events: 9, attendees: 2800 },
    { month: 'Mar', revenue: 48000, events: 7, attendees: 2200 },
    { month: 'Apr', revenue: 61000, events: 11, attendees: 3200 },
    { month: 'May', revenue: 68000, events: 12, attendees: 3600 },
    { month: 'Jun', revenue: 75000, events: 14, attendees: 4100 }
];

const mockTopEvents = [
    {
        id: '1',
        title: 'AI & Machine Learning Summit',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        revenue: 252653,
        attendees: 847,
        rating: 4.9,
        growth: 15.3,
        category: 'Technology'
    },
    {
        id: '2',
        title: 'Electronic Music Festival',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
        revenue: 160863,
        attendees: 1247,
        rating: 4.8,
        growth: 8.7,
        category: 'Music'
    },
    {
        id: '3',
        title: 'Digital Marketing Masterclass',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
        revenue: 106971,
        attendees: 543,
        rating: 4.7,
        growth: 22.1,
        category: 'Education'
    }
];

const mockAudienceData = [
    { category: 'Technology', percentage: 35, color: 'from-blue-500 to-blue-600' },
    { category: 'Music', percentage: 28, color: 'from-purple-500 to-purple-600' },
    { category: 'Business', percentage: 20, color: 'from-emerald-500 to-emerald-600' },
    { category: 'Education', percentage: 17, color: 'from-orange-500 to-orange-600' }
];

const mockGeographicData = [
    { location: 'San Francisco', attendees: 3240, percentage: 25.2 },
    { location: 'Los Angeles', attendees: 2847, percentage: 22.1 },
    { location: 'New York', attendees: 2156, percentage: 16.8 },
    { location: 'Austin', attendees: 1892, percentage: 14.7 },
    { location: 'Seattle', attendees: 1456, percentage: 11.3 },
    { location: 'Others', attendees: 1256, percentage: 9.9 }
];

// Analytics Metric Card Component
const MetricCard = ({
    title,
    value,
    change,
    trend,
    icon,
    prefix = '',
    suffix = '',
    index = 0,
    gradient = false
}: {
    title: string;
    value: string | number;
    change: number;
    trend: 'up' | 'down';
    icon: React.ReactNode;
    prefix?: string;
    suffix?: string;
    index?: number;
    gradient?: boolean;
}) => (
    <motion.div
        className={`${gradient ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' : 'bg-white'} rounded-2xl p-6 border ${gradient ? 'border-orange-300' : 'border-gray-100'} hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4, scale: 1.02 }}
    >
        {/* Background decoration */}
        <div className={`absolute -top-4 -right-4 w-20 h-20 ${gradient ? 'bg-white/10' : 'bg-orange-50'} rounded-full blur-xl opacity-60`}></div>

        <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${gradient ? 'bg-white/20' : 'bg-orange-50'} ${gradient ? 'text-white' : 'text-orange-600'}`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${gradient ? 'text-white/90' : trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {trend === 'up' ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                    {trend === 'up' ? '+' : ''}{change}%
                </div>
            </div>
            <div>
                <p className={`text-3xl font-bold mb-1 ${gradient ? 'text-white' : 'text-gray-900'}`}>
                    {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                </p>
                <p className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-gray-600'}`}>{title}</p>
                <p className={`text-xs mt-1 ${gradient ? 'text-white/60' : 'text-gray-500'}`}>vs last {mockAnalyticsData.timeframe}</p>
            </div>
        </div>
    </motion.div>
);

// Chart Component (Mock visualization)
const RevenueChart = () => (
    <div className="h-64 flex items-end justify-between gap-2 p-4">
        {mockRevenueData.map((data, index) => {
            const height = (data.revenue / Math.max(...mockRevenueData.map(d => d.revenue))) * 200;
            return (
                <motion.div
                    key={data.month}
                    className="flex-1 flex flex-col items-center gap-2"
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                >
                    <motion.div
                        className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg w-full relative group cursor-pointer"
                        style={{ height: `${height}px` }}
                        whileHover={{ scale: 1.05 }}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}px` }}
                        transition={{ delay: index * 0.2, duration: 0.8 }}
                    >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ${data.revenue.toLocaleString()}
                        </div>
                    </motion.div>
                    <span className="text-sm font-medium text-gray-600">{data.month}</span>
                </motion.div>
            );
        })}
    </div>
);

// Top Events Component
const TopEventCard = ({ event, index }: { event: typeof mockTopEvents[0], index: number }) => (
    <motion.div
        className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:shadow-md transition-all cursor-pointer group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, x: 4 }}
    >
        <div className="relative">
            <div style={{ width: 60, height: 60, position: 'relative' }}>
                <Image
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover rounded-lg"
                    fill
                    sizes="60px"
                />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">#{index + 1}</span>
            </div>
        </div>

        <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                {event.title}
            </h4>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                    <FiDollarSign className="w-3 h-3" />
                    ${event.revenue.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                    <FiUsers className="w-3 h-3" />
                    {event.attendees}
                </span>
                <span className="flex items-center gap-1">
                    <FiStar className="w-3 h-3 text-amber-500" />
                    {event.rating}
                </span>
            </div>
        </div>

        <div className="flex items-center gap-2 text-emerald-600">
            <FiTrendingUp className="w-4 h-4" />
            <span className="text-sm font-bold">+{event.growth}%</span>
        </div>
    </motion.div>
);

export default function AnalyticsPage() {
    const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 2000);
    };

    const timeframeOptions = [
        { value: '7d', label: '7 Days' },
        { value: '30d', label: '30 Days' },
        { value: '90d', label: '90 Days' },
        { value: '1y', label: '1 Year' }
    ];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <motion.div
                className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="mb-6 lg:mb-0">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-3 flex items-center gap-3">
                            <HiOutlineChartBar className="w-12 h-12" />
                            Analytics
                        </h1>
                        <p className="text-orange-100 text-lg mb-4">
                            Track your performance • ${mockAnalyticsData.overview.totalRevenue.toLocaleString()} total revenue
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <FiActivity className="w-5 h-5" />
                                <span className="font-semibold">{mockAnalyticsData.lastUpdated}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <IoSparkles className="w-5 h-5" />
                                <span className="font-semibold">All-time high</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <select
                                value={selectedTimeframe}
                                onChange={(e) => setSelectedTimeframe(e.target.value)}
                                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl px-4 py-3 pr-10 font-semibold appearance-none cursor-pointer"
                            >
                                {timeframeOptions.map((option) => (
                                    <option key={option.value} value={option.value} className="text-gray-900">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                        </div>

                        <motion.button
                            onClick={handleRefresh}
                            className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
                            >
                                <FiRefreshCw className="w-5 h-5" />
                            </motion.div>
                            Refresh
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={mockAnalyticsData.overview.totalRevenue}
                    change={mockAnalyticsData.overview.revenueGrowth}
                    trend="up"
                    icon={<FiDollarSign className="w-6 h-6" />}
                    prefix="$"
                    gradient={true}
                />
                <MetricCard
                    title="Total Events"
                    value={mockAnalyticsData.overview.totalEvents}
                    change={mockAnalyticsData.overview.eventsGrowth}
                    trend="up"
                    icon={<FiCalendar className="w-6 h-6" />}
                    index={1}
                />
                <MetricCard
                    title="Total Attendees"
                    value={mockAnalyticsData.overview.totalAttendees}
                    change={mockAnalyticsData.overview.attendeesGrowth}
                    trend="up"
                    icon={<FiUsers className="w-6 h-6" />}
                    index={2}
                />
                <MetricCard
                    title="Conversion Rate"
                    value={mockAnalyticsData.overview.conversionRate}
                    change={mockAnalyticsData.overview.conversionGrowth}
                    trend="up"
                    icon={<FiTarget className="w-6 h-6" />}
                    suffix="%"
                    index={3}
                />
                <MetricCard
                    title="Avg Ticket Price"
                    value={mockAnalyticsData.overview.avgTicketPrice}
                    change={mockAnalyticsData.overview.priceGrowth}
                    trend="up"
                    icon={<BsTicketPerforated className="w-6 h-6" />}
                    prefix="$"
                    index={4}
                />
                <MetricCard
                    title="Customer Rating"
                    value={mockAnalyticsData.overview.customerSatisfaction}
                    change={mockAnalyticsData.overview.satisfactionGrowth}
                    trend="up"
                    icon={<FiStar className="w-6 h-6" />}
                    suffix="/5"
                    index={5}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend */}
                <motion.div
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FiBarChart className="w-6 h-6 text-orange-500" />
                            Revenue Trend
                        </h3>
                        <button className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1">
                            <FiDownload className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                    <RevenueChart />
                </motion.div>

                {/* Audience Breakdown */}
                <motion.div
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FiPieChart className="w-6 h-6 text-orange-500" />
                            Audience by Category
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {mockAudienceData.map((item, index) => (
                            <motion.div
                                key={item.category}
                                className="flex items-center gap-4"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2 + index * 0.1 }}
                            >
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r" style={{
                                    background: `linear-gradient(to right, ${item.color.split(' ')[1]}, ${item.color.split(' ')[3]})`
                                }}></div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-gray-900">{item.category}</span>
                                        <span className="text-sm font-bold text-gray-600">{item.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <motion.div
                                            className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            transition={{ delay: 1.4 + index * 0.2, duration: 1 }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Performing Events */}
                <motion.div
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <HiOutlineFire className="w-6 h-6 text-orange-500" />
                            Top Performing Events
                        </h3>
                        <button className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1">
                            View all
                            <FiArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {mockTopEvents.map((event, index) => (
                            <TopEventCard key={event.id} event={event} index={index} />
                        ))}
                    </div>
                </motion.div>

                {/* Geographic Distribution */}
                <motion.div
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FiMapPin className="w-6 h-6 text-orange-500" />
                            Geographic Distribution
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {mockGeographicData.map((location, index) => (
                            <motion.div
                                key={location.location}
                                className="flex items-center justify-between"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.6 + index * 0.1 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <span className="font-semibold text-gray-900">{location.location}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">{location.attendees.toLocaleString()}</span>
                                    <span className="text-sm font-bold text-orange-600">{location.percentage}%</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}