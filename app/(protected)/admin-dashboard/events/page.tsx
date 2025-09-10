/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiCalendar, FiSearch, FiFilter, FiDownload, FiMoreHorizontal,
    FiPlus, FiEdit, FiTrash2, FiEye, FiMapPin, FiClock,
    FiUsers, FiDollarSign, FiStar, FiTrendingUp, FiActivity,
    FiTag, FiImage, FiExternalLink, FiCopy, FiShare2,
    FiAlertCircle, FiCheckCircle, FiXCircle, FiPause
} from 'react-icons/fi';
import React from 'react';
import Image from 'next/image';

interface Event {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    date: string;
    time: string;
    location: string;
    organiser: {
        name: string;
        avatar: string;
        email: string;
    };
    status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
    capacity: number;
    registered: number;
    price: number;
    revenue: number;
    rating: number;
    featured: boolean;
}

const mockEvents: Event[] = [
    {
        id: '1',
        title: 'Tech Summit 2025',
        description: 'Annual technology conference featuring the latest innovations in AI, blockchain, and web development.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
        category: 'Technology',
        date: '2025-07-15',
        time: '09:00',
        location: 'San Francisco Convention Center',
        organiser: {
            name: 'TechCorp Events',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
            email: 'events@techcorp.com'
        },
        status: 'published',
        capacity: 2000,
        registered: 1247,
        price: 299,
        revenue: 372853,
        rating: 4.8,
        featured: true
    },
    {
        id: '2',
        title: 'Neon Nights Festival',
        description: 'Electronic music festival featuring top DJs and immersive light shows.',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
        category: 'Music',
        date: '2025-08-20',
        time: '19:00',
        location: 'Golden Gate Park',
        organiser: {
            name: 'Night Events Co.',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b88e1f9d?w=40&h=40&fit=crop&crop=face',
            email: 'info@nightevents.com'
        },
        status: 'active',
        capacity: 5000,
        registered: 3421,
        price: 89,
        revenue: 304469,
        rating: 4.9,
        featured: false
    },
    {
        id: '3',
        title: 'Urban Art Exhibition',
        description: 'Contemporary art showcase featuring emerging artists from around the world.',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        category: 'Art',
        date: '2025-06-10',
        time: '14:00',
        location: 'Museum of Modern Art',
        organiser: {
            name: 'Art Collective SF',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
            email: 'curator@artcollective.com'
        },
        status: 'draft',
        capacity: 300,
        registered: 156,
        price: 45,
        revenue: 7020,
        rating: 4.7,
        featured: false
    }
];

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>(mockEvents);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Event['status']>('all');
    const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.organiser.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusColor = (status: Event['status']) => {
        switch (status) {
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'published': return 'bg-blue-100 text-blue-800';
            case 'active': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-purple-100 text-purple-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: Event['status']) => {
        switch (status) {
            case 'draft': return FiEdit;
            case 'published': return FiEye;
            case 'active': return FiCheckCircle;
            case 'completed': return FiCheckCircle;
            case 'cancelled': return FiXCircle;
            default: return FiAlertCircle;
        }
    };

    const StatCard = ({ title, value, icon, color, subtitle }: {
        title: string;
        value: string | number;
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
        color: string;
        subtitle?: string;
    }) => (
        <motion.div
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
                    {React.createElement(icon, { className: "w-6 h-6", style: { color } })}
                </div>
            </div>
        </motion.div>
    );

    const EventCard = ({ event, index }: { event: Event; index: number }) => (
        <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
        >
            {/* Event Image */}
            <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={index === 0}
            />
            <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Status Badge */}
            <div className="absolute top-3 left-3">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {React.createElement(getStatusIcon(event.status), { className: "w-3 h-3" })}
                    {event.status}
                </span>
            </div>

            {/* Featured Badge */}
            {event.featured && (
                <div className="absolute top-3 right-3">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                    </span>
                </div>
            )}

            {/* Price */}
            <div className="absolute bottom-3 right-3">
                <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-lg text-sm font-semibold">
                    ${event.price}
                </span>
            </div>

            {/* Event Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{event.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                    </div>
                </div>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiCalendar className="w-4 h-4 text-orange-500" />
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiMapPin className="w-4 h-4 text-orange-500" />
                        <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiUsers className="w-4 h-4 text-orange-500" />
                        <span>{event.registered}/{event.capacity} registered</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Registration Progress</span>
                        <span>{Math.round((event.registered / event.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Organiser & Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <Image
                            src={event.organiser.avatar}
                            alt={event.organiser.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-900">{event.organiser.name}</p>
                            <div className="flex items-center gap-1">
                                <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600">{event.rating}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setSelectedEvent(event);
                                setShowEventModal(true);
                            }}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiEye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <FiEdit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <FiMoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const EventModal = ({ event, isOpen, onClose }: { event: Event | null; isOpen: boolean; onClose: () => void }) => (
        <AnimatePresence>
            {isOpen && event && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <FiMoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Event Image & Basic Info */}
                                <div>
                                    <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                            <div className="flex items-center gap-4 text-white text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                                    {event.status}
                                                </span>
                                                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                                    {event.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                            <p className="text-gray-600">{event.description}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Event Details</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FiCalendar className="w-4 h-4 text-orange-500" />
                                                    <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FiMapPin className="w-4 h-4 text-orange-500" />
                                                    <span>{event.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FiDollarSign className="w-4 h-4 text-orange-500" />
                                                    <span>${event.price} per ticket</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats & Actions */}
                                <div>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <p className="text-2xl font-bold text-gray-900">{event.registered}</p>
                                            <p className="text-sm text-gray-600">Registered</p>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <p className="text-2xl font-bold text-gray-900">{event.capacity}</p>
                                            <p className="text-sm text-gray-600">Capacity</p>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <p className="text-2xl font-bold text-green-600">${event.revenue.toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">Revenue</p>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-center gap-1">
                                                <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                                                <p className="text-2xl font-bold text-gray-900">{event.rating}</p>
                                            </div>
                                            <p className="text-sm text-gray-600">Rating</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Organiser</h4>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Image
                                                    src={event.organiser.avatar}
                                                    alt={event.organiser.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 rounded-xl object-cover"
                                                />
                                                <div>
                                                    <h5 className="font-medium text-gray-900">{event.organiser.name}</h5>
                                                    <p className="text-sm text-gray-600">{event.organiser.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                                                    Edit Event
                                                </button>
                                                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                                                    View Analytics
                                                </button>
                                                <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-lg font-medium transition-colors">
                                                    Message Organiser
                                                </button>
                                                <button className="bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded-lg font-medium transition-colors">
                                                    Promote Event
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
                    <p className="text-gray-600 mt-1">Oversee and manage all events on your platform</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                        <FiDownload className="w-4 h-4" />
                        Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                        <FiPlus className="w-4 h-4" />
                        Create Event
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Total Events"
                    value="187"
                    icon={FiCalendar}
                    color="#FF5722"
                    subtitle="23 this month"
                />
                <StatCard
                    title="Active Events"
                    value="94"
                    icon={FiActivity}
                    color="#4CAF50"
                    subtitle="Currently live"
                />
                <StatCard
                    title="Total Revenue"
                    value="$684K"
                    icon={FiDollarSign}
                    color="#2196F3"
                    subtitle="This quarter"
                />
                <StatCard
                    title="Avg. Rating"
                    value="4.7"
                    icon={FiStar}
                    color="#FF9800"
                    subtitle="User feedback"
                />
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search events by title or organiser..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as Event['status'] | 'all')}
                            className="px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="all">All Categories</option>
                            <option value="Technology">Technology</option>
                            <option value="Music">Music</option>
                            <option value="Art">Art</option>
                            <option value="Business">Business</option>
                            <option value="Sports">Sports</option>
                        </select>

                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'
                                    }`}
                            >
                                <FiImage className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'
                                    }`}
                            >
                                <FiFilter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                ))}
            </div>

            {/* Event Detail Modal */}
            <EventModal
                event={selectedEvent}
                isOpen={showEventModal}
                onClose={() => {
                    setShowEventModal(false);
                    setSelectedEvent(null);
                }}
            />
        </div>
    );
}