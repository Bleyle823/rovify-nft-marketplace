/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiMapPin, FiGlobe, FiMail, FiPhone, FiCalendar, FiUsers,
    FiStar, FiEdit3, FiSettings, FiShare2, FiExternalLink,
    FiAward, FiTrendingUp, FiEye, FiHeart, FiMessageSquare,
    FiClock, FiDollarSign, FiTarget, FiBarChart, FiPlus,
    FiInstagram, FiTwitter, FiLinkedin, FiFacebook, FiCheck
} from 'react-icons/fi';
import { IoSparkles, IoTrendingUp, IoFlash } from "react-icons/io5";
import { HiOutlineSparkles, HiOutlineUser, HiOutlineFire } from "react-icons/hi2";
import { BsTicketPerforated, BsLightningCharge } from "react-icons/bs";

// Mock organizer profile data
const mockOrganizerProfile = {
    id: 'org1',
    name: 'Joe Rover',
    username: 'joe_rover',
    title: 'Senior Event Organizer',
    company: 'Rovify Events',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=400&fit=crop',
    bio: 'Passionate event organizer with 8+ years of experience creating memorable experiences that bring people together. Specialized in tech conferences, music festivals, and corporate events.',
    location: 'San Francisco, CA',
    website: 'https://sarahevents.com',
    email: 'sarah@rovify.io',
    phone: '+1 (555) 123-4567',
    joinDate: '2020-03-15',
    verified: true,
    level: 'Pro',
    points: 4720,
    badges: [
        { id: '1', name: 'Super Host', icon: '🏆', description: 'Hosted 50+ successful events' },
        { id: '2', name: 'Tech Expert', icon: '💻', description: 'Technology event specialist' },
        { id: '3', name: 'Customer Favorite', icon: '❤️', description: '4.9+ average rating' },
        { id: '4', name: 'Trendsetter', icon: '🔥', description: 'Most innovative events 2024' }
    ],
    socialMedia: {
        twitter: 'https://twitter.com/sarahevents',
        linkedin: 'https://linkedin.com/in/sarahchen',
        instagram: 'https://instagram.com/sarahevents',
        facebook: 'https://facebook.com/sarahevents'
    },
    stats: {
        totalEvents: 87,
        totalAttendees: 25847,
        averageRating: 4.9,
        totalRevenue: 1247500,
        repeatCustomers: 68,
        completionRate: 98.5
    },
    specialties: ['Technology Conferences', 'Music Festivals', 'Corporate Events', 'Networking Meetups'],
    languages: ['English', 'Mandarin', 'Spanish'],
    certifications: [
        'Certified Meeting Professional (CMP)',
        'Digital Event Strategist',
        'Sustainable Event Management'
    ]
};

const mockFeaturedEvents = [
    {
        id: 'event1',
        title: 'AI & Machine Learning Summit 2025',
        date: '2025-07-15',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        attendees: 847,
        rating: 4.9,
        status: 'upcoming',
        category: 'Technology'
    },
    {
        id: 'event2',
        title: 'Electronic Music Festival',
        date: '2025-07-28',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
        attendees: 1247,
        rating: 4.8,
        status: 'upcoming',
        category: 'Music'
    },
    {
        id: 'event3',
        title: 'Tech Innovation Conference 2024',
        date: '2024-11-15',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
        attendees: 1856,
        rating: 4.9,
        status: 'completed',
        category: 'Technology'
    }
];

const mockReviews = [
    {
        id: '1',
        attendeeName: 'Michael Rodriguez',
        attendeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        eventTitle: 'Tech Innovation Conference 2024',
        rating: 5,
        comment: 'Absolutely incredible event! Sarah\'s attention to detail and passion for creating meaningful connections was evident throughout. The networking opportunities were outstanding.',
        date: '2024-11-20'
    },
    {
        id: '2',
        attendeeName: 'Jessica Wong',
        attendeeAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face',
        eventTitle: 'Startup Networking Mixer',
        rating: 5,
        comment: 'One of the best organized events I\'ve attended. Great venue, perfect timing, and Sarah made sure everyone felt welcome. Looking forward to the next one!',
        date: '2024-10-15'
    },
    {
        id: '3',
        attendeeName: 'David Kim',
        attendeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        eventTitle: 'Digital Marketing Summit',
        rating: 4,
        comment: 'Professional, well-executed event with great speakers. Minor issues with timing but overall excellent experience.',
        date: '2024-09-22'
    }
];

