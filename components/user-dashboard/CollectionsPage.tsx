'use client';

import { motion } from 'framer-motion';
import { FiBookmark, FiHeart, FiStar, FiPlus } from 'react-icons/fi';

export default function CollectionsPage() {
    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Event Collections</h1>
                <p className="text-violet-100 mb-4">Organize and save events that catch your eye</p>
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold">25</div>
                        <div className="text-violet-100 text-sm">Saved Events</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">3</div>
                        <div className="text-violet-100 text-sm">Collections</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                    className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <FiHeart className="w-8 h-8" />
                        <span className="text-2xl font-bold">12</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Wishlist</h3>
                    <p className="text-white/80 text-sm">Events I want to attend</p>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <FiBookmark className="w-8 h-8" />
                        <span className="text-2xl font-bold">8</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Saved for Later</h3>
                    <p className="text-white/80 text-sm">Events to check out</p>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <FiStar className="w-8 h-8" />
                        <span className="text-2xl font-bold">5</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Favorites</h3>
                    <p className="text-white/80 text-sm">My top events</p>
                </motion.div>

                <motion.div
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-orange-500 hover:text-orange-500 cursor-pointer transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiPlus className="w-8 h-8 mb-4" />
                    <span className="font-semibold">Create Collection</span>
                </motion.div>
            </div>
        </div>
    );
}