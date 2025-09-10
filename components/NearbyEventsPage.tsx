/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiMapPin, FiFilter, FiClock, FiCalendar,
    FiHeart, FiCompass, FiChevronDown, FiGrid,
    FiChevronLeft, FiChevronRight, FiStar, FiX,
    FiNavigation, FiRefreshCw, FiInfo, FiShare2,
    FiUsers
} from 'react-icons/fi';
import { IoArrowUpOutline } from 'react-icons/io5';
import mapboxgl from 'mapbox-gl';

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

interface Coordinates {
    lat: number;
    lng: number;
}

interface NearbyEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    distance: string;
    price: string;
    image: string;
    category: string;
    rating?: number;
    attendees?: number;
    isFeatured?: boolean;
    isLiked?: boolean;
    coordinates?: Coordinates;
    description?: string;
    tags?: string[];
}

interface EventCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
}

interface MapMarker {
    id: string;
    lat: number;
    lng: number;
    eventId: string;
}

interface FilterState {
    search: string;
    category: string;
    priceRange: string;
    date: string;
    sortBy: string;
}

interface PaginationState {
    currentPage: number;
    totalPages: number;
    totalEvents: number;
    eventsPerPage: number;
}

interface MapState {
    instance: mapboxgl.Map | null;
    loaded: boolean;
    initialized: boolean;
    selectedEvent: string | null;
    hoveredEvent: string | null;
    currentLocation: Coordinates | null;
    activeStyle: string;
    showControls: boolean;
    isLocationLoading: boolean;
}

interface UIState {
    loading: boolean;
    error: string | null;
    viewMode: 'grid' | 'map';
    showFilters: boolean;
    viewTransitioning: boolean;
    isRefreshing: boolean;
    favorites: Set<string>;
    imageLoadingStates: Record<string, boolean>;
}

interface EventsAPIResponse {
    events: NearbyEvent[];
    totalEvents: number;
    totalPages: number;
    currentPage: number;
    hasMore: boolean;
}

interface APIResult {
    success: boolean;
    shareUrl?: string;
    error?: string;
}

interface StableCoinConfig {
    enabled: boolean;
    conversionRate: number;
    symbol: string;
}

interface NearbyEventsProps {
    initialEvents?: NearbyEvent[];
    apiKey?: string;
    mapStyle?: string;
    animationLevel?: 'minimal' | 'moderate' | 'maximum';
}

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

// Configuration for stable coin display (comment out to disable)
const STABLE_COIN_CONFIG: StableCoinConfig = {
    enabled: true, // Set to false to disable stable coin prices
    conversionRate: 0.85, // 1 USD = 0.85 USDC (example rate)
    symbol: 'USDC'
};

// Map styles configuration
const MAP_STYLES: Record<string, string> = {
    vibrant: 'mapbox://styles/mapbox/navigation-night-v1',
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12'
};

// Default pagination settings
const PAGINATION_CONFIG = {
    eventsPerPage: 8,
    maxPageButtons: 5
};

// Default location (Nairobi)
const DEFAULT_LOCATION: Coordinates = {
    lat: -1.286389,
    lng: 36.817223
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

const eventsAPI = {
    fetchEvents: async (
        filters: FilterState,
        page: number = 1,
        limit: number = PAGINATION_CONFIG.eventsPerPage
    ): Promise<EventsAPIResponse> => {
        try {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));

            // In real implementation:
            // const response = await fetch('/api/events', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ ...filters, page, limit })
            // });
            // if (!response.ok) throw new Error('Failed to fetch events');
            // return response.json();

            let filtered = mockEvents.filter(event => {
                if (filters.category && filters.category !== 'all' && event.category !== filters.category) return false;
                if (filters.priceRange && !isPriceInRange(event.price, filters.priceRange)) return false;
                if (filters.date && !isDateMatch(event.date, filters.date)) return false;
                if (filters.search && !isSearchMatch(event, filters.search)) return false;
                return true;
            });

            // Apply sorting
            filtered = applySorting(filtered, filters.sortBy);

            // Pagination
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedEvents = filtered.slice(startIndex, endIndex);

            return {
                events: paginatedEvents,
                totalEvents: filtered.length,
                totalPages: Math.ceil(filtered.length / limit),
                currentPage: page,
                hasMore: endIndex < filtered.length
            };
        } catch (error) {
            console.error('Failed to fetch events:', error);
            throw new Error('Failed to load events. Please try again.');
        }
    },

    toggleFavorite: async (eventId: string): Promise<APIResult> => {
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            // In real implementation: await fetch(`/api/events/${eventId}/favorite`, { method: 'POST' });
            return { success: true };
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            throw new Error('Failed to update favorite status');
        }
    },

    shareEvent: async (eventId: string): Promise<APIResult> => {
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            // In real implementation: await fetch(`/api/events/${eventId}/share`, { method: 'POST' });
            return {
                success: true,
                shareUrl: `https://rovify.com/events/${eventId}`
            };
        } catch (error) {
            console.error('Failed to share event:', error);
            throw new Error('Failed to share event');
        }
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const isPriceInRange = (price: string, range: string): boolean => {
    const numPrice = parseFloat(price.replace('$', ''));
    switch (range) {
        case 'free': return numPrice === 0;
        case 'under25': return numPrice < 25;
        case 'under50': return numPrice < 50;
        case 'under100': return numPrice < 100;
        default: return true;
    }
};

const isDateMatch = (eventDate: string, filterDate: string): boolean => {
    const today = new Date();
    switch (filterDate) {
        case 'today':
            return eventDate.includes(today.getDate().toString());
        case 'tomorrow':
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            return eventDate.includes(tomorrow.getDate().toString());
        case 'this-weekend':
            return eventDate.includes('Sat') || eventDate.includes('Sun');
        case 'this-week':
            return true;
        default:
            return true;
    }
};

