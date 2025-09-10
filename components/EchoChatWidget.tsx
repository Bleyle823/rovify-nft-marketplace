/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiMessageCircle, FiSearch, FiX, FiMaximize2, FiMinimize2,
    FiPhone, FiVideo, FiInfo, FiSend, FiPaperclip, FiSmile,
    FiUsers, FiHeart, FiStar, FiMoreHorizontal, FiEdit3,
    FiExternalLink, FiMusic, FiCalendar, FiMapPin
} from 'react-icons/fi';
import { BsStars, BsMusicNote, BsTicket } from 'react-icons/bs';

// Types
interface Conversation {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
    online: boolean;
    typing: boolean;
    isGroup?: boolean;
    memberCount?: number;
    eventRelated?: boolean;
    eventType?: string;
}

interface Message {
    id: number;
    senderId: number | string;
    text: string;
    timestamp: string;
    sent: boolean;
}

// Mock data for conversations with event context
const CONVERSATIONS: Conversation[] = [
    {
        id: 1,
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        lastMessage: 'Hey! Are you coming to the Summer Festival?',
        timestamp: '2m',
        unread: true,
        online: true,
        typing: false,
        eventRelated: true,
        eventType: 'music'
    },
    {
        id: 2,
        name: 'Joe Rover',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
        lastMessage: 'Thanks for the event invite! 🎉',
        timestamp: '15m',
        unread: true,
        online: true,
        typing: false,
        eventRelated: true,
        eventType: 'tech'
    },
    {
        id: 3,
        name: 'Marcus Thompson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        lastMessage: 'See you at the tech summit',
        timestamp: '1h',
        unread: false,
        online: true,
        typing: false,
        eventRelated: true,
        eventType: 'tech'
    },
    {
        id: 4,
        name: 'Jordan Kim',
        avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop&crop=face',
        lastMessage: 'Perfect! Looking forward to it',
        timestamp: '3h',
        unread: false,
        online: false,
        typing: false
    }
];

const MESSAGES: Message[] = [
    {
        id: 1,
        senderId: 1,
        text: 'Hey! Are you coming to the Summer Festival?',
        timestamp: '2:34 PM',
        sent: false
    },
    {
        id: 2,
        senderId: 'me',
        text: 'Absolutely! Already got my tickets 🎵',
        timestamp: '2:35 PM',
        sent: true
    },
    {
        id: 3,
        senderId: 1,
        text: 'Awesome! Which artists are you most excited to see?',
        timestamp: '2:36 PM',
        sent: false
    },
    {
        id: 4,
        senderId: 'me',
        text: 'Definitely the headliner on Saturday. What about you?',
        timestamp: '2:37 PM',
        sent: true
    }
];

