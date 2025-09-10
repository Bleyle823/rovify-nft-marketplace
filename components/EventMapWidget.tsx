/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiX, FiFilter, FiMapPin, FiCalendar, FiUsers, FiNavigation,
    FiCompass, FiRefreshCw, FiMaximize2, FiMinimize2, FiSearch,
    FiLayers, FiZoomIn, FiZoomOut, FiStar, FiPhone, FiShare2,
    FiClock, FiPlay, FiPause, FiVolume2, FiVolumeX,
    FiTarget, FiWifi, FiWifiOff, FiDownload, FiTrash2, FiInfo
} from "react-icons/fi";
import {
    BsGlobe, BsFire, BsFullscreen, BsFullscreenExit, BsCart,
    BsBicycle, BsPersonWalking, BsSpeedometer2,
    BsStopwatch, BsFuelPump, BsShield, BsCloudDownload,
    BsCarFront
} from "react-icons/bs";
const BsCar = BsCarFront;
import { IoLocationSharp, IoNavigateOutline } from "react-icons/io5";

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Import external libraries with proper type handling
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

// Local type definitions for external libraries
interface DirectionsOptions {
    accessToken: string;
    unit?: 'imperial' | 'metric';
    profile?: string;
    alternatives?: boolean;
    geometries?: 'geojson' | 'polyline' | 'polyline6';
    controls?: {
        instructions?: boolean;
        profileSwitcher?: boolean;
        inputs?: boolean;
    };
    flyTo?: boolean;
    placeholderOrigin?: string;
    placeholderDestination?: string;
}

interface RouteEvent {
    route: RouteData[];
}

interface RouteData {
    duration: number;
    distance: number;
    geometry: GeoJSON.LineString;
    legs: RouteLeg[];
}

interface RouteLeg {
    steps: RouteStep[];
}

interface RouteStep {
    distance: number;
    duration: number;
    maneuver: {
        instruction: string;
        location: [number, number];
    };
}

interface DirectionsControl {
    constructor: (options: DirectionsOptions) => DirectionsControl;
    on: (event: string, callback: (e: RouteEvent) => void) => void;
    addTo: (map: mapboxgl.Map) => DirectionsControl;
}

interface GeocoderOptions {
    accessToken: string;
    mapboxgl?: typeof mapboxgl;
    countries?: string;
    types?: string;
    placeholder?: string;
    proximity?: [number, number];
    bbox?: [number, number, number, number];
    limit?: number;
    enableEventLogging?: boolean;
}

interface GeocoderControl {
    constructor: (options: GeocoderOptions) => GeocoderControl;
    addTo: (map: mapboxgl.Map) => GeocoderControl;
}

// Type the imported modules
const TypedMapboxDirections = MapboxDirections as unknown as new (options: DirectionsOptions) => DirectionsControl;
const TypedMapboxGeocoder = MapboxGeocoder as unknown as new (options: GeocoderOptions) => GeocoderControl;

// Enhanced Types
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
    isHot?: boolean;
    isFeatured?: boolean;
}

interface LocationState {
    current: { lat: number; lng: number } | null;
    accuracy: number | null;
    heading: number | null;
    speed: number | null;
    timestamp: number | null;
    isTracking: boolean;
    permissionGranted: boolean;
    error: string | null;
}

interface RouteInstruction {
    distance?: number;
    duration?: number;
    maneuver?: {
        instruction: string;
        location: [number, number];
    };
}

interface NavigationRoute {
    duration: number;
    distance: number;
    geometry: GeoJSON.LineString;
    legs: Array<{
        steps: RouteInstruction[];
    }>;
}

interface NavigationState {
    isNavigating: boolean;
    destination: Event | null;
    route: NavigationRoute | null;
    instructions: RouteInstruction[];
    currentStep: number;
    eta: string | null;
    distance: string | null;
    duration: string | null;
    routeGeometry: GeoJSON.LineString | null;
    alternatives: NavigationRoute[];
    selectedProfile: 'driving' | 'walking' | 'cycling' | 'driving-traffic';
    trafficEnabled: boolean;
    voiceEnabled: boolean;
    offlineMode: boolean;
}

interface MapState {
    instance: mapboxgl.Map | null;
    loaded: boolean;
    initialized: boolean;
    selectedEvent: string | null;
    hoveredEvent: string | null;
    activeStyle: string;
    showControls: boolean;
    zoom: number;
    center: [number, number];
    isFullscreen: boolean;
    markers: mapboxgl.Marker[];
    userMarker: mapboxgl.Marker | null;
    directionsControl: DirectionsControl | null;
    geocoderControl: GeocoderControl | null;
    bearing: number;
    pitch: number;
    is3D: boolean;
}

interface EventMapWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    events: Event[];
    title?: string;
    showFilter?: boolean;
    className?: string;
    apiKey: string; // Required for production
    mapStyle?: string;
    defaultLocation?: { lat: number; lng: number };
    enableNavigation?: boolean;
    enable3D?: boolean;
    enableOffline?: boolean;
    onEventSelect?: (event: Event) => void;
    onNavigationStart?: (destination: Event) => void;
    onNavigationEnd?: () => void;
}

// Enhanced map styles with custom configurations
const MAP_STYLES = {
    vibrant: 'mapbox://styles/mapbox/navigation-night-v1',
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    terrain: 'mapbox://styles/mapbox/outdoors-v12',
    navigation: 'mapbox://styles/mapbox/navigation-day-v1',
    traffic: 'mapbox://styles/mapbox/traffic-day-v2'
};

