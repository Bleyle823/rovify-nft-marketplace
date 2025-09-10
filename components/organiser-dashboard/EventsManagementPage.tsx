/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiCalendar, FiClock, FiUsers, FiDollarSign, FiMapPin, FiEdit3,
    FiTrash2, FiEye, FiCopy, FiShare2, FiMoreHorizontal, FiFilter,
    FiSearch, FiPlus, FiDownload, FiUpload, FiSettings, FiTrendingUp,
    FiTrendingDown, FiPause, FiPlay, FiStar, FiBarChart
} from 'react-icons/fi';
import { IoSparkles, IoTicket, IoTrendingUp } from "react-icons/io5";
import { HiOutlineSparkles, HiOutlineFire, HiOutlineCalendarDays } from "react-icons/hi2";
import { BsTicketPerforated, BsLightningCharge } from "react-icons/bs";

// Mock events data
const mockEvents = [
    {
        id: 'event1',
        title: 'AI & Machine Learning Summit 2025',
        description: 'Join industry leaders for the biggest AI conference of the year',
        date: '2025-07-15',
        time: '9:00 AM',
        endDate: '2025-07-17',
        endTime: '6:00 PM',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        location: 'Tech Convention Center, San Francisco',
        price: 299,
        attendees: 847,
        capacity: 1000,
        revenue: 252653,
        status: 'published',
        category: 'Technology',
        tags: ['AI', 'Machine Learning', 'Technology'],
        rating: 4.8,
        views: 12547,
        conversions: 847,
        lastUpdated: '2 hours ago'
    },
    {
        id: 'event2',
        title: 'Electronic Music Festival',
        description: 'Three days of electronic music with top international DJs',
        date: '2025-07-28',
        time: '6:00 PM',
        endDate: '2025-07-30',
        endTime: '11:59 PM',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
        location: 'Downtown Arena, Los Angeles',
        price: 129,
        attendees: 1247,
        capacity: 2000,
        revenue: 160863,
        status: 'published',
        category: 'Music',
        tags: ['Electronic', 'Music', 'Festival'],
        rating: 4.9,
        views: 18743,
        conversions: 1247,
        lastUpdated: '1 day ago'
    },
    {
        id: 'event3',
        title: 'Startup Pitch Competition',
        description: 'Early-stage startups compete for $100K in funding',
        date: '2025-08-05',
        time: '2:00 PM',
        endDate: '2025-08-05',
        endTime: '8:00 PM',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        location: 'Innovation Hub, Austin',
        price: 89,
        attendees: 156,
        capacity: 200,
        revenue: 13884,
        status: 'draft',
        category: 'Business',
        tags: ['Startup', 'Business', 'Investment'],
        rating: 0,
        views: 2847,
        conversions: 156,
        lastUpdated: '3 hours ago'
    },
    {
        id: 'event4',
        title: 'Digital Marketing Masterclass',
        description: 'Learn advanced digital marketing strategies from experts',
        date: '2025-08-12',
        time: '10:00 AM',
        endDate: '2025-08-12',
        endTime: '5:00 PM',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
        location: 'Online Event',
        price: 197,
        attendees: 543,
        capacity: 500,
        revenue: 106971,
        status: 'published',
        category: 'Education',
        tags: ['Marketing', 'Digital', 'Business'],
        rating: 4.7,
        views: 9234,
        conversions: 543,
        lastUpdated: '5 hours ago'
    }
];

const eventStatusConfig = {
    published: {
        label: 'Published',
        color: 'bg-emerald-100 text-emerald-700',
        icon: <IoTrendingUp className="w-3 h-3" />
    },
    draft: {
        label: 'Draft',
        color: 'bg-gray-100 text-gray-700',
        icon: <FiEdit3 className="w-3 h-3" />
    },
    paused: {
        label: 'Paused',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <FiPause className="w-3 h-3" />
    },
    ended: {
        label: 'Ended',
        color: 'bg-red-100 text-red-700',
        icon: <FiClock className="w-3 h-3" />
    }
};

interface EventCardProps {
    event: typeof mockEvents[0];
    index: number;
    viewMode: 'grid' | 'list';
}