// Badge Component
const Badge = ({ badge }: { badge: typeof mockOrganizerProfile.badges[0] }) => (
    <motion.div
        className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        <div className="text-center">
            <div className="text-3xl mb-2">{badge.icon}</div>
            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                {badge.name}
            </h4>
            <p className="text-xs text-gray-600">{badge.description}</p>
        </div>
    </motion.div>
);

// Event Card Component
const EventCard = ({ event, index }: { event: typeof mockFeaturedEvents[0], index: number }) => (
    <motion.div
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4, scale: 1.02 }}
    >
        <div className="relative">
            <div style={{ width: '100%', height: 200, position: 'relative' }}>
                <Image
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${event.status === 'upcoming'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-emerald-100 text-emerald-700'
                }`}>
                {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
            </div>
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700">
                {event.category}
            </div>
        </div>

        <div className="p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                {event.title}
            </h3>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FiUsers className="w-4 h-4" />
                        <span>{event.attendees}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <FiStar className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">{event.rating}</span>
                </div>
            </div>
        </div>
    </motion.div>
);

// Review Component
const ReviewCard = ({ review, index }: { review: typeof mockReviews[0], index: number }) => (
    <motion.div
        className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -2 }}
    >
        <div className="flex items-start gap-4">
            <div style={{ width: 50, height: 50, position: 'relative' }}>
                <Image
                    src={review.attendeeAvatar}
                    alt={review.attendeeName}
                    className="w-full h-full object-cover rounded-full"
                    fill
                    sizes="50px"
                />
            </div>

            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h4 className="font-semibold text-gray-900">{review.attendeeName}</h4>
                        <p className="text-sm text-gray-600">{review.eventTitle}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <FiStar
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-current' : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <p className="text-gray-700 text-sm mb-3 line-clamp-3">{review.comment}</p>

                <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
            </div>
        </div>
    </motion.div>
);

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('events');
    const [isFollowing, setIsFollowing] = useState(false);

    const tabs = [
        { id: 'events', label: 'Events', count: mockFeaturedEvents.length },
        { id: 'reviews', label: 'Reviews', count: mockReviews.length },
        { id: 'about', label: 'About', count: null }
    ];

    return (
        <div className="space-y-8">
            {/* Cover & Profile Header */}
            <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Cover Image */}
                <div style={{ width: '100%', height: 300, position: 'relative' }}>
                    <Image
                        src={mockOrganizerProfile.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                        fill
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>

                {/* Profile Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div className="flex items-end gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div style={{ width: 120, height: 120, position: 'relative' }}>
                                    <Image
                                        src={mockOrganizerProfile.avatar}
                                        alt={mockOrganizerProfile.name}
                                        className="w-full h-full object-cover rounded-2xl border-4 border-white shadow-lg"
                                        fill
                                        sizes="120px"
                                    />
                                </div>
                                {mockOrganizerProfile.verified && (
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                        <FiCheck className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl lg:text-4xl font-bold">{mockOrganizerProfile.name}</h1>
                                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        {mockOrganizerProfile.level}
                                    </span>
                                </div>
                                <p className="text-xl text-white/90 mb-2">{mockOrganizerProfile.title}</p>
                                <p className="text-white/80 mb-3">{mockOrganizerProfile.company}</p>
                                <div className="flex items-center gap-4 text-sm text-white/70">
                                    <div className="flex items-center gap-1">
                                        <FiMapPin className="w-4 h-4" />
                                        <span>{mockOrganizerProfile.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FiCalendar className="w-4 h-4" />
                                        <span>Joined {new Date(mockOrganizerProfile.joinDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            <motion.button
                                onClick={() => setIsFollowing(!isFollowing)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${isFollowing
                                    ? 'bg-white/20 text-white border border-white/30'
                                    : 'bg-white text-orange-600 hover:bg-orange-50'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiHeart className={`w-5 h-5 ${isFollowing ? 'fill-current' : ''}`} />
                                {isFollowing ? 'Following' : 'Follow'}
                            </motion.button>

                            <motion.button
                                className="px-6 py-3 bg-white/20 text-white border border-white/30 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiMessageSquare className="w-5 h-5" />
                                Message
                            </motion.button>

                            <motion.button
                                className="p-3 bg-white/20 text-white border border-white/30 rounded-xl hover:bg-white/30 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiShare2 className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                    { label: 'Events', value: mockOrganizerProfile.stats.totalEvents, icon: <FiCalendar className="w-5 h-5" /> },
                    { label: 'Attendees', value: mockOrganizerProfile.stats.totalAttendees.toLocaleString(), icon: <FiUsers className="w-5 h-5" /> },
                    { label: 'Rating', value: mockOrganizerProfile.stats.averageRating, icon: <FiStar className="w-5 h-5" /> },
                    { label: 'Revenue', value: `$${(mockOrganizerProfile.stats.totalRevenue / 1000000).toFixed(1)}M`, icon: <FiDollarSign className="w-5 h-5" /> },
                    { label: 'Repeat Rate', value: `${mockOrganizerProfile.stats.repeatCustomers}%`, icon: <FiTrendingUp className="w-5 h-5" /> },
                    { label: 'Success Rate', value: `${mockOrganizerProfile.stats.completionRate}%`, icon: <FiTarget className="w-5 h-5" /> }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:shadow-lg transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -2, scale: 1.02 }}
                    >
                        <div className="flex justify-center mb-3">
                            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                {stat.icon}
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Badges */}
            <motion.div
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <HiOutlineSparkles className="w-6 h-6 text-orange-500" />
                    Achievements
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mockOrganizerProfile.badges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.0 + index * 0.1 }}
                        >
                            <Badge badge={badge} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Tabs & Content */}
            <motion.div
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
            >
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 px-8 pt-6">
                    <div className="flex items-center gap-1">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 font-semibold rounded-t-xl transition-all ${activeTab === tab.id
                                    ? 'bg-orange-500 text-white'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {tab.label}
                                {tab.count && (
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'events' && (
                            <motion.div
                                key="events"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {mockFeaturedEvents.map((event, index) => (
                                        <EventCard key={event.id} event={event} index={index} />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'reviews' && (
                            <motion.div
                                key="reviews"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="space-y-6">
                                    {mockReviews.map((review, index) => (
                                        <ReviewCard key={review.id} review={review} index={index} />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'about' && (
                            <motion.div
                                key="about"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                                            <p className="text-gray-700 leading-relaxed">{mockOrganizerProfile.bio}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3">Specialties</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {mockOrganizerProfile.specialties.map((specialty) => (
                                                    <span key={specialty} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                                        {specialty}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3">Languages</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {mockOrganizerProfile.languages.map((language) => (
                                                    <span key={language} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                        {language}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3">Contact</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-gray-700">
                                                    <FiGlobe className="w-5 h-5 text-orange-600" />
                                                    <a href={mockOrganizerProfile.website} className="hover:text-orange-600 transition-colors">
                                                        {mockOrganizerProfile.website}
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-700">
                                                    <FiMail className="w-5 h-5 text-orange-600" />
                                                    <span>{mockOrganizerProfile.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-700">
                                                    <FiPhone className="w-5 h-5 text-orange-600" />
                                                    <span>{mockOrganizerProfile.phone}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3">Certifications</h3>
                                            <div className="space-y-2">
                                                {mockOrganizerProfile.certifications.map((cert) => (
                                                    <div key={cert} className="flex items-center gap-2">
                                                        <FiAward className="w-4 h-4 text-amber-500" />
                                                        <span className="text-gray-700 text-sm">{cert}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3">Social Media</h3>
                                            <div className="flex items-center gap-3">
                                                {Object.entries(mockOrganizerProfile.socialMedia).map(([platform, url]) => (
                                                    <motion.a
                                                        key={platform}
                                                        href={url}
                                                        className="p-3 bg-gray-100 hover:bg-orange-100 rounded-xl transition-colors"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        {platform === 'twitter' && <FiTwitter className="w-5 h-5 text-gray-600" />}
                                                        {platform === 'linkedin' && <FiLinkedin className="w-5 h-5 text-gray-600" />}
                                                        {platform === 'instagram' && <FiInstagram className="w-5 h-5 text-gray-600" />}
                                                        {platform === 'facebook' && <FiFacebook className="w-5 h-5 text-gray-600" />}
                                                    </motion.a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}