// Transportation profiles with realistic data
const TRANSPORT_PROFILES = {
    'driving-traffic': {
        icon: BsCar,
        label: 'Driving',
        description: 'Fastest route by car with real-time traffic',
        color: 'text-blue-600',
        avgSpeed: '50 km/h'
    },
    'driving': {
        icon: BsCar,
        label: 'Driving (No Traffic)',
        description: 'Driving route without traffic data',
        color: 'text-blue-500',
        avgSpeed: '60 km/h'
    },
    'walking': {
        icon: BsPersonWalking,
        label: 'Walking',
        description: 'Pedestrian-friendly route',
        color: 'text-green-600',
        avgSpeed: '5 km/h'
    },
    'cycling': {
        icon: BsBicycle,
        label: 'Cycling',
        description: 'Bike-friendly route with bike lanes',
        color: 'text-orange-600',
        avgSpeed: '15 km/h'
    }
};

// Default location (Nairobi, Kenya)
const DEFAULT_LOCATION = { lat: -1.286389, lng: 36.817223 };

const EventMapWidget: React.FC<EventMapWidgetProps> = ({
    isOpen,
    onClose,
    events,
    title = "Event Navigator",
    showFilter = true,
    className = "",
    apiKey,
    mapStyle = 'navigation',
    defaultLocation = DEFAULT_LOCATION,
    enableNavigation = true,
    enable3D = true,
    enableOffline = false,
    onEventSelect,
    onNavigationStart,
    onNavigationEnd
}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const watchIdRef = useRef<number | null>(null);
    const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

    // Enhanced state management
    const [mapState, setMapState] = useState<MapState>({
        instance: null,
        loaded: false,
        initialized: false,
        selectedEvent: null,
        hoveredEvent: null,
        activeStyle: mapStyle,
        showControls: false,
        zoom: 12,
        center: [defaultLocation.lng, defaultLocation.lat],
        isFullscreen: false,
        markers: [],
        userMarker: null,
        directionsControl: null,
        geocoderControl: null,
        bearing: 0,
        pitch: 0,
        is3D: false
    });

    const [locationState, setLocationState] = useState<LocationState>({
        current: null,
        accuracy: null,
        heading: null,
        speed: null,
        timestamp: null,
        isTracking: false,
        permissionGranted: false,
        error: null
    });

    const [navigationState, setNavigationState] = useState<NavigationState>({
        isNavigating: false,
        destination: null,
        route: null,
        instructions: [],
        currentStep: 0,
        eta: null,
        distance: null,
        duration: null,
        routeGeometry: null,
        alternatives: [],
        selectedProfile: 'driving-traffic',
        trafficEnabled: true,
        voiceEnabled: true,
        offlineMode: false
    });

    const [uiState, setUIState] = useState({
        searchQuery: '',
        showLegend: true,
        showSearch: true,
        showNavigation: false,
        showRouteOptions: false,
        error: null as string | null,
        isLoading: true,
        connectionStatus: 'online' as 'online' | 'offline',
        downloadProgress: 0
    });

    // Initialize Mapbox and geolocation
    useEffect(() => {
        if (!apiKey) {
            setUIState(prev => ({
                ...prev,
                error: 'Mapbox API key is required for production use',
                isLoading: false
            }));
            return;
        }

        mapboxgl.accessToken = apiKey;

        // Initialize speech synthesis for voice navigation
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            speechSynthesisRef.current = window.speechSynthesis;
        }

        // Check geolocation permission
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then(permission => {
                setLocationState(prev => ({
                    ...prev,
                    permissionGranted: permission.state === 'granted'
                }));

                permission.addEventListener('change', () => {
                    setLocationState(prev => ({
                        ...prev,
                        permissionGranted: permission.state === 'granted'
                    }));
                });
            });
        }

        // Monitor connection status
        const updateConnectionStatus = () => {
            setUIState(prev => ({
                ...prev,
                connectionStatus: navigator.onLine ? 'online' : 'offline'
            }));
        };

        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);

        return () => {
            window.removeEventListener('online', updateConnectionStatus);
            window.removeEventListener('offline', updateConnectionStatus);
        };
    }, [apiKey]);

    // Calculate distance between two points
    const calculateDistance = useCallback((point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
        const R = 6371; // Earth's radius in km
        const dLat = (point2.lat - point1.lat) * Math.PI / 180;
        const dLng = (point2.lng - point1.lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    // Speak navigation instruction
    const speakInstruction = useCallback((instruction: string) => {
        if (!speechSynthesisRef.current || !navigationState.voiceEnabled) return;

        // Cancel any ongoing speech
        speechSynthesisRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(instruction);
        utterance.rate = 0.8;
        utterance.volume = 0.8;
        utterance.lang = 'en-US';

        speechSynthesisRef.current.speak(utterance);
    }, [navigationState.voiceEnabled]);

    // Update navigation progress based on current location
    const updateNavigationProgress = useCallback((currentLocation: { lat: number; lng: number }) => {
        if (!navigationState.isNavigating || !navigationState.instructions.length) return;

        // Calculate distance to next instruction
        const nextInstruction = navigationState.instructions[navigationState.currentStep];
        if (nextInstruction && nextInstruction.maneuver) {
            const instructionLocation = nextInstruction.maneuver.location;
            const distance = calculateDistance(
                currentLocation,
                { lat: instructionLocation[1], lng: instructionLocation[0] }
            );

            // If within 50m of instruction, advance to next step
            if (distance < 0.05 && navigationState.currentStep < navigationState.instructions.length - 1) {
                const newStep = navigationState.currentStep + 1;
                setNavigationState(prev => ({ ...prev, currentStep: newStep }));

                const instruction = navigationState.instructions[newStep];
                if (instruction && instruction.maneuver && navigationState.voiceEnabled) {
                    speakInstruction(instruction.maneuver.instruction);
                }
            }
        }
    }, [calculateDistance, navigationState.isNavigating, navigationState.instructions, navigationState.currentStep, navigationState.voiceEnabled, speakInstruction]);

    // Add accuracy circle around user location
    const addAccuracyCircle = useCallback((map: mapboxgl.Map, location: { lat: number; lng: number }, accuracy: number) => {
        const sourceId = 'user-accuracy';

        // Remove existing accuracy circle
        if (map.getSource(sourceId)) {
            map.removeLayer('accuracy-fill');
            map.removeLayer('accuracy-border');
            map.removeSource(sourceId);
        }

        // Create circle geometry
        const radiusInMeters = Math.max(accuracy, 10); // Minimum 10m radius
        const radiusInDegrees = radiusInMeters / 111320; // Convert to degrees

        const points: number[][] = [];
        const steps = 32;
        for (let i = 0; i < steps; i++) {
            const angle = (i / steps) * 2 * Math.PI;
            const x = location.lng + radiusInDegrees * Math.cos(angle);
            const y = location.lat + radiusInDegrees * Math.sin(angle);
            points.push([x, y]);
        }
        points.push(points[0]); // Close the polygon

        map.addSource(sourceId, {
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

        map.addLayer({
            id: 'accuracy-fill',
            type: 'fill',
            source: sourceId,
            paint: {
                'fill-color': '#007cbf',
                'fill-opacity': 0.1
            }
        });

        map.addLayer({
            id: 'accuracy-border',
            type: 'line',
            source: sourceId,
            paint: {
                'line-color': '#007cbf',
                'line-width': 1,
                'line-opacity': 0.3
            }
        });
    }, []);

    // Update user location marker with enhanced visualization
    const updateUserLocationMarker = useCallback((map: mapboxgl.Map, location: { lat: number; lng: number }, heading: number | null, accuracy: number | null) => {
        // Remove existing user marker
        if (mapState.userMarker) {
            mapState.userMarker.remove();
        }

        // Create enhanced user marker with direction arrow
        const userMarkerEl = document.createElement('div');
        userMarkerEl.className = 'user-location-marker';
        userMarkerEl.innerHTML = `
            <div class="relative">
                <div class="w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-lg animate-pulse flex items-center justify-center">
                    ${heading !== null ? `<div class="w-2 h-2 bg-white rounded-full transform rotate-${Math.round(heading)}deg"></div>` : ''}
                </div>
                <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30"></div>
                ${accuracy ? `<div class="absolute inset-0 border-2 border-blue-300 rounded-full opacity-50" style="width: ${Math.min(accuracy / 5, 50)}px; height: ${Math.min(accuracy / 5, 50)}px; margin: -${Math.min(accuracy / 10, 25)}px;"></div>` : ''}
            </div>
        `;

        const userMarker = new mapboxgl.Marker(userMarkerEl)
            .setLngLat([location.lng, location.lat])
            .addTo(map);

        setMapState(prev => ({ ...prev, userMarker }));

        // Add accuracy circle if available
        if (accuracy && accuracy > 0) {
            addAccuracyCircle(map, location, accuracy);
        }
    }, [mapState.userMarker, addAccuracyCircle]);

    // Start real-time location tracking
    const startLocationTracking = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationState(prev => ({
                ...prev,
                error: 'Geolocation is not supported by this browser'
            }));
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000 // 5 seconds
        };

        const success = (position: GeolocationPosition) => {
            const { latitude, longitude, accuracy, heading, speed } = position.coords;
            const newLocation = { lat: latitude, lng: longitude };

            setLocationState(prev => ({
                ...prev,
                current: newLocation,
                accuracy,
                heading: heading || null,
                speed: speed || null,
                timestamp: position.timestamp,
                isTracking: true,
                error: null
            }));

            // Update user marker on map
            if (mapState.instance) {
                updateUserLocationMarker(mapState.instance, newLocation, heading, accuracy);
            }

            // Update navigation if active
            if (navigationState.isNavigating) {
                updateNavigationProgress(newLocation);
            }
        };

        const error = (err: GeolocationPositionError) => {
            console.error('Geolocation error:', err);
            let errorMessage = 'Location access denied';

            switch (err.code) {
                case err.PERMISSION_DENIED:
                    errorMessage = 'Location access denied by user';
                    break;
                case err.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information unavailable';
                    break;
                case err.TIMEOUT:
                    errorMessage = 'Location request timed out';
                    break;
            }

            setLocationState(prev => ({
                ...prev,
                error: errorMessage,
                isTracking: false
            }));
        };

        // Start watching position
        watchIdRef.current = navigator.geolocation.watchPosition(success, error, options);

        setLocationState(prev => ({ ...prev, isTracking: true }));
    }, [mapState.instance, navigationState.isNavigating, updateUserLocationMarker, updateNavigationProgress]);

    // Stop location tracking
    const stopLocationTracking = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setLocationState(prev => ({ ...prev, isTracking: false }));
    }, []);

    // Remove event popup
    const removeEventPopup = useCallback((map: mapboxgl.Map) => {
        const mapWithPopup = map as mapboxgl.Map & { _eventPopup?: mapboxgl.Popup };
        if (mapWithPopup._eventPopup) {
            mapWithPopup._eventPopup.remove();
            mapWithPopup._eventPopup = undefined;
        }
    }, []);

    // Show event popup on hover
    const showEventPopup = useCallback((map: mapboxgl.Map, lngLat: mapboxgl.LngLat, event: Event) => {
        removeEventPopup(map); // Remove existing popup

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 15
        })
            .setLngLat(lngLat)
            .setHTML(`
            <div class="event-popup p-3 max-w-xs">
                <div class="flex gap-3">
                    <img src="${event.image}" alt="${event.title}" class="w-12 h-12 rounded-lg object-cover">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-sm mb-1 line-clamp-2">${event.title}</h4>
                        <p class="text-xs text-gray-600 mb-1">${event.date.toLocaleDateString()}</p>
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-orange-600 text-sm">${event.price.amount === 0 ? 'Free' : event.price.min}</span>
                            <span class="text-xs text-gray-500">${event.attendees} attending</span>
                        </div>
                    </div>
                </div>
            </div>
        `)
            .addTo(map);

        // Store popup reference for removal
        const mapWithPopup = map as mapboxgl.Map & { _eventPopup?: mapboxgl.Popup };
        mapWithPopup._eventPopup = popup;
    }, [removeEventPopup]);

    // Select an event and show navigation options
    const selectEvent = useCallback((event: Event) => {
        setMapState(prev => ({ ...prev, selectedEvent: event.id }));
        setUIState(prev => ({ ...prev, showNavigation: true }));

        // Fly to event location
        if (mapState.instance) {
            mapState.instance.flyTo({
                center: [event.location.coordinates.lng, event.location.coordinates.lat],
                zoom: 16,
                duration: 1500
            });
        }
    }, [mapState.instance]);

    // Add clustered event markers for better performance
    const addClusteredEventMarkers = useCallback((map: mapboxgl.Map, events: Event[]) => {
        // Clear existing markers
        mapState.markers.forEach(marker => marker.remove());

        // Prepare event data for clustering
        const eventFeatures: GeoJSON.Feature[] = events.map(event => ({
            type: 'Feature' as const,
            properties: {
                id: event.id,
                title: event.title,
                category: event.category,
                price: event.price.min,
                attendees: event.attendees,
                isHot: event.isHot,
                isFeatured: event.isFeatured,
                image: event.image,
                date: event.date.toISOString(),
                location: event.location.name
            },
            geometry: {
                type: 'Point' as const,
                coordinates: [event.location.coordinates.lng, event.location.coordinates.lat]
            }
        }));

        // Add clustered source
        map.addSource('events', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: eventFeatures
            },
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
        });

        // Add cluster circles
        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'events',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6',
                    10,
                    '#f1f075',
                    20,
                    '#f28cb1'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    10,
                    25,
                    20,
                    30
                ]
            }
        });

        // Add cluster count labels
        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'events',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        // Add individual event markers
        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'events',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': [
                    'case',
                    ['get', 'isHot'], '#ff4444',
                    ['get', 'isFeatured'], '#ff8800',
                    '#0099ff'
                ],
                'circle-radius': [
                    'case',
                    ['get', 'isFeatured'], 12,
                    ['get', 'isHot'], 10,
                    8
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
            }
        });

        // Add event labels
        map.addLayer({
            id: 'event-labels',
            type: 'symbol',
            source: 'events',
            filter: ['!', ['has', 'point_count']],
            layout: {
                'text-field': ['get', 'title'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 10,
                'text-offset': [0, 2],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#333333',
                'text-halo-color': '#ffffff',
                'text-halo-width': 1
            }
        });

        // Handle cluster clicks
        map.on('click', 'clusters', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            if (!features?.[0]?.properties) return;

            const clusterId = features[0].properties.cluster_id;
            const source = map.getSource('events') as mapboxgl.GeoJSONSource;

            source.getClusterExpansionZoom(clusterId, (err: Error | null | undefined, zoom: number | undefined | null) => {
                if (err || typeof zoom !== 'number') return;
                if (features[0].geometry.type === 'Point') {
                    map.easeTo({
                        center: features[0].geometry.coordinates as [number, number],
                        zoom: zoom
                    });
                }
            });
        });

        // Handle individual event clicks
        map.on('click', 'unclustered-point', (e) => {
            if (!e.features?.[0]?.properties) return;
            const event = events.find(ev => ev.id === e.features![0].properties!.id);
            if (event) {
                selectEvent(event);
                onEventSelect?.(event);
            }
        });

        // Add hover effects
        map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
        });

        map.on('mouseenter', 'unclustered-point', (e) => {
            map.getCanvas().style.cursor = 'pointer';

            // Show popup on hover
            if (!e.features?.[0]?.properties) return;
            const event = events.find(ev => ev.id === e.features![0].properties!.id);
            if (event) {
                showEventPopup(map, e.lngLat, event);
            }
        });

        map.on('mouseleave', 'unclustered-point', () => {
            map.getCanvas().style.cursor = '';
            removeEventPopup(map);
        });

    }, [mapState.markers, onEventSelect, selectEvent, showEventPopup, removeEventPopup]);

    // Update navigation state with route data
    const updateNavigationState = useCallback((route: NavigationRoute) => {
        const instructions = route.legs[0]?.steps || [];
        const duration = Math.round(route.duration / 60); // Convert to minutes
        const distance = (route.distance / 1000).toFixed(1); // Convert to km
        const eta = new Date(Date.now() + route.duration * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        setNavigationState(prev => ({
            ...prev,
            instructions,
            currentStep: 0,
            eta,
            distance: `${distance} km`,
            duration: `${duration} min`,
            routeGeometry: route.geometry
        }));
    }, []);

    // Clear navigation
    const clearNavigation = useCallback(() => {
        setNavigationState(prev => ({
            ...prev,
            isNavigating: false,
            destination: null,
            route: null,
            instructions: [],
            currentStep: 0,
            eta: null,
            distance: null,
            duration: null,
            routeGeometry: null
        }));

        setUIState(prev => ({ ...prev, showNavigation: false }));

        // Remove route from map
        if (mapState.instance && mapState.instance.getSource('route')) {
            mapState.instance.removeLayer('route');
            mapState.instance.removeLayer('route-arrow');
            mapState.instance.removeSource('route');
        }

        // Cancel speech
        if (speechSynthesisRef.current) {
            speechSynthesisRef.current.cancel();
        }

        onNavigationEnd?.();
    }, [mapState.instance, onNavigationEnd]);

    // Add production-ready controls
    const addProductionControls = useCallback((map: mapboxgl.Map) => {
        // Enhanced navigation control
        const nav = new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true
        });
        map.addControl(nav, 'top-right');

        // Enhanced geolocate control
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
                timeout: 6000,
                maximumAge: 600000 // 10 minutes
            },
            trackUserLocation: true,
            showUserHeading: true,
            showAccuracyCircle: true,
            fitBoundsOptions: { maxZoom: 16 }
        });
        map.addControl(geolocate, 'top-right');

        // Production geocoder with enhanced features
        const geocoder = new TypedMapboxGeocoder({
            accessToken: mapboxgl.accessToken || '',
            mapboxgl: mapboxgl,
            countries: 'ke,ug,tz,rw,bi', // East Africa focus
            types: 'place,postcode,locality,neighborhood,address,poi',
            placeholder: 'Search places, addresses...',
            proximity: mapState.center,
            bbox: [28, -12, 42, 5], // East Africa bounding box
            limit: 10,
            enableEventLogging: false
        });

        map.addControl(geocoder as unknown as mapboxgl.IControl, 'top-left');
        setMapState(prev => ({ ...prev, geocoderControl: geocoder }));

        // Directions control for navigation
        if (enableNavigation) {
            const directions = new TypedMapboxDirections({
                accessToken: mapboxgl.accessToken || '',
                unit: 'metric',
                profile: navigationState.selectedProfile,
                alternatives: true,
                geometries: 'geojson',
                controls: {
                    instructions: true,
                    profileSwitcher: true,
                    inputs: true
                },
                flyTo: true,
                placeholderOrigin: 'Choose starting point',
                placeholderDestination: 'Choose destination'
            });

            map.addControl(directions as unknown as mapboxgl.IControl, 'top-left');
            setMapState(prev => ({ ...prev, directionsControl: directions }));

            // Listen for route events
            directions.on('route', (event: RouteEvent) => {
                console.log('Route calculated:', event.route);
                updateNavigationState(event.route[0]);
            });

            directions.on('clear', () => {
                clearNavigation();
            });
        }

        // Scale control
        map.addControl(new mapboxgl.ScaleControl({
            maxWidth: 100,
            unit: 'metric'
        }), 'bottom-left');

        // Attribution control with custom text
        map.addControl(new mapboxgl.AttributionControl({
            customAttribution: '© Event Navigator'
        }), 'bottom-right');

    }, [mapState.center, enableNavigation, navigationState.selectedProfile, updateNavigationState, clearNavigation]);

    // Add route visualization to map
    const addRouteToMap = useCallback((map: mapboxgl.Map, route: NavigationRoute) => {
        // Remove existing route
        if (map.getSource('route')) {
            map.removeLayer('route');
            map.removeLayer('route-arrow');
            map.removeSource('route');
        }

        // Add route source
        map.addSource('route', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: route.geometry
            }
        });

        // Add route line
        map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#3b82f6',
                'line-width': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    10, 4,
                    18, 12
                ],
                'line-opacity': 0.8
            }
        });

        // Add route direction arrows
        map.addLayer({
            id: 'route-arrow',
            type: 'symbol',
            source: 'route',
            layout: {
                'symbol-placement': 'line',
                'symbol-spacing': 100,
                'icon-image': 'arrow',
                'icon-size': 0.5,
                'icon-rotation-alignment': 'map'
            }
        });

        // Fit map to route
        const coordinates = route.geometry.coordinates;
        const bounds = new mapboxgl.LngLatBounds();
        coordinates.forEach((coord) => bounds.extend(coord as [number, number]));

        map.fitBounds(bounds, {
            padding: { top: 50, bottom: 100, left: 50, right: 50 },
            duration: 1000
        });
    }, []);

    // Fit map to show all events
    const fitMapToEvents = useCallback((map: mapboxgl.Map, events: Event[]) => {
        if (events.length === 0) return;

        const bounds = new mapboxgl.LngLatBounds();

        events.forEach(event => {
            if (event.location.coordinates) {
                bounds.extend([event.location.coordinates.lng, event.location.coordinates.lat]);
            }
        });

        if (locationState.current) {
            bounds.extend([locationState.current.lng, locationState.current.lat]);
        }

        map.fitBounds(bounds, {
            padding: { top: 100, bottom: 100, left: 100, right: 100 },
            duration: 1000,
            maxZoom: 16
        });
    }, [locationState]);

    // Start navigation to event
    const startNavigation = useCallback(async (event: Event) => {
        if (!locationState.current) {
            setUIState(prev => ({
                ...prev,
                error: 'Current location is required for navigation'
            }));
            return;
        }

        try {
            setUIState(prev => ({ ...prev, isLoading: true }));

            // Calculate route using Mapbox Directions API
            const origin = `${locationState.current.lng},${locationState.current.lat}`;
            const destination = `${event.location.coordinates.lng},${event.location.coordinates.lat}`;

            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/${navigationState.selectedProfile}/${origin};${destination}?` +
                new URLSearchParams({
                    access_token: mapboxgl.accessToken || '',
                    geometries: 'geojson',
                    alternatives: 'true',
                    steps: 'true',
                    banner_instructions: 'true',
                    voice_instructions: 'true',
                    overview: 'full'
                })
            );

            if (!response.ok) {
                throw new Error(`Navigation API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                updateNavigationState(route);
                if (mapState.instance) {
                    addRouteToMap(mapState.instance, route);
                }

                setNavigationState(prev => ({
                    ...prev,
                    isNavigating: true,
                    destination: event,
                    route: route,
                    alternatives: data.routes.slice(1)
                }));

                onNavigationStart?.(event);

                if (navigationState.voiceEnabled) {
                    speakInstruction("Navigation started. Follow the blue route to your destination.");
                }
            }
        } catch (error) {
            console.error('Navigation error:', error);
            setUIState(prev => ({
                ...prev,
                error: 'Failed to calculate route. Please try again.'
            }));
        } finally {
            setUIState(prev => ({ ...prev, isLoading: false }));
        }
    }, [locationState, navigationState.selectedProfile, navigationState.voiceEnabled, mapState.instance, onNavigationStart, updateNavigationState, addRouteToMap, speakInstruction]);

    // Initialize map with full production features
    const initializeMap = useCallback(() => {
        if (!mapContainer.current || mapState.initialized || !apiKey) return;

        try {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: MAP_STYLES[mapState.activeStyle as keyof typeof MAP_STYLES] || MAP_STYLES.navigation,
                center: mapState.center,
                zoom: mapState.zoom,
                bearing: mapState.bearing,
                pitch: mapState.pitch,
                attributionControl: true,
                logoPosition: 'bottom-left',
                pitchWithRotate: true,
                dragRotate: true,
                touchZoomRotate: true,
                cooperativeGestures: false,
                maxBounds: [[-180, -85], [180, 85]], // Prevent infinite panning
                transformRequest: (url, resourceType) => {
                    // Add offline caching headers if enabled
                    if (enableOffline && resourceType === 'Tile') {
                        return {
                            url: url,
                            headers: { 'Cache-Control': 'max-age=604800' } // 1 week cache
                        };
                    }
                    return { url: url };
                }
            });

            // Enhanced map load event
            map.on('load', () => {
                console.log('Production map loaded successfully');

                // Enable 3D terrain if requested
                if (enable3D) {
                    map.addSource('mapbox-dem', {
                        'type': 'raster-dem',
                        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                        'tileSize': 512,
                        'maxzoom': 14
                    });
                    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

                    // Add sky layer for 3D effect
                    map.addLayer({
                        'id': 'sky',
                        'type': 'sky',
                        'paint': {
                            'sky-type': 'atmosphere',
                            'sky-atmosphere-sun': [0.0, 0.0],
                            'sky-atmosphere-sun-intensity': 15
                        }
                    });
                }

                // Add building extrusions for 3D effect
                map.addLayer({
                    'id': '3d-buildings',
                    'source': 'composite',
                    'source-layer': 'building',
                    'filter': ['==', 'extrude', 'true'],
                    'type': 'fill-extrusion',
                    'minzoom': 15,
                    'paint': {
                        'fill-extrusion-color': '#aaa',
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.6
                    }
                });

                setMapState(prev => ({ ...prev, loaded: true, instance: map }));
                setUIState(prev => ({ ...prev, isLoading: false }));

                // Initialize geolocation tracking
                startLocationTracking();

                // Add enhanced controls
                addProductionControls(map);

                // Add event markers with clustering
                addClusteredEventMarkers(map, events);

                // Fit map to show all events
                fitMapToEvents(map, events);
            });

            // Enhanced error handling
            map.on('error', (e: mapboxgl.ErrorEvent) => {
                console.error('Map error:', e);
                setUIState(prev => ({
                    ...prev,
                    error: `Map error: ${e.error?.message || 'Unknown error'}`,
                    isLoading: false
                }));
            });

            // Style load event for style changes
            map.on('style.load', () => {
                // Re-add custom layers after style change
                addClusteredEventMarkers(map, events);
                if (navigationState.route) {
                    addRouteToMap(map, navigationState.route);
                }
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
                error: 'Failed to initialize map. Please check your API key and internet connection.',
                isLoading: false
            }));
        }
    }, [apiKey, mapState.activeStyle, mapState.center, mapState.zoom, mapState.bearing, mapState.pitch, mapState.initialized, enable3D, enableOffline, events, navigationState.route, startLocationTracking, addProductionControls, addClusteredEventMarkers, fitMapToEvents, addRouteToMap]);

    // Initialize map when opened
    useEffect(() => {
        if (isOpen && !mapState.initialized) {
            setTimeout(initializeMap, 100);
        }
    }, [isOpen, mapState.initialized, initializeMap]);

    // Start location tracking when map opens
    useEffect(() => {
        if (isOpen && !locationState.isTracking) {
            startLocationTracking();
        }

        return () => {
            if (!isOpen) {
                stopLocationTracking();
            }
        };
    }, [isOpen, locationState.isTracking, startLocationTracking, stopLocationTracking]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopLocationTracking();
            if (mapState.instance) {
                mapState.markers.forEach(marker => marker.remove());
                if (mapState.userMarker) mapState.userMarker.remove();
                mapState.instance.remove();
            }
            if (speechSynthesisRef.current) {
                speechSynthesisRef.current.cancel();
            }
        };
    }, [mapState.instance, mapState.markers, mapState.userMarker, stopLocationTracking]);

    // Filter events based on search
    const filteredEvents = events.filter(event =>
        uiState.searchQuery === '' ||
        event.title.toLowerCase().includes(uiState.searchQuery.toLowerCase()) ||
        event.location.name.toLowerCase().includes(uiState.searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(uiState.searchQuery.toLowerCase())
    );

    const selectedEventData = events.find(e => e.id === mapState.selectedEvent);
    const currentInstruction = navigationState.instructions[navigationState.currentStep];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-50 ${className}`}
                >
                    {/* Enhanced Header with Connection Status */}
                    <div className="absolute top-0 left-0 right-0 z-20 bg-black/90 backdrop-blur-lg border-b border-white/10">
                        <div className="flex items-center justify-between p-4 md:p-6">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                >
                                    <BsGlobe className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </motion.div>
                                <div>
                                    <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
                                    <div className="flex items-center gap-3 text-xs md:text-sm text-gray-300">
                                        <span>{filteredEvents.length} events</span>
                                        <div className="flex items-center gap-1">
                                            {uiState.connectionStatus === 'online' ? (
                                                <FiWifi className="w-3 h-3 text-green-400" />
                                            ) : (
                                                <FiWifiOff className="w-3 h-3 text-red-400" />
                                            )}
                                            <span>{uiState.connectionStatus}</span>
                                        </div>
                                        {locationState.isTracking && (
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <span>GPS Active</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3">
                                {/* Transport Mode Selector */}
                                {enableNavigation && (
                                    <select
                                        value={navigationState.selectedProfile}
                                        onChange={(e) => setNavigationState(prev => ({
                                            ...prev,
                                            selectedProfile: e.target.value as NavigationState['selectedProfile']
                                        }))}
                                        className="bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {Object.entries(TRANSPORT_PROFILES).map(([key, profile]) => (
                                            <option key={key} value={key} className="bg-gray-800 text-white">
                                                {profile.label}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {/* Voice Toggle */}
                                {navigationState.isNavigating && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setNavigationState(prev => ({
                                            ...prev,
                                            voiceEnabled: !prev.voiceEnabled
                                        }))}
                                        className={`p-2 rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-300 ${navigationState.voiceEnabled
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                            }`}
                                        title={navigationState.voiceEnabled ? "Mute voice" : "Enable voice"}
                                    >
                                        {navigationState.voiceEnabled ? (
                                            <FiVolume2 className="w-4 h-4" />
                                        ) : (
                                            <FiVolumeX className="w-4 h-4" />
                                        )}
                                    </motion.button>
                                )}

                                {/* Navigation Control */}
                                {navigationState.isNavigating && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={clearNavigation}
                                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors"
                                    >
                                        End Navigation
                                    </motion.button>
                                )}

                                {/* Close Button */}
                                <motion.button
                                    onClick={onClose}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-white"
                                >
                                    <FiX className="w-4 h-4 md:w-5 md:h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Map Container */}
                    <div className="absolute top-16 md:top-20 left-0 right-0 bottom-0 bg-gray-100">
                        <div ref={mapContainer} className="w-full h-full relative">
                            {/* Error State */}
                            {uiState.error && (
                                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                                    <div className="text-center p-6 max-w-md">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FiX className="w-8 h-8 text-red-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
                                        <p className="text-gray-600 mb-4">{uiState.error}</p>
                                        <button
                                            onClick={() => {
                                                setUIState(prev => ({ ...prev, error: null, isLoading: true }));
                                                setMapState(prev => ({ ...prev, initialized: false }));
                                                setTimeout(initializeMap, 100);
                                            }}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <FiRefreshCw className="w-4 h-4 mr-2 inline" />
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Loading State */}
                            {uiState.isLoading && !uiState.error && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center"
                                    animate={{ opacity: [0.8, 1, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <div className="text-center">
                                        <motion.div
                                            className="w-16 h-16 mx-auto mb-6 border-4 border-white/20 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        <h3 className="text-xl font-bold text-white mb-2">Loading Navigation</h3>
                                        <p className="text-white/80 text-sm">
                                            Initializing GPS and map services...
                                        </p>
                                        <div className="mt-4 text-white/60 text-xs">
                                            {filteredEvents.length} events • {locationState.isTracking ? 'GPS Active' : 'Requesting location'}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Navigation Instructions Panel */}
                            <AnimatePresence>
                                {navigationState.isNavigating && currentInstruction && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -50 }}
                                        className="absolute top-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200/50 p-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                                <FiNavigation className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-gray-500">
                                                        In {currentInstruction.distance ? Math.round(currentInstruction.distance) : '0'}m
                                                    </span>
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                        Step {navigationState.currentStep + 1} of {navigationState.instructions.length}
                                                    </span>
                                                </div>
                                                <p className="font-semibold text-gray-900">
                                                    {currentInstruction.maneuver?.instruction || 'Continue on route'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-gray-900">{navigationState.eta}</div>
                                                <div className="text-xs text-gray-500">{navigationState.distance} • {navigationState.duration}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Event Details & Navigation Panel */}
                            <AnimatePresence>
                                {selectedEventData && uiState.showNavigation && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 50 }}
                                        className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200/50 p-4"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={selectedEventData.image}
                                                    alt={selectedEventData.title}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                                                        {selectedEventData.title}
                                                    </h3>
                                                    <button
                                                        onClick={() => setUIState(prev => ({ ...prev, showNavigation: false }))}
                                                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FiMapPin className="w-4 h-4 text-orange-500" />
                                                        <span className="truncate">{selectedEventData.location.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FiCalendar className="w-4 h-4 text-blue-500" />
                                                        <span>{selectedEventData.date.toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-orange-600">
                                                            {selectedEventData.price.amount === 0 ? 'Free' : selectedEventData.price.min}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FiUsers className="w-4 h-4" />
                                                        <span>{selectedEventData.attendees} attending</span>
                                                    </div>
                                                </div>

                                                {/* Navigation Actions */}
                                                <div className="flex gap-2">
                                                    {!navigationState.isNavigating ? (
                                                        <>
                                                            <motion.button
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={() => startNavigation(selectedEventData)}
                                                                disabled={!locationState.current}
                                                                className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                            >
                                                                <IoNavigateOutline className="w-4 h-4" />
                                                                Start Navigation
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                                            >
                                                                <FiShare2 className="w-4 h-4" />
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                                            >
                                                                <FiPhone className="w-4 h-4" />
                                                            </motion.button>
                                                        </>
                                                    ) : (
                                                        <div className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-100 text-green-800 rounded-lg">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                            <span className="font-medium">Navigating to destination</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Location Permission Request */}
                            {!locationState.permissionGranted && !locationState.error && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200/50 p-6 max-w-sm text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <IoLocationSharp className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Enable Location</h3>
                                    <p className="text-gray-600 mb-4 text-sm">
                                        Allow location access to see your position and get turn-by-turn navigation to events.
                                    </p>
                                    <button
                                        onClick={startLocationTracking}
                                        className="w-full py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                                    >
                                        Allow Location Access
                                    </button>
                                </div>
                            )}

                            {/* Status Bar */}
                            <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 px-3 py-2">
                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                    <span>📍 {filteredEvents.length} events</span>
                                    {locationState.current && locationState.accuracy && (
                                        <span>🎯 ±{Math.round(locationState.accuracy)}m</span>
                                    )}
                                    {locationState.speed && locationState.speed > 0 && (
                                        <span>🚀 {Math.round(locationState.speed * 3.6)} km/h</span>
                                    )}
                                    <span className={`flex items-center gap-1 ${uiState.connectionStatus === 'online' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {uiState.connectionStatus === 'online' ? (
                                            <FiWifi className="w-3 h-3" />
                                        ) : (
                                            <FiWifiOff className="w-3 h-3" />
                                        )}
                                        {uiState.connectionStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Styles */}
                    <style jsx global>{`
                        .event-popup {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        }
                        
                        .mapboxgl-popup-content {
                            padding: 0 !important;
                            border-radius: 12px !important;
                            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
                            border: 1px solid rgba(0, 0, 0, 0.1) !important;
                        }
                        
                        .mapboxgl-popup-tip {
                            border-top-color: white !important;
                        }
                        
                        .mapboxgl-popup-close-button {
                            display: none !important;
                        }
                        
                        .mapboxgl-ctrl-attrib {
                            font-size: 11px !important;
                            background: rgba(255, 255, 255, 0.8) !important;
                        }
                        
                        .mapboxgl-ctrl-bottom-right {
                            bottom: 80px !important;
                            right: 16px !important;
                        }
                        
                        .mapboxgl-ctrl-bottom-left {
                            bottom: 16px !important;
                            left: 16px !important;
                        }
                        
                        .line-clamp-2 {
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }
                        
                        .user-location-marker {
                            z-index: 1000;
                        }
                        
                        .mapboxgl-user-location-dot {
                            background-color: #1da1f2 !important;
                            border: 3px solid #ffffff !important;
                            border-radius: 50%;
                            box-shadow: 0 0 10px rgba(29, 161, 242, 0.5);
                        }
                        
                        .mapboxgl-user-location-accuracy-circle {
                            background-color: rgba(29, 161, 242, 0.2) !important;
                            border: 1px solid rgba(29, 161, 242, 0.5) !important;
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EventMapWidget;