/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { motion } from 'framer-motion';
import { FiBarChart, FiTrendingUp, FiPieChart } from 'react-icons/fi';

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
                <p className="text-emerald-100 mb-4">Insights into your event patterns and preferences</p>
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold">28</div>
                        <div className="text-emerald-100 text-sm">Events This Year</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">$2,840</div>
                        <div className="text-emerald-100 text-sm">Total Spent</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-emerald-100 text-sm">New Friends</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                    <FiBarChart className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Spending Analytics</h3>
                    <p className="text-gray-600 text-sm">Track your event spending patterns</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                    <FiTrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Attendance Trends</h3>
                    <p className="text-gray-600 text-sm">See your event attendance over time</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                    <FiPieChart className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Category Breakdown</h3>
                    <p className="text-gray-600 text-sm">Your favorite event categories</p>
                </div>
            </div>
        </div>
    );
}