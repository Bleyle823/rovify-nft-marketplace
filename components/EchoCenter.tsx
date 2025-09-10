/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiMessageCircle, FiSearch, FiX, FiMoreHorizontal, FiMapPin,
    FiPhone, FiVideo, FiInfo, FiSend, FiPaperclip, FiSmile,
    FiUsers, FiStar, FiEdit3, FiSettings, FiPlus, FiCheck,
    FiCalendar, FiClock, FiFilter, FiGrid, FiList, FiTrendingUp,
    FiMenu, FiImage, FiFile, FiMic, FiHeart, FiThumbsUp,
    FiEdit, FiTrash2, FiDownload, FiExternalLink, FiMicOff,
    FiWifi, FiWifiOff, FiCheckCircle, FiAlertCircle, FiCopy,
    FiCornerUpLeft, FiPhoneCall, FiPhoneOff, FiEye, FiUserPlus,
    FiBell, FiVolume2, FiVolumeX, FiMonitor, FiShare2
} from 'react-icons/fi';
import { BsStars, BsMusicNote, BsTicket, BsFire, BsSteam, BsPeople, BsEmojiSmile } from 'react-icons/bs';

// Enhanced Types
interface Message {
    id: number;
    userId: number;
    userName: string;
    userAvatar: string;
    content: string;
    timestamp: string;
    type: 'text' | 'image' | 'file' | 'emoji' | 'voice' | 'link';
    reactions?: { emoji: string; count: number; users: number[] }[];
    status?: 'sending' | 'sent' | 'delivered' | 'read';
    editedAt?: string;
    replyTo?: number;
    linkPreview?: {
        title: string;
        description: string;
        image?: string;
        url: string;
    };
    mediaUrl?: string;
    mediaThumbnail?: string;
    fileSize?: string;
    fileName?: string;
    voiceDuration?: number;
    readBy?: number[];
}

interface Room {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    memberCount: number;
    online: number;
    category: 'rooms' | 'groups' | 'friends';
    eventPhase: 'before' | 'during' | 'after';
    isActive: boolean;
    eventType?: string;
    verified?: boolean;
    messages?: Message[];
    unreadCount?: number;
    lastActivity: Date;
    isTyping?: string[];
    description?: string;
}

interface User {
    id: number;
    name: string;
    avatar: string;
    online: boolean;
    location: string;
    presence: 'active' | 'away' | 'busy' | 'offline';
    lastSeen?: Date;
    currentActivity?: string;
}

interface CallState {
    isActive: boolean;
    type: 'audio' | 'video';
    duration: number;
    isMuted: boolean;
    isVideoOn: boolean;
    isScreenSharing: boolean;
}

// Enhanced Mock Data
const CURRENT_USER: User = {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    online: true,
    location: 'Nairobi, Kenya',
    presence: 'active'
};

const SAMPLE_MESSAGES: Message[] = [
    {
        id: 1,
        userId: 2,
        userName: 'Alex Rivera',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        content: 'Hey everyone! So excited for tonight\'s event! 🎉',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        type: 'text',
        status: 'read',
        reactions: [{ emoji: '🎉', count: 3, users: [1, 3, 4] }, { emoji: '❤️', count: 2, users: [1, 5] }],
        readBy: [1, 3, 4, 5]
    },
    {
        id: 2,
        userId: 1,
        userName: 'Sarah Johnson',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
        content: 'Same here! The lineup looks incredible',
        timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
        type: 'text',
        status: 'read',
        readBy: [2, 3, 4]
    },
    {
        id: 3,
        userId: 3,
        userName: 'Maya Patel',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
        content: 'Check out this amazing venue preview! https://example.com/venue-preview',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        type: 'link',
        status: 'read',
        linkPreview: {
            title: 'Epic Music Venue - Virtual Tour',
            description: 'Experience the incredible sound system and lighting setup for tonight\'s show',
            image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=300&fit=crop',
            url: 'https://example.com/venue-preview'
        },
        readBy: [1, 2, 4]
    },
    {
        id: 4,
        userId: 4,
        userName: 'Jordan Kim',
        userAvatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop&crop=face',
        content: 'The venue looks amazing! Can\'t wait to see everyone there 🚀',
        timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
        type: 'text',
        status: 'read',
        replyTo: 3,
        readBy: [1, 2, 3]
    },
    {
        id: 5,
        userId: 2,
        userName: 'Alex Rivera',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        content: 'voice-message.mp3',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        type: 'voice',
        status: 'delivered',
        voiceDuration: 23,
        readBy: [1]
    }
];

const ROOMS_DATA: Room[] = [
    {
        id: 1,
        name: 'The Main Exclusive Room',
        avatar: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop',
        lastMessage: 'So excited to go to this...',
        timestamp: '07:07',
        memberCount: 156,
        online: 89,
        category: 'rooms',
        eventPhase: 'before',
        isActive: true,
        eventType: 'music',
        verified: true,
        messages: SAMPLE_MESSAGES,
        unreadCount: 3,
        lastActivity: new Date(Date.now() - 5 * 60 * 1000),
        isTyping: ['Emma Wilson'],
        description: 'The ultimate music experience with top DJs and exclusive access to VIP areas.'
    },
    {
        id: 2,
        name: 'Summer Festival VIP',
        avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        lastMessage: 'Who\'s bringing the energy tonight?',
        timestamp: '06:45',
        memberCount: 89,
        online: 45,
        category: 'groups',
        eventPhase: 'during',
        isActive: true,
        eventType: 'music',
        unreadCount: 0,
        lastActivity: new Date(Date.now() - 45 * 60 * 1000),
        description: 'Exclusive VIP access to the hottest summer festival of the year.'
    },
    {
        id: 3,
        name: 'Tech Summit Networking',
        avatar: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop',
        lastMessage: 'Great presentations today!',
        timestamp: '05:23',
        memberCount: 234,
        online: 67,
        category: 'groups',
        eventPhase: 'after',
        isActive: false,
        eventType: 'tech',
        unreadCount: 12,
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
        description: 'Connect with industry leaders and innovators in the tech space.'
    },
    {
        id: 4,
        name: 'Art Gallery Opening',
        avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        lastMessage: 'The installations are incredible',
        timestamp: '04:12',
        memberCount: 78,
        online: 23,
        category: 'rooms',
        eventPhase: 'during',
        isActive: true,
        eventType: 'art',
        unreadCount: 1,
        lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
        description: 'Contemporary art showcase featuring emerging and established artists.'
    }
];

