/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiShield, FiLock, FiEye, FiEyeOff, FiKey, FiAlertTriangle,
    FiCheckCircle, FiXCircle, FiClock, FiGlobe, FiUser, FiActivity,
    FiRefreshCw, FiDownload, FiFilter, FiSearch, FiMoreHorizontal,
    FiSettings, FiDatabase, FiServer, FiWifi, FiMail, FiPhone,
    FiMapPin, FiFlag, FiUserX, FiUnlock, FiRotateCcw
} from 'react-icons/fi';
import React from 'react';
import Image from 'next/image';

interface SecurityEvent {
    id: string;
    type: 'login_attempt' | 'password_change' | 'account_creation' | 'suspicious_activity' | 'data_access' | 'permission_change';
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar: string;
        role: string;
    };
    details: {
        ipAddress: string;
        location: string;
        device: string;
        browser: string;
        success: boolean;
        description: string;
    };
    status: 'resolved' | 'investigating' | 'open' | 'dismissed';
}

interface SecurityMetrics {
    totalEvents: number;
    criticalAlerts: number;
    activeThreats: number;
    blockedAttempts: number;
    uptime: number;
    lastScan: string;
    vulnerabilities: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    twoFactorEnabled: number;
    passwordStrength: {
        strong: number;
        medium: number;
        weak: number;
    };
}

const mockSecurityEvents: SecurityEvent[] = [
    {
        id: '1',
        type: 'suspicious_activity',
        severity: 'high',
        timestamp: '2024-12-15T10:30:00Z',
        user: {
            id: 'user_123',
            name: 'Unknown User',
            email: 'suspicious@example.com',
            avatar: '',
            role: 'guest'
        },
        details: {
            ipAddress: '192.168.1.100',
            location: 'Unknown Location',
            device: 'Unknown Device',
            browser: 'Chrome 120',
            success: false,
            description: 'Multiple failed login attempts from new location'
        },
        status: 'investigating'
    },
    {
        id: '2',
        type: 'login_attempt',
        severity: 'medium',
        timestamp: '2024-12-15T09:15:00Z',
        user: {
            id: 'user_456',
            name: 'Joe Love',
            email: 'alex@example.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            role: 'admin'
        },
        details: {
            ipAddress: '203.0.113.1',
            location: 'New York, US',
            device: 'MacBook Pro',
            browser: 'Safari 17',
            success: true,
            description: 'Admin login from new device'
        },
        status: 'resolved'
    },
    {
        id: '3',
        type: 'password_change',
        severity: 'low',
        timestamp: '2024-12-14T16:45:00Z',
        user: {
            id: 'user_789',
            name: 'Joe Rover',
            email: 'rover@rovify.io',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b88e1f9d?w=40&h=40&fit=crop&crop=face',
            role: 'organiser'
        },
        details: {
            ipAddress: '198.51.100.1',
            location: 'San Francisco, US',
            device: 'iPhone 15',
            browser: 'Safari Mobile',
            success: true,
            description: 'Password updated successfully'
        },
        status: 'resolved'
    }
];

const mockMetrics: SecurityMetrics = {
    totalEvents: 1247,
    criticalAlerts: 3,
    activeThreats: 1,
    blockedAttempts: 89,
    uptime: 99.9,
    lastScan: '2024-12-15T08:00:00Z',
    vulnerabilities: {
        critical: 0,
        high: 2,
        medium: 5,
        low: 12
    },
    twoFactorEnabled: 87.3,
    passwordStrength: {
        strong: 634,
        medium: 423,
        weak: 89
    }
};

