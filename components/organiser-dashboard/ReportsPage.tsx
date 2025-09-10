/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiFileText, FiDownload, FiFilter, FiCalendar, FiTrendingUp,
    FiTrendingDown, FiUsers, FiDollarSign, FiTarget, FiBarChart,
    FiPieChart, FiActivity, FiEye, FiShare2, FiRefreshCw,
    FiChevronDown, FiChevronRight, FiStar, FiMapPin, FiClock,
    FiArrowUpRight, FiArrowDownRight, FiPercent, FiZap, FiSettings
} from 'react-icons/fi';
import { IoSparkles, IoTrendingUp, IoFlash } from "react-icons/io5";
import { HiOutlineSparkles, HiOutlineDocumentText, HiOutlineFire } from "react-icons/hi2";
import { BsTicketPerforated, BsLightningCharge } from "react-icons/bs";

// Mock reports data
const mockReportCategories = [
    {
        id: 'financial',
        title: 'Financial Reports',
        description: 'Revenue, expenses, and profitability analysis',
        icon: <FiDollarSign className="w-6 h-6" />,
        color: 'from-emerald-500 to-emerald-600',
        reports: [
            { id: 'revenue', name: 'Revenue Summary', lastGenerated: '2025-06-20', downloads: 156 },
            { id: 'profit-loss', name: 'Profit & Loss Statement', lastGenerated: '2025-06-15', downloads: 89 },
            { id: 'payout-history', name: 'Payout History', lastGenerated: '2025-06-20', downloads: 234 },
            { id: 'tax-summary', name: 'Tax Summary', lastGenerated: '2025-06-01', downloads: 67 }
        ]
    },
    {
        id: 'attendance',
        title: 'Attendance Reports',
        description: 'Attendee demographics and engagement metrics',
        icon: <FiUsers className="w-6 h-6" />,
        color: 'from-blue-500 to-blue-600',
        reports: [
            { id: 'attendee-list', name: 'Complete Attendee List', lastGenerated: '2025-06-20', downloads: 345 },
            { id: 'demographics', name: 'Attendee Demographics', lastGenerated: '2025-06-18', downloads: 178 },
            { id: 'check-in', name: 'Check-in Report', lastGenerated: '2025-06-20', downloads: 123 },
            { id: 'no-shows', name: 'No-Show Analysis', lastGenerated: '2025-06-19', downloads: 89 }
        ]
    },
    {
        id: 'marketing',
        title: 'Marketing Reports',
        description: 'Campaign performance and conversion analytics',
        icon: <FiBarChart className="w-6 h-6" />,
        color: 'from-purple-500 to-purple-600',
        reports: [
            { id: 'campaign-performance', name: 'Campaign Performance', lastGenerated: '2025-06-20', downloads: 198 },
            { id: 'conversion-funnel', name: 'Conversion Funnel', lastGenerated: '2025-06-19', downloads: 156 },
            { id: 'social-media', name: 'Social Media Analytics', lastGenerated: '2025-06-18', downloads: 234 },
            { id: 'email-performance', name: 'Email Campaign Results', lastGenerated: '2025-06-17', downloads: 167 }
        ]
    },
    {
        id: 'operational',
        title: 'Operational Reports',
        description: 'Event logistics and performance metrics',
        icon: <FiActivity className="w-6 h-6" />,
        color: 'from-orange-500 to-orange-600',
        reports: [
            { id: 'event-performance', name: 'Event Performance Summary', lastGenerated: '2025-06-20', downloads: 289 },
            { id: 'feedback-analysis', name: 'Feedback & Ratings Analysis', lastGenerated: '2025-06-19', downloads: 145 },
            { id: 'logistics', name: 'Logistics Report', lastGenerated: '2025-06-18', downloads: 98 },
            { id: 'vendor-performance', name: 'Vendor Performance', lastGenerated: '2025-06-17', downloads: 76 }
        ]
    }
];

