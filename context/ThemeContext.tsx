'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeType = 'dark' | 'light';

interface ThemeContextType {
    theme: ThemeType;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'light' });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Use state to track current theme
    const [theme, setTheme] = useState<ThemeType>('dark');

    // Initialize theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('rovify-theme') as ThemeType;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('light-theme', savedTheme === 'light');
        }
    }, []);

    // const toggleTheme = () => {
    //     const newTheme = theme === 'dark' ? 'light' : 'dark';
    //     setTheme(newTheme);
    //     localStorage.setItem('rovify-theme', newTheme);
    //     document.documentElement.classList.toggle('light-theme', newTheme === 'light');
    // };

    return (
        <ThemeContext.Provider value={{ theme }}>
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