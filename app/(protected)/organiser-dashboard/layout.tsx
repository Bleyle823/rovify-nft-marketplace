'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/organiser-dashboard/Sidebar';
import Header from '@/components/organiser-dashboard/Header';
import Footer from '@/components/organiser-dashboard/Footer';

export default function OrganiserDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Responsive handling
    useEffect(() => {
        const checkScreenSize = () => {
            const isMobileView = window.innerWidth < 1024;
            setIsMobile(isMobileView);

            // Auto-collapse sidebar on tablet sizes
            if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
                setSidebarCollapsed(true);
            }

            // Close mobile menu when switching to desktop
            if (!isMobileView) {
                setMobileMenuOpen(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const handleToggleCollapse = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuOpen(false);
    };

    // Calculate footer height for proper content spacing
    const getFooterHeight = () => {
        return isMobile ? 64 : 80; // h-16 = 64px, h-20 = 80px
    };

    return (
        <>
            <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggleCollapseAction={handleToggleCollapse}
                    isMobile={isMobile}
                    mobileMenuOpen={mobileMenuOpen}
                    onMobileMenuCloseAction={handleMobileMenuClose}
                />

                {/* Main Content Area */}
                <div
                    className="flex-1 flex flex-col overflow-hidden"
                    style={{
                        height: `calc(100vh - ${getFooterHeight()}px)`,
                        maxHeight: `calc(100vh - ${getFooterHeight()}px)`
                    }}
                >
                    {/* Header */}
                    <Header
                        isMobile={isMobile}
                        onMobileMenuToggleAction={handleMobileMenuToggle}
                    />

                    {/* Content Area - Scrollable within calculated space */}
                    <main className="flex-1 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{
                                    duration: 0.4,
                                    ease: "easeInOut",
                                    opacity: { duration: 0.3 },
                                    y: { duration: 0.4 }
                                }}
                                className="p-4 sm:p-6 lg:p-8"
                            >
                                <div className="max-w-7xl mx-auto">
                                    {children}
                                </div>
                                {/* Bottom spacer for comfortable scrolling */}
                                <div className="h-8"></div>
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>

                {/* Fixed Footer */}
                <Footer
                    sidebarCollapsed={sidebarCollapsed}
                    isMobile={isMobile}
                />
            </div>

            {/* Background decorative elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {/* Gradient Orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>
        </>
    );
}