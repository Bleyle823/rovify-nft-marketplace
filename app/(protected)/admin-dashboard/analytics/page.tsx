/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiBarChart, FiTrendingUp, FiTrendingDown, FiUsers, FiCalendar,
    FiDollarSign, FiActivity, FiEye, FiClock, FiMapPin, FiTag,
    FiPieChart, FiDownload, FiRefreshCw, FiFilter, FiGrid,
    FiArrowUp, FiArrowDown, FiTarget, FiZap, FiGlobe,
    FiPercent, FiStar, FiHeart, FiShoppingCart, FiCreditCard
} from 'react-icons/fi';
import React from 'react';

interface AnalyticsData {
    users: {
        total: number;
        active: number;
        newThisMonth: number;
        retentionRate: number;
        averageSessionDuration: string;
        topLocations: Array<{ country: string; users: number; percentage: number }>;
        userGrowth: Array<{ month: string; users: number }>;
    };
    events: {
        total: number;
        active: number;
        avgAttendance: number;
        totalTicketsSold: number;
        topCategories: Array<{ category: string; events: number; percentage: number }>;
        eventPerformance: Array<{ month: string; events: number; revenue: number }>;
    };
    revenue: {
        total: number;
        thisMonth: number;
        averageOrderValue: number;
        conversionRate: number;
        revenueGrowth: Array<{ month: string; amount: number }>;
        paymentMethods: Array<{ method: string; amount: number; percentage: number }>;
    };
    engagement: {
        pageViews: number;
        avgSessionTime: string;
        bounceRate: number;
        conversionRate: number;
        topPages: Array<{ page: string; views: number; duration: string }>;
        deviceBreakdown: Array<{ device: string; percentage: number }>;
    };
}

