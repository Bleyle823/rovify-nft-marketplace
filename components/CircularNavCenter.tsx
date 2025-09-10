/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiCompass, FiPlus, FiUser } from 'react-icons/fi';
import { BsCameraVideoFill, BsController } from "react-icons/bs";
import { MdOutlineAddBox } from "react-icons/md";
import { AiOutlineShop } from "react-icons/ai";
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// Enhanced interfaces
interface NavigationItem {
    href: string;
    icon: React.ReactNode;
    label: string;
    color: string;
    position: { angle: number; radius: number };
}

interface OrbitalNavigationProps {
    isOrganiser?: boolean;
    className?: string;
}

// Physics and animation constants
const PHYSICS_CONFIG = {
    ORBIT_RADIUS: 80,
    EXPANDED_RADIUS: 120,
    HUB_SIZE: 64,
    ORB_SIZE: 48,
    ANIMATION_SPRING: { type: "spring", stiffness: 300, damping: 25 },
    HOVER_SCALE: 1.2,
    MAGNETIC_FORCE: 0.3,
} as const;

export default function OrbitalNavigation({ isOrganiser = false, className = '' }: OrbitalNavigationProps) {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const hubRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Navigation items with unique positioning and colors
    const navigationItems: NavigationItem[] = useMemo(() => [
        {
            href: '/home',
            icon: <FiHome />,
            label: 'Home',
            color: '#FF6B6B',
            position: { angle: 0, radius: PHYSICS_CONFIG.ORBIT_RADIUS }
        },
        {
            href: '/feed',
            icon: <MdOutlineAddBox />,
            label: 'Feed',
            color: '#4ECDC4',
            position: { angle: 60, radius: PHYSICS_CONFIG.ORBIT_RADIUS }
        },
        {
            href: '/stream',
            icon: <BsCameraVideoFill />,
            label: 'Live',
            color: '#45B7D1',
            position: { angle: 120, radius: PHYSICS_CONFIG.ORBIT_RADIUS }
        },
        {
            href: '/gaming',
            icon: <BsController />,
            label: 'Gaming',
            color: '#96CEB4',
            position: { angle: 180, radius: PHYSICS_CONFIG.ORBIT_RADIUS }
        },
        {
            href: '/marketplace',
            icon: <AiOutlineShop />,
            label: 'Marketplace',
            color: '#FFEAA7',
            position: { angle: 240, radius: PHYSICS_CONFIG.ORBIT_RADIUS }
        },
        {
            href: '/profile',
            icon: <FiUser />,
            label: 'Profile',
            color: '#DDA0DD',
            position: { angle: 300, radius: PHYSICS_CONFIG.ORBIT_RADIUS }
        }
    ], []);

    const isActiveRoute = useCallback((href: string): boolean => {
        if (href === '/home') {
            return pathname === '/home' || pathname === '/';
        }
        return pathname.startsWith(href);
    }, [pathname]);

    // Mouse tracking for magnetic effects
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                setMousePosition({
                    x: e.clientX - centerX,
                    y: e.clientY - centerY
                });
            }
        };

        if (isExpanded) {
            document.addEventListener('mousemove', handleMouseMove);
            return () => document.removeEventListener('mousemove', handleMouseMove);
        }
    }, [isExpanded]);

    // Calculate dynamic positions based on mouse proximity
    const calculateDynamicPosition = useCallback((item: NavigationItem) => {
        const baseAngle = (item.position.angle * Math.PI) / 180;
        const radius = isExpanded ? PHYSICS_CONFIG.EXPANDED_RADIUS : PHYSICS_CONFIG.ORBIT_RADIUS;

        let x = Math.cos(baseAngle) * radius;
        let y = Math.sin(baseAngle) * radius;

        // Apply magnetic effect when expanded
        if (isExpanded && hoveredItem === item.href) {
            const distance = Math.sqrt(mousePosition.x ** 2 + mousePosition.y ** 2);
            if (distance < 150) {
                const magneticForce = (150 - distance) / 150 * PHYSICS_CONFIG.MAGNETIC_FORCE;
                x += (mousePosition.x * magneticForce) * 0.3;
                y += (mousePosition.y * magneticForce) * 0.3;
            }
        }

        return { x, y };
    }, [isExpanded, hoveredItem, mousePosition]);

    // Hide on specific routes
    const shouldHideNavigation = useMemo(() => {
        const hiddenPaths = ['/checkout', '/payment', '/live-event', '/onboarding'];
        return hiddenPaths.some(path => pathname.includes(path));
    }, [pathname]);

    if (shouldHideNavigation) {
        return null;
    }

    return (
        <>
            {/* Desktop Orbital Navigation */}
            <div
                ref={containerRef}
                className={`
          fixed left-20 top-1/2 -translate-y-1/2 z-50 
          hidden md:block pointer-events-none
          ${className}
        `}
                style={{ width: '300px', height: '300px' }}
            >
                {/* Central Hub */}
                <motion.div
                    ref={hubRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
                    onHoverStart={() => setIsExpanded(true)}
                    onHoverEnd={() => setIsExpanded(false)}
                    whileHover={{ scale: 1.1 }}
                    animate={{
                        scale: isExpanded ? 1.2 : 1,
                        rotate: isExpanded ? 360 : 0,
                    }}
                    transition={{
                        scale: PHYSICS_CONFIG.ANIMATION_SPRING,
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                    }}
                >
                    {/* Hub Background with Dynamic Gradient */}
                    <div
                        className="relative rounded-full backdrop-blur-xl shadow-2xl overflow-hidden"
                        style={{
                            width: PHYSICS_CONFIG.HUB_SIZE,
                            height: PHYSICS_CONFIG.HUB_SIZE,
                            background: `conic-gradient(from ${isExpanded ? '0deg' : '180deg'}, 
                #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD, #FF6B6B)`
                        }}
                    >
                        {/* Animated rings */}
                        <motion.div
                            className="absolute inset-2 rounded-full border-2 border-white/30"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute inset-4 rounded-full border border-white/20"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Center logo/icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                className="text-white font-bold text-lg"
                                animate={{
                                    scale: isExpanded ? [1, 1.2, 1] : 1,
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                R
                            </motion.div>
                        </div>
                    </div>

                    {/* Pulsing rings when expanded */}
                    <AnimatePresence>
                        {isExpanded && (
                            <>
                                <motion.div
                                    initial={{ scale: 0, opacity: 0.8 }}
                                    animate={{ scale: 2, opacity: 0 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute inset-0 rounded-full border-2 border-white/30"
                                />
                                <motion.div
                                    initial={{ scale: 0, opacity: 0.6 }}
                                    animate={{ scale: 3, opacity: 0 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                    className="absolute inset-0 rounded-full border border-white/20"
                                />
                            </>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Orbital Navigation Items */}
                <AnimatePresence>
                    {isExpanded && navigationItems.map((item, index) => {
                        const { x, y } = calculateDynamicPosition(item);
                        const isActive = isActiveRoute(item.href);

                        return (
                            <motion.div
                                key={item.href}
                                className="absolute pointer-events-auto"
                                initial={{
                                    x: 0,
                                    y: 0,
                                    scale: 0,
                                    opacity: 0,
                                    left: '50%',
                                    top: '50%',
                                    translateX: '-50%',
                                    translateY: '-50%'
                                }}
                                animate={{
                                    x,
                                    y,
                                    scale: 1,
                                    opacity: 1,
                                    left: '50%',
                                    top: '50%',
                                    translateX: '-50%',
                                    translateY: '-50%'
                                }}
                                exit={{
                                    x: 0,
                                    y: 0,
                                    scale: 0,
                                    opacity: 0
                                }}
                                transition={{
                                    ...PHYSICS_CONFIG.ANIMATION_SPRING,
                                    delay: index * 0.1
                                }}
                                onHoverStart={() => setHoveredItem(item.href)}
                                onHoverEnd={() => setHoveredItem(null)}
                            >
                                <Link href={item.href}>
                                    <motion.div
                                        className="relative group cursor-pointer"
                                        whileHover={{
                                            scale: PHYSICS_CONFIG.HOVER_SCALE,
                                            zIndex: 10
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {/* Orb Container */}
                                        <div
                                            className="rounded-full backdrop-blur-xl shadow-xl border-2 border-white/20 flex items-center justify-center relative overflow-hidden"
                                            style={{
                                                width: PHYSICS_CONFIG.ORB_SIZE,
                                                height: PHYSICS_CONFIG.ORB_SIZE,
                                                background: `linear-gradient(135deg, ${item.color}40, ${item.color}80)`,
                                                borderColor: isActive ? item.color : 'rgba(255,255,255,0.2)'
                                            }}
                                        >
                                            {/* Active indicator */}
                                            {isActive && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-full"
                                                    style={{ backgroundColor: `${item.color}20` }}
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        opacity: [0.3, 0.6, 0.3]
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            )}

                                            {/* Icon */}
                                            <div
                                                className="relative z-10 w-6 h-6"
                                                style={{ color: isActive ? item.color : 'white' }}
                                            >
                                                {item.icon}
                                            </div>

                                            {/* Hover glow */}
                                            <motion.div
                                                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                                                style={{
                                                    background: `radial-gradient(circle, ${item.color}40, transparent 70%)`
                                                }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>

                                        {/* Floating Label */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                                        >
                                            <div
                                                className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border border-white/20 shadow-lg"
                                                style={{
                                                    background: `linear-gradient(135deg, ${item.color}20, ${item.color}40)`,
                                                    color: 'white'
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                        </motion.div>

                                        {/* Connection Line to Hub */}
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 origin-left h-px bg-gradient-to-r from-white/30 to-transparent"
                                            style={{
                                                width: isExpanded ? PHYSICS_CONFIG.EXPANDED_RADIUS : PHYSICS_CONFIG.ORBIT_RADIUS,
                                                transform: `translate(-50%, -50%) rotate(${item.position.angle}deg)`
                                            }}
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: index * 0.1 + 0.3 }}
                                        />
                                    </motion.div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Create Button for Organisers */}
                {isOrganiser && (
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                className="absolute pointer-events-auto"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)'
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    y: -PHYSICS_CONFIG.EXPANDED_RADIUS - 40
                                }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ delay: 0.6, ...PHYSICS_CONFIG.ANIMATION_SPRING }}
                            >
                                <CreateOrbButton />
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {/* Mobile Navigation - Simplified floating dock */}
            <motion.div
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={PHYSICS_CONFIG.ANIMATION_SPRING}
            >
                <div className="flex items-center gap-2 px-4 py-3 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl">
                    {navigationItems.slice(0, 5).map((item, index) => {
                        const isActive = isActiveRoute(item.href);
                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    className="w-12 h-12 rounded-full flex items-center justify-center relative"
                                    style={{
                                        background: isActive
                                            ? `linear-gradient(135deg, ${item.color}60, ${item.color}80)`
                                            : 'rgba(255,255,255,0.1)'
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <div
                                        className="w-5 h-5"
                                        style={{ color: isActive ? 'white' : item.color }}
                                    >
                                        {item.icon}
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}

                    {isOrganiser && (
                        <Link href="/create">
                            <motion.div
                                className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF7A50] flex items-center justify-center ml-2"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiPlus className="w-5 h-5 text-white" />
                            </motion.div>
                        </Link>
                    )}
                </div>
            </motion.div>
        </>
    );
}

// Special Create Button for orbital navigation
function CreateOrbButton() {
    return (
        <Link href="/create">
            <motion.div
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
            >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF7A50] flex items-center justify-center shadow-2xl border-2 border-white/30 relative overflow-hidden">
                    {/* Animated background */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Icon */}
                    <FiPlus className="w-8 h-8 text-white relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                </div>

                {/* Label */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                    <div className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-[#FF5722]/20 border border-[#FF5722]/30 text-white shadow-lg">
                        Create Event
                    </div>
                </motion.div>
            </motion.div>
        </Link>
    );
}