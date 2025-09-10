/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    FiArrowLeft,
    FiShield,
    FiInfo,
    FiMapPin,
    FiTwitter,
    FiInstagram,
    FiLinkedin,
    FiSend,
    FiCheckCircle,
    FiAlertCircle,
    FiLoader,
    FiUser,
    FiGlobe,
    FiDatabase,
    FiCreditCard,
    FiTrash2
} from 'react-icons/fi';
import PublicHeader from '@/components/PublicHeader';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

export default function PrivacyPolicy() {
    const [activeTopic, setActiveTopic] = useState<string>('information');
    const [email, setEmail] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');


    const handleSubscribe = async (e: FormEvent) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setSubscriptionStatus('error');
            setErrorMessage('Please enter a valid email address');
            return;
        }

        setSubscriptionStatus('loading');

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setSubscriptionStatus('success');
            setEmail('');

            setTimeout(() => {
                setSubscriptionStatus('idle');
            }, 5000);
        } catch (error) {
            setSubscriptionStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe');

            setTimeout(() => {
                setSubscriptionStatus('idle');
                setErrorMessage('');
            }, 5000);
        }
    };

    const scrollToSection = (id: string) => {
        setActiveTopic(id);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100; // Header offset
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PublicHeader />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Link href="/" className="hover:text-[#FF5722] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="font-medium text-gray-700">Privacy Policy</span>
                    </div>

                    {/* Page Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
                        <p className="text-gray-600">Last updated: May 13, 2025</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <aside className="lg:w-64 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
                                <h2 className="font-semibold text-gray-800 mb-4">Contents</h2>
                                <nav className="space-y-1">
                                    <button
                                        onClick={() => scrollToSection('information')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'information'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiDatabase className="h-4 w-4 flex-shrink-0" />
                                        <span>Information We Collect</span>
                                    </button>

                                    <button
                                        onClick={() => scrollToSection('use')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'use'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiUser className="h-4 w-4 flex-shrink-0" />
                                        <span>How We Use Information</span>
                                    </button>

                                    <button
                                        onClick={() => scrollToSection('sharing')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'sharing'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiGlobe className="h-4 w-4 flex-shrink-0" />
                                        <span>Information Sharing</span>
                                    </button>

                                    <button
                                        onClick={() => scrollToSection('blockchain')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'blockchain'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiShield className="h-4 w-4 flex-shrink-0" />
                                        <span>Blockchain Data</span>
                                    </button>

                                    <button
                                        onClick={() => scrollToSection('payments')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'payments'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiCreditCard className="h-4 w-4 flex-shrink-0" />
                                        <span>Payment Information</span>
                                    </button>

                                    <button
                                        onClick={() => scrollToSection('deletion')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'deletion'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiTrash2 className="h-4 w-4 flex-shrink-0" />
                                        <span>Data Deletion</span>
                                    </button>

                                    <button
                                        onClick={() => scrollToSection('changes')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'changes'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
                                        <span>Changes to Policy</span>
                                    </button>
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                                <div className="prose max-w-none text-gray-600">
                                    <p>
                                        At Rovify, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                                    </p>
                                    <p>
                                        Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                                    </p>

                                    <div className="my-8 p-4 bg-[#FF5722]/5 rounded-lg border border-[#FF5722]/10">
                                        <h3 className="text-gray-900 flex items-center gap-2 mt-0">
                                            <FiShield className="h-5 w-5 text-[#FF5722]" />
                                            Important Privacy Notice
                                        </h3>
                                        <p className="mb-0">
                                            Rovify operates on both traditional databases and blockchain technology. Information recorded on a blockchain is immutable and cannot be deleted. Please carefully consider this when interacting with our NFT ticketing features.
                                        </p>
                                    </div>
                                </div>

                                {/* Information We Collect */}
                                <section id="information" className="mb-12 scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiDatabase className="text-[#FF5722]" />
                                        Information We Collect
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>We collect several types of information from and about users of our platform:</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="text-gray-800 font-medium mb-2">Personal Information</h3>
                                                <ul className="text-sm space-y-1">
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Full Name
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Email Address
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Phone Number (optional)
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Profile Image
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="text-gray-800 font-medium mb-2">Account Information</h3>
                                                <ul className="text-sm space-y-1">
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Username
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Password (encrypted)
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Wallet Address (for NFT features)
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <h3>Usage Information</h3>
                                        <p>
                                            We also collect information about how you interact with our service, including:
                                        </p>
                                        <ul>
                                            <li>Event browsing history</li>
                                            <li>Ticket purchases</li>
                                            <li>Events you&apos;ve created</li>
                                            <li>Device information (browser type, IP address, device type)</li>
                                            <li>Usage patterns and preferences</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* How We Use Information */}
                                <section id="use" className="mb-12 scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiUser className="text-[#FF5722]" />
                                        How We Use Information
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>We use the information we collect to:</p>
                                        <ul>
                                            <li>Provide, maintain, and improve our services</li>
                                            <li>Process transactions and send related information</li>
                                            <li>Send administrative notifications, such as updates or security alerts</li>
                                            <li>Personalize your experience and deliver content relevant to your interests</li>
                                            <li>Facilitate event creation, discovery, and ticket sales</li>
                                            <li>Process and deliver NFT tickets</li>
                                            <li>Respond to your comments, questions, and requests</li>
                                            <li>Prevent fraudulent transactions and enhance security</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Information Sharing */}
                                <section id="sharing" className="mb-12 scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiGlobe className="text-[#FF5722]" />
                                        Information Sharing
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>We may share your information in the following circumstances:</p>
                                        <ul>
                                            <li>With event organisers when you purchase tickets to their events</li>
                                            <li>With service providers who perform services on our behalf</li>
                                            <li>To comply with legal obligations</li>
                                            <li>To protect the rights, property, or safety of Rovify, our users, or others</li>
                                            <li>In connection with a business transaction such as a merger or acquisition</li>
                                        </ul>

                                        <p>
                                            We do not sell your personal information to third parties for marketing purposes.
                                        </p>
                                    </div>
                                </section>

                                {/* Blockchain Data */}
                                <section id="blockchain" className="mb-12 scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiShield className="text-[#FF5722]" />
                                        Blockchain Data
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>
                                            For NFT tickets, certain information is recorded on public blockchains, which are inherently public and transparent. This includes:
                                        </p>
                                        <ul>
                                            <li>Wallet addresses associated with ticket purchases</li>
                                            <li>Transaction data (timestamps, contract interactions)</li>
                                            <li>Ticket metadata (event information, ticket type, etc.)</li>
                                        </ul>

                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 my-4">
                                            <p className="font-medium text-yellow-800 mb-0">
                                                <FiAlertCircle className="inline-block mr-2" />
                                                Important: Data written to a blockchain cannot be modified or deleted. Please be aware that NFT ticket transactions will create a permanent record on the blockchain.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Payment Information */}
                                <section id="payments" className="mb-12 scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiCreditCard className="text-[#FF5722]" />
                                        Payment Information
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>
                                            Rovify uses industry-standard security measures to protect your payment information. We do not store complete payment card details on our servers.
                                        </p>
                                        <ul>
                                            <li>Credit card information is processed by our payment processors (e.g., Stripe, PayPal)</li>
                                            <li>Cryptocurrency transactions are processed through secure wallet connections</li>
                                            <li>We maintain appropriate administrative, technical, and physical safeguards to protect payment data</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Data Deletion */}
                                <section id="deletion" className="mb-12 scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiTrash2 className="text-[#FF5722]" />
                                        Data Deletion & Your Rights
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>
                                            You can request access to, correction of, or deletion of your personal information by contacting us at privacy@rovify.io.
                                        </p>
                                        <p>
                                            Important limitations:
                                        </p>
                                        <ul>
                                            <li>Information recorded on public blockchains cannot be deleted due to the nature of blockchain technology</li>
                                            <li>We may retain certain information as required by law or for legitimate business purposes</li>
                                            <li>We may also retain cached or archived copies of information for a certain period</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Changes to Policy */}
                                <section id="changes" className="scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiAlertCircle className="text-[#FF5722]" />
                                        Changes to Our Privacy Policy
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>
                                            We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the &quot;Last Updated&quot; date at the top of this policy.
                                        </p>
                                        <p>
                                            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                                        </p>
                                    </div>
                                </section>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h2>
                                <p className="text-gray-600 mb-4">
                                    If you have any questions about this Privacy Policy, please contact us:
                                </p>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className="font-medium">Email:</span>
                                        <a href="mailto:privacy@rovify.io" className="text-[#FF5722] hover:underline">privacy@rovify.io</a>
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
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-100 relative overflow-hidden">
                {/* Decorative elements for the footer */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5722] to-transparent opacity-30"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 opacity-5">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="currentColor" className="text-[#FF5722]" />
                    </svg>
                </div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 opacity-5 rotate-45">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="currentColor" className="text-[#FF5722]" />
                    </svg>
                </div>

                {/* Main Footer */}
                <div className="container mx-auto px-4 py-12 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        {/* Brand Column */}
                        <div className="space-y-6 relative">
                            {/* Add subtle decorative element */}
                            <div className="absolute -right-6 -top-10 w-24 h-24 opacity-5 rotate-12">
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="currentColor" className="text-[#FF5722]" />
                                </svg>
                            </div>

                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#FF9800] flex items-center justify-center relative overflow-hidden shadow-lg group">
                                    {/* Add subtle shine effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                                    <Image
                                        // src={RoviLogo}
                                        src="/images/contents/rovi-logo.png"
                                        alt="Rovify Logo"
                                        width={36}
                                        height={36}
                                        className="object-contain"
                                    />
                                </div>
                                <h2 className="ml-3 text-xl font-bold text-gray-900">Rovify</h2>
                            </div>

                            {/* Enhanced description with better typography */}
                            <p className="text-gray-600 text-sm leading-relaxed">
                                The premium Web2.5 social-first NFT event discovery platform connecting creators and enthusiasts through unique experiences.
                            </p>

                            {/* Enhanced social icons */}
                            <div className="flex items-center space-x-4">
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gradient-to-br hover:from-[#FF5722] hover:to-[#FF9800] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1">
                                    <FiTwitter size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gradient-to-br hover:from-[#FF5722] hover:to-[#FF9800] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1">
                                    <FiInstagram size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gradient-to-br hover:from-[#FF5722] hover:to-[#FF9800] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1">
                                    <FiLinkedin size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gradient-to-br hover:from-[#FF5722] hover:to-[#FF9800] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1">
                                    <FiSend size={18} className="rotate-45" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center">
                                <span className="w-6 h-0.5 bg-gradient-to-r from-[#FF5722] to-[#FF9800] rounded-full mr-2"></span>
                                Explore
                            </h3>
                            <ul className="space-y-3.5">
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        All Events
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        NFT Collections
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Create Event
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Sell Tickets
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Event Calendar
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Featured Creators
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center">
                                <span className="w-6 h-0.5 bg-gradient-to-r from-[#FF5722] to-[#FF9800] rounded-full mr-2"></span>
                                Company
                            </h3>
                            <ul className="space-y-3.5">
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Press Kit
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Partners
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Support Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center">
                                <span className="w-6 h-0.5 bg-gradient-to-r from-[#FF5722] to-[#FF9800] rounded-full mr-2"></span>
                                Support
                            </h3>
                            <ul className="space-y-3.5">
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        FAQs
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="/terms" className="text-[#FF5722] font-medium group flex items-center">
                                        <span className="w-2 h-0.5 bg-[#FF5722] rounded-full mr-2"></span>
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Cookie Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Trust & Safety
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter Subscription - Enhanced with Form Handling */}
                    <div className="mt-14 pt-10 border-t border-gray-100">
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 opacity-5">
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="currentColor" className="text-[#FF5722]" />
                                </svg>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                                <div className="max-w-md">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                        <span className="w-8 h-8 rounded-lg bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center mr-3">
                                            <FiSend size={16} />
                                        </span>
                                        Join our community
                                    </h3>
                                    <p className="text-gray-600">Get exclusive updates on new features, events, and NFT drops.</p>
                                </div>
                                <div className="w-full md:w-auto">
                                    <form onSubmit={handleSubscribe} className="w-full">
                                        <div className="relative">
                                            <div className={`group flex rounded-xl overflow-hidden shadow-md border border-gray-200 ${subscriptionStatus === 'error' ? 'border-red-300 ring-2 ring-red-100' :
                                                subscriptionStatus === 'success' ? 'border-green-300 ring-2 ring-green-100' :
                                                    'focus-within:ring-2 focus-within:ring-[#FF5722]/30'
                                                } transition-all duration-300 hover:shadow-lg bg-white`}>
                                                <input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className={`px-4 py-3 bg-white border-none focus:outline-none focus:ring-0 w-full md:w-64 ${subscriptionStatus === 'error' ? 'text-red-600 placeholder-red-300' :
                                                        subscriptionStatus === 'success' ? 'text-green-600' : ''
                                                        }`}
                                                    disabled={subscriptionStatus === 'loading' || subscriptionStatus === 'success'}
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={subscriptionStatus === 'loading' || subscriptionStatus === 'success'}
                                                    className={`px-6 py-3 rounded-r-xl transition-all duration-500 relative overflow-hidden group-hover:px-7 text-white flex items-center justify-center min-w-[120px] ${subscriptionStatus === 'error' ? 'bg-red-500 hover:bg-red-600' :
                                                        subscriptionStatus === 'success' ? 'bg-green-500' :
                                                            'bg-gradient-to-r from-[#FF5722] to-[#FF9800] hover:from-[#E64A19] hover:to-[#F57C00]'
                                                        }`}
                                                >
                                                    {subscriptionStatus === 'loading' ? (
                                                        <FiLoader className="animate-spin" size={20} />
                                                    ) : subscriptionStatus === 'success' ? (
                                                        <><FiCheckCircle size={18} className="mr-1.5" /> Subscribed</>
                                                    ) : subscriptionStatus === 'error' ? (
                                                        <><FiAlertCircle size={18} className="mr-1.5" /> Try Again</>
                                                    ) : (
                                                        <>
                                                            <span className="relative z-10">Subscribe</span>
                                                            <span className="absolute inset-0 bg-gradient-to-r from-[#E64A19] to-[#F57C00] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Error message */}
                                            {subscriptionStatus === 'error' && (
                                                <p className="text-red-500 text-sm mt-1.5 absolute">
                                                    {errorMessage}
                                                </p>
                                            )}

                                            {/* Success message */}
                                            {subscriptionStatus === 'success' && (
                                                <p className="text-green-600 text-sm mt-1.5 absolute">
                                                    Thanks for subscribing! Check your inbox.
                                                </p>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Enhanced with react-icons */}
                <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-100">
                    <div className="container mx-auto px-4 py-5">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="text-sm text-gray-500 mb-4 md:mb-0 flex items-center">
                                <span className="w-5 h-5 rounded-lg bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center mr-2 text-xs">R</span>
                                © 2025 Rovify. All rights reserved.
                            </div>
                            <div className="flex items-center space-x-8">
                                <a href="#" className="text-sm text-gray-500 hover:text-[#FF5722] transition-colors flex items-center group">
                                    <span className="bg-gray-100 group-hover:bg-[#FF5722]/10 w-6 h-6 rounded-md flex items-center justify-center mr-2 transition-colors">
                                        <FiShield className="h-3.5 w-3.5 text-gray-500 group-hover:text-[#FF5722] transition-colors" />
                                    </span>
                                    Security
                                </a>
                                <a href="#" className="text-sm text-gray-500 hover:text-[#FF5722] transition-colors flex items-center group">
                                    <span className="bg-gray-100 group-hover:bg-[#FF5722]/10 w-6 h-6 rounded-md flex items-center justify-center mr-2 transition-colors">
                                        <FiInfo className="h-3.5 w-3.5 text-gray-500 group-hover:text-[#FF5722] transition-colors" />
                                    </span>
                                    Status
                                </a>
                                <div className="flex items-center text-sm text-gray-500">
                                    <span className="bg-[#FF5722]/10 w-6 h-6 rounded-md flex items-center justify-center mr-2">
                                        <FiMapPin className="h-3.5 w-3.5 text-[#FF5722]" />
                                    </span>
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