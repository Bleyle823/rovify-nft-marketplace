/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCalendar, FiTag, FiUser, FiCheck, FiChevronRight, FiShare2 } from 'react-icons/fi';
import BottomNavigation from '@/components/SideNavigation';

type SuccessType = 'event' | 'ticket' | 'profile' | 'general';

interface SuccessPageProps {
    type: SuccessType;
}

export default function SuccessPage({ type = 'general' }: SuccessPageProps) {
    const [animationStep, setAnimationStep] = useState(0);
    const confettiRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timers = [
            setTimeout(() => setAnimationStep(1), 100),  // Circle appears
            setTimeout(() => setAnimationStep(2), 600),  // Icon appears
            setTimeout(() => setAnimationStep(3), 1000), // Checkmark appears
            setTimeout(() => setAnimationStep(4), 1300), // Title and message appear
            setTimeout(() => setAnimationStep(5), 1600)  // Buttons appear
        ];

        return () => timers.forEach(timer => clearTimeout(timer));
    }, []);

    const createConfettiEffect = useCallback(() => {
        if (!confettiRef.current) return;

        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');

            const size = Math.random() * 8 + 4;
            const left = Math.random() * 100;
            const isSquare = Math.random() > 0.6;

            let color;
            if (type === 'event') {
                color = i % 3 === 0 ? '#FF5722' : i % 3 === 1 ? '#FF8A65' : '#FFCCBC';
            } else if (type === 'ticket') {
                color = i % 3 === 0 ? '#FF5722' : i % 3 === 1 ? '#FFB74D' : '#FFF3E0';
            } else if (type === 'profile') {
                color = i % 3 === 0 ? '#FF5722' : i % 3 === 1 ? '#F06292' : '#FCE4EC';
            } else {
                color = i % 3 === 0 ? '#FF5722' : i % 3 === 1 ? '#4CAF50' : '#E8F5E9';
            }

            Object.assign(particle.style, {
                position: 'absolute',
                top: 0,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                borderRadius: isSquare ? '2px' : '50%',
                opacity: Math.random() * 0.8 + 0.2,
                zIndex: 10,
                transform: 'scale(0)',
                transformOrigin: 'center center'
            });

            confettiRef.current.appendChild(particle);

            setTimeout(() => {
                // Random x-axis movement
                const xMovement = (Math.random() - 0.5) * 200;

                // Create and apply animation
                Object.assign(particle.style, {
                    animation: `confettiDrop 2s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                    transform: `translateX(${xMovement}px) rotate(${Math.random() * 360}deg) scale(1)`
                });

                // Remove particle after animation
                setTimeout(() => {
                    if (confettiRef.current?.contains(particle)) {
                        confettiRef.current.removeChild(particle);
                    }
                }, 2000);
            }, Math.random() * 300);
        }
    }, [type]);

    // Effect for confetti
    useEffect(() => {
        if (animationStep >= 3 && confettiRef.current) {
            createConfettiEffect();
        }
    }, [animationStep, createConfettiEffect]);

    const getContent = () => {
        switch (type) {
            case 'event':
                return {
                    title: 'Event Created Successfully!',
                    message: 'Your event has been published and is now live. Share it with your audience to start selling tickets.',
                    icon: FiCalendar,
                    primaryAction: {
                        text: 'View Event',
                        link: '/discover'
                    },
                    secondaryAction: {
                        text: 'Create Another Event',
                        link: '/create'
                    },
                    extraAction: {
                        text: 'Share Event',
                        icon: FiShare2
                    }
                };
            case 'ticket':
                return {
                    title: 'Ticket Purchased!',
                    message: 'Your ticket has been added to your wallet. View and manage it from your tickets page.',
                    icon: FiTag,
                    primaryAction: {
                        text: 'View Ticket',
                        link: '/tickets'
                    },
                    secondaryAction: {
                        text: 'Browse More Events',
                        link: '/discover'
                    }
                };
            case 'profile':
                return {
                    title: 'Profile Updated!',
                    message: 'Your profile information has been successfully updated.',
                    icon: FiUser,
                    primaryAction: {
                        text: 'View Profile',
                        link: '/profile'
                    },
                    secondaryAction: {
                        text: 'Back to Home',
                        link: '/home'
                    }
                };
            default:
                return {
                    title: 'Success!',
                    message: 'Your action has been completed successfully.',
                    icon: FiCheck,
                    primaryAction: {
                        text: 'Back to Home',
                        link: '/home'
                    },
                    secondaryAction: {
                        text: 'My Account',
                        link: '/profile'
                    }
                };
        }
    };

    const content = getContent();
    const IconComponent = content.icon;

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Animated background bubbles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={`bubble-${i}`}
                        className="absolute rounded-full"
                        style={{
                            width: `${Math.random() * 120 + 80}px`,
                            height: `${Math.random() * 120 + 80}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            background: `radial-gradient(circle at center, rgba(255,87,34,0.1) 0%, rgba(255,87,34,0) 70%)`,
                            animation: `float ${Math.random() * 10 + 15}s infinite ease-in-out, fadeIn 0.8s ease-out forwards`,
                            opacity: 0
                        }}
                    ></div>
                ))}
            </div>

            {/* Confetti container */}
            <div ref={confettiRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0"></div>

            <motion.div
                className="max-w-md w-full rounded-2xl overflow-hidden bg-white shadow-lg relative z-10"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="p-8 flex flex-col items-center text-center">
                    {/* Success icon animation */}
                    <div className="mb-10 mt-4 relative flex items-center justify-center h-32 w-32">
                        {/* Outer circle with animation */}
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{
                                scale: animationStep >= 1 ? 1 : 0.7,
                                opacity: animationStep >= 1 ? 1 : 0
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    stroke="#FF5722"
                                    strokeWidth="5"
                                    strokeDasharray="380"
                                    strokeDashoffset={animationStep >= 1 ? "0" : "380"}
                                    style={{
                                        transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)"
                                    }}
                                />
                            </svg>
                        </motion.div>

                        {/* White circle background */}
                        <motion.div
                            className="h-24 w-24 bg-white rounded-full shadow-md flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: animationStep >= 1 ? 1 : 0 }}
                            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                        >
                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: animationStep >= 2 ? 1 : 0,
                                    opacity: animationStep >= 2 ? 1 : 0
                                }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                            >
                                <IconComponent className="h-12 w-12 text-[#FF5722]" />
                            </motion.div>
                        </motion.div>

                        {/* Checkmark badge */}
                        <motion.div
                            className="absolute -right-2 -bottom-2 bg-[#FF5722] rounded-full p-2 shadow-lg"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: animationStep >= 3 ? 1 : 0,
                                opacity: animationStep >= 3 ? 1 : 0
                            }}
                            transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
                        >
                            <FiCheck className="h-5 w-5 text-white" />
                        </motion.div>

                        {/* Pulse effect */}
                        {animationStep >= 3 && (
                            <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#FF5722]"></div>
                        )}
                    </div>

                    {/* Content with staggered animation */}
                    <motion.div
                        className="space-y-4 mb-8 w-full"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: animationStep >= 4 ? 1 : 0,
                            y: animationStep >= 4 ? 0 : 10
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-2xl font-bold text-gray-800 text-gradient-orange">{content.title}</h1>
                        <p className="text-gray-600 px-4">{content.message}</p>
                    </motion.div>

                    {/* Buttons with staggered animation */}
                    <motion.div
                        className="w-full space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: animationStep >= 5 ? 1 : 0,
                            y: animationStep >= 5 ? 0 : 20
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href={content.primaryAction.link} className="block">
                            <button className="w-full py-4 bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:ring-opacity-50 flex items-center justify-center gap-2 group">
                                {content.primaryAction.text}
                                <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>

                        <Link href={content.secondaryAction.link} className="block">
                            <button className="w-full py-4 bg-white text-[#333] border border-gray-200 rounded-xl font-medium shadow-sm hover:shadow transition-all focus:outline-none flex items-center justify-center hover:bg-gray-50">
                                {content.secondaryAction.text}
                            </button>
                        </Link>

                        {content.extraAction && (
                            <div className="pt-2 flex justify-center">
                                <button className="text-[#FF5722] py-2 px-4 hover:bg-[#FF5722]/5 rounded-lg flex items-center gap-2 transition-colors">
                                    <content.extraAction.icon className="w-4 h-4" />
                                    {content.extraAction.text}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {/* <div className="fixed bottom-5 w-full z-20">
                <BottomNavigation />
            </div> */}

            <style jsx global>{`
                @keyframes confettiDrop {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0) scale(0);
                    }
                    10% {
                        transform: translateY(-20px) translateX(var(--tx, 0)) rotate(45deg) scale(1);
                    }
                    100% {
                        transform: translateY(calc(100vh - 150px)) translateX(var(--tx, 0)) rotate(720deg) scale(0.5);
                        opacity: 0;
                    }
                }
                
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(var(--tx, 15px), var(--ty, -15px)); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .text-gradient-orange {
                    background: linear-gradient(90deg, #FF5722, #FF7043);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            `}</style>
        </div>
    );
}