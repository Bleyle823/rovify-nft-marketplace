/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiCalendar, FiX, FiMaximize2, FiMinimize2 } from "react-icons/fi";

// Event type definition
interface Event {
    id: string;
    title: string;
    image: string;
    date: Date;
    location: {
        name: string;
        address: string;
        coordinates: { lat: number; lng: number; }
    };
    price: { min: string; max?: string; amount: number };
    attendees: number;
    category: string;
    creator: {
        name: string;
        avatar: string;
        verified: boolean;
    };
    description: string;
    tags: string[];
    isLive?: boolean;
    isFeatured?: boolean;
    rating?: number;
    totalRatings?: number;
}

interface InteractiveMapProps {
    events: Event[];
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
    showHeader?: boolean;
    className?: string;
    mapStyle?: "default" | "satellite" | "terrain";
    onEventSelect?: (event: Event | null) => void;
    selectedEventId?: string;
}

const InteractiveMap = ({
    events,
    isFullscreen = false,
    onToggleFullscreen,
    showHeader = true,
    className = "",
    mapStyle = "default",
    onEventSelect,
    selectedEventId
}: InteractiveMapProps) => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // US center

    useEffect(() => {
        if (events.length > 0) {
            // Calculate center from events
            const avgLat = events.reduce((sum, event) => sum + event.location.coordinates.lat, 0) / events.length;
            const avgLng = events.reduce((sum, event) => sum + event.location.coordinates.lng, 0) / events.length;
            setMapCenter({ lat: avgLat, lng: avgLng });
        }
    }, [events]);

    // Handle external selection
    useEffect(() => {
        if (selectedEventId) {
            const event = events.find(e => e.id === selectedEventId);
            setSelectedEvent(event || null);
        }
    }, [selectedEventId, events]);

    const handleEventClick = (event: Event) => {
        const newSelectedEvent = selectedEvent?.id === event.id ? null : event;
        setSelectedEvent(newSelectedEvent);
        onEventSelect?.(newSelectedEvent);
    };

    const getMapBackgroundStyle = () => {
        switch (mapStyle) {
            case "satellite":
                return "bg-gradient-to-br from-green-100 via-blue-100 to-green-200";
            case "terrain":
                return "bg-gradient-to-br from-amber-100 via-green-100 to-blue-100";
            default:
                return "bg-gradient-to-br from-blue-100 to-purple-100";
        }
    };

    return (
        <div className={`relative w-full h-full ${getMapBackgroundStyle()} rounded-2xl overflow-hidden ${className}`}>
            {/* Map Header */}
            {showHeader && (
                <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200/50 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900">Event Locations</h3>
                            <p className="text-sm text-gray-600">{events.length} events displayed</p>
                        </div>
                        {onToggleFullscreen && (
                            <button
                                onClick={onToggleFullscreen}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                            >
                                {isFullscreen ? <FiMinimize2 className="w-5 h-5" /> : <FiMaximize2 className="w-5 h-5" />}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Map Visualization */}
            <div className={`${showHeader ? 'pt-20' : 'pt-6'} p-6 h-full relative`}>
                <div className="relative w-full h-full bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-xl overflow-hidden">
                    {/* Grid background */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(99, 102, 241, 0.2) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px'
                        }}
                    />

                    {/* Event Markers */}
                    {events.map((event, index) => {
                        // Calculate position based on coordinates (simplified projection)
                        const x = ((event.location.coordinates.lng + 180) / 360) * 100;
                        const y = ((90 - event.location.coordinates.lat) / 180) * 100;

                        // Ensure markers stay within visible bounds
                        const clampedX = Math.max(5, Math.min(95, x));
                        const clampedY = Math.max(5, Math.min(95, y));

                        const isSelected = selectedEvent?.id === event.id;

                        return (
                            <motion.div
                                key={event.id}
                                className="absolute z-10 cursor-pointer group"
                                style={{
                                    left: `${clampedX}%`,
                                    top: `${clampedY}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                whileHover={{ scale: 1.2 }}
                                onClick={() => handleEventClick(event)}
                            >
                                {/* Marker */}
                                <div className={`
                                    w-5 h-5 rounded-full border-3 border-white shadow-lg relative
                                    ${isSelected
                                        ? 'bg-orange-500 scale-150 z-30'
                                        : event.isFeatured
                                            ? 'bg-purple-500 hover:bg-purple-600'
                                            : event.isLive
                                                ? 'bg-red-500 hover:bg-red-600'
                                                : 'bg-blue-500 hover:bg-orange-400'
                                    }
                                    transition-all duration-200
                                `}>
                                    {/* Pulse animation for live events */}
                                    {event.isLive && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-red-400"
                                            animate={{
                                                scale: [1, 1.8, 1],
                                                opacity: [0.8, 0, 0.8]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: index * 0.2
                                            }}
                                        />
                                    )}

                                    {/* Featured events sparkle */}
                                    {event.isFeatured && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-yellow-300"
                                            animate={{
                                                scale: [1, 1.4, 1],
                                                opacity: [0.6, 0, 0.6]
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                delay: index * 0.3
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Hover tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-40">
                                    <div className="bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap max-w-48 text-center">
                                        <div className="font-medium">{event.title}</div>
                                        <div className="text-gray-300">{event.location.name}</div>
                                        <div className="text-orange-300">{event.price.amount === 0 ? 'Free' : event.price.min}</div>
                                    </div>
                                    {/* Tooltip arrow */}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Legend */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-20">
                        <h4 className="font-semibold text-gray-800 mb-3 text-sm">Legend</h4>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full relative">
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-red-400"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.8, 0, 0.8]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity
                                        }}
                                    />
                                </div>
                                <span className="text-gray-700">Live Events</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="text-gray-700">Featured</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-700">Regular Events</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                <span className="text-gray-700">Selected</span>
                            </div>
                        </div>
                    </div>

                    {/* Map Statistics */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-20">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{events.length}</div>
                            <div className="text-xs text-gray-600">Total Events</div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-center">
                                    <div className="font-semibold text-red-600">{events.filter(e => e.isLive).length}</div>
                                    <div className="text-gray-600">Live</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold text-purple-600">{events.filter(e => e.isFeatured).length}</div>
                                    <div className="text-gray-600">Featured</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Info Panel */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-lg z-30"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={selectedEvent.image}
                                    alt={selectedEvent.title}
                                    width={64}
                                    height={64}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 truncate">{selectedEvent.title}</h4>
                                        <p className="text-sm text-gray-600 truncate">{selectedEvent.description}</p>

                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FiMapPin className="w-4 h-4" />
                                                {selectedEvent.location.name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiCalendar className="w-4 h-4" />
                                                {selectedEvent.date.toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold text-orange-600">
                                                    {selectedEvent.price.amount === 0 ? 'Free' : selectedEvent.price.min}
                                                </span>
                                                {selectedEvent.rating && (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <span>⭐</span>
                                                        <span className="font-medium">{selectedEvent.rating}</span>
                                                        <span className="text-gray-400">({selectedEvent.totalRatings})</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {selectedEvent.attendees} attending
                                            </span>
                                        </div>

                                        {/* Event badges */}
                                        <div className="flex items-center gap-2 mt-2">
                                            {selectedEvent.isLive && (
                                                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                                    🔴 Live
                                                </span>
                                            )}
                                            {selectedEvent.isFeatured && (
                                                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                                                    ⭐ Featured
                                                </span>
                                            )}
                                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                                {selectedEvent.category}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setSelectedEvent(null);
                                            onEventSelect?.(null);
                                        }}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                                        aria-label="Close event details"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InteractiveMap;