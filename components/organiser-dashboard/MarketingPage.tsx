/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiShare2, FiMail, FiMessageSquare, FiUsers, FiTrendingUp,
    FiEye, FiHeart, FiRepeat, FiExternalLink, FiCopy, FiDownload,
    FiPlus, FiEdit3, FiTrash2, FiSend, FiTarget, FiBarChart,
    FiActivity, FiRefreshCw, FiCalendar, FiClock, FiMapPin,
    FiDollarSign, FiZap, FiStar, FiArrowUpRight, FiSettings
} from 'react-icons/fi';
import { IoSparkles, IoTrendingUp, IoFlash, IoMail, IoShareSocial } from "react-icons/io5";
import { HiOutlineSparkles, HiOutlineMegaphone, HiOutlineFire } from "react-icons/hi2";
import { BsInstagram, BsTwitter, BsFacebook, BsLinkedin, BsYoutube } from "react-icons/bs";

// Mock marketing data
const mockMarketingCampaigns = [
    {
        id: '1',
        title: 'AI Summit Social Media Campaign',
        event: 'AI & Machine Learning Summit 2025',
        eventId: 'event1',
        type: 'social_media',
        status: 'active',
        startDate: '2025-06-01',
        endDate: '2025-07-15',
        budget: 5000,
        spent: 3250,
        reach: 125000,
        engagement: 8750,
        clicks: 2340,
        conversions: 187,
        platforms: ['instagram', 'twitter', 'linkedin'],
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        description: 'Comprehensive social media campaign targeting AI professionals and enthusiasts'
    },
    {
        id: '2',
        title: 'Music Festival Email Series',
        event: 'Electronic Music Festival',
        eventId: 'event2',
        type: 'email',
        status: 'active',
        startDate: '2025-06-15',
        endDate: '2025-07-28',
        budget: 2000,
        spent: 850,
        reach: 45000,
        engagement: 13500,
        clicks: 4250,
        conversions: 425,
        platforms: ['email'],
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
        description: 'Multi-touch email campaign with early bird offers and artist announcements'
    },
    {
        id: '3',
        title: 'Startup Competition Content Marketing',
        event: 'Startup Pitch Competition',
        eventId: 'event3',
        type: 'content',
        status: 'draft',
        startDate: '2025-07-01',
        endDate: '2025-08-05',
        budget: 3000,
        spent: 0,
        reach: 0,
        engagement: 0,
        clicks: 0,
        conversions: 0,
        platforms: ['blog', 'youtube', 'linkedin'],
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        description: 'Content series featuring successful startup stories and pitch tips'
    }
];

const mockSocialMetrics = [
    {
        platform: 'Instagram',
        icon: <BsInstagram className="w-5 h-5" />,
        followers: 12500,
        growth: 8.5,
        posts: 45,
        engagement: 7.2,
        color: 'from-pink-500 to-purple-600'
    },
    {
        platform: 'Twitter',
        icon: <BsTwitter className="w-5 h-5" />,
        followers: 8750,
        growth: 12.3,
        posts: 89,
        engagement: 5.8,
        color: 'from-blue-400 to-blue-600'
    },
    {
        platform: 'LinkedIn',
        icon: <BsLinkedin className="w-5 h-5" />,
        followers: 5600,
        growth: 15.7,
        posts: 23,
        engagement: 9.1,
        color: 'from-blue-600 to-blue-800'
    },
    {
        platform: 'Facebook',
        icon: <BsFacebook className="w-5 h-5" />,
        followers: 15200,
        growth: 4.2,
        posts: 34,
        engagement: 6.5,
        color: 'from-blue-500 to-blue-700'
    }
];

const mockContentTemplates = [
    {
        id: '1',
        title: 'Event Announcement',
        type: 'social_post',
        category: 'Announcement',
        description: 'Professional event announcement template with key details',
        platforms: ['instagram', 'twitter', 'linkedin'],
        engagement: 8.5,
        uses: 156
    },
    {
        id: '2',
        title: 'Early Bird Promotion',
        type: 'email',
        category: 'Promotion',
        description: 'Limited-time offer template for early bird tickets',
        platforms: ['email'],
        engagement: 12.3,
        uses: 89
    },
    {
        id: '3',
        title: 'Speaker Spotlight',
        type: 'social_post',
        category: 'Content',
        description: 'Highlight key speakers and their expertise',
        platforms: ['instagram', 'linkedin'],
        engagement: 9.7,
        uses: 203
    },
    {
        id: '4',
        title: 'Last Chance Reminder',
        type: 'email',
        category: 'Urgency',
        description: 'Create urgency for final ticket sales',
        platforms: ['email', 'sms'],
        engagement: 15.2,
        uses: 67
    }
];