const isSearchMatch = (event: NearbyEvent, searchTerm: string): boolean => {
    const term = searchTerm.toLowerCase();
    return (
        event.title.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        event.category.toLowerCase().includes(term) ||
        Boolean(event.description && event.description.toLowerCase().includes(term)) ||
        Boolean(event.tags && event.tags.some(tag => tag.toLowerCase().includes(term)))
    );
};

const applySorting = (events: NearbyEvent[], sortBy: string): NearbyEvent[] => {
    return [...events].sort((a, b) => {
        switch (sortBy) {
            case 'distance':
                return parseFloat(a.distance) - parseFloat(b.distance);
            case 'price':
                return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'popularity':
                return (b.attendees || 0) - (a.attendees || 0);
            case 'date':
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            default:
                return 0;
        }
    });
};

// Convert USD to stable coin
const convertToStableCoin = (usdPrice: string): string | null => {
    if (!STABLE_COIN_CONFIG.enabled) return null;

    const numPrice = parseFloat(usdPrice.replace('$', ''));
    if (numPrice === 0) return 'Free';

    const stableCoinPrice = (numPrice * STABLE_COIN_CONFIG.conversionRate).toFixed(2);
    return `${stableCoinPrice} ${STABLE_COIN_CONFIG.symbol}`;
};

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const eventCategories: EventCategory[] = [
    { id: 'all', name: 'All', icon: '🎭', color: 'bg-gray-100 text-gray-600' },
    { id: 'music', name: 'Music', icon: '🎵', color: 'bg-purple-100 text-purple-700' },
    { id: 'art', name: 'Art', icon: '🎨', color: 'bg-pink-100 text-pink-700' },
    { id: 'tech', name: 'Tech', icon: '💻', color: 'bg-blue-100 text-blue-700' },
    { id: 'food', name: 'Food', icon: '🍽️', color: 'bg-orange-100 text-orange-700' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'bg-green-100 text-green-700' },
    { id: 'education', name: 'Education', icon: '📚', color: 'bg-indigo-100 text-indigo-700' },
    { id: 'outdoors', name: 'Outdoors', icon: '🏞️', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'nightlife', name: 'Nightlife', icon: '🌃', color: 'bg-violet-100 text-violet-700' },
];