const mockCustomReports = [
    {
        id: 'custom1',
        name: 'Q2 2025 Comprehensive Analysis',
        description: 'Complete quarterly performance across all events',
        createdDate: '2025-06-15',
        lastRun: '2025-06-20',
        schedule: 'Monthly',
        format: 'PDF',
        status: 'completed',
        size: '2.4 MB'
    },
    {
        id: 'custom2',
        name: 'Tech Events Performance',
        description: 'Technology category events analysis and trends',
        createdDate: '2025-06-10',
        lastRun: '2025-06-19',
        schedule: 'Weekly',
        format: 'Excel',
        status: 'completed',
        size: '1.8 MB'
    },
    {
        id: 'custom3',
        name: 'Customer Satisfaction Trends',
        description: 'Attendee feedback and satisfaction tracking',
        createdDate: '2025-06-05',
        lastRun: '2025-06-18',
        schedule: 'Bi-weekly',
        format: 'PDF',
        status: 'processing',
        size: '3.1 MB'
    }
];

type QuickInsightTrend = 'up' | 'down' | 'neutral';

const mockQuickInsights: Array<{
    title: string;
    value: string;
    metric: string;
    change: string;
    trend: QuickInsightTrend;
    icon: JSX.Element;
}> = [
        {
            title: 'Top Performing Event',
            value: 'AI & ML Summit 2025',
            metric: '$252K revenue',
            change: '+23%',
            trend: 'up',
            icon: <FiTrendingUp className="w-5 h-5" />
        },
        {
            title: 'Highest Conversion Rate',
            value: 'Student Discount Tickets',
            metric: '18.6% conversion',
            change: '+5.2%',
            trend: 'up',
            icon: <FiTarget className="w-5 h-5" />
        },
        {
            title: 'Most Popular Category',
            value: 'Technology Events',
            metric: '45% of revenue',
            change: '+8%',
            trend: 'up',
            icon: <FiBarChart className="w-5 h-5" />
        },
        {
            title: 'Peak Registration Time',
            value: 'Tuesday 10-11 AM',
            metric: '34% of sign-ups',
            change: 'Consistent',
            trend: 'neutral',
            icon: <FiClock className="w-5 h-5" />
        }
    ];

const reportStatusConfig = {
    completed: {
        label: 'Completed',
        color: 'bg-emerald-100 text-emerald-700',
        dot: 'bg-emerald-500'
    },
    processing: {
        label: 'Processing',
        color: 'bg-yellow-100 text-yellow-700',
        dot: 'bg-yellow-500'
    },
    failed: {
        label: 'Failed',
        color: 'bg-red-100 text-red-700',
        dot: 'bg-red-500'
    },
    scheduled: {
        label: 'Scheduled',
        color: 'bg-blue-100 text-blue-700',
        dot: 'bg-blue-500'
    }
};

// Report Category Card Component
const ReportCategoryCard = ({ category, index }: {
    category: typeof mockReportCategories[0],
    index: number
}) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
        >
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-white`}>
                            {category.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{category.title}</h3>
                            <p className="text-gray-600 text-sm">{category.description}</p>
                        </div>
                    </div>
                    <motion.button
                        onClick={() => setExpanded(!expanded)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            animate={{ rotate: expanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FiChevronRight className="w-5 h-5 text-gray-500" />
                        </motion.div>
                    </motion.button>
                </div>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                {category.reports.map((report, reportIndex) => (
                                    <motion.div
                                        key={report.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group cursor-pointer"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: reportIndex * 0.05 }}
                                        whileHover={{ x: 4 }}
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                                {report.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Last generated: {new Date(report.lastGenerated).toLocaleDateString()} • {report.downloads} downloads
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FiEye className="w-4 h-4 text-gray-600" />
                                            </motion.button>
                                            <motion.button
                                                className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FiDownload className="w-4 h-4 text-gray-600" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// Custom Report Card Component
const CustomReportCard = ({ report, index }: {
    report: typeof mockCustomReports[0],
    index: number
}) => {
    const statusStyle = reportStatusConfig[report.status as keyof typeof reportStatusConfig];

    return (
        <motion.div
            className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2, scale: 1.01 }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{report.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{report.description}</p>
                </div>
                <div className={`${statusStyle.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ml-4`}>
                    <div className={`w-2 h-2 ${statusStyle.dot} rounded-full`}></div>
                    {statusStyle.label}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Created</p>
                    <p className="text-sm font-semibold text-gray-900">{new Date(report.createdDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Schedule</p>
                    <p className="text-sm font-semibold text-gray-900">{report.schedule}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Format</p>
                    <p className="text-sm font-semibold text-gray-900">{report.format}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Size</p>
                    <p className="text-sm font-semibold text-gray-900">{report.size}</p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                    Last run: {new Date(report.lastRun).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2">
                    <motion.button
                        className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiSettings className="w-4 h-4 text-gray-600" />
                    </motion.button>
                    <motion.button
                        className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiDownload className="w-4 h-4 text-gray-600" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// Quick Insight Card Component
const QuickInsightCard = ({ insight, index }: {
    insight: typeof mockQuickInsights[0],
    index: number
}) => (
    <motion.div
        className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -2, scale: 1.02 }}
    >
        <div className="flex items-start justify-between mb-4">
            <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                {insight.icon}
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${insight.trend === 'up' ? 'text-emerald-600' :
                insight.trend === 'down' ? 'text-red-500' : 'text-gray-600'
                }`}>
                {insight.trend === 'up' && <FiTrendingUp className="w-4 h-4" />}
                {insight.trend === 'down' && <FiTrendingDown className="w-4 h-4" />}
                {insight.change}
            </div>
        </div>

        <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">{insight.value}</h3>
            <p className="text-sm text-gray-600 mb-1">{insight.title}</p>
            <p className="text-xs text-gray-500">{insight.metric}</p>
        </div>
    </motion.div>
);

