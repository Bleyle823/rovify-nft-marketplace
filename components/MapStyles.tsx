/* Enhanced Map Styling for Rovify */
import mapboxgl from 'mapbox-gl';
import type { GeoJSONSource } from 'mapbox-gl';

// Define interfaces for our event data
interface EventCoordinates {
    lat: number;
    lng: number;
}

interface MapEvent {
    id: string;
    title: string;
    category: string;
    price: string;
    isFeatured?: boolean;
    attendees?: number;
    coordinates?: EventCoordinates;
}

// Interface for custom map properties
interface CustomMapProperties extends mapboxgl.Map {
    _userLocation?: EventCoordinates;
}

// Map style definitions
const mapStyles: Record<string, string | mapboxgl.StyleSpecification> = {
    // Premium night mode - vibrant social style
    vibrant: 'mapbox://styles/mapbox/dark-v11',

    // Custom Rovify-branded style with highlighted points of interest
    rovify: {
        version: 8,
        name: 'Rovify Custom',
        sources: {
            'mapbox-streets': {
                type: 'vector',
                url: 'mapbox://mapbox.mapbox-streets-v8'
            }
        },
        sprite: 'mapbox://sprites/mapbox/bright-v9',
        glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
        layers: [
            {
                id: 'background',
                type: 'background',
                paint: {
                    'background-color': '#FDFBF9'
                }
            },
            {
                id: 'water',
                type: 'fill',
                source: 'mapbox-streets',
                'source-layer': 'water',
                paint: {
                    'fill-color': '#E5F2F8'
                }
            },
            {
                id: 'landuse',
                type: 'fill',
                source: 'mapbox-streets',
                'source-layer': 'landuse',
                paint: {
                    'fill-color': [
                        'match',
                        ['get', 'class'],
                        'park', '#DEFEE0',
                        'cemetery', '#E6EAE9',
                        'hospital', '#FFF3F3',
                        'school', '#F8F3E6',
                        'industrial', '#F5F5F5',
                        '#F1F0EA'
                    ]
                }
            },
            {
                id: 'roads',
                type: 'line',
                source: 'mapbox-streets',
                'source-layer': 'road',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#ffffff',
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        12, 1,
                        16, 4
                    ]
                }
            },
            {
                id: 'road-outline',
                type: 'line',
                source: 'mapbox-streets',
                'source-layer': 'road',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#F4E9E2',
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        12, 2,
                        16, 6
                    ],
                    'line-gap-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        12, 1,
                        16, 4
                    ]
                }
            },
            {
                id: 'poi-labels',
                type: 'symbol',
                source: 'mapbox-streets',
                'source-layer': 'poi_label',
                layout: {
                    'text-field': ['get', 'name'],
                    'text-size': 12,
                    'text-font': ['Open Sans Regular'],
                    'text-offset': [0, 0.5],
                    'text-anchor': 'top'
                },
                paint: {
                    'text-color': '#7A7A7A',
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 1
                }
            }
        ]
    },

    // Social party style - ideal for event discovery
    social: 'mapbox://styles/mapbox/navigation-night-v1',

    // NFT/Web3 inspired style
    web3: 'mapbox://styles/mapbox/satellite-streets-v12'
};

