/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiBell, FiShield, FiSettings, FiUser, FiSave, FiCheck, FiMoon, FiSun, FiGlobe,
    FiMusic, FiMapPin, FiWifi, FiDollarSign, FiTrendingUp, FiZap, FiHeart,
    FiStar, FiCalendar, FiCamera, FiHeadphones, FiVolumeX, FiActivity
} from 'react-icons/fi';

interface NotificationPreferences {
    email: boolean;
    push: boolean;
    sms: boolean;
    eventReminders: boolean;
    friendActivity: boolean;
    promotions: boolean;
    weeklyDigest: boolean;
    securityAlerts: boolean;
}

interface PrivacyPreferences {
    profileVisibility: string;
    allowMessages: string;
    showLocation: boolean;
    showEvents: boolean;
    dataSharing: boolean;
    analytics: boolean;
}

interface DisplayPreferences {
    theme: string;
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    compactMode: boolean;
}

interface AccountPreferences {
    twoFactorAuth: boolean;
    sessionTimeout: string;
    downloadData: boolean;
    deleteAccount: boolean;
}

interface BlockchainPreferences {
    walletConnected: boolean;
    preferredWallet: string;
    gasAlerts: boolean;
    nftDisplay: boolean;
    defiNotifications: boolean;
    cryptoPayments: boolean;
    tokenUpdates: boolean;
    stakingAlerts: boolean;
    basechainEnabled: boolean;
    smartContracts: boolean;
}

interface PartyPreferences {
    partyDiscovery: boolean;
    musicGenre: string;
    partySize: string;
    vibePreference: string;
    autoCheckin: boolean;
    partyNotifications: boolean;
    friendInvites: boolean;
    eventRecommendations: boolean;
    liveStreaming: boolean;
    partyMode: boolean;
}

interface UserPreferences {
    notifications: NotificationPreferences;
    privacy: PrivacyPreferences;
    display: DisplayPreferences;
    account: AccountPreferences;
    blockchain: BlockchainPreferences;
    party: PartyPreferences;
}