export default function ReportsPage() {
    const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isGenerating, setIsGenerating] = useState(false);

    const timeframeOptions = [
        { value: '7d', label: '7 Days' },
        { value: '30d', label: '30 Days' },
        { value: '90d', label: '90 Days' },
        { value: '1y', label: '1 Year' }
    ];

    const handleGenerateReport = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 3000);
    };

    const totalReports = mockReportCategories.reduce((sum, cat) => sum + cat.reports.length, 0);
    const totalDownloads = mockReportCategories.reduce((sum, cat) =>
        sum + cat.reports.reduce((catSum, report) => catSum + report.downloads, 0), 0);

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
                            <HiOutlineDocumentText className="w-12 h-12" />
                            Reports
                        </h1>
                        <p className="text-orange-100 text-lg mb-4">
                            Detailed analytics & reports • {totalReports} available reports • {totalDownloads.toLocaleString()} downloads
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <IoSparkles className="w-5 h-5" />
                                <span className="font-semibold">{mockCustomReports.length} custom reports</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <FiRefreshCw className="w-5 h-5" />
                                <span className="font-semibold">Auto-updated daily</span>
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
                            onClick={handleGenerateReport}
                            disabled={isGenerating}
                            className="bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={isGenerating ? { rotate: 360 } : { rotate: 0 }}
                                transition={{ duration: 1, repeat: isGenerating ? Infinity : 0 }}
                            >
                                <FiFileText className="w-5 h-5" />
                            </motion.div>
                            {isGenerating ? 'Generating...' : 'Generate Report'}
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Quick Insights */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <HiOutlineFire className="w-6 h-6 text-orange-500" />
                    Quick Insights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {mockQuickInsights.map((insight, index) => (
                        <QuickInsightCard key={insight.title} insight={insight} index={index} />
                    ))}
                </div>
            </motion.div>

            {/* Standard Reports */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FiBarChart className="w-6 h-6 text-orange-500" />
                        Standard Reports
                    </h2>
                    <motion.button
                        className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiDownload className="w-4 h-4" />
                        Bulk Download
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {mockReportCategories.map((category, index) => (
                        <ReportCategoryCard key={category.id} category={category} index={index} />
                    ))}
                </div>
            </motion.div>

            {/* Custom Reports */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FiSettings className="w-6 h-6 text-orange-500" />
                        Custom Reports
                    </h2>
                    <motion.button
                        className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2 font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiFileText className="w-5 h-5" />
                        Create Custom Report
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {mockCustomReports.map((report, index) => (
                        <CustomReportCard key={report.id} report={report} index={index} />
                    ))}
                </div>
            </motion.div>

            {/* Export Options */}
            <motion.div
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiShare2 className="w-6 h-6 text-orange-500" />
                    Export & Share Options
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FiFileText className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">PDF Reports</h4>
                        <p className="text-gray-600 text-sm mb-4">Professional formatted reports for presentations</p>
                        <motion.button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Generate PDF
                        </motion.button>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FiBarChart className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Excel Workbooks</h4>
                        <p className="text-gray-600 text-sm mb-4">Detailed data analysis with interactive charts</p>
                        <motion.button
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Export Excel
                        </motion.button>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FiShare2 className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Dashboard Links</h4>
                        <p className="text-gray-600 text-sm mb-4">Share live dashboard with stakeholders</p>
                        <motion.button
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Create Link
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}