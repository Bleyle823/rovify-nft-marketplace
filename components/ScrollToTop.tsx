// components/ScrollToTop.tsx
'use client';

import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { useUI } from '@/context/UIContext';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const { isBottomNavVisible } = useUI();

    // Show button when page is scrolled
    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.pageYOffset > 500);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed right-5 rounded-full bg-white shadow-lg p-3 text-[#FF5722] z-30 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } ${isBottomNavVisible ? 'bottom-24' : 'bottom-5'}`}
            aria-label="Scroll to top"
        >
            <FiArrowUp className="w-5 h-5" />
        </button>
    );
}