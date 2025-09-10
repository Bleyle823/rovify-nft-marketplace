/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiSearch, FiMessageSquare, FiUserPlus, FiMoreVertical,
    FiCalendar, FiX, FiPhone, FiVideo, FiUserCheck,
    FiMapPin, FiZap, FiFilter
} from 'react-icons/fi';
import { IoTicket } from 'react-icons/io5';
import { BsCameraVideoFill } from 'react-icons/bs';

// Types
interface Activity {
    type: 'event' | 'streaming' | 'ticket' | 'moment';
    content: string;
    timeAgo: string;
    emoji?: string;
}

interface Friend {
    id: string;
    name: string;
    username: string;
    image: string;
    online: boolean;
    lastSeen?: string;
    verified: boolean;
    location?: string;
    mutualFriends: number;
    activity?: Activity;
    isClose?: boolean;
}

// Sample data with usernames for modern feel
const FRIENDS_DATA: Friend[] = [
    {
        id: 'f1',
        name: 'Alex Morgan',
        username: '@alexmorgan',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
        online: true,
        verified: true,
        location: 'New York',
        mutualFriends: 15,
        isClose: true,
        activity: {
            type: 'event',
            content: 'At Summer Festival 2025',
            timeAgo: '15m',
            emoji: '🎵'
        }
    },
    {
        id: 'f2',
        name: 'Jamie Chen',
        username: '@jamiechen',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
        online: true,
        verified: false,
        location: 'San Francisco',
        mutualFriends: 8,
        activity: {
            type: 'streaming',
            content: 'Live from Crypto Meetup',
            timeAgo: '2m'
        }
    },
    {
        id: 'f3',
        name: 'Samira Khan',
        username: '@samira_k',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
        online: false,
        lastSeen: '3h ago',
        verified: true,
        location: 'Austin',
        mutualFriends: 3,
        isClose: true,
        activity: {
            type: 'ticket',
            content: 'Got tickets for Tech Summit',
            timeAgo: '1h'
        }
    },
    {
        id: 'f4',
        name: 'Mike Johnson',
        username: '@mikej',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
        online: false,
        lastSeen: '1d ago',
        verified: false,
        location: 'Miami',
        mutualFriends: 6,
    },
    {
        id: 'f5',
        name: 'Leila Patel',
        username: '@leilapatel',
        image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=120&h=120&fit=crop&crop=face',
        online: true,
        verified: true,
        location: 'Chicago',
        mutualFriends: 12,
        activity: {
            type: 'moment',
            content: 'Shared wellness retreat moments',
            timeAgo: '45m',
            emoji: '✨'
        }
    },
    {
        id: 'f6',
        name: 'Carlos Rodriguez',
        username: '@carlosr',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
        online: true,
        verified: false,
        location: 'Los Angeles',
        mutualFriends: 4,
        activity: {
            type: 'event',
            content: 'RSVP\'d to VR Gaming Expo',
            timeAgo: '30m',
            emoji: '🎮'
        }
    },
];

const SUGGESTED_FRIENDS: Friend[] = [
    {
        id: 's1',
        name: 'Taylor Swift',
        username: '@taylorswift',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
        online: true,
        verified: true,
        location: 'Nashville',
        mutualFriends: 23,
    },
    {
        id: 's2',
        name: 'Jordan Lee',
        username: '@jordanlee',
        image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&h=120&fit=crop&crop=face',
        online: false,
        lastSeen: '6h ago',
        verified: false,
        location: 'Atlanta',
        mutualFriends: 8,
    },
];

const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
        case 'event':
            return <FiCalendar className="w-3 h-3" />;
        case 'streaming':
            return <BsCameraVideoFill className="w-3 h-3" />;
        case 'ticket':
            return <IoTicket className="w-3 h-3" />;
        default:
            return <FiZap className="w-3 h-3" />;
    }
};

const getActivityColor = (type: Activity['type']) => {
    switch (type) {
        case 'event':
            return 'text-[#3329CF]';
        case 'streaming':
            return 'text-red-500';
        case 'ticket':
            return 'text-amber-500';
        default:
            return 'text-[#C281FF]';
    }
};

