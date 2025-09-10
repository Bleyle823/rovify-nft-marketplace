/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiList, FiMapPin, FiCalendar, FiFilter, FiSearch, FiInfo, FiHeart } from 'react-icons/fi';
import { BsCalendarEvent, BsMusicNote, BsBrush, BsLightningCharge, BsGem } from 'react-icons/bs';
import { IoTicketOutline } from 'react-icons/io5';
import Image from 'next/image';
import type { Event } from '@/types';

// Set Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoicmtuZCIsImEiOiJjbWFwbTEzajAwMDVxMmlxeHY1dDdyY3h6In0.OQrYFVmEq-QL95nnbh1jTQ';

interface MapViewProps {
    isOpen: boolean;
    onClose: () => void;
    events: Event[];
    userLocation?: { latitude: number; longitude: number } | null;
    currentFilter: string;
}

interface EventMarker {
    element: HTMLDivElement;
    marker: mapboxgl.Marker;
    event: Event;
}

// Create a type for the pulsing dot animation
interface PulsingDot {
    width: number;
    height: number;
    data: Uint8Array;
    context?: CanvasRenderingContext2D;
    onAdd: () => void;
    render: () => boolean;
}

const categoryColors: { [key: string]: string } = {
    music: '#8B5CF6', // Purple
    art: '#EC4899',   // Pink
    tech: '#3B82F6',  // Blue
    gaming: '#10B981', // Green
    food: '#F59E0B',  // Amber
    wellness: '#14B8A6', // Teal
    default: '#FF5722' // Default Rovify orange
};

const getCategoryColor = (event: Event): string => {
    if (!event.category || event.category.length === 0) return categoryColors.default;

    const mainCategory = Array.isArray(event.category)
        ? event.category[0].toLowerCase()
        : event.category.toLowerCase();

    return categoryColors[mainCategory] || categoryColors.default;
};

