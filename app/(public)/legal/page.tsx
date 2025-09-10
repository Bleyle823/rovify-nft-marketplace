/* eslint-disable @typescript-eslint/no-unused-vars */
// app/legal/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiFileText, FiShield, FiGlobe } from 'react-icons/fi';
import { FaTrademark } from "react-icons/fa";
import PublicHeader from '@/components/PublicHeader';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PublicHeader />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Link href="/" className="hover:text-[#FF5722] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="font-medium text-gray-700">Legal</span>
                    </div>

                    {/* Page Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Legal Information</h1>
                        <p className="text-gray-600">Essential legal details about Rovify and our services</p>
                    </div>

                    {/* Legal Pages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <Link href="/terms" className="group">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#FF5722]/10 p-3 rounded-xl">
                                        <FiFileText className="h-6 w-6 text-[#FF5722]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#FF5722] transition-colors">Terms of Service</h2>
                                        <p className="text-gray-600 text-sm">
                                            The terms that govern your use of Rovify&apos;s platform and services.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/privacy" className="group">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#FF5722]/10 p-3 rounded-xl">
                                        <FiShield className="h-6 w-6 text-[#FF5722]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#FF5722] transition-colors">Privacy Policy</h2>
                                        <p className="text-gray-600 text-sm">
                                            How we collect, use, and protect your personal information.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Copyright Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiFileText className="text-[#FF5722]" />
                            Copyright Information
                        </h2>
                        <div className="prose max-w-none text-gray-600">
                            <p>
                                © {new Date().getFullYear()} Rovify, Inc. All rights reserved.
                            </p>
                            <p>
                                All content on this website, including but not limited to text, graphics, logos, icons, images, audio clips, and software, is the property of Rovify, Inc. and is protected by international copyright laws.
                            </p>
                            <p>
                                The unauthorized reproduction, distribution, modification, or use of any materials on this website is strictly prohibited.
                            </p>
                        </div>
                    </div>

                    {/* Trademark Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FaTrademark className="text-[#FF5722]" />
                            Trademarks
                        </h2>
                        <div className="prose max-w-none text-gray-600">
                            <p>
                                Rovify™, the Rovify logo, and other Rovify marks displayed on this website are trademarks or registered trademarks of Rovify, Inc.
                            </p>
                            <p>
                                All other trademarks, service marks, and logos used on this website are the property of their respective owners.
                            </p>
                            <p>
                                Nothing on this website should be construed as granting any license or right to use any trademark without the prior written permission of Rovify, Inc. or the respective trademark owner.
                            </p>
                        </div>
                    </div>

                    {/* License Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiGlobe className="text-[#FF5722]" />
                            License to Use Website
                        </h2>
                        <div className="prose max-w-none text-gray-600">
                            <p>
                                Subject to the terms and conditions set forth in our Terms of Service, Rovify grants you a limited, non-exclusive, non-transferable license to access and use the Rovify website and services for personal, non-commercial purposes.
                            </p>
                            <p>
                                This license does not include:
                            </p>
                            <ul>
                                <li>Republication or redistribution of any content from the Rovify platform</li>
                                <li>Use of data mining, robots, or similar data gathering tools</li>
                                <li>Any resale or commercial use of the website or its contents</li>
                                <li>Downloading or copying account information for the benefit of another merchant</li>
                                <li>Any use of the website that could damage, disable, or impair the service</li>
                            </ul>
                            <p>
                                Rovify reserves the right to terminate this license at any time if you violate these restrictions.
                            </p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Legal Contact</h2>
                        <p className="text-gray-600 mb-4">
                            For any legal inquiries or notices, please contact our legal department:
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-gray-700">
                                <span className="font-medium">Email:</span>
                                <a href="mailto:legal@rovify.io" className="text-[#FF5722] hover:underline">legal@rovify.io</a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <span className="font-medium">Address:</span>
                                <span>Kigali, Rwanda</span>
                            </div>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center mb-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-[#FF5722] hover:text-[#E64A19] transition-colors"
                        >
                            <FiArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-100">
                {/* Main Footer */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand Column */}
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#FF9800] flex items-center justify-center">
                                    <Image
                                        // src={RoviLogo}
                                        src="/images/contents/rovi-logo.png"
                                        alt="Rovify Logo"
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                </div>
                                <h2 className="ml-2 text-xl font-bold text-gray-900">Rovify</h2>
                            </div>
                            <p className="text-gray-600 text-sm">
                                The premium Web2.5 social-first NFT event discovery platform connecting creators and enthusiasts through unique experiences.
                            </p>
                            <div className="flex items-center space-x-4">
                                <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                        <rect x="2" y="9" width="4" height="12"></rect>
                                        <circle cx="4" cy="4" r="2"></circle>
                                    </svg>
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-all">
                                    <svg
                                        className="rotate-45"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Explore</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">All Events</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">NFT Collections</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Create Event</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Sell Tickets</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Event Calendar</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Featured Creators</a></li>
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Company</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Press Kit</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Partners</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        {/* Support Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Support</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">FAQs</a></li>
                                <li><a href="/terms" className="text-[#FF5722] font-medium">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Cookie Policy</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Trust & Safety</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="max-w-md">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Join our community</h3>
                                <p className="text-gray-600 text-sm">Get exclusive updates on new features, events, and NFT drops.</p>
                            </div>
                            <div className="w-full md:w-auto">
                                <div className="flex rounded-full overflow-hidden shadow-sm border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#FF5722]/30">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] w-full md:w-64"
                                    />
                                    <button className="bg-[#FF5722] hover:bg-[#E64A19] text-white px-4 py-2.5 rounded-r-lg transition-colors">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="bg-gray-50 border-t border-gray-100">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="text-sm text-gray-500 mb-4 md:mb-0">
                                © 2025 Rovify. All rights reserved.
                            </div>
                            <div className="flex items-center space-x-6">
                                <a href="#" className="text-sm text-gray-500 hover:text-[#FF5722] transition-colors flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016a11.955 11.955 0 01-8.618 3.88 11.955 11.955 0 01-8.618-3.88A19.936 19.936 0 0112 2.5c2.3 0 4.4.48 6.254 1.332" />
                                    </svg>
                                    Security
                                </a>
                                <a href="#" className="text-sm text-gray-500 hover:text-[#FF5722] transition-colors flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Status
                                </a>
                                <div className="flex items-center text-sm text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                    </svg>
                                    Kigali, Rwanda
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}