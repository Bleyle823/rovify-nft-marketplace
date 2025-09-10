/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiUsers, FiSearch, FiFilter, FiDownload, FiMail, FiPhone,
    FiMapPin, FiCalendar, FiClock, FiMoreHorizontal, FiEdit3,
    FiTrash2, FiEye, FiSend, FiUserPlus, FiGrid, FiList,
    FiStar, FiDollarSign, FiCheckCircle, FiXCircle, FiAlertCircle,
    FiRefreshCw, FiUpload, FiUserCheck, FiUserX, FiTrendingUp
} from 'react-icons/fi';
import { IoSparkles, IoTicket, IoMail } from "react-icons/io5";
import { HiOutlineSparkles, HiOutlineUsers, HiOutlineFire } from "react-icons/hi2";
import { BsTicketPerforated } from "react-icons/bs";

// Mock attendees data
const mockAttendees = [
    {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        event: 'AI & Machine Learning Summit',
        eventId: 'event1',
        ticketType: 'VIP',
        purchaseDate: '2025-06-15',
        amount: 299,
        status: 'confirmed',
        checkedIn: true,
        location: 'San Francisco, CA',
        company: 'TechCorp Inc.',
        dietary: 'Vegetarian',
        isVip: true,
        rating: 5,
        notes: 'Speaker at the event'
    },
    {
        id: '2',
        name: 'Marcus Chen',
        email: 'marcus.chen@startup.co',
        phone: '+1 (555) 987-6543',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        event: 'Electronic Music Festival',
        eventId: 'event2',
        ticketType: 'General',
        purchaseDate: '2025-06-10',
        amount: 129,
        status: 'confirmed',
        checkedIn: false,
        location: 'Los Angeles, CA',
        company: 'StartupCo',
        dietary: 'None',
        isVip: false,
        rating: 4,
        notes: ''
    },
    {
        id: '3',
        name: 'Emma Wilson',
        email: 'emma.wilson@agency.com',
        phone: '+1 (555) 456-7890',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        event: 'Digital Marketing Masterclass',
        eventId: 'event4',
        ticketType: 'Premium',
        purchaseDate: '2025-06-08',
        amount: 197,
        status: 'pending',
        checkedIn: false,
        location: 'New York, NY',
        company: 'Creative Agency',
        dietary: 'Gluten-free',
        isVip: false,
        rating: 0,
        notes: 'First-time attendee'
    },
    {
        id: '4',
        name: 'David Rodriguez',
        email: 'david.r@enterprise.com',
        phone: '+1 (555) 321-0987',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        event: 'AI & Machine Learning Summit',
        eventId: 'event1',
        ticketType: 'General',
        purchaseDate: '2025-06-12',
        amount: 199,
        status: 'confirmed',
        checkedIn: true,
        location: 'Austin, TX',
        company: 'Enterprise Corp',
        dietary: 'None',
        isVip: false,
        rating: 4,
        notes: 'Group booking'
    },
    {
        id: '5',
        name: 'Lisa Park',
        email: 'lisa.park@consultant.com',
        phone: '+1 (555) 654-3210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
        event: 'Startup Pitch Competition',
        eventId: 'event3',
        ticketType: 'Investor',
        purchaseDate: '2025-06-05',
        amount: 89,
        status: 'cancelled',
        checkedIn: false,
        location: 'Seattle, WA',
        company: 'Independent',
        dietary: 'Vegan',
        isVip: true,
        rating: 0,
        notes: 'Cancelled due to schedule conflict'
    }
];

const mockEvents = [
    { id: 'event1', name: 'AI & Machine Learning Summit', attendees: 847 },
    { id: 'event2', name: 'Electronic Music Festival', attendees: 1247 },
    { id: 'event3', name: 'Startup Pitch Competition', attendees: 156 },
    { id: 'event4', name: 'Digital Marketing Masterclass', attendees: 543 }
];

const statusConfig = {
    confirmed: {
        label: 'Confirmed',
        color: 'bg-emerald-100 text-emerald-700',
        icon: <FiCheckCircle className="w-3 h-3" />
    },
    pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <FiAlertCircle className="w-3 h-3" />
    },
    cancelled: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-700',
        icon: <FiXCircle className="w-3 h-3" />
    }
};

const ticketTypeConfig = {
    'VIP': { color: 'bg-purple-100 text-purple-700', icon: '👑' },
    'Premium': { color: 'bg-blue-100 text-blue-700', icon: '⭐' },
    'General': { color: 'bg-gray-100 text-gray-700', icon: '🎫' },
    'Investor': { color: 'bg-emerald-100 text-emerald-700', icon: '💼' }
};

interface AttendeeCardProps {
    attendee: typeof mockAttendees[0];
    index: number;
    viewMode: 'grid' | 'list';
}

