/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiDollarSign, FiSearch, FiFilter, FiDownload, FiMoreHorizontal,
    FiTrendingUp, FiTrendingDown, FiRefreshCw, FiCalendar, FiUser,
    FiCreditCard, FiEye, FiAlertCircle, FiCheckCircle, FiClock,
    FiArrowUpRight, FiArrowDownLeft, FiBarChart, FiActivity,
    FiPieChart, FiRepeat, FiShield, FiExternalLink, FiCopy
} from 'react-icons/fi';
import { FaEthereum, FaBitcoin, FaPaypal, FaStripe } from 'react-icons/fa';
import React from 'react';
import Image from 'next/image';

interface Transaction {
    id: string;
    transactionHash: string;
    type: 'purchase' | 'refund' | 'payout' | 'fee' | 'transfer';
    amount: number;
    currency: 'USD' | 'ETH' | 'BTC';
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    timestamp: string;
    user: {
        name: string;
        email: string;
        avatar: string;
    };
    event?: {
        title: string;
        id: string;
    };
    paymentMethod: 'stripe' | 'crypto' | 'paypal' | 'bank';
    fee: number;
    netAmount: number;
    description: string;
    metadata?: Record<string, unknown>;
}

const mockTransactions: Transaction[] = [
    {
        id: '1',
        transactionHash: 'tx_1234567890abcdef',
        type: 'purchase',
        amount: 299,
        currency: 'USD',
        status: 'completed',
        timestamp: '2024-12-15T10:30:00Z',
        user: {
            name: 'Joe Love',
            email: 'alex@example.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        },
        event: {
            title: 'Tech Summit 2025',
            id: 'evt-1'
        },
        paymentMethod: 'stripe',
        fee: 14.95,
        netAmount: 284.05,
        description: 'VIP ticket purchase for Tech Summit 2025'
    },
    {
        id: '2',
        transactionHash: '0x742d35Cc6565C42cAA5b8e8a8b02b9eF3D5d2D8B',
        type: 'purchase',
        amount: 0.15,
        currency: 'ETH',
        status: 'completed',
        timestamp: '2024-12-14T15:45:00Z',
        user: {
            name: 'Joe Rover',
            email: 'rover@rovify.io',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b88e1f9d?w=40&h=40&fit=crop&crop=face'
        },
        event: {
            title: 'Neon Nights Festival',
            id: 'evt-2'
        },
        paymentMethod: 'crypto',
        fee: 0.003,
        netAmount: 0.147,
        description: 'NFT ticket purchase via Ethereum'
    },
    {
        id: '3',
        transactionHash: 'rf_abcdef1234567890',
        type: 'refund',
        amount: -89,
        currency: 'USD',
        status: 'pending',
        timestamp: '2024-12-13T09:15:00Z',
        user: {
            name: 'Marcus Reid',
            email: 'marcus@example.com',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
        },
        event: {
            title: 'Urban Art Exhibition',
            id: 'evt-3'
        },
        paymentMethod: 'stripe',
        fee: -4.45,
        netAmount: -84.55,
        description: 'Refund for cancelled ticket'
    },
    {
        id: '4',
        transactionHash: 'po_9876543210fedcba',
        type: 'payout',
        amount: -1250,
        currency: 'USD',
        status: 'completed',
        timestamp: '2024-12-12T14:20:00Z',
        user: {
            name: 'Event Organiser LLC',
            email: 'organiser@events.com',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
        },
        event: {
            title: 'Music Festival 2024',
            id: 'evt-4'
        },
        paymentMethod: 'bank',
        fee: 12.50,
        netAmount: -1237.50,
        description: 'Weekly payout to event organiser'
    }
];

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | Transaction['type']>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | Transaction['status']>('all');
    const [paymentFilter, setPaymentFilter] = useState<'all' | Transaction['paymentMethod']>('all');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [dateRange, setDateRange] = useState('7d');

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.transactionHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || transaction.paymentMethod === paymentFilter;
        return matchesSearch && matchesType && matchesStatus && matchesPayment;
    });

    const getTypeColor = (type: Transaction['type']) => {
        switch (type) {
            case 'purchase': return 'bg-green-100 text-green-800';
            case 'refund': return 'bg-yellow-100 text-yellow-800';
            case 'payout': return 'bg-blue-100 text-blue-800';
            case 'fee': return 'bg-purple-100 text-purple-800';
            case 'transfer': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: Transaction['status']) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'cancelled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: Transaction['status']) => {
        switch (status) {
            case 'completed': return FiCheckCircle;
            case 'pending': return FiClock;
            case 'failed': return FiAlertCircle;
            case 'cancelled': return FiAlertCircle;
            default: return FiClock;
        }
    };

    const getPaymentIcon = (method: Transaction['paymentMethod']) => {
        switch (method) {
            case 'stripe': return FaStripe;
            case 'crypto': return FaEthereum;
            case 'paypal': return FaPaypal;
            case 'bank': return FiCreditCard;
            default: return FiCreditCard;
        }
    };

    const getTypeIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'purchase': return FiArrowDownLeft;
            case 'refund': return FiRepeat;
            case 'payout': return FiArrowUpRight;
            case 'fee': return FiDollarSign;
            case 'transfer': return FiRepeat;
            default: return FiDollarSign;
        }
    };

    const formatAmount = (amount: number, currency: string) => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(Math.abs(amount));
        } else {
            return `${Math.abs(amount)} ${currency}`;
        }
    };

    const StatCard = ({ title, value, icon, color, subtitle, change }: {
        title: string;
        value: string;
        icon: React.ElementType;
        color: string;
        subtitle?: string;
        change?: number;
    }) => (
        <motion.div
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
                    {React.createElement(icon, { className: "w-6 h-6", style: { color } })}
                </div>
            </div>
            {change !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change >= 0 ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                    <span className="font-medium">{Math.abs(change)}%</span>
                    <span className="text-gray-500">vs. last period</span>
                </div>
            )}
        </motion.div>
    );

    const TransactionModal = ({ transaction, isOpen, onClose }: {
        transaction: Transaction | null;
        isOpen: boolean;
        onClose: () => void
    }) => (
        <AnimatePresence>
            {isOpen && transaction && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <FiMoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Transaction Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(transaction.type)}`}>
                                                {React.createElement(getTypeIcon(transaction.type), { className: "w-6 h-6" })}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 capitalize">{transaction.type}</h3>
                                                <p className="text-gray-600">{transaction.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-2xl font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {transaction.amount >= 0 ? '+' : ''}{formatAmount(transaction.amount, transaction.currency)}
                                            </p>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                                                {React.createElement(getStatusIcon(transaction.status), { className: "w-3 h-3" })}
                                                {transaction.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Transaction Info</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Transaction ID</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-sm">{transaction.transactionHash.substring(0, 16)}...</span>
                                                        <button className="p-1 hover:bg-gray-200 rounded">
                                                            <FiCopy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Timestamp</span>
                                                    <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Payment Method</span>
                                                    <div className="flex items-center gap-2">
                                                        {React.createElement(getPaymentIcon(transaction.paymentMethod), {
                                                            className: "w-4 h-4 text-gray-600"
                                                        })}
                                                        <span className="capitalize">{transaction.paymentMethod}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* User Info */}
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">User</h4>
                                            <Image
                                                src={transaction.user.avatar}
                                                alt={transaction.user.name}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <Image
                                                src={transaction.user.avatar}
                                                alt={transaction.user.name}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <h5 className="font-medium text-gray-900">{transaction.user.name}</h5>
                                                <p className="text-sm text-gray-600">{transaction.user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Financial Breakdown */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Financial Details</h4>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Gross Amount</span>
                                                    <span className="font-medium">{formatAmount(transaction.amount, transaction.currency)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Processing Fee</span>
                                                    <span className="font-medium text-red-600">-{formatAmount(transaction.fee, transaction.currency)}</span>
                                                </div>
                                                <hr className="border-gray-200" />
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-gray-900">Net Amount</span>
                                                    <span className="font-bold text-gray-900">{formatAmount(transaction.netAmount, transaction.currency)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Event Info */}
                                    {transaction.event && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Related Event</h4>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <h5 className="font-medium text-gray-900">{transaction.event.title}</h5>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm text-gray-600">Event ID: {transaction.event.id}</span>
                                                    <button className="text-orange-600 hover:text-orange-700">
                                                        <FiExternalLink className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="border-t pt-6">
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                                        Download Receipt
                                    </button>
                                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                                        View on Blockchain
                                    </button>
                                    {transaction.status === 'pending' && (
                                        <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-lg font-medium transition-colors">
                                            Retry
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Calculate stats
    const totalRevenue = transactions
        .filter(t => t.type === 'purchase' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalRefunds = Math.abs(transactions
        .filter(t => t.type === 'refund' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0));

    const totalFees = transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.fee, 0);

    const pendingCount = transactions.filter(t => t.status === 'pending').length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
                    <p className="text-gray-600 mt-1">Monitor all financial transactions and payment flows</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                        {['24h', '7d', '30d', '90d'].map((period) => (
                            <button
                                key={period}
                                onClick={() => setDateRange(period)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${dateRange === period
                                    ? 'bg-orange-500 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                        <FiRefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                        <FiDownload className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    icon={FiTrendingUp}
                    color="#4CAF50"
                    subtitle="This period"
                    change={18.4}
                />
                <StatCard
                    title="Total Refunds"
                    value={`$${totalRefunds.toLocaleString()}`}
                    icon={FiRepeat}
                    color="#FF9800"
                    subtitle="This period"
                    change={-5.2}
                />
                <StatCard
                    title="Processing Fees"
                    value={`$${totalFees.toLocaleString()}`}
                    icon={FiDollarSign}
                    color="#9C27B0"
                    subtitle="This period"
                    change={12.1}
                />
                <StatCard
                    title="Pending Transactions"
                    value={pendingCount.toString()}
                    icon={FiClock}
                    color="#FF5722"
                    subtitle="Awaiting processing"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaction Volume Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Transaction Volume</h3>
                            <p className="text-sm text-gray-600">Daily transaction amounts over time</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-100 text-orange-600">Volume</button>
                            <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">Count</button>
                        </div>
                    </div>
                    <div className="h-64 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center border-2 border-dashed border-orange-200">
                        <div className="text-center">
                            <FiBarChart className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">Transaction Volume Chart</p>
                            <p className="text-sm text-gray-500 mt-1">Chart.js or Recharts integration here</p>
                        </div>
                    </div>
                </div>

                {/* Payment Methods Breakdown */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <FiMoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { method: 'Stripe', percentage: 65, amount: '$45.2K', icon: FaStripe, color: '#635BFF' },
                            { method: 'Crypto', percentage: 25, amount: '$17.5K', icon: FaEthereum, color: '#627EEA' },
                            { method: 'PayPal', percentage: 10, amount: '$7.0K', icon: FaPaypal, color: '#00457C' }
                        ].map((item, index) => (
                            <motion.div
                                key={item.method}
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-gray-900">{item.method}</span>
                                        <span className="font-semibold text-green-600">{item.amount}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${item.percentage}%`,
                                                    backgroundColor: item.color
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600">{item.percentage}%</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
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
                                placeholder="Search by transaction ID, user, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as Transaction['type'] | 'all')}
                            className="px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="all">All Types</option>
                            <option value="purchase">Purchase</option>
                            <option value="refund">Refund</option>
                            <option value="payout">Payout</option>
                            <option value="fee">Fee</option>
                            <option value="transfer">Transfer</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as Transaction['status'] | 'all')}
                            className="px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value as Transaction['paymentMethod'] | 'all')}
                            className="px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="all">All Methods</option>
                            <option value="stripe">Stripe</option>
                            <option value="crypto">Crypto</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Transaction</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Payment</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTransactions.map((transaction, index) => (
                                <motion.tr
                                    key={transaction.id}
                                    className="hover:bg-gray-50 transition-colors"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-mono text-sm font-medium text-gray-900">
                                                {transaction.transactionHash.substring(0, 12)}...
                                            </p>
                                            <p className="text-xs text-gray-600">{transaction.description}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={transaction.user.avatar}
                                                alt={transaction.user.name}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-lg object-cover"
                                            />
                                            <div>
                                                <h4 className="font-medium text-gray-900">{transaction.user.name}</h4>
                                                <p className="text-sm text-gray-600">{transaction.user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(transaction.type)}`}>
                                            {React.createElement(getTypeIcon(transaction.type), { className: "w-3 h-3" })}
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {transaction.amount >= 0 ? '+' : ''}{formatAmount(transaction.amount, transaction.currency)}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Net: {formatAmount(transaction.netAmount, transaction.currency)}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                                            {React.createElement(getStatusIcon(transaction.status), { className: "w-3 h-3" })}
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            {React.createElement(getPaymentIcon(transaction.paymentMethod), {
                                                className: "w-4 h-4 text-gray-600"
                                            })}
                                            <span className="capitalize text-sm">{transaction.paymentMethod}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-gray-600">
                                            {new Date(transaction.timestamp).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedTransaction(transaction);
                                                    setShowTransactionModal(true);
                                                }}
                                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <FiEye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                                <FiDownload className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                                <FiMoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction Detail Modal */}
            <TransactionModal
                transaction={selectedTransaction}
                isOpen={showTransactionModal}
                onClose={() => {
                    setShowTransactionModal(false);
                    setSelectedTransaction(null);
                }}
            />
        </div>
    );
}