/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiCompass, FiPlus, FiUser } from 'react-icons/fi';
import { IoTicket } from "react-icons/io5";
import { BsCameraVideoFill, BsController } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineNotifications } from "react-icons/md";
import { AiOutlineShop } from "react-icons/ai";
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationItem {
    href: string;
    icon: React.ReactNode;
    label: string;
}

interface SideNavigationProps {
    isOrganiser?: boolean;
    className?: string;
}

export default function SideNavigation({ isOrganiser = false, className = '' }: SideNavigationProps) {
    const pathname = usePathname();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const navigationItems: NavigationItem[] = useMemo(() => [
        { href: '/home', icon: <FiHome />, label: 'Home' },
        { href: '/feed', icon: <MdOutlineAddBox />, label: 'Feed' },
        { href: '/stream', icon: <BsCameraVideoFill />, label: 'Live' },
        { href: '/gaming', icon: <BsController />, label: 'Gaming' },
        { href: '/marketplace', icon: <AiOutlineShop />, label: 'Shop' },
        { href: '/user-dashboard', icon: <FiUser />, label: 'Profile' }
    ], []);

    const isActiveRoute = useCallback((href: string): boolean => {
        if (href === '/home') return pathname === '/home' || pathname === '/';
        return pathname.startsWith(href);
    }, [pathname]);

    const shouldHideNavigation = useMemo(() => {
        const hiddenPaths = ['/checkout', '/payment', '/live-event', '/onboarding'];
        return hiddenPaths.some(path => pathname.includes(path));
    }, [pathname]);

    if (shouldHideNavigation) return null;

    return (
        <>
            {/* Desktop Modern Dock */}
            <motion.nav
                className={`fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:block ${className}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                {/* Clean Container */}
                <div className="
          relative bg-white/95 backdrop-blur-md
          border border-gray-200/80 rounded-2xl
          shadow-lg shadow-gray-900/5
          p-3 w-16
        ">
                    {/* Navigation Items */}
                    <div className="flex flex-col space-y-2">
                        {navigationItems.map((item, index) => (
                            <ModernNavItem
                                key={item.href}
                                item={item}
                                index={index}
                                isActive={isActiveRoute(item.href)}
                                hoveredIndex={hoveredIndex}
                                setHoveredIndex={setHoveredIndex}
                            />
                        ))}

                        {/* Create Button */}
                        {isOrganiser && (
                            <div className="mt-3 pt-3 border-t border-gray-200/60">
                                <ModernCreateButton />
                            </div>
                        )}
                    </div>

                    {/* Active Indicator */}
                    <AnimatePresence>
                        {navigationItems.some(item => isActiveRoute(item.href)) && (
                            <motion.div
                                layoutId="activeIndicator"
                                className="absolute left-0 w-0.5 bg-orange-500 rounded-r"
                                style={{
                                    height: 32,
                                    top: (() => {
                                        const activeIndex = navigationItems.findIndex(item => isActiveRoute(item.href));
                                        const containerPadding = 12; // p-3
                                        const itemHeight = 40; // h-10
                                        const itemSpacing = 8; // space-y-2
                                        const itemCenter = itemHeight / 2; // Center the line on the item

                                        return containerPadding + (activeIndex * (itemHeight + itemSpacing)) + itemCenter - 16;
                                    })(),
                                }}
                                initial={{ opacity: 0, scaleY: 0 }}
                                animate={{ opacity: 1, scaleY: 1 }}
                                exit={{ opacity: 0, scaleY: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </motion.nav>

            {/* Mobile Modern Dock */}
            <ModernMobileDock
                navigationItems={navigationItems}
                isActiveRoute={isActiveRoute}
                isOrganiser={isOrganiser}
            />
        </>
    );
}

// Modern Navigation Item
interface ModernNavItemProps {
    item: NavigationItem;
    index: number;
    isActive: boolean;
    hoveredIndex: number | null;
    setHoveredIndex: (index: number | null) => void;
}

function ModernNavItem({
    item,
    index,
    isActive,
    hoveredIndex,
    setHoveredIndex
}: ModernNavItemProps) {
    const isHovered = hoveredIndex === index;

    return (
        <motion.div
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
        >
            <Link
                href={item.href}
                className="
          relative flex items-center justify-center
          w-10 h-10 rounded-xl
          transition-all duration-200 ease-out
          group
        "
                aria-label={item.label}
            >
                {/* Background */}
                <motion.div
                    className="absolute inset-0 rounded-xl"
                    animate={{
                        backgroundColor: isActive
                            ? 'rgb(249 115 22 / 0.1)'
                            : isHovered
                                ? 'rgb(156 163 175 / 0.08)'
                                : 'transparent'
                    }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                />

                {/* Icon */}
                <motion.div
                    className="relative z-10 w-5 h-5"
                    animate={{
                        color: isActive ? '#f97316' : isHovered ? '#374151' : '#6b7280',
                        scale: isHovered ? 1.05 : 1
                    }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                >
                    {item.icon}
                </motion.div>

                {/* Modern Tooltip */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: -8, scale: 0.96 }}
                            animate={{ opacity: 1, x: 8, scale: 1 }}
                            exit={{ opacity: 0, x: -8, scale: 0.96 }}
                            className="
                absolute left-full top-1/2 -translate-y-1/2 ml-3
                px-3 py-2 rounded-lg
                bg-gray-900 text-white text-sm font-medium
                whitespace-nowrap pointer-events-none z-50
                shadow-xl
              "
                            transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {item.label}

                            {/* Arrow */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 bg-gray-900" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Link>
        </motion.div>
    );
}

function ModernCreateButton() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileTap={{ scale: 0.95 }}
        >
            <Link
                href="/create"
                className="
          relative flex items-center justify-center
          w-10 h-10 rounded-xl
          bg-orange-500 hover:bg-orange-600
          transition-colors duration-200 ease-out
          group
        "
                aria-label="Create new event"
            >
                {/* Icon */}
                <motion.div
                    animate={{ rotate: isHovered ? 90 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    <FiPlus className="w-5 h-5 text-white" />
                </motion.div>

                {/* Modern Tooltip */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: -8, scale: 0.96 }}
                            animate={{ opacity: 1, x: 8, scale: 1 }}
                            exit={{ opacity: 0, x: -8, scale: 0.96 }}
                            className="
                absolute left-full top-1/2 -translate-y-1/2 ml-3
                px-3 py-2 rounded-lg
                bg-gray-900 text-white text-sm font-medium
                whitespace-nowrap pointer-events-none z-50
                shadow-xl
              "
                            transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            Create Event

                            {/* Arrow */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 bg-gray-900" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Link>
        </motion.div>
    );
}

function ModernMobileDock({
    navigationItems,
    isActiveRoute,
    isOrganiser
}: {
    navigationItems: NavigationItem[];
    isActiveRoute: (href: string) => boolean;
    isOrganiser: boolean;
}) {
    const [pressedIndex, setPressedIndex] = useState<number | null>(null);

    const displayItems = navigationItems.slice(0, isOrganiser ? 4 : 5);

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
            {/* Background Blur Area */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" />

            {/* Main Navigation Container */}
            <div className="relative">
                {/* Premium Container with Clean Design */}
                <motion.div
                    className="
            relative mx-4 mb-4 mt-2
            bg-white/95 backdrop-blur-xl
            border border-gray-200/60 rounded-[28px]
            shadow-xl shadow-gray-900/8
            overflow-hidden
          "
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                >
                    {/* Navigation Items Container */}
                    <div className="flex items-stretch px-2 py-2">
                        {displayItems.map((item, index) => (
                            <MobileProfessionalNavItem
                                key={item.href}
                                item={item}
                                index={index}
                                isActive={isActiveRoute(item.href)}
                                pressedIndex={pressedIndex}
                                setPressedIndex={setPressedIndex}
                            />
                        ))}

                        {/* Professional Mobile Create Button */}
                        {isOrganiser && (
                            <MobileProfessionalCreateButton
                                pressedIndex={pressedIndex}
                                setPressedIndex={setPressedIndex}
                            />
                        )}
                    </div>

                    {/* Subtle Bottom Accent */}
                    <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-gray-200/40 to-transparent" />
                </motion.div>

                {/* iOS Safe Area with Gradient */}
                <div className="h-safe-area-inset-bottom bg-gradient-to-t from-white via-white/95 to-transparent" />
            </div>
        </div>
    );
}

interface MobileProfessionalNavItemProps {
    item: NavigationItem;
    index: number;
    isActive: boolean;
    pressedIndex: number | null;
    setPressedIndex: (index: number | null) => void;
}

function MobileProfessionalNavItem({
    item,
    index,
    isActive,
    pressedIndex,
    setPressedIndex
}: MobileProfessionalNavItemProps) {
    const isPressed = pressedIndex === index;

    return (
        <Link
            href={item.href}
            className="flex-1 relative"
            onTouchStart={() => setPressedIndex(index)}
            onTouchEnd={() => setPressedIndex(null)}
            onTouchCancel={() => setPressedIndex(null)}
        >
            <motion.div
                className="
          relative flex flex-col items-center justify-center
          h-[4.5rem] px-3 rounded-[20px]
          cursor-pointer select-none
        "
                animate={{
                    scale: isPressed ? 0.95 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.5
                }}
            >
                {/* iOS-style Dot Indicator */}
                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute top-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full"
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                                duration: 0.3
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Icon Container */}
                <motion.div
                    className="relative mt-1"
                    animate={{
                        y: isActive ? -1 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <motion.div
                        className="w-7 h-7 flex items-center justify-center text-2xl"
                        animate={{
                            color: isActive ? '#f97316' : '#9ca3af',
                            scale: isActive ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {item.icon}
                    </motion.div>

                    {/* Subtle glow for active state */}
                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.2, scale: 1.3 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-0 bg-orange-400 rounded-full blur-md"
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Label */}
                <motion.span
                    className="
            text-xs mt-1
            whitespace-nowrap overflow-hidden text-ellipsis
            max-w-full
          "
                    animate={{
                        color: isActive ? '#f97316' : '#9ca3af',
                        fontWeight: isActive ? 600 : 400,
                        fontSize: isActive ? '0.75rem' : '0.7rem',
                    }}
                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {item.label}
                </motion.span>

                {/* Touch Feedback Ripple */}
                <AnimatePresence>
                    {isPressed && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0.3 }}
                            animate={{ scale: 2.2, opacity: 0 }}
                            exit={{ scale: 2.2, opacity: 0 }}
                            className="absolute inset-0 bg-orange-200 rounded-[20px]"
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </Link>
    );
}

interface MobileProfessionalCreateButtonProps {
    pressedIndex: number | null;
    setPressedIndex: (index: number | null) => void;
}

function MobileProfessionalCreateButton({
    pressedIndex,
    setPressedIndex
}: MobileProfessionalCreateButtonProps) {
    const isPressed = pressedIndex === -1;

    return (
        <Link
            href="/create"
            className="flex-1 relative"
            onTouchStart={() => setPressedIndex(-1)}
            onTouchEnd={() => setPressedIndex(null)}
            onTouchCancel={() => setPressedIndex(null)}
        >
            <motion.div
                className="
          relative flex flex-col items-center justify-center
          h-[4.5rem] px-3 rounded-[20px]
          bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600
          cursor-pointer select-none overflow-hidden
        "
                animate={{
                    scale: isPressed ? 0.95 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.5
                }}
                style={{
                    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.25), 0 2px 8px rgba(249, 115, 22, 0.15)'
                }}
            >
                {/* Create indicator dot (always visible for create button) */}
                <div className="absolute top-0.5 w-1.5 h-1.5 bg-white/90 rounded-full" />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-white/10" />

                {/* Plus Icon */}
                <motion.div
                    className="relative z-10 mb-1 mt-1"
                    animate={{
                        rotate: isPressed ? 90 : 0,
                        scale: isPressed ? 0.95 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <FiPlus className="w-6 h-6 text-white drop-shadow-sm" />
                </motion.div>

                {/* Create Label */}
                <motion.span
                    className="text-xs font-semibold text-white/95 relative z-10"
                    animate={{
                        opacity: isPressed ? 0.8 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                >
                    Create
                </motion.span>

                {/* Subtle Shimmer Effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                    animate={{
                        x: ['-100%', '200%']
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 4,
                        ease: "easeInOut"
                    }}
                />

                {/* Press Ripple */}
                <AnimatePresence>
                    {isPressed && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0.4 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            exit={{ scale: 2.5, opacity: 0 }}
                            className="absolute inset-0 bg-white rounded-[20px]"
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </Link>
    );
}

// Premium Mobile Navigation Item
interface MobilePremiumNavItemProps {
    item: NavigationItem;
    index: number;
    isActive: boolean;
    pressedIndex: number | null;
    setPressedIndex: (index: number | null) => void;
    setActiveIndex: (index: number) => void;
}

function MobilePremiumNavItem({
    item,
    index,
    isActive,
    pressedIndex,
    setPressedIndex,
    setActiveIndex
}: MobilePremiumNavItemProps) {
    const isPressed = pressedIndex === index;

    return (
        <Link
            href={item.href}
            className="flex-1 relative"
            onTouchStart={() => {
                setPressedIndex(index);
                setActiveIndex(index);
            }}
            onTouchEnd={() => setPressedIndex(null)}
            onTouchCancel={() => setPressedIndex(null)}
        >
            <motion.div
                className="
          relative flex flex-col items-center justify-center
          h-12 px-3 rounded-[20px]
          cursor-pointer select-none
        "
                animate={{
                    scale: isPressed ? 0.92 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.5
                }}
            >
                {/* Icon Container */}
                <motion.div
                    className="relative"
                    animate={{
                        y: isActive ? -2 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <motion.div
                        className="w-7 h-7 flex items-center justify-center"
                        animate={{
                            color: isActive ? '#f97316' : '#6b7280',
                            scale: isActive ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {item.icon}
                    </motion.div>

                    {/* Active Glow Effect */}
                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.4, scale: 1.2 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-0 bg-orange-400 rounded-full blur-md"
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Dynamic Label */}
                <motion.span
                    className="
            text-xs font-medium mt-0.5
            whitespace-nowrap overflow-hidden text-ellipsis
            max-w-full
          "
                    animate={{
                        color: isActive ? '#f97316' : '#9ca3af',
                        opacity: isActive ? 1 : 0.75,
                        y: isActive ? 1 : 0,
                        fontSize: isActive ? '0.75rem' : '0.7rem',
                        fontWeight: isActive ? 600 : 500,
                    }}
                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {item.label}
                </motion.span>

                {/* Ripple Effect for Touch */}
                <AnimatePresence>
                    {isPressed && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0.3 }}
                            animate={{ scale: 2, opacity: 0 }}
                            exit={{ scale: 2, opacity: 0 }}
                            className="absolute inset-0 bg-orange-200 rounded-[20px]"
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </Link>
    );
}

// Premium Mobile Create Button
interface MobilePremiumCreateButtonProps {
    pressedIndex: number | null;
    setPressedIndex: (index: number | null) => void;
}

function MobilePremiumCreateButton({
    pressedIndex,
    setPressedIndex
}: MobilePremiumCreateButtonProps) {
    const isPressed = pressedIndex === -1; // Use -1 for create button

    return (
        <Link
            href="/create"
            className="flex-1 relative"
            onTouchStart={() => setPressedIndex(-1)}
            onTouchEnd={() => setPressedIndex(null)}
            onTouchCancel={() => setPressedIndex(null)}
        >
            <motion.div
                className="
          relative flex flex-col items-center justify-center
          h-12 px-3 rounded-[20px]
          bg-gradient-to-br from-orange-500 via-orange-500 to-red-500
          cursor-pointer select-none overflow-hidden
        "
                animate={{
                    scale: isPressed ? 0.92 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.5
                }}
                style={{
                    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.25), 0 2px 8px rgba(249, 115, 22, 0.15)'
                }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />

                {/* Plus Icon */}
                <motion.div
                    className="relative z-10"
                    animate={{
                        rotate: isPressed ? 45 : 0,
                        scale: isPressed ? 0.9 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <FiPlus className="w-6 h-6 text-white drop-shadow-sm" />
                </motion.div>

                {/* Create Label */}
                <motion.span
                    className="text-xs font-semibold text-white/95 mt-0.5 relative z-10"
                    animate={{
                        opacity: isPressed ? 0.8 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                >
                    Create
                </motion.span>

                {/* Shimmer Effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{
                        x: ['-100%', '200%']
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut"
                    }}
                />

                {/* Press Ripple */}
                <AnimatePresence>
                    {isPressed && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0.4 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            exit={{ scale: 2.5, opacity: 0 }}
                            className="absolute inset-0 bg-white rounded-[20px]"
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </Link>
    );
}