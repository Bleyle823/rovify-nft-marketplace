/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    FiChevronDown,
    FiChevronUp,
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
    FiSearch, FiMessageSquare, FiMail, FiHelpCircle, FiCalendar, FiCreditCard, FiSmartphone
} from 'react-icons/fi';
import PublicHeader from '@/components/PublicHeader';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

// FAQ categories and questions
const faqData = {
    account: [
        {
            question: "How do I create an account?",
            answer: "You can create an account by clicking the 'Sign Up' button in the top-right corner of the home page. You'll need to provide your email address, create a password, and verify your email to complete the registration."
        },
        {
            question: "How do I reset my password?",
            answer: "If you've forgotten your password, click on 'Login', then select 'Forgot Password'. Enter your email address and we'll send you a password reset link. Follow the instructions in the email to set a new password."
        },
        {
            question: "How do I connect my crypto wallet?",
            answer: "To connect your crypto wallet, go to your Profile page and click on 'Connect Wallet'. You can then choose to connect with MetaMask, WalletConnect, or other supported wallets. Follow the prompts in your wallet to complete the connection."
        }
    ],
    events: [
        {
            question: "How do I create an event?",
            answer: "To create an event, click the '+' button in the navigation bar and fill out the event details form. You'll need to provide event title, description, date, location, and ticket information. You can also choose to offer NFT tickets for your event."
        },
        {
            question: "Can I edit an event after publishing it?",
            answer: "Yes, you can edit most details of your event after publishing by going to your Profile page, selecting the event, and clicking 'Edit'. However, some changes may be restricted after tickets have been sold."
        },
        {
            question: "How do I find events near me?",
            answer: "You can find events near you by using the Explore tab and allowing location access. You can also search for events by city or use filters to find events by category, date, or price range."
        }
    ],
    tickets: [
        {
            question: "What are NFT tickets?",
            answer: "NFT tickets are blockchain-based digital tickets that provide proof of ownership on the blockchain. They offer benefits like enhanced security against counterfeiting, potential for future resale value, and can serve as digital collectibles after the event."
        },
        {
            question: "How do I purchase tickets?",
            answer: "To purchase tickets, navigate to the event page and click 'Buy Tickets'. Select the ticket type and quantity, then proceed to checkout. You can pay with credit card, PayPal, or cryptocurrency for NFT tickets."
        },
        {
            question: "Can I transfer my tickets to someone else?",
            answer: "Yes, you can transfer tickets to another Rovify user. Go to your Tickets page, select the ticket you want to transfer, and click 'Transfer'. Enter the recipient's email or username to complete the transfer."
        }
    ],
    payments: [
        {
            question: "What payment methods are accepted?",
            answer: "We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, and various cryptocurrencies including ETH, MATIC, and USDC for NFT tickets."
        },
        {
            question: "Are there any fees for purchasing tickets?",
            answer: "Yes, there is a service fee for each ticket purchase. The fee amount will be displayed during checkout before you complete your purchase. For cryptocurrency transactions, network gas fees may also apply."
        },
        {
            question: "What is your refund policy?",
            answer: "Refund policies are set by event organisers and vary by event. The refund policy for each event is displayed on the event page before purchase. For NFT tickets, refunds may be subject to additional blockchain-related limitations."
        }
    ],
    app: [
        {
            question: "Is there a mobile app available?",
            answer: "Yes, Rovify is available as a web app and as a native app for iOS and Android devices. You can download the app from the App Store or Google Play Store."
        },
        {
            question: "How do I download my tickets to my phone?",
            answer: "Your tickets are automatically available in the 'Tickets' section of your account. For easier access, you can add tickets to your phone's wallet app or download them as PDF files for offline access."
        },
        {
            question: "Can I use Rovify without creating an account?",
            answer: "You can browse events without an account, but you'll need to create an account to purchase tickets, create events, or use other personalized features."
        }
    ]
};

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('account');
    const [expandedFaqs, setExpandedFaqs] = useState<{ [key: string]: boolean }>({});
    const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');

    const toggleFaq = (category: string, index: number) => {
        const key = `${category}-${index}`;
        setExpandedFaqs(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Filter FAQs based on search query
    const filteredFaqs = searchQuery
        ? Object.entries(faqData).reduce((acc, [category, questions]) => {
            const filteredQuestions = questions.filter(
                faq =>
                    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredQuestions.length > 0) {
                acc[category as keyof typeof faqData] = filteredQuestions;
            }

            return acc;
        }, {} as Record<keyof typeof faqData, { question: string; answer: string; }[]>)
        : faqData;

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

    return (
        <div className="min-h-screen bg-gray-50">
            <PublicHeader />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Link href="/" className="hover:text-[#FF5722] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="font-medium text-gray-700">Help & Support</span>
                    </div>

                    {/* Page Header */}
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">How can we help you?</h1>
                        <p className="text-gray-600 mb-8">Find answers to common questions or contact our support team</p>

                        {/* Search Bar */}
                        <div className="max-w-md mx-auto relative">
                            <input
                                type="text"
                                placeholder="Search for help topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 pl-10 rounded-xl bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {searchQuery ? (
                        // Search Results
                        <div className="mb-10">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Search Results for &quot;{searchQuery}&quot;
                            </h2>

                            {Object.keys(filteredFaqs).length > 0 ? (
                                Object.entries(filteredFaqs).map(([category, questions]) => (
                                    <div key={category} className="mb-6">
                                        <h3 className="text-md font-medium text-gray-800 capitalize mb-3">
                                            {category}
                                        </h3>
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                            {questions.map((faq, index) => {
                                                const key = `${category}-${index}`;
                                                return (
                                                    <div key={key} className="border-b border-gray-100 last:border-none">
                                                        <button
                                                            onClick={() => toggleFaq(category, index)}
                                                            className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                                                        >
                                                            <span className="font-medium text-gray-900">
                                                                {faq.question}
                                                            </span>
                                                            {expandedFaqs[key] ? (
                                                                <FiChevronUp className="text-gray-400 flex-shrink-0" />
                                                            ) : (
                                                                <FiChevronDown className="text-gray-400 flex-shrink-0" />
                                                            )}
                                                        </button>

                                                        {expandedFaqs[key] && (
                                                            <div className="px-6 pb-6 prose text-gray-600">
                                                                <p>{faq.answer}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <FiHelpCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">No results found</h3>
                                    <p className="text-gray-600 mb-4">
                                        We couldn&apos;t find any help articles matching your search.
                                    </p>
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="px-4 py-2 bg-[#FF5722]/10 text-[#FF5722] rounded-lg font-medium hover:bg-[#FF5722]/20 transition-colors"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Regular Help Page Content
                        <>
                            {/* Help Topic Categories */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                                {[
                                    { id: 'account', name: 'Account', icon: FiUser },
                                    { id: 'events', name: 'Events', icon: FiCalendar },
                                    { id: 'tickets', name: 'Tickets', icon: FiMessageSquare },
                                    { id: 'payments', name: 'Payments', icon: FiCreditCard },
                                    { id: 'app', name: 'Mobile App', icon: FiSmartphone },
                                    { id: 'contact', name: 'Contact Us', icon: FiMail }
                                ].map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => category.id === 'contact' ? null : setActiveCategory(category.id)}
                                        className={`p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow text-center ${activeCategory === category.id ? 'border-[#FF5722]/50' : 'border-gray-100'
                                            }`}
                                    >
                                        <div className={`h-12 w-12 mx-auto rounded-full flex items-center justify-center mb-2 ${activeCategory === category.id
                                            ? 'bg-[#FF5722]/10 text-[#FF5722]'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            <category.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className={`font-medium ${activeCategory === category.id ? 'text-[#FF5722]' : 'text-gray-900'
                                            }`}>
                                            {category.name}
                                        </h3>
                                    </button>
                                ))}
                            </div>

                            {/* FAQ Accordion */}
                            <div className="mb-10">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Frequently Asked Questions
                                </h2>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    {faqData[activeCategory as keyof typeof faqData].map((faq, index) => {
                                        const key = `${activeCategory}-${index}`;
                                        return (
                                            <div key={key} className="border-b border-gray-100 last:border-none">
                                                <button
                                                    onClick={() => toggleFaq(activeCategory, index)}
                                                    className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                                                >
                                                    <span className="font-medium text-gray-900">
                                                        {faq.question}
                                                    </span>
                                                    {expandedFaqs[key] ? (
                                                        <FiChevronUp className="text-gray-400 flex-shrink-0" />
                                                    ) : (
                                                        <FiChevronDown className="text-gray-400 flex-shrink-0" />
                                                    )}
                                                </button>

                                                {expandedFaqs[key] && (
                                                    <div className="px-6 pb-6 prose text-gray-600">
                                                        <p>{faq.answer}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Contact Support Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
                                <p className="text-gray-600 mb-6">
                                    Can&apos;t find what you&apos;re looking for? Our support team is ready to assist you.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[#FF5722]/5 rounded-xl p-6 border border-[#FF5722]/10">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-[#FF5722]/10 p-3 rounded-full">
                                                <FiMessageSquare className="h-6 w-6 text-[#FF5722]" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-2">Chat Support</h3>
                                                <p className="text-gray-600 text-sm mb-4">
                                                    Get instant help from our support team through live chat.
                                                </p>
                                                <button className="px-4 py-2 bg-[#FF5722] text-white rounded-lg font-medium hover:bg-[#E64A19] transition-colors">
                                                    Start Chat
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-gray-200 p-3 rounded-full">
                                                <FiMail className="h-6 w-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                                                <p className="text-gray-600 text-sm mb-4">
                                                    Send us an email and we&apos;ll get back to you within 24 hours.
                                                </p>
                                                <a
                                                    href="mailto:support@rovify.io"
                                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium inline-block hover:bg-gray-300 transition-colors"
                                                >
                                                    support@rovify.io
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Self-Help Resources */}
                            <div className="mb-10">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Helpful Resources</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Link href="/guide/getting-started" className="group">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
                                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#FF5722] transition-colors">Getting Started Guide</h3>
                                            <p className="text-gray-600 text-sm">
                                                Learn the basics of using Rovify and discover all its features.
                                            </p>
                                        </div>
                                    </Link>

                                    <Link href="/guide/nft-tickets" className="group">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
                                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#FF5722] transition-colors">NFT Tickets Explained</h3>
                                            <p className="text-gray-600 text-sm">
                                                Everything you need to know about blockchain-based tickets.
                                            </p>
                                        </div>
                                    </Link>

                                    <Link href="/guide/event-creation" className="group">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
                                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#FF5722] transition-colors">Event Creation Tips</h3>
                                            <p className="text-gray-600 text-sm">
                                                Best practices for creating successful events on Rovify.
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Back to Home */}
                    <div className="text-center mb-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-[#FF5722] bg-[#FF5722]/5 hover:bg-[#FF5722]/10 px-5 py-3 rounded-full transition-colors shadow-sm"
                        >
                            <FiArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
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
                                        <span className="w-2 h-0.5 bg-[#FF5722] rounded-full mr-2"></span>
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
                                    <a href="/terms" className="text-[#FF5722] font-medium group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors group flex items-center">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[#FF5722] rounded-full mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
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