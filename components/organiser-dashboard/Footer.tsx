'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiHeart, FiGithub, FiTwitter, FiMail } from 'react-icons/fi';

interface FooterProps {
    sidebarCollapsed?: boolean;
    isMobile?: boolean;
}

export default function Footer({ sidebarCollapsed = false, isMobile = false }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const getPositionClasses = () => {
        if (isMobile) {
            return 'left-0 right-0';
        }
        return sidebarCollapsed ? 'left-16 right-0' : 'left-64 right-0';
    };

    const socialLinks = [
        { icon: <FiTwitter className="w-4 h-4" />, href: '#', label: 'Twitter' },
        { icon: <FiGithub className="w-4 h-4" />, href: '#', label: 'GitHub' },
        { icon: <FiMail className="w-4 h-4" />, href: '#', label: 'Email' }
    ];

    return (
        <footer className={`
      fixed bottom-0 ${getPositionClasses()}
      h-14 bg-white/90 backdrop-blur-sm
      border-t border-gray-200/60
      shadow-sm
      z-20 transition-all duration-300 ease-in-out
      flex items-center
    `}>
            <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
                <div className="flex justify-between items-center">

                    <motion.div
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="relative w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/25">
                            <Image
                                src="/images/contents/rovi-logo.png"
                                alt="Rovify Logo"
                                width={16}
                                height={16}
                                className="object-contain"
                                onError={(e) => {
                                    // Fallback if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                        parent.innerHTML = '<span class="text-white font-bold text-xs">R</span>';
                                    }
                                }}
                            />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-sm font-semibold text-gray-900">Rovify</span>
                            <div className="text-xs text-gray-500">Event Organiser</div>
                        </div>
                    </motion.div>

                    <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
                        <span>© {currentYear} Rovify. Made with</span>
                        <FiHeart className="w-3 h-3 text-red-500 fill-current" />
                        <span>for amazing events</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Status indicators */}
                        <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1.5 text-gray-600">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-sm"></div>
                                <span className="font-medium text-xs">v1.0.0</span>
                            </div>

                            {/* <div className="flex items-center gap-1.5 text-gray-600">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-sm"></div>
                                <span className="font-medium text-xs">v2.1.4</span>
                                <span className="hidden md:inline text-xs opacity-60">• Build 1247</span>
                            </div> */}

                            <div className="flex items-center gap-1.5 text-gray-600">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                <span className="hidden lg:inline font-medium">Operational</span>
                                <span className="lg:hidden font-medium">Online</span>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-2">
                            {socialLinks.map((link, index) => (
                                <motion.a
                                    key={index}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-gray-500 hover:text-orange-500 transition-colors duration-200"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={link.label}
                                >
                                    {link.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}