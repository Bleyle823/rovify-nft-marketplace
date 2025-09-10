// MapView.tsx
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FiNavigation, FiLayers, FiZoomIn, FiZoomOut, FiCoffee, FiHome } from 'react-icons/fi';
import { FaCar } from "react-icons/fa";

interface Coordinates {
    lat: number;
    lng: number;
}

interface LocationData {
    name: string;
    address: string;
    city: string;
    coordinates: Coordinates;
}

interface MapViewProps {
    location: LocationData;
    showNearbyAmenities?: boolean;
}

export default function MapView({ location, showNearbyAmenities = true }: MapViewProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<mapboxgl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [activeLayer, setActiveLayer] = useState<'standard' | 'satellite'>('standard');
    const [amenities, setAmenities] = useState<{
        restaurants: boolean;
        hotels: boolean;
        parking: boolean;
    }>({
        restaurants: true,
        hotels: false,
        parking: false,
    });

    // Mock nearby amenities data - in a real app, this would come from an API
    const mockNearbyAmenities = [
        {
            type: 'restaurant',
            name: 'The Local Eatery',
            coordinates: {
                lat: location.coordinates.lat + 0.002,
                lng: location.coordinates.lng - 0.001,
            },
        },
        {
            type: 'restaurant',
            name: 'Coffee & Cake',
            coordinates: {
                lat: location.coordinates.lat - 0.001,
                lng: location.coordinates.lng + 0.002,
            },
        },
        {
            type: 'hotel',
            name: 'City Center Hotel',
            coordinates: {
                lat: location.coordinates.lat + 0.003,
                lng: location.coordinates.lng + 0.001,
            },
        },
        {
            type: 'parking',
            name: 'Public Parking',
            coordinates: {
                lat: location.coordinates.lat - 0.002,
                lng: location.coordinates.lng - 0.002,
            },
        },
    ];

    // Initialize map
    useEffect(() => {
        if (!mapRef.current || mapLoaded) return;

        mapInstance.current = new mapboxgl.Map({
            container: mapRef.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [location.coordinates.lng, location.coordinates.lat],
            zoom: 14,
            interactive: true,
        });

        // Add controls
        mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add main event marker
        const markerElement = document.createElement('div');
        markerElement.className = 'event-marker';
        markerElement.innerHTML = `
      <div class="marker-pin pulse">
        <span class="marker-dot"></span>
      </div>
    `;

        const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
        <div class="p-3">
          <h3 class="font-semibold text-gray-900">${location.name}</h3>
          <p class="text-sm text-gray-700">${location.address}, ${location.city}</p>
          <div class="mt-2 pt-2 border-t border-gray-200">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}" target="_blank" class="text-[#FF5722] text-sm font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Get Directions
            </a>
          </div>
        </div>
      `);

        new mapboxgl.Marker(markerElement)
            .setLngLat([location.coordinates.lng, location.coordinates.lat])
            .setPopup(popup)
            .addTo(mapInstance.current);

        mapInstance.current.on('load', () => {
            setMapLoaded(true);
        });

        // Cleanup
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [location]);

    // Toggle map style
    const toggleMapStyle = () => {
        if (!mapInstance.current) return;

        const newStyle = activeLayer === 'standard' ? 'satellite' : 'standard';
        const styleUrl = newStyle === 'standard'
            ? 'mapbox://styles/mapbox/light-v11'
            : 'mapbox://styles/mapbox/satellite-streets-v12';

        mapInstance.current.setStyle(styleUrl);
        setActiveLayer(newStyle);
    };

    // Update amenities on map
    useEffect(() => {
        if (!mapInstance.current || !mapLoaded || !showNearbyAmenities) return;

        // Clear existing markers first
        const existingMarkers = document.querySelectorAll('.amenity-marker');
        existingMarkers.forEach(marker => marker.remove());

        // Add amenity markers based on selected filters
        mockNearbyAmenities.forEach(amenity => {
            if (
                (amenity.type === 'restaurant' && amenities.restaurants) ||
                (amenity.type === 'hotel' && amenities.hotels) ||
                (amenity.type === 'parking' && amenities.parking)
            ) {
                const color = amenity.type === 'restaurant'
                    ? '#4CAF50'
                    : amenity.type === 'hotel'
                        ? '#2196F3'
                        : '#FF9800';

                const icon = amenity.type === 'restaurant'
                    ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
                    : amenity.type === 'hotel'
                        ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>'
                        : '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>';

                const markerElement = document.createElement('div');
                markerElement.className = 'amenity-marker';
                markerElement.innerHTML = `
          <div class="amenity-pin" style="background-color: ${color};">
            ${icon}
          </div>
        `;

                const popup = new mapboxgl.Popup({ offset: 20 })
                    .setHTML(`
            <div class="p-2">
              <p class="font-medium text-gray-900">${amenity.name}</p>
              <p class="text-xs text-gray-600">${amenity.type.charAt(0).toUpperCase() + amenity.type.slice(1)}</p>
            </div>
          `);

                new mapboxgl.Marker(markerElement)
                    .setLngLat([amenity.coordinates.lng, amenity.coordinates.lat])
                    .setPopup(popup)
                    .addTo(mapInstance.current!);
            }
        });

    }, [amenities, mapLoaded, showNearbyAmenities, mockNearbyAmenities, location]);

    // Open directions in Google Maps
    const openDirections = () => {
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`,
            '_blank'
        );
    };

    // Toggle amenity filters
    const toggleAmenity = (type: 'restaurants' | 'hotels' | 'parking') => {
        setAmenities(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    return (
        <div className="space-y-3">
            <div className="h-60 md:h-80 rounded-lg overflow-hidden relative shadow-md">
                {/* Map Container */}
                <div ref={mapRef} className="w-full h-full"></div>

                {/* Map Controls */}
                <div className="absolute top-3 left-3 z-10 space-y-2">
                    <button
                        onClick={toggleMapStyle}
                        className="bg-white rounded-full h-9 w-9 shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50"
                        aria-label="Toggle map style"
                    >
                        <FiLayers className="w-5 h-5" />
                    </button>

                    {showNearbyAmenities && (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <button
                                onClick={() => toggleAmenity('restaurants')}
                                className={`flex items-center justify-center h-9 w-9 ${amenities.restaurants ? 'text-[#4CAF50] bg-[#4CAF50]/10' : 'text-gray-700 hover:bg-gray-50'}`}
                                aria-label="Show restaurants"
                            >
                                <FiCoffee className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => toggleAmenity('hotels')}
                                className={`flex items-center justify-center h-9 w-9 ${amenities.hotels ? 'text-[#2196F3] bg-[#2196F3]/10' : 'text-gray-700 hover:bg-gray-50'}`}
                                aria-label="Show hotels"
                            >
                                <FiHome className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => toggleAmenity('parking')}
                                className={`flex items-center justify-center h-9 w-9 ${amenities.parking ? 'text-[#FF9800] bg-[#FF9800]/10' : 'text-gray-700 hover:bg-gray-50'}`}
                                aria-label="Show parking"
                            >
                                <FaCar className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-3 right-12 z-10 bg-white rounded-lg shadow-md overflow-hidden">
                    <button
                        onClick={() => mapInstance.current?.zoomIn()}
                        className="flex items-center justify-center h-9 w-9 text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                        aria-label="Zoom in"
                    >
                        <FiZoomIn className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => mapInstance.current?.zoomOut()}
                        className="flex items-center justify-center h-9 w-9 text-gray-700 hover:bg-gray-50"
                        aria-label="Zoom out"
                    >
                        <FiZoomOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow transition-shadow">
                <div>
                    <p className="font-medium text-gray-900">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.address}, {location.city}</p>
                </div>
                <button
                    onClick={openDirections}
                    className="text-[#FF5722] font-medium inline-flex items-center py-2 px-4 rounded-full hover:bg-[#FF5722]/10 transition-colors"
                >
                    <FiNavigation className="mr-1.5 w-4 h-4" />
                    Directions
                </button>
            </div>

            {/* Marker and Animation Styles */}
            <style jsx global>{`
        .event-marker {
          cursor: pointer;
          z-index: 2;
        }
        
        .marker-pin {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 87, 34, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
        }
        
        .marker-dot {
          width: 16px;
          height: 16px;
          background: #FF5722;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .pulse::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: rgba(255, 87, 34, 0.6);
          z-index: -1;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 1;
          }
          70% {
            transform: scale(1.3);
            opacity: 0;
          }
          100% {
            transform: scale(0.95);
            opacity: 0;
          }
        }
        
        .amenity-marker {
          cursor: pointer;
          z-index: 1;
        }
        
        .amenity-pin {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
        }
        
        .mapboxgl-popup {
          max-width: 240px;
        }
        
        .mapboxgl-popup-content {
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow: hidden;
        }
      `}</style>
        </div>
    );
}