export default function SecurityPage() {
    const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
    const [metrics, setMetrics] = useState<SecurityMetrics>(mockMetrics);
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState<'all' | SecurityEvent['severity']>('all');
    const [typeFilter, setTypeFilter] = useState<'all' | SecurityEvent['type']>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | SecurityEvent['status']>('all');
    const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const filteredEvents = securityEvents.filter(event => {
        const matchesSearch = event.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.details.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
        const matchesType = typeFilter === 'all' || event.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
        return matchesSearch && matchesSeverity && matchesType && matchesStatus;
    });

    const getSeverityColor = (severity: SecurityEvent['severity']) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getSeverityIcon = (severity: SecurityEvent['severity']) => {
        switch (severity) {
            case 'critical': return FiAlertTriangle;
            case 'high': return FiAlertTriangle;
            case 'medium': return FiClock;
            case 'low': return FiCheckCircle;
            default: return FiCheckCircle;
        }
    };

    const getStatusColor = (status: SecurityEvent['status']) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'investigating': return 'bg-yellow-100 text-yellow-800';
            case 'open': return 'bg-red-100 text-red-800';
            case 'dismissed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: SecurityEvent['type']) => {
        switch (type) {
            case 'login_attempt': return FiUser;
            case 'password_change': return FiKey;
            case 'account_creation': return FiUser;
            case 'suspicious_activity': return FiAlertTriangle;
            case 'data_access': return FiDatabase;
            case 'permission_change': return FiSettings;
            default: return FiActivity;
        }
    };

    const performSecurityScan = async () => {
        setIsScanning(true);
        // Simulate security scan
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsScanning(false);
        setMetrics(prev => ({ ...prev, lastScan: new Date().toISOString() }));
    };

    const SecurityMetricCard = ({ title, value, icon, color, subtitle, status }: {
        title: string;
        value: string | number;
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
        color: string;
        subtitle?: string;
        status?: 'good' | 'warning' | 'critical';
    }) => (
        <motion.div
            className={`bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-200 ${status === 'critical' ? 'border-red-200' :
                status === 'warning' ? 'border-yellow-200' :
                    'border-gray-100'
                }`}
            whileHover={{ y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
                    {React.createElement(icon, { className: "w-6 h-6", style: { color } })}
                </div>
            </div>
            {status && (
                <div className="mt-4">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status === 'good' ? 'bg-green-100 text-green-800' :
                        status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {status === 'good' && <FiCheckCircle className="w-3 h-3" />}
                        {status === 'warning' && <FiClock className="w-3 h-3" />}
                        {status === 'critical' && <FiAlertTriangle className="w-3 h-3" />}
                        {status === 'good' ? 'Secure' : status === 'warning' ? 'Monitor' : 'Action Required'}
                    </div>
                </div>
            )}
        </motion.div>
    );

    const SecurityEventModal = ({ event, isOpen, onClose }: {
        event: SecurityEvent | null;
        isOpen: boolean;
        onClose: () => void
    }) => (
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
                        className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Security Event Details</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <FiMoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Event Header */}
                                <div className={`p-4 rounded-xl border-2 ${getSeverityColor(event.severity)}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white/50`}>
                                            {React.createElement(getSeverityIcon(event.severity), { className: "w-5 h-5" })}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold capitalize">{event.type.replace('_', ' ')}</h3>
                                            <p className="text-sm opacity-80">{event.details.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                                            {event.status}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {new Date(event.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* User Information */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">User Information</h4>
                                    <div className="flex items-center gap-3 mb-4">
                                        {event.user.avatar ? (
                                            <Image
                                                src={event.user.avatar}
                                                alt={event.user.name}
                                                width={48}
                                                height={48}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gray-300 flex items-center justify-center">
                                                <FiUser className="w-6 h-6 text-gray-600" />
                                            </div>
                                        )}
                                        <div>
                                            <h5 className="font-medium text-gray-900">{event.user.name}</h5>
                                            <p className="text-sm text-gray-600">{event.user.email}</p>
                                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mt-1">
                                                {event.user.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Technical Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900">Network Details</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">IP Address</span>
                                                <span className="font-mono text-sm">{event.details.ipAddress}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Location</span>
                                                <span>{event.details.location}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Success</span>
                                                <span className={event.details.success ? 'text-green-600' : 'text-red-600'}>
                                                    {event.details.success ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900">Device Details</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Device</span>
                                                <span>{event.details.device}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Browser</span>
                                                <span>{event.details.browser}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Event ID</span>
                                                <span className="font-mono text-sm">{event.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold text-gray-900 mb-4">Available Actions</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                                            Investigate
                                        </button>
                                        <button className="bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded-lg font-medium transition-colors">
                                            Mark Resolved
                                        </button>
                                        <button className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg font-medium transition-colors">
                                            Block User
                                        </button>
                                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                                            Dismiss
                                        </button>
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
                    <h1 className="text-3xl font-bold text-gray-900">Security Center</h1>
                    <p className="text-gray-600 mt-1">Monitor security events, threats, and system protection status</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={performSecurityScan}
                        disabled={isScanning}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        <FiRefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                        {isScanning ? 'Scanning...' : 'Security Scan'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                        <FiDownload className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Security Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SecurityMetricCard
                    title="System Uptime"
                    value={`${metrics.uptime}%`}
                    icon={FiServer}
                    color="#4CAF50"
                    subtitle="Last 30 days"
                    status="good"
                />
                <SecurityMetricCard
                    title="Critical Alerts"
                    value={metrics.criticalAlerts}
                    icon={FiAlertTriangle}
                    color="#FF5722"
                    subtitle="Requires attention"
                    status={metrics.criticalAlerts > 0 ? "critical" : "good"}
                />
                <SecurityMetricCard
                    title="Active Threats"
                    value={metrics.activeThreats}
                    icon={FiShield}
                    color="#FF9800"
                    subtitle="Currently monitoring"
                    status={metrics.activeThreats > 0 ? "warning" : "good"}
                />
                <SecurityMetricCard
                    title="Blocked Attempts"
                    value={metrics.blockedAttempts}
                    icon={FiUserX}
                    color="#9C27B0"
                    subtitle="Last 24 hours"
                    status="good"
                />
            </div>

            {/* Security Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vulnerability Status */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Vulnerability Status</h3>
                        <div className="text-right text-sm text-gray-600">
                            Last scan: {new Date(metrics.lastScan).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { level: 'Critical', count: metrics.vulnerabilities.critical, color: 'red' },
                            { level: 'High', count: metrics.vulnerabilities.high, color: 'orange' },
                            { level: 'Medium', count: metrics.vulnerabilities.medium, color: 'yellow' },
                            { level: 'Low', count: metrics.vulnerabilities.low, color: 'blue' }
                        ].map((vuln, index) => (
                            <motion.div
                                key={vuln.level}
                                className="flex items-center justify-between"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full bg-${vuln.color}-500`}></div>
                                    <span className="font-medium text-gray-900">{vuln.level}</span>
                                </div>
                                <span className={`font-bold ${vuln.count > 0 ? `text-${vuln.color}-600` : 'text-green-600'}`}>
                                    {vuln.count}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Two-Factor Authentication</h3>
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">{metrics.twoFactorEnabled}%</div>
                            <p className="text-sm text-gray-600">Users with 2FA enabled</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div
                                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${metrics.twoFactorEnabled}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-800">
                                <strong>Good!</strong> Above recommended 80% threshold
                            </p>
                        </div>
                    </div>
                </div>

                {/* Password Strength */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Password Strength Distribution</h3>
                    <div className="space-y-4">
                        {[
                            { strength: 'Strong', count: metrics.passwordStrength.strong, color: 'green', percentage: 55 },
                            { strength: 'Medium', count: metrics.passwordStrength.medium, color: 'yellow', percentage: 37 },
                            { strength: 'Weak', count: metrics.passwordStrength.weak, color: 'red', percentage: 8 }
                        ].map((pwd, index) => (
                            <motion.div
                                key={pwd.strength}
                                className="space-y-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-900">{pwd.strength}</span>
                                    <span className="font-semibold">{pwd.count} users</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <motion.div
                                        className={`bg-${pwd.color}-500 h-2 rounded-full`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pwd.percentage}%` }}
                                        transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                                    />
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
                                placeholder="Search security events by user, IP, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value as 'all' | SecurityEvent['severity'])}
                            className="px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="all">All Severities</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as 'all' | SecurityEvent['type'])}
                            className="px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="all">All Types</option>
                            <option value="login_attempt">Login Attempts</option>
                            <option value="password_change">Password Changes</option>
                            <option value="account_creation">Account Creation</option>
                            <option value="suspicious_activity">Suspicious Activity</option>
                            <option value="data_access">Data Access</option>
                            <option value="permission_change">Permission Changes</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'all' | SecurityEvent['status'])}
                            className="px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="investigating">Investigating</option>
                            <option value="resolved">Resolved</option>
                            <option value="dismissed">Dismissed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Security Events Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Event</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Severity</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Location</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Time</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredEvents.map((event, index) => (
                                <motion.tr
                                    key={event.id}
                                    className="hover:bg-gray-50 transition-colors"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100`}>
                                                {React.createElement(getTypeIcon(event.type), { className: "w-5 h-5 text-gray-600" })}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 capitalize">{event.type.replace('_', ' ')}</h3>
                                                <p className="text-sm text-gray-600 line-clamp-1">{event.details.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            {event.user.avatar ? (
                                                <Image
                                                    src={event.user.avatar}
                                                    alt={event.user.name}
                                                    width={32}
                                                    height={32}
                                                    className="w-8 h-8 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center">
                                                    <FiUser className="w-4 h-4 text-gray-600" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-medium text-gray-900">{event.user.name}</h4>
                                                <p className="text-sm text-gray-600">{event.user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(event.severity)}`}>
                                            {React.createElement(getSeverityIcon(event.severity), { className: "w-3 h-3" })}
                                            {event.severity}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-medium text-gray-900">{event.details.location}</p>
                                            <p className="text-sm text-gray-600 font-mono">{event.details.ipAddress}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-gray-600">
                                            {new Date(event.timestamp).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
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
                                                <FiFlag className="w-4 h-4" />
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

            {/* Security Event Detail Modal */}
            <SecurityEventModal
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