const mockAnalytics: AnalyticsData = {
    users: {
        total: 15420,
        active: 8930,
        newThisMonth: 1247,
        retentionRate: 73.2,
        averageSessionDuration: '12m 34s',
        topLocations: [
            { country: 'United States', users: 6834, percentage: 44.3 },
            { country: 'United Kingdom', users: 2156, percentage: 14.0 },
            { country: 'Canada', users: 1892, percentage: 12.3 },
            { country: 'Australia', users: 1234, percentage: 8.0 },
            { country: 'Germany', users: 987, percentage: 6.4 }
        ],
        userGrowth: [
            { month: 'Jan', users: 12500 },
            { month: 'Feb', users: 13200 },
            { month: 'Mar', users: 13800 },
            { month: 'Apr', users: 14300 },
            { month: 'May', users: 14900 },
            { month: 'Jun', users: 15420 }
        ]
    },
    events: {
        total: 1247,
        active: 89,
        avgAttendance: 156,
        totalTicketsSold: 89340,
        topCategories: [
            { category: 'Technology', events: 312, percentage: 25.0 },
            { category: 'Music', events: 287, percentage: 23.0 },
            { category: 'Art & Culture', events: 199, percentage: 16.0 },
            { category: 'Business', events: 174, percentage: 14.0 },
            { category: 'Sports', events: 137, percentage: 11.0 }
        ],
        eventPerformance: [
            { month: 'Jan', events: 89, revenue: 234500 },
            { month: 'Feb', events: 97, revenue: 289300 },
            { month: 'Mar', events: 134, revenue: 356700 },
            { month: 'Apr', events: 156, revenue: 423400 },
            { month: 'May', events: 178, revenue: 498200 },
            { month: 'Jun', events: 203, revenue: 567800 }
        ]
    },
    revenue: {
        total: 2847600,
        thisMonth: 567800,
        averageOrderValue: 127.50,
        conversionRate: 3.8,
        revenueGrowth: [
            { month: 'Jan', amount: 234500 },
            { month: 'Feb', amount: 289300 },
            { month: 'Mar', amount: 356700 },
            { month: 'Apr', amount: 423400 },
            { month: 'May', amount: 498200 },
            { month: 'Jun', amount: 567800 }
        ],
        paymentMethods: [
            { method: 'Credit Card', amount: 1708560, percentage: 60.0 },
            { method: 'Crypto', amount: 739896, percentage: 26.0 },
            { method: 'PayPal', amount: 284760, percentage: 10.0 },
            { method: 'Bank Transfer', amount: 113904, percentage: 4.0 }
        ]
    },
    engagement: {
        pageViews: 2340567,
        avgSessionTime: '8m 42s',
        bounceRate: 34.2,
        conversionRate: 3.8,
        topPages: [
            { page: '/events', views: 456789, duration: '5m 23s' },
            { page: '/home', views: 389234, duration: '3m 45s' },
            { page: '/event/tech-summit', views: 234567, duration: '7m 12s' },
            { page: '/tickets', views: 189345, duration: '4m 56s' },
            { page: '/profile', views: 156789, duration: '6m 18s' }
        ],
        deviceBreakdown: [
            { device: 'Desktop', percentage: 52.3 },
            { device: 'Mobile', percentage: 39.1 },
            { device: 'Tablet', percentage: 8.6 }
        ]
    }
};

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics);
    const [timeRange, setTimeRange] = useState('30d');
    const [selectedMetric, setSelectedMetric] = useState('revenue');
    const [isLoading, setIsLoading] = useState(false);

    const MetricCard = ({
        title,
        value,
        subtitle,
        change,
        icon,
        color,
        format = 'number'
    }: {
        title: string;
        value: number | string;
        subtitle?: string;
        change?: number;
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
        color: string;
        format?: 'number' | 'currency' | 'percentage';
    }) => {
        const formatValue = () => {
            if (typeof value === 'string') return value;

            switch (format) {
                case 'currency':
                    return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0
                    }).format(value);
                case 'percentage':
                    return `${value}%`;
                default:
                    return value.toLocaleString();
            }
        };

        return (
            <motion.div
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <p className="text-gray-600 text-sm font-medium">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{formatValue()}</p>
                        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
                        {React.createElement(icon, { className: "w-6 h-6", style: { color } } as React.SVGProps<SVGSVGElement>)}
                    </div>
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change >= 0 ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                        <span className="font-medium">{Math.abs(change)}%</span>
                        <span className="text-gray-500">vs. last period</span>
                    </div>
                )}
            </motion.div>
        );
    };

    const ChartPlaceholder = ({ title, subtitle, icon }: {
        title: string;
        subtitle: string;
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    }) => (
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiFilter className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiDownload className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="h-64 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center border-2 border-dashed border-orange-200">
                <div className="text-center">
                    {React.createElement(icon, { className: "w-12 h-12 text-orange-400 mx-auto mb-3" })}
                    <p className="text-gray-600 font-medium">{title} Visualization</p>
                    <p className="text-sm text-gray-500 mt-1">Chart.js or Recharts integration</p>
                </div>
            </div>
        </div>
    );

    const TopList = ({ title, items, valueKey, labelKey, showPercentage = false }: {
        title: string;
        items: Record<string, unknown>[];
        valueKey: string;
        labelKey: string;
        showPercentage?: boolean;
    }) => (
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                            </div>
                            <span className="font-medium text-gray-900">{String(item[labelKey])}</span>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-gray-900">
                                {typeof item[valueKey] === 'number'
                                    ? (item[valueKey] as number).toLocaleString()
                                    : String(item[valueKey])}
                            </p>
                            {showPercentage && typeof item.percentage !== 'undefined' && (
                                <p className="text-xs text-gray-500">{`${item.percentage as number}%`}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600 mt-1">Comprehensive insights into platform performance and user behavior</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                        {['7d', '30d', '90d', '1y'].map((period) => (
                            <button
                                key={period}
                                onClick={() => setTimeRange(period)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${timeRange === period
                                    ? 'bg-orange-500 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                        <FiRefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                        <FiDownload className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={analytics.revenue.total}
                    subtitle="All time"
                    change={24.5}
                    icon={FiDollarSign}
                    color="#4CAF50"
                    format="currency"
                />
                <MetricCard
                    title="Total Users"
                    value={analytics.users.total}
                    subtitle={`${analytics.users.newThisMonth} new this month`}
                    change={18.2}
                    icon={FiUsers}
                    color="#2196F3"
                />
                <MetricCard
                    title="Active Events"
                    value={analytics.events.active}
                    subtitle={`${analytics.events.total} total events`}
                    change={12.7}
                    icon={FiCalendar}
                    color="#FF9800"
                />
                <MetricCard
                    title="Conversion Rate"
                    value={analytics.revenue.conversionRate}
                    subtitle="Visitor to customer"
                    change={-2.1}
                    icon={FiTarget}
                    color="#9C27B0"
                    format="percentage"
                />
            </div>

            {/* Revenue and User Growth Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartPlaceholder
                    title="Revenue Growth"
                    subtitle="Monthly revenue trend over time"
                    icon={FiTrendingUp}
                />
                <ChartPlaceholder
                    title="User Acquisition"
                    subtitle="New user registrations by month"
                    icon={FiUsers}
                />
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                    title="Page Views"
                    value={analytics.engagement.pageViews}
                    subtitle="This month"
                    change={15.3}
                    icon={FiEye}
                    color="#FF5722"
                />
                <MetricCard
                    title="Avg Session Time"
                    value={analytics.engagement.avgSessionTime}
                    subtitle="Per user session"
                    change={8.7}
                    icon={FiClock}
                    color="#607D8B"
                />
                <MetricCard
                    title="Bounce Rate"
                    value={analytics.engagement.bounceRate}
                    subtitle="Single page visits"
                    change={-5.2}
                    icon={FiActivity}
                    color="#795548"
                    format="percentage"
                />
                <MetricCard
                    title="Retention Rate"
                    value={analytics.users.retentionRate}
                    subtitle="30-day retention"
                    change={11.8}
                    icon={FiHeart}
                    color="#E91E63"
                    format="percentage"
                />
            </div>

            {/* Detailed Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Geographic Distribution */}
                <TopList
                    title="Top Locations"
                    items={analytics.users.topLocations}
                    valueKey="users"
                    labelKey="country"
                    showPercentage={true}
                />

                {/* Event Categories */}
                <TopList
                    title="Event Categories"
                    items={analytics.events.topCategories}
                    valueKey="events"
                    labelKey="category"
                    showPercentage={true}
                />

                {/* Payment Methods */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Methods</h3>
                    <div className="space-y-4">
                        {analytics.revenue.paymentMethods.map((method, index) => (
                            <motion.div
                                key={index}
                                className="space-y-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-900">{method.method}</span>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">
                                            ${method.amount.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500">{method.percentage}%</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <motion.div
                                        className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${method.percentage}%` }}
                                        transition={{ duration: 1, delay: index * 0.2 }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performing Pages */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Pages</h3>
                    <div className="space-y-4">
                        {analytics.engagement.topPages.map((page, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{page.page}</h4>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                        <span className="flex items-center gap-1">
                                            <FiEye className="w-3 h-3" />
                                            {page.views.toLocaleString()} views
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiClock className="w-3 h-3" />
                                            {page.duration}
                                        </span>
                                    </div>
                                </div>
                                <FiTrendingUp className="w-5 h-5 text-green-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Device Breakdown */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Breakdown</h3>
                    <div className="space-y-6">
                        {analytics.engagement.deviceBreakdown.map((device, index) => (
                            <motion.div
                                key={index}
                                className="space-y-2"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-900">{device.device}</span>
                                    <span className="font-semibold text-gray-900">{device.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <motion.div
                                        className={`h-3 rounded-full ${index === 0 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                                            index === 1 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                                                'bg-gradient-to-r from-green-400 to-green-600'
                                            }`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${device.percentage}%` }}
                                        transition={{ duration: 1, delay: index * 0.3 }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick insights */}
                    <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-2">Key Insights</h4>
                        <ul className="text-sm text-orange-700 space-y-1">
                            <li>• Desktop users have highest conversion rate</li>
                            <li>• Mobile traffic growing 15% month-over-month</li>
                            <li>• Consider mobile-first design improvements</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                            <FiTrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-green-900">Growth Momentum</h3>
                            <p className="text-sm text-green-700">Strong positive trends</p>
                        </div>
                    </div>
                    <p className="text-green-800 text-sm">
                        Revenue growth of 24.5% with increasing user engagement across all metrics.
                    </p>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                            <FiTarget className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900">Conversion Focus</h3>
                            <p className="text-sm text-blue-700">Optimization needed</p>
                        </div>
                    </div>
                    <p className="text-blue-800 text-sm">
                        Conversion rate at 3.8% - consider A/B testing checkout flow improvements.
                    </p>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                            <FiZap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-purple-900">User Engagement</h3>
                            <p className="text-sm text-purple-700">Above industry average</p>
                        </div>
                    </div>
                    <p className="text-purple-800 text-sm">
                        Session duration 8m 42s exceeds industry benchmark of 6m 30s.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}