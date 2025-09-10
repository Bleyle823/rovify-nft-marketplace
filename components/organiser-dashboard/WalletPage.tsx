'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiCopy, FiPlus, FiSend, FiRefreshCcw, FiArrowDown, FiTrendingUp
} from 'react-icons/fi';
import { FaEthereum, FaBitcoin } from "react-icons/fa";
import { IoTicket, IoWallet } from "react-icons/io5";

// Mock wallet data
const mockWalletData = {
    address: '0x742d35Cc6565C42cAA5b8e8a8b02b9eF3D5d2D8B',
    balance: {
        eth: 2.4567,
        usd: 4250.30,
        btc: 0.0123
    },
    portfolio: [
        { symbol: 'ETH', name: 'Ethereum', amount: 2.4567, value: 4250.30, change: 5.2, logo: '/crypto/eth.png' },
        { symbol: 'BTC', name: 'Bitcoin', amount: 0.0123, value: 650.20, change: -2.1, logo: '/crypto/btc.png' },
        { symbol: 'USDC', name: 'USD Coin', amount: 500, value: 500.00, change: 0.0, logo: '/crypto/usdc.png' }
    ],
    transactions: [
        {
            id: '1',
            type: 'event_purchase',
            amount: '-0.15 ETH',
            usdValue: '-$260.50',
            event: 'Tech Summit 2024',
            date: '2024-11-15',
            status: 'completed',
            hash: '0xabc123...',
            gasUsed: '21000'
        },
        {
            id: '2',
            type: 'deposit',
            amount: '+1.0 ETH',
            usdValue: '+$1,735.50',
            event: 'Wallet Top-up',
            date: '2024-11-10',
            status: 'completed',
            hash: '0xdef456...',
            gasUsed: '21000'
        },
        {
            id: '3',
            type: 'friend_transfer',
            amount: '-0.05 ETH',
            usdValue: '-$86.75',
            event: 'Sent to @sarahc',
            date: '2024-11-08',
            status: 'completed',
            hash: '0x789xyz...',
            gasUsed: '21000'
        }
    ],
    recentActivity: [
        { action: 'Received NFT ticket', event: 'Tech Summit 2024', time: '2 hours ago', type: 'nft' },
        { action: 'Staked 1.5 ETH', event: 'Ethereum 2.0', time: '1 day ago', type: 'defi' },
        { action: 'Swapped 0.1 BTC → ETH', event: 'DEX Trade', time: '3 days ago', type: 'swap' }
    ]
};

export default function WalletPage() {
    const [walletTab, setWalletTab] = useState<'overview' | 'transactions' | 'portfolio'>('overview');

    return (
        <div className="space-y-8">
            {/* Wallet Header */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Wallet Overview</h1>
                        <p className="text-indigo-100 mb-4">Manage your crypto assets and transactions</p>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Connected to Ethereum Mainnet</span>
                        </div>
                    </div>
                    <div className="mt-6 lg:mt-0">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                            <div className="text-3xl font-bold mb-1">${mockWalletData.balance.usd.toLocaleString()}</div>
                            <div className="text-indigo-100 text-sm">Total Portfolio Value</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Navigation */}
            <div className="bg-white rounded-xl p-2 border border-gray-100 flex overflow-x-auto">
                {(['overview', 'transactions', 'portfolio'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setWalletTab(tab)}
                        className={`px-6 py-3 rounded-lg font-medium transition-all flex-1 min-w-0 ${walletTab === tab
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Wallet Content */}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={walletTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        {walletTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Portfolio Summary */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Asset Breakdown</h3>
                                        <div className="space-y-4">
                                            {mockWalletData.portfolio.map((asset, index) => (
                                                <motion.div
                                                    key={asset.symbol}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                                                            {asset.symbol === 'ETH' && <FaEthereum className="w-6 h-6 text-white" />}
                                                            {asset.symbol === 'BTC' && <FaBitcoin className="w-6 h-6 text-white" />}
                                                            {asset.symbol === 'USDC' && <span className="text-white font-bold">$</span>}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{asset.symbol}</h4>
                                                            <p className="text-sm text-gray-600">{asset.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">${asset.value.toLocaleString()}</p>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-sm text-gray-600">{asset.amount}</span>
                                                            <span className={`text-sm font-medium ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {asset.change >= 0 ? '+' : ''}{asset.change}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                                        <div className="space-y-4">
                                            {mockWalletData.recentActivity.map((activity, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'nft' ? 'bg-purple-100' :
                                                        activity.type === 'defi' ? 'bg-blue-100' : 'bg-green-100'
                                                        }`}>
                                                        {activity.type === 'nft' && <IoTicket className="w-5 h-5 text-purple-600" />}
                                                        {activity.type === 'defi' && <IoWallet className="w-5 h-5 text-blue-600" />}
                                                        {activity.type === 'swap' && <FiRefreshCcw className="w-5 h-5 text-green-600" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{activity.action}</p>
                                                        <p className="text-sm text-gray-600">{activity.event}</p>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{activity.time}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-6">Quick Actions</h3>
                                        <div className="space-y-4">
                                            <motion.button
                                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-all"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiPlus className="w-5 h-5 mr-2 inline" />
                                                Add Funds
                                            </motion.button>
                                            <motion.button
                                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-all"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiSend className="w-5 h-5 mr-2 inline" />
                                                Send Crypto
                                            </motion.button>
                                            <motion.button
                                                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-all"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiRefreshCcw className="w-5 h-5 mr-2 inline" />
                                                Swap Tokens
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Wallet Info */}
                                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-4">Wallet Info</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Address</span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(mockWalletData.address)}
                                                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                                                >
                                                    <span className="font-mono">
                                                        {mockWalletData.address.slice(0, 6)}...{mockWalletData.address.slice(-4)}
                                                    </span>
                                                    <FiCopy className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Network</span>
                                                <span className="font-medium">Ethereum</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Status</span>
                                                <span className="text-green-600 font-medium">Connected</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {walletTab === 'transactions' && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Transaction History</h3>
                                <div className="space-y-4">
                                    {mockWalletData.transactions.map((tx, index) => (
                                        <motion.div
                                            key={tx.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'event_purchase' ? 'bg-orange-100' :
                                                    tx.type === 'deposit' ? 'bg-green-100' : 'bg-blue-100'
                                                    }`}>
                                                    {tx.type === 'event_purchase' && <IoTicket className="w-6 h-6 text-orange-600" />}
                                                    {tx.type === 'deposit' && <FiArrowDown className="w-6 h-6 text-green-600" />}
                                                    {tx.type === 'friend_transfer' && <FiSend className="w-6 h-6 text-blue-600" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{tx.event}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <span>{new Date(tx.date).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <button className="text-orange-600 hover:underline">
                                                            {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-semibold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'}`}>
                                                    {tx.amount}
                                                </p>
                                                <p className="text-sm text-gray-600">{tx.usdValue}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {walletTab === 'portfolio' && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Portfolio Performance</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-green-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-600">24h Change</span>
                                            <FiTrendingUp className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="text-2xl font-bold text-green-600">+$127.50</div>
                                        <div className="text-sm text-green-600">+3.1%</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-600">7d Change</span>
                                            <FiTrendingUp className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="text-2xl font-bold text-blue-600">+$445.20</div>
                                        <div className="text-sm text-blue-600">+11.7%</div>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-600">30d Change</span>
                                            <FiTrendingUp className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div className="text-2xl font-bold text-purple-600">+$892.75</div>
                                        <div className="text-sm text-purple-600">+26.6%</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}