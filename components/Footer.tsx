/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
    FiGithub, FiTwitter, FiInstagram, FiLinkedin,
    FiArrowRight, FiMapPin, FiMail, FiPhone, FiHeart
} from 'react-icons/fi';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

export function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubscribed(true);
        setEmail('');
    };

    return (
        <footer className="bg-white border-t border-gray-200 pt-12 pb-6">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Company Info */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 group mb-4">
                            <div className="h-10 w-10 bg-gradient-to-r from-[#FF5722] to-[#FF7A50] rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                                <Image
                                    // src={RoviLogo}
                                    src="/images/contents/rovi-logo.png"
                                    alt="Rovify Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-[#FF5722]">rovify</span>
                        </Link>
                        <p className="text-gray-600 mb-4">
                            The future of event ticketing. Discover and attend events using traditional or blockchain-based NFT tickets.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-colors"
                                aria-label="Twitter"
                            >
                                <FiTwitter className="h-4 w-4" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-colors"
                                aria-label="Instagram"
                            >
                                <FiInstagram className="h-4 w-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-colors"
                                aria-label="LinkedIn"
                            >
                                <FiLinkedin className="h-4 w-4" />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-colors"
                                aria-label="GitHub"
                            >
                                <FiGithub className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links - Platform */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Platform</h3>
                        <ul className="space-y-2">
                            {[
                                { name: 'Discover Events', href: '/discover' },
                                { name: 'Create Event', href: '/create' },
                                { name: 'NFT Tickets', href: '/nft-tickets' },
                                { name: 'Wallet', href: '/wallet' },
                                { name: 'Pricing', href: '/pricing' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-600 hover:text-[#FF5722] transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links - Support */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Support</h3>
                        <ul className="space-y-2">
                            {[
                                { name: 'Help Center', href: '/help' },
                                { name: 'Contact Us', href: '/contact' },
                                { name: 'Terms of Service', href: '/terms' },
                                { name: 'Privacy Policy', href: '/privacy' },
                                { name: 'Legal', href: '/legal' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-600 hover:text-[#FF5722] transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <h3 className="font-bold text-gray-900 mt-6 mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <FiMapPin className="h-5 w-5 text-[#FF5722] mt-0.5" />
                                <span className="text-gray-600">Kigali, Rwanda</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <FiMail className="h-5 w-5 text-[#FF5722] mt-0.5" />
                                <a href="mailto:hello@rovify.io" className="text-gray-600 hover:text-[#FF5722] transition-colors">
                                    hello@rovify.io
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Stay Updated</h3>
                        <p className="text-gray-600 mb-4">
                            Subscribe to our newsletter for the latest events and updates.
                        </p>

                        {subscribed ? (
                            <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-green-800">
                                <p className="text-sm flex items-center gap-2">
                                    <FiHeart className="h-4 w-4" />
                                    <span>Thanks for subscribing!</span>
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="mb-4">
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#FF5722] focus:border-[#FF5722]"
                                        aria-label="Email for newsletter"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[#FF5722] text-white px-4 py-2 rounded-r-lg hover:bg-[#E64A19] transition-colors"
                                        aria-label="Subscribe"
                                    >
                                        <FiArrowRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="bg-[#FF5722]/5 rounded-lg p-4 border border-[#FF5722]/10">
                            <h4 className="font-medium text-gray-900 mb-2">Download Our App</h4>
                            <div className="flex gap-2">
                                <Link
                                    href="#"
                                    className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-xs font-medium"
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.6,12c0-0.3,0-0.5-0.1-0.8l1.5-1.2c0.1-0.1,0.2-0.3,0.1-0.5l-1.4-2.5c-0.1-0.2-0.3-0.2-0.5-0.2l-1.8,0.7 c-0.4-0.3-0.8-0.5-1.3-0.7L13.8,5c0-0.2-0.2-0.3-0.4-0.3h-2.9c-0.2,0-0.4,0.1-0.4,0.3l-0.3,1.9c-0.5,0.2-0.9,0.4-1.3,0.7 L6.8,6.9c-0.2-0.1-0.4,0-0.5,0.2L4.9,9.5c-0.1,0.2-0.1,0.4,0.1,0.5l1.5,1.2c-0.1,0.3-0.1,0.5-0.1,0.8s0,0.5,0.1,0.8l-1.5,1.2 c-0.1,0.1-0.2,0.3-0.1,0.5l1.4,2.5c0.1,0.2,0.3,0.2,0.5,0.2l1.8-0.7c0.4,0.3,0.8,0.5,1.3,0.7l0.3,1.9c0,0.2,0.2,0.3,0.4,0.3h2.9 c0.2,0,0.4-0.1,0.4-0.3l0.3-1.9c0.5-0.2,0.9-0.4,1.3-0.7l1.8,0.7c0.2,0.1,0.4,0,0.5-0.2l1.4-2.5c0.1-0.2,0.1-0.4-0.1-0.5 l-1.5-1.2C17.5,12.5,17.6,12.3,17.6,12z M12,15c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S13.7,15,12,15z" />
                                    </svg>
                                    iOS
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-xs font-medium"
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.9,5.6c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.4-1-2.4-1 c-1.8,0-3.3,1.5-3.3,3.3c0,0.3,0,0.5,0.1,0.7C7.5,8,5.5,6.7,4.1,4.8c-0.3,0.5-0.4,1-0.4,1.6c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4v0c0,1.6,1.1,2.9,2.6,3.2c-0.3,0.1-0.6,0.1-0.9,0.1c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4 C16.9,6.9,17.4,6.3,17.9,5.6z" />
                                    </svg>
                                    Android
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500 mb-4 md:mb-0">
                            © {new Date().getFullYear()} Rovify. All rights reserved.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                            <Link href="/terms" className="hover:text-[#FF5722] transition-colors whitespace-nowrap">Terms of Service</Link>
                            <Link href="/privacy" className="hover:text-[#FF5722] transition-colors whitespace-nowrap">Privacy Policy</Link>
                            <Link href="/cookies" className="hover:text-[#FF5722] transition-colors whitespace-nowrap">Cookie Policy</Link>
                            <Link href="/accessibility" className="hover:text-[#FF5722] transition-colors whitespace-nowrap">Accessibility</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}