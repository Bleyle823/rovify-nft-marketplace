/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useSpring, useTransform, PanInfo } from 'framer-motion';
import {
    FiChevronRight, FiUsers, FiArchive, FiBarChart2,
    FiCheckCircle, FiClock, FiTrendingUp, FiCheck,
    FiX, FiExternalLink, FiCalendar, FiActivity,
    FiThumbsUp, FiThumbsDown, FiAlertCircle, FiInfo,
    FiCopy, FiArrowUpRight, FiShare2, FiEye, FiSearch,
    FiFilter, FiGrid, FiList, FiMenu, FiBell, FiSettings,
    FiChevronDown, FiRefreshCw, FiDownload, FiUpload,
    FiChevronLeft, FiHeart, FiMessageCircle, FiBookmark,
    FiSend, FiMoreHorizontal, FiZap, FiGlobe, FiLink,
    FiTwitter, FiWifi, FiTv, FiEdit, FiTrash2, FiFlag,
    FiVolume2, FiVolumeX, FiStar
} from 'react-icons/fi';
import { IoRocket, IoWallet, IoShareSocial, IoSparkles } from 'react-icons/io5';
import { BsThreeDots, BsLightning } from 'react-icons/bs';

// Enhanced interfaces
interface TokenInfo {
    symbol: string;
    name: string;
    totalSupply: number;
    marketCap: string;
    circulatingSupply: number;
    price: string;
    priceChange24h: number;
    logoUrl: string;
}

interface Proposal {
    id: string;
    title: string;
    description: string;
    proposer: string;
    proposerAvatar: string;
    status: 'active' | 'passed' | 'rejected' | 'pending';
    startDate: string;
    endDate: string;
    votesFor: number;
    votesAgainst: number;
    totalVotes: number;
    category: 'governance' | 'treasury' | 'social' | 'event' | 'protocol';
    categoryColor: string;
}

interface TreasuryAsset {
    symbol: string;
    name: string;
    amount: number;
    value: string;
    logoUrl: string;
    change24h: number;
}

interface ActivityItem {
    id: string;
    type: 'proposal' | 'vote' | 'distribution' | 'treasury';
    title: string;
    description: string;
    date: string;
    time: string;
    user: string;
    userAvatar: string;
    icon: string;
    amount?: string;
    status: 'success' | 'pending' | 'failed';
}

interface ActionSheetOption {
    id: string;
    label: string;
    icon: React.ElementType;
    action: () => void;
    color?: 'default' | 'destructive' | 'primary';
    disabled?: boolean;
}

// Enhanced types for action sheet items
type ActionSheetItem = (Proposal | ActivityItem) & {
    contextType?: 'proposal' | 'activity';
};