// Custom map marker components
const MarkerComponents = {
    // Default event marker with hover and select animations
    eventMarker: `
    .event-marker {
      width: 40px;
      height: 40px;
      cursor: pointer;
      transform-origin: bottom center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .event-marker-inner {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: linear-gradient(135deg, #FF5722, #FF8A65);
      border-radius: 50%;
      color: white;
      font-weight: 700;
      font-size: 12px;
      box-shadow: 0 4px 12px rgba(255, 87, 34, 0.4);
      overflow: hidden;
      transform: scale(0.9);
      opacity: 0.85;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .event-marker-inner::after {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%);
      transform: rotate(35deg);
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    
    .event-marker:hover {
      transform: scale(1.1) translateY(-5px);
      z-index: 10;
    }
    
    .event-marker:hover .event-marker-inner {
      opacity: 1;
      box-shadow: 0 6px 16px rgba(255, 87, 34, 0.6);
    }
    
    .event-marker:hover .event-marker-inner::after {
      opacity: 1;
    }
    
    .event-marker-selected {
      transform: scale(1.2) translateY(-10px);
      z-index: 20;
    }
    
    .event-marker-selected .event-marker-inner {
      opacity: 1;
      transform: scale(1);
      box-shadow: 0 8px 24px rgba(255, 87, 34, 0.7);
    }
    
    .event-marker-selected::before {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 10px;
      background-color: rgba(255, 87, 34, 0.5);
    }
    
    .event-marker-price {
      position: relative;
      z-index: 2;
      transition: transform 0.3s ease;
    }
    
    .event-marker:hover .event-marker-price,
    .event-marker-selected .event-marker-price {
      transform: scale(1.1);
    }
    
    /* Category-specific markers */
    .event-marker-music .event-marker-inner {
      background: linear-gradient(135deg, #9C27B0, #CE93D8);
      box-shadow: 0 4px 12px rgba(156, 39, 176, 0.4);
    }
    
    .event-marker-music:hover .event-marker-inner,
    .event-marker-music.event-marker-selected .event-marker-inner {
      box-shadow: 0 8px 24px rgba(156, 39, 176, 0.7);
    }
    
    .event-marker-tech .event-marker-inner {
      background: linear-gradient(135deg, #2196F3, #90CAF9);
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
    }
    
    .event-marker-tech:hover .event-marker-inner,
    .event-marker-tech.event-marker-selected .event-marker-inner {
      box-shadow: 0 8px 24px rgba(33, 150, 243, 0.7);
    }
    
    .event-marker-food .event-marker-inner {
      background: linear-gradient(135deg, #FF9800, #FFCC80);
      box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
    }
    
    .event-marker-food:hover .event-marker-inner,
    .event-marker-food.event-marker-selected .event-marker-inner {
      box-shadow: 0 8px 24px rgba(255, 152, 0, 0.7);
    }
  `,

    // Pulsing user location marker
    userLocationMarker: `
    .user-location-marker {
      position: relative;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .user-location-marker::before {
      content: '';
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: rgba(74, 137, 243, 0.15);
      animation: pulse-ring 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }
    
    .user-location-marker::after {
      content: '';
      position: absolute;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: #4A89F3;
      border: 3px solid white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
      animation: pulse-dot 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }
    
    @keyframes pulse-ring {
      0% {
        transform: scale(0.5);
        opacity: 0.5;
      }
      50% {
        opacity: 0;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    @keyframes pulse-dot {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `,

    // Featured event markers
    featuredMarker: `
    .event-marker-featured {
      width: 50px;
      height: 50px;
    }
    
    .event-marker-featured .event-marker-inner {
      background: linear-gradient(135deg, #FFD700, #FFA000);
      box-shadow: 0 4px 20px rgba(255, 168, 0, 0.5);
    }
    
    .event-marker-featured::after {
      content: '';
      position: absolute;
      width: 60px;
      height: 60px;
      top: -5px;
      left: -5px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,208,0,0.2) 0%, rgba(255,208,0,0) 70%);
      animation: pulse-featured 3s infinite;
    }
    
    @keyframes pulse-featured {
      0% {
        transform: scale(0.8);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.2;
      }
      100% {
        transform: scale(0.8);
        opacity: 0.8;
      }
    }
  `,

    // 3D-looking markers with shadows
    marker3D: `
    .event-marker-3d {
      width: 40px;
      height: 40px;
      perspective: 1000px;
    }
    
    .event-marker-3d .event-marker-inner {
      transform: translateZ(0) rotateX(20deg);
      box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.3);
      transition: all 0.4s ease;
    }
    
    .event-marker-3d:hover .event-marker-inner {
      transform: translateZ(10px) rotateX(0deg) scale(1.05);
      box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.4);
    }
    
    .event-marker-3d.event-marker-selected .event-marker-inner {
      transform: translateZ(20px) rotateX(0deg) scale(1.2);
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
    }
  `
};

