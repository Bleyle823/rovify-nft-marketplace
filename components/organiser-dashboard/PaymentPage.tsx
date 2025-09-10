/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiDollarSign, FiCreditCard, FiTrendingUp, FiTrendingDown,
    FiDownload, FiFilter, FiSearch, FiEye, FiRefreshCw,
    FiCheckCircle, FiXCircle, FiClock, FiAlertCircle,
    FiCalendar, FiUser, FiMoreHorizontal, FiBarChart,
    FiTarget, FiPercent, FiArrowUpRight, FiArrowDownRight,
    FiSettings, FiPieChart, FiActivity, FiZap
} from 'react-icons/fi';
import { IoSparkles, IoWallet, IoCard, IoTrendingUp } from "react-icons/io5";
import { HiOutlineSparkles, HiOutlineCurrencyDollar, HiOutlineFire } from "react-icons/hi2";
import { BsCreditCard2Front, BsBank } from "react-icons/bs";

// Mock payments data
const mockTransactions = [
    {
        id: 'TXN001',
        eventTitle: 'AI & Machine Learning Summit 2025',
        eventId: 'event1',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.johnson@email.com',
        amount: 299,
        fee: 11.96,
        netAmount: 287.04,
        ticketType: 'VIP',
        quantity: 1,
        paymentMethod: 'credit_card',
        status: 'completed',
        date: '2025-06-20',
        time: '14:32',
        currency: 'USD',
        refundable: true,
        country: 'United States'
    },
    {
        id: 'TXN002',
        eventTitle: 'Electronic Music Festival',
        eventId: 'event2',
        customerName: 'Marcus Chen',
        customerEmail: 'marcus.chen@startup.co',
        amount: 258,
        fee: 10.32,
        netAmount: 247.68,
        ticketType: 'General',
        quantity: 2,
        paymentMethod: 'paypal',
        status: 'completed',
        date: '2025-06-20',
        time: '12:15',
        currency: 'USD',
        refundable: true,
        country: 'United States'
    },
    {
        id: 'TXN003',
        eventTitle: 'Digital Marketing Masterclass',
        eventId: 'event4',
        customerName: 'Emma Wilson',
        customerEmail: 'emma.wilson@agency.com',
        amount: 197,
        fee: 7.88,
        netAmount: 189.12,
        ticketType: 'Premium',
        quantity: 1,
        paymentMethod: 'bank_transfer',
        status: 'pending',
        date: '2025-06-20',
        time: '10:45',
        currency: 'USD',
        refundable: true,
        country: 'United States'
    },
    {
        id: 'TXN004',
        eventTitle: 'AI & Machine Learning Summit 2025',
        eventId: 'event1',
        customerName: 'David Rodriguez',
        customerEmail: 'david.r@enterprise.com',
        amount: 398,
        fee: 15.92,
        netAmount: 382.08,
        ticketType: 'General',
        quantity: 2,
        paymentMethod: 'credit_card',
        status: 'failed',
        date: '2025-06-19',
        time: '16:20',
        currency: 'USD',
        refundable: false,
        country: 'United States'
    },
    {
        id: 'TXN005',
        eventTitle: 'Startup Pitch Competition',
        eventId: 'event3',
        customerName: 'Lisa Park',
        customerEmail: 'lisa.park@consultant.com',
        amount: 89,
        fee: 3.56,
        netAmount: 85.44,
        ticketType: 'Investor',
        quantity: 1,
        paymentMethod: 'apple_pay',
        status: 'refunded',
        date: '2025-06-18',
        time: '09:30',
        currency: 'USD',
        refundable: false,
        country: 'United States'
    }
];

const mockPayoutHistory = [
    {
        id: 'PO001',
        amount: 25847.92,
        fee: 258.48,
        netAmount: 25589.44,
        transactionCount: 87,
        period: '2025-06-01 to 2025-06-15',
        status: 'completed',
        date: '2025-06-16',
        bankAccount: '****4567'
    },
    {
        id: 'PO002',
        amount: 18294.56,
        fee: 182.95,
        netAmount: 18111.61,
        transactionCount: 64,
        period: '2025-05-16 to 2025-05-31',
        status: 'completed',
        date: '2025-06-01',
        bankAccount: '****4567'
    },
    {
        id: 'PO003',
        amount: 12856.78,
        fee: 128.57,
        netAmount: 12728.21,
        transactionCount: 43,
        period: '2025-05-01 to 2025-05-15',
        status: 'pending',
        date: '2025-05-16',
        bankAccount: '****4567'
    }
];

