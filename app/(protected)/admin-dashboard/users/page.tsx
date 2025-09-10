/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUsers, FiSearch, FiFilter, FiDownload, FiMoreHorizontal,
    FiUserPlus, FiUserCheck, FiUserX, FiMail, FiPhone,
    FiCalendar, FiDollarSign, FiMapPin, FiEdit, FiTrash2,
    FiEye, FiShield, FiClock, FiTrendingUp, FiActivity, FiX
} from 'react-icons/fi';

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    status: 'active' | 'inactive' | 'suspended';
    role: 'user' | 'organiser' | 'admin';
    joinDate: string;
    lastActive: string;
    eventsAttended: number;
    totalSpent: number;
    location: string;
    verified: boolean;
}

const mockUsers: User[] = [
    {
        id: '1',
        name: 'Joe Love',
        email: 'alex@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        status: 'active',
        role: 'user',
        joinDate: '2024-01-15',
        lastActive: '2 hours ago',
        eventsAttended: 12,
        totalSpent: 850,
        location: 'San Francisco, CA',
        verified: true
    },
    {
        id: '2',
        name: 'Joe Rover',
        email: 'rover@rovify.io',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b88e1f9d?w=40&h=40&fit=crop&crop=face',
        status: 'active',
        role: 'organiser',
        joinDate: '2023-11-22',
        lastActive: '1 day ago',
        eventsAttended: 28,
        totalSpent: 2340,
        location: 'New York, NY',
        verified: true
    },
    {
        id: '3',
        name: 'Marcus Reid',
        email: 'marcus@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        status: 'inactive',
        role: 'user',
        joinDate: '2024-03-08',
        lastActive: '2 weeks ago',
        eventsAttended: 5,
        totalSpent: 320,
        location: 'Austin, TX',
        verified: false
    },
    {
        id: '4',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        status: 'suspended',
        role: 'user',
        joinDate: '2023-09-14',
        lastActive: '1 month ago',
        eventsAttended: 3,
        totalSpent: 150,
        location: 'Seattle, WA',
        verified: false
    }
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
    const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'organiser' | 'admin'>('all');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesStatus && matchesRole;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-yellow-100 text-yellow-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800';
            case 'organiser': return 'bg-blue-100 text-blue-800';
            case 'user': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const StatCard = ({ title, value, icon, color }: {
        title: string;
        value: string | number;
        icon: React.ElementType;
        color: string;
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
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
                    {React.createElement(icon, { className: "w-6 h-6", style: { color } })}
                </div>
            </div>
        </motion.div>
    );

    const UserModal = ({ user, isOpen, onClose }: { user: User | null; isOpen: boolean; onClose: () => void }) => (
        <AnimatePresence>
            {isOpen && user && (
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
                                <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* User Header */}
                                <Image
                                    src={user.avatar}
                                    alt={user.name}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-xl object-cover"
                                />
                                <Image
                                    src={user.avatar}
                                    alt={user.name}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-xl object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                        {user.verified && (
                                            <div className="bg-blue-500 text-white rounded-full p-1">
                                                <FiUserCheck className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <FiMail className="w-4 h-4" />
                                        {user.email}
                                    </p>
                                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                                        <FiMapPin className="w-4 h-4" />
                                        {user.location}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                        {user.status}
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${getRoleColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-gray-900">{user.eventsAttended}</p>
                                    <p className="text-sm text-gray-600">Events Attended</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">${user.totalSpent}</p>
                                    <p className="text-sm text-gray-600">Total Spent</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-900">{user.joinDate}</p>
                                    <p className="text-sm text-gray-600">Join Date</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-900">{user.lastActive}</p>
                                    <p className="text-sm text-gray-600">Last Active</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                                    Send Message
                                </button>
                                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                                    View Activity
                                </button>
                                <button className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg font-medium transition-colors">
                                    Suspend
                                </button>
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
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage and monitor your platform users</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                        <FiDownload className="w-4 h-4" />
                        Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                        <FiUserPlus className="w-4 h-4" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value="2,845"
                    icon={FiUsers}
                    color="#FF5722"
                />
                <StatCard
                    title="Active Users"
                    value="2,234"
                    icon={FiActivity}
                    color="#4CAF50"
                />
                <StatCard
                    title="New This Week"
                    value="127"
                    icon={FiTrendingUp}
                    color="#2196F3"
                />
                <StatCard
                    title="Organisers"
                    value="89"
                    icon={FiShield}
                    color="#9C27B0"
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
                                placeholder="Search users by name or email..."
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
                            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'suspended')}
                            className="px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'organiser' | 'admin')}
                            className="px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="all">All Roles</option>
                            <option value="user">Users</option>
                            <option value="organiser">Organisers</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Events</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Spent</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Active</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    className="hover:bg-gray-50 transition-colors"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                                    {user.verified && (
                                                        <div className="bg-blue-500 text-white rounded-full p-1">
                                                            <FiUserCheck className="w-2.5 h-2.5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="font-semibold text-gray-900">{user.eventsAttended}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="font-semibold text-green-600">${user.totalSpent}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-gray-600">{user.lastActive}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setCurrentUser(user);
                                                    setShowUserModal(true);
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

            {/* User Detail Modal */}
            <UserModal
                user={currentUser}
                isOpen={showUserModal}
                onClose={() => {
                    setShowUserModal(false);
                    setCurrentUser(null);
                }}
            />
        </div>
    );
}