// Advanced visual effects for map
const mapEffects = {
    // Radius visualization
    enhancedRadius: (map: mapboxgl.Map, center: EventCoordinates, radiusKm: number): void => {
        // Remove existing radius layer and source
        if (map.getSource('radius-source')) {
            map.removeLayer('radius-fill');
            map.removeLayer('radius-border');
            map.removeLayer('radius-pulse');
            map.removeSource('radius-source');
        }

        // Add source and layers
        map.addSource('radius-source', {
            type: 'geojson',
            data: {
                type: 'Feature' as const,
                properties: {},
                geometry: {
                    type: 'Point' as const,
                    coordinates: [center.lng, center.lat]
                }
            }
        });

        // Calculate the radius in pixels based on zoom level
        const pixelRadius = radiusKm * 1000 / (111320 * Math.cos(center.lat * Math.PI / 180)) * map.getZoom() * 5;

        // Add base fill
        map.addLayer({
            id: 'radius-fill',
            type: 'circle',
            source: 'radius-source',
            paint: {
                'circle-radius': pixelRadius,
                'circle-color': '#FF5722',
                'circle-opacity': 0.05
            }
        });

        // Add border
        map.addLayer({
            id: 'radius-border',
            type: 'circle',
            source: 'radius-source',
            paint: {
                'circle-radius': pixelRadius,
                'circle-color': 'transparent',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#FF5722',
                'circle-stroke-opacity': 0.3
            }
        });

        // Add pulsing effect
        map.addLayer({
            id: 'radius-pulse',
            type: 'circle',
            source: 'radius-source',
            paint: {
                'circle-radius': pixelRadius,
                'circle-color': '#FF5722',
                'circle-opacity': ['interpolate', ['linear'], ['get', 'pulse', ['literal', { pulse: 0 }]], 0, 0.2, 1, 0],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#FF5722',
                'circle-stroke-opacity': ['interpolate', ['linear'], ['get', 'pulse', ['literal', { pulse: 0 }]], 0, 0.5, 1, 0]
            }
        });

        // Animate the pulse
        let pulseStep = 0;
        const animatePulse = (): void => {
            pulseStep = (pulseStep + 0.01) % 1;

            map.setPaintProperty('radius-pulse', 'circle-radius', [
                'interpolate', ['linear'], ['get', 'pulse', ['literal', { pulse: pulseStep }]],
                0, pixelRadius,
                1, pixelRadius * 1.2
            ]);

            map.setPaintProperty('radius-pulse', 'circle-opacity', [
                'interpolate', ['linear'], ['get', 'pulse', ['literal', { pulse: pulseStep }]],
                0, 0.15,
                1, 0
            ]);

            map.setPaintProperty('radius-pulse', 'circle-stroke-opacity', [
                'interpolate', ['linear'], ['get', 'pulse', ['literal', { pulse: pulseStep }]],
                0, 0.4,
                1, 0
            ]);

            requestAnimationFrame(animatePulse);
        };

        animatePulse();
    },

    // 3D building extrusion effect (for urban event venues)
    add3DBuildings: (map: mapboxgl.Map): void => {
        // Check if the map has building data
        if (!map.getSource('composite') || !map.getLayer('building')) {
            console.warn("Map doesn't have building data");
            return;
        }

        // Add 3D building layer
        map.addLayer({
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
                'fill-extrusion-color': '#EEEEEE',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': 0.6
            }
        });
    },

    // Heatmap visualization for busy event areas
    addEventHeatmap: (map: mapboxgl.Map, events: MapEvent[]): void => {
        // Format events for heatmap
        const heatmapData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
            type: 'FeatureCollection' as const,
            features: events
                .filter(event => event.coordinates) // Only include events with coordinates
                .map(event => ({
                    type: 'Feature' as const,
                    properties: {
                        intensity: event.attendees ? Math.min(event.attendees / 500, 1) : 0.5
                    },
                    geometry: {
                        type: 'Point' as const,
                        coordinates: [event.coordinates!.lng, event.coordinates!.lat]
                    }
                }))
        };

        // Add heatmap source
        map.addSource('events-heat', {
            type: 'geojson',
            data: heatmapData
        });

        // Add heatmap layer
        map.addLayer({
            id: 'events-heat',
            type: 'heatmap',
            source: 'events-heat',
            paint: {
                'heatmap-weight': ['get', 'intensity'],
                'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 10, 1, 15, 3],
                'heatmap-color': [
                    'interpolate', ['linear'], ['heatmap-density'],
                    0, 'rgba(255,87,34,0)',
                    0.2, 'rgba(255,152,0,0.3)',
                    0.4, 'rgba(255,193,7,0.5)',
                    0.6, 'rgba(255,152,0,0.7)',
                    0.8, 'rgba(255,87,34,0.8)',
                    1, 'rgba(244,67,54,0.9)'
                ],
                'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 10, 15, 25],
                'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 14, 1, 17, 0]
            }
        }, 'waterway-label');
    },

    // Advanced route visualization between user and event
    showRoute: (map: mapboxgl.Map, userLocation: EventCoordinates, eventLocation: EventCoordinates, routeId = 'route'): void => {
        // Simulate a route (in real app, use a routing API)
        const route: GeoJSON.Feature<GeoJSON.LineString> = {
            type: 'Feature' as const,
            properties: {},
            geometry: {
                type: 'LineString' as const,
                coordinates: [
                    [userLocation.lng, userLocation.lat],
                    // Add some curve to the route for visual interest
                    [
                        userLocation.lng + (eventLocation.lng - userLocation.lng) * 0.3,
                        userLocation.lat + (eventLocation.lat - userLocation.lat) * 0.7
                    ],
                    [eventLocation.lng, eventLocation.lat]
                ]
            }
        };

        // Add or update route source
        if (map.getSource(routeId)) {
            const source = map.getSource(routeId) as GeoJSONSource;
            source.setData(route);
        } else {
            map.addSource(routeId, {
                type: 'geojson',
                data: route
            });

            // Route background
            map.addLayer({
                id: `${routeId}-bg`,
                type: 'line',
                source: routeId,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#ffffff',
                    'line-width': 5,
                    'line-opacity': 0.6
                }
            });

            // Route line
            map.addLayer({
                id: routeId,
                type: 'line',
                source: routeId,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#FF5722',
                    'line-width': 3,
                    'line-dasharray': [0, 2]
                }
            });

            // Animate the line - using a custom approach instead of line-dash-offset
            // which has TypeScript type issues
            let dashOffset = 0;
            function animateDashArray() {
                dashOffset = (dashOffset + 0.5) % 100;

                // Update the dasharray instead of using dash-offset
                // This is more compatible with TypeScript typing
                map.setPaintProperty(routeId, 'line-dasharray', [
                    0,
                    Math.max(0.1, 2 - (dashOffset % 2)),
                    Math.min(2, dashOffset % 2),
                    0
                ]);

                requestAnimationFrame(animateDashArray);
            }

            animateDashArray();
        }
    },

    // Animated selected event focus effect
    focusOnEvent: (map: mapboxgl.Map, eventCoordinates: EventCoordinates, eventId: string): void => {
        // Create a unique gradient animation for the selection
        const animationId = `focus-${eventId}`;

        // Add a pulsing circle around the selected event
        const focusPoint: GeoJSON.Feature<GeoJSON.Point> = {
            type: 'Feature' as const,
            properties: {},
            geometry: {
                type: 'Point' as const,
                coordinates: [eventCoordinates.lng, eventCoordinates.lat]
            }
        };

        // Add or update focus source
        if (map.getSource(animationId)) {
            const source = map.getSource(animationId) as GeoJSONSource;
            source.setData(focusPoint);
        } else {
            map.addSource(animationId, {
                type: 'geojson',
                data: focusPoint
            });

            // Add a pulsing circle layer
            map.addLayer({
                id: animationId,
                type: 'circle',
                source: animationId,
                paint: {
                    'circle-radius': 30,
                    'circle-color': '#FF5722',
                    'circle-opacity': 0.3,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#FF5722',
                    'circle-stroke-opacity': 0.5
                }
            });

            // Animate the focus circle
            let size = 20;
            let increasing = true;
            const animateFocus = (): void => {
                if (increasing) {
                    size += 0.5;
                    if (size >= 40) increasing = false;
                } else {
                    size -= 0.5;
                    if (size <= 20) increasing = true;
                }

                map.setPaintProperty(animationId, 'circle-radius', size);

                if (map.getLayer(animationId)) {
                    requestAnimationFrame(animateFocus);
                }
            };

            animateFocus();
        }

        // Fly to the event with a smooth camera animation
        map.flyTo({
            center: [eventCoordinates.lng, eventCoordinates.lat],
            zoom: map.getZoom() < 14 ? 14 : map.getZoom(),
            bearing: Math.random() * 40 - 20, // Random slight angle for visual interest
            pitch: 50, // Tilt for better 3D effect
            essential: true,
            duration: 2000,
            easing: (t: number) => {
                return t * (2 - t); // Ease out quad
            }
        });
    },

    // Category-based event marker styling
    getCategoryMarkerHTML: (event: MapEvent): string => {
        const categoryIcons: Record<string, string> = {
            music: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
            tech: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
            food: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
            art: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><circle cx="12" cy="12" r="10"></circle><circle cx="8" cy="8" r="2"></circle><circle cx="16" cy="8" r="2"></circle><path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path></svg>`,
            outdoors: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M17.5 21h.5c.8 0 1.5-.7 1.5-1.5v-7c0-.8-.7-1.5-1.5-1.5h-.5"></path><path d="M6.5 21h-.5c-.8 0-1.5-.7-1.5-1.5v-7c0-.8.7-1.5 1.5-1.5h.5"></path><path d="M3 7h18"></path><path d="M7 2v5"></path><path d="M17 2v5"></path><path d="m11.4 14.8-.4 7.2.4-7.2z"></path><path d="m13.1 14.9.4 7.1-.4-7.1z"></path><path d="M12 2a5 5 0 0 0-5 5v5.2c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V7a5 5 0 0 0-5-5z"></path></svg>`,
            sports: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path><circle cx="12" cy="12" r="3"></circle><path d="m12 8-1.5 2"></path><path d="m12 8 1.5 2"></path><path d="m16 12-2 1.5"></path><path d="m16 12-2-1.5"></path><path d="m12 16-1.5-2"></path><path d="m12 16 1.5-2"></path><path d="m8 12 2 1.5"></path><path d="m8 12 2-1.5"></path></svg>`,
            education: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
            nightlife: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`
        };

        const colors: Record<string, string[]> = {
            music: ['#9C27B0', '#CE93D8'],
            tech: ['#2196F3', '#90CAF9'],
            food: ['#FF9800', '#FFCC80'],
            art: ['#E91E63', '#F48FB1'],
            outdoors: ['#4CAF50', '#A5D6A7'],
            sports: ['#00BCD4', '#80DEEA'],
            education: ['#3F51B5', '#9FA8DA'],
            nightlife: ['#673AB7', '#B39DDB']
        };

        const categoryColor = colors[event.category] || ['#FF5722', '#FF8A65'];
        const isFeatured = event.isFeatured;
        const price = event.price.replace('$', '');
        const icon = categoryIcons[event.category] || '';

        const markerHTML = `
      <div class="event-marker-inner" style="background: linear-gradient(135deg, ${categoryColor[0]}, ${categoryColor[1]});">
        <div class="event-marker-price">${price}</div>
        <div class="event-marker-icon">${icon}</div>
        ${isFeatured ? '<div class="event-marker-featured-badge"></div>' : ''}
      </div>
      ${isFeatured ? '<div class="event-marker-featured-glow"></div>' : ''}
    `;

        return markerHTML;
    },

    // Zoom to show all events with a nice animation
    fitMapToEvents: (map: mapboxgl.Map, events: MapEvent[], padding = 100): void => {
        // Create bounds that include all events
        const bounds = new mapboxgl.LngLatBounds();

        // Add user location if available
        const customMap = map as CustomMapProperties;
        if (customMap._userLocation) {
            bounds.extend([customMap._userLocation.lng, customMap._userLocation.lat]);
        }

        // Add all event locations
        events.forEach(event => {
            if (event.coordinates) {
                bounds.extend([event.coordinates.lng, event.coordinates.lat]);
            }
        });

        // Check if bounds are valid
        if (!bounds.isEmpty()) {
            map.fitBounds(bounds, {
                padding: padding,
                maxZoom: 15,
                duration: 1500,
                essential: true
            });
        }
    }
};

export { mapStyles, MarkerComponents, mapEffects };