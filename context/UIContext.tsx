// context/UIContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UIContextType {
    isBottomNavVisible: boolean;
    setBottomNavVisible: (visible: boolean) => void;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    showSideNav: boolean;
    showHeader: boolean;
    toggleSideNav: () => void;
    toggleHeader: () => void;
    isModalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    activeModal: string | null;
    openModal: (modalId: string) => void;
    closeModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    // Device detection
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);

    // Navigation visibility states
    const [showSideNav, setShowSideNav] = useState(true);
    const [showHeader, setShowHeader] = useState(true);

    const [isBottomNavVisible, setBottomNavVisible] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);

    // Handle screen resize and detect device type
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
            setIsDesktop(width >= 1024);

            // Auto-adjust navigation based on screen size
            // setShowSideNav(width >= 768);
        };

        // Set initial values
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Toggle functions
    const toggleSideNav = () => setShowSideNav(prev => !prev);
    const toggleHeader = () => setShowHeader(prev => !prev);

    const openModal = (modalId: string) => {
        setActiveModal(modalId);
        setModalOpen(true);
        setBottomNavVisible(false); // Hide bottom nav when modal opens
    };

    const closeModal = () => {
        setModalOpen(false);
        setActiveModal(null);
        setBottomNavVisible(true); // Show bottom nav when modal closes
    };

    return (
        <UIContext.Provider value={{
            isMobile, isTablet, isDesktop,
            showSideNav, showHeader,
            toggleSideNav, toggleHeader,
            isBottomNavVisible,
            setBottomNavVisible,
            isModalOpen,
            setModalOpen,
            activeModal,
            openModal,
            closeModal
        }}>
            {children}
        </UIContext.Provider>
    );
}

// Hook for using the UI context
export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}