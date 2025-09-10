/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiSettings, FiGlobe, FiLock, FiMail, FiCreditCard,
    FiDatabase, FiShield, FiUsers, FiActivity, FiSave,
    FiRefreshCw, FiUpload, FiDownload, FiToggleLeft,
    FiToggleRight, FiBell, FiEye, FiEyeOff, FiKey,
    FiServer, FiCloud, FiBarChart, FiCode
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import React from 'react';

interface SettingSection {
    id: string;
    name: string;
    description: string;
    icon: IconType;
    color: string;
}

interface Setting {
    id: string;
    name: string;
    description: string;
    type: 'toggle' | 'input' | 'select' | 'textarea';
    value: string | boolean;
    options?: string[];
    section: string;
}

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('general');
    const [settings, setSettings] = useState<Setting[]>([
        // General Settings
        { id: 'site_name', name: 'Site Name', description: 'The name of your platform', type: 'input', value: 'Rovify', section: 'general' },
        { id: 'site_description', name: 'Site Description', description: 'Brief description of your platform', type: 'textarea', value: 'Discover and attend amazing events', section: 'general' },
        { id: 'maintenance_mode', name: 'Maintenance Mode', description: 'Put the site in maintenance mode', type: 'toggle', value: false, section: 'general' },
        { id: 'user_registration', name: 'User Registration', description: 'Allow new users to register', type: 'toggle', value: true, section: 'general' },
        { id: 'event_approval', name: 'Event Approval Required', description: 'Require admin approval for new events', type: 'toggle', value: true, section: 'general' },

        // Security Settings
        { id: 'two_factor_required', name: 'Require 2FA for Admins', description: 'Enforce two-factor authentication for admin accounts', type: 'toggle', value: true, section: 'security' },
        { id: 'session_timeout', name: 'Session Timeout', description: 'Auto-logout time in minutes', type: 'select', value: '60', options: ['30', '60', '120', '240'], section: 'security' },
        { id: 'password_policy', name: 'Strong Password Policy', description: 'Enforce complex password requirements', type: 'toggle', value: true, section: 'security' },
        { id: 'login_attempts', name: 'Max Login Attempts', description: 'Number of failed attempts before lockout', type: 'select', value: '5', options: ['3', '5', '10'], section: 'security' },

        // Payment Settings
        { id: 'stripe_public_key', name: 'Stripe Public Key', description: 'Your Stripe publishable key', type: 'input', value: 'pk_test_...', section: 'payment' },
        { id: 'commission_rate', name: 'Platform Commission (%)', description: 'Commission percentage on ticket sales', type: 'input', value: '5', section: 'payment' },
        { id: 'auto_payouts', name: 'Automatic Payouts', description: 'Enable automatic payouts to organisers', type: 'toggle', value: true, section: 'payment' },
        { id: 'refund_policy', name: 'Refund Policy', description: 'Days before event when refunds are allowed', type: 'input', value: '7', section: 'payment' },

        // Email Settings
        { id: 'smtp_host', name: 'SMTP Host', description: 'Email server hostname', type: 'input', value: 'smtp.gmail.com', section: 'email' },
        { id: 'smtp_port', name: 'SMTP Port', description: 'Email server port', type: 'input', value: '587', section: 'email' },
        { id: 'email_notifications', name: 'Email Notifications', description: 'Send email notifications to users', type: 'toggle', value: true, section: 'email' },
        { id: 'newsletter_enabled', name: 'Newsletter', description: 'Enable newsletter subscriptions', type: 'toggle', value: true, section: 'email' },

        // API Settings
        { id: 'api_rate_limit', name: 'API Rate Limit', description: 'Requests per minute per IP', type: 'input', value: '100', section: 'api' },
        { id: 'webhook_enabled', name: 'Webhooks Enabled', description: 'Allow webhook integrations', type: 'toggle', value: true, section: 'api' },
        { id: 'api_docs_public', name: 'Public API Docs', description: 'Make API documentation public', type: 'toggle', value: false, section: 'api' },
    ]);

    const sections: SettingSection[] = [
        { id: 'general', name: 'General', description: 'Basic platform settings', icon: FiSettings, color: '#FF5722' },
        { id: 'security', name: 'Security', description: 'Security and access control', icon: FiShield, color: '#4CAF50' },
        { id: 'payment', name: 'Payment', description: 'Payment processing settings', icon: FiCreditCard, color: '#2196F3' },
        { id: 'email', name: 'Email', description: 'Email and notification settings', icon: FiMail, color: '#9C27B0' },
        { id: 'api', name: 'API', description: 'API and integration settings', icon: FiCode, color: '#FF9800' },
        { id: 'backup', name: 'Backup', description: 'Data backup and restore', icon: FiDatabase, color: '#607D8B' },
    ];

    const updateSetting = (settingId: string, newValue: string | boolean) => {
        setSettings(prev => prev.map(setting =>
            setting.id === settingId ? { ...setting, value: newValue } : setting
        ));
    };

    const getSettingsForSection = (sectionId: string) => {
        return settings.filter(setting => setting.section === sectionId);
    };

    const SettingItem = ({ setting }: { setting: Setting }) => (
        <motion.div
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{setting.name}</h3>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                </div>

                <div className="ml-4">
                    {setting.type === 'toggle' && (
                        <button
                            onClick={() => updateSetting(setting.id, !setting.value)}
                            className="flex items-center"
                        >
                            {setting.value ? (
                                <FiToggleRight className="w-8 h-8 text-orange-500" />
                            ) : (
                                <FiToggleLeft className="w-8 h-8 text-gray-300" />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {setting.type === 'input' && (
                <input
                    type="text"
                    value={typeof setting.value === 'string' ? setting.value : String(setting.value)}
                    onChange={(e) => updateSetting(setting.id, e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                />
            )}

            {setting.type === 'textarea' && (
                <textarea
                    value={typeof setting.value === 'string' ? setting.value : String(setting.value)}
                    onChange={(e) => updateSetting(setting.id, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all resize-none"
                />
            )}

            {setting.type === 'select' && (
                <select
                    value={typeof setting.value === 'string' ? setting.value : String(setting.value)}
                    onChange={(e) => updateSetting(setting.id, e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                >
                    {setting.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            )}
        </motion.div>
    );

    const SystemInfoCard = ({ title, value, icon, color }: {
        title: string;
        value: string;
        icon: IconType;
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
                    <p className="text-lg font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
                    {React.createElement(icon, { className: "w-5 h-5", style: { color } })}
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                    <p className="text-gray-600 mt-1">Configure your platform settings and preferences</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                        <FiRefreshCw className="w-4 h-4" />
                        Reset to Defaults
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                        <FiSave className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SystemInfoCard
                    title="System Status"
                    value="Operational"
                    icon={FiActivity}
                    color="#4CAF50"
                />
                <SystemInfoCard
                    title="Database Size"
                    value="2.4 GB"
                    icon={FiDatabase}
                    color="#2196F3"
                />
                <SystemInfoCard
                    title="API Calls Today"
                    value="14,726"
                    icon={FiBarChart}
                    color="#FF9800"
                />
                <SystemInfoCard
                    title="Storage Used"
                    value="67%"
                    icon={FiCloud}
                    color="#9C27B0"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm sticky top-8">
                        <h2 className="font-semibold text-gray-900 mb-4">Settings Categories</h2>
                        <div className="space-y-1">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${activeSection === section.id
                                        ? 'bg-orange-50 text-orange-600 border border-orange-200'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeSection === section.id ? 'bg-orange-100' : 'bg-gray-100'
                                        }`}>
                                        <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-orange-600' : 'text-gray-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{section.name}</p>
                                        <p className="text-xs text-gray-500">{section.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Section Header */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                {React.createElement(
                                    sections.find(s => s.id === activeSection)?.icon || FiSettings,
                                    { className: "w-5 h-5 text-orange-600" }
                                )}
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {sections.find(s => s.id === activeSection)?.name}
                                </h2>
                            </div>
                            <p className="text-gray-600">
                                {sections.find(s => s.id === activeSection)?.description}
                            </p>
                        </div>

                        {/* Settings for Active Section */}
                        <div className="space-y-4">
                            {getSettingsForSection(activeSection).map((setting) => (
                                <SettingItem key={setting.id} setting={setting} />
                            ))}
                        </div>

                        {/* Special Sections */}
                        {activeSection === 'backup' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                    <h3 className="font-semibold text-gray-900 mb-4">Database Backup</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                                            <FiDownload className="w-4 h-4" />
                                            Download Backup
                                        </button>
                                        <button className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                                            <FiUpload className="w-4 h-4" />
                                            Restore Backup
                                        </button>
                                    </div>
                                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            <strong>Note:</strong> Backups are automatically created daily at 2:00 AM UTC.
                                            Manual backups can be downloaded here.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                    <h3 className="font-semibold text-gray-900 mb-4">Recent Backups</h3>
                                    <div className="space-y-3">
                                        {[
                                            { date: '2024-01-20 02:00', size: '2.4 GB', status: 'Success' },
                                            { date: '2024-01-19 02:00', size: '2.3 GB', status: 'Success' },
                                            { date: '2024-01-18 02:00', size: '2.3 GB', status: 'Success' }
                                        ].map((backup, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900">{backup.date}</p>
                                                    <p className="text-sm text-gray-600">{backup.size}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                                        {backup.status}
                                                    </span>
                                                    <button className="text-orange-600 hover:text-orange-700">
                                                        <FiDownload className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Save Banner */}
            <div className="sticky bottom-4 bg-white rounded-xl p-4 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <p className="text-sm text-gray-700">
                            You have unsaved changes
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                            Cancel
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                            <FiSave className="w-4 h-4" />
                            Save All Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}