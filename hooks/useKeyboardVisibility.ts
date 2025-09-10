'use client';

import { useState, useEffect } from 'react';

export function useKeyboardVisibility() {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Function to check if keyboard is likely open
        const checkKeyboard = () => {
            if (!window.visualViewport) return;

            const viewportHeight = window.visualViewport.height;
            const windowHeight = window.innerHeight;

            // If viewport is significantly smaller than window, keyboard is likely open
            setIsKeyboardVisible(windowHeight - viewportHeight > 150);
        };

        // Add listeners for viewport changes
        window.visualViewport?.addEventListener('resize', checkKeyboard);

        // Fallback using focus events for browsers without visualViewport API
        const handleFocus = (e: FocusEvent) => {
            if (e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLSelectElement) {
                setIsKeyboardVisible(true);
            }
        };

        const handleBlur = () => {
            setTimeout(() => setIsKeyboardVisible(false), 100);
        };

        document.addEventListener('focusin', handleFocus);
        document.addEventListener('focusout', handleBlur);

        return () => {
            window.visualViewport?.removeEventListener('resize', checkKeyboard);
            document.removeEventListener('focusin', handleFocus);
            document.removeEventListener('focusout', handleBlur);
        };
    }, []);

    return isKeyboardVisible;
}