const EventCard = ({ event, index, viewMode }: EventCardProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const statusConfig = eventStatusConfig[event.status as keyof typeof eventStatusConfig];
    const conversionRate = ((event.conversions / event.views) * 100).toFixed(1);
    const fillPercentage = (event.attendees / event.capacity) * 100;

    if (viewMode === 'list') {
        return (
            <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
            >
                <div className="flex gap-6">
                    <div className="relative flex-shrink-0">
                        <div style={{ width: 120, height: 90, position: 'relative' }}>
                            <Image
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover rounded-xl"
                                fill
                                sizes="120px"
                            />
                        </div>
                        <div className={`absolute -top-2 -right-2 ${statusConfig.color} px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-orange-600 transition-colors">
                                    {event.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>

                                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
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
                            </div>

                            <div className="relative">
                                <motion.button
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiMoreHorizontal className="w-5 h-5 text-gray-500" />
                                </motion.button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            {[
                                                { icon: <FiEye className="w-4 h-4" />, label: 'View Event' },
                                                { icon: <FiEdit3 className="w-4 h-4" />, label: 'Edit Event' },
                                                { icon: <FiCopy className="w-4 h-4" />, label: 'Duplicate' },
                                                { icon: <FiShare2 className="w-4 h-4" />, label: 'Share' },
                                                { icon: <FiBarChart className="w-4 h-4" />, label: 'Analytics' },
                                                { icon: <FiTrash2 className="w-4 h-4" />, label: 'Delete', danger: true }
                                            ].map((item) => (
                                                <button
                                                    key={item.label}
                                                    className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}`}
                                                >
                                                    {item.icon}
                                                    {item.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="text-lg font-bold text-gray-900">${event.price}</div>
                                <div className="text-xs text-gray-600">Ticket Price</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="text-lg font-bold text-gray-900">{event.attendees}/{event.capacity}</div>
                                <div className="text-xs text-gray-600">Registered</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="text-lg font-bold text-emerald-600">${event.revenue.toLocaleString()}</div>
                                <div className="text-xs text-gray-600">Revenue</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="text-lg font-bold text-blue-600">{conversionRate}%</div>
                                <div className="text-xs text-gray-600">Conversion</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {event.tags.map((tag) => (
                                    <span key={tag} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${fillPercentage}%` }}
                                            transition={{ delay: index * 0.2, duration: 1 }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500">{Math.round(fillPercentage)}%</span>
                                </div>

                                {event.rating > 0 && (
                                    <div className="flex items-center gap-1">
                                        <FiStar className="w-4 h-4 text-amber-500 fill-current" />
                                        <span className="text-sm font-semibold text-gray-700">{event.rating}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Grid view (default)
    return (
        <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
        >
            <div className="relative mb-4">
                <div style={{ width: '100%', height: 200, position: 'relative' }}>
                    <Image
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover rounded-xl"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className={`absolute top-3 left-3 ${statusConfig.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                </div>
                <div className="absolute top-3 right-3">
                    <motion.button
                        className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-xl transition-colors shadow-sm"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiMoreHorizontal className="w-4 h-4 text-gray-600" />
                    </motion.button>
                </div>
            </div>

            <div className="mb-4">
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {event.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{event.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FiUsers className="w-4 h-4" />
                        <span>{event.attendees}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-emerald-600">${event.revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Revenue</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-blue-600">{conversionRate}%</div>
                    <div className="text-xs text-gray-600">Conversion</div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-orange-600">${event.price}</span>
                <div className="flex items-center gap-2">
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
        </motion.div>
    );
};

export default function EventsManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [sortBy, setSortBy] = useState('date');

    const filterOptions = [
        { value: 'all', label: 'All Events', count: mockEvents.length },
        { value: 'published', label: 'Published', count: mockEvents.filter(e => e.status === 'published').length },
        { value: 'draft', label: 'Drafts', count: mockEvents.filter(e => e.status === 'draft').length },
        { value: 'paused', label: 'Paused', count: mockEvents.filter(e => e.status === 'paused').length }
    ];

    const filteredEvents = mockEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || event.status === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    const totalRevenue = mockEvents.reduce((sum, event) => sum + event.revenue, 0);
    const totalAttendees = mockEvents.reduce((sum, event) => sum + event.attendees, 0);

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
                            <HiOutlineCalendarDays className="w-12 h-12" />
                            My Events
                        </h1>
                        <p className="text-orange-100 text-lg mb-4">
                            Manage your events • {mockEvents.length} total events • ${totalRevenue.toLocaleString()} revenue
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <FiUsers className="w-5 h-5" />
                                <span className="font-semibold">{totalAttendees.toLocaleString()} attendees</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <FiStar className="w-5 h-5" />
                                <span className="font-semibold">4.8 avg rating</span>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all shadow-lg flex items-center gap-3"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiPlus className="w-6 h-6" />
                        Create New Event
                    </motion.button>
                </div>
            </motion.div>

            {/* Controls Section */}
            <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            {filterOptions.map((filter) => (
                                <motion.button
                                    key={filter.value}
                                    onClick={() => setSelectedFilter(filter.value)}
                                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${selectedFilter === filter.value
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {filter.label} ({filter.count})
                                </motion.button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                            <motion.button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="bg-gray-600 rounded-sm"></div>
                                    ))}
                                </div>
                            </motion.button>
                            <motion.button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-4 h-4 flex flex-col gap-0.5">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="bg-gray-600 h-0.5 rounded-sm"></div>
                                    ))}
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Events Grid/List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {filteredEvents.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-gray-400 text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                        <motion.button
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Create Your First Event
                        </motion.button>
                    </div>
                ) : (
                    <div className={`${viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'space-y-6'
                        }`}>
                        {filteredEvents.map((event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                index={index}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}