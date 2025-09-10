'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getEventById } from '@/mocks/data/events';
import { getUsersByEvent } from '@/mocks/data/users';
import { Event, User } from '@/types';
import {
    FiArrowLeft, FiShare2, FiHeart, FiCalendar, FiMapPin,
    FiClock, FiDollarSign, FiUsers, FiTag, FiChevronRight,
    FiMessageSquare, FiNavigation
} from 'react-icons/fi';
import CommentSection, { Comment } from '@/components/CommentSection';
import ShareModal from '@/components/ShareModal';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoicmtuZCIsImEiOiJjbWFwbTEzajAwMDVxMmlxeHY1dDdyY3h6In0.OQrYFVmEq-QL95nnbh1jTQ';

interface EventDetailsPageProps {
    id: string;
}

export default function EventDetailsPage({ id }: EventDetailsPageProps) {
    const router = useRouter();
    const headerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<mapboxgl.Map | null>(null);
    const [event, setEvent] = useState<Event | null>(null);
    const [attendees, setAttendees] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<'details' | 'tickets' | 'attendees' | 'comments'>('details');
    const [isLoading, setIsLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [liked, setLiked] = useState(false);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Handle scroll effects with smoother animation
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Using a smoother transition curve for better UX
            if (scrollY > 80) {
                setScrolled(true);
                // Add opacity based on scroll depth for a fancy effect
                if (headerRef.current) {
                    const opacity = Math.min(1, (scrollY - 80) / 40);
                    headerRef.current.style.setProperty('--header-bg-opacity', opacity.toString());
                }
            } else {
                setScrolled(false);
                if (headerRef.current) {
                    headerRef.current.style.setProperty('--header-bg-opacity', '0');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch event data
    useEffect(() => {
        if (id) {
            // Simulate API fetch delay
            const timer = setTimeout(() => {
                const fetchedEvent = getEventById(id);
                if (fetchedEvent) {
                    setEvent(fetchedEvent);
                    setAttendees(getUsersByEvent(fetchedEvent.id));
                    setSelectedTicketType(fetchedEvent.price.min === fetchedEvent.price.max ? 'general' : null);

                    // Generate mock comments
                    const mockComments: Comment[] = [
                        {
                            id: '1',
                            userId: '2',
                            userName: 'Sophia Chen',
                            userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
                            verified: true,
                            text: 'This looks amazing! I can\'t wait to attend this event. Does anyone know if there will be food vendors?',
                            timestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
                            likes: 12,
                            liked: false,
                        },
                        {
                            id: '2',
                            userId: '3',
                            userName: 'Marcus Johnson',
                            userImage: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop',
                            verified: false,
                            text: 'I attended this last year and it was incredible. Definitely recommend getting the VIP tickets if you can!',
                            timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
                            likes: 8,
                            liked: true,
                        },
                    ];

                    setComments(mockComments);
                }
                setIsLoading(false);
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [id]);

    // Initialize map when event data is loaded
    useEffect(() => {
        if (!event || !mapRef.current || mapLoaded) return;

        // Create map
        const initializeMap = () => {
            mapInstance.current = new mapboxgl.Map({
                container: mapRef.current!,
                style: 'mapbox://styles/mapbox/light-v11',
                center: [event.location.coordinates.lng, event.location.coordinates.lat],
                zoom: 14,
                interactive: true
            });

            // Add controls
            mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

            // Add marker
            const markerElement = document.createElement('div');
            markerElement.className = 'custom-marker';
            markerElement.innerHTML = `
                <div class="marker-pin">
                    <span class="marker-dot"></span>
                </div>
            `;

            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                    <div class="p-2">
                        <h3 class="font-semibold text-gray-900">${event.location.name}</h3>
                        <p class="text-sm text-gray-700">${event.location.address}</p>
                    </div>
                `);

            new mapboxgl.Marker(markerElement)
                .setLngLat([event.location.coordinates.lng, event.location.coordinates.lat])
                .setPopup(popup)
                .addTo(mapInstance.current);

            mapInstance.current.on('load', () => {
                setMapLoaded(true);
            });
        };

        initializeMap();

        // Cleanup
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [event, mapLoaded]);

    // Handle quantity changes
    const incrementQuantity = () => {
        if (ticketQuantity < 10) setTicketQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        if (ticketQuantity > 1) setTicketQuantity(prev => prev - 1);
    };

    // Calculate ticket price based on selection
    const calculatePrice = () => {
        if (!event) return '0';

        const price = selectedTicketType === 'vip' ? event.price.max : event.price.min;
        return (price * ticketQuantity).toFixed(2);
    };

    // Handle adding a new comment
    const handleAddComment = (text: string) => {
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            userId: '1', // Current user
            userName: 'Joe RKND',
            userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop',
            verified: true,
            text,
            timestamp: new Date(),
            likes: 0,
            liked: false,
        };

        setComments(prev => [newComment, ...prev]);
    };

    // Open directions in Google Maps
    const openDirections = () => {
        if (!event) return;

        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${event.location.coordinates.lat},${event.location.coordinates.lng}`,
            '_blank'
        );
    };

    // Loading Skeleton
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Loading Header */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="h-6 w-40 bg-gray-200 rounded-md opacity-0"></div>
                        <div className="flex space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Loading Content */}
                <div className="pt-16">
                    {/* Hero Image Skeleton */}
                    <div className="w-full h-[40vh] bg-gray-200 animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-300 to-transparent"></div>
                    </div>

                    <div className="container mx-auto px-4 -mt-16 relative z-10">
                        {/* Event Card Skeleton */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                            {/* Title and Category */}
                            <div className="mb-4">
                                <div className="h-4 w-20 bg-gray-200 rounded-full animate-shimmer mb-2"></div>
                                <div className="h-8 w-3/4 bg-gray-200 rounded-lg animate-shimmer"></div>
                            </div>

                            {/* Organiser */}
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="h-10 w-10 rounded-full bg-gray-200 animate-shimmer"></div>
                                <div className="h-5 w-32 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '0.1s' }}></div>
                            </div>

                            {/* Event Meta */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-start space-x-2">
                                        <div className="mt-1 h-4 w-4 rounded-full bg-gray-200 animate-shimmer" style={{ animationDelay: `${0.2 + i * 0.1}s` }}></div>
                                        <div>
                                            <div className="h-4 w-16 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: `${0.2 + i * 0.1}s` }}></div>
                                            <div className="h-5 w-24 mt-1 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: `${0.3 + i * 0.1}s` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tabs Skeleton */}
                            <div className="border-b border-gray-200 mb-6">
                                <div className="flex space-x-6">
                                    {['Details', 'Tickets', 'Attendees', 'Comments'].map((_, i) => (
                                        <div key={i} className="pb-3">
                                            <div className="h-6 w-20 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: `${0.6 + i * 0.1}s` }}></div>
                                            {i === 0 && <div className="h-0.5 w-full bg-[#FF5722] rounded-full mt-3"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Content Skeleton */}
                            <div className="space-y-4">
                                <div className="h-5 w-40 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '0.9s' }}></div>
                                <div className="h-4 w-full bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '1s' }}></div>
                                <div className="h-4 w-full bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '1.1s' }}></div>
                                <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '1.2s' }}></div>
                            </div>
                        </div>

                        {/* Tickets Skeleton */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <div className="h-6 w-40 bg-gray-200 rounded-md animate-shimmer mb-4"></div>

                            <div className="space-y-4">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex justify-between mb-3">
                                            <div>
                                                <div className="h-5 w-32 bg-gray-200 rounded-md animate-shimmer"></div>
                                                <div className="h-4 w-48 mt-1 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '0.1s' }}></div>
                                            </div>
                                            <div className="h-6 w-16 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="h-4 w-24 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '0.3s' }}></div>
                                            <div className="h-9 w-24 bg-gray-200 rounded-full animate-shimmer" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state if event not found
    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                        <FiCalendar className="w-8 h-8 text-[#FF5722]" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-900">Event Not Found</h2>
                    <p className="text-gray-600 mb-6">This event may have been removed or the link is incorrect.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#FF5722] text-white rounded-full font-medium shadow-md hover:bg-[#E64A19] transition-colors"
                    >
                        Discover Events
                    </Link>
                </div>
            </div>
        );
    }

    // Format dates
    const eventDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');
    const eventTime = format(new Date(event.date), 'h:mm a');
    const eventEndTime = format(new Date(event.endDate), 'h:mm a');

    // Calculate ticket availability percentage
    const ticketAvailabilityPercent = Math.min(100, Math.round((event.soldTickets / event.totalTickets) * 100));

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Neomorphic Dynamic Header */}
            <div
                ref={headerRef}
                style={{ '--header-bg-opacity': '0' } as React.CSSProperties}
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md"
            >
                <div
                    className={`absolute inset-0 bg-white transition-opacity duration-300`}
                    style={{ opacity: 'var(--header-bg-opacity)' }}
                ></div>

                <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white shadow-neomorph hover:shadow-neomorph-hover active:shadow-neomorph-pressed text-gray-700"
                        aria-label="Go back"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </button>

                    <h1
                        className={`font-semibold transition-all transform duration-500 ease-in-out absolute left-1/2 -translate-x-1/2 ${scrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 -translate-y-4'
                            }`}
                    >
                        {event.title}
                    </h1>

                    <div className="flex space-x-3">
                        <button
                            onClick={() => setLiked(!liked)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white shadow-neomorph hover:shadow-neomorph-hover active:shadow-neomorph-pressed ${liked ? 'text-[#FF5722]' : 'text-gray-700'
                                }`}
                            aria-label={liked ? "Unlike" : "Like"}
                        >
                            <FiHeart className={`w-5 h-5 transition-all ${liked ? 'fill-current scale-110' : ''}`} />
                        </button>

                        <button
                            onClick={() => setShareModalOpen(true)}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white shadow-neomorph hover:shadow-neomorph-hover active:shadow-neomorph-pressed text-gray-700"
                            aria-label="Share"
                        >
                            <FiShare2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Image with Parallax Effect */}
            <div className="w-full h-[45vh] relative overflow-hidden">
                <div className="absolute inset-0 transform transition-transform duration-1000" style={{ transform: scrolled ? 'scale(1.05)' : 'scale(1)' }}>
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Category Tag */}
                <div className="absolute top-20 left-4 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-[#FF5722] px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                        {event.category}
                    </span>

                    {event.hasNftTickets && (
                        <span className="ml-2 bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                            </svg>
                            NFT TICKET
                        </span>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-10">
                {/* Main Event Card */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6 transform transition-all duration-300 hover:shadow-lg">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">{event.title}</h1>

                    {/* Organiser Info */}
                    <div className="flex items-center mb-6">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border-2 border-white shadow-md">
                            <Image
                                src={event.organiser.image}
                                alt={event.organiser.name}
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{event.organiser.name}</p>
                            <p className="text-sm text-gray-500">Event Organiser</p>
                        </div>
                        {event.organiser.verified && (
                            <div className="ml-2 bg-blue-50 p-1 rounded-full shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div className="flex items-start space-x-3">
                            <div className="mt-1 bg-[#FF5722]/10 p-2 rounded-full shadow-inner">
                                <FiCalendar className="w-4 h-4 text-[#FF5722]" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium text-gray-900">{eventDate}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="mt-1 bg-[#FF5722]/10 p-2 rounded-full shadow-inner">
                                <FiClock className="w-4 h-4 text-[#FF5722]" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="font-medium text-gray-900">{eventTime} - {eventEndTime}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="mt-1 bg-[#FF5722]/10 p-2 rounded-full shadow-inner">
                                <FiMapPin className="w-4 h-4 text-[#FF5722]" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium text-gray-900">{event.location.name}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="mt-1 bg-[#FF5722]/10 p-2 rounded-full shadow-inner">
                                <FiDollarSign className="w-4 h-4 text-[#FF5722]" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Price</p>
                                <p className="font-medium text-gray-900">
                                    {event.price.min === event.price.max
                                        ? `${event.price.currency} ${event.price.min}`
                                        : `${event.price.currency} ${event.price.min} - ${event.price.max}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation - Enhanced with animations */}
                    <div className="border-b border-gray-200 mb-6">
                        <div className="flex space-x-6 overflow-x-auto hide-scrollbar">
                            {[
                                { id: 'details', label: 'Details', icon: FiCalendar },
                                { id: 'tickets', label: 'Tickets', icon: FiDollarSign },
                                { id: 'attendees', label: 'Attendees', icon: FiUsers, count: attendees.length },
                                { id: 'comments', label: 'Comments', icon: FiMessageSquare, count: comments.length }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as 'details' | 'tickets' | 'attendees' | 'comments')}
                                    className={`pb-3 relative font-medium flex items-center transition-all ${activeTab === tab.id
                                        ? 'text-[#FF5722]'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <tab.icon className={`w-4 h-4 mr-1.5 transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`} />
                                    {tab.label}
                                    {tab.count !== undefined && (
                                        <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full transition-colors ${activeTab === tab.id
                                            ? 'bg-[#FF5722]/10 text-[#FF5722]'
                                            : 'bg-gray-100 text-gray-600'}`}>
                                            {tab.count}
                                        </span>
                                    )}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5722] rounded-full animate-expandWidth"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="pb-6">
                        {/* Details Tab */}
                        {activeTab === 'details' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About this event</h3>
                                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                                </div>

                                {/* Tags */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {event.tags.map((tag) => (
                                            <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:bg-gray-200 transition-all cursor-pointer">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Location Map - Now actually showing the map */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                                    <div className="h-48 rounded-lg overflow-hidden relative mb-2 shadow-md">
                                        {/* Real Mapbox Map */}
                                        <div ref={mapRef} className="w-full h-full"></div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center shadow-sm hover:shadow transition-shadow">
                                        <div>
                                            <p className="font-medium text-gray-900">{event.location.name}</p>
                                            <p className="text-sm text-gray-500">{event.location.address}, {event.location.city}</p>
                                        </div>
                                        <button
                                            onClick={openDirections}
                                            className="text-[#FF5722] font-medium inline-flex items-center py-2 px-3 rounded-full hover:bg-[#FF5722]/10 transition-colors"
                                        >
                                            <FiNavigation className="mr-1 w-4 h-4" />
                                            Directions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tickets Tab */}
                        {activeTab === 'tickets' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900">Available Tickets</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">Available:</span>
                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#FF5722] to-[#FF9800]"
                                                style={{ width: `${100 - ticketAvailabilityPercent}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-700 font-medium">
                                            {event.totalTickets - event.soldTickets}/{event.totalTickets}
                                        </span>
                                    </div>
                                </div>

                                {/* Ticket Types */}
                                <div className="space-y-4">
                                    {/* General Admission */}
                                    <div
                                        className={`p-4 border rounded-lg transition-all ${selectedTicketType === 'general'
                                            ? 'border-[#FF5722] bg-gradient-to-r from-[#FF5722]/10 to-[#FF5722]/5 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">General Admission</h4>
                                                <p className="text-sm text-gray-500">Standard entry to the event</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-[#FF5722]">{event.price.currency} {event.price.min}</p>
                                                <p className="text-xs text-gray-500">
                                                    {Math.floor(event.totalTickets * 0.6) - event.soldTickets} remaining
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-1">
                                                {event.hasNftTickets && (
                                                    <div className="flex items-center space-x-1 text-xs bg-[#FF5722]/10 text-[#FF5722] px-2 py-1 rounded-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                                        </svg>
                                                        <span>NFT Ticket</span>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setSelectedTicketType('general')}
                                                className={`text-sm px-4 py-2 rounded-full font-medium transition-all ${selectedTicketType === 'general'
                                                    ? 'bg-[#FF5722] text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                Select
                                            </button>
                                        </div>
                                    </div>

                                    {/* VIP Ticket - Only show if different max price */}
                                    {event.price.min !== event.price.max && (
                                        <div
                                            className={`p-4 border rounded-lg transition-all ${selectedTicketType === 'vip'
                                                ? 'border-[#FF5722] bg-gradient-to-r from-[#FF5722]/10 to-[#FF5722]/5 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="flex justify-between mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">VIP Experience</h4>
                                                    <p className="text-sm text-gray-500">Premium access with exclusive perks</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-[#FF5722]">{event.price.currency} {event.price.max}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {Math.floor(event.totalTickets * 0.4) - Math.floor(event.soldTickets * 0.3)} remaining
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-1">
                                                    {event.hasNftTickets && (
                                                        <div className="flex items-center space-x-1 text-xs bg-[#FF5722]/10 text-[#FF5722] px-2 py-1 rounded-full">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                                            </svg>
                                                            <span>NFT Ticket</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => setSelectedTicketType('vip')}
                                                    className={`text-sm px-4 py-2 rounded-full font-medium transition-all ${selectedTicketType === 'vip'
                                                        ? 'bg-[#FF5722] text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    Select
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* NFT Ticket Info */}
                                {event.hasNftTickets && (
                                    <div className="bg-gradient-to-r from-[#FF5722]/10 to-[#FF9800]/10 rounded-lg p-5 border border-[#FF5722]/20 shadow-inner">
                                        <div className="flex items-start space-x-4">
                                            <div className="h-12 w-12 flex-shrink-0 bg-[#FF5722]/20 rounded-full flex items-center justify-center shadow-inner">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">NFT Ticket Benefits</h3>
                                                <ul className="space-y-2">
                                                    <li className="flex items-center space-x-2 text-gray-700">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF5722]" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Proof of attendance as NFT on Base blockchain</span>
                                                    </li>
                                                    <li className="flex items-center space-x-2 text-gray-700">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF5722]" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Tradeable on secondary marketplaces</span>
                                                    </li>
                                                    <li className="flex items-center space-x-2 text-gray-700">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF5722]" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Access to exclusive content & future events</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Attendees Tab */}
                        {activeTab === 'attendees' && (
                            <div className="animate-fadeIn">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Who&apos;s Going <span className="text-[#FF5722]">({attendees.length})</span>
                                    </h3>

                                    {attendees.length > 6 && (
                                        <button className="text-sm text-[#FF5722] font-medium flex items-center hover:underline">
                                            View All <FiChevronRight className="ml-1" />
                                        </button>
                                    )}
                                </div>

                                {attendees.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {attendees.slice(0, 6).map((attendee) => (
                                            <div
                                                key={attendee.id}
                                                className="flex items-center space-x-3 p-3 rounded-lg bg-white border border-gray-100 hover:border-gray-200 transition-all shadow-sm hover:shadow-md"
                                            >
                                                <div className="h-10 w-10 rounded-full overflow-hidden shadow-md">
                                                    <Image
                                                        src={attendee.image}
                                                        alt={attendee.name}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center">
                                                        <p className="font-medium text-gray-900 truncate">{attendee.name}</p>
                                                        {attendee.verified && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500 truncate">@{attendee.username}</p>
                                                </div>
                                                <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors shadow-sm hover:shadow">
                                                    Follow
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                                        <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                            <FiUsers className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No attendees yet</h3>
                                        <p className="text-gray-500 mb-4">Be the first to get a ticket!</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Comments Tab */}
                        {activeTab === 'comments' && (
                            <div className="animate-fadeIn">
                                <CommentSection
                                    eventId={event.id}
                                    comments={comments}
                                    onAddComment={handleAddComment}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats and engagement data */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Event Stats</h3>
                        <div className="flex space-x-1 items-center text-gray-500">
                            <FiUsers className="w-4 h-4" />
                            <span className="text-sm">{attendees.length} attending</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div
                            className={`text-center p-3 rounded-lg transition-colors cursor-pointer ${liked ? 'bg-[#FF5722]/10' : 'bg-gray-50 hover:bg-gray-100'}`}
                            onClick={() => setLiked(!liked)}
                        >
                            <div className="flex items-center justify-center space-x-1 mb-1">
                                <FiHeart className={`w-4 h-4 transition-all ${liked ? 'text-[#FF5722] fill-current scale-110' : 'text-[#FF5722]'}`} />
                                <span className="font-semibold text-gray-900">{liked ? event.likes + 1 : event.likes}</span>
                            </div>
                            <p className="text-xs text-gray-500">Likes</p>
                        </div>

                        <div
                            className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => setActiveTab('comments')}
                        >
                            <div className="flex items-center justify-center space-x-1 mb-1">
                                <FiMessageSquare className="w-4 h-4 text-[#FF5722]" />
                                <span className="font-semibold text-gray-900">{comments.length}</span>
                            </div>
                            <p className="text-xs text-gray-500">Comments</p>
                        </div>

                        <div
                            className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => setShareModalOpen(true)}
                        >
                            <div className="flex items-center justify-center space-x-1 mb-1">
                                <FiShare2 className="w-4 h-4 text-[#FF5722]" />
                                <span className="font-semibold text-gray-900">{event.shares}</span>
                            </div>
                            <p className="text-xs text-gray-500">Shares</p>
                        </div>
                    </div>
                </div>

                {/* Related Tags */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/search?tag=${tag}`}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-sm hover:shadow transition-shadow"
                            >
                                <FiTag className="mr-1 w-3 h-3" />
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Action Bar - With Neomorphic Design */}
            <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md z-30">
                <div className="bg-white/90 border-t border-gray-200 shadow-lg">
                    <div className="container mx-auto flex items-center justify-between py-4 px-4">
                        <div>
                            {selectedTicketType ? (
                                <div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center border border-gray-300 rounded-full shadow-neomorph-inner overflow-hidden">
                                            <button
                                                onClick={decrementQuantity}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                                                disabled={ticketQuantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-medium">{ticketQuantity}</span>
                                            <button
                                                onClick={incrementQuantity}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                                                disabled={ticketQuantity >= 10}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">Total</p>
                                            <p className="font-bold text-[#FF5722]">{event.price.currency} {calculatePrice()}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-500">Starting at</p>
                                    <p className="font-bold text-[#FF5722]">{event.price.currency} {event.price.min}</p>
                                </div>
                            )}
                        </div>

                        <button
                            disabled={!selectedTicketType}
                            className={`px-6 py-3 rounded-full text-white font-medium transition-all ${selectedTicketType
                                ? 'bg-gradient-to-r from-[#FF5722] to-[#FF7A50] hover:shadow-lg active:shadow-inner'
                                : 'bg-gray-300 cursor-not-allowed'
                                }`}
                        >
                            {selectedTicketType ? (
                                ticketQuantity > 1 ? `Get ${ticketQuantity} Tickets` : 'Get Ticket'
                            ) : (
                                'Select Ticket Type'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {event && <ShareModal
                event={event}
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
            />}

            {/* Mapbox Marker Styles */}
            <style jsx global>{`
                .custom-marker {
                    cursor: pointer;
                }
                
                .marker-pin {
                    width: 30px;
                    height: 30px;
                    position: relative;
                    transform: translateY(-50%);
                }
                
                .marker-dot {
                    width: 16px;
                    height: 16px;
                    background: #FF5722;
                    border: 2px solid white;
                    border-radius: 50%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                }
                
                .mapboxgl-popup {
                    max-width: 200px;
                }
                
                .mapboxgl-popup-content {
                    border-radius: 8px;
                    padding: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
            `}</style>

            {/* Global Animation Styles */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                
                @keyframes expandWidth {
                    from { width: 0; }
                    to { width: 100%; }
                }
                
                .animate-expandWidth {
                    animation: expandWidth 0.3s ease-out forwards;
                }
                
                .shadow-neomorph {
                    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.05),
                                -8px -8px 16px rgba(255, 255, 255, 0.9);
                }
                
                .shadow-neomorph-hover {
                    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.06),
                                -10px -10px 20px rgba(255, 255, 255, 0.95);
                }
                
                .shadow-neomorph-pressed {
                    box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.05),
                                inset -4px -4px 8px rgba(255, 255, 255, 0.9);
                }
                
                .shadow-neomorph-inner {
                    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.05),
                                inset -2px -2px 5px rgba(255, 255, 255, 0.5);
                }
                
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}