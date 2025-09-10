/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiTag, FiSearch, FiFilter, FiDownload, FiMoreHorizontal,
    FiUsers, FiDollarSign, FiCalendar, FiMapPin, FiClock,
    FiEye, FiRefreshCw, FiAlertCircle, FiCheckCircle,
    FiXCircle, FiStar, FiTrendingUp, FiActivity, FiBarChart,
    FiCreditCard, FiShield, FiMail, FiPhone, FiExternalLink,
    FiCopy, FiEdit, FiTrash2, FiShare2, FiZap
} from 'react-icons/fi';
import { FaEthereum, FaBitcoin } from 'react-icons/fa';
import React from 'react';
import Image from 'next/image';

interface Ticket {
    id: string;
    ticketNumber: string;
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventImage: string;
    buyerName: string;
    buyerEmail: string;
    buyerAvatar: string;
    ticketType: string;
    price: number;
    status: 'valid' | 'used' | 'refunded' | 'transferred' | 'cancelled';
    purchaseDate: string;
    paymentMethod: 'card' | 'crypto' | 'bank';
    isNFT: boolean;
    tokenId?: string;
    qrCode: string;
    transferHistory?: Array<{
        from: string;
        to: string;
        date: string;
        price?: number;
    }>;
}

const mockTickets: Ticket[] = [
    {
        id: '1',
        ticketNumber: 'TKT-001-2025',
        eventId: 'evt-1',
        eventTitle: 'Tech Summit 2025',
        eventDate: '2025-07-15',
        eventImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop',
        buyerName: 'Joe Love',
        buyerEmail: 'alex@example.com',
        buyerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        ticketType: 'VIP',
        price: 299,
        status: 'valid',
        purchaseDate: '2024-12-15',
        paymentMethod: 'card',
        isNFT: true,
        tokenId: 'NFT123456',
        qrCode: 'QR123456789',
        transferHistory: []
    },
    {
        id: '2',
        ticketNumber: 'TKT-002-2025',
        eventId: 'evt-2',
        eventTitle: 'Neon Nights Festival',
        eventDate: '2025-08-20',
        eventImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop',
        buyerName: 'Joe Rover',
        buyerEmail: 'rover@rovify.io',
        buyerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b88e1f9d?w=40&h=40&fit=crop&crop=face',
        ticketType: 'General Admission',
        price: 89,
        status: 'used',
        purchaseDate: '2024-11-22',
        paymentMethod: 'crypto',
        isNFT: false,
        qrCode: 'QR987654321'
    },
    {
        id: '3',
        ticketNumber: 'TKT-003-2025',
        eventId: 'evt-3',
        eventTitle: 'Urban Art Exhibition',
        eventDate: '2025-06-10',
        eventImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
        buyerName: 'Marcus Reid',
        buyerEmail: 'marcus@example.com',
        buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        ticketType: 'Student',
        price: 25,
        status: 'refunded',
        purchaseDate: '2024-10-08',
        paymentMethod: 'card',
        isNFT: false,
        qrCode: 'QR456789123'
    }
];

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Ticket['status']>('all');
    const [paymentFilter, setPaymentFilter] = useState<'all' | Ticket['paymentMethod']>('all');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.eventTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || ticket.paymentMethod === paymentFilter;
        return matchesSearch && matchesStatus && matchesPayment;
    });

    const getStatusColor = (status: Ticket['status']) => {
        switch (status) {
            case 'valid': return 'bg-green-100 text-green-800';
            case 'used': return 'bg-blue-100 text-blue-800';
            case 'refunded': return 'bg-yellow-100 text-yellow-800';
            case 'transferred': return 'bg-purple-100 text-purple-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: Ticket['status']) => {
        switch (status) {
            case 'valid': return FiCheckCircle;
            case 'used': return FiEye;
            case 'refunded': return FiRefreshCw;
            case 'transferred': return FiShare2;
            case 'cancelled': return FiXCircle;
            default: return FiAlertCircle;
        }
    };

    const getPaymentIcon = (method: Ticket['paymentMethod']) => {
        switch (method) {
            case 'card': return FiCreditCard;
            case 'crypto': return FaEthereum;
            case 'bank': return FiDollarSign;
            default: return FiCreditCard;
        }
    };

    const StatCard = ({ title, value, icon, color, subtitle, change }: {
        title: string;
        value: string | number;
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
                    <FiTrendingUp className={`w-4 h-4 ${change < 0 ? 'rotate-180' : ''}`} />
                    <span className="font-medium">{Math.abs(change)}%</span>
                    <span className="text-gray-500">vs. last period</span>
                </div>
            )}
        </motion.div>
    );

    const TicketModal = ({ ticket, isOpen, onClose }: { ticket: Ticket | null; isOpen: boolean; onClose: () => void }) => (
        <AnimatePresence>
            {isOpen && ticket && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Ticket Details</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <FiMoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Ticket Info */}
                                <div>
                                    {/* Digital Ticket Mockup */}
                                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                        <div className="relative">
                                            <div className="flex items-center justify-between mb-4">
                                                <Image
                                                    src={ticket.eventImage}
                                                    alt={ticket.eventTitle}
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 rounded-lg object-cover border-2 border-white/20"
                                                />
                                                <Image
                                                    src={ticket.eventImage}
                                                    alt={ticket.eventTitle}
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 rounded-lg object-cover border-2 border-white/20"
                                                />
                                                <div>
                                                    <h3 className="font-bold">{ticket.eventTitle}</h3>
                                                    <p className="text-orange-100 text-sm">{new Date(ticket.eventDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            {ticket.isNFT && (
                                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                                                    NFT
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-orange-100">Ticket #</span>
                                                <span className="font-mono">{ticket.ticketNumber}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-orange-100">Type</span>
                                                <span className="font-medium">{ticket.ticketType}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-orange-100">Price</span>
                                                <span className="font-bold text-xl">${ticket.price}</span>
                                            </div>
                                        </div>

                                        {/* QR Code Placeholder */}
                                        <div className="mt-6 flex justify-center">
                                            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                                                <div className="w-20 h-20 bg-gray-800 rounded grid grid-cols-4 gap-0.5 p-1">
                                                    {[...Array(16)].map((_, i) => (
                                                        <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-gray-800'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Buyer Info */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">Ticket Holder</h4>
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={ticket.buyerAvatar}
                                            alt={ticket.buyerName}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div>
                                            <h5 className="font-medium text-gray-900">{ticket.buyerName}</h5>
                                            <p className="text-sm text-gray-600">{ticket.buyerEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Details & Actions */}
                            <div>
                                <div className="space-y-6">
                                    {/* Status & Payment */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Status & Payment</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Status</span>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                                                    {React.createElement(getStatusIcon(ticket.status), { className: "w-3 h-3" })}
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Payment Method</span>
                                                <div className="flex items-center gap-2">
                                                    {React.createElement(getPaymentIcon(ticket.paymentMethod), {
                                                        className: `w-4 h-4 ${ticket.paymentMethod === 'crypto' ? 'text-blue-500' : 'text-gray-600'}`
                                                    })}
                                                    <span className="capitalize">{ticket.paymentMethod}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Purchase Date</span>
                                                <span>{new Date(ticket.purchaseDate).toLocaleDateString()}</span>
                                            </div>
                                            {ticket.isNFT && ticket.tokenId && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Token ID</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-sm">{ticket.tokenId}</span>
                                                        <button className="p-1 hover:bg-gray-200 rounded">
                                                            <FiCopy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Event Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <FiCalendar className="w-4 h-4 text-orange-500" />
                                                <span>{new Date(ticket.eventDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <FiTag className="w-4 h-4 text-orange-500" />
                                                <span>{ticket.ticketType}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                                                Send Email
                                            </button>
                                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                                                View Event
                                            </button>
                                            <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-lg font-medium transition-colors">
                                                Resend Ticket
                                            </button>
                                            <button className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg font-medium transition-colors">
                                                Cancel Ticket
                                            </button>
                                        </div>
                                    </div>

                                    {/* Transfer History */}
                                    {ticket.transferHistory && ticket.transferHistory.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Transfer History</h4>
                                            <div className="space-y-2">
                                                {ticket.transferHistory.map((transfer, index) => (
                                                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-sm font-medium">{transfer.from} → {transfer.to}</p>
                                                                <p className="text-xs text-gray-600">{transfer.date}</p>
                                                            </div>
                                                            {transfer.price && (
                                                                <span className="font-semibold text-green-600">${transfer.price}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
                    <h1 className="text-3xl font-bold text-gray-900">Ticket Management</h1>
                    <p className="text-gray-600 mt-1">Monitor and manage all ticket sales and distributions</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                        <FiRefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                        <FiDownload className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Total Tickets"
                    value="12,472"
                    icon={FiTag}
                    color="#FF5722"
                    subtitle="All time"
                    change={23.8}
                />
                <StatCard
                    title="Valid Tickets"
                    value="9,834"
                    icon={FiCheckCircle}
                    color="#4CAF50"
                    subtitle="Unused"
                    change={15.2}
                />
                <StatCard
                    title="NFT Tickets"
                    value="3,247"
                    icon={FiZap}
                    color="#9C27B0"
                    subtitle="Blockchain"
                    change={45.6}
                />
                <StatCard
                    title="Revenue"
                    value="$1.2M"
                    icon={FiDollarSign}
                    color="#2196F3"
                    subtitle="From tickets"
                    change={18.4}
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
                                placeholder="Search by ticket number, buyer name, or event..."
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
                            onChange={(e) => setStatusFilter(e.target.value as 'all' | Ticket['status'])}
                            className="px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="all">All Status</option>
                            <option value="valid">Valid</option>
                            <option value="used">Used</option>
                            <option value="refunded">Refunded</option>
                            <option value="transferred">Transferred</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value as 'all' | Ticket['paymentMethod'])}
                            className="px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="all">All Payments</option>
                            <option value="card">Card</option>
                            <option value="crypto">Crypto</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Ticket</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Event</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Buyer</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Price</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Payment</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTickets.map((ticket, index) => (
                                <motion.tr
                                    key={ticket.id}
                                    className="hover:bg-gray-50 transition-colors"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                            <div>
                                                <p className="font-mono text-sm font-medium text-gray-900">{ticket.ticketNumber}</p>
                                                <p className="text-xs text-gray-600">{new Date(ticket.purchaseDate).toLocaleDateString()}</p>
                                            </div>
                                            {ticket.isNFT && (
                                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                                    NFT
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={ticket.eventImage}
                                                alt={ticket.eventTitle}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <h3 className="font-medium text-gray-900">{ticket.eventTitle}</h3>
                                                <p className="text-sm text-gray-600">{new Date(ticket.eventDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={ticket.buyerAvatar}
                                                alt={ticket.buyerName}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-lg object-cover"
                                            />
                                            <div>
                                                <h4 className="font-medium text-gray-900">{ticket.buyerName}</h4>
                                                <p className="text-sm text-gray-600">{ticket.buyerEmail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {ticket.ticketType}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="font-semibold text-gray-900">${ticket.price}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                                            {React.createElement(getStatusIcon(ticket.status), { className: "w-3 h-3" })}
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            {React.createElement(getPaymentIcon(ticket.paymentMethod), {
                                                className: `w-4 h-4 ${ticket.paymentMethod === 'crypto' ? 'text-blue-500' : 'text-gray-600'}`
                                            })}
                                            <span className="capitalize text-sm">{ticket.paymentMethod}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedTicket(ticket);
                                                    setShowTicketModal(true);
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
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Ticket Detail Modal */}
            <TicketModal
                ticket={selectedTicket}
                isOpen={showTicketModal}
                onClose={() => {
                    setShowTicketModal(false);
                    setSelectedTicket(null);
                }}
            />
        </div>
    );
}