export default function PreferencesPage() {
    const [userPreferences, setUserPreferences] = useState<UserPreferences>({
        notifications: {
            email: true,
            push: true,
            sms: false,
            eventReminders: true,
            friendActivity: true,
            promotions: false,
            weeklyDigest: true,
            securityAlerts: true
        },
        privacy: {
            profileVisibility: 'friends',
            allowMessages: 'friends',
            showLocation: false,
            showEvents: true,
            dataSharing: false,
            analytics: true
        },
        display: {
            theme: 'auto',
            language: 'en',
            timezone: 'PST',
            dateFormat: 'MM/DD/YYYY',
            currency: 'USD',
            compactMode: false
        },
        account: {
            twoFactorAuth: false,
            sessionTimeout: '30',
            downloadData: false,
            deleteAccount: false
        },
        blockchain: {
            walletConnected: false,
            preferredWallet: 'metamask',
            gasAlerts: true,
            nftDisplay: true,
            defiNotifications: false,
            cryptoPayments: true,
            tokenUpdates: true,
            stakingAlerts: false,
            basechainEnabled: true,
            smartContracts: false
        },
        party: {
            partyDiscovery: true,
            musicGenre: 'electronic',
            partySize: 'medium',
            vibePreference: 'energetic',
            autoCheckin: false,
            partyNotifications: true,
            friendInvites: true,
            eventRecommendations: true,
            liveStreaming: false,
            partyMode: true
        }
    });

    const [savedState, setSavedState] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<string>('party');

    const handlePreferenceChange = (
        section: keyof UserPreferences,
        key: string,
        value: string | boolean
    ) => {
        setUserPreferences(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
        setSavedState(false);
    };

    const handleSavePreferences = () => {
        setSavedState(true);
        setTimeout(() => setSavedState(false), 3000);
    };

    interface ToggleSwitchProps {
        value: boolean;
        onChange: () => void;
        size?: 'sm' | 'md' | 'lg';
    }

    const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onChange, size = "md" }) => {
        const sizeClasses = {
            sm: { container: 'w-10 h-5', toggle: 'w-3 h-3', translateOn: 'translate-x-5', translateOff: 'translate-x-0.5' },
            md: { container: 'w-12 h-6', toggle: 'w-4 h-4', translateOn: 'translate-x-6', translateOff: 'translate-x-1' },
            lg: { container: 'w-14 h-7', toggle: 'w-5 h-5', translateOn: 'translate-x-7', translateOff: 'translate-x-1' }
        };

        const { container, toggle, translateOn, translateOff } = sizeClasses[size];

        return (
            <motion.button
                onClick={onChange}
                className={`relative ${container} rounded-full transition-all duration-300 flex items-center ${value
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/25'
                    : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    className={`${toggle} bg-white rounded-full shadow-md transition-transform duration-300`}
                    animate={{
                        x: value ?
                            (size === 'sm' ? 20 : size === 'md' ? 24 : 28) :
                            (size === 'sm' ? 2 : 4)
                    }}
                />
            </motion.button>
        );
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

    const PreferenceCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
        <motion.div
            className={`bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );

    const renderParty = () => (
        <div className="space-y-6">
            <PreferenceCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <FiMusic className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Party & Social Preferences</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Music Genre</label>
                        <select
                            value={userPreferences.party.musicGenre}
                            onChange={(e) => handlePreferenceChange('party', 'musicGenre', e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        >
                            <option value="electronic">Electronic/EDM</option>
                            <option value="hiphop">Hip Hop</option>
                            <option value="house">House</option>
                            <option value="techno">Techno</option>
                            <option value="reggaeton">Reggaeton</option>
                            <option value="pop">Pop</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Party Size Preference</label>
                        <select
                            value={userPreferences.party.partySize}
                            onChange={(e) => handlePreferenceChange('party', 'partySize', e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        >
                            <option value="intimate">Intimate (10-30)</option>
                            <option value="medium">Medium (30-100)</option>
                            <option value="large">Large (100-500)</option>
                            <option value="massive">Massive (500+)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Vibe Preference</label>
                        <select
                            value={userPreferences.party.vibePreference}
                            onChange={(e) => handlePreferenceChange('party', 'vibePreference', e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        >
                            <option value="chill">Chill & Relaxed</option>
                            <option value="energetic">High Energy</option>
                            <option value="underground">Underground</option>
                            <option value="mainstream">Mainstream</option>
                            <option value="exclusive">Exclusive/VIP</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    {Object.entries({
                        partyDiscovery: 'Smart Party Discovery',
                        autoCheckin: 'Auto Check-in to Events',
                        partyNotifications: 'Party Starting Soon Alerts',
                        friendInvites: 'Friend Party Invitations',
                        eventRecommendations: 'AI Event Recommendations',
                        liveStreaming: 'Live Stream Party Moments',
                        partyMode: 'Party Mode (Enhanced Features)'
                    }).map(([key, label]) => (
                        <motion.div
                            key={key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{label}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {key === 'partyDiscovery' && 'Find parties based on your music taste and location'}
                                    {key === 'autoCheckin' && 'Automatically check into events you attend'}
                                    {key === 'partyNotifications' && 'Get notified when parties are starting'}
                                    {key === 'friendInvites' && 'Receive invitations from friends'}
                                    {key === 'eventRecommendations' && 'AI-powered event suggestions'}
                                    {key === 'liveStreaming' && 'Share live moments from parties'}
                                    {key === 'partyMode' && 'Enable enhanced party features and UI'}
                                </p>
                            </div>
                            <div className="ml-4">
                                <ToggleSwitch
                                    value={userPreferences.party[key as keyof PartyPreferences] as boolean}
                                    onChange={() => handlePreferenceChange('party', key, !userPreferences.party[key as keyof PartyPreferences])}
                                    size="lg"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </PreferenceCard>
        </div>
    );

    const renderBlockchain = () => (
        <div className="space-y-6">
            <PreferenceCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <FiZap className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Blockchain & Crypto Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Preferred Wallet</label>
                        <select
                            value={userPreferences.blockchain.preferredWallet}
                            onChange={(e) => handlePreferenceChange('blockchain', 'preferredWallet', e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        >
                            <option value="metamask">MetaMask</option>
                            <option value="coinbase">Coinbase Wallet</option>
                            <option value="trust">Trust Wallet</option>
                            <option value="phantom">Phantom</option>
                            <option value="rainbow">Rainbow</option>
                        </select>
                    </div>

                    <motion.div
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                        whileHover={{ scale: 1.01 }}
                    >
                        <div>
                            <h4 className="font-medium text-gray-900">Base Chain Enabled</h4>
                            <p className="text-sm text-gray-600">Use Coinbase&apos;s Base network</p>
                        </div>
                        <ToggleSwitch
                            value={userPreferences.blockchain.basechainEnabled}
                            onChange={() => handlePreferenceChange('blockchain', 'basechainEnabled', !userPreferences.blockchain.basechainEnabled)}
                            size="lg"
                        />
                    </motion.div>
                </div>

                <div className="space-y-4">
                    {Object.entries({
                        walletConnected: 'Wallet Connected',
                        gasAlerts: 'Gas Fee Alerts',
                        nftDisplay: 'Show NFTs in Profile',
                        defiNotifications: 'DeFi Protocol Updates',
                        cryptoPayments: 'Enable Crypto Payments',
                        tokenUpdates: 'Token Price Alerts',
                        stakingAlerts: 'Staking Rewards Notifications',
                        smartContracts: 'Smart Contract Interactions'
                    }).map(([key, label]) => (
                        <motion.div
                            key={key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{label}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {key === 'walletConnected' && 'Connect your crypto wallet to the app'}
                                    {key === 'gasAlerts' && 'Get notified about optimal gas fees'}
                                    {key === 'nftDisplay' && 'Display your NFT collection on your profile'}
                                    {key === 'defiNotifications' && 'Updates from DeFi protocols you use'}
                                    {key === 'cryptoPayments' && 'Pay for events and services with crypto'}
                                    {key === 'tokenUpdates' && 'Price alerts for your favorite tokens'}
                                    {key === 'stakingAlerts' && 'Notifications about staking rewards'}
                                    {key === 'smartContracts' && 'Enable smart contract interactions'}
                                </p>
                            </div>
                            <div className="ml-4">
                                <ToggleSwitch
                                    value={userPreferences.blockchain[key as keyof BlockchainPreferences] as boolean}
                                    onChange={() => handlePreferenceChange('blockchain', key, !userPreferences.blockchain[key as keyof BlockchainPreferences])}
                                    size="lg"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </PreferenceCard>
        </div>
    );

    const renderNotifications = () => (
        <div className="space-y-6">
            <PreferenceCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <FiBell className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                </div>
                <div className="space-y-4">
                    {Object.entries(userPreferences.notifications).map(([key, value]) => (
                        <motion.div
                            key={key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {key === 'email' && 'Receive notifications via email'}
                                    {key === 'push' && 'Browser push notifications'}
                                    {key === 'sms' && 'Text message notifications'}
                                    {key === 'eventReminders' && 'Reminders about upcoming events'}
                                    {key === 'friendActivity' && 'Updates about friend activities'}
                                    {key === 'promotions' && 'Special offers and promotions'}
                                    {key === 'weeklyDigest' && 'Weekly summary of your activity'}
                                    {key === 'securityAlerts' && 'Important security notifications'}
                                </p>
                            </div>
                            <div className="ml-4">
                                <ToggleSwitch
                                    value={value}
                                    onChange={() => handlePreferenceChange('notifications', key, !value)}
                                    size="lg"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </PreferenceCard>
        </div>
    );

    const renderPrivacy = () => (
        <div className="space-y-6">
            <PreferenceCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <FiShield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
                            <select
                                value={userPreferences.privacy.profileVisibility}
                                onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            >
                                <option value="public">Public</option>
                                <option value="friends">Friends Only</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Who can message you</label>
                            <select
                                value={userPreferences.privacy.allowMessages}
                                onChange={(e) => handlePreferenceChange('privacy', 'allowMessages', e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            >
                                <option value="everyone">Everyone</option>
                                <option value="friends">Friends Only</option>
                                <option value="none">No One</option>
                            </select>
                        </div>
                    </div>

                    {['showLocation', 'showEvents', 'dataSharing', 'analytics'].map((key) => (
                        <motion.div
                            key={key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {key === 'showLocation' && 'Display your location on your profile'}
                                    {key === 'showEvents' && 'Show your event attendance publicly'}
                                    {key === 'dataSharing' && 'Share anonymized data for product improvement'}
                                    {key === 'analytics' && 'Allow usage analytics for better experience'}
                                </p>
                            </div>
                            <div className="ml-4">
                                <ToggleSwitch
                                    value={userPreferences.privacy[key as keyof PrivacyPreferences] as boolean}
                                    onChange={() => handlePreferenceChange('privacy', key, !userPreferences.privacy[key as keyof PrivacyPreferences])}
                                    size="lg"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </PreferenceCard>
        </div>
    );

    const renderDisplay = () => (
        <div className="space-y-6">
            <PreferenceCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <FiSettings className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Display & Language</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Theme</label>
                        <select
                            value={userPreferences.display.theme}
                            onChange={(e) => handlePreferenceChange('display', 'theme', e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto</option>
                            <option value="neon">Neon Party</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Language</label>
                        <select
                            value={userPreferences.display.language}
                            onChange={(e) => handlePreferenceChange('display', 'language', e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="ja">日本語</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Currency</label>
                        <select
                            value={userPreferences.display.currency}
                            onChange={(e) => handlePreferenceChange('display', 'currency', e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="ETH">ETH (Ξ)</option>
                            <option value="ROVI">ROVI ($ROVI)</option>
                        </select>
                    </div>
                </div>

                <motion.div
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.01 }}
                >
                    <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Compact Mode</h4>
                        <p className="text-sm text-gray-600 mt-1">Use a more condensed interface layout</p>
                    </div>
                    <div className="ml-4">
                        <ToggleSwitch
                            value={userPreferences.display.compactMode}
                            onChange={() => handlePreferenceChange('display', 'compactMode', !userPreferences.display.compactMode)}
                            size="lg"
                        />
                    </div>
                </motion.div>
            </PreferenceCard>
        </div>
    );

    const renderAccount = () => (
        <div className="space-y-6">
            <PreferenceCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Session Timeout</label>
                        <select
                            value={userPreferences.account.sessionTimeout}
                            onChange={(e) => handlePreferenceChange('account', 'sessionTimeout', e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="never">Never</option>
                        </select>
                    </div>

                    <motion.div
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.01 }}
                    >
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                        </div>
                        <div className="ml-4">
                            <ToggleSwitch
                                value={userPreferences.account.twoFactorAuth}
                                onChange={() => handlePreferenceChange('account', 'twoFactorAuth', !userPreferences.account.twoFactorAuth)}
                                size="lg"
                            />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.button
                            className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 hover:bg-blue-100 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="font-medium">Download Your Data</div>
                            <div className="text-sm text-blue-600">Get a copy of your account data</div>
                        </motion.button>
                        <motion.button
                            className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 hover:bg-red-100 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="font-medium">Delete Account</div>
                            <div className="text-sm text-red-600">Permanently delete your account</div>
                        </motion.button>
                    </div>
                </div>
            </PreferenceCard>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'party': return renderParty();
            case 'blockchain': return renderBlockchain();
            case 'notifications': return renderNotifications();
            case 'privacy': return renderPrivacy();
            case 'display': return renderDisplay();
            case 'account': return renderAccount();
            default: return renderParty();
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
                        id="party"
                        icon={FiMusic}
                        title="Party & Social"
                        isActive={activeSection === 'party'}
                        onClick={setActiveSection}
                    />
                    <SectionTab
                        id="blockchain"
                        icon={FiZap}
                        title="Blockchain"
                        isActive={activeSection === 'blockchain'}
                        onClick={setActiveSection}
                    />
                    <SectionTab
                        id="notifications"
                        icon={FiBell}
                        title="Notifications"
                        isActive={activeSection === 'notifications'}
                        onClick={setActiveSection}
                    />
                    <SectionTab
                        id="privacy"
                        icon={FiShield}
                        title="Privacy"
                        isActive={activeSection === 'privacy'}
                        onClick={setActiveSection}
                    />
                    <SectionTab
                        id="display"
                        icon={FiSettings}
                        title="Display"
                        isActive={activeSection === 'display'}
                        onClick={setActiveSection}
                    />
                    <SectionTab
                        id="account"
                        icon={FiUser}
                        title="Account"
                        isActive={activeSection === 'account'}
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

            {/* Save Button */}
            <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <motion.button
                    onClick={handleSavePreferences}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 shadow-lg ${savedState
                        ? 'bg-emerald-500 hover:bg-emerald-600'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                        }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {savedState ? (
                        <>
                            <FiCheck className="w-5 h-5" />
                            Preferences Saved!
                        </>
                    ) : (
                        <>
                            <FiSave className="w-5 h-5" />
                            Save Preferences
                        </>
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
}