const EMOJI_LIST = ['😀', '😂', '😍', '🤔', '😢', '😮', '😡', '👍', '👎', '❤️', '🎉', '🔥', '💯', '👏', '🙌', '💪', '🚀', '⭐', '💡', '🎯'];

export default function EchoCenter() {
    const [activeTab, setActiveTab] = useState<'rooms' | 'groups' | 'friends'>('rooms');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
    const [isTyping, setIsTyping] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [isConnected, setIsConnected] = useState(true);
    const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
    const [editingMessage, setEditingMessage] = useState<number | null>(null);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [dragOverChat, setDragOverChat] = useState(false);

    // Call functionality
    const [callState, setCallState] = useState<CallState>({
        isActive: false,
        type: 'audio',
        duration: 0,
        isMuted: false,
        isVideoOn: false,
        isScreenSharing: false
    });
    const [callDuration, setCallDuration] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const callDurationRef = useRef<NodeJS.Timeout | null>(null);

    // Detect screen size
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Call duration timer
    useEffect(() => {
        if (callState.isActive) {
            callDurationRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (callDurationRef.current) {
                clearInterval(callDurationRef.current);
            }
            setCallDuration(0);
        }

        return () => {
            if (callDurationRef.current) {
                clearInterval(callDurationRef.current);
            }
        };
    }, [callState.isActive]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [messageInput]);

    // Filter rooms based on active tab and search
    const filteredRooms = ROOMS_DATA.filter(room => {
        if (activeTab !== 'rooms' && room.category !== activeTab) return false;
        if (searchQuery && !room.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Smart timestamp formatter
    const formatSmartTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    // Format call duration
    const formatCallDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Get presence color
    const getPresenceColor = (presence: User['presence']) => {
        switch (presence) {
            case 'active': return 'bg-[#18E299]';
            case 'away': return 'bg-yellow-400';
            case 'busy': return 'bg-red-400';
            default: return 'bg-gray-400';
        }
    };

    // Call functions
    const startCall = (type: 'audio' | 'video') => {
        if (!selectedRoom) return;

        setCallState({
            isActive: true,
            type,
            duration: 0,
            isMuted: false,
            isVideoOn: type === 'video',
            isScreenSharing: false
        });

        // Add system message
        const callMessage: Message = {
            id: Date.now(),
            userId: 0,
            userName: 'System',
            userAvatar: '',
            content: `${CURRENT_USER.name} started a ${type} call`,
            timestamp: new Date().toISOString(),
            type: 'text',
            status: 'sent'
        };
        setMessages(prev => [...prev, callMessage]);
    };

    const endCall = () => {
        if (!selectedRoom) return;

        const duration = callDuration;
        setCallState({
            isActive: false,
            type: 'audio',
            duration: 0,
            isMuted: false,
            isVideoOn: false,
            isScreenSharing: false
        });

        // Add system message
        const endMessage: Message = {
            id: Date.now(),
            userId: 0,
            userName: 'System',
            userAvatar: '',
            content: `Call ended • Duration: ${formatCallDuration(duration)}`,
            timestamp: new Date().toISOString(),
            type: 'text',
            status: 'sent'
        };
        setMessages(prev => [...prev, endMessage]);
    };

    const toggleMute = () => {
        setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }));
    };

    const toggleVideo = () => {
        setCallState(prev => ({ ...prev, isVideoOn: !prev.isVideoOn }));
    };

    const toggleScreenShare = () => {
        setCallState(prev => ({ ...prev, isScreenSharing: !prev.isScreenSharing }));
    };

    // Handle message sending
    const handleSendMessage = useCallback(() => {
        if ((!messageInput.trim() && !replyingTo) || !selectedRoom) return;

        const newMessage: Message = {
            id: Date.now(),
            userId: CURRENT_USER.id,
            userName: CURRENT_USER.name,
            userAvatar: CURRENT_USER.avatar,
            content: messageInput,
            timestamp: new Date().toISOString(),
            type: 'text',
            status: 'sending',
            replyTo: replyingTo?.id
        };

        setMessages(prev => [...prev, newMessage]);
        setMessageInput('');
        setReplyingTo(null);
        setShowEmojiPicker(false);

        // Simulate message status updates
        setTimeout(() => {
            setMessages(prev => prev.map(msg =>
                msg.id === newMessage.id ? { ...msg, status: 'sent' as const } : msg
            ));
        }, 500);

        setTimeout(() => {
            setMessages(prev => prev.map(msg =>
                msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
            ));
        }, 1000);

        // Simulate typing indicator
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
    }, [messageInput, selectedRoom, replyingTo]);

    // Handle emoji selection
    const handleEmojiSelect = (emoji: string) => {
        setMessageInput(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    // Handle file upload with drag and drop
    const handleFileUpload = useCallback((files: FileList | null) => {
        const file = files?.[0];
        if (!file) return;

        setIsUploading(true);
        const fileType = file.type.startsWith('image/') ? 'image' : 'file';

        // Simulate upload
        setTimeout(() => {
            const newMessage: Message = {
                id: Date.now(),
                userId: CURRENT_USER.id,
                userName: CURRENT_USER.name,
                userAvatar: CURRENT_USER.avatar,
                content: fileType === 'image' ? `Shared ${file.name}` : `Shared ${file.name}`,
                timestamp: new Date().toISOString(),
                type: fileType,
                status: 'sent',
                fileName: file.name,
                fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                mediaUrl: fileType === 'image' ? URL.createObjectURL(file) : undefined,
                mediaThumbnail: fileType === 'image' ? URL.createObjectURL(file) : undefined
            };

            setMessages(prev => [...prev, newMessage]);
            setIsUploading(false);
        }, 1500);
    }, []);

    // Handle drag and drop
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOverChat(false);
        handleFileUpload(e.dataTransfer.files);
    }, [handleFileUpload]);

    // Handle keyboard shortcuts
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
        if (e.key === 'Escape') {
            setReplyingTo(null);
            setEditingMessage(null);
            setShowEmojiPicker(false);
        }
    };

    // Add reaction to message
    const addReaction = (messageId: number, emoji: string) => {
        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
                const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
                if (existingReaction) {
                    // Toggle reaction
                    if (existingReaction.users.includes(CURRENT_USER.id)) {
                        existingReaction.users = existingReaction.users.filter(id => id !== CURRENT_USER.id);
                        existingReaction.count--;
                        if (existingReaction.count === 0) {
                            msg.reactions = msg.reactions?.filter(r => r.emoji !== emoji);
                        }
                    } else {
                        existingReaction.users.push(CURRENT_USER.id);
                        existingReaction.count++;
                    }
                } else {
                    // Add new reaction
                    if (!msg.reactions) msg.reactions = [];
                    msg.reactions.push({ emoji, count: 1, users: [CURRENT_USER.id] });
                }
            }
            return msg;
        }));
    };

    // Handle voice recording
    const startRecording = () => {
        setIsRecording(true);
        setRecordingTime(0);
        recordingIntervalRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = () => {
        setIsRecording(false);
        setRecordingTime(0);
        if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
        }

        // Create voice message
        const newMessage: Message = {
            id: Date.now(),
            userId: CURRENT_USER.id,
            userName: CURRENT_USER.name,
            userAvatar: CURRENT_USER.avatar,
            content: 'Voice message',
            timestamp: new Date().toISOString(),
            type: 'voice',
            status: 'sent',
            voiceDuration: recordingTime
        };

        setMessages(prev => [...prev, newMessage]);
    };

    // Handle message editing
    const editMessage = (messageId: number, newContent: string) => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId
                ? { ...msg, content: newContent, editedAt: new Date().toISOString() }
                : msg
        ));
        setEditingMessage(null);
    };

    // Handle message deletion
    const deleteMessage = (messageId: number) => {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
    };

    // Handle room selection
    const handleRoomSelect = (room: Room) => {
        setSelectedRoom(room);
        setMessages(room.messages || []);
        // Mark as read
        room.unreadCount = 0;
        // Only close sidebar on mobile
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    // Get message status icon
    const getMessageStatusIcon = (status: Message['status']) => {
        switch (status) {
            case 'sending': return <FiClock className="w-3 h-3 text-gray-400" />;
            case 'sent': return <FiCheck className="w-3 h-3 text-gray-400" />;
            case 'delivered': return <FiCheckCircle className="w-3 h-3 text-gray-500" />;
            case 'read': return <FiCheckCircle className="w-3 h-3 text-[#18E299]" />;
        }
    };

    // Find replied message
    const findRepliedMessage = (replyToId: number) => {
        return messages.find(msg => msg.id === replyToId);
    };

    // Create room handler
    const handleCreateRoom = (roomData: { name: string; description: string; type: string }) => {
        const newRoom: Room = {
            id: Date.now(),
            name: roomData.name,
            avatar: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop',
            lastMessage: 'Room created',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            memberCount: 1,
            online: 1,
            category: 'rooms',
            eventPhase: 'before',
            isActive: true,
            eventType: roomData.type,
            verified: false,
            messages: [],
            unreadCount: 0,
            lastActivity: new Date(),
            description: roomData.description
        };

        // Add to rooms (in real app, this would be an API call)
        ROOMS_DATA.unshift(newRoom);
        setSelectedRoom(newRoom);
        setShowCreateRoomModal(false);
    };

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900 flex overflow-hidden relative">
            {/* Connection Status */}
            <AnimatePresence>
                {!isConnected && (
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        className="absolute top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 text-center text-sm font-medium z-50 flex items-center justify-center gap-2"
                    >
                        <FiWifiOff className="w-4 h-4" />
                        Reconnecting...
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Call Overlay */}
            <AnimatePresence>
                {callState.isActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
                    >
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-white text-center border border-white/20">
                            <div className="mb-6">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF5900] to-[#FF8A00] mx-auto mb-4 flex items-center justify-center">
                                    {callState.type === 'video' ? (
                                        <FiVideo className="w-16 h-16" />
                                    ) : (
                                        <FiPhone className="w-16 h-16" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{selectedRoom?.name}</h3>
                                <p className="text-white/70">{formatCallDuration(callDuration)}</p>
                                {callState.isScreenSharing && (
                                    <p className="text-sm text-green-400 mt-2">Screen sharing active</p>
                                )}
                            </div>

                            <div className="flex items-center justify-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleMute}
                                    className={`p-4 rounded-full ${callState.isMuted ? 'bg-red-500' : 'bg-white/20'} backdrop-blur-sm`}
                                >
                                    {callState.isMuted ? <FiMicOff className="w-6 h-6" /> : <FiMic className="w-6 h-6" />}
                                </motion.button>

                                {callState.type === 'video' && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={toggleVideo}
                                        className={`p-4 rounded-full ${!callState.isVideoOn ? 'bg-red-500' : 'bg-white/20'} backdrop-blur-sm`}
                                    >
                                        {callState.isVideoOn ? <FiVideo className="w-6 h-6" /> : <FiEye className="w-6 h-6" />}
                                    </motion.button>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleScreenShare}
                                    className={`p-4 rounded-full ${callState.isScreenSharing ? 'bg-green-500' : 'bg-white/20'} backdrop-blur-sm`}
                                >
                                    <FiMonitor className="w-6 h-6" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={endCall}
                                    className="p-4 rounded-full bg-red-500 backdrop-blur-sm"
                                >
                                    <FiPhoneOff className="w-6 h-6" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Sidebar Overlay */}
            {isMobile && isSidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                />
            )}

            {/* Search Modal - Adjusted for vertical tabs */}
            <AnimatePresence>
                {showSearchModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={() => setShowSearchModal(false)}
                        style={{
                            paddingLeft: isMobile ? '1rem' : isSidebarOpen ? '340px' : '1rem',
                            paddingRight: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20"
                        >
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Search Echo</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowSearchModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        <FiX className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                </div>
                                <div className="relative">
                                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search rooms, messages, people..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5900] focus:border-[#FF5900] transition-all duration-200"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="max-h-96 overflow-y-auto p-4">
                                {filteredRooms.length > 0 ? (
                                    <div className="space-y-2">
                                        {filteredRooms.map((room) => (
                                            <motion.div
                                                key={room.id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => {
                                                    handleRoomSelect(room);
                                                    setShowSearchModal(false);
                                                }}
                                                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="relative">
                                                    <Image
                                                        src={room.avatar}
                                                        alt={room.name}
                                                        width={48}
                                                        height={48}
                                                        className="w-12 h-12 rounded-xl object-cover"
                                                    />
                                                    {(room.unreadCount ?? 0) > 0 && (
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF5900] text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                            {(room.unreadCount ?? 0) > 9 ? '9+' : room.unreadCount ?? 0}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 truncate">{room.name}</h3>
                                                    <p className="text-sm text-gray-600 truncate">{room.memberCount} members • {room.online} online</p>
                                                </div>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${room.eventPhase === 'during' ? 'bg-red-100 text-red-700' :
                                                    room.eventPhase === 'before' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {room.eventPhase}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No results found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Info Modal */}
            <AnimatePresence>
                {showInfoModal && selectedRoom && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowInfoModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Room Info</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowInfoModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        <FiX className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                </div>

                                <div className="text-center mb-6">
                                    <div className="relative mx-auto mb-4 w-20 h-20">
                                        <Image
                                            src={selectedRoom.avatar}
                                            alt={selectedRoom.name}
                                            width={80}
                                            height={80}
                                            className="w-full h-full rounded-2xl object-cover"
                                        />
                                        {selectedRoom.verified && (
                                            <FiStar className="absolute -top-1 -right-1 w-6 h-6 text-[#FF5900] bg-white rounded-full p-1" />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedRoom.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{selectedRoom.description}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Members</span>
                                        <span className="font-semibold">{selectedRoom.memberCount}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Online</span>
                                        <span className="font-semibold text-[#18E299]">{selectedRoom.online}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Status</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedRoom.eventPhase === 'during' ? 'bg-red-100 text-red-700' :
                                            selectedRoom.eventPhase === 'before' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {selectedRoom.eventPhase}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Category</span>
                                        <span className="font-semibold capitalize">{selectedRoom.category}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#FF5900] text-white rounded-xl font-medium"
                                        >
                                            <FiUserPlus className="w-4 h-4" />
                                            Join Room
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                                        >
                                            <FiShare2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Room Modal */}
            <AnimatePresence>
                {showCreateRoomModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCreateRoomModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20"
                        >
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target as HTMLFormElement);
                                handleCreateRoom({
                                    name: formData.get('name') as string,
                                    description: formData.get('description') as string,
                                    type: formData.get('type') as string,
                                });
                            }}>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-900">Create Room</h2>
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowCreateRoomModal(false)}
                                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            <FiX className="w-5 h-5 text-gray-600" />
                                        </motion.button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Room Name</label>
                                            <input
                                                name="name"
                                                type="text"
                                                required
                                                placeholder="Enter room name..."
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5900] focus:border-[#FF5900] transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                            <textarea
                                                name="description"
                                                rows={3}
                                                placeholder="Describe your room..."
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5900] focus:border-[#FF5900] transition-all duration-200 resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                            <select
                                                name="type"
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5900] focus:border-[#FF5900] transition-all duration-200"
                                            >
                                                <option value="music">Music</option>
                                                <option value="tech">Technology</option>
                                                <option value="art">Art</option>
                                                <option value="gaming">Gaming</option>
                                                <option value="general">General</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="flex gap-3">
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setShowCreateRoomModal(false)}
                                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                                            >
                                                Cancel
                                            </motion.button>
                                            <motion.button
                                                type="submit"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FF5900] to-[#FF8A00] text-white rounded-xl font-medium"
                                            >
                                                Create
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettingsModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSettingsModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowSettingsModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        <FiX className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">Notifications</h3>
                                            <p className="text-sm text-gray-600">Receive push notifications</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5900]"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">Sound Effects</h3>
                                            <p className="text-sm text-gray-600">Play message sounds</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5900]"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">Auto-connect</h3>
                                            <p className="text-sm text-gray-600">Connect automatically</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5900]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5900]"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl font-medium"
                                    >
                                        Sign Out
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Sidebar */}
            <motion.div
                initial={false}
                animate={{
                    x: isMobile ? (isSidebarOpen ? 0 : -400) : 0,
                    width: isMobile ? '85vw' : '320px'
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`bg-white/80 backdrop-blur-xl border-r border-white/20 flex flex-col shadow-xl z-50 h-full ${isMobile ? 'fixed max-w-sm' : 'relative w-80'
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100/50">
                    {/* Mobile Close Button */}
                    {isMobile && (
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="font-bold text-lg bg-gradient-to-r from-[#FF5900] to-[#FF8A00] bg-clip-text text-transparent">Echo Center</h1>
                            <motion.button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 hover:bg-gray-100/50 rounded-xl transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiX className="w-5 h-5 text-gray-600" />
                            </motion.button>
                        </div>
                    )}

                    {/* User Profile */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-[#FF5900] p-0.5 bg-gradient-to-br from-[#FF5900] to-[#FF8A00]">
                                    <div className="w-full h-full rounded-2xl overflow-hidden bg-white p-0.5">
                                        <Image
                                            src={CURRENT_USER.avatar}
                                            alt={CURRENT_USER.name}
                                            width={44}
                                            height={44}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${getPresenceColor(CURRENT_USER.presence)} border-2 border-white rounded-full`} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900 text-sm">{CURRENT_USER.name}</h2>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <FiMapPin className="w-3 h-3" />
                                    <span>{CURRENT_USER.location}</span>
                                </div>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowSearchModal(true)}
                            className="p-2.5 hover:bg-gray-100/50 rounded-xl transition-colors"
                        >
                            <FiSearch className="w-4 h-4 text-gray-600" />
                        </motion.button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-gray-50/50 backdrop-blur-sm rounded-xl p-1 mb-4">
                        {(['rooms', 'groups', 'friends'] as const).map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${activeTab === tab
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Rooms List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-2">
                        <AnimatePresence>
                            {filteredRooms.map((room, index) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleRoomSelect(room)}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 mb-2 group relative ${selectedRoom?.id === room.id
                                        ? 'bg-gradient-to-r from-[#FF5900]/10 to-[#FF8A00]/5 border border-[#FF5900]/20'
                                        : 'hover:bg-gray-50/50'
                                        }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200/50 shadow-sm">
                                            <Image
                                                src={room.avatar}
                                                alt={room.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {room.isActive && (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute -top-1 -right-1 w-4 h-4 bg-[#18E299] border-2 border-white rounded-full"
                                            />
                                        )}
                                        {room.eventType && (
                                            <div className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-br from-[#FF5900] to-[#FF8A00] rounded-full flex items-center justify-center">
                                                {room.eventType === 'music' ? (
                                                    <BsMusicNote className="w-2.5 h-2.5 text-white" />
                                                ) : room.eventType === 'tech' ? (
                                                    <BsStars className="w-2.5 h-2.5 text-white" />
                                                ) : (
                                                    <BsTicket className="w-2.5 h-2.5 text-white" />
                                                )}
                                            </div>
                                        )}
                                        {(room.unreadCount ?? 0) > 0 && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -bottom-1 -right-1 min-w-5 h-5 bg-[#FF5900] text-white rounded-full flex items-center justify-center text-xs font-bold px-1"
                                            >
                                                {(room.unreadCount ?? 0) > 99 ? '99+' : room.unreadCount ?? 0}
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate text-sm flex items-center gap-1">
                                                <span className="truncate">{room.name}</span>
                                                {room.verified && (
                                                    <FiStar className="w-3 h-3 text-[#FF5900] flex-shrink-0" />
                                                )}
                                            </h3>
                                            <span className="text-xs text-gray-500 flex-shrink-0">{formatSmartTimestamp(room.lastActivity.toISOString())}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 truncate mb-2">{room.lastMessage}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs">
                                                <div className="flex items-center gap-1 bg-[#FF5900]/10 rounded-full px-2 py-1">
                                                    <FiUsers className="w-3 h-3 text-[#FF5900]" />
                                                    <span className="text-[#FF5900] font-medium">{room.memberCount}</span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-[#18E299]/10 rounded-full px-2 py-1">
                                                    <div className="w-2 h-2 bg-[#18E299] rounded-full" />
                                                    <span className="text-[#18E299] font-medium">{room.online}</span>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${room.eventPhase === 'during' ? 'bg-red-100 text-red-700' :
                                                room.eventPhase === 'before' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {room.eventPhase}
                                            </div>
                                        </div>
                                        {room.isTyping && room.isTyping.length > 0 && (
                                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                                <div className="flex gap-1">
                                                    <div className="w-1 h-1 bg-[#FF5900] rounded-full animate-bounce"></div>
                                                    <div className="w-1 h-1 bg-[#FF5900] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-1 h-1 bg-[#FF5900] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                                <span className="truncate">{room.isTyping[0]} is typing...</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-3 border-t border-gray-100/50">
                    <div className="flex items-center justify-between">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCreateRoomModal(true)}
                            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FF5900] to-[#FF8A00] text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <FiPlus className="w-4 h-4" />
                            Create Room
                        </motion.button>
                        <div className="flex items-center gap-1">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {/* Steam integration */ }}
                                className="p-3 hover:bg-gray-100/50 rounded-xl transition-colors"
                            >
                                <BsSteam className="w-4 h-4 text-gray-600" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowSettingsModal(true)}
                                className="p-3 hover:bg-gray-100/50 rounded-xl transition-colors"
                            >
                                <FiSettings className="w-4 h-4 text-gray-600" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-gray-50/50 to-white overflow-hidden">
                {/* Mobile Header */}
                {isMobile && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl flex-shrink-0">
                        <motion.button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2.5 hover:bg-gray-100/50 rounded-xl transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiMenu className="w-5 h-5 text-gray-600" />
                        </motion.button>

                        {selectedRoom ? (
                            <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
                                <div className="relative flex-shrink-0">
                                    <Image
                                        src={selectedRoom.avatar}
                                        alt={selectedRoom.name}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-xl object-cover"
                                    />
                                    {(selectedRoom.unreadCount ?? 0) > 0 && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF5900] rounded-full"></div>
                                    )}
                                </div>
                                <div className="text-center min-w-0">
                                    <h1 className="font-semibold text-gray-900 truncate max-w-[120px] text-sm">
                                        {selectedRoom.name}
                                    </h1>
                                    <p className="text-xs text-gray-500">{selectedRoom.online} online</p>
                                </div>
                            </div>
                        ) : (
                            <h1 className="font-bold text-lg bg-gradient-to-r from-[#FF5900] to-[#FF8A00] bg-clip-text text-transparent flex-1 text-center">Echo</h1>
                        )}

                        {/* Mobile Action Buttons - Only show when room is selected */}
                        {selectedRoom ? (
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => startCall('audio')}
                                    className="p-2.5 hover:bg-gray-100/50 rounded-xl transition-colors"
                                >
                                    <FiPhone className="w-4 h-4 text-gray-600" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => startCall('video')}
                                    className="p-2.5 hover:bg-gray-100/50 rounded-xl transition-colors"
                                >
                                    <FiVideo className="w-4 h-4 text-gray-600" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowInfoModal(true)}
                                    className="p-2.5 hover:bg-gray-100/50 rounded-xl transition-colors"
                                >
                                    <FiInfo className="w-4 h-4 text-gray-600" />
                                </motion.button>
                            </div>
                        ) : (
                            <div className="w-14 flex-shrink-0" />
                        )}
                    </div>
                )}

                {selectedRoom ? (
                    <>
                        {/* Room Header - Desktop Only */}
                        {!isMobile && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl flex-shrink-0">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200/50 shadow-sm">
                                            <Image
                                                src={selectedRoom.avatar}
                                                alt={selectedRoom.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {selectedRoom.isActive && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#18E299] border-2 border-white rounded-full" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-bold text-gray-900 truncate">{selectedRoom.name}</h2>
                                            {selectedRoom.verified && (
                                                <FiStar className="w-5 h-5 text-[#FF5900] flex-shrink-0" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <FiUsers className="w-4 h-4" />
                                                <span>{selectedRoom.memberCount} members</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-[#18E299] rounded-full" />
                                                <span>{selectedRoom.online} online</span>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${selectedRoom.eventPhase === 'during' ? 'bg-red-100 text-red-700' :
                                                selectedRoom.eventPhase === 'before' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {selectedRoom.eventPhase}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => startCall('audio')}
                                        className="p-3 hover:bg-gray-100/50 rounded-xl transition-colors"
                                    >
                                        <FiPhone className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => startCall('video')}
                                        className="p-3 hover:bg-gray-100/50 rounded-xl transition-colors"
                                    >
                                        <FiVideo className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowInfoModal(true)}
                                        className="p-3 hover:bg-gray-100/50 rounded-xl transition-colors"
                                    >
                                        <FiInfo className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Chat Messages Area - Fixed overflow */}
                        <div
                            className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-white/50 backdrop-blur-sm"
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDragOverChat(true); }}
                            onDragLeave={() => setDragOverChat(false)}
                        >
                            {/* Drag overlay */}
                            <AnimatePresence>
                                {dragOverChat && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-[#FF5900]/10 border-2 border-dashed border-[#FF5900] rounded-2xl flex items-center justify-center z-10"
                                    >
                                        <div className="text-center">
                                            <FiImage className="w-12 h-12 text-[#FF5900] mx-auto mb-2" />
                                            <p className="text-[#FF5900] font-semibold">Drop files here to share</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {messages.map((message, index) => {
                                    const repliedMessage = message.replyTo ? findRepliedMessage(message.replyTo) : null;
                                    const isCurrentUser = message.userId === CURRENT_USER.id;

                                    return (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`flex gap-3 group relative ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                                        >
                                            {/* Avatar */}
                                            <div className="w-9 h-9 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-200/50 shadow-sm">
                                                <Image
                                                    src={message.userAvatar}
                                                    alt={message.userName}
                                                    width={36}
                                                    height={36}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className={`flex-1 max-w-sm lg:max-w-md ${isCurrentUser ? 'text-right' : ''}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-gray-900">{message.userName}</span>
                                                    <span className="text-xs text-gray-500">{formatSmartTimestamp(message.timestamp)}</span>
                                                    {message.editedAt && (
                                                        <span className="text-xs text-gray-400">(edited)</span>
                                                    )}
                                                    {isCurrentUser && getMessageStatusIcon(message.status)}
                                                </div>

                                                {/* Reply preview */}
                                                {repliedMessage && (
                                                    <div className={`mb-2 p-2 rounded-lg border-l-2 border-[#FF5900] bg-gray-50/50 text-xs max-w-full ${isCurrentUser ? 'ml-auto' : ''}`}>
                                                        <div className="font-medium text-gray-700">{repliedMessage.userName}</div>
                                                        <div className="text-gray-600 truncate">{repliedMessage.content}</div>
                                                    </div>
                                                )}

                                                {/* Message content */}
                                                <div className={`relative group/message break-words ${isCurrentUser ? 'ml-auto' : ''}`}>
                                                    {message.type === 'text' ? (
                                                        <div className={`p-4 rounded-2xl shadow-sm backdrop-blur-sm max-w-full ${isCurrentUser
                                                            ? 'bg-gradient-to-r from-[#FF5900] to-[#FF8A00] text-white'
                                                            : 'bg-white/90 border border-gray-200/50'
                                                            }`}>
                                                            <p className="text-sm leading-relaxed break-words">{message.content}</p>
                                                        </div>
                                                    ) : message.type === 'link' && message.linkPreview ? (
                                                        <div className={`rounded-2xl overflow-hidden shadow-sm border max-w-full ${isCurrentUser ? 'border-white/20' : 'border-gray-200/50'}`}>
                                                            <div className={`p-4 ${isCurrentUser ? 'bg-gradient-to-r from-[#FF5900] to-[#FF8A00] text-white' : 'bg-white/90'}`}>
                                                                <p className="text-sm leading-relaxed mb-2 break-words">{message.content}</p>
                                                            </div>
                                                            {message.linkPreview.image && (
                                                                <div className="relative h-48">
                                                                    <Image
                                                                        src={message.linkPreview.image}
                                                                        alt={message.linkPreview.title}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="p-4 bg-white/95">
                                                                <h4 className="font-semibold text-gray-900 mb-1">{message.linkPreview.title}</h4>
                                                                <p className="text-sm text-gray-600 mb-2">{message.linkPreview.description}</p>
                                                                <a
                                                                    href={message.linkPreview.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-[#FF5900] text-sm font-medium hover:underline"
                                                                >
                                                                    <FiExternalLink className="w-3 h-3" />
                                                                    Visit link
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ) : message.type === 'image' ? (
                                                        <div className="rounded-2xl overflow-hidden shadow-sm max-w-xs">
                                                            <Image
                                                                src={message.mediaUrl!}
                                                                alt="Shared image"
                                                                width={300}
                                                                height={200}
                                                                className="w-full h-auto object-cover"
                                                            />
                                                            <div className={`p-3 ${isCurrentUser ? 'bg-gradient-to-r from-[#FF5900] to-[#FF8A00] text-white' : 'bg-white/90'}`}>
                                                                <p className="text-sm truncate">{message.fileName}</p>
                                                                <p className="text-xs opacity-75">{message.fileSize}</p>
                                                            </div>
                                                        </div>
                                                    ) : message.type === 'voice' ? (
                                                        <div className={`p-4 rounded-2xl shadow-sm flex items-center gap-3 ${isCurrentUser
                                                            ? 'bg-gradient-to-r from-[#FF5900] to-[#FF8A00] text-white'
                                                            : 'bg-white/90 border border-gray-200/50'
                                                            }`}>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className={`p-2 rounded-full ${isCurrentUser ? 'bg-white/20' : 'bg-[#FF5900]'}`}
                                                            >
                                                                <FiMic className={`w-4 h-4 ${isCurrentUser ? 'text-white' : 'text-white'}`} />
                                                            </motion.button>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className="h-1 bg-current opacity-30 rounded-full flex-1"></div>
                                                                </div>
                                                                <p className="text-xs opacity-75">{message.voiceDuration}s</p>
                                                            </div>
                                                        </div>
                                                    ) : message.type === 'file' ? (
                                                        <div className={`p-4 rounded-2xl shadow-sm flex items-center gap-3 ${isCurrentUser
                                                            ? 'bg-gradient-to-r from-[#FF5900] to-[#FF8A00] text-white'
                                                            : 'bg-white/90 border border-gray-200/50'
                                                            }`}>
                                                            <FiFile className="w-8 h-8 flex-shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{message.fileName}</p>
                                                                <p className="text-xs opacity-75">{message.fileSize}</p>
                                                            </div>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className={`p-2 rounded-full ${isCurrentUser ? 'bg-white/20' : 'bg-[#FF5900]/10'}`}
                                                            >
                                                                <FiDownload className={`w-4 h-4 ${isCurrentUser ? 'text-white' : 'text-[#FF5900]'}`} />
                                                            </motion.button>
                                                        </div>
                                                    ) : null}

                                                    {/* Message Actions */}
                                                    <div className="absolute top-0 right-0 transform translate-x-full opacity-0 group-hover/message:opacity-100 transition-opacity duration-200">
                                                        <div className="flex items-center gap-1 ml-2">
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => setReplyingTo(message)}
                                                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                                            >
                                                                <FiCornerUpLeft className="w-4 h-4 text-gray-600" />
                                                            </motion.button>
                                                            {isCurrentUser && (
                                                                <>
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={() => setEditingMessage(message.id)}
                                                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                                                    >
                                                                        <FiEdit className="w-4 h-4 text-gray-600" />
                                                                    </motion.button>
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={() => deleteMessage(message.id)}
                                                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                                                    >
                                                                        <FiTrash2 className="w-4 h-4 text-red-500" />
                                                                    </motion.button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Reactions */}
                                                {message.reactions && message.reactions.length > 0 && (
                                                    <div className="flex gap-1 mt-2 flex-wrap">
                                                        {message.reactions.map((reaction, idx) => (
                                                            <motion.button
                                                                key={idx}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => addReaction(message.id, reaction.emoji)}
                                                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-all duration-200 backdrop-blur-sm ${reaction.users.includes(CURRENT_USER.id)
                                                                    ? 'bg-[#FF5900]/10 border-[#FF5900]/30 text-[#FF5900]'
                                                                    : 'bg-white/80 border-gray-200/50 text-gray-700 hover:bg-gray-50/80'
                                                                    }`}
                                                            >
                                                                <span>{reaction.emoji}</span>
                                                                <span className="font-medium">{reaction.count}</span>
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Quick Reactions */}
                                                <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    {['❤️', '👍', '😂', '🎉'].map((emoji) => (
                                                        <motion.button
                                                            key={emoji}
                                                            whileHover={{ scale: 1.3 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => addReaction(message.id, emoji)}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100/80 rounded-full transition-colors duration-200 backdrop-blur-sm"
                                                        >
                                                            {emoji}
                                                        </motion.button>
                                                    ))}
                                                </div>

                                                {/* Read receipts for current user messages */}
                                                {isCurrentUser && message.readBy && message.readBy.length > 1 && (
                                                    <div className="flex items-center gap-1 mt-1 justify-end">
                                                        <span className="text-xs text-gray-500">Read by {message.readBy.length - 1}</span>
                                                        <div className="flex -space-x-1">
                                                            {message.readBy.slice(0, 3).map((userId, idx) => (
                                                                <div key={userId} className="w-4 h-4 rounded-full bg-[#18E299] border border-white"></div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 text-sm text-gray-500"
                                >
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-[#FF5900] rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-[#FF5900] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-[#FF5900] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span>Someone is typing...</span>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 lg:p-6 border-t border-gray-200/50 bg-white/80 backdrop-blur-xl relative flex-shrink-0">
                            {/* Reply Preview */}
                            <AnimatePresence>
                                {replyingTo && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mb-4 p-3 bg-gray-50/50 border border-gray-200/50 rounded-xl flex items-center justify-between backdrop-blur-sm"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <FiCornerUpLeft className="w-4 h-4 text-[#FF5900] flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900">Replying to {replyingTo.userName}</p>
                                                <p className="text-xs text-gray-600 truncate max-w-xs">{replyingTo.content}</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setReplyingTo(null)}
                                            className="p-1 hover:bg-gray-200/50 rounded-lg transition-colors flex-shrink-0"
                                        >
                                            <FiX className="w-4 h-4 text-gray-600" />
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* File Upload Progress */}
                            {isUploading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 bg-blue-50/50 border border-blue-200/50 rounded-xl backdrop-blur-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <FiFile className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm text-blue-700 font-medium">Uploading file...</span>
                                        <div className="ml-auto w-20 h-2 bg-blue-200/50 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-[#FF5900] to-[#FF8A00]"
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 1.5 }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Voice Recording */}
                            <AnimatePresence>
                                {isRecording && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="mb-4 p-4 bg-red-50/50 border border-red-200/50 rounded-xl backdrop-blur-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                    className="w-3 h-3 bg-red-500 rounded-full"
                                                />
                                                <span className="text-sm font-medium text-red-700">Recording...</span>
                                                <span className="text-xs text-red-600">{recordingTime}s</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setIsRecording(false)}
                                                    className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg"
                                                >
                                                    Cancel
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={stopRecording}
                                                    className="px-3 py-1 bg-[#FF5900] text-white text-xs rounded-lg"
                                                >
                                                    Send
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-end gap-3">
                                {/* Attachment Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 hover:bg-gray-100/50 rounded-xl transition-colors flex-shrink-0"
                                >
                                    <FiPaperclip className="w-5 h-5 text-gray-600" />
                                </motion.button>

                                {/* Message Input Container */}
                                <div className="flex-1 relative">
                                    <textarea
                                        ref={textareaRef}
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message..."
                                        rows={1}
                                        className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5900] focus:border-[#FF5900] pr-24 resize-none transition-all duration-200 backdrop-blur-sm"
                                    />

                                    {/* Input Actions */}
                                    <div className="absolute right-3 bottom-3 flex items-center gap-1">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="p-2 hover:bg-gray-200/50 rounded-full transition-colors"
                                        >
                                            <FiSmile className="w-4 h-4 text-gray-600" />
                                        </motion.button>

                                        {/* Voice Message Button */}
                                        {!messageInput.trim() ? (
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onMouseDown={startRecording}
                                                onMouseUp={stopRecording}
                                                onMouseLeave={stopRecording}
                                                className={`p-2.5 rounded-full transition-all duration-200 ${isRecording
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                                    }`}
                                            >
                                                <FiMic className="w-4 h-4" />
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={handleSendMessage}
                                                className="p-2.5 bg-gradient-to-r from-[#FF5900] to-[#FF8A00] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                                            >
                                                <FiSend className="w-4 h-4" />
                                            </motion.button>
                                        )}
                                    </div>
                                </div>

                                {/* Emoji Picker */}
                                <AnimatePresence>
                                    {showEmojiPicker && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                            className="absolute bottom-full right-6 mb-2 p-4 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl z-50 w-72"
                                        >
                                            <div className="grid grid-cols-8 gap-2">
                                                {EMOJI_LIST.map((emoji, index) => (
                                                    <motion.button
                                                        key={index}
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEmojiSelect(emoji)}
                                                        className="p-2 text-lg hover:bg-gray-100/50 rounded-xl transition-colors duration-200"
                                                    >
                                                        {emoji}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </>
                ) : (
                    // No Room Selected
                    <div className="flex-1 flex items-center justify-center p-8 bg-white/50 backdrop-blur-sm">
                        <div className="text-center max-w-md">
                            <motion.div
                                className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-[#FF5900] to-[#FF8A00] rounded-3xl flex items-center justify-center shadow-2xl"
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <FiMessageCircle className="w-14 h-14 text-white" />
                            </motion.div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                                Welcome to Echo
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                Connect with event rooms, join amazing groups, and chat with friends from around the world.
                            </p>
                            {isMobile && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-[#FF5900] to-[#FF8A00] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    Browse Rooms
                                </motion.button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                multiple
            />

            {/* Custom Scrollbar & Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.05);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #FF5900, #FF8A00);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #e04d00, #e07500);
                }
                
                /* Custom textarea auto-resize */
                textarea {
                    resize: none;
                    overflow-y: auto;
                }
                
                /* Smooth transitions */
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                /* Glassmorphism effects */
                .backdrop-blur-xl {
                    backdrop-filter: blur(20px);
                }
                
                .backdrop-blur-sm {
                    backdrop-filter: blur(4px);
                }

                /* Prevent horizontal overflow */
                .max-w-sm, .max-w-md {
                    max-width: 100%;
                }
            `}</style>
        </div>
    );
}