const AttendeeCard = ({ attendee, index, viewMode }: AttendeeCardProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const statusStyle = statusConfig[attendee.status as keyof typeof statusConfig];
    const ticketStyle = ticketTypeConfig[attendee.ticketType as keyof typeof ticketTypeConfig];

    if (viewMode === 'list') {
        return (
            <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
            >
                <div className="flex items-center gap-6">
                    <div className="relative flex-shrink-0">
                        <div style={{ width: 60, height: 60, position: 'relative' }}>
                            <Image
                                src={attendee.avatar}
                                alt={attendee.name}
                                className="w-full h-full object-cover rounded-xl"
                                fill
                                sizes="60px"
                            />
                        </div>
                        {attendee.isVip && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">👑</span>
                            </div>
                        )}
                        {attendee.checkedIn && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <FiCheckCircle className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">
                                    {attendee.name}
                                </h3>
                                <p className="text-sm text-gray-600">{attendee.company}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`${statusStyle.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                                    {statusStyle.icon}
                                    {statusStyle.label}
                                </div>
                                <div className={`${ticketStyle.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                                    <span>{ticketStyle.icon}</span>
                                    {attendee.ticketType}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiMail className="w-4 h-4" />
                                <span className="truncate">{attendee.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiPhone className="w-4 h-4" />
                                <span>{attendee.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiMapPin className="w-4 h-4" />
                                <span>{attendee.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiCalendar className="w-4 h-4" />
                                <span>{new Date(attendee.purchaseDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-bold text-orange-600">${attendee.amount}</span>
                                <span className="text-sm text-gray-600">Event: {attendee.event}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                {attendee.rating > 0 && (
                                    <div className="flex items-center gap-1">
                                        <FiStar className="w-4 h-4 text-amber-500 fill-current" />
                                        <span className="text-sm font-semibold text-gray-700">{attendee.rating}</span>
                                    </div>
                                )}

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
                                                    { icon: <FiEye className="w-4 h-4" />, label: 'View Details' },
                                                    { icon: <FiEdit3 className="w-4 h-4" />, label: 'Edit Attendee' },
                                                    { icon: <FiMail className="w-4 h-4" />, label: 'Send Email' },
                                                    { icon: <FiUserCheck className="w-4 h-4" />, label: 'Check In' },
                                                    { icon: <FiTrash2 className="w-4 h-4" />, label: 'Remove', danger: true }
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
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Grid view
    return (
        <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
        >
            <div className="text-center mb-4">
                <div className="relative mx-auto mb-4">
                    <div style={{ width: 80, height: 80, position: 'relative', margin: '0 auto' }}>
                        <Image
                            src={attendee.avatar}
                            alt={attendee.name}
                            className="w-full h-full object-cover rounded-xl"
                            fill
                            sizes="80px"
                        />
                    </div>
                    {attendee.isVip && (
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">👑</span>
                        </div>
                    )}
                    {attendee.checkedIn && (
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <FiCheckCircle className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                    {attendee.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{attendee.company}</p>

                <div className="flex justify-center gap-2 mb-4">
                    <div className={`${statusStyle.color} px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                        {statusStyle.icon}
                        {statusStyle.label}
                    </div>
                    <div className={`${ticketStyle.color} px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                        <span>{ticketStyle.icon}</span>
                        {attendee.ticketType}
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMail className="w-4 h-4" />
                    <span className="truncate">{attendee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMapPin className="w-4 h-4" />
                    <span>{attendee.location}</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-orange-600">${attendee.amount}</span>
                {attendee.rating > 0 && (
                    <div className="flex items-center gap-1">
                        <FiStar className="w-4 h-4 text-amber-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-700">{attendee.rating}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default function AttendeesManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [sortBy, setSortBy] = useState('name');

    const filteredAttendees = mockAttendees.filter(attendee => {
        const matchesSearch = attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attendee.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEvent = selectedEvent === 'all' || attendee.eventId === selectedEvent;
        const matchesStatus = selectedStatus === 'all' || attendee.status === selectedStatus;
        return matchesSearch && matchesEvent && matchesStatus;
    });

    const totalAttendees = mockAttendees.length;
    const checkedInCount = mockAttendees.filter(a => a.checkedIn).length;
    const vipCount = mockAttendees.filter(a => a.isVip).length;
    const totalRevenue = mockAttendees.reduce((sum, attendee) => sum + attendee.amount, 0);

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
                            <HiOutlineUsers className="w-12 h-12" />
                            Attendees
                        </h1>
                        <p className="text-orange-100 text-lg mb-4">
                            Manage your attendees • {totalAttendees} total • {checkedInCount} checked in
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <IoSparkles className="w-5 h-5" />
                                <span className="font-semibold">{vipCount} VIP attendees</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <FiDollarSign className="w-5 h-5" />
                                <span className="font-semibold">${totalRevenue.toLocaleString()} revenue</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiUserPlus className="w-5 h-5" />
                            Add Attendee
                        </motion.button>

                        <motion.button
                            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiDownload className="w-5 h-5" />
                            Export
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Attendees', value: totalAttendees, icon: <FiUsers className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
                    { label: 'Checked In', value: checkedInCount, icon: <FiUserCheck className="w-6 h-6" />, color: 'from-emerald-500 to-emerald-600' },
                    { label: 'VIP Attendees', value: vipCount, icon: <IoSparkles className="w-6 h-6" />, color: 'from-purple-500 to-purple-600' },
                    { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: <FiDollarSign className="w-6 h-6" />, color: 'from-orange-500 to-orange-600' }
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

            {/* Controls Section */}
            <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search attendees..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            className="px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="all">All Events</option>
                            {mockEvents.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.name} ({event.attendees})
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="all">All Status</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                            <motion.button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiGrid className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiList className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Attendees Grid/List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                {filteredAttendees.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-gray-400 text-6xl mb-4">👥</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No attendees found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                        <motion.button
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Add Your First Attendee
                        </motion.button>
                    </div>
                ) : (
                    <div className={`${viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'space-y-6'
                        }`}>
                        {filteredAttendees.map((attendee, index) => (
                            <AttendeeCard
                                key={attendee.id}
                                attendee={attendee}
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