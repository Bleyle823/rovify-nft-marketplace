"use client";

import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { BsGlobe } from "react-icons/bs";

interface FloatingMapToggleProps {
    isMapOpen: boolean;
    onToggle: () => void;
    hasEvents: boolean;
    eventCount?: number;
    className?: string;
    position?: "bottom-center" | "bottom-right" | "bottom-left";
}

const FloatingMapToggle = ({
    isMapOpen,
    onToggle,
    hasEvents,
    eventCount,
    className = "",
    position = "bottom-center"
}: FloatingMapToggleProps) => {
    const positionClasses = {
        "bottom-center": "fixed bottom-6 left-1/2 transform -translate-x-1/2",
        "bottom-right": "fixed bottom-6 right-6",
        "bottom-left": "fixed bottom-6 left-6"
    };

    return (
        <motion.div
            className={`${positionClasses[position]} z-50 ${className}`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6, type: "spring", stiffness: 100 }}
        >
            <motion.button
                onClick={onToggle}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`
                    group relative overflow-hidden px-6 py-3 rounded-full 
                    bg-gradient-to-r from-gray-900 via-black to-gray-900
                    text-white font-medium shadow-2xl backdrop-blur-lg
                    transition-all duration-300 flex items-center gap-3
                    border border-white/10
                    ${!hasEvents ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-gray-900/30'}
                `}
                disabled={!hasEvents}
                aria-label={isMapOpen ? "Close map view" : "Open map view"}
            >
                {/* Animated background */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-pink-600/20"
                    animate={{
                        x: ["-100%", "100%"],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "linear"
                    }}
                />

                {/* Icon with animation */}
                <motion.div
                    animate={isMapOpen ? { rotate: 180 } : { rotate: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {isMapOpen ? (
                        <FiX className="w-5 h-5" />
                    ) : (
                        <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <BsGlobe className="w-5 h-5" />
                        </motion.div>
                    )}
                </motion.div>

                <span className="relative z-10">
                    {isMapOpen ? "Close Map" : "Show Map"}
                    {eventCount !== undefined && !isMapOpen && ` (${eventCount})`}
                </span>

                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-lg"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            </motion.button>
        </motion.div>
    );
};

export default FloatingMapToggle;