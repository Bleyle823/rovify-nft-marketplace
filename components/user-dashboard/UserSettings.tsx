/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUser, FiLock, FiLink, FiAlertCircle, FiEdit3, FiSave, FiCheck,
    FiEye, FiEyeOff, FiShield, FiKey, FiSmartphone, FiMail, FiGlobe,
    FiTrash2, FiDownload, FiExternalLink, FiX, FiPlus, FiWifi
} from 'react-icons/fi';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    bio: string;
    location: string;
    website: string;
}

interface SecuritySettings {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    sessionTimeout: string;
}

interface ConnectedApp {
    id: string;
    name: string;
    icon: string;
    description: string;
    permissions: string[];
    connectedDate: string;
    lastAccess: string;
    status: 'active' | 'expired' | 'revoked';
}

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<string>('account');
    const [savedState, setSavedState] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);

    const [userProfile, setUserProfile] = useState<UserProfile>({
        firstName: 'Joe',
        lastName: 'Love',
        email: 'joe.love@rovify.com',
        phone: '+1 (555) 123-4567',
        username: 'joelove',
        bio: 'Event organizer and crypto enthusiast. Love creating amazing experiences!',
        location: 'San Francisco, CA',
        website: 'https://joelove.dev'
    });

    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: true,
        loginAlerts: true,
        sessionTimeout: '30'
    });

    const [connectedApps] = useState<ConnectedApp[]>([
        {
            id: '1',
            name: 'MetaMask',
            icon: '🦊',
            description: 'Crypto wallet integration for payments and NFT display',
            permissions: ['Read wallet address', 'Request transactions', 'Access NFTs'],
            connectedDate: '2024-01-15',
            lastAccess: '2 hours ago',
            status: 'active'
        },
        {
            id: '2',
            name: 'Spotify',
            icon: '🎵',
            description: 'Music preferences for party recommendations',
            permissions: ['Read listening history', 'Access playlists', 'View top artists'],
            connectedDate: '2024-02-20',
            lastAccess: '1 day ago',
            status: 'active'
        },
        {
            id: '3',
            name: 'Google Calendar',
            icon: '📅',
            description: 'Event scheduling and calendar integration',
            permissions: ['Read calendar events', 'Create events', 'Send invitations'],
            connectedDate: '2024-03-10',
            lastAccess: '5 days ago',
            status: 'expired'
        },
        {
            id: '4',
            name: 'Discord',
            icon: '💬',
            description: 'Community integration and notifications',
            permissions: ['Read user profile', 'Send messages', 'Join servers'],
            connectedDate: '2024-01-30',
            lastAccess: '1 week ago',
            status: 'active'
        }
    ]);

    const handleSave = () => {
        setSavedState(true);
        setEditMode(false);
        setTimeout(() => setSavedState(false), 3000);
    };

    const handleProfileChange = (field: keyof UserProfile, value: string) => {
        setUserProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSecurityChange = (field: keyof SecuritySettings, value: string | boolean) => {
        setSecuritySettings(prev => ({ ...prev, [field]: value }));
    };

    interface SectionTabProps {
        id: string;
        icon: React.ComponentType<{ className?: string }>;
        title: string;
        isActive: boolean;
        onClick: (id: string) => void;
    }

    const SectionTab: React.FC<SectionTabProps> = ({ id, icon: Icon, title, isActive, onClick }) => (
        <motion.button
            onClick={() => onClick(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap ${isActive
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
            <span>{title}</span>
        </motion.button>
    );

    const ToggleSwitch: React.FC<{ value: boolean; onChange: () => void }> = ({ value, onChange }) => (
        <motion.button
            onClick={onChange}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 flex items-center ${value
                ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/25'
                : 'bg-gray-300 hover:bg-gray-400'
                }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className="w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"
                animate={{ x: value ? 24 : 4 }}
            />
        </motion.button>
    );

    const SettingsCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
        <motion.div
            className={`bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );

    const renderAccount = () => (
        <div className="space-y-6">
            <SettingsCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    </div>
                    <motion.button
                        onClick={() => setEditMode(!editMode)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiEdit3 className="w-4 h-4" />
                        {editMode ? 'Cancel' : 'Edit'}
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            value={userProfile.firstName}
                            onChange={(e) => handleProfileChange('firstName', e.target.value)}
                            disabled={!editMode}
                            className={`w-full p-3 border border-gray-200 rounded-xl transition-all ${editMode
                                ? 'bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                                : 'bg-gray-50 cursor-not-allowed'
                                }`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            value={userProfile.lastName}
                            onChange={(e) => handleProfileChange('lastName', e.target.value)}
                            disabled={!editMode}
                            className={`w-full p-3 border border-gray-200 rounded-xl transition-all ${editMode
                                ? 'bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                                : 'bg-gray-50 cursor-not-allowed'
                                }`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={userProfile.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            disabled={!editMode}
                            className={`w-full p-3 border border-gray-200 rounded-xl transition-all ${editMode
                                ? 'bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                                : 'bg-gray-50 cursor-not-allowed'
                                }`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            value={userProfile.phone}
                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                            disabled={!editMode}
                            className={`w-full p-3 border border-gray-200 rounded-xl transition-all ${editMode
                                ? 'bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                                : 'bg-gray-50 cursor-not-allowed'
                                }`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={userProfile.username}
                            onChange={(e) => handleProfileChange('username', e.target.value)}
                            disabled={!editMode}
                            className={`w-full p-3 border border-gray-200 rounded-xl transition-all ${editMode
                                ? 'bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                                : 'bg-gray-50 cursor-not-allowed'
                                }`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            value={userProfile.location}
                            onChange={(e) => handleProfileChange('location', e.target.value)}
                            disabled={!editMode}
                            className={`w-full p-3 border border-gray-200 rounded-xl transition-all ${editMode
                                ? 'bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                                : 'bg-gray-50 cursor-not-allowed'
                                }`}
                        />
                    </div>
                </div>

                <div className="mt-6 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        value={userProfile.bio}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        disabled={!editMode}
                        rows={3}
                        className={`w-full p-3 border border-gray-200 rounded-xl transition-all resize-none ${editMode
                            ? 'bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                            : 'bg-gray-50 cursor-not-allowed'
                            }`}
                    />
                </div>

                <div className="mt-6 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                        type="url"
                        value={userProfile.website}
                        onChange={(e) => handleProfileChange('website', e.target.value)}
                        disabled={!editMode}
                        className={`w-full p-3 border border-gray-200 rounded-xl transition-all ${editMode
                            ? 'bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                            : 'bg-gray-50 cursor-not-allowed'
                            }`}
                    />
                </div>

                {editMode && (
                    <motion.div
                        className="mt-6 flex gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <motion.button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiSave className="w-4 h-4" />
                            Save Changes
                        </motion.button>
                        <motion.button
                            onClick={() => setEditMode(false)}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiX className="w-4 h-4" />
                            Cancel
                        </motion.button>
                    </motion.div>
                )}
            </SettingsCard>
        </div>
    );

    const renderSecurity = () => (
        <div className="space-y-6">
            <SettingsCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <FiLock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Password & Security</h3>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Change Password</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={securitySettings.currentPassword}
                                        onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                                        className="w-full p-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    value={securitySettings.newPassword}
                                    onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={securitySettings.confirmPassword}
                                    onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <motion.button
                                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Update Password
                            </motion.button>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h4 className="font-medium text-gray-900 mb-4">Security Settings</h4>
                        <div className="space-y-4">
                            <motion.div
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="flex items-center gap-3">
                                    <FiShield className="w-5 h-5 text-green-500" />
                                    <div>
                                        <h5 className="font-medium text-gray-900">Two-Factor Authentication</h5>
                                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    value={securitySettings.twoFactorEnabled}
                                    onChange={() => handleSecurityChange('twoFactorEnabled', !securitySettings.twoFactorEnabled)}
                                />
                            </motion.div>

                            <motion.div
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="flex items-center gap-3">
                                    <FiMail className="w-5 h-5 text-blue-500" />
                                    <div>
                                        <h5 className="font-medium text-gray-900">Login Alerts</h5>
                                        <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    value={securitySettings.loginAlerts}
                                    onChange={() => handleSecurityChange('loginAlerts', !securitySettings.loginAlerts)}
                                />
                            </motion.div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Session Timeout</label>
                                <select
                                    value={securitySettings.sessionTimeout}
                                    onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="never">Never</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsCard>
        </div>
    );

    const renderConnectedApps = () => (
        <div className="space-y-6">
            <SettingsCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                            <FiLink className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Connected Applications</h3>
                    </div>
                    <motion.button
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiPlus className="w-4 h-4" />
                        Connect App
                    </motion.button>
                </div>

                <div className="space-y-4">
                    {connectedApps.map((app) => (
                        <motion.div
                            key={app.id}
                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all"
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                                {app.icon}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-gray-900">{app.name}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.status === 'active' ? 'bg-green-100 text-green-700' :
                                        app.status === 'expired' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{app.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>Connected {app.connectedDate}</span>
                                    <span>Last access: {app.lastAccess}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <motion.button
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="View permissions"
                                >
                                    <FiExternalLink className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Disconnect"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </SettingsCard>
        </div>
    );

    const renderDangerZone = () => (
        <div className="space-y-6">
            <SettingsCard className="p-6 border-red-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                        <FiAlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                </div>

                <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-blue-900 mb-1">Export Account Data</h4>
                                <p className="text-sm text-blue-700">Download a copy of all your account data and activity</p>
                            </div>
                            <motion.button
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiDownload className="w-4 h-4" />
                                Export Data
                            </motion.button>
                        </div>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-red-900 mb-1">Delete Account</h4>
                                <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
                            </div>
                            <motion.button
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiTrash2 className="w-4 h-4" />
                                Delete Account
                            </motion.button>
                        </div>
                        <div className="mt-3 p-3 bg-red-100 rounded-lg">
                            <p className="text-xs text-red-800">
                                ⚠️ This action cannot be undone. All your events, data, and account information will be permanently deleted.
                            </p>
                        </div>
                    </div>
                </div>
            </SettingsCard>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'account': return renderAccount();
            case 'security': return renderSecurity();
            case 'apps': return renderConnectedApps();
            case 'danger': return renderDangerZone();
            default: return renderAccount();
        }
    };

    return (
        <div className="space-y-8">
            {/* Tab Navigation */}
            <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-wrap gap-2 p-1 bg-gray-50 rounded-xl">
                    <SectionTab
                        id="account"
                        icon={FiUser}
                        title="Account Info"
                        isActive={activeSection === 'account'}
                        onClick={setActiveSection}
                    />
                    <SectionTab
                        id="security"
                        icon={FiLock}
                        title="Security"
                        isActive={activeSection === 'security'}
                        onClick={setActiveSection}
                    />
                    <SectionTab
                        id="apps"
                        icon={FiLink}
                        title="Connected Apps"
                        isActive={activeSection === 'apps'}
                        onClick={setActiveSection}
                    />
                    <SectionTab
                        id="danger"
                        icon={FiAlertCircle}
                        title="Danger Zone"
                        isActive={activeSection === 'danger'}
                        onClick={setActiveSection}
                    />
                </div>
            </motion.div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
                {savedState && (
                    <motion.div
                        className="fixed bottom-6 right-6 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3"
                        initial={{ opacity: 0, y: 100, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.3 }}
                        transition={{ type: "spring", duration: 0.5 }}
                    >
                        <FiCheck className="w-5 h-5" />
                        <span className="font-medium">Settings saved successfully!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}