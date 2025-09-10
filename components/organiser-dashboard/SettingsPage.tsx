/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiSettings, FiUser, FiCreditCard, FiBell, FiShield, FiGlobe,
    FiMail, FiSmartphone, FiEye, FiEyeOff, FiSave, FiUpload,
    FiToggleLeft, FiToggleRight, FiEdit3, FiTrash2, FiPlus,
    FiKey, FiLock, FiUnlock, FiCheck, FiX, FiAlertCircle,
    FiHelpCircle, FiLogOut, FiRefreshCw, FiDownload, FiLink
} from 'react-icons/fi';
import { IoSparkles } from "react-icons/io5";
import { HiOutlineSparkles, HiOutlineCog6Tooth } from "react-icons/hi2";
import { BsShield, BsBank, BsCreditCard2Front } from "react-icons/bs";

// Mock settings data
const mockSettings = {
    profile: {
        name: 'Joe Rover',
        email: 'sarah.chen@rovify.io',
        phone: '+1 (555) 123-4567',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        company: 'Rovify Events',
        title: 'Senior Event Organizer',
        bio: 'Passionate event organizer with 8+ years of experience creating memorable experiences',
        website: 'https://sarahevents.com',
        timezone: 'America/Los_Angeles',
        language: 'English'
    },
    notifications: {
        email: {
            newRegistrations: true,
            paymentReceived: true,
            eventReminders: true,
            marketingUpdates: false,
            systemUpdates: true,
            weeklyReports: true
        },
        push: {
            newRegistrations: true,
            paymentReceived: true,
            eventReminders: false,
            urgentAlerts: true
        },
        sms: {
            eventReminders: false,
            paymentFailed: true,
            systemAlerts: true
        }
    },
    security: {
        twoFactorEnabled: true,
        lastPasswordChange: '2025-05-15',
        activeSessions: 3,
        loginNotifications: true
    },
    payment: {
        defaultCurrency: 'USD',
        payoutSchedule: 'weekly',
        minimumPayout: 100,
        bankAccount: {
            accountNumber: '****4567',
            routingNumber: '****8901',
            bankName: 'Chase Bank'
        },
        paymentMethods: [
            { id: 1, type: 'stripe', name: 'Stripe Connect', status: 'active' },
            { id: 2, type: 'paypal', name: 'PayPal Business', status: 'active' },
            { id: 3, type: 'apple_pay', name: 'Apple Pay', status: 'inactive' }
        ]
    },
    preferences: {
        theme: 'light',
        autoSave: true,
        compactMode: false,
        showTips: true,
        dataCollection: true
    }
};