export default function EpicFriendsView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'online' | 'close'>('all');
    const [filteredFriends, setFilteredFriends] = useState<Friend[]>(FRIENDS_DATA);
    const [showSuggested, setShowSuggested] = useState(true);
    const [contextMenu, setContextMenu] = useState<{ friendId: string; x: number; y: number } | null>(null);

    // Filter friends
    useEffect(() => {
        let results = [...FRIENDS_DATA];

        switch (activeTab) {
            case 'online':
                results = results.filter(friend => friend.online);
                break;
            case 'close':
                results = results.filter(friend => friend.isClose);
                break;
        }

        if (searchQuery) {
            results = results.filter(friend =>
                friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                friend.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredFriends(results);
    }, [activeTab, searchQuery]);

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        if (contextMenu) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [contextMenu]);

    const handleContextMenu = (e: React.MouseEvent, friendId: string) => {
        e.preventDefault();
        setContextMenu({
            friendId,
            x: e.clientX,
            y: e.clientY
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Friends</h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {filteredFriends.filter(f => f.online).length} online • {filteredFriends.length} total
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <FiFilter className="w-5 h-5 text-gray-600" />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-[#FF5900] text-white font-medium rounded-full hover:bg-[#E64A19] transition-colors"
                            >
                                Add Friends
                            </motion.button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-4">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search friends..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-[#FF5900]/20 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <FiX className="w-3 h-3 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-gray-100 rounded-full p-1">
                        {[
                            { id: 'all' as const, label: 'All', count: FRIENDS_DATA.length },
                            { id: 'online' as const, label: 'Online', count: FRIENDS_DATA.filter(f => f.online).length },
                            { id: 'close' as const, label: 'Close Friends', count: FRIENDS_DATA.filter(f => f.isClose).length }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-4 py-2 text-sm font-medium rounded-full transition-all ${activeTab === tab.id
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab.label}
                                <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-4 pb-6">
                {/* Suggested Friends */}
                {showSuggested && activeTab === 'all' && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">People you may know</h2>
                            <button
                                onClick={() => setShowSuggested(false)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Hide
                            </button>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1">
                            {SUGGESTED_FRIENDS.map((friend) => (
                                <SuggestedFriendCard key={friend.id} friend={friend} />
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Friends List */}
                <div className="space-y-1">
                    {filteredFriends.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <FiUserPlus className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No friends found</h3>
                            <p className="text-gray-500 text-sm">
                                {searchQuery ? `No results for "${searchQuery}"` : 'No friends in this category'}
                            </p>
                        </div>
                    ) : (
                        filteredFriends.map((friend, index) => (
                            <motion.div
                                key={friend.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <FriendRow
                                    friend={friend}
                                    onContextMenu={(e) => handleContextMenu(e, friend.id)}
                                />
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Context Menu */}
            <AnimatePresence>
                {contextMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-48"
                        style={{
                            left: contextMenu.x,
                            top: contextMenu.y,
                            transform: 'translate(-50%, -10px)'
                        }}
                    >
                        <ContextMenuItem icon={FiMessageSquare} label="Message" />
                        <ContextMenuItem icon={FiPhone} label="Call" />
                        <ContextMenuItem icon={FiVideo} label="Video Call" />
                        <ContextMenuItem icon={FiCalendar} label="Invite to Event" />
                        <div className="h-px bg-gray-100 my-1" />
                        <ContextMenuItem icon={FiUserCheck} label="Close Friend" />
                        <ContextMenuItem icon={FiMoreVertical} label="More Options" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Production-grade Friend Row Component
function FriendRow({ friend, onContextMenu }: {
    friend: Friend;
    onContextMenu: (e: React.MouseEvent) => void;
}) {
    return (
        <motion.div
            className="group flex items-center px-3 py-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            whileTap={{ scale: 0.98 }}
            onContextMenu={onContextMenu}
        >
            {/* Avatar with status */}
            <div className="relative mr-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <Image
                        src={friend.image}
                        alt={friend.name}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                    />
                </div>
                {friend.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#18E299] border-2 border-white rounded-full" />
                )}
                {friend.isClose && (
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#FF5900] rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-gray-900 truncate">{friend.name}</span>
                    {friend.verified && (
                        <div className="w-4 h-4 bg-[#3329CF] rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="truncate">{friend.username}</span>
                    {friend.location && (
                        <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <FiMapPin className="w-3 h-3" />
                                <span>{friend.location}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Activity */}
                {friend.activity && (
                    <div className="flex items-center gap-1.5 mt-1">
                        <div className={`${getActivityColor(friend.activity.type)}`}>
                            {getActivityIcon(friend.activity.type)}
                        </div>
                        <span className="text-xs text-gray-600 truncate">
                            {friend.activity.content}
                        </span>
                        {friend.activity.emoji && (
                            <span className="text-xs">{friend.activity.emoji}</span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">{friend.activity.timeAgo}</span>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-3">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-400 hover:text-[#FF5900] hover:bg-[#FF5900]/5 rounded-full transition-colors"
                >
                    <FiMessageSquare className="w-4 h-4" />
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <FiMoreVertical className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
}

// Suggested Friend Card
function SuggestedFriendCard({ friend }: { friend: Friend }) {
    return (
        <motion.div
            className="flex-shrink-0 w-40 bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="text-center">
                <div className="relative mx-auto mb-3 w-16 h-16">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                        <Image
                            src={friend.image}
                            alt={friend.name}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {friend.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#18E299] border-2 border-white rounded-full" />
                    )}
                </div>

                <div className="mb-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{friend.name}</h3>
                        {friend.verified && (
                            <div className="w-3 h-3 bg-[#3329CF] rounded-full flex items-center justify-center flex-shrink-0">
                                <div className="w-1 h-1 bg-white rounded-full" />
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">{friend.mutualFriends} mutual friends</p>
                </div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-1.5 bg-[#FF5900] text-white text-xs font-medium rounded-lg hover:bg-[#E64A19] transition-colors"
                >
                    Add Friend
                </motion.button>
            </div>
        </motion.div>
    );
}

// Context Menu Item
function ContextMenuItem({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
    return (
        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Icon className="w-4 h-4 text-gray-500" />
            {label}
        </button>
    );
}