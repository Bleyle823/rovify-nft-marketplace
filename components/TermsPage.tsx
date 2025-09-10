/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
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
    FiBookOpen,
    FiUser,
    FiFileText,
    FiDollarSign,
    FiXOctagon,
    FiShieldOff,
    FiEdit,
    FiHome
} from 'react-icons/fi';
import PublicHeader from '@/components/PublicHeader';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

const sectionIcons = {
    'introduction': <FiBookOpen />,
    'account': <FiUser />,
    'content': <FiFileText />,
    'payments': <FiDollarSign />,
    'termination': <FiXOctagon />,
    'liability': <FiShieldOff />,
    'changes': <FiEdit />
};

export default function TermsPage() {
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
        'introduction': true,
        'account': false,
        'content': false,
        'payments': false,
        'termination': false,
        'liability': false,
        'changes': false,
    });

    const sectionRefs = {
        introduction: useRef<HTMLDivElement>(null),
        account: useRef<HTMLDivElement>(null),
        content: useRef<HTMLDivElement>(null),
        payments: useRef<HTMLDivElement>(null),
        termination: useRef<HTMLDivElement>(null),
        liability: useRef<HTMLDivElement>(null),
        changes: useRef<HTMLDivElement>(null),
    };

    const [email, setEmail] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const toggleSection = (section: string) => {
        if (expandedSections[section]) {
            setExpandedSections(prev => ({
                ...prev,
                [section]: !prev[section]
            }));
            return;
        }

        const newState = Object.keys(expandedSections).reduce((acc, key) => {
            acc[key] = key === section;
            return acc;
        }, {} as { [key: string]: boolean });

        setExpandedSections(newState);

        setTimeout(() => {
            sectionRefs[section as keyof typeof sectionRefs]?.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    };

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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash.replace('#', '');
            if (hash && Object.keys(expandedSections).includes(hash)) {
                toggleSection(hash);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Decorative background elements */}
            <div className="fixed inset-0 bg-[url('/images/patterns/hex-pattern.svg')] opacity-[0.02] pointer-events-none z-0"></div>

            <PublicHeader />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28 relative z-10">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumbs - Enhanced */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-100">
                        <Link href="/" className="flex items-center hover:text-[#FF5722] transition-colors">
                            <FiHome className="mr-1.5" size={14} />
                            Home
                        </Link>
                        <span className="text-gray-300">/</span>
                        <span className="font-medium text-gray-800 flex items-center">
                            <FiFileText className="mr-1.5" size={14} />
                            Terms of Service
                        </span>
                    </div>

                    {/* Page Header - Enhanced */}
                    <div className="mb-10 bg-gradient-to-r from-white to-gray-50 p-8 rounded-2xl shadow-md border border-gray-100 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 opacity-10">
                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="currentColor" className="text-[#FF5722]" />
                            </svg>
                        </div>
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 opacity-10 rotate-45">
                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="currentColor" className="text-[#FF5722]" />
                            </svg>
                        </div>

                        <div className="relative">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center">
                                <span className="bg-[#FF5722]/10 text-[#FF5722] w-10 h-10 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                                    <FiFileText size={20} />
                                </span>
                                Terms of Service
                            </h1>
                            <p className="text-gray-600 pl-14">Last updated: May 13, 2025</p>
                        </div>
                    </div>

                    {/* Table of Contents - Desktop - Enhanced */}
                    <div className="hidden md:block bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8 relative overflow-hidden">
                        {/* Decorative gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5722]/60 to-[#FF9800]/60"></div>

                        <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                            <span className="bg-[#FF5722]/10 text-[#FF5722] w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                                <FiBookOpen size={16} />
                            </span>
                            Contents
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.keys(expandedSections).map((section, index) => (
                                <a
                                    key={section}
                                    href={`#${section}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleSection(section);
                                    }}
                                    className={`flex items-center p-3 rounded-lg hover:bg-[#FF5722]/5 transition-colors ${expandedSections[section] ? 'bg-[#FF5722]/5 text-[#FF5722] font-medium' : 'text-gray-600'
                                        }`}
                                >
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${expandedSections[section]
                                        ? 'bg-[#FF5722] text-white'
                                        : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {index + 1}
                                    </span>
                                    <span className="capitalize flex items-center">
                                        <span className="mr-2">{sectionIcons[section as keyof typeof sectionIcons]}</span>
                                        {section}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Terms Content - Enhanced */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-10">
                        {/* Introduction */}
                        <div id="introduction" ref={sectionRefs.introduction} className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('introduction')}
                                className={`w-full px-6 py-5 flex justify-between items-center transition-colors ${expandedSections.introduction
                                    ? 'bg-[#FF5722]/5'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-medium mr-4 transition-all ${expandedSections.introduction
                                        ? 'bg-[#FF5722] text-white shadow-md'
                                        : 'bg-[#FF5722]/10 text-[#FF5722]'
                                        }`}>
                                        1
                                    </span>
                                    <span className="flex items-center">
                                        <FiBookOpen className="mr-2" size={18} />
                                        Introduction
                                    </span>
                                </h2>
                                {expandedSections.introduction ? (
                                    <FiChevronUp className={`text-[#FF5722] transition-transform duration-300 transform`} size={24} />
                                ) : (
                                    <FiChevronDown className={`text-gray-400 transition-transform duration-300 transform`} size={24} />
                                )}
                            </button>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedSections.introduction ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="px-6 pb-8 pt-2 prose max-w-none text-gray-600">
                                    <p className="text-gray-700 leading-relaxed">
                                        Welcome to <span className="text-[#FF5722] font-medium">Rovify</span> — where traditional events meet the blockchain revolution. Our platform empowers creators and attendees to discover, create, and participate in events using both conventional and NFT-based ticketing solutions.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        These Terms of Service (&quot;Terms&quot;) establish the ground rules for your journey with Rovify&apos;s website, mobile application, and services (collectively, the &quot;Service&quot;). We&apos;ve crafted these Terms to be as clear and straightforward as possible.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        By accessing or using Rovify, you&apos;re agreeing to abide by these Terms and our Privacy Policy. If these Terms don&apos;t align with your expectations, we respectfully ask that you refrain from using the Service.
                                    </p>
                                    <div className="p-5 bg-gradient-to-r from-[#FF5722]/5 to-transparent rounded-xl border border-[#FF5722]/20 mt-4 relative">
                                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#FF5722]/60 to-[#FF9800]/60 rounded-l"></div>
                                        <p className="text-gray-700 font-medium mb-0">
                                            Our mission is to bridge the gap between traditional event experiences and the exciting possibilities of Web3, creating unique opportunities for connection and community.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Section */}
                        <div id="account" ref={sectionRefs.account} className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('account')}
                                className={`w-full px-6 py-5 flex justify-between items-center transition-colors ${expandedSections.account
                                    ? 'bg-[#FF5722]/5'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-medium mr-4 transition-all ${expandedSections.account
                                        ? 'bg-[#FF5722] text-white shadow-md'
                                        : 'bg-[#FF5722]/10 text-[#FF5722]'
                                        }`}>
                                        2
                                    </span>
                                    <span className="flex items-center">
                                        <FiUser className="mr-2" size={18} />
                                        Account Registration & Requirements
                                    </span>
                                </h2>
                                {expandedSections.account ? (
                                    <FiChevronUp className={`text-[#FF5722] transition-transform duration-300 transform`} size={24} />
                                ) : (
                                    <FiChevronDown className={`text-gray-400 transition-transform duration-300 transform`} size={24} />
                                )}
                            </button>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedSections.account ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="px-6 pb-8 pt-2 prose max-w-none text-gray-600">
                                    <p className="text-gray-700 leading-relaxed">
                                        To unlock the full Rovify experience, you&apos;ll need to create an account. During registration, we ask that you provide information that&apos;s accurate, current, and complete about yourself.
                                    </p>

                                    <h3 className="text-gray-800 font-semibold mt-5 flex items-center">
                                        <span className="w-8 h-8 rounded-lg bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center mr-2 text-sm">
                                            <FiUser size={14} />
                                        </span>
                                        Who Can Create an Account
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        You must be at least 18 years old to create a Rovify account. By signing up, you confirm that:
                                    </p>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            You&apos;re at least 18 years of age
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            You have the legal capacity to agree to these Terms
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            You&apos;ll follow these Terms and applicable laws
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Your registration information is truthful and accurate
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            You&apos;ll keep your account information up-to-date
                                        </li>
                                    </ul>

                                    <h3 className="text-gray-800 font-semibold mt-5 flex items-center">
                                        <span className="w-8 h-8 rounded-lg bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center mr-2 text-sm">
                                            <FiShield size={14} />
                                        </span>
                                        Keeping Your Account Secure
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Your account security is a shared responsibility. You agree to:
                                    </p>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Maintain the confidentiality of your login credentials
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Take responsibility for all activities under your account
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Notify Rovify immediately if you detect unauthorized access
                                        </li>
                                    </ul>

                                    <div className="p-5 mt-4 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white relative">
                                        <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="currentColor" className="text-gray-500" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-700 font-medium mb-2 flex items-center">
                                            <span className="text-[#FF5722] mr-2"><FiCheckCircle size={16} /></span>
                                            Pro Tip: For maximum security, we recommend:
                                        </p>
                                        <ul className="space-y-1 text-gray-600 mb-0 ml-6">
                                            <li className="flex items-start text-sm">
                                                <span className="text-[#FF5722] mr-2">✓</span>
                                                Using a strong, unique password
                                            </li>
                                            <li className="flex items-start text-sm">
                                                <span className="text-[#FF5722] mr-2">✓</span>
                                                Enabling two-factor authentication
                                            </li>
                                            <li className="flex items-start text-sm">
                                                <span className="text-[#FF5722] mr-2">✓</span>
                                                Never sharing your account credentials
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div id="content" ref={sectionRefs.content} className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('content')}
                                className={`w-full px-6 py-5 flex justify-between items-center transition-colors ${expandedSections.content
                                    ? 'bg-[#FF5722]/5'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-medium mr-4 transition-all ${expandedSections.content
                                        ? 'bg-[#FF5722] text-white shadow-md'
                                        : 'bg-[#FF5722]/10 text-[#FF5722]'
                                        }`}>
                                        3
                                    </span>
                                    <span className="flex items-center">
                                        <FiFileText className="mr-2" size={18} />
                                        User Content & Conduct
                                    </span>
                                </h2>
                                {expandedSections.content ? (
                                    <FiChevronUp className={`text-[#FF5722] transition-transform duration-300 transform`} size={24} />
                                ) : (
                                    <FiChevronDown className={`text-gray-400 transition-transform duration-300 transform`} size={24} />
                                )}
                            </button>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedSections.content ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="px-6 pb-8 pt-2 prose max-w-none text-gray-600">
                                    <p className="text-gray-700 leading-relaxed">
                                        Rovify is a canvas for your creativity—a place to create events, share content, and build connections with others in the community. You&apos;re the curator of your content and responsible for your interactions.
                                    </p>

                                    <h3 className="text-gray-800 font-semibold mt-5 flex items-center">
                                        <span className="w-8 h-8 rounded-lg bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center mr-2 text-sm">
                                            <FiFileText size={14} />
                                        </span>
                                        Content Guidelines
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        To maintain a positive, inclusive environment, please refrain from posting content that:
                                    </p>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Is illegal, harmful, threatening, or discriminatory
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Infringes on intellectual property rights or third-party rights
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Contains malware, harmful code, or disruptive elements
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Misleads or deceives others about events or offerings
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Promotes illegal activities or violates others&apos; rights
                                        </li>
                                    </ul>

                                    <h3 className="text-gray-800 font-semibold mt-5 flex items-center">
                                        <span className="w-8 h-8 rounded-lg bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center mr-2 text-sm">
                                            <FiEdit size={14} />
                                        </span>
                                        How We Use Your Content
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        When you share content on Rovify, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publish, distribute, and display such content in connection with providing and promoting the Service.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        This license allows us to:
                                    </p>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Display your event listings to potential attendees
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Feature exceptional events in our marketing materials
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Optimize the platform experience for all users
                                        </li>
                                    </ul>

                                    <div className="p-5 bg-gradient-to-r from-[#FF5722]/5 to-transparent rounded-xl border border-[#FF5722]/20 mt-4 relative">
                                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#FF5722]/60 to-[#FF9800]/60 rounded-l"></div>
                                        <p className="text-gray-700 font-medium mb-0">
                                            Remember: While you retain ownership of your content, sharing it on Rovify means others may see it. Be mindful of what you share and how it represents you or your organization.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payments Section */}
                        <div id="payments" ref={sectionRefs.payments} className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('payments')}
                                className={`w-full px-6 py-5 flex justify-between items-center transition-colors ${expandedSections.payments
                                    ? 'bg-[#FF5722]/5'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-medium mr-4 transition-all ${expandedSections.payments
                                        ? 'bg-[#FF5722] text-white shadow-md'
                                        : 'bg-[#FF5722]/10 text-[#FF5722]'
                                        }`}>
                                        4
                                    </span>
                                    <span className="flex items-center">
                                        <FiDollarSign className="mr-2" size={18} />
                                        Payments & Refunds
                                    </span>
                                </h2>
                                {expandedSections.payments ? (
                                    <FiChevronUp className={`text-[#FF5722] transition-transform duration-300 transform`} size={24} />
                                ) : (
                                    <FiChevronDown className={`text-gray-400 transition-transform duration-300 transform`} size={24} />
                                )}
                            </button>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedSections.payments ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="px-6 pb-8 pt-2 prose max-w-none text-gray-600">
                                    <p className="text-gray-700 leading-relaxed">
                                        Rovify offers a dual-ticketing approach—traditional payment methods and blockchain-based NFT ticketing—providing flexibility for both organisers and attendees.
                                    </p>

                                    <h3 className="text-gray-800 font-semibold mt-5 flex items-center">
                                        <span className="w-8 h-8 rounded-lg bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center mr-2 text-sm">
                                            <FiDollarSign size={14} />
                                        </span>
                                        Understanding Pricing & Fees
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Event organisers set their ticket prices, and Rovify adds service fees to support our platform operations. All prices and fees will be clearly displayed during checkout in the specified event currency.
                                    </p>

                                    <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                            <h4 className="text-sm font-medium text-gray-700 m-0 flex items-center">
                                                <span className="w-5 h-5 rounded-md bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center mr-2 text-xs">
                                                    <FiDollarSign size={12} />
                                                </span>
                                                Typical Fee Structure
                                            </h4>
                                        </div>
                                        <div className="px-4 py-3 text-sm">
                                            <div className="grid grid-cols-2 gap-2 text-gray-600">
                                                <div className="flex items-center">
                                                    <span className="w-2 h-2 rounded-full bg-[#FF5722]/60 mr-2"></span>
                                                    Standard Tickets:
                                                </div>
                                                <div>5-8% + fixed fee</div>
                                                <div className="flex items-center">
                                                    <span className="w-2 h-2 rounded-full bg-[#FF9800]/60 mr-2"></span>
                                                    NFT Tickets:
                                                </div>
                                                <div>2.5-5% + gas fees</div>
                                                <div className="flex items-center">
                                                    <span className="w-2 h-2 rounded-full bg-green-500/60 mr-2"></span>
                                                    Free Events:
                                                </div>
                                                <div>No Rovify fee</div>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-gray-800 font-semibold mt-5 flex items-center">
                                        <span className="w-8 h-8 rounded-lg bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center mr-2 text-sm">
                                            <FiEdit size={14} />
                                        </span>
                                        Refunds & Event Changes
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Refund policies are established by event organisers and will be clearly communicated at purchase. Rovify strives to create transparency between organisers and attendees.
                                    </p>

                                    <div className="p-5 bg-gradient-to-r from-[#FF5722]/5 to-transparent rounded-xl border border-[#FF5722]/20 mt-4 relative">
                                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#FF5722]/60 to-[#FF9800]/60 rounded-l"></div>
                                        <p className="text-gray-800 font-medium mb-2">
                                            Important NFT Ticket Information:
                                        </p>
                                        <p className="text-gray-700 mb-0">
                                            NFT tickets operate on blockchain technology, which may have different refund mechanisms than traditional tickets. Each NFT ticket comes with specific smart contract terms that govern refundability, transfers, and special benefits. Always review the event&apos;s specific policies before purchasing.
                                        </p>
                                    </div>

                                    <div className="mt-4 p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white relative">
                                        <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="currentColor" className="text-gray-500" />
                                            </svg>
                                        </div>
                                        <h4 className="text-gray-700 font-medium mb-2 flex items-center">
                                            <span className="text-[#FF5722] mr-2"><FiCheckCircle size={16} /></span>
                                            Your Rights as an Attendee:
                                        </h4>
                                        <ul className="space-y-1 text-gray-600 mb-0 ml-6">
                                            <li className="flex items-start text-sm">
                                                <span className="text-[#FF5722] mr-2">✓</span>
                                                Clear refund policies before purchase
                                            </li>
                                            <li className="flex items-start text-sm">
                                                <span className="text-[#FF5722] mr-2">✓</span>
                                                Notification of substantial event changes
                                            </li>
                                            <li className="flex items-start text-sm">
                                                <span className="text-[#FF5722] mr-2">✓</span>
                                                Support from Rovify if disputes arise
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Continue with other sections similarly */}
                        <div id="termination" ref={sectionRefs.termination} className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('termination')}
                                className={`w-full px-6 py-5 flex justify-between items-center transition-colors ${expandedSections.termination
                                    ? 'bg-[#FF5722]/5'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-medium mr-4 transition-all ${expandedSections.termination
                                        ? 'bg-[#FF5722] text-white shadow-md'
                                        : 'bg-[#FF5722]/10 text-[#FF5722]'
                                        }`}>
                                        5
                                    </span>
                                    <span className="flex items-center">
                                        <FiXOctagon className="mr-2" size={18} />
                                        Termination
                                    </span>
                                </h2>
                                {expandedSections.termination ? (
                                    <FiChevronUp className={`text-[#FF5722] transition-transform duration-300 transform`} size={24} />
                                ) : (
                                    <FiChevronDown className={`text-gray-400 transition-transform duration-300 transform`} size={24} />
                                )}
                            </button>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedSections.termination ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="px-6 pb-8 pt-2 prose max-w-none text-gray-600">
                                    <p className="text-gray-700 leading-relaxed">
                                        While we hope for long-lasting relationships with all users, there may be circumstances where account termination becomes necessary. Rovify reserves the right to suspend or terminate accounts that violate our Terms, harm our community, or engage in activities detrimental to the platform.
                                    </p>

                                    <div className="mt-4 p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white relative">
                                        <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="currentColor" className="text-gray-500" />
                                            </svg>
                                        </div>
                                        <h4 className="text-gray-700 font-medium mb-2 flex items-center">
                                            <span className="text-[#FF5722] mr-2"><FiAlertCircle size={16} /></span>
                                            Termination Scenarios Include:
                                        </h4>
                                        <ul className="space-y-1 text-gray-600 mb-0 ml-6">
                                            <li className="flex items-start text-sm">
                                                <span className="text-[#FF5722] mr-2">•</span>
                                                Violation of these Terms or related policies
                                            </li>
                                            <li className="flex items-start text-sm">
                                                <span className="text-[#FF5722] mr-2">•</span>
                                                Fraudulent, deceptive, or illegal activities
                                            </li>
                                            <li className="flex items-start text-sm">
                                                <span className="text-[#FF5722] mr-2">•</span>
                                                Harmful actions toward other community members
                                            </li>
                                            <li className="flex items-start text-sm">
                                                <span className="text-[#FF5722] mr-2">•</span>
                                                Misrepresentation of events or credentials
                                            </li>
                                        </ul>
                                    </div>

                                    <p className="text-gray-700 leading-relaxed mt-4">
                                        Upon termination, your access to the Service will cease immediately. Any pending transactions or active event listings may be affected, so we recommend fulfilling all obligations before any voluntary account closure.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div id="liability" ref={sectionRefs.liability} className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('liability')}
                                className={`w-full px-6 py-5 flex justify-between items-center transition-colors ${expandedSections.liability
                                    ? 'bg-[#FF5722]/5'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-medium mr-4 transition-all ${expandedSections.liability
                                        ? 'bg-[#FF5722] text-white shadow-md'
                                        : 'bg-[#FF5722]/10 text-[#FF5722]'
                                        }`}>
                                        6
                                    </span>
                                    <span className="flex items-center">
                                        <FiShieldOff className="mr-2" size={18} />
                                        Limitation of Liability
                                    </span>
                                </h2>
                                {expandedSections.liability ? (
                                    <FiChevronUp className={`text-[#FF5722] transition-transform duration-300 transform`} size={24} />
                                ) : (
                                    <FiChevronDown className={`text-gray-400 transition-transform duration-300 transform`} size={24} />
                                )}
                            </button>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedSections.liability ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="px-6 pb-8 pt-2 prose max-w-none text-gray-600">
                                    <p className="text-gray-700 leading-relaxed">
                                        To the maximum extent permitted by applicable law, Rovify and its team members, directors, employees, and agents will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
                                    </p>

                                    <p className="text-gray-700 leading-relaxed mt-4">
                                        This includes but is not limited to:
                                    </p>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Loss of profits, data, or goodwill
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Business interruption or financial losses
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Damages from service interruptions or failures
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#FF5722] mr-2">•</span>
                                            Consequences of third-party actions or event cancellations
                                        </li>
                                    </ul>

                                    <div className="p-5 bg-gradient-to-r from-[#FF5722]/5 to-transparent rounded-xl border border-[#FF5722]/20 mt-4 relative">
                                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#FF5722]/60 to-[#FF9800]/60 rounded-l"></div>
                                        <p className="text-gray-700 font-medium mb-0">
                                            While we strive to provide a reliable platform, we encourage users to perform their own due diligence when engaging with events and other users on Rovify. We serve as a marketplace connector but cannot guarantee the quality or outcome of every event.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="changes" ref={sectionRefs.changes} className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('changes')}
                                className={`w-full px-6 py-5 flex justify-between items-center transition-colors ${expandedSections.changes
                                    ? 'bg-[#FF5722]/5'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-medium mr-4 transition-all ${expandedSections.changes
                                        ? 'bg-[#FF5722] text-white shadow-md'
                                        : 'bg-[#FF5722]/10 text-[#FF5722]'
                                        }`}>
                                        7
                                    </span>
                                    <span className="flex items-center">
                                        <FiEdit className="mr-2" size={18} />
                                        Changes to Terms
                                    </span>
                                </h2>
                                {expandedSections.changes ? (
                                    <FiChevronUp className={`text-[#FF5722] transition-transform duration-300 transform`} size={24} />
                                ) : (
                                    <FiChevronDown className={`text-gray-400 transition-transform duration-300 transform`} size={24} />
                                )}
                            </button>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedSections.changes ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="px-6 pb-8 pt-2 prose max-w-none text-gray-600">
                                    <p className="text-gray-700 leading-relaxed">
                                        As Rovify evolves, we may update these Terms to reflect new features, legal requirements, or improved practices. For significant changes, we&apos;ll notify you through the platform or via your registered email address.
                                    </p>

                                    <p className="text-gray-700 leading-relaxed mt-4">
                                        Continuing to use Rovify after updates constitutes acceptance of the revised Terms. We encourage checking this page periodically to stay informed about any changes.
                                    </p>

                                    <div className="mt-4 p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white relative">
                                        <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="currentColor" className="text-gray-500" />
                                            </svg>
                                        </div>
                                        <h4 className="text-gray-700 font-medium mb-2 flex items-center">
                                            <span className="text-[#FF5722] mr-2"><FiCheckCircle size={16} /></span>
                                            Our Commitment to Transparency:
                                        </h4>
                                        <ul className="space-y-1 text-gray-600 mb-0 ml-6">
                                            <li className="flex items-start text-sm">
                                                <span className="text-[#FF5722] mr-2">✓</span>
                                                Clear notifications about substantial changes
                                            </li>
                                            <li className="flex items-start text-sm">
                                                <span className="text-[#FF5722] mr-2">✓</span>
                                                Advance notice when possible before implementation
                                            </li>
                                            <li className="flex items-start text-sm">
                                                <span className="text-[#FF5722] mr-2">✓</span>
                                                Archive of previous Terms versions upon request
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information - Enhanced */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-10 relative overflow-hidden">
                        {/* Decorative gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5722]/60 to-[#FF9800]/60"></div>

                        {/* Decorative elements */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 opacity-[0.03]">
                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="currentColor" className="text-[#FF5722]" />
                            </svg>
                        </div>

                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="bg-[#FF5722]/10 text-[#FF5722] w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                                <FiSend size={18} />
                            </span>
                            Contact Us
                        </h2>
                        <p className="text-gray-600 mb-5">
                            Have questions about our Terms of Service? We&apos;re here to help:
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <span className="w-8 h-8 rounded-full bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center">
                                    <FiSend size={16} />
                                </span>
                                <div>
                                    <span className="font-medium block text-gray-800">Email:</span>
                                    <a href="mailto:legal@rovify.io" className="text-[#FF5722] hover:underline">legal@rovify.io</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <span className="w-8 h-8 rounded-full bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center">
                                    <FiMapPin size={16} />
                                </span>
                                <div>
                                    <span className="font-medium block text-gray-800">Address:</span>
                                    <span>Kigali, Rwanda</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <span className="w-8 h-8 rounded-full bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center">
                                    <FiInfo size={16} />
                                </span>
                                <div>
                                    <span className="font-medium block text-gray-800">Response Time:</span>
                                    <span>Within 2 business days</span>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                    <a href="/terms" className="text-[#FF5722] font-medium group flex items-center">
                                        <span className="w-2 h-0.5 bg-[#FF5722] rounded-full mr-2"></span>
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