// Rovify-style Event Tooltip
const RovifyEventTooltip = ({ user, children }: { user: Conversation; children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-[100]"
                    >
                        {/* Rovify-style tooltip */}
                        <div className="relative bg-white/95 backdrop-blur-2xl border border-orange-200/50 rounded-2xl px-4 py-3 shadow-2xl shadow-orange-500/10">
                            {/* Tooltip tail with Rovify colors */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white/95"></div>
                            </div>

                            <div className="flex items-center gap-3 min-w-[140px]">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200/50 shadow-lg">
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {user.online && (
                                        <motion.div
                                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-md"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    )}
                                    {user.eventRelated && (
                                        <motion.div
                                            className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-r from-[#FF5722] to-[#E64A19] rounded-full flex items-center justify-center shadow-lg"
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        >
                                            {user.eventType === 'music' ? (
                                                <BsMusicNote className="w-2.5 h-2.5 text-white" />
                                            ) : user.eventType === 'tech' ? (
                                                <BsStars className="w-2.5 h-2.5 text-white" />
                                            ) : (
                                                <BsTicket className="w-2.5 h-2.5 text-white" />
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-gray-900 text-sm font-semibold leading-tight">{user.name}</p>
                                    <div className="flex items-center gap-1">
                                        {user.online ? (
                                            <>
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                <span className="text-green-600 text-xs font-medium">Active now</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-500 text-xs">{user.timestamp} ago</span>
                                        )}
                                    </div>
                                    {user.eventRelated && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <FiCalendar className="w-3 h-3 text-orange-500" />
                                            <span className="text-orange-600 text-xs font-medium">Event chat</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Rovify-style Floating Contact Cards
const RovifyContactCards = ({ conversations, unreadCount }: { conversations: Conversation[]; unreadCount: number }) => {
    const [showCards, setShowCards] = useState(false);

    return (
        <div className="relative">
            <motion.div
                onHoverStart={() => setShowCards(true)}
                onHoverEnd={() => setShowCards(false)}
                className="relative"
            >
                {/* Rovify-styled main widget */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/90 backdrop-blur-2xl border border-orange-200/50 rounded-3xl px-6 py-4 shadow-2xl shadow-orange-500/20 flex items-center gap-4 cursor-pointer overflow-hidden"
                >
                    {/* Rovify gradient background */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-orange-50/50 via-white/30 to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{
                            background: [
                                "linear-gradient(90deg, rgba(255,247,237,0.5) 0%, rgba(255,255,255,0.3) 50%, rgba(254,242,242,0.5) 100%)",
                                "linear-gradient(90deg, rgba(254,242,242,0.5) 0%, rgba(255,255,255,0.3) 50%, rgba(255,247,237,0.5) 100%)"
                            ]
                        }}
                        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                    />

                    {/* Left side - Echo branding */}
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="relative">
                            <motion.div
                                className="w-10 h-10 bg-gradient-to-r from-[#FF5722] to-[#E64A19] rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30"
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <FiMessageCircle className="w-5 h-5 text-white" />
                            </motion.div>
                            {unreadCount > 0 && (
                                <motion.div
                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center border-2 border-white shadow-lg"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                >
                                    {unreadCount}
                                </motion.div>
                            )}
                        </div>

                        <div>
                            <p className="text-gray-900 font-bold text-base leading-tight">Echo</p>
                            <p className="text-gray-600 text-sm leading-tight">
                                {unreadCount > 0 ? `${unreadCount} new messages` : 'All messages read'}
                            </p>
                        </div>
                    </div>

                    {/* Right side - Contact avatars with Rovify styling */}
                    <div className="relative z-10 flex items-center -space-x-2">
                        {conversations.slice(0, 3).map((conv, index) => (
                            <RovifyEventTooltip key={conv.id} user={conv}>
                                <motion.div
                                    className="relative"
                                    initial={{ x: 20, opacity: 0, scale: 0.8 }}
                                    animate={{ x: 0, opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: index * 0.1 + 0.3,
                                        duration: 0.4,
                                        type: "spring",
                                        stiffness: 300
                                    }}
                                    whileHover={{ scale: 1.15, zIndex: 10, y: -2 }}
                                >
                                    <div className="w-11 h-11 rounded-2xl overflow-hidden border-3 border-white shadow-xl shadow-orange-500/20 bg-white">
                                        <Image
                                            src={conv.avatar}
                                            alt={conv.name}
                                            width={44}
                                            height={44}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Rovify-style online indicator */}
                                    {conv.online && index === 0 && (
                                        <motion.div
                                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    )}
                                    {/* Event-related badge */}
                                    {conv.eventRelated && (
                                        <motion.div
                                            className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-r from-[#FF5722] to-[#E64A19] rounded-full flex items-center justify-center shadow-lg border border-white"
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        >
                                            {conv.eventType === 'music' ? (
                                                <BsMusicNote className="w-2.5 h-2.5 text-white" />
                                            ) : conv.eventType === 'tech' ? (
                                                <BsStars className="w-2.5 h-2.5 text-white" />
                                            ) : (
                                                <BsTicket className="w-2.5 h-2.5 text-white" />
                                            )}
                                        </motion.div>
                                    )}
                                    {/* Unread indicator */}
                                    {conv.unread && (
                                        <motion.div
                                            className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF5722] border-2 border-white rounded-full shadow-lg"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    )}
                                </motion.div>
                            </RovifyEventTooltip>
                        ))}

                        {/* More indicator with Rovify styling */}
                        {conversations.length > 3 && (
                            <motion.div
                                className="w-11 h-11 rounded-2xl bg-gradient-to-r from-orange-100 to-red-100 border-3 border-white flex items-center justify-center text-gray-700 text-sm font-bold shadow-xl shadow-orange-500/20"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.4 }}
                                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 237, 213, 0.9)' }}
                            >
                                +{conversations.length - 3}
                            </motion.div>
                        )}
                    </div>

                    {/* Rovify shimmer effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-300/20 to-transparent -skew-x-12 opacity-0"
                        animate={{ x: ['-100%', '200%'], opacity: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
                    />
                </motion.div>

                {/* Rovify-style Floating Contact Cards */}
                <AnimatePresence>
                    {showCards && (
                        <motion.div
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-[90]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <div className="flex flex-col gap-3">
                                {conversations.slice(0, 3).reverse().map((conv, index) => (
                                    <motion.div
                                        key={conv.id}
                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                                        transition={{
                                            delay: index * 0.1,
                                            duration: 0.3,
                                            ease: [0.23, 1, 0.32, 1]
                                        }}
                                        className="bg-white/95 backdrop-blur-2xl border border-orange-200/50 rounded-2xl px-4 py-3 shadow-2xl shadow-orange-500/10 min-w-[220px] hover:bg-orange-50/90 hover:border-orange-300/50 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-orange-200/50">
                                                    <Image
                                                        src={conv.avatar}
                                                        alt={conv.name}
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {conv.online && (
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                                                )}
                                                {conv.eventRelated && (
                                                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-r from-[#FF5722] to-[#E64A19] rounded-full flex items-center justify-center border border-white">
                                                        {conv.eventType === 'music' ? (
                                                            <BsMusicNote className="w-2.5 h-2.5 text-white" />
                                                        ) : conv.eventType === 'tech' ? (
                                                            <BsStars className="w-2.5 h-2.5 text-white" />
                                                        ) : (
                                                            <BsTicket className="w-2.5 h-2.5 text-white" />
                                                        )}
                                                    </div>
                                                )}
                                                {conv.unread && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF5722] border-2 border-white rounded-full" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-gray-900 font-semibold text-sm leading-tight truncate">
                                                        {conv.name}
                                                    </p>
                                                    <span className="text-gray-500 text-xs flex-shrink-0 ml-2">
                                                        {conv.timestamp}
                                                    </span>
                                                </div>
                                                <p className={`text-xs leading-tight truncate mt-0.5 ${conv.unread ? 'text-gray-700 font-medium' : 'text-gray-500'
                                                    }`}>
                                                    {conv.lastMessage}
                                                </p>
                                                {conv.eventRelated && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <FiCalendar className="w-3 h-3 text-orange-500" />
                                                        <span className="text-orange-600 text-xs font-medium">Event related</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default function EchoChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeChat, setActiveChat] = useState<Conversation | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat]);

    // Filter conversations based on search
    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle sending a message
    const handleSendMessage = () => {
        if (message.trim() && activeChat) {
            setMessage('');
        }
    };

    // Handle key press in message input
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Open full page messaging
    const openFullPage = () => {
        window.open('/messages', '_blank');
    };

    // Get unread count
    const unreadCount = conversations.filter(conv => conv.unread).length;

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
                >
                    <div onClick={() => setIsOpen(true)}>
                        <RovifyContactCards conversations={conversations} unreadCount={unreadCount} />
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            className="fixed bottom-6 right-6 z-50 w-80 bg-white/95 backdrop-blur-2xl border border-orange-200/50 shadow-2xl shadow-orange-500/20 rounded-2xl overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
        >
            {!activeChat ? (
                // Conversations List with Rovify styling
                <div className="h-96">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-orange-200/50 bg-gradient-to-r from-orange-50/50 to-red-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#FF5722] to-[#E64A19] rounded-2xl flex items-center justify-center shadow-lg">
                                <FiMessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900 text-base leading-none">Echo</h2>
                                <p className="text-gray-600 text-xs leading-none mt-0.5">Rovify Messages</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <motion.button
                                onClick={openFullPage}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-orange-100/50 rounded-xl transition-colors group"
                                title="Open full page"
                            >
                                <FiExternalLink className="w-4 h-4 text-gray-600 group-hover:text-orange-600 transition-colors" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-orange-100/50 rounded-xl transition-colors"
                            >
                                <FiEdit3 className="w-4 h-4 text-gray-600" />
                            </motion.button>
                            <motion.button
                                onClick={() => setIsOpen(false)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-orange-100/50 rounded-xl transition-colors"
                            >
                                <FiX className="w-4 h-4 text-gray-600" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="p-4 border-b border-orange-200/50">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-orange-50/50 border border-orange-200/50 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400/50 transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Conversations */}
                    <div className="flex-1 overflow-y-auto max-h-64 custom-scrollbar">
                        <AnimatePresence>
                            {filteredConversations.map((conversation, index) => (
                                <motion.div
                                    key={conversation.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setActiveChat(conversation)}
                                    className="flex items-center gap-3 p-4 hover:bg-orange-50/50 cursor-pointer transition-all duration-200 border-b border-orange-100/50 last:border-b-0"
                                >
                                    <div className="relative">
                                        <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-orange-200/50">
                                            <Image
                                                src={conversation.avatar}
                                                alt={conversation.name}
                                                width={44}
                                                height={44}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {conversation.online && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                        )}
                                        {conversation.eventRelated && (
                                            <div className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-r from-[#FF5722] to-[#E64A19] rounded-full flex items-center justify-center border border-white">
                                                {conversation.eventType === 'music' ? (
                                                    <BsMusicNote className="w-2.5 h-2.5 text-white" />
                                                ) : conversation.eventType === 'tech' ? (
                                                    <BsStars className="w-2.5 h-2.5 text-white" />
                                                ) : (
                                                    <BsTicket className="w-2.5 h-2.5 text-white" />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`font-medium truncate text-sm ${conversation.unread ? 'text-gray-900' : 'text-gray-700'
                                                }`}>
                                                {conversation.name}
                                            </h3>
                                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conversation.timestamp}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className={`text-xs truncate pr-2 ${conversation.typing
                                                ? 'text-[#FF5722] italic'
                                                : conversation.unread
                                                    ? 'text-gray-700 font-medium'
                                                    : 'text-gray-500'
                                                }`}>
                                                {conversation.typing ? 'is typing...' : conversation.lastMessage}
                                            </p>
                                            {conversation.unread && (
                                                <div className="w-2 h-2 bg-[#FF5722] rounded-full flex-shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                // Chat Interface with Rovify styling
                <motion.div
                    className="h-96 flex flex-col"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Chat Header */}
                    <div className="flex items-center justify-between p-4 border-b border-orange-200/50 bg-gradient-to-r from-orange-50/50 to-red-50/50">
                        <div className="flex items-center gap-3">
                            <motion.button
                                onClick={() => setActiveChat(null)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 hover:bg-orange-100/50 rounded-xl transition-colors"
                            >
                                <FiX className="w-4 h-4 text-gray-600" />
                            </motion.button>
                            <div className="relative">
                                <div className="w-8 h-8 rounded-2xl overflow-hidden border-2 border-orange-200/50">
                                    <Image
                                        src={activeChat.avatar}
                                        alt={activeChat.name}
                                        width={32}
                                        height={32}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {activeChat.online && (
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 text-sm leading-none">{activeChat.name}</h3>
                                <p className="text-xs text-gray-600 leading-none mt-0.5">
                                    {activeChat.online ? 'Active now' : 'Last seen recently'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <motion.button
                                onClick={openFullPage}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-orange-100/50 rounded-xl transition-colors"
                                title="Open full page"
                            >
                                <FiExternalLink className="w-4 h-4 text-gray-600" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-orange-100/50 rounded-xl transition-colors"
                            >
                                <FiPhone className="w-4 h-4 text-gray-600" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-orange-100/50 rounded-xl transition-colors"
                            >
                                <FiVideo className="w-4 h-4 text-gray-600" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gradient-to-b from-orange-50/20 to-red-50/20">
                        <AnimatePresence>
                            {MESSAGES.map((msg, index) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[75%] px-3 py-2 rounded-2xl shadow-lg ${msg.sent
                                        ? 'bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white rounded-br-md'
                                        : 'bg-white/90 text-gray-900 rounded-bl-md border border-orange-200/50 backdrop-blur-sm'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-orange-200/50 bg-orange-50/30">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Message..."
                                    className="w-full px-4 py-2.5 bg-white/80 border border-orange-200/50 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400/50 focus:bg-white/90 transition-all duration-300 pr-20"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-1 hover:bg-orange-100/70 rounded-full transition-colors"
                                    >
                                        <FiSmile className="w-4 h-4 text-gray-600" />
                                    </motion.button>
                                    <AnimatePresence>
                                        {message.trim() && (
                                            <motion.button
                                                onClick={handleSendMessage}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="p-1 text-[#FF5722] hover:text-[#E64A19] transition-colors"
                                            >
                                                <FiSend className="w-4 h-4" />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255,87,34,0.1);
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,87,34,0.4);
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,87,34,0.6);
                }
            `}</style>
        </motion.div>
    );
}