const settingsSections = [
    { id: 'profile', label: 'Profile', icon: <FiUser className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <FiShield className="w-5 h-5" /> },
    { id: 'payment', label: 'Payments', icon: <FiCreditCard className="w-5 h-5" /> },
    { id: 'preferences', label: 'Preferences', icon: <FiSettings className="w-5 h-5" /> }
];

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange, label }: {
    enabled: boolean;
    onChange: (value: boolean) => void;
    label?: string;
}) => (
    <motion.button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${enabled ? 'bg-orange-500' : 'bg-gray-200'
            }`}
        whileTap={{ scale: 0.95 }}
    >
        <motion.span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            layout
        />
    </motion.button>
);

// Profile Section Component
const ProfileSection = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(mockSettings.profile);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                <motion.button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiEdit3 className="w-4 h-4" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </motion.button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-6">
                    <div className="relative">
                        <div style={{ width: 100, height: 100, position: 'relative' }}>
                            <Image
                                src={formData.avatar}
                                alt={formData.name}
                                className="w-full h-full object-cover rounded-xl"
                                fill
                                sizes="100px"
                            />
                        </div>
                        {isEditing && (
                            <motion.button
                                className="absolute -bottom-2 -right-2 p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiUpload className="w-4 h-4" />
                            </motion.button>
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-900 font-semibold">{formData.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-900">{formData.email}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-900">{formData.phone}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-900">{formData.company}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            {isEditing ? (
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-gray-700">{formData.bio}</p>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex items-center gap-3">
                                <motion.button
                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiSave className="w-4 h-4" />
                                    Save Changes
                                </motion.button>
                                <motion.button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Notifications Section Component
const NotificationsSection = () => {
    const [notifications, setNotifications] = useState(mockSettings.notifications);

    const updateNotification = (type: keyof typeof notifications, key: string, value: boolean) => {
        setNotifications(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [key]: value
            }
        }));
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Notification Preferences</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Email Notifications */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FiMail className="w-5 h-5 text-orange-600" />
                        <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(notifications.email).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <label className="text-sm text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <ToggleSwitch
                                    enabled={value}
                                    onChange={(newValue) => updateNotification('email', key, newValue)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Push Notifications */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FiBell className="w-5 h-5 text-orange-600" />
                        <h4 className="font-semibold text-gray-900">Push Notifications</h4>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(notifications.push).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <label className="text-sm text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <ToggleSwitch
                                    enabled={value}
                                    onChange={(newValue) => updateNotification('push', key, newValue)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* SMS Notifications */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FiSmartphone className="w-5 h-5 text-orange-600" />
                        <h4 className="font-semibold text-gray-900">SMS Notifications</h4>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(notifications.sms).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <label className="text-sm text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <ToggleSwitch
                                    enabled={value}
                                    onChange={(newValue) => updateNotification('sms', key, newValue)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Security Section Component
const SecuritySection = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Security & Privacy</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Password & Authentication */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiLock className="w-5 h-5 text-orange-600" />
                        Password & Authentication
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-600">Add an extra layer of security</p>
                            </div>
                            <ToggleSwitch enabled={mockSettings.security.twoFactorEnabled} onChange={() => { }} />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Login Notifications</p>
                                <p className="text-sm text-gray-600">Get notified of new sign-ins</p>
                            </div>
                            <ToggleSwitch enabled={mockSettings.security.loginNotifications} onChange={() => { }} />
                        </div>

                        <motion.button
                            className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiKey className="w-4 h-4" />
                            Change Password
                        </motion.button>
                    </div>
                </div>

                {/* Active Sessions */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiShield className="w-5 h-5 text-orange-600" />
                        Active Sessions
                    </h4>
                    <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Current Session</p>
                                    <p className="text-sm text-gray-600">MacBook Pro • San Francisco, CA</p>
                                </div>
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Active</span>
                            </div>
                        </div>

                        <div className="p-3 bg-white rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">iPhone 14 Pro</p>
                                    <p className="text-sm text-gray-600">Mobile App • 2 hours ago</p>
                                </div>
                                <motion.button
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Revoke
                                </motion.button>
                            </div>
                        </div>

                        <motion.button
                            className="w-full px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Sign Out All Devices
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Payment Section Component
const PaymentSection = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Payment Settings</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payout Settings */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BsBank className="w-5 h-5 text-orange-600" />
                        Payout Settings
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payout Schedule</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                <option value="weekly">Weekly</option>
                                <option value="bi-weekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payout</label>
                            <input
                                type="number"
                                value={mockSettings.payment.minimumPayout}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                            <p className="font-medium text-gray-900 mb-1">Bank Account</p>
                            <p className="text-sm text-gray-600">{mockSettings.payment.bankAccount.bankName}</p>
                            <p className="text-sm font-mono text-gray-600">{mockSettings.payment.bankAccount.accountNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BsCreditCard2Front className="w-5 h-5 text-orange-600" />
                        Payment Methods
                    </h4>
                    <div className="space-y-3">
                        {mockSettings.payment.paymentMethods.map((method) => (
                            <div key={method.id} className="p-3 bg-white rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{method.name}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${method.status === 'active'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {method.status}
                                        </span>
                                    </div>
                                    <motion.button
                                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Configure
                                    </motion.button>
                                </div>
                            </div>
                        ))}

                        <motion.button
                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiPlus className="w-4 h-4" />
                            Add Payment Method
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('profile');

    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return <ProfileSection />;
            case 'notifications':
                return <NotificationsSection />;
            case 'security':
                return <SecuritySection />;
            case 'payment':
                return <PaymentSection />;
            case 'preferences':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900">Preferences</h3>
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900">Appearance</h4>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-700">Dark Mode</label>
                                        <ToggleSwitch enabled={false} onChange={() => { }} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-700">Compact Mode</label>
                                        <ToggleSwitch enabled={mockSettings.preferences.compactMode} onChange={() => { }} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900">Behavior</h4>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-700">Auto Save</label>
                                        <ToggleSwitch enabled={mockSettings.preferences.autoSave} onChange={() => { }} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-700">Show Tips</label>
                                        <ToggleSwitch enabled={mockSettings.preferences.showTips} onChange={() => { }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <ProfileSection />;
        }
    };

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

                <div className="relative">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-3 flex items-center gap-3">
                        <HiOutlineCog6Tooth className="w-12 h-12" />
                        Settings
                    </h1>
                    <p className="text-orange-100 text-lg mb-4">
                        Account and security settings • Manage your preferences
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                            <IoSparkles className="w-5 h-5" />
                            <span className="font-semibold">Pro Account</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                            <FiShield className="w-5 h-5" />
                            <span className="font-semibold">2FA Enabled</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Settings Navigation & Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <motion.div
                    className="lg:col-span-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-8">
                        <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
                        <nav className="space-y-2">
                            {settingsSections.map((section) => (
                                <motion.button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeSection === section.id
                                        ? 'bg-orange-500 text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                                        }`}
                                    whileHover={{ scale: 1.02, x: activeSection === section.id ? 0 : 4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {section.icon}
                                    {section.label}
                                </motion.button>
                            ))}
                        </nav>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <motion.button
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiLogOut className="w-5 h-5" />
                                Sign Out
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Content Area */}
                <motion.div
                    className="lg:col-span-3"
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                        {renderSection()}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}