'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeType = 'dark' | 'light';

interface ThemeContextType {
    theme: ThemeType;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Initialize with dark theme, will be updated after hydration
    const [theme, setTheme] = useState<ThemeType>('dark');
    const [mounted, setMounted] = useState(false);

    // Handle theme initialization after mount to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('rovify-theme') as ThemeType || 'dark';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('light-theme', savedTheme === 'light');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('rovify-theme', newTheme);
        document.documentElement.classList.toggle('light-theme', newTheme === 'light');
    };

    // Avoid rendering until mounted to prevent hydration mismatch
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};