const mockEvents: NearbyEvent[] = [
    {
        id: 'e1',
        title: 'Summer Music Festival 2025',
        date: 'Sat, 3rd May',
        time: '12:00 PM - 10:00 PM',
        location: 'Central Park Main Stage',
        distance: '0.8 km',
        price: '$50',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
        category: 'music',
        rating: 4.8,
        attendees: 1240,
        isFeatured: true,
        isLiked: false,
        coordinates: { lat: -1.286389, lng: 36.817223 },
        description: 'Join us for the biggest summer music festival featuring international artists.',
        tags: ['Music', 'Festival', 'Outdoor']
    },
    {
        id: 'e2',
        title: 'Tech Startup Conference 2025',
        date: 'Mon, 5th May',
        time: '9:00 AM - 6:00 PM',
        location: 'Innovation Hub Nairobi',
        distance: '1.2 km',
        price: '$75',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        category: 'tech',
        rating: 4.5,
        attendees: 650,
        isFeatured: false,
        isLiked: true,
        coordinates: { lat: -1.28395, lng: 36.823654 },
        description: 'Network with entrepreneurs and learn from industry leaders.',
        tags: ['Tech', 'Networking', 'Startups']
    },
    {
        id: 'e3',
        title: 'Culinary Masterclass: African Fusion',
        date: 'Tue, 6th May',
        time: '7:00 PM - 9:30 PM',
        location: 'Gourmet Kitchen Studio',
        distance: '1.5 km',
        price: '$120',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        category: 'food',
        rating: 4.9,
        attendees: 48,
        isFeatured: false,
        isLiked: false,
        coordinates: { lat: -1.291634, lng: 36.812202 },
        description: 'Learn to cook authentic African fusion dishes.',
        tags: ['Cooking', 'Workshop']
    },
    {
        id: 'e4',
        title: 'Digital Art Exhibition: Future Visions',
        date: 'Wed, 7th May',
        time: '10:00 AM - 8:00 PM',
        location: 'Metropolitan Gallery',
        distance: '2.1 km',
        price: '$15',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
        category: 'art',
        rating: 4.3,
        attendees: 320,
        isFeatured: false,
        isLiked: false,
        coordinates: { lat: -1.279824, lng: 36.824726 },
        description: 'Explore contemporary digital art visions.',
        tags: ['Digital Art', 'Exhibition']
    },
    {
        id: 'e5',
        title: 'Morning Yoga in the Park',
        date: 'Thu, 8th May',
        time: '6:30 AM - 8:00 AM',
        location: 'Uhuru Gardens',
        distance: '2.4 km',
        price: '$0',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        category: 'outdoors',
        rating: 4.7,
        attendees: 85,
        isFeatured: false,
        isLiked: true,
        coordinates: { lat: -1.28023, lng: 36.809914 },
        description: 'Start your day with mindful yoga practice.',
        tags: ['Yoga', 'Wellness', 'Morning']
    },
    {
        id: 'e6',
        title: 'Craft Beer Tasting Festival',
        date: 'Fri, 9th May',
        time: '5:00 PM - 11:00 PM',
        location: 'Riverside Brewery',
        distance: '3.0 km',
        price: '$35',
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80',
        category: 'food',
        rating: 4.4,
        attendees: 420,
        isFeatured: true,
        isLiked: false,
        coordinates: { lat: -1.301756, lng: 36.792509 },
        description: 'Sample the finest craft beers from local breweries.',
        tags: ['Beer', 'Tasting', 'Live Music']
    },
    {
        id: 'e7',
        title: 'Photography Workshop: Street Stories',
        date: 'Sat, 10th May',
        time: '9:00 AM - 3:00 PM',
        location: 'City Center Walking Tour',
        distance: '1.8 km',
        price: '$65',
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
        category: 'education',
        rating: 4.6,
        attendees: 25,
        isFeatured: false,
        isLiked: false,
        coordinates: { lat: -1.284041, lng: 36.821946 },
        description: 'Learn street photography techniques.',
        tags: ['Photography', 'Workshop']
    },
    {
        id: 'e8',
        title: 'Rooftop Jazz Night',
        date: 'Sat, 10th May',
        time: '8:00 PM - 12:00 AM',
        location: 'Skyline Lounge',
        distance: '3.5 km',
        price: '$25',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
        category: 'nightlife',
        rating: 4.2,
        attendees: 150,
        isFeatured: false,
        isLiked: false,
        coordinates: { lat: -1.307025, lng: 36.826644 },
        description: 'Enjoy smooth jazz under the stars.',
        tags: ['Jazz', 'Rooftop', 'Cocktails']
    },
    {
        id: 'e9',
        title: 'Wine & Paint Evening',
        date: 'Sun, 11th May',
        time: '6:00 PM - 9:00 PM',
        location: 'Canvas Studio',
        distance: '1.7 km',
        price: '$45',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
        category: 'art',
        rating: 4.1,
        attendees: 30,
        isFeatured: false,
        isLiked: false,
        coordinates: { lat: -1.290567, lng: 36.815432 },
        description: 'Relax and create art with friends.',
        tags: ['Art', 'Wine', 'Social']
    },
    {
        id: 'e10',
        title: 'Blockchain Developer Meetup',
        date: 'Mon, 12th May',
        time: '7:00 PM - 9:00 PM',
        location: 'Tech Hub Kenya',
        distance: '2.3 km',
        price: '$0',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
        category: 'tech',
        rating: 4.6,
        attendees: 95,
        isFeatured: false,
        isLiked: true,
        coordinates: { lat: -1.282145, lng: 36.819876 },
        description: 'Connect with blockchain developers.',
        tags: ['Blockchain', 'Networking', 'Free']
    }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function NearbyEvents({
    initialEvents = [],
    apiKey = 'pk.eyJ1IjoicmtuZCIsImEiOiJjbWFwbTEzajAwMDVxMmlxeHY1dDdyY3h6In0.OQrYFVmEq-QL95nnbh1jTQ',
    mapStyle = 'vibrant',
    animationLevel = 'moderate'
}: NearbyEventsProps) {

    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================

    // Core data state
    const [events, setEvents] = useState<NearbyEvent[]>([]);

    // Pagination state - grouped for better management
    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        totalPages: 1,
        totalEvents: 0,
        eventsPerPage: PAGINATION_CONFIG.eventsPerPage
    });

    // Filter state - grouped object
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        category: 'all',
        priceRange: 'all',
        date: 'all',
        sortBy: 'distance'
    });

    // Map state - grouped for better organization
    const [mapState, setMapState] = useState<MapState>({
        instance: null,
        loaded: false,
        initialized: false,
        selectedEvent: null,
        hoveredEvent: null,
        currentLocation: null,
        activeStyle: 'vibrant',
        showControls: false,
        isLocationLoading: false
    });

    // UI state - grouped for clarity
    const [uiState, setUIState] = useState<UIState>({
        loading: true,
        error: null,
        viewMode: 'grid',
        showFilters: false,
        viewTransitioning: false,
        isRefreshing: false,
        favorites: new Set<string>(),
        imageLoadingStates: {}
    });

    // Refs
    const filterRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);

    // ============================================================================
    // COMPUTED VALUES
    // ============================================================================

    const categoryInfo = useMemo(() => {
        return eventCategories.find(cat => cat.id === filters.category) || eventCategories[0];
    }, [filters.category]);

    // ============================================================================
    // MAP FUNCTIONS
    // ============================================================================

    // Add user location marker
    const addUserLocationMarker = useCallback((map: mapboxgl.Map, location: Coordinates) => {
        const userMarkerEl = document.createElement('div');
        userMarkerEl.className = 'user-location-marker';
        userMarkerEl.innerHTML = `
            <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        `;

        new mapboxgl.Marker(userMarkerEl)
            .setLngLat([location.lng, location.lat])
            .addTo(map);
    }, []);

    // Add radius circle with proper typing
    const addRadiusCircle = useCallback((map: mapboxgl.Map, location: Coordinates, radiusKm: number) => {
        // Remove existing radius
        if (map.getSource('radius-source')) {
            map.removeLayer('radius-fill');
            map.removeLayer('radius-border');
            map.removeSource('radius-source');
        }

        // Create circle data
        const center: [number, number] = [location.lng, location.lat];
        const radiusInMeters = radiusKm * 1000;
        const radiusInDegrees = radiusInMeters / 111320;

        const points: [number, number][] = [];
        const steps = 64;
        for (let i = 0; i < steps; i++) {
            const angle = (i / steps) * 2 * Math.PI;
            const x = center[0] + radiusInDegrees * Math.cos(angle);
            const y = center[1] + radiusInDegrees * Math.sin(angle);
            points.push([x, y]);
        }
        points.push(points[0]); // Close the polygon

        map.addSource('radius-source', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [points]
                },
                properties: {}
            }
        });

        // Add fill and border layers
        map.addLayer({
            id: 'radius-fill',
            type: 'fill',
            source: 'radius-source',
            paint: {
                'fill-color': '#FF5722',
                'fill-opacity': 0.1
            }
        });

        map.addLayer({
            id: 'radius-border',
            type: 'line',
            source: 'radius-source',
            paint: {
                'line-color': '#FF5722',
                'line-width': 2,
                'line-opacity': 0.5
            }
        });
    }, []);

    // Add event marker with proper typing
    const addEventMarker = useCallback((map: mapboxgl.Map, event: NearbyEvent) => {
        if (!event.coordinates) return;

        const categoryInfo = eventCategories.find(cat => cat.id === event.category) || eventCategories[0];

        const markerEl = document.createElement('div');
        markerEl.className = `event-marker event-marker-${event.category} ${event.isFeatured ? 'featured' : ''} ${mapState.selectedEvent === event.id ? 'selected' : ''}`;
        markerEl.innerHTML = `
            <div class="relative">
                <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm font-bold transition-all duration-200 hover:scale-110 cursor-pointer ${event.isFeatured ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
            }">
                    ${categoryInfo.icon}
                </div>
                <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                    ${event.price === '$0' ? 'F' : event.price.replace('$', '')}
                </div>
            </div>
        `;

        // Create popup with proper HTML escaping
        const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: false
        }).setHTML(`
            <div class="p-3 max-w-sm">
                <div class="flex items-start gap-3">
                    <img src="${event.image}" alt="${event.title.replace(/"/g, '&quot;')}" class="w-16 h-16 rounded-lg object-cover flex-shrink-0">
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 text-sm line-clamp-2">${event.title}</h3>
                        <p class="text-xs text-gray-500 mt-1">${event.date}</p>
                        <p class="text-xs text-gray-600 mt-1 line-clamp-1">${event.location}</p>
                        <div class="flex items-center justify-between mt-2">
                            <span class="font-bold text-orange-600">${event.price === '$0' ? 'Free' : event.price}</span>
                            <button onclick="window.location.href='/events/${event.id}'" class="text-xs bg-orange-500 text-white px-2 py-1 rounded-md hover:bg-orange-600 transition-colors">
                                View Event
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        const marker = new mapboxgl.Marker(markerEl)
            .setLngLat([event.coordinates.lng, event.coordinates.lat])
            .setPopup(popup)
            .addTo(map);

        // Event listeners with proper typing
        markerEl.addEventListener('click', () => {
            setMapState(prev => ({
                ...prev,
                selectedEvent: prev.selectedEvent === event.id ? null : event.id
            }));
            map.flyTo({
                center: [event.coordinates!.lng, event.coordinates!.lat],
                zoom: 15,
                duration: 1000
            });
        });

        markerEl.addEventListener('mouseenter', () => {
            markerEl.classList.add('hovered');
            setMapState(prev => ({ ...prev, hoveredEvent: event.id }));
            popup.addTo(map);
        });

        markerEl.addEventListener('mouseleave', () => {
            markerEl.classList.remove('hovered');
            setMapState(prev => ({ ...prev, hoveredEvent: null }));
            popup.remove();
        });
    }, [mapState.selectedEvent]);

    // Fit map to show all events
    const fitMapToEvents = useCallback((map: mapboxgl.Map, events: NearbyEvent[], currentLocation: Coordinates | null) => {
        if (events.length === 0) return;

        const bounds = new mapboxgl.LngLatBounds();
        events.forEach(event => {
            if (event.coordinates) {
                bounds.extend([event.coordinates.lng, event.coordinates.lat]);
            }
        });
        if (currentLocation) {
            bounds.extend([currentLocation.lng, currentLocation.lat]);
        }
        map.fitBounds(bounds, { padding: 50 });
    }, []);

    // Initialize map with proper error handling and typing
    const initializeMap = useCallback(() => {
        if (!mapRef.current || mapState.initialized || typeof window === 'undefined') return;

        try {
            mapboxgl.accessToken = apiKey;

            const center = mapState.currentLocation || DEFAULT_LOCATION;

            const map = new mapboxgl.Map({
                container: mapRef.current,
                style: MAP_STYLES[mapState.activeStyle] || MAP_STYLES.vibrant,
                center: [center.lng, center.lat],
                zoom: 12,
                attributionControl: false,
                pitchWithRotate: true,
                dragRotate: true,
            });

            map.on('load', () => {
                setMapState(prev => ({ ...prev, loaded: true }));

                // Add user location marker
                if (mapState.currentLocation) {
                    addUserLocationMarker(map, mapState.currentLocation);
                    addRadiusCircle(map, mapState.currentLocation, 5);
                }

                // Add event markers
                events.forEach(event => {
                    if (event.coordinates) {
                        addEventMarker(map, event);
                    }
                });

                // Add controls
                map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
                map.addControl(new mapboxgl.GeolocateControl({
                    positionOptions: { enableHighAccuracy: true },
                    trackUserLocation: true,
                    showUserHeading: true
                }), 'bottom-right');

                // Fit map to show all events
                fitMapToEvents(map, events, mapState.currentLocation);
            });

            setMapState(prev => ({
                ...prev,
                instance: map,
                initialized: true
            }));

        } catch (error) {
            console.error('Error initializing map:', error);
            setUIState(prev => ({
                ...prev,
                error: 'Failed to load map. Please refresh the page.'
            }));
        }
    }, [apiKey, mapState.currentLocation, mapState.initialized, mapState.activeStyle, events, addUserLocationMarker, addRadiusCircle, addEventMarker, fitMapToEvents]);

    // Change map style
    const changeMapStyle = useCallback((styleId: string) => {
        setMapState(prev => ({ ...prev, activeStyle: styleId }));

        if (mapState.instance && mapState.loaded) {
            mapState.instance.setStyle(MAP_STYLES[styleId] || MAP_STYLES.vibrant);

            mapState.instance.once('style.load', () => {
                if (mapState.currentLocation) {
                    addRadiusCircle(mapState.instance!, mapState.currentLocation, 5);
                }
                events.forEach(event => {
                    if (event.coordinates) {
                        addEventMarker(mapState.instance!, event);
                    }
                });
            });
        }
    }, [mapState.instance, mapState.loaded, mapState.currentLocation, events, addRadiusCircle, addEventMarker]);

    // Fly to user location
    const flyToUserLocation = useCallback(() => {
        if (!mapState.instance || !mapState.currentLocation) return;

        setMapState(prev => ({ ...prev, isLocationLoading: true }));

        mapState.instance.flyTo({
            center: [mapState.currentLocation.lng, mapState.currentLocation.lat],
            zoom: 14,
            duration: 1500,
            essential: true
        });

        setTimeout(() => {
            setMapState(prev => ({ ...prev, isLocationLoading: false }));
        }, 1500);
    }, [mapState.instance, mapState.currentLocation]);

    // ============================================================================
    // EVENT HANDLERS
    // ============================================================================

    // Load events function with proper typing
    const loadEvents = useCallback(async (page: number = 1, showLoading: boolean = true) => {
        try {
            if (showLoading) {
                setUIState(prev => ({ ...prev, loading: true, error: null }));
            }

            const response = await eventsAPI.fetchEvents(filters, page, pagination.eventsPerPage);

            setEvents(response.events);
            setPagination(prev => ({
                ...prev,
                totalPages: response.totalPages,
                totalEvents: response.totalEvents,
                currentPage: response.currentPage
            }));

            // Initialize image loading states
            const loadingStates: Record<string, boolean> = {};
            response.events.forEach(event => {
                loadingStates[event.id] = true;
            });
            setUIState(prev => ({
                ...prev,
                imageLoadingStates: loadingStates
            }));

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
            setUIState(prev => ({ ...prev, error: errorMessage }));
            console.error('Error loading events:', err);
        } finally {
            setUIState(prev => ({
                ...prev,
                loading: false,
                isRefreshing: false
            }));
        }
    }, [filters, pagination.eventsPerPage]);

    // Handle filter changes with proper typing
    const updateFilter = useCallback((key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
    }, []);

    // Handle view mode changes
    const handleViewModeChange = useCallback((mode: 'grid' | 'map') => {
        if (mode === uiState.viewMode) return;

        setUIState(prev => ({ ...prev, viewTransitioning: true }));
        setTimeout(() => {
            setUIState(prev => ({
                ...prev,
                viewMode: mode,
                viewTransitioning: false
            }));
        }, 150);
    }, [uiState.viewMode]);

    // Handle pagination with proper typing
    const handlePageChange = useCallback((page: number) => {
        if (page >= 1 && page <= pagination.totalPages && page !== pagination.currentPage) {
            setPagination(prev => ({ ...prev, currentPage: page }));
            loadEvents(page, false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [pagination.currentPage, pagination.totalPages, loadEvents]);

    // Handle favorite toggle with proper error handling
    const toggleFavorite = useCallback(async (eventId: string) => {
        try {
            await eventsAPI.toggleFavorite(eventId);

            setUIState(prev => {
                const newFavorites = new Set(prev.favorites);
                if (newFavorites.has(eventId)) {
                    newFavorites.delete(eventId);
                } else {
                    newFavorites.add(eventId);
                }
                return { ...prev, favorites: newFavorites };
            });

            setEvents(prev => prev.map(event =>
                event.id === eventId
                    ? { ...event, isLiked: !event.isLiked }
                    : event
            ));
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
            // In a real app, you'd show a toast notification here
        }
    }, []);

    // Handle image load with proper typing
    const handleImageLoad = useCallback((eventId: string) => {
        setUIState(prev => ({
            ...prev,
            imageLoadingStates: {
                ...prev.imageLoadingStates,
                [eventId]: false
            }
        }));
    }, []);

    // Handle share with proper error handling
    const handleShare = useCallback(async (eventId: string) => {
        try {
            const result = await eventsAPI.shareEvent(eventId);
            if (navigator.share) {
                const event = events.find(e => e.id === eventId);
                await navigator.share({
                    title: event?.title || 'Check out this event',
                    url: result.shareUrl
                });
            } else {
                if (result.shareUrl) {
                    await navigator.clipboard.writeText(result.shareUrl);
                    alert('Link copied to clipboard!');
                }
            }
        } catch (err) {
            console.error('Failed to share event:', err);
        }
    }, [events]);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    // Initialize data
    useEffect(() => {
        loadEvents(1);
    }, [loadEvents]);

    // Initialize current location
    useEffect(() => {
        if (!mapState.currentLocation) {
            setMapState(prev => ({
                ...prev,
                currentLocation: DEFAULT_LOCATION
            }));
        }
    }, [mapState.currentLocation]);

    // Initialize map when view mode changes to map
    useEffect(() => {
        if (uiState.viewMode === 'map' && !mapState.initialized) {
            setTimeout(initializeMap, 100);
        }
    }, [uiState.viewMode, mapState.initialized, initializeMap]);

    // Update map markers when events change
    useEffect(() => {
        if (mapState.instance && mapState.loaded && events.length > 0) {
            events.forEach(event => {
                if (event.coordinates) {
                    addEventMarker(mapState.instance!, event);
                }
            });
        }
    }, [mapState.instance, mapState.loaded, events, addEventMarker]);

    // Handle click outside filters
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setUIState(prev => ({ ...prev, showFilters: false }));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ============================================================================
    // PAGINATION COMPONENT
    // ============================================================================

    const PaginationControls: React.FC = () => {
        const pages: number[] = [];
        const showPages = PAGINATION_CONFIG.maxPageButtons;

        let startPage = Math.max(1, pagination.currentPage - Math.floor(showPages / 2));
        const endPage = Math.min(pagination.totalPages, startPage + showPages - 1);

        if (endPage - startPage + 1 < showPages) {
            startPage = Math.max(1, endPage - showPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center gap-2 mt-8">
                <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!!pagination.currentPage && pagination.currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    type="button"
                >
                    <FiChevronLeft size={18} />
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                            type="button"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="text-gray-400">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors ${pagination.currentPage === page
                            ? 'bg-orange-500 text-white'
                            : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        type="button"
                    >
                        {page}
                    </button>
                ))}

                {endPage < pagination.totalPages && (
                    <>
                        {endPage < pagination.totalPages - 1 && <span className="text-gray-400">...</span>}
                        <button
                            onClick={() => handlePageChange(pagination.totalPages)}
                            className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                            type="button"
                        >
                            {pagination.totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!!pagination.currentPage && !!pagination.totalPages && pagination.currentPage === pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    type="button"
                >
                    <FiChevronRight size={18} />
                </button>
            </div>
        );
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Enhanced Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Title Section */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Nearby Events
                                </h1>
                                <p className="text-gray-500 text-sm mt-1 flex items-center">
                                    <FiMapPin size={14} className="mr-1.5" />
                                    {pagination.totalEvents} events found within 5 km
                                </p>
                            </div>
                        </div>

                        {/* Controls Section */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Search Bar */}
                            <div className="relative flex-1 min-w-64">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search events, locations..."
                                    value={filters.search}
                                    onChange={(e) => updateFilter('search', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm"
                                />
                            </div>

                            {/* View Mode Toggle - Only Grid and Map */}
                            <div className="bg-white border border-gray-200 rounded-xl p-1 flex">
                                <button
                                    onClick={() => handleViewModeChange('grid')}
                                    className={`p-2 rounded-lg transition-all duration-200 ${uiState.viewMode === 'grid'
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                    title="Grid view"
                                    type="button"
                                >
                                    <FiGrid size={18} />
                                </button>
                                <button
                                    onClick={() => handleViewModeChange('map')}
                                    className={`p-2 rounded-lg transition-all duration-200 ${uiState.viewMode === 'map'
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                    title="Map view"
                                    type="button"
                                >
                                    <FiMapPin size={18} />
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <select
                                value={filters.sortBy}
                                onChange={(e) => updateFilter('sortBy', e.target.value)}
                                className="bg-white border border-gray-200 rounded-xl text-sm px-3 py-2.5 pr-8 appearance-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                            >
                                <option value="distance">Nearest First</option>
                                <option value="date">By Date</option>
                                <option value="price">Price: Low to High</option>
                                <option value="rating">Highest Rated</option>
                                <option value="popularity">Most Popular</option>
                            </select>

                            {/* Compact Filters Button */}
                            <div className="relative" ref={filterRef}>
                                <button
                                    onClick={() => setUIState(prev => ({ ...prev, showFilters: !prev.showFilters }))}
                                    className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-sm font-medium transition-all ${Object.values(filters).some(v => v !== 'all' && v !== 'distance' && v !== '')
                                        ? 'bg-orange-50 text-orange-600 border-orange-200'
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    type="button"
                                >
                                    <FiFilter size={16} />
                                    Filters
                                    {Object.values(filters).some(v => v !== 'all' && v !== 'distance' && v !== '') && (
                                        <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                                            {Object.values(filters).filter(v => v !== 'all' && v !== 'distance' && v !== '').length}
                                        </span>
                                    )}
                                </button>

                                {/* Compact Filters Panel */}
                                <AnimatePresence>
                                    {uiState.showFilters && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-gray-200/50 z-50 overflow-hidden"
                                        >
                                            <div className="p-4">
                                                {/* Categories - Compact Grid */}
                                                <div className="mb-4">
                                                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">Categories</h3>
                                                    <div className="grid grid-cols-4 gap-1">
                                                        {eventCategories.slice(0, 8).map(category => (
                                                            <button
                                                                key={category.id}
                                                                onClick={() => updateFilter('category', category.id)}
                                                                className={`p-2 rounded-lg text-center transition-all duration-200 ${filters.category === category.id
                                                                    ? category.color + ' border border-current font-medium'
                                                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                                    }`}
                                                                type="button"
                                                            >
                                                                <div className="text-sm mb-0.5">{category.icon}</div>
                                                                <div className="text-xs">{category.name}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Price & Date in two columns */}
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    {/* Price Range */}
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 mb-2 text-sm">Price</h3>
                                                        <div className="space-y-1">
                                                            {[
                                                                { id: 'all', name: 'Any' },
                                                                { id: 'free', name: 'Free' },
                                                                { id: 'under50', name: '<$50' },
                                                                { id: 'under100', name: '<$100' },
                                                            ].map(option => (
                                                                <button
                                                                    key={option.id}
                                                                    onClick={() => updateFilter('priceRange', option.id)}
                                                                    className={`w-full p-1.5 rounded-md text-xs transition-all ${filters.priceRange === option.id
                                                                        ? 'bg-orange-100 text-orange-700'
                                                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                                        }`}
                                                                    type="button"
                                                                >
                                                                    {option.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Date Filter */}
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 mb-2 text-sm">When</h3>
                                                        <div className="space-y-1">
                                                            {[
                                                                { id: 'all', name: 'Any' },
                                                                { id: 'today', name: 'Today' },
                                                                { id: 'tomorrow', name: 'Tomorrow' },
                                                                { id: 'this-weekend', name: 'Weekend' },
                                                            ].map(option => (
                                                                <button
                                                                    key={option.id}
                                                                    onClick={() => updateFilter('date', option.id)}
                                                                    className={`w-full p-1.5 rounded-md text-xs transition-all ${filters.date === option.id
                                                                        ? 'bg-orange-100 text-orange-700'
                                                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                                        }`}
                                                                    type="button"
                                                                >
                                                                    {option.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                    <button
                                                        onClick={() => setFilters({
                                                            search: '',
                                                            category: 'all',
                                                            priceRange: 'all',
                                                            date: 'all',
                                                            sortBy: 'distance'
                                                        })}
                                                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                                        type="button"
                                                    >
                                                        Clear all
                                                    </button>
                                                    <button
                                                        onClick={() => setUIState(prev => ({ ...prev, showFilters: false }))}
                                                        className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors"
                                                        type="button"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error State */}
                {uiState.error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center">
                            <FiX className="text-red-500 mr-2" size={20} />
                            <span className="text-red-700">{uiState.error}</span>
                            <button
                                onClick={() => {
                                    setUIState(prev => ({ ...prev, error: null }));
                                    loadEvents(pagination.currentPage);
                                }}
                                className="ml-auto text-red-600 hover:text-red-800 transition-colors"
                                type="button"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {uiState.loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array(8).fill(0).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                )}

                {/* No Events State */}
                {!uiState.loading && !uiState.error && events.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <FiCalendar className="text-gray-400" size={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No events found</h2>
                        <p className="text-gray-500 max-w-md mb-6">
                            We couldn&apos;t find any events matching your criteria. Try adjusting your filters.
                        </p>
                        <button
                            onClick={() => {
                                setFilters({
                                    search: '',
                                    category: 'all',
                                    priceRange: 'all',
                                    date: 'all',
                                    sortBy: 'distance'
                                });
                                setPagination(prev => ({ ...prev, currentPage: 1 }));
                            }}
                            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                            type="button"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* Events Content */}
                {!uiState.loading && !uiState.error && events.length > 0 && (
                    <AnimatePresence mode="wait">
                        {uiState.viewTransitioning ? (
                            <motion.div
                                key="transition"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center py-16"
                            >
                                <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
                            </motion.div>
                        ) : (
                            <>
                                {uiState.viewMode === 'map' ? (
                                    <motion.div
                                        key="map"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative h-[75vh] bg-gray-200 rounded-2xl overflow-hidden shadow-lg"
                                    >
                                        {/* Map Container */}
                                        <div ref={mapRef} className="w-full h-full" />

                                        {/* Map Loading State */}
                                        {!mapState.loaded && (
                                            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                                                    <p className="text-gray-600 font-medium">Loading map...</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Map Controls Overlay */}
                                        {mapState.loaded && (
                                            <>
                                                {/* Top Left Controls */}
                                                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                                    {/* Location Button */}
                                                    <button
                                                        onClick={flyToUserLocation}
                                                        disabled={mapState.isLocationLoading}
                                                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center text-orange-600 hover:bg-white hover:text-orange-700 transition-all"
                                                        title="Go to my location"
                                                        type="button"
                                                    >
                                                        {mapState.isLocationLoading ? (
                                                            <div className="w-5 h-5 border-2 border-orange-600/30 border-t-orange-600 rounded-full animate-spin"></div>
                                                        ) : (
                                                            <FiNavigation size={18} />
                                                        )}
                                                    </button>

                                                    {/* Map Style Toggle */}
                                                    <button
                                                        onClick={() => setMapState(prev => ({ ...prev, showControls: !prev.showControls }))}
                                                        className={`w-10 h-10 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center transition-all ${mapState.showControls
                                                            ? 'bg-orange-500 text-white'
                                                            : 'bg-white/90 text-orange-600 hover:bg-white hover:text-orange-700'
                                                            }`}
                                                        title="Map controls"
                                                        type="button"
                                                    >
                                                        <FiCompass size={18} />
                                                    </button>
                                                </div>

                                                {/* Map Style Menu */}
                                                <AnimatePresence>
                                                    {mapState.showControls && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            className="absolute top-4 left-20 z-10 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden"
                                                        >
                                                            <div className="p-2">
                                                                <div className="text-sm font-medium text-gray-900 px-2 py-1.5 border-b border-gray-100">
                                                                    Map Style
                                                                </div>
                                                                <div className="mt-1 space-y-1">
                                                                    {[
                                                                        { id: 'vibrant', name: 'Vibrant' },
                                                                        { id: 'light', name: 'Light' },
                                                                        { id: 'dark', name: 'Dark' },
                                                                        { id: 'satellite', name: 'Satellite' }
                                                                    ].map(style => (
                                                                        <button
                                                                            key={style.id}
                                                                            onClick={() => {
                                                                                changeMapStyle(style.id);
                                                                                setMapState(prev => ({ ...prev, showControls: false }));
                                                                            }}
                                                                            className={`w-full px-3 py-1.5 text-left text-sm rounded-lg transition-all ${mapState.activeStyle === style.id
                                                                                ? 'bg-orange-100 text-orange-700 font-medium'
                                                                                : 'hover:bg-gray-50 text-gray-700'
                                                                                }`}
                                                                            type="button"
                                                                        >
                                                                            {style.name}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Event Info Panel */}
                                                {mapState.selectedEvent && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 20 }}
                                                        className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4"
                                                    >
                                                        {(() => {
                                                            const event = events.find(e => e.id === mapState.selectedEvent);
                                                            if (!event) return null;

                                                            return (
                                                                <div className="flex items-center gap-4">
                                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                                        <Image
                                                                            src={event.image}
                                                                            alt={event.title}
                                                                            fill
                                                                            className="object-cover"
                                                                            sizes="64px"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 className="font-semibold text-gray-900 line-clamp-1">{event.title}</h3>
                                                                        <p className="text-sm text-gray-500">{event.date} • {event.time.split(' - ')[0]}</p>
                                                                        <p className="text-sm text-gray-600 line-clamp-1">{event.location}</p>
                                                                        <div className="flex items-center gap-4 mt-1">
                                                                            <span className="font-bold text-orange-600">
                                                                                {event.price === '$0' ? 'Free' : event.price}
                                                                            </span>
                                                                            {event.rating && (
                                                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                                    <FiStar size={14} className="text-yellow-400" fill="currentColor" />
                                                                                    {event.rating}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col gap-2">
                                                                        <a
                                                                            href={`/events/${event.id}`}
                                                                            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors text-center"
                                                                        >
                                                                            View Event
                                                                        </a>
                                                                        <button
                                                                            onClick={() => setMapState(prev => ({ ...prev, selectedEvent: null }))}
                                                                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                                            type="button"
                                                                        >
                                                                            <FiX size={16} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                    </motion.div>
                                                )}

                                                {/* Search Overlay */}
                                                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-sm px-4">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Search events on map..."
                                                            value={filters.search}
                                                            onChange={(e) => updateFilter('search', e.target.value)}
                                                            className="w-full py-2.5 pl-10 pr-4 bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                                        />
                                                        <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                                    </div>
                                                </div>

                                                {/* Legend */}
                                                <div className="absolute top-20 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-3">
                                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Event Types</h3>
                                                    <div className="space-y-1">
                                                        {eventCategories.slice(1, 6).map(category => (
                                                            <div key={category.id} className="flex items-center gap-2 text-xs">
                                                                <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                                    {category.icon}
                                                                </div>
                                                                <span className="text-gray-600">{category.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="grid"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
                                    >
                                        {events.map((event, index) => (
                                            <motion.div
                                                key={event.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="h-full"
                                            >
                                                <EventCard
                                                    event={event}
                                                    isFavorite={uiState.favorites.has(event.id)}
                                                    onToggleFavorite={toggleFavorite}
                                                    onShare={handleShare}
                                                    onImageLoad={handleImageLoad}
                                                    isImageLoading={!!uiState.imageLoadingStates[event.id]}
                                                />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Pagination */}
                                {uiState.viewMode === 'grid' && pagination.totalPages > 1 && <PaginationControls />}
                            </>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// EVENT CARD COMPONENT
// ============================================================================

interface EventCardProps {
    event: NearbyEvent;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    onShare: (id: string) => void;
    onImageLoad: (id: string) => void;
    isImageLoading: boolean;
}

function EventCard({
    event,
    isFavorite,
    onToggleFavorite,
    onShare,
    onImageLoad,
    isImageLoading
}: EventCardProps) {
    const categoryInfo = eventCategories.find(cat => cat.id === event.category) || eventCategories[0];
    const stableCoinPrice = convertToStableCoin(event.price);

    const handleClick = (e: React.MouseEvent) => {
        // Allow the link to navigate normally
        window.location.href = `/events/${event.id}`;
    };

    const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        action();
    };

    return (
        <div
            onClick={handleClick}
            className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/10 hover:-translate-y-1 shadow-sm h-full flex flex-col cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
                {isImageLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse">
                        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                    </div>
                )}
                <div className="relative w-full h-full">
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className={`object-cover transition-all duration-700 group-hover:scale-110 ${isImageLoading ? 'opacity-0' : 'opacity-100'
                            }`}
                        onLoad={() => onImageLoad(event.id)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        priority={false}
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {event.isFeatured === true && (
                        <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <FiStar size={10} fill="currentColor" />
                            Featured
                        </div>
                    )}
                    <div className="bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <FiMapPin size={10} />
                        {event.distance}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2">
                    <button
                        onClick={(e) => handleButtonClick(e, () => onShare(event.id))}
                        className="w-8 h-8 bg-black/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
                        type="button"
                    >
                        <FiShare2 size={14} />
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, () => onToggleFavorite(event.id))}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isFavorite
                            ? 'bg-red-500 text-white'
                            : 'bg-black/20 backdrop-blur-sm text-white hover:bg-black/30'
                            }`}
                        type="button"
                    >
                        <FiHeart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-3 left-3">
                    <div className={`${categoryInfo.color} backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5`}>
                        <span>{categoryInfo.icon}</span>
                        {categoryInfo.name}
                    </div>
                </div>
            </div>

            {/* Content Section - Flexible */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {event.title}
                    </h3>

                    <div className="space-y-2 mb-3">
                        <div className="flex items-center text-gray-500 text-sm">
                            <FiCalendar size={14} className="mr-1.5" />
                            {event.date}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                            <FiClock size={14} className="mr-1.5" />
                            {event.time.split(' - ')[0]}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                            <FiMapPin size={14} className="mr-1.5" />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>
                    </div>

                    {(event.rating || event.attendees) && (
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            {event.rating && (
                                <div className="flex items-center gap-1">
                                    <FiStar size={14} className="text-yellow-400" fill="currentColor" />
                                    <span>{event.rating}</span>
                                </div>
                            )}
                            {event.attendees && (
                                <div className="flex items-center gap-1">
                                    <FiUsers size={14} />
                                    <span>{event.attendees} going</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer - Fixed at bottom */}
                <div className="pt-3 border-t border-gray-100 mt-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className={`font-bold text-lg ${event.price === '$0' ? 'text-green-600' : 'text-orange-600'
                                }`}>
                                {event.price === '$0' ? 'Free' : event.price}
                            </span>
                            {/* Stable coin price - uncomment to enable */}
                            {/* {STABLE_COIN_CONFIG.enabled && stableCoinPrice && event.price !== '$0' && (
                                <span className="text-xs text-gray-500">
                                    ≈ {stableCoinPrice}
                                </span>
                            )} */}
                        </div>

                        <div className="flex items-center gap-2 text-orange-600">
                            <span className="text-sm font-medium">View Event</span>
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                <IoArrowUpOutline size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// SKELETON COMPONENT
// ============================================================================

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/50 shadow-sm h-full flex flex-col">
            <div className="aspect-[4/3] bg-gray-200 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
                    <div className="space-y-2 mb-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                    </div>
                    <div className="flex gap-4 mb-3">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                </div>
                <div className="pt-3 border-t border-gray-100 mt-auto">
                    <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// STYLES
// ============================================================================

/* Custom shimmer animation */
const styles = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Map marker styles */
.event-marker {
  cursor: pointer;
  transition: all 0.2s ease;
}

.event-marker:hover {
  z-index: 1000;
}

.event-marker.selected {
  z-index: 1001;
  transform: scale(1.2);
}

.event-marker.featured {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.user-location-marker {
  z-index: 100;
}

/* Map popup custom styles */
.mapboxgl-popup-content {
  padding: 0 !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}

.mapboxgl-popup-tip {
  border-top-color: white !important;
}

.mapboxgl-popup-close-button {
  display: none !important;
}

/* Hide mapbox attribution */
.mapboxgl-ctrl-attrib {
  display: none !important;
}

/* Custom control positioning */
.mapboxgl-ctrl-bottom-right {
  bottom: 12px !important;
  right: 12px !important;
}

.mapboxgl-ctrl-bottom-left {
  bottom: 12px !important;
  left: 12px !important;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const existingStyle = document.getElementById('rovify-styles');
    if (!existingStyle) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'rovify-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}