const paymentStatusConfig = {
    completed: {
        label: 'Completed',
        color: 'bg-emerald-100 text-emerald-700',
        icon: <FiCheckCircle className="w-3 h-3" />,
        dot: 'bg-emerald-500'
    },
    pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <FiClock className="w-3 h-3" />,
        dot: 'bg-yellow-500'
    },
    failed: {
        label: 'Failed',
        color: 'bg-red-100 text-red-700',
        icon: <FiXCircle className="w-3 h-3" />,
        dot: 'bg-red-500'
    },
    refunded: {
        label: 'Refunded',
        color: 'bg-blue-100 text-blue-700',
        icon: <FiArrowDownRight className="w-3 h-3" />,
        dot: 'bg-blue-500'
    }
};

const paymentMethodConfig = {
    credit_card: { label: 'Credit Card', icon: <BsCreditCard2Front className="w-4 h-4" /> },
    paypal: { label: 'PayPal', icon: <IoWallet className="w-4 h-4" /> },
    bank_transfer: { label: 'Bank Transfer', icon: <BsBank className="w-4 h-4" /> },
    apple_pay: { label: 'Apple Pay', icon: <IoCard className="w-4 h-4" /> },
    google_pay: { label: 'Google Pay', icon: <IoCard className="w-4 h-4" /> }
};