// Enhanced Skeleton Components with proper responsive heights
const SkeletonCard = ({ className = "" }: { className?: string }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse h-full ${className}`}>
        <div className="flex items-start justify-between h-full">
            <div className="flex-1 flex flex-col h-full">
                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-32 mb-1 flex-1"></div>
                <div className="h-3 bg-gray-200 rounded w-24 mt-auto"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0"></div>
        </div>
    </div>
);

const SkeletonProposal = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse h-full min-h-[300px]">
        <div className="flex gap-2 mb-4">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
        <div className="h-2 bg-gray-200 rounded w-full mb-3"></div>
        <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
    </div>
);

// iOS-Style Action Sheet Component
const IOSActionSheet = ({
    isOpen,
    onClose,
    title,
    options,
    item
}: {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    options: ActionSheetOption[];
    item?: ActionSheetItem;
}) => {
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === backdropRef.current) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={backdropRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="w-full max-w-md mx-4 mb-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Main Actions */}
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl mb-3">
                            {title && (
                                <div className="px-6 py-4 border-b border-gray-200/50">
                                    <h3 className="text-sm font-medium text-gray-600 text-center">{title}</h3>
                                </div>
                            )}
                            <div className="py-2">
                                {options.map((option, index) => (
                                    <motion.button
                                        key={option.id}
                                        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            option.action();
                                            onClose();
                                        }}
                                        disabled={option.disabled}
                                        className={`w-full flex items-center px-6 py-4 text-left transition-colors ${option.color === 'destructive'
                                            ? 'text-red-600'
                                            : option.color === 'primary'
                                                ? 'text-blue-600'
                                                : 'text-gray-900'
                                            } ${option.disabled ? 'opacity-50' : ''} ${index === 0 ? '' : 'border-t border-gray-200/30'
                                            }`}
                                    >
                                        <option.icon className="w-5 h-5 mr-4" />
                                        <span className="font-medium">{option.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Cancel Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="w-full bg-white/95 backdrop-blur-xl rounded-2xl py-4 text-blue-600 font-semibold shadow-2xl"
                        >
                            Cancel
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Enhanced Share Modal with better UX
const ShareModal = ({
    isOpen,
    onClose,
    item,
}: {
    isOpen: boolean;
    onClose: () => void;
    item: Proposal | ActivityItem | null;
}) => {
    const [copied, setCopied] = useState(false);
    const shareUrl = `https://rovify.io/dao/${'type' in (item ?? {}) ? (item as ActivityItem).type : 'proposal'}/${item?.id}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareOptions = [
        {
            name: 'Copy Link',
            icon: FiLink,
            action: handleCopy,
            color: 'bg-gray-500',
            description: 'Copy link to clipboard'
        },
        {
            name: 'Twitter',
            icon: FiTwitter,
            action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(item?.title || '')}`),
            color: 'bg-blue-500',
            description: 'Share on Twitter'
        },
        {
            name: 'Telegram',
            icon: FiSend,
            action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`),
            color: 'bg-blue-400',
            description: 'Share on Telegram'
        },
        {
            name: 'More',
            icon: IoShareSocial,
            action: () => {
                if (navigator.share) {
                    navigator.share({
                        title: item?.title,
                        url: shareUrl
                    });
                }
            },
            color: 'bg-purple-500',
            description: 'More options'
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: 100, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 100, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Share</h3>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                            >
                                <FiX className="w-5 h-5" />
                            </motion.button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {shareOptions.map((option, index) => (
                                <motion.button
                                    key={option.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={option.action}
                                    className="flex flex-col items-center p-4 rounded-2xl border border-gray-200/50 hover:bg-gray-50/80 transition-all group"
                                >
                                    <motion.div
                                        className={`w-14 h-14 ${option.color} rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow`}
                                        whileHover={{ rotate: [0, -5, 5, 0] }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <option.icon className="w-7 h-7 text-white" />
                                    </motion.div>
                                    <span className="text-sm font-medium text-gray-900 mb-1">{option.name}</span>
                                    <span className="text-xs text-gray-500 text-center">{option.description}</span>
                                </motion.button>
                            ))}
                        </div>

                        <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
                            <div className="flex items-center justify-between">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 bg-transparent text-sm text-gray-600 truncate mr-3 outline-none"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCopy}
                                    className={`px-3 py-2 rounded-xl font-medium text-sm transition-all ${copied
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                        }`}
                                >
                                    {copied ? (
                                        <span className="flex items-center">
                                            <FiCheck className="w-4 h-4 mr-1" />
                                            Copied!
                                        </span>
                                    ) : (
                                        'Copy'
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default function EnhancedDAOPortal() {
    // Enhanced state management
    const [activeSection, setActiveSection] = useState('overview');
    const [isWalletConnected, setIsWalletConnected] = useState(true);
    const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
    const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
    const [voteType, setVoteType] = useState<'for' | 'against' | null>(null);
    const [treasuryValue, setTreasuryValue] = useState('$1,245,678');
    const [isLoadingWallet, setIsLoadingWallet] = useState(false);
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [proposalFilter, setProposalFilter] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareItem, setShareItem] = useState<Proposal | ActivityItem | null>(null);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [actionSheetItem, setActionSheetItem] = useState<ActionSheetItem | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "New Proposal Created",
            message: "Community Creator Grant Program is now live for voting",
            time: "2 mins ago",
            unread: true,
            type: "proposal"
        },
        {
            id: 2,
            title: "Vote Reminder",
            message: "Increase Event Creator Rewards proposal ends in 2 days",
            time: "1 hour ago",
            unread: true,
            type: "reminder"
        },
        {
            id: 3,
            title: "Treasury Update",
            message: "Monthly treasury report is now available",
            time: "3 hours ago",
            unread: false,
            type: "info"
        }
    ]);

    const modalRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);

    // Mock data
    const tokenInfo: TokenInfo = {
        symbol: '$ROVI',
        name: 'Rovify Token',
        totalSupply: 100000000,
        marketCap: '$24,580,000',
        circulatingSupply: 45000000,
        price: '$0.546',
        priceChange24h: 3.2,
        logoUrl: '/api/placeholder/32/32',
    };

    const treasuryAssets: TreasuryAsset[] = [
        {
            symbol: 'ETH',
            name: 'Ethereum',
            amount: 120.45,
            value: '$256,780',
            logoUrl: '/api/placeholder/32/32',
            change24h: 2.1,
        },
        {
            symbol: 'USDC',
            name: 'USD Coin',
            amount: 450000,
            value: '$450,000',
            logoUrl: '/api/placeholder/32/32',
            change24h: 0.1,
        },
        {
            symbol: '$ROVI',
            name: 'Rovify Token',
            amount: 980000,
            value: '$538,898',
            logoUrl: '/api/placeholder/32/32',
            change24h: 3.2,
        },
    ];

    const proposals: Proposal[] = [
        {
            id: 'prop-001',
            title: 'Increase Event Creator Rewards',
            description: 'Proposal to increase the reward allocation for event creators from 2% to 3.5% of platform revenue to incentivize more high-quality events.',
            proposer: '0x7Fc66...1D2a',
            proposerAvatar: '/api/placeholder/40/40',
            status: 'active',
            startDate: '2025-05-10',
            endDate: '2025-05-17',
            votesFor: 1250000,
            votesAgainst: 450000,
            totalVotes: 1700000,
            category: 'governance',
            categoryColor: 'bg-purple-500',
        },
        {
            id: 'prop-002',
            title: 'Add Support for Solana Chain',
            description: 'Expanding our platform to support Solana blockchain for events and NFT tickets to reduce gas fees and increase transaction speed.',
            proposer: '0x3Ab55...F78c',
            proposerAvatar: '/api/placeholder/40/40',
            status: 'passed',
            startDate: '2025-04-28',
            endDate: '2025-05-05',
            votesFor: 2100000,
            votesAgainst: 350000,
            totalVotes: 2450000,
            category: 'protocol',
            categoryColor: 'bg-blue-500',
        },
        {
            id: 'prop-003',
            title: 'Fund Berlin NFT Conference',
            description: 'Allocate 15,000 USDC from treasury to sponsor the upcoming Berlin NFT Conference to increase platform visibility.',
            proposer: '0x9Dc33...A1e5',
            proposerAvatar: '/api/placeholder/40/40',
            status: 'active',
            startDate: '2025-05-12',
            endDate: '2025-05-19',
            votesFor: 890000,
            votesAgainst: 910000,
            totalVotes: 1800000,
            category: 'treasury',
            categoryColor: 'bg-green-500',
        },
        {
            id: 'prop-004',
            title: 'Community Creator Grant Program',
            description: 'Establish a quarterly grant program of 50,000 $ROVI tokens to fund innovative community-led event concepts.',
            proposer: '0x5Fa88...B3c7',
            proposerAvatar: '/api/placeholder/40/40',
            status: 'pending',
            startDate: '2025-05-20',
            endDate: '2025-05-27',
            votesFor: 0,
            votesAgainst: 0,
            totalVotes: 0,
            category: 'social',
            categoryColor: 'bg-yellow-500',
        },
        {
            id: 'prop-005',
            title: 'Exclusive NFT Series for DAO Members',
            description: 'Create a limited edition NFT series available only to DAO members who have staked at least 1000 $ROVI tokens.',
            proposer: '0x2Bd99...E4f8',
            proposerAvatar: '/api/placeholder/40/40',
            status: 'rejected',
            startDate: '2025-04-15',
            endDate: '2025-04-22',
            votesFor: 780000,
            votesAgainst: 1320000,
            totalVotes: 2100000,
            category: 'event',
            categoryColor: 'bg-red-500',
        },
    ];

    const activityFeed: ActivityItem[] = [
        {
            id: 'act-001',
            type: 'proposal',
            title: 'New Proposal Created',
            description: 'Proposal "Exclusive NFT Series for DAO Members" has been submitted for voting.',
            date: 'Today',
            time: '2:30 PM',
            user: '0x2Bd99...E4f8',
            userAvatar: '/api/placeholder/40/40',
            icon: '📝',
            status: 'success',
        },
        {
            id: 'act-002',
            type: 'vote',
            title: 'Proposal Passed',
            description: 'Proposal "Add Support for Solana Chain" has been approved with 85.7% of votes.',
            date: 'Yesterday',
            time: '4:15 PM',
            user: 'Governance Bot',
            userAvatar: '/api/placeholder/40/40',
            icon: '✅',
            status: 'success',
        },
        {
            id: 'act-003',
            type: 'treasury',
            title: 'Treasury Transaction',
            description: '15,000 USDC allocated for sponsoring ETHGlobal hackathon.',
            date: 'June 20',
            time: '10:20 AM',
            user: 'Treasury Multisig',
            userAvatar: '/api/placeholder/40/40',
            icon: '💰',
            amount: '-15,000 USDC',
            status: 'success',
        },
        {
            id: 'act-004',
            type: 'distribution',
            title: 'Token Distribution',
            description: '250,000 $ROVI tokens distributed to event creators as rewards.',
            date: 'June 18',
            time: '9:45 AM',
            user: 'Distribution Bot',
            userAvatar: '/api/placeholder/40/40',
            icon: '🎁',
            amount: '+250,000 $ROVI',
            status: 'success',
        },
        {
            id: 'act-005',
            type: 'proposal',
            title: 'Proposal Rejected',
            description: 'Proposal "Increase Platform Fees" was rejected by the community.',
            date: 'June 17',
            time: '3:30 PM',
            user: 'Governance Bot',
            userAvatar: '/api/placeholder/40/40',
            icon: '❌',
            status: 'failed',
        },
    ];

    // Navigation items
    const navigationItems = [
        { id: 'overview', label: 'Overview', icon: FiBarChart2 },
        { id: 'proposals', label: 'Proposals', icon: FiArchive },
        { id: 'treasury', label: 'Treasury', icon: IoWallet },
        { id: 'activity', label: 'Activity', icon: FiActivity },
    ];

    // Utility functions
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const calculateVotePercentage = (proposal: Proposal, type: 'for' | 'against'): number => {
        if (proposal.totalVotes === 0) return 0;
        return type === 'for'
            ? (proposal.votesFor / proposal.totalVotes) * 100
            : (proposal.votesAgainst / proposal.totalVotes) * 100;
    };

    const getStatusColor = (status: Proposal['status']): string => {
        switch (status) {
            case 'active': return 'bg-blue-500';
            case 'passed': return 'bg-green-500';
            case 'rejected': return 'bg-red-500';
            case 'pending': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status: Proposal['status']): string => {
        switch (status) {
            case 'active': return 'Active';
            case 'passed': return 'Passed';
            case 'rejected': return 'Rejected';
            case 'pending': return 'Pending';
            default: return 'Unknown';
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysRemaining = (endDate: string): number => {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Enhanced event handlers
    const handleRefresh = async () => {
        setIsRefreshing(true);
        setIsLoading(true);
        // Simulate data refresh
        setTimeout(() => {
            setIsRefreshing(false);
            setIsLoading(false);
        }, 1500);
    };

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText("0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9");
            setCopiedToClipboard(true);
            setTimeout(() => setCopiedToClipboard(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = (item: Proposal | ActivityItem) => {
        setShareItem(item);
        setShowShareModal(true);
    };

    const handleConnectWallet = async () => {
        setIsLoadingWallet(true);
        setTimeout(() => {
            setIsWalletConnected(true);
            setIsLoadingWallet(false);
        }, 1500);
    };

    const handleDisconnectWallet = () => {
        setIsWalletConnected(false);
    };

    const handleVoteSubmit = async () => {
        setIsVoting(true);
        // Simulate voting transaction
        setTimeout(() => {
            setIsVoting(false);
            setShowVoteConfirmation(true);
        }, 2000);
    };

    const handleActionSheetOpen = (item: Proposal | ActivityItem, type: 'proposal' | 'activity') => {
        setActionSheetItem({ ...item, contextType: type });
        setShowActionSheet(true);
    };

    const getActionSheetOptions = (item: ActionSheetItem): ActionSheetOption[] => {
        const baseOptions: ActionSheetOption[] = [
            {
                id: 'share',
                label: 'Share',
                icon: FiShare2,
                action: () => handleShare(item),
            },
            {
                id: 'bookmark',
                label: 'Bookmark',
                icon: FiBookmark,
                action: () => console.log('Bookmark', item.id),
            },
            {
                id: 'copy-link',
                label: 'Copy Link',
                icon: FiLink,
                action: () => handleCopyAddress(),
            },
        ];

        if (item.contextType === 'proposal') {
            baseOptions.unshift({
                id: 'view-details',
                label: 'View Details',
                icon: FiEye,
                action: () => setSelectedProposal(item.id),
                color: 'primary'
            });

            if ('status' in item && item.status === 'active') {
                baseOptions.push({
                    id: 'set-reminder',
                    label: 'Set Reminder',
                    icon: FiBell,
                    action: () => console.log('Set reminder for', item.id),
                });
            }
        }

        baseOptions.push(
            {
                id: 'report',
                label: 'Report',
                icon: FiFlag,
                action: () => console.log('Report', item.id),
                color: 'destructive'
            }
        );

        return baseOptions;
    };

    const navigateToEvents = () => {
        console.log('Navigating back to events...');
    };

    // Filter proposals
    const filteredProposals = proposals.filter(proposal => {
        const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            proposal.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = proposalFilter === 'all' || proposal.status === proposalFilter;
        return matchesSearch && matchesFilter;
    });

    // Close handlers
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsSidebarOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentProposal = proposals.find(p => p.id === selectedProposal);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Enhanced Sidebar */}
            <AnimatePresence>
                {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                    <motion.div
                        ref={sidebarRef}
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed lg:relative z-40 w-64 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-2xl lg:shadow-none"
                    >
                        {/* Sidebar Header */}
                        <div className="p-6 border-b border-gray-200/50">
                            <div className="flex items-center justify-between">
                                <motion.div
                                    className="flex items-center cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                    onClick={navigateToEvents}
                                >
                                    <motion.div
                                        className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3 shadow-lg"
                                        whileHover={{ rotate: [0, -5, 5, 0] }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <span className="text-white font-bold text-lg">
                                            <Image
                                                src="/images/contents/rovi-logo.png"
                                                alt="Rovify Logo"
                                                width={24}
                                                height={24}
                                                className="object-contain relative z-10"
                                                onError={(e) => {
                                                    // Fallback
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = '<span class="text-white font-bold text-lg relative z-10">R</span>';
                                                    }
                                                }}
                                            />
                                        </span>
                                    </motion.div>
                                    <div>
                                        <h2 className="font-semibold text-gray-900">Rovify DAO</h2>
                                        <p className="text-xs text-gray-500">Governance Portal</p>
                                    </div>
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="lg:hidden text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                                >
                                    <FiX className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Wallet Info */}
                        {isWalletConnected && (
                            <div className="p-4 border-b border-gray-200/50">
                                <motion.div
                                    className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100/50 backdrop-blur-sm"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-gray-600">Your Balance</span>
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={handleCopyAddress}
                                                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-white/50"
                                            >
                                                {copiedToClipboard ? <FiCheck className="w-4 h-4 text-green-500" /> : <FiCopy className="w-4 h-4" />}
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-white/50"
                                            >
                                                <FiSettings className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>
                                    <p className="font-bold text-gray-900 text-lg">35,450 $ROVI</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-xs text-gray-500">0x7Fc6...DDaE9</p>
                                        <span className="text-xs text-green-600 font-medium">≈ $19,356</span>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Navigation */}
                        <nav className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-2">
                                {navigationItems.map((item) => (
                                    <motion.button
                                        key={item.id}
                                        whileHover={{ x: 4, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setActiveSection(item.id);
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all relative overflow-hidden ${activeSection === item.id
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.label}
                                        {activeSection === item.id && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="ml-auto w-2 h-2 bg-white rounded-full"
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-200/50">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h4>
                                <div className="space-y-2">
                                    {[
                                        { icon: IoRocket, label: 'Create Proposal' },
                                        { icon: FiZap, label: 'Delegate Votes' },
                                        { icon: FiTv, label: 'Browse Events' }
                                    ].map((action, index) => (
                                        <motion.button
                                            key={action.label}
                                            whileHover={{ x: 2, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={action.label === 'Browse Events' ? navigateToEvents : undefined}
                                            className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                                        >
                                            <action.icon className="w-4 h-4 mr-3" />
                                            {action.label}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </nav>

                        {/* Quick Stats */}
                        <div className="p-4 border-t border-gray-200/50 bg-gray-50/50 backdrop-blur-sm">
                            <div className="space-y-3">
                                {[
                                    { label: 'Treasury', value: treasuryValue },
                                    { label: 'Members', value: '3,782' },
                                    { label: 'Active Proposals', value: '2' }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex justify-between items-center"
                                    >
                                        <span className="text-xs text-gray-500">{stat.label}</span>
                                        <span className="text-xs font-semibold text-gray-900">{stat.value}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Enhanced Header */}
                <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-4 lg:px-6 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden mr-4 text-gray-600 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100"
                            >
                                <FiMenu className="w-5 h-5" />
                            </motion.button>

                            {/* Breadcrumb Navigation */}
                            <div className="flex items-center">
                                {/* <motion.button
                                    whileHover={{ scale: 1.05, x: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={navigateToEvents}
                                    className="flex items-center text-gray-500 hover:text-gray-700 transition-all"
                                >
                                    <FiChevronLeft className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">Events</span>
                                </motion.button>
                                <FiChevronRight className="w-4 h-4 mx-2 text-gray-400" /> */}
                                <div>
                                    <h1 className="text-lg lg:text-xl font-bold text-gray-900">
                                        {navigationItems.find(item => item.id === activeSection)?.label}
                                    </h1>
                                    <p className="text-xs text-gray-500 hidden sm:block">Decentralized governance for the future of events</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.05, rotate: 180 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all"
                            >
                                <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all relative"
                            >
                                <FiBell className="w-5 h-5" />
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center"
                                >
                                    <span className="text-xs text-white font-bold">3</span>
                                </motion.span>
                            </motion.button>

                            {!isWalletConnected ? (
                                <motion.button
                                    onClick={handleConnectWallet}
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                    disabled={isLoadingWallet}
                                >
                                    {isLoadingWallet ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            <span className="hidden sm:inline">Connecting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <IoWallet className="w-4 h-4" />
                                            <span className="hidden sm:inline">Connect Wallet</span>
                                        </>
                                    )}
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    onClick={handleDisconnectWallet}
                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl transition-all"
                                >
                                    <motion.div
                                        className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center"
                                        whileHover={{ rotate: [0, -10, 10, 0] }}
                                    >
                                        {/* <div className="w-3 h-3 bg-white rounded-full"></div> */}
                                        <Image
                                            src="/images/contents/rovi-logo.png"
                                            alt="Rovify Logo"
                                            width={18}
                                            height={18}
                                            className="object-contain relative z-10"
                                            onError={(e) => {
                                                // Fallback
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    parent.innerHTML = '<span class="text-white font-bold text-lg relative z-10">R</span>';
                                                }
                                            }}
                                        />
                                    </motion.div>
                                    <span className="hidden sm:inline font-semibold">35,450 $ROVI</span>
                                </motion.button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main
                    ref={mainContentRef}
                    className="flex-1 overflow-auto custom-scrollbar"
                >
                    <div className="p-4 lg:p-6">
                        {/* Overview Section */}
                        {activeSection === 'overview' && (
                            <div className="space-y-6">
                                {/* Enhanced Stats Grid with Equal Heights */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {isLoading ? (
                                        Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
                                    ) : (
                                        [
                                            {
                                                title: 'Treasury Value',
                                                value: treasuryValue,
                                                subtitle: '+5.3% this month',
                                                icon: FiBarChart2,
                                                color: 'from-green-400 to-green-600',
                                                delay: 0.1
                                            },
                                            {
                                                title: 'Members',
                                                value: '3,782',
                                                subtitle: '+124 new this week',
                                                icon: FiUsers,
                                                color: 'from-blue-400 to-blue-600',
                                                delay: 0.2
                                            },
                                            {
                                                title: 'Active Proposals',
                                                value: '2',
                                                subtitle: '1 ending soon',
                                                icon: FiArchive,
                                                color: 'from-purple-400 to-purple-600',
                                                delay: 0.3
                                            },
                                            {
                                                title: '$ROVI Price',
                                                value: tokenInfo.price,
                                                subtitle: `${tokenInfo.priceChange24h >= 0 ? '+' : ''}${tokenInfo.priceChange24h}% (24h)`,
                                                icon: IoSparkles,
                                                color: 'from-orange-400 to-red-500',
                                                delay: 0.4
                                            }
                                        ].map((stat, index) => (
                                            <motion.div
                                                key={stat.title}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: stat.delay }}
                                                whileHover={{ y: -4, scale: 1.02 }}
                                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-lg transition-all duration-300 h-full min-h-[140px] flex flex-col"
                                            >
                                                <div className="flex items-start justify-between flex-1">
                                                    <div className="flex-1">
                                                        <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                                                        <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-2">{stat.value}</h3>
                                                        <p className={`text-sm font-medium flex items-center ${stat.subtitle.includes('+') ? 'text-green-500' :
                                                            stat.subtitle.includes('-') ? 'text-red-500' : 'text-orange-500'
                                                            }`}>
                                                            <FiTrendingUp className="w-3 h-3 mr-1" />
                                                            {stat.subtitle}
                                                        </p>
                                                    </div>
                                                    <motion.div
                                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                                                        whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <stat.icon className="w-6 h-6 text-white" />
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>

                                {/* Active Proposals & Token Info */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                                            <div className="p-6 border-b border-gray-100/50">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-900 text-lg">Active Proposals</h3>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05, x: 2 }}
                                                        onClick={() => setActiveSection('proposals')}
                                                        className="text-orange-500 text-sm font-medium hover:text-orange-600 flex items-center transition-colors"
                                                    >
                                                        View All
                                                        <FiChevronRight className="w-4 h-4 ml-1" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                            <div className="divide-y divide-gray-100/50">
                                                {isLoading ? (
                                                    Array(3).fill(0).map((_, i) => <SkeletonProposal key={i} />)
                                                ) : (
                                                    proposals.filter(p => p.status === 'active').slice(0, 3).map((proposal, index) => (
                                                        <motion.div
                                                            key={proposal.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                                                            className="p-6 cursor-pointer group transition-all"
                                                            onClick={() => setSelectedProposal(proposal.id)}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center mb-3">
                                                                        <span className={`inline-block w-2 h-2 rounded-full ${proposal.categoryColor} mr-2`}></span>
                                                                        <span className="text-xs text-gray-500 capitalize font-medium">{proposal.category}</span>
                                                                        <span className="text-xs text-gray-400 mx-2">•</span>
                                                                        <span className="text-xs text-gray-500">Ends in {getDaysRemaining(proposal.endDate)} days</span>
                                                                    </div>
                                                                    <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{proposal.title}</h4>
                                                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{proposal.description}</p>

                                                                    {/* Enhanced Vote Progress */}
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center justify-between text-xs">
                                                                            <span className="text-green-600 font-semibold">
                                                                                {formatNumber(proposal.votesFor)} For ({calculateVotePercentage(proposal, 'for').toFixed(1)}%)
                                                                            </span>
                                                                            <span className="text-red-600 font-semibold">
                                                                                {formatNumber(proposal.votesAgainst)} Against ({calculateVotePercentage(proposal, 'against').toFixed(1)}%)
                                                                            </span>
                                                                        </div>
                                                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                                            <motion.div
                                                                                initial={{ width: 0 }}
                                                                                animate={{ width: `${calculateVotePercentage(proposal, 'for')}%` }}
                                                                                transition={{ duration: 1, delay: index * 0.2 }}
                                                                                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                                                                            ></motion.div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4 flex flex-col items-end gap-2">
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05, y: -1 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        className="px-4 py-2 text-sm font-medium text-orange-500 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all"
                                                                    >
                                                                        Vote
                                                                    </motion.button>
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleActionSheetOpen(proposal, 'proposal');
                                                                        }}
                                                                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all"
                                                                    >
                                                                        <BsThreeDots className="w-4 h-4" />
                                                                    </motion.button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Token Info Sidebar */}
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden h-fit">
                                        <div className="p-6 border-b border-gray-100/50">
                                            <h3 className="font-semibold text-gray-900 text-lg">Token Info</h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center mb-6">
                                                <motion.div
                                                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mr-4 shadow-lg"
                                                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {/* <div className="w-8 h-8 bg-white rounded-full"></div> */}
                                                    <Image
                                                        src="/images/contents/rovi-logo.png"
                                                        alt="Rovify Logo"
                                                        width={24}
                                                        height={24}
                                                        className="object-contain relative z-10"
                                                        onError={(e) => {
                                                            // Fallback
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const parent = target.parentElement;
                                                            if (parent) {
                                                                parent.innerHTML = '<span class="text-white font-bold text-lg relative z-10">R</span>';
                                                            }
                                                        }}
                                                    />
                                                </motion.div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{tokenInfo.name}</h4>
                                                    <p className="text-gray-500 text-sm">{tokenInfo.symbol}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-6">
                                                {[
                                                    { label: 'Price', value: tokenInfo.price },
                                                    { label: 'Market Cap', value: tokenInfo.marketCap },
                                                    { label: 'Circulating Supply', value: formatNumber(tokenInfo.circulatingSupply) }
                                                ].map((item, index) => (
                                                    <motion.div
                                                        key={item.label}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="flex justify-between items-center"
                                                    >
                                                        <span className="text-gray-500 text-sm">{item.label}</span>
                                                        <span className="font-semibold text-gray-900">{item.value}</span>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <div className="border-t border-gray-100/50 pt-6">
                                                <h4 className="font-semibold text-gray-900 mb-4">Utilities</h4>
                                                <div className="space-y-3">
                                                    {['Governance voting', 'Event creator rewards', 'Premium features', 'NFT discounts'].map((utility, index) => (
                                                        <motion.div
                                                            key={utility}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="flex items-center"
                                                        >
                                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                                <FiCheckCircle className="w-3 h-3 text-green-600" />
                                                            </div>
                                                            <span className="text-sm text-gray-700">{utility}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02, y: -1 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full mt-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
                                            >
                                                View on Explorer
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Proposals Section */}
                        {activeSection === 'proposals' && (
                            <div className="space-y-6">
                                {/* Enhanced Controls */}
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Search */}
                                        <motion.div
                                            className="relative"
                                            whileFocus={{ scale: 1.02 }}
                                        >
                                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Search proposals..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
                                            />
                                        </motion.div>

                                        {/* Filter */}
                                        <motion.select
                                            whileFocus={{ scale: 1.02 }}
                                            value={proposalFilter}
                                            onChange={(e) => setProposalFilter(e.target.value)}
                                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="passed">Passed</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="pending">Pending</option>
                                        </motion.select>

                                        {/* View Toggle */}
                                        <div className="flex items-center bg-gray-100/80 backdrop-blur-sm rounded-xl p-1">
                                            {[
                                                { mode: 'list', icon: FiList },
                                                { mode: 'grid', icon: FiGrid }
                                            ].map(({ mode, icon: Icon }) => (
                                                <motion.button
                                                    key={mode}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setViewMode(mode as 'grid' | 'list')}
                                                    className={`p-2 rounded-lg transition-all ${viewMode === mode ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <IoRocket className="w-4 h-4" />
                                        <span>Create Proposal</span>
                                    </motion.button>
                                </div>

                                {/* Proposals Content with Proper Heights */}
                                <div className={viewMode === 'grid'
                                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                    : 'space-y-4'
                                }>
                                    {isLoading ? (
                                        Array(6).fill(0).map((_, i) => <SkeletonProposal key={i} />)
                                    ) : (
                                        filteredProposals.map((proposal, index) => (
                                            <motion.div
                                                key={proposal.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ y: -4, scale: 1.02 }}
                                                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group ${viewMode === 'grid' ? 'h-full min-h-[320px] flex flex-col' : ''
                                                    }`}
                                                onClick={() => setSelectedProposal(proposal.id)}
                                            >
                                                <div className={`${viewMode === 'grid' ? 'flex flex-col h-full' : ''}`}>
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(proposal.status)} text-white`}>
                                                                {getStatusText(proposal.status)}
                                                            </span>
                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${proposal.categoryColor} text-white`}>
                                                                {proposal.category.charAt(0).toUpperCase() + proposal.category.slice(1)}
                                                            </span>
                                                        </div>
                                                        {proposal.status === 'active' && (
                                                            <span className="text-xs text-orange-500 font-medium flex items-center bg-orange-50 px-2 py-1 rounded-full">
                                                                <FiClock className="w-3 h-3 mr-1" />
                                                                {getDaysRemaining(proposal.endDate)}d left
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className={viewMode === 'grid' ? 'flex-1' : ''}>
                                                        <h4 className="font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">{proposal.title}</h4>
                                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{proposal.description}</p>
                                                    </div>

                                                    {/* Enhanced Vote Progress */}
                                                    {proposal.totalVotes > 0 && (
                                                        <div className="mb-4">
                                                            <div className="flex justify-between text-xs mb-2">
                                                                <span className="text-green-600 font-semibold">
                                                                    {calculateVotePercentage(proposal, 'for').toFixed(1)}% For
                                                                </span>
                                                                <span className="text-red-600 font-semibold">
                                                                    {calculateVotePercentage(proposal, 'against').toFixed(1)}% Against
                                                                </span>
                                                            </div>
                                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${calculateVotePercentage(proposal, 'for')}%` }}
                                                                    transition={{ duration: 1, delay: index * 0.1 }}
                                                                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                                                                ></motion.div>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                {formatNumber(proposal.totalVotes)} votes cast
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between mt-auto">
                                                        <div className="flex items-center">
                                                            <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mr-2"></div>
                                                            <span className="text-xs text-gray-500">{proposal.proposer}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleActionSheetOpen(proposal, 'proposal');
                                                                }}
                                                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all"
                                                            >
                                                                <BsThreeDots className="w-4 h-4" />
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05, y: -1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${proposal.status === 'active'
                                                                    ? 'text-orange-500 bg-orange-50 hover:bg-orange-100'
                                                                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                                                                    }`}
                                                            >
                                                                {proposal.status === 'active' ? 'Vote' : 'View'}
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>

                                {filteredProposals.length === 0 && !isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-16"
                                    >
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <FiArchive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        </motion.div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
                                        <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -1 }}
                                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                                        >
                                            Create First Proposal
                                        </motion.button>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Treasury Section */}
                        {activeSection === 'treasury' && (
                            <div className="space-y-6">
                                {/* Treasury Overview with Equal Heights */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {isLoading ? (
                                        Array(3).fill(0).map((_, i) => <SkeletonCard key={i} className="min-h-[120px]" />)
                                    ) : (
                                        [
                                            { title: 'Total Value', value: treasuryValue, subtitle: '+5.3% this month', delay: 0.1 },
                                            { title: 'Assets', value: treasuryAssets.length.toString(), subtitle: 'Diversified portfolio', delay: 0.2 },
                                            { title: 'Multisig', value: '5/9', subtitle: 'Confirmations required', delay: 0.3 }
                                        ].map((item, index) => (
                                            <motion.div
                                                key={item.title}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: item.delay }}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6 h-full min-h-[120px] flex flex-col justify-center"
                                            >
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                                                <p className="text-3xl font-bold text-gray-900 mb-1">{item.value}</p>
                                                <p className="text-gray-500 text-sm">{item.subtitle}</p>
                                            </motion.div>
                                        ))
                                    )}
                                </div>

                                {/* Treasury Assets */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100/50">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900 text-lg">Treasury Assets</h3>
                                            <div className="flex items-center gap-2">
                                                {[
                                                    { icon: FiDownload, label: 'Export' },
                                                    { icon: FiUpload, label: 'Import' }
                                                ].map(({ icon: Icon, label }) => (
                                                    <motion.button
                                                        key={label}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all"
                                                        title={label}
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="bg-gray-50/80 backdrop-blur-sm">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Asset</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">24h Change</th>
                                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200/50">
                                                {treasuryAssets.map((asset, index) => (
                                                    <motion.tr
                                                        key={asset.symbol}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                                                        className="cursor-pointer"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <motion.div
                                                                    className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mr-3 flex items-center justify-center"
                                                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                                                >
                                                                    <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full"></div>
                                                                </motion.div>
                                                                <div>
                                                                    <div className="text-sm font-semibold text-gray-900">{asset.name}</div>
                                                                    <div className="text-xs text-gray-500">{asset.symbol}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{asset.amount.toLocaleString()}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-semibold text-gray-900">{asset.value}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className={`text-sm font-semibold flex items-center ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                <FiTrendingUp className="w-3 h-3 mr-1" />
                                                                {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                className="text-orange-500 hover:text-orange-700 text-sm font-medium transition-colors"
                                                            >
                                                                View Details
                                                            </motion.button>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Activity Section */}
                        {activeSection === 'activity' && (
                            <div className="space-y-6">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100/50">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900 text-lg">Activity Timeline</h3>
                                            <motion.select
                                                whileFocus={{ scale: 1.02 }}
                                                className="text-sm border border-gray-200 rounded-xl py-2 px-3 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                            >
                                                <option>All Activities</option>
                                                <option>Proposals</option>
                                                <option>Votes</option>
                                                <option>Treasury</option>
                                            </motion.select>
                                        </div>
                                    </div>

                                    {/* Beautiful Timeline Design */}
                                    <div className="p-6">
                                        {isLoading ? (
                                            <div className="space-y-6">
                                                {Array(5).fill(0).map((_, i) => (
                                                    <div key={i} className="flex animate-pulse">
                                                        <div className="w-12 h-12 bg-gray-200 rounded-2xl mr-6"></div>
                                                        <div className="flex-1">
                                                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                {/* Timeline Line */}
                                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 via-red-200 to-transparent"></div>

                                                <div className="space-y-8">
                                                    {activityFeed.map((activity, index) => (
                                                        <motion.div
                                                            key={activity.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="relative flex items-start group"
                                                        >
                                                            {/* Timeline Dot */}
                                                            <motion.div
                                                                whileHover={{ scale: 1.1, rotate: 10 }}
                                                                className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-lg ${activity.status === 'success' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                                                                    activity.status === 'pending' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                                                        'bg-gradient-to-br from-red-400 to-red-600'
                                                                    }`}
                                                            >
                                                                <span className="text-white font-medium">{activity.icon}</span>
                                                            </motion.div>

                                                            {/* Content */}
                                                            <div className="ml-6 flex-1 min-w-0">
                                                                <motion.div
                                                                    className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-gray-100/80 transition-all border border-gray-200/30"
                                                                    whileHover={{ scale: 1.01, y: -2 }}
                                                                >
                                                                    <div className="flex items-start justify-between mb-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${activity.type === 'proposal' ? 'bg-purple-100 text-purple-800' :
                                                                                activity.type === 'vote' ? 'bg-blue-100 text-blue-800' :
                                                                                    activity.type === 'treasury' ? 'bg-green-100 text-green-800' :
                                                                                        'bg-orange-100 text-orange-800'
                                                                                }`}>
                                                                                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                                                                            </span>
                                                                            {activity.amount && (
                                                                                <span className={`text-sm font-semibold ${activity.amount.includes('+') ? 'text-green-600' : 'text-red-600'
                                                                                    }`}>
                                                                                    {activity.amount}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <motion.button
                                                                                whileHover={{ scale: 1.1 }}
                                                                                whileTap={{ scale: 0.9 }}
                                                                                onClick={() => handleShare(activity)}
                                                                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-white/50 transition-all"
                                                                            >
                                                                                <FiShare2 className="w-4 h-4" />
                                                                            </motion.button>
                                                                            <motion.button
                                                                                whileHover={{ scale: 1.1 }}
                                                                                whileTap={{ scale: 0.9 }}
                                                                                onClick={() => handleActionSheetOpen(activity, 'activity')}
                                                                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-white/50 transition-all"
                                                                            >
                                                                                <BsThreeDots className="w-4 h-4" />
                                                                            </motion.button>
                                                                        </div>
                                                                    </div>

                                                                    <h4 className="font-semibold text-gray-900 mb-2">{activity.title}</h4>
                                                                    <p className="text-gray-600 text-sm mb-4">{activity.description}</p>

                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center text-xs text-gray-500">
                                                                            <div className="w-5 h-5 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mr-2"></div>
                                                                            <span className="font-medium">{activity.user}</span>
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 font-medium">
                                                                            {activity.date} • {activity.time}
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                {/* Load More Button */}
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="text-center mt-8"
                                                >
                                                    <motion.button
                                                        whileHover={{ scale: 1.02, y: -1 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="px-6 py-3 text-sm font-medium text-orange-500 bg-orange-50/80 backdrop-blur-sm rounded-xl hover:bg-orange-100 transition-all border border-orange-200/50"
                                                    >
                                                        Load More Activities
                                                    </motion.button>
                                                </motion.div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Enhanced Proposal Modal */}
            <AnimatePresence>
                {selectedProposal && currentProposal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            ref={modalRef}
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto border border-gray-200/50"
                        >
                            {!showVoteConfirmation ? (
                                <>
                                    <div className="p-6 border-b border-gray-100/50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(currentProposal.status)} text-white`}>
                                                        {getStatusText(currentProposal.status)}
                                                    </span>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${currentProposal.categoryColor} text-white`}>
                                                        {currentProposal.category.charAt(0).toUpperCase() + currentProposal.category.slice(1)}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">{currentProposal.title}</h3>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1, rotate: 90 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setSelectedProposal(null)}
                                                className="text-gray-400 hover:text-gray-600 transition-all ml-4 p-2 rounded-xl hover:bg-gray-100"
                                            >
                                                <FiX className="w-6 h-6" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center">
                                                <motion.div
                                                    className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mr-4"
                                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                                ></motion.div>
                                                <div>
                                                    <p className="text-gray-600 text-sm">Proposed by</p>
                                                    <p className="font-semibold text-gray-900">{currentProposal.proposer}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-600 text-sm">Voting Period</p>
                                                <p className="font-semibold text-gray-900">
                                                    {formatDate(currentProposal.startDate)} - {formatDate(currentProposal.endDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                                            <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/30">
                                                <p className="text-gray-700 leading-relaxed">{currentProposal.description}</p>
                                            </div>
                                        </div>

                                        {/* Enhanced Vote Progress */}
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 mb-4">Current Results</h4>
                                            <div className="bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30">
                                                <div className="grid grid-cols-2 gap-6 mb-6">
                                                    <motion.div
                                                        className="text-center"
                                                        whileHover={{ scale: 1.02 }}
                                                    >
                                                        <motion.p
                                                            className="text-3xl font-bold text-green-600"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", delay: 0.2 }}
                                                        >
                                                            {calculateVotePercentage(currentProposal, 'for').toFixed(1)}%
                                                        </motion.p>
                                                        <p className="text-sm text-gray-600 font-medium">For</p>
                                                        <p className="text-xs text-gray-500 mt-1">{formatNumber(currentProposal.votesFor)} $ROVI</p>
                                                    </motion.div>
                                                    <motion.div
                                                        className="text-center"
                                                        whileHover={{ scale: 1.02 }}
                                                    >
                                                        <motion.p
                                                            className="text-3xl font-bold text-red-600"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", delay: 0.3 }}
                                                        >
                                                            {calculateVotePercentage(currentProposal, 'against').toFixed(1)}%
                                                        </motion.p>
                                                        <p className="text-sm text-gray-600 font-medium">Against</p>
                                                        <p className="text-xs text-gray-500 mt-1">{formatNumber(currentProposal.votesAgainst)} $ROVI</p>
                                                    </motion.div>
                                                </div>

                                                <div className="h-4 w-full bg-gray-200/50 rounded-full overflow-hidden mb-4">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${calculateVotePercentage(currentProposal, 'for')}%` }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                                                    ></motion.div>
                                                </div>

                                                <div className="text-center">
                                                    <p className="text-sm text-gray-600 font-medium">
                                                        {formatNumber(currentProposal.totalVotes)} total votes
                                                        {currentProposal.status === 'active' && (
                                                            <span> • {getDaysRemaining(currentProposal.endDate)} days remaining</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enhanced Voting Actions */}
                                        {currentProposal.status === 'active' && isWalletConnected ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02, y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setVoteType('for')}
                                                        className={`py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 transition-all ${voteType === 'for'
                                                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                                                            : 'bg-green-50/80 text-green-700 border-2 border-green-200/50 hover:bg-green-100/80 backdrop-blur-sm'
                                                            }`}
                                                    >
                                                        <FiThumbsUp className="w-5 h-5" />
                                                        <span>Vote For</span>
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.02, y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setVoteType('against')}
                                                        className={`py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 transition-all ${voteType === 'against'
                                                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                                                            : 'bg-red-50/80 text-red-700 border-2 border-red-200/50 hover:bg-red-100/80 backdrop-blur-sm'
                                                            }`}
                                                    >
                                                        <FiThumbsDown className="w-5 h-5" />
                                                        <span>Vote Against</span>
                                                    </motion.button>
                                                </div>

                                                {voteType && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                                        className="space-y-4"
                                                    >
                                                        <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/30">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="text-sm text-gray-600 font-medium">Your voting power</span>
                                                                <span className="font-bold text-gray-900">35,450 $ROVI</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-gray-600 font-medium">Vote type</span>
                                                                <span className={`font-bold px-3 py-1 rounded-full text-sm ${voteType === 'for' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                    {voteType === 'for' ? 'For' : 'Against'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <motion.button
                                                            whileHover={{ scale: 1.02, y: -2 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={handleVoteSubmit}
                                                            disabled={isVoting}
                                                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                                        >
                                                            {isVoting ? (
                                                                <>
                                                                    <motion.div
                                                                        animate={{ rotate: 360 }}
                                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                                    />
                                                                    <span>Submitting Vote...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FiCheck className="w-5 h-5" />
                                                                    <span>Submit Vote</span>
                                                                </>
                                                            )}
                                                        </motion.button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        ) : currentProposal.status === 'active' ? (
                                            <motion.button
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                onClick={handleConnectWallet}
                                                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
                                            >
                                                <IoWallet className="w-5 h-5" />
                                                <span>Connect Wallet to Vote</span>
                                            </motion.button>
                                        ) : (
                                            <div className={`w-full py-4 ${currentProposal.status === 'passed' ? 'bg-green-50/80 text-green-700 border border-green-200/50' :
                                                currentProposal.status === 'rejected' ? 'bg-red-50/80 text-red-700 border border-red-200/50' :
                                                    'bg-gray-50/80 text-gray-700 border border-gray-200/50'
                                                } font-semibold rounded-2xl flex items-center justify-center gap-3 backdrop-blur-sm`}>
                                                {currentProposal.status === 'passed' ? (
                                                    <>
                                                        <FiCheckCircle className="w-5 h-5" />
                                                        <span>Proposal Passed</span>
                                                    </>
                                                ) : currentProposal.status === 'rejected' ? (
                                                    <>
                                                        <FiX className="w-5 h-5" />
                                                        <span>Proposal Rejected</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiClock className="w-5 h-5" />
                                                        <span>Voting Not Started</span>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Share and Actions */}
                                        <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-100/50">
                                            {[
                                                { icon: FiShare2, label: 'Share', action: () => handleShare(currentProposal) },
                                                { icon: FiBookmark, label: 'Bookmark', action: () => console.log('Bookmark') },
                                                { icon: FiExternalLink, label: 'View on Chain', action: () => console.log('View on chain') }
                                            ].map(({ icon: Icon, label, action }) => (
                                                <motion.button
                                                    key={label}
                                                    whileHover={{ scale: 1.05, y: -1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={action}
                                                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100/50 transition-all backdrop-blur-sm"
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    <span>{label}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                    className="p-8 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                                        className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-2xl"
                                    >
                                        <FiCheck className="w-12 h-12 text-white" />
                                    </motion.div>
                                    <motion.h3
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-2xl font-bold text-gray-900 mb-3"
                                    >
                                        Vote Submitted Successfully!
                                    </motion.h3>
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-gray-600 mb-8"
                                    >
                                        Your vote has been successfully submitted to the blockchain and will be counted in the final results.
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-2xl p-6 mb-8 text-left max-w-sm mx-auto border border-gray-200/30"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 font-medium">Proposal</span>
                                                <span className="text-sm font-semibold text-gray-900 text-right max-w-48 truncate">
                                                    {currentProposal.title}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 font-medium">Your Vote</span>
                                                <span className={`text-sm font-bold px-3 py-1 rounded-full ${voteType === 'for' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {voteType === 'for' ? 'For' : 'Against'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 font-medium">Voting Power</span>
                                                <span className="text-sm font-bold text-gray-900">35,450 $ROVI</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                                                <span className="text-sm text-gray-600 font-medium">Transaction</span>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center"
                                                >
                                                    <span>View on Explorer</span>
                                                    <FiExternalLink className="w-3 h-3 ml-1" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleShare(currentProposal)}
                                            className="flex-1 py-3 bg-gray-100/80 text-gray-700 font-semibold rounded-xl hover:bg-gray-200/80 transition-all backdrop-blur-sm"
                                        >
                                            Share Vote
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setSelectedProposal(null);
                                                setShowVoteConfirmation(false);
                                                setVoteType(null);
                                            }}
                                            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                        >
                                            Continue
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* iOS Action Sheet */}
            <IOSActionSheet
                isOpen={showActionSheet}
                onClose={() => setShowActionSheet(false)}
                title={actionSheetItem?.title || 'Actions'}
                options={actionSheetItem ? getActionSheetOptions(actionSheetItem) : []}
                item={actionSheetItem ?? undefined}
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                item={shareItem}
            />

            {/* Enhanced Notifications Panel */}
            <AnimatePresence>
                {showNotifications && (
                    <motion.div
                        initial={{ opacity: 0, x: 300, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 300, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed right-4 top-20 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 z-40 max-h-96 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-100/50">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowNotifications(false)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100/50 transition-all"
                                >
                                    <FiX className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100/50 max-h-80 overflow-y-auto custom-scrollbar">
                            {notifications.map((notification, index) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                                    className="p-4 cursor-pointer transition-all"
                                >
                                    <div className="flex items-start">
                                        <motion.div
                                            className={`w-2 h-2 rounded-full mr-3 mt-2 ${notification.unread ? 'bg-orange-500' : 'bg-gray-300'}`}
                                            animate={notification.unread ? { scale: [1, 1.2, 1] } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                                            <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                                            <p className="text-gray-500 text-xs mt-2">{notification.time}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-100/50">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                className="w-full text-center text-orange-500 font-medium text-sm hover:text-orange-600 transition-colors"
                            >
                                View All Notifications
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay for mobile sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/25 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Enhanced Loading Overlay */}
            <AnimatePresence>
                {isRefreshing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-200/50"
                        >
                            <div className="flex flex-col items-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full mb-3"
                                />
                                <p className="text-gray-700 font-medium">Refreshing...</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button for Mobile */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-2xl flex items-center justify-center z-40"
                onClick={() => console.log('Create proposal')}
            >
                <IoRocket className="w-6 h-6 text-white" />
            </motion.button>

            {/* Enhanced Global Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(241, 245, 249, 0.5);
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(203, 213, 225, 0.8);
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 0.9);
                }

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Enhanced transitions */
                * {
                    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    transition-duration: 200ms;
                }

                /* Improved focus styles */
                .focus-ring:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.2);
                    border-color: #f97316;
                }

                /* Glass morphism effects */
                .glass {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                /* Enhanced shadows */
                .shadow-glass {
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
                }

                /* Gradient animations */
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient-shift 3s ease infinite;
                }

                /* Smooth scrolling */
                html {
                    scroll-behavior: smooth;
                }

                /* Better text rendering */
                body {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    text-rendering: optimizeLegibility;
                }
            `}</style>
        </div>
    );
}