const campaignStatusConfig = {
    active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' },
    paused: { label: 'Paused', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' }
};

const campaignTypeConfig = {
    social_media: { label: 'Social Media', icon: <IoShareSocial className="w-4 h-4" />, color: 'from-pink-500 to-purple-600' },
    email: { label: 'Email Marketing', icon: <IoMail className="w-4 h-4" />, color: 'from-blue-500 to-blue-600' },
    content: { label: 'Content Marketing', icon: <FiEdit3 className="w-4 h-4" />, color: 'from-emerald-500 to-emerald-600' },
    paid_ads: { label: 'Paid Advertising', icon: <FiTarget className="w-4 h-4" />, color: 'from-orange-500 to-orange-600' }
};

// Campaign Card Component
const CampaignCard = ({ campaign, index }: { campaign: typeof mockMarketingCampaigns[0], index: number }) => {
    const statusStyle = campaignStatusConfig[campaign.status as keyof typeof campaignStatusConfig];
    const typeConfig = campaignTypeConfig[campaign.type as keyof typeof campaignTypeConfig];
    const conversionRate = campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(1) : '0';
    const budgetUsed = ((campaign.spent / campaign.budget) * 100).toFixed(0);

    return (
        <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2, scale: 1.01 }}
        >
            <div className="flex gap-4">
                <div className="relative flex-shrink-0">
                    <div style={{ width: 80, height: 80, position: 'relative' }}>
                        <Image
                            src={campaign.image}
                            alt={campaign.title}
                            className="w-full h-full object-cover rounded-xl"
                            fill
                            sizes="80px"
                        />
                    </div>
                    <div className={`absolute -top-2 -right-2 w-4 h-4 ${statusStyle.dot} rounded-full border-2 border-white`}></div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-600 transition-colors">
                                {campaign.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{campaign.event}</p>
                            <p className="text-sm text-gray-500 line-clamp-2">{campaign.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <div className={`${statusStyle.color} px-3 py-1 rounded-full text-xs font-bold`}>
                                {statusStyle.label}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${typeConfig.color}`}>
                                {typeConfig.label}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-lg font-bold text-gray-900">{campaign.reach.toLocaleString()}</div>
                            <div className="text-xs text-gray-600">Reach</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-lg font-bold text-blue-600">{campaign.clicks.toLocaleString()}</div>
                            <div className="text-xs text-gray-600">Clicks</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-lg font-bold text-emerald-600">{campaign.conversions}</div>
                            <div className="text-xs text-gray-600">Conversions</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-lg font-bold text-purple-600">{conversionRate}%</div>
                            <div className="text-xs text-gray-600">CVR</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Budget:</span>
                                <span className="font-semibold text-gray-900">${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${budgetUsed}%` }}
                                        transition={{ delay: index * 0.2, duration: 1 }}
                                    />
                                </div>
                                <span className="text-xs text-gray-500">{budgetUsed}%</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.button
                                className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiBarChart className="w-4 h-4 text-gray-600" />
                            </motion.button>
                            <motion.button
                                className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiEdit3 className="w-4 h-4 text-gray-600" />
                            </motion.button>
                            <motion.button
                                className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiSettings className="w-4 h-4 text-gray-600" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Social Platform Card
const SocialPlatformCard = ({ platform, index }: { platform: typeof mockSocialMetrics[0], index: number }) => (
    <motion.div
        className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4, scale: 1.02 }}
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${platform.color} text-white`}>
                {platform.icon}
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
                <FiTrendingUp className="w-4 h-4" />
                <span className="text-sm font-bold">+{platform.growth}%</span>
            </div>
        </div>

        <div className="mb-4">
            <h3 className="font-bold text-gray-900 mb-1">{platform.platform}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{platform.followers.toLocaleString()}</p>
            <p className="text-sm text-gray-600">followers</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <div className="text-lg font-bold text-gray-900">{platform.posts}</div>
                <div className="text-xs text-gray-600">Posts</div>
            </div>
            <div>
                <div className="text-lg font-bold text-blue-600">{platform.engagement}%</div>
                <div className="text-xs text-gray-600">Engagement</div>
            </div>
        </div>
    </motion.div>
);

// Content Template Card
const TemplateCard = ({ template, index }: { template: typeof mockContentTemplates[0], index: number }) => (
    <motion.div
        className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -2, scale: 1.01 }}
    >
        <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                    {template.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    {template.category}
                </span>
            </div>
        </div>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{template.engagement}% engagement</span>
                <span>•</span>
                <span>{template.uses} uses</span>
            </div>
            <motion.button
                className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FiArrowUpRight className="w-4 h-4 text-gray-600" />
            </motion.button>
        </div>
    </motion.div>
);

export default function MarketingPage() {
    const [selectedTab, setSelectedTab] = useState('campaigns');

    const tabs = [
        { id: 'campaigns', label: 'Campaigns', icon: <HiOutlineMegaphone className="w-5 h-5" /> },
        { id: 'social', label: 'Social Media', icon: <FiShare2 className="w-5 h-5" /> },
        { id: 'templates', label: 'Templates', icon: <FiEdit3 className="w-5 h-5" /> },
        { id: 'analytics', label: 'Analytics', icon: <FiBarChart className="w-5 h-5" /> }
    ];

    const totalReach = mockMarketingCampaigns.reduce((sum, campaign) => sum + campaign.reach, 0);
    const totalConversions = mockMarketingCampaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
    const totalSpent = mockMarketingCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0);

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
                            <HiOutlineMegaphone className="w-12 h-12" />
                            Marketing
                        </h1>
                        <p className="text-orange-100 text-lg mb-4">
                            Promote your events • {totalReach.toLocaleString()} total reach • {totalConversions} conversions
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <IoSparkles className="w-5 h-5" />
                                <span className="font-semibold">${totalSpent.toLocaleString()} invested</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <FiTarget className="w-5 h-5" />
                                <span className="font-semibold">{mockMarketingCampaigns.filter(c => c.status === 'active').length} active campaigns</span>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all shadow-lg flex items-center gap-3"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiPlus className="w-6 h-6" />
                        Create Campaign
                    </motion.button>
                </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Reach', value: totalReach.toLocaleString(), icon: <FiEye className="w-6 h-6" />, color: 'from-blue-500 to-blue-600', change: '+23.5%' },
                    { label: 'Conversions', value: totalConversions, icon: <FiTarget className="w-6 h-6" />, color: 'from-emerald-500 to-emerald-600', change: '+18.2%' },
                    { label: 'Investment', value: `$${totalSpent.toLocaleString()}`, icon: <FiDollarSign className="w-6 h-6" />, color: 'from-purple-500 to-purple-600', change: '+12.1%' },
                    { label: 'Active Campaigns', value: mockMarketingCampaigns.filter(c => c.status === 'active').length, icon: <FiActivity className="w-6 h-6" />, color: 'from-orange-500 to-orange-600', change: '+2' }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className={`${index === 0 ? `bg-gradient-to-br ${stat.color} text-white` : 'bg-white'} rounded-2xl p-6 border ${index === 0 ? 'border-blue-300' : 'border-gray-100'} hover:shadow-xl transition-all duration-300`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${index === 0 ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'}`}>
                                {stat.icon}
                            </div>
                            <div className={`text-sm font-bold ${index === 0 ? 'text-white/90' : 'text-emerald-600'}`}>
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className={`text-3xl font-bold mb-1 ${index === 0 ? 'text-white' : 'text-gray-900'}`}>
                                {stat.value}
                            </p>
                            <p className={`text-sm font-medium ${index === 0 ? 'text-white/80' : 'text-gray-600'}`}>
                                {stat.label}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs Navigation */}
            <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <div className="flex items-center gap-2 overflow-x-auto">
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${selectedTab === tab.id
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {tab.icon}
                            {tab.label}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
                key={selectedTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {selectedTab === 'campaigns' && (
                    <div className="space-y-6">
                        {mockMarketingCampaigns.map((campaign, index) => (
                            <CampaignCard key={campaign.id} campaign={campaign} index={index} />
                        ))}
                    </div>
                )}

                {selectedTab === 'social' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {mockSocialMetrics.map((platform, index) => (
                            <SocialPlatformCard key={platform.platform} platform={platform} index={index} />
                        ))}
                    </div>
                )}

                {selectedTab === 'templates' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {mockContentTemplates.map((template, index) => (
                            <TemplateCard key={template.id} template={template} index={index} />
                        ))}
                    </div>
                )}

                {selectedTab === 'analytics' && (
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                        <div className="text-gray-400 text-6xl mb-4">📊</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Analytics</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Get detailed insights into your marketing performance with advanced analytics and reporting tools.
                        </p>
                        <motion.button
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiBarChart className="w-6 h-6" />
                            View Analytics Dashboard
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}