// Transaction Card Component
const TransactionCard = ({ transaction, index }: { transaction: typeof mockTransactions[0], index: number }) => {
    const statusStyle = paymentStatusConfig[transaction.status as keyof typeof paymentStatusConfig];
    const methodConfig = paymentMethodConfig[transaction.paymentMethod as keyof typeof paymentMethodConfig];

    return (
        <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold`}>
                            {transaction.eventTitle.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusStyle.dot} rounded-full border-2 border-white`}></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {transaction.customerName}
                        </h3>
                        <p className="text-sm text-gray-600">{transaction.eventTitle}</p>
                        <p className="text-xs text-gray-500">{transaction.id}</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        ${transaction.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                        Net: ${transaction.netAmount.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar className="w-4 h-4" />
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    {methodConfig.icon}
                    <span>{methodConfig.label}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiUser className="w-4 h-4" />
                    <span>{transaction.quantity} × {transaction.ticketType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiDollarSign className="w-4 h-4" />
                    <span>Fee: ${transaction.fee.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`${statusStyle.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                        {statusStyle.icon}
                        {statusStyle.label}
                    </div>
                    <span className="text-xs text-gray-500">{transaction.time}</span>
                </div>

                <div className="flex items-center gap-2">
                    <motion.button
                        className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiEye className="w-4 h-4 text-gray-600" />
                    </motion.button>
                    <motion.button
                        className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiDownload className="w-4 h-4 text-gray-600" />
                    </motion.button>
                    <motion.button
                        className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiMoreHorizontal className="w-4 h-4 text-gray-600" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// Payout Card Component
const PayoutCard = ({ payout, index }: { payout: typeof mockPayoutHistory[0], index: number }) => {
    const statusStyle = paymentStatusConfig[payout.status as keyof typeof paymentStatusConfig];

    return (
        <motion.div
            className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2, scale: 1.01 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">${payout.netAmount.toLocaleString()}</h3>
                    <p className="text-sm text-gray-600">{payout.period}</p>
                </div>
                <div className={`${statusStyle.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                    {statusStyle.icon}
                    {statusStyle.label}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gross Amount:</span>
                    <span className="font-semibold">${payout.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee:</span>
                    <span className="text-red-600">-${payout.fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transactions:</span>
                    <span className="font-semibold">{payout.transactionCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bank Account:</span>
                    <span className="font-mono">{payout.bankAccount}</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{new Date(payout.date).toLocaleDateString()}</span>
                <motion.button
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    View Details
                </motion.button>
            </div>
        </motion.div>
    );
};

export default function PaymentsPage() {
    const [selectedTab, setSelectedTab] = useState('transactions');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const tabs = [
        { id: 'transactions', label: 'Transactions', icon: <FiCreditCard className="w-5 h-5" /> },
        { id: 'payouts', label: 'Payouts', icon: <BsBank className="w-5 h-5" /> },
        { id: 'analytics', label: 'Analytics', icon: <FiBarChart className="w-5 h-5" /> },
        { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" /> }
    ];

    const filteredTransactions = mockTransactions.filter(transaction => {
        const matchesSearch = transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Calculate totals
    const totalRevenue = mockTransactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalFees = mockTransactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.fee, 0);

    const netRevenue = totalRevenue - totalFees;

    const pendingAmount = mockTransactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);

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
                            <HiOutlineCurrencyDollar className="w-12 h-12" />
                            Payments
                        </h1>
                        <p className="text-orange-100 text-lg mb-4">
                            Revenue & payouts • ${totalRevenue.toLocaleString()} total revenue • {mockTransactions.length} transactions
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <IoSparkles className="w-5 h-5" />
                                <span className="font-semibold">${netRevenue.toLocaleString()} net revenue</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <FiClock className="w-5 h-5" />
                                <span className="font-semibold">${pendingAmount.toLocaleString()} pending</span>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiDownload className="w-5 h-5" />
                        Export Report
                    </motion.button>
                </div>
            </motion.div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    {
                        label: 'Total Revenue',
                        value: `$${totalRevenue.toLocaleString()}`,
                        icon: <FiDollarSign className="w-6 h-6" />,
                        color: 'from-emerald-500 to-emerald-600',
                        change: '+23.5%',
                        gradient: true
                    },
                    {
                        label: 'Platform Fees',
                        value: `$${totalFees.toLocaleString()}`,
                        icon: <FiPercent className="w-6 h-6" />,
                        color: 'from-red-500 to-red-600',
                        change: '+18.2%'
                    },
                    {
                        label: 'Net Revenue',
                        value: `$${netRevenue.toLocaleString()}`,
                        icon: <FiTarget className="w-6 h-6" />,
                        color: 'from-blue-500 to-blue-600',
                        change: '+21.8%'
                    },
                    {
                        label: 'Pending Amount',
                        value: `$${pendingAmount.toLocaleString()}`,
                        icon: <FiClock className="w-6 h-6" />,
                        color: 'from-yellow-500 to-yellow-600',
                        change: '+5.2%'
                    }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className={`${stat.gradient ? `bg-gradient-to-br ${stat.color} text-white` : 'bg-white'} rounded-2xl p-6 border ${stat.gradient ? 'border-emerald-300' : 'border-gray-100'} hover:shadow-xl transition-all duration-300`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.gradient ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'}`}>
                                {stat.icon}
                            </div>
                            <div className={`text-sm font-bold ${stat.gradient ? 'text-white/90' : 'text-emerald-600'}`}>
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className={`text-3xl font-bold mb-1 ${stat.gradient ? 'text-white' : 'text-gray-900'}`}>
                                {stat.value}
                            </p>
                            <p className={`text-sm font-medium ${stat.gradient ? 'text-white/80' : 'text-gray-600'}`}>
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
                <div className="flex items-center justify-between gap-4">
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

                    {selectedTab === 'transactions' && (
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-orange-500 text-sm"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-orange-500 text-sm"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
                key={selectedTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {selectedTab === 'transactions' && (
                    <div className="space-y-6">
                        {filteredTransactions.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-gray-400 text-6xl mb-4">💳</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No transactions found</h3>
                                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                            </div>
                        ) : (
                            filteredTransactions.map((transaction, index) => (
                                <TransactionCard key={transaction.id} transaction={transaction} index={index} />
                            ))
                        )}
                    </div>
                )}

                {selectedTab === 'payouts' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {mockPayoutHistory.map((payout, index) => (
                            <PayoutCard key={payout.id} payout={payout} index={index} />
                        ))}
                    </div>
                )}

                {selectedTab === 'analytics' && (
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                        <div className="text-gray-400 text-6xl mb-4">📊</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Revenue Analytics</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Get detailed insights into your revenue patterns, payment methods, and financial performance.
                        </p>
                        <motion.button
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiBarChart className="w-6 h-6" />
                            View Revenue Analytics
                        </motion.button>
                    </div>
                )}

                {selectedTab === 'settings' && (
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                        <div className="text-gray-400 text-6xl mb-4">⚙️</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Settings</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Configure your payment methods, payout schedule, and financial preferences.
                        </p>
                        <motion.button
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiSettings className="w-6 h-6" />
                            Manage Settings
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}