export default function MapView({ isOpen, onClose, events, userLocation, currentFilter }: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);
    const [markers, setMarkers] = useState<EventMarker[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>(currentFilter || 'all');
    const [mapLoaded, setMapLoaded] = useState(false);
    const [visibleEvents, setVisibleEvents] = useState<Event[]>(events);
    const [isListView, setIsListView] = useState(false);

    // Use useMemo for the initial map center to avoid dependency issues
    const initialMapCenter = useMemo(() =>
        userLocation
            ? [userLocation.longitude, userLocation.latitude] as [number, number]
            : [36.8219, 1.2921] as [number, number], // Default to Nairobi coordinates if location not available
        [userLocation]);

    const defaultZoom = 12;

    // Initialize map when component mounts
    useEffect(() => {
        if (!isOpen || !mapContainer.current || map.current) return;

        const mapboxMap = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11', // Light style for better event visibility
            center: initialMapCenter,
            zoom: defaultZoom,
            attributionControl: false,
            antialias: true
        });

        mapboxMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        // Add user location marker if available
        if (userLocation) {
            const userLocationEl = document.createElement('div');
            userLocationEl.className = 'user-location-marker';

            new mapboxgl.Marker({
                element: userLocationEl,
                anchor: 'center'
            })
                .setLngLat([userLocation.longitude, userLocation.latitude])
                .addTo(mapboxMap);
        }

        // Add event markers when map loads
        mapboxMap.on('load', () => {
            setMapLoaded(true);

            // Add animated pulse background layer
            mapboxMap.addSource('user-location-source', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: userLocation ? [
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [userLocation.longitude, userLocation.latitude]
                            },
                            properties: {}
                        }
                    ] : []
                }
            });

            mapboxMap.addLayer({
                id: 'user-location-pulse',
                type: 'circle',
                source: 'user-location-source',
                paint: {
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        10, 10,
                        15, 20
                    ],
                    'circle-color': '#4A90E2',
                    'circle-opacity': 0.2,
                    'circle-stroke-color': '#4A90E2',
                    'circle-stroke-width': 2
                }
            });

            // Add glow animation
            const size = 100;

            // Create pulsing dot with proper context definition
            const pulsingDot: PulsingDot = {
                width: size,
                height: size,
                data: new Uint8Array(size * size * 4),

                // When the layer is added to the map, get the rendering context
                onAdd: function () {
                    const canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    this.context = canvas.getContext('2d')!;
                },

                // Called once before every frame where the icon will be used
                render: function () {
                    if (!this.context) return false;

                    const duration = 1000;
                    const t = (performance.now() % duration) / duration;

                    const radius = (size / 2) * 0.3;
                    const outerRadius = (size / 2) * 0.7 * t + radius;
                    const context = this.context;

                    // Draw the outer circle
                    context.clearRect(0, 0, this.width, this.height);
                    context.beginPath();
                    context.arc(
                        this.width / 2,
                        this.height / 2,
                        outerRadius,
                        0,
                        Math.PI * 2
                    );
                    context.fillStyle = `rgba(74, 144, 226, ${1 - t})`;
                    context.fill();

                    // Draw the inner circle
                    context.beginPath();
                    context.arc(
                        this.width / 2,
                        this.height / 2,
                        radius,
                        0,
                        Math.PI * 2
                    );
                    context.fillStyle = 'rgba(74, 144, 226, 1)';
                    context.strokeStyle = 'white';
                    context.lineWidth = 2 + 4 * (1 - t);
                    context.fill();
                    context.stroke();

                    // Update this image's data with data from the canvas
                    this.data = new Uint8Array(context.getImageData(
                        0,
                        0,
                        this.width,
                        this.height
                    ).data);

                    // Continuously repaint the map, resulting in the smooth animation
                    mapboxMap.triggerRepaint();

                    // Return `true` to let the map know that the image was updated
                    return true;
                }
            };

            if (userLocation) {
                mapboxMap.addImage('pulsing-dot', pulsingDot as unknown as mapboxgl.StyleImageInterface, { pixelRatio: 2 });

                mapboxMap.addLayer({
                    id: 'user-pulse',
                    type: 'symbol',
                    source: 'user-location-source',
                    layout: {
                        'icon-image': 'pulsing-dot',
                        'icon-allow-overlap': true
                    }
                });
            }
        });

        map.current = mapboxMap;

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [isOpen, initialMapCenter, userLocation]);

    // Update markers when events or map changes
    useEffect(() => {
        if (!mapLoaded || !map.current) return;

        // Remove existing markers
        markers.forEach(({ marker }) => marker.remove());

        // Filter events based on active filter
        const filtered = events.filter(event => {
            if (activeFilter === 'all') return true;
            if (activeFilter === 'nft' && event.hasNftTickets) return true;

            // For trending and upcoming, we need to create derived properties
            // since they don't exist on the Event type
            const isTrending = event.popularity ? event.popularity > 80 : false;
            const isUpcoming = event.date ? new Date(event.date) > new Date() : false;

            if (activeFilter === 'trending' && isTrending) return true;
            if (activeFilter === 'upcoming' && isUpcoming) return true;

            // Filter by category if it's a category filter
            const eventCategories = Array.isArray(event.category)
                ? event.category
                : [event.category];

            if (eventCategories.some(cat =>
                typeof cat === 'string' && cat.toLowerCase() === activeFilter.toLowerCase()
            )) return true;

            return false;
        });

        setVisibleEvents(filtered);

        // Create and add new markers
        const newMarkers: EventMarker[] = [];

        filtered.forEach(event => {
            if (!event.location?.coordinates) return;

            // Create custom marker element
            const markerEl = document.createElement('div');
            markerEl.className = 'event-marker';
            markerEl.innerHTML = `
        <div class="marker-container" style="background-color: ${getCategoryColor(event)}">
          <div class="marker-icon">
            ${getMarkerIcon(event)}
          </div>
        </div>
        <div class="marker-pulse" style="background-color: ${getCategoryColor(event)}"></div>
      `;

            // Add click listener to the marker element
            markerEl.addEventListener('click', () => {
                setActiveEvent(event);

                // Fly to the event location
                map.current?.flyTo({
                    center: [event.location!.coordinates.lng, event.location!.coordinates.lat],
                    zoom: 14,
                    duration: 1000
                });
            });

            // Create and add the marker
            const marker = new mapboxgl.Marker({
                element: markerEl,
                anchor: 'bottom'
            })
                .setLngLat([event.location.coordinates.lng, event.location.coordinates.lat])
                .addTo(map.current!);

            newMarkers.push({ element: markerEl, marker, event });
        });

        // Update markers state
        setMarkers(newMarkers);

        // Fit map to markers if we have events
        if (newMarkers.length > 0 && map.current) {
            const bounds = new mapboxgl.LngLatBounds();

            // Add event locations to bounds
            newMarkers.forEach(({ event }) => {
                if (event.location?.coordinates) {
                    bounds.extend([
                        event.location.coordinates.lng,
                        event.location.coordinates.lat
                    ]);
                }
            });

            // Add user location to bounds if available
            if (userLocation) {
                bounds.extend([userLocation.longitude, userLocation.latitude]);
            }

            // Only fit bounds if we have coordinates to fit
            if (!bounds.isEmpty()) {
                map.current.fitBounds(bounds, {
                    padding: { top: 100, bottom: 50, left: 50, right: 50 },
                    maxZoom: 15
                });
            }
        }

        // Cleanup function will run when component unmounts or when dependencies change
        return () => {
            // Clean up by removing markers
            newMarkers.forEach(({ marker }) => marker.remove());
        };
    }, [events, mapLoaded, activeFilter, userLocation]); // Removed markers from dependencies

    // Function to determine appropriate icon for marker based on event type
    const getMarkerIcon = (event: Event): string => {
        const eventCategory = Array.isArray(event.category)
            ? event.category[0]?.toLowerCase()
            : (event.category || '').toLowerCase();

        if (!eventCategory) {
            return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>';
        }

        switch (eventCategory) {
            case 'music':
                return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
            case 'art':
                return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>';
            case 'tech':
                return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
            case 'gaming':
                return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><line x1="12" y1="12" x2="12" y2="12"></line><line x1="6" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="18" y2="12"></line></svg>';
            default:
                return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
        }
    };

    const toggleListView = () => {
        setIsListView(!isListView);
    };

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-full bg-gray-100 text-gray-700 mr-3"
                                    onClick={onClose}
                                >
                                    <FiChevronLeft className="w-5 h-5" />
                                </motion.button>
                                <h2 className="text-xl font-bold">Discover Events Near You</h2>
                            </div>

                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`p-2 rounded-full ${isListView ? 'bg-[#FF5722] text-white' : 'bg-gray-100 text-gray-700'}`}
                                    onClick={toggleListView}
                                    aria-label={isListView ? "Show map view" : "Show list view"}
                                >
                                    {isListView ? <FiMapPin className="w-5 h-5" /> : <FiList className="w-5 h-5" />}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-full bg-gray-100 text-gray-700"
                                    onClick={onClose}
                                    aria-label="Close map"
                                >
                                    <FiX className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Filter Chips */}
                        <div className="p-3 bg-white border-b border-gray-200 overflow-x-auto no-scrollbar">
                            <div className="flex gap-2">
                                {['all', 'trending', 'upcoming', 'nft', 'music', 'art', 'tech'].map((filter) => (
                                    <motion.button
                                        key={filter}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium ${activeFilter === filter
                                            ? 'bg-[#FF5722] text-white'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                        onClick={() => handleFilterChange(filter)}
                                    >
                                        {filter === 'all' ? 'All Events' :
                                            filter === 'nft' ? 'NFT Tickets' :
                                                filter === 'trending' ? 'Trending' :
                                                    filter === 'upcoming' ? 'Upcoming' :
                                                        filter.charAt(0).toUpperCase() + filter.slice(1)}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-grow flex">
                            {/* Map Container */}
                            <AnimatePresence mode="wait">
                                {!isListView && (
                                    <motion.div
                                        key="map-view"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full h-full relative"
                                    >
                                        <div ref={mapContainer} className="w-full h-full" />

                                        {/* Event count badge */}
                                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-white rounded-full shadow-md text-sm font-medium">
                                            {visibleEvents.length} {visibleEvents.length === 1 ? 'Event' : 'Events'}
                                        </div>

                                        {/* Search overlay */}
                                        <div className="absolute top-4 left-4 max-w-xs w-full">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Search events..."
                                                    className="w-full pl-10 pr-4 py-2.5 bg-white rounded-full shadow-md text-sm border-none focus:ring-2 focus:ring-[#FF5722] focus:outline-none"
                                                />
                                                <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {isListView && (
                                    <motion.div
                                        key="list-view"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full h-full overflow-auto p-4"
                                    >
                                        {visibleEvents.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                    <FiCalendar className="w-8 h-8 text-gray-500" />
                                                </div>
                                                <h3 className="text-xl font-medium text-gray-800 mb-2">No events found</h3>
                                                <p className="text-gray-600 text-center max-w-md">
                                                    We couldn&apos;t find any events with the current filter. Try changing your filter or check back later.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {visibleEvents.map((event, index) => (
                                                    <motion.div
                                                        key={event.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                            transition: { delay: index * 0.05 }
                                                        }}
                                                        whileHover={{ y: -5 }}
                                                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                                                        onClick={() => {
                                                            setActiveEvent(event);
                                                            setIsListView(false);

                                                            // Give time for the view to change before flying to the event
                                                            setTimeout(() => {
                                                                if (event.location?.coordinates && map.current) {
                                                                    map.current.flyTo({
                                                                        center: [event.location.coordinates.lng, event.location.coordinates.lat],
                                                                        zoom: 15,
                                                                        duration: 1000
                                                                    });
                                                                }
                                                            }, 300);
                                                        }}
                                                    >
                                                        <div className="relative h-40">
                                                            <Image
                                                                src={event.image || '/images/placeholder-event.jpg'}
                                                                alt={event.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                            <div className="absolute bottom-3 left-3 right-3">
                                                                <div className="flex justify-between items-end">
                                                                    <div>
                                                                        <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                                                                            {event.date instanceof Date
                                                                                ? event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                                                : 'Date TBA'}
                                                                        </span>
                                                                    </div>
                                                                    {event.hasNftTickets && (
                                                                        <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
                                                                            <BsGem className="w-3 h-3 mr-1" />
                                                                            <span>NFT</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-4">
                                                            <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                                                            <div className="flex items-center text-xs text-gray-500 mb-2">
                                                                <FiMapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                                                <span className="truncate">{event.location?.name || 'Location TBA'}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium text-[#FF5722]">
                                                                    {event.price?.amount === 0
                                                                        ? 'Free'
                                                                        : event.price?.min
                                                                            ? `${event.price.min}`
                                                                            : 'Price TBA'}
                                                                </span>
                                                                <button
                                                                    className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#FF5722] transition-colors"
                                                                    aria-label="Like event"
                                                                >
                                                                    <FiHeart className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Event Detail Panel */}
                            <AnimatePresence>
                                {activeEvent && !isListView && (
                                    <motion.div
                                        initial={{ x: '100%', opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: '100%', opacity: 0 }}
                                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                        className="absolute bottom-0 left-0 right-0 md:right-auto md:top-0 md:w-96 bg-white rounded-t-2xl md:rounded-none md:rounded-tr-2xl md:rounded-br-2xl shadow-2xl z-10 overflow-hidden"
                                    >
                                        <div className="relative h-48">
                                            <Image
                                                src={activeEvent.image || '/images/placeholder-event.jpg'}
                                                alt={activeEvent.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                                            <button
                                                className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white"
                                                onClick={() => setActiveEvent(null)}
                                            >
                                                <FiX className="w-5 h-5" />
                                            </button>

                                            {activeEvent.hasNftTickets && (
                                                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
                                                    <BsGem className="w-3 h-3 mr-1" />
                                                    <span>NFT Tickets</span>
                                                </div>
                                            )}

                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h2 className="text-xl font-bold text-white mb-1">{activeEvent.title}</h2>
                                                <div className="flex items-center text-white/90 text-sm">
                                                    <FiCalendar className="w-4 h-4 mr-1" />
                                                    <span>
                                                        {activeEvent.date instanceof Date
                                                            ? activeEvent.date.toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })
                                                            : 'Date TBA'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex items-center mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center text-sm text-gray-700 mb-1">
                                                        <FiMapPin className="w-4 h-4 mr-1 text-gray-500" />
                                                        <span>{activeEvent.location?.name || 'Location TBA'}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <div
                                                            className="w-3 h-3 rounded-full mr-1.5"
                                                            style={{ backgroundColor: getCategoryColor(activeEvent) }}
                                                        ></div>
                                                        <span className="text-gray-700 font-medium">
                                                            {Array.isArray(activeEvent.category)
                                                                ? activeEvent.category[0]
                                                                : activeEvent.category || 'Event'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-[#FF5722]">
                                                        {activeEvent.price?.amount === 0
                                                            ? 'Free'
                                                            : activeEvent.price?.min
                                                                ? `${activeEvent.price.min}`
                                                                : 'Price TBA'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">per person</div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-100 pt-4 mb-4">
                                                <h3 className="font-medium text-gray-900 mb-2">About this event</h3>
                                                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                                                    {activeEvent.description || 'No description available for this event.'}
                                                </p>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {/* Handle category as array or string */}
                                                    {Array.isArray(activeEvent.category)
                                                        ? activeEvent.category.map((category: string, index: number) => (
                                                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                                                                {category}
                                                            </span>
                                                        ))
                                                        : activeEvent.category && (
                                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                                                                {activeEvent.category}
                                                            </span>
                                                        )
                                                    }

                                                    {/* Derived trending property - using popularity > 80% */}
                                                    {activeEvent.popularity && activeEvent.popularity > 80 && (
                                                        <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">
                                                            Trending
                                                        </span>
                                                    )}

                                                    {/* Derived upcoming property - using date in the future */}
                                                    {activeEvent.date && new Date(activeEvent.date) > new Date() && (
                                                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
                                                            Upcoming
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="flex-1 py-2.5 rounded-xl bg-[#FF5722] text-white font-medium"
                                                >
                                                    Get Tickets
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.03, backgroundColor: '#FFF0ED' }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="p-2.5 rounded-xl bg-gray-100 text-gray-700"
                                                >
                                                    <FiHeart className="w-5 h-5" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.03, backgroundColor: '#F0F8FF' }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="p-2.5 rounded-xl bg-gray-100 text-gray-700"
                                                >
                                                    <FiInfo className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Global styles for map elements */}
                    <style jsx global>{`
            .mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib {
              display: none !important;
            }
            
            .mapboxgl-ctrl-bottom-right {
              bottom: 15px !important;
              right: 15px !important;
            }
            
            .event-marker {
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            
            .marker-container {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              position: relative;
              z-index: 2;
              cursor: pointer;
              transition: transform 0.2s;
            }
            
            .marker-container:hover {
              transform: scale(1.1);
            }
            
            .marker-icon {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .marker-pulse {
              position: absolute;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              animation: marker-pulse 1.5s infinite;
              opacity: 0.4;
              z-index: 1;
            }
            
            @keyframes marker-pulse {
              0% {
                transform: scale(1);
                opacity: 0.4;
              }
              50% {
                transform: scale(1.5);
                opacity: 0.2;
              }
              100% {
                transform: scale(1);
                opacity: 0.4;
              }
            }
            
            .user-location-marker {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: #4A90E2;
              border: 3px solid white;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            }
            
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            
            .line-clamp-3 {
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
}