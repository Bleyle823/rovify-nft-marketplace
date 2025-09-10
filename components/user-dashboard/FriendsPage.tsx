/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { motion } from 'framer-motion';
import { FiUsers, FiUserPlus, FiMessageSquare } from 'react-icons/fi';

export default function FriendsPage() {
    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Your Social Network</h1>
                <p className="text-blue-100 mb-4">Connect, share, and experience events together</p>
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-blue-100 text-sm">Friends</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">3</div>
                        <div className="text-blue-100 text-sm">Online</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">2</div>
                        <div className="text-blue-100 text-sm">Pending</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
                <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Friends Section</h3>
                <p className="text-gray-600 mb-6">Manage your friends, send messages, and see who&apos;s online.</p>
                <motion.button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiUserPlus className="w-4 h-4" />
                    Add Friends
                </motion.button>
            </div>
        </div>
    );
}