/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiArrowRight } from 'react-icons/fi';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

export default function PublicHeader() {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Handle scroll events
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'py-3 bg-white shadow-sm'
                : 'py-5 bg-white'
                }`}
        >
            <div className="container mx-auto px-5 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <div className="h-10 w-10 rounded-full bg-[#FF5722] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                        <Image
                            // src={RoviLogo}
                            src="/images/contents/rovi-logo.png"
                            alt="Rovify Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <span className="ml-2 text-[#FF5722] text-xl font-bold">rovify</span>
                </Link>

                {/* Get Started Button */}
                <Link
                    href="/auth/register"
                    className="bg-[#FF5722] hover:bg-[#E64A19] text-white px-6 py-2.5 rounded-full text-sm font-medium flex items-center transition-colors duration-300"
                >
                    Get Started
                    <FiArrowRight className="ml-2" />
                </Link>
            </div>
        </header>
    );
}