/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
    FiArrowLeft, FiShare2, FiHeart, FiCalendar, FiMapPin,
    FiClock, FiDollarSign, FiUsers, FiTag, FiChevronRight,
    FiMessageSquare, FiNavigation, FiCheck, FiX, FiInfo,
    FiAlertCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Set Mapbox access token - replace with your own token
mapboxgl.accessToken = 'pk.eyJ1IjoicmtuZCIsImEiOiJjbWFwbTEzajAwMDVxMmlxeHY1dDdyY3h6In0.OQrYFVmEq-QL95nnbh1jTQ';

// Types
interface Location {
    name: string;
    address: string;
    city: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}

interface Organiser {
    id: string;
    name: string;
    image: string;
    verified: boolean;
}

interface Price {
    min: number;
    max: number;
    currency: string;
}

interface Amenity {
    id: string;
    name: string;
    type: 'parking' | 'hotel' | 'restaurant' | 'transport';
    coordinates: {
        lat: number;
        lng: number;
    };
    distance: string;
}

interface TicketType {
    id: string;
    name: string;
    description: string;
    price: number;
    available: number;
    maxPerOrder: number;
    features?: string[];
    isNft?: boolean;
}

interface Event {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    endDate: string;
    location: Location;
    organiser: Organiser;
    price: Price;
    category: string;
    tags: string[];
    totalTickets: number;
    soldTickets: number;
    likes: number;
    shares: number;
    hasNftTickets: boolean;
    amenities?: Amenity[];
    ticketTypes: TicketType[];
}

interface Comment {
    id: string;
    userId: string;
    userName: string;
    userImage: string;
    verified: boolean;
    text: string;
    timestamp: Date;
    likes: number;
    liked: boolean;
    replies?: Comment[];
}

interface PaymentDetails {
    subtotal: number;
    fees: number;
    tax: number;
    discount: number;
    total: number;
}

// New interfaces to fix the "any" issues
interface BookingData {
    eventId: string;
    ticketType: string | null;
    quantity: number;
    paymentMethod: 'card' | 'crypto';
    total: number;
    timestamp: Date;
}

interface Attendee {
    id: string;
    name: string;
    image: string;
    username: string;
    verified: boolean;
}

interface EventBookingProps {
    event: Event;
    onBookingComplete?: (data: BookingData) => void; // Fixed any to BookingData
    currentUserId?: string; // For comment functionality
    currentUserName?: string;
    currentUserImage?: string;
    isVerified?: boolean;
}

const EventBooking: React.FC<EventBookingProps> = ({
    event,
    onBookingComplete,
    currentUserId = '1',
    currentUserName = 'Guest User',
    currentUserImage = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop',
    isVerified = false
}) => {
    // Refs
    const headerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<mapboxgl.Map | null>(null);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

    // State
    const [activeTab, setActiveTab] = useState<'details' | 'tickets' | 'attendees' | 'comments'>('details');
    const [scrolled, setScrolled] = useState(false);
    const [liked, setLiked] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [showAmenities, setShowAmenities] = useState(false);
    const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [attendees, setAttendees] = useState<Attendee[]>([]); // Fixed any[] to Attendee[]
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
        subtotal: 0,
        fees: 0,
        tax: 0,
        discount: 0,
        total: 0
    });
    const [paymentStep, setPaymentStep] = useState<'selection' | 'payment' | 'confirmation'>('selection');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showCelebration, setShowCelebration] = useState(false);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [joinedWaitlist, setJoinedWaitlist] = useState(false);
    const [showMaxTicketsWarning, setShowMaxTicketsWarning] = useState(false);

    // Format dates
    const eventDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');
    const eventTime = format(new Date(event.date), 'h:mm a');
    const eventEndTime = format(new Date(event.endDate), 'h:mm a');

    // Calculate remaining tickets
    const remainingTickets = event.totalTickets - event.soldTickets;
    const isSoldOut = remainingTickets <= 0;

    // Check if event is profitable
    const TICKET_THRESHOLD_FOR_DISCOUNT = 5;

    // Handle scroll effects
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (scrollY > 80) {
                setScrolled(true);
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

    // Initialize map
    // Initialize map
    useEffect(() => {
        if (!mapRef.current || mapLoaded) return;

        // Create map
        const initializeMap = () => {
            if (!mapRef.current) return;

            const map = new mapboxgl.Map({
                container: mapRef.current,
                style: 'mapbox://styles/mapbox/light-v11',
                center: [event.location.coordinates.lng, event.location.coordinates.lat],
                zoom: 14,
                interactive: true
            });

            // Store the map instance
            mapInstance.current = map;

            // Add controls
            map.addControl(new mapboxgl.NavigationControl(), 'top-right');

            // Add marker for event location
            const markerElement = document.createElement('div');
            markerElement.className = 'custom-marker event-marker';
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
                .addTo(map); // Use local variable instead of mapInstance.current

            // Add markers for amenities if they exist
            if (event.amenities && event.amenities.length > 0) {
                event.amenities.forEach(amenity => {
                    // Create custom marker element based on amenity type
                    const amenityMarkerEl = document.createElement('div');
                    amenityMarkerEl.className = `custom-marker amenity-marker ${amenity.type}-marker`;

                    // Different marker styles for different amenity types
                    const markerColor =
                        amenity.type === 'parking' ? '#4CAF50' :
                            amenity.type === 'hotel' ? '#2196F3' :
                                amenity.type === 'restaurant' ? '#FF9800' :
                                    '#9C27B0'; // transport

                    amenityMarkerEl.innerHTML = `
                  <div class="amenity-marker-pin" style="background-color: ${markerColor}">
                    <span class="amenity-marker-icon"></span>
                  </div>
                `;

                    const amenityPopup = new mapboxgl.Popup({ offset: 20 })
                        .setHTML(`
                      <div class="p-2">
                        <h3 class="font-semibold text-gray-900">${amenity.name}</h3>
                        <p class="text-sm text-gray-700">${amenity.type} · ${amenity.distance}</p>
                      </div>
                    `);

                    new mapboxgl.Marker(amenityMarkerEl)
                        .setLngLat([amenity.coordinates.lng, amenity.coordinates.lat])
                        .setPopup(amenityPopup)
                        .addTo(map); // Use local variable instead of mapInstance.current
                });
            }

            // Set map loaded after initialization
            map.on('load', () => {
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
    }, [event.location, event.amenities, mapLoaded]);

    // Toggle map amenities visibility
    const toggleAmenities = () => {
        setShowAmenities(prev => !prev);

        if (mapInstance.current && event.amenities) {
            const amenityMarkers = document.querySelectorAll('.amenity-marker');

            if (showAmenities) {
                // Hide amenities
                amenityMarkers.forEach(marker => {
                    (marker as HTMLElement).style.display = 'none';
                });
            } else {
                // Show amenities
                amenityMarkers.forEach(marker => {
                    (marker as HTMLElement).style.display = 'block';
                });

                // Adjust map to fit all markers
                const bounds = new mapboxgl.LngLatBounds();

                // Add event location
                bounds.extend([event.location.coordinates.lng, event.location.coordinates.lat]);

                // Add amenity locations
                event.amenities.forEach(amenity => {
                    bounds.extend([amenity.coordinates.lng, amenity.coordinates.lat]);
                });

                mapInstance.current.fitBounds(bounds, {
                    padding: 50,
                    duration: 1000
                });
            }
        }
    };

    // Calculate payment details based on ticket selection
    useEffect(() => {
        if (!selectedTicketType) return;

        const selectedTicket = event.ticketTypes.find(t => t.id === selectedTicketType);
        if (!selectedTicket) return;

        const subtotal = selectedTicket.price * ticketQuantity;
        const fees = subtotal * 0.05; // 5% service fee
        const tax = subtotal * 0.08; // 8% tax

        // Apply discount if quantity is above threshold
        let discount = 0;
        if (ticketQuantity >= TICKET_THRESHOLD_FOR_DISCOUNT) {
            discount = subtotal * 0.1; // 10% discount
            setDiscountApplied(true);
        } else {
            setDiscountApplied(false);
        }

        const total = subtotal + fees + tax - discount;

        setPaymentDetails({
            subtotal,
            fees,
            tax,
            discount,
            total
        });
    }, [selectedTicketType, ticketQuantity, event.ticketTypes]);

    // Ticket quantity handlers
    const incrementQuantity = () => {
        const selectedTicket = event.ticketTypes.find(t => t.id === selectedTicketType);
        if (!selectedTicket) return;

        // Check if we're at max available tickets
        if (ticketQuantity >= selectedTicket.available) {
            setShowMaxTicketsWarning(true);
            setTimeout(() => setShowMaxTicketsWarning(false), 3000);
            return;
        }

        // Check if we're at max per order
        if (ticketQuantity >= selectedTicket.maxPerOrder) {
            setErrors({ ...errors, quantity: `Maximum ${selectedTicket.maxPerOrder} tickets per order` });
            return;
        }

        setTicketQuantity(prev => prev + 1);

        // Show celebration animation when passing the threshold
        if (ticketQuantity + 1 === TICKET_THRESHOLD_FOR_DISCOUNT) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
        }
    };

    const decrementQuantity = () => {
        if (ticketQuantity > 1) {
            setTicketQuantity(prev => prev - 1);
            // Clear quantity errors when reducing
            if (errors.quantity) {
                const newErrors = { ...errors };
                delete newErrors.quantity;
                setErrors(newErrors);
            }
        }
    };

    // Open direction in Google Maps
    const openDirections = () => {
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${event.location.coordinates.lat},${event.location.coordinates.lng}`,
            '_blank'
        );
    };

    // Comment handling
    const handleAddComment = () => {
        if (!newComment.trim()) return;

        setIsSubmittingComment(true);

        // Simulate API call delay
        setTimeout(() => {
            const newCommentObj: Comment = {
                id: `comment-${Date.now()}`,
                userId: currentUserId,
                userName: currentUserName,
                userImage: currentUserImage,
                verified: isVerified,
                text: newComment,
                timestamp: new Date(),
                likes: 0,
                liked: false,
                replies: []
            };

            if (replyingTo) {
                // Add as a reply
                setComments(prev =>
                    prev.map(comment => {
                        if (comment.id === replyingTo) {
                            return {
                                ...comment,
                                replies: [...(comment.replies || []), newCommentObj]
                            };
                        }
                        return comment;
                    })
                );
                setReplyingTo(null);
            } else {
                // Add as a new comment
                setComments(prev => [newCommentObj, ...prev]);
            }

            setNewComment('');
            setIsSubmittingComment(false);
        }, 500);
    };

    // Handle reply
    const handleReply = (commentId: string) => {
        setReplyingTo(commentId);
        commentInputRef.current?.focus();
    };

    // Handle like comment
    const handleLikeComment = (commentId: string) => {
        setComments(prev =>
            prev.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
                        liked: !comment.liked
                    };
                }
                // Check in replies too
                if (comment.replies) {
                    return {
                        ...comment,
                        replies: comment.replies.map(reply => {
                            if (reply.id === commentId) {
                                return {
                                    ...reply,
                                    likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                                    liked: !reply.liked
                                };
                            }
                            return reply;
                        })
                    };
                }
                return comment;
            })
        );
    };

    // Process payment
    const processPayment = () => {
        // Validate card details if using card payment
        if (paymentMethod === 'card') {
            const newErrors: Record<string, string> = {};

            if (!cardDetails.number.trim() || cardDetails.number.length < 16) {
                newErrors.number = 'Please enter a valid card number';
            }

            if (!cardDetails.name.trim()) {
                newErrors.name = 'Please enter cardholder name';
            }

            if (!cardDetails.expiry.trim() || !cardDetails.expiry.includes('/')) {
                newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
            }

            if (!cardDetails.cvc.trim() || cardDetails.cvc.length < 3) {
                newErrors.cvc = 'Please enter a valid CVC';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
        }

        setIsProcessingPayment(true);

        // Simulate payment processing
        setTimeout(() => {
            // Simulate successful payment
            setPaymentSuccess(true);
            setIsProcessingPayment(false);

            // Call the callback if provided
            if (onBookingComplete) {
                onBookingComplete({
                    eventId: event.id,
                    ticketType: selectedTicketType,
                    quantity: ticketQuantity,
                    paymentMethod,
                    total: paymentDetails.total,
                    timestamp: new Date()
                });
            }
        }, 2000);
    };

    // Join waitlist
    const handleJoinWaitlist = () => {
        setJoinedWaitlist(true);
        // In a real app, you would trigger an API call here
    };

    // Calculate ticket availability percentage
    const ticketAvailabilityPercent = Math.min(100, Math.round((event.soldTickets / event.totalTickets) * 100));

    // Celebration confetti effect
    useEffect(() => {
        if (!showCelebration || !confettiCanvasRef.current) return;

        const canvas = confettiCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const confettiCount = 200;
        const confettiColors = ['#FF5722', '#FF9800', '#4CAF50', '#2196F3', '#9C27B0'];

        // Fixed the any[] to a proper type
        interface ConfettiParticle {
            x: number;
            y: number;
            size: number;
            color: string;
            speed: number;
            angle: number;
            rotation: number;
            rotationSpeed: number;
        }

        const confetti: ConfettiParticle[] = [];

        // Create confetti particles
        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 10 + 5,
                color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                speed: Math.random() * 3 + 2,
                angle: Math.random() * 2 * Math.PI,
                rotation: Math.random() * 0.2 - 0.1,
                rotationSpeed: Math.random() * 0.01 - 0.005
            });
        }

        let animationFrame: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let complete = true;

            confetti.forEach(particle => {
                particle.y += particle.speed;
                particle.x += Math.sin(particle.angle) * 2;
                particle.angle += particle.rotation;

                if (particle.y < canvas.height) {
                    complete = false;
                }

                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.rect(particle.x, particle.y, particle.size, particle.size);
                ctx.fill();
            });

            if (!complete) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animate();

        return () => cancelAnimationFrame(animationFrame);
    }, [showCelebration]);

    // Format currency
    const formatCurrency = (amount: number) => {
        return `${event.price.currency} ${amount.toFixed(2)}`;
    };

    // Mock list of comments
    useEffect(() => {
        // Initialize with some mock comments
        setComments([
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
                replies: [
                    {
                        id: '1-1',
                        userId: '3',
                        userName: 'Marcus Johnson',
                        userImage: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop',
                        verified: false,
                        text: 'Yes, the organiser confirmed there will be at least 5 food vendors with options for vegetarians!',
                        timestamp: new Date(Date.now() - 3600000 * 3), // 3 hours ago
                        likes: 4,
                        liked: false,
                    }
                ]
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
        ]);

        // Mock attendees
        setAttendees([
            {
                id: '1',
                name: 'Alex Rivera',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop',
                username: 'alexr',
                verified: true
            },
            {
                id: '2',
                name: 'Sophia Chen',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
                username: 'sophia.c',
                verified: true
            },
            {
                id: '3',
                name: 'Marcus Johnson',
                image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974&auto=format&fit=crop',
                username: 'mjohnson',
                verified: false
            },
            {
                id: '4',
                name: 'Aisha Patel',
                image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop',
                username: 'aisha_p',
                verified: false
            },
        ]);
    }, []);

    // Share event
    const shareEvent = () => {
        setShowShareModal(true);
    };

    // Format relative time for comments
    const formatRelativeTime = (date: Date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return format(date, 'MMM d, yyyy');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Dynamic Header */}
            <div
                ref={headerRef}
                style={{ '--header-bg-opacity': '0' } as React.CSSProperties}
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md"
            >
                <div
                    className="absolute inset-0 bg-white transition-opacity duration-300"
                    style={{ opacity: 'var(--header-bg-opacity)' }}
                ></div>

                <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
                    <button
                        onClick={() => window.history.back()}
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
                            onClick={shareEvent}
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
                <div
                    className="absolute inset-0 transform transition-transform duration-1000"
                    style={{ transform: scrolled ? 'scale(1.05)' : 'scale(1)' }}
                >
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

                    {/* Ticket Availability */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-medium text-gray-700">Ticket Availability</p>
                            <span className="text-sm text-gray-700 font-medium">
                                {event.totalTickets - event.soldTickets}/{event.totalTickets}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${100 - ticketAvailabilityPercent}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-[#FF5722] to-[#FF9800]"
                            ></motion.div>
                        </div>
                        {isSoldOut ? (
                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                <FiAlertCircle className="mr-1" />
                                Sold Out! {joinedWaitlist ? 'You joined the waitlist.' : 'Join the waitlist for cancellations.'}
                            </p>
                        ) : remainingTickets < 10 ? (
                            <p className="mt-1 text-sm text-orange-500 flex items-center">
                                <FiAlertCircle className="mr-1" />
                                Only {remainingTickets} tickets left! Get yours before they sell out.
                            </p>
                        ) : null}
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
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5722] rounded-full"
                                        ></motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="pb-6"
                        >
                            {/* Details Tab */}
                            {activeTab === 'details' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About this event</h3>
                                        <p className="text-gray-700 leading-relaxed">{event.description}</p>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {event.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:bg-gray-200 transition-all cursor-pointer"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Location Map */}
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                                            <button
                                                onClick={toggleAmenities}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${showAmenities
                                                    ? 'bg-[#FF5722]/10 text-[#FF5722]'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {showAmenities ? 'Hide Amenities' : 'Show Amenities'}
                                            </button>
                                        </div>
                                        <div className="h-64 rounded-lg overflow-hidden relative mb-2 shadow-md">
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

                                    {/* Amenities section - if event has amenities */}
                                    {event.amenities && event.amenities.length > 0 && (
                                        <AnimatePresence>
                                            {showAmenities && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Nearby Amenities</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {event.amenities.map((amenity) => (
                                                            <div
                                                                key={amenity.id}
                                                                className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-3"
                                                            >
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                  ${amenity.type === 'parking' ? 'bg-green-100 text-green-600' :
                                                                        amenity.type === 'hotel' ? 'bg-blue-100 text-blue-600' :
                                                                            amenity.type === 'restaurant' ? 'bg-orange-100 text-orange-600' :
                                                                                'bg-purple-100 text-purple-600'}
                                `}>
                                                                    {amenity.type === 'parking' && (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.5 9a.5.5 0 01.5-.5h3.5V6a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-2.5H7a.5.5 0 01-.5-.5z" clipRule="evenodd" />
                                                                        </svg>
                                                                    )}
                                                                    {amenity.type === 'hotel' && (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                                                        </svg>
                                                                    )}
                                                                    {amenity.type === 'restaurant' && (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M6 3V2h8v1h1a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1h1zm8 4V5H6v2h8zM5 8h10v8a2 2 0 01-2 2H7a2 2 0 01-2-2V8zm2 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                                                        </svg>
                                                                    )}
                                                                    {amenity.type === 'transport' && (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path d="M8 16s6-5.686 6-10A6 6 0 002 6c0 4.314 6 10 6 10zm0-7a3 3 0 110-6 3 3 0 010 6z" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{amenity.name}</p>
                                                                    <p className="text-sm text-gray-500 capitalize">{amenity.type} · {amenity.distance}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </div>
                            )}

                            {/* Tickets Tab */}
                            {activeTab === 'tickets' && (
                                <div className="space-y-6">
                                    {isSoldOut ? (
                                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                                            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FiAlertCircle className="h-8 w-8 text-red-500" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sold Out!</h3>
                                            <p className="text-gray-600 mb-6">All tickets for this event have been sold. Join our waitlist to be notified if more tickets become available.</p>

                                            {!joinedWaitlist ? (
                                                <button
                                                    onClick={handleJoinWaitlist}
                                                    className="px-6 py-3 bg-[#FF5722] text-white rounded-full font-medium shadow-md hover:bg-[#E64A19] transition-colors inline-flex items-center"
                                                >
                                                    <FiUsers className="mr-2" />
                                                    Join Waitlist
                                                </button>
                                            ) : (
                                                <div className="bg-green-50 text-green-600 p-3 rounded-lg inline-flex items-center">
                                                    <FiCheck className="mr-2" />
                                                    You&apos;re on the waitlist!
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-semibold text-gray-900">Available Tickets</h3>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-500">Available:</span>
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${100 - ticketAvailabilityPercent}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className="h-full bg-gradient-to-r from-[#FF5722] to-[#FF9800]"
                                                        ></motion.div>
                                                    </div>
                                                    <span className="text-sm text-gray-700 font-medium">
                                                        {remainingTickets}/{event.totalTickets}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Ticket Types */}
                                            <div className="space-y-4">
                                                {event.ticketTypes.map(ticket => (
                                                    <motion.div
                                                        key={ticket.id}
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.99 }}
                                                        className={`p-4 border rounded-lg transition-all ${selectedTicketType === ticket.id
                                                            ? 'border-[#FF5722] bg-gradient-to-r from-[#FF5722]/10 to-[#FF5722]/5 shadow-md'
                                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between mb-3">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">{ticket.name}</h4>
                                                                <p className="text-sm text-gray-500">{ticket.description}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-[#FF5722]">{event.price.currency} {ticket.price}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {ticket.available} remaining
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {ticket.features && ticket.features.length > 0 && (
                                                            <div className="mb-3">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {ticket.features.map((feature, index) => (
                                                                        <span key={index} className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                                                            <FiCheck className="mr-1 text-green-500" size={10} />
                                                                            {feature}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center space-x-1">
                                                                {ticket.isNft && (
                                                                    <div className="flex items-center space-x-1 text-xs bg-[#FF5722]/10 text-[#FF5722] px-2 py-1 rounded-full">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                                                        </svg>
                                                                        <span>NFT Ticket</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedTicketType(ticket.id);
                                                                    setTicketQuantity(1);
                                                                    setShowBookingModal(true);
                                                                }}
                                                                className={`text-sm px-4 py-2 rounded-full font-medium transition-all ${selectedTicketType === ticket.id
                                                                    ? 'bg-[#FF5722] text-white shadow-md'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                    }`}
                                                            >
                                                                Select
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
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
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Attendees Tab */}
                            {activeTab === 'attendees' && (
                                <div>
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
                                            {attendees.map((attendee) => (
                                                <motion.div
                                                    key={attendee.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
                                                </motion.div>
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
                                <div>
                                    {/* New Comment Input */}
                                    <div className="mb-6">
                                        <div className="flex items-start space-x-3">
                                            <div className="h-10 w-10 rounded-full overflow-hidden shadow-sm">
                                                <Image
                                                    src={currentUserImage}
                                                    alt="Your avatar"
                                                    width={40}
                                                    height={40}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="relative">
                                                    <textarea
                                                        ref={commentInputRef}
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        placeholder={replyingTo ? "Write a reply..." : "Ask a question or leave a comment..."}
                                                        className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 focus:outline-none resize-none transition-all"
                                                        rows={3}
                                                    />
                                                    {replyingTo && (
                                                        <div className="absolute -top-3 left-3 px-2 py-0.5 bg-[#FF5722]/10 text-[#FF5722] text-xs font-medium rounded-full">
                                                            Replying
                                                            <button
                                                                onClick={() => setReplyingTo(null)}
                                                                className="ml-1 text-gray-500 hover:text-gray-700"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    {replyingTo && (
                                                        <button
                                                            onClick={() => setReplyingTo(null)}
                                                            className="text-sm text-gray-500 hover:text-gray-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                    <div className="ml-auto">
                                                        <button
                                                            onClick={handleAddComment}
                                                            disabled={!newComment.trim() || isSubmittingComment}
                                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${newComment.trim() && !isSubmittingComment
                                                                ? 'bg-[#FF5722] text-white hover:bg-[#E64A19] shadow-sm'
                                                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            {isSubmittingComment ? 'Posting...' : replyingTo ? 'Reply' : 'Post Comment'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comments List */}
                                    {comments.length > 0 ? (
                                        <div className="space-y-6">
                                            {comments.map((comment) => (
                                                <div key={comment.id} className="comment-container">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="h-10 w-10 rounded-full overflow-hidden shadow-sm">
                                                            <Image
                                                                src={comment.userImage}
                                                                alt={comment.userName}
                                                                width={40}
                                                                height={40}
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                                                <div className="flex items-center mb-1">
                                                                    <h4 className="font-medium text-gray-900">{comment.userName}</h4>
                                                                    {comment.verified && (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                        </svg>
                                                                    )}
                                                                    <span className="ml-2 text-xs text-gray-500">
                                                                        {formatRelativeTime(comment.timestamp)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-700">{comment.text}</p>
                                                                <div className="flex items-center space-x-4 mt-3">
                                                                    <button
                                                                        onClick={() => handleLikeComment(comment.id)}
                                                                        className={`text-sm flex items-center space-x-1 ${comment.liked ? 'text-[#FF5722]' : 'text-gray-500 hover:text-gray-700'
                                                                            }`}
                                                                    >
                                                                        <FiHeart className={comment.liked ? 'fill-current' : ''} size={14} />
                                                                        <span>{comment.likes}</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReply(comment.id)}
                                                                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                                                                    >
                                                                        <FiMessageSquare size={14} />
                                                                        <span>Reply</span>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Replies */}
                                                            {comment.replies && comment.replies.length > 0 && (
                                                                <div className="mt-3 pl-6 space-y-3">
                                                                    {comment.replies.map((reply) => (
                                                                        <div key={reply.id} className="flex items-start space-x-3">
                                                                            <div className="h-8 w-8 rounded-full overflow-hidden shadow-sm">
                                                                                <Image
                                                                                    src={reply.userImage}
                                                                                    alt={reply.userName}
                                                                                    width={32}
                                                                                    height={32}
                                                                                    className="object-cover"
                                                                                />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                                                                                    <div className="flex items-center mb-1">
                                                                                        <h4 className="font-medium text-gray-900 text-sm">{reply.userName}</h4>
                                                                                        {reply.verified && (
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                                            </svg>
                                                                                        )}
                                                                                        <span className="ml-2 text-xs text-gray-500">
                                                                                            {formatRelativeTime(reply.timestamp)}
                                                                                        </span>
                                                                                    </div>
                                                                                    <p className="text-gray-700 text-sm">{reply.text}</p>
                                                                                    <div className="flex items-center space-x-4 mt-2">
                                                                                        <button
                                                                                            onClick={() => handleLikeComment(reply.id)}
                                                                                            className={`text-xs flex items-center space-x-1 ${reply.liked ? 'text-[#FF5722]' : 'text-gray-500 hover:text-gray-700'
                                                                                                }`}
                                                                                        >
                                                                                            <FiHeart className={reply.liked ? 'fill-current' : ''} size={12} />
                                                                                            <span>{reply.likes}</span>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 rounded-lg">
                                            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                <FiMessageSquare className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">No comments yet</h3>
                                            <p className="text-gray-500 mb-4">Be the first to ask a question or leave a comment!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
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
                            onClick={shareEvent}
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
                            {isSoldOut ? (
                                <div>
                                    <p className="text-sm text-gray-500">Sold Out!</p>
                                    <p className="font-medium text-red-500">No tickets available</p>
                                </div>
                            ) : selectedTicketType ? (
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
                                                disabled={ticketQuantity >= (event.ticketTypes.find(t => t.id === selectedTicketType)?.maxPerOrder || 10)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">Total</p>
                                            <p className="font-bold text-[#FF5722]">{formatCurrency(paymentDetails.total)}</p>
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

                        {isSoldOut ? (
                            <button
                                onClick={handleJoinWaitlist}
                                disabled={joinedWaitlist}
                                className={`px-6 py-3 rounded-full text-white font-medium transition-all ${joinedWaitlist
                                    ? 'bg-green-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#FF5722] to-[#FF7A50] hover:shadow-lg active:shadow-inner'
                                    }`}
                            >
                                {joinedWaitlist ? 'Joined Waitlist ✓' : 'Join Waitlist'}
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (selectedTicketType) {
                                        setShowBookingModal(true);
                                    } else {
                                        setActiveTab('tickets');
                                    }
                                }}
                                className={`px-6 py-3 rounded-full text-white font-medium transition-all ${'bg-gradient-to-r from-[#FF5722] to-[#FF7A50] hover:shadow-lg active:shadow-inner'
                                    }`}
                            >
                                {selectedTicketType ? (
                                    ticketQuantity > 1 ? `Get ${ticketQuantity} Tickets` : 'Get Ticket'
                                ) : (
                                    'Book Tickets'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {showBookingModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="relative p-6 border-b border-gray-100">
                                <button
                                    onClick={() => {
                                        if (!isProcessingPayment) {
                                            setShowBookingModal(false);
                                            setPaymentStep('selection');
                                            setPaymentSuccess(false);
                                        }
                                    }}
                                    disabled={isProcessingPayment}
                                    className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    <FiX size={20} />
                                </button>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {paymentSuccess ? 'Booking Confirmed!' : (
                                        paymentStep === 'selection' ? 'Book Tickets' :
                                            paymentStep === 'payment' ? 'Payment Details' :
                                                'Confirm Booking'
                                    )}
                                </h2>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {paymentSuccess ? (
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-4">
                                            <FiCheck size={32} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your booking is confirmed!</h3>
                                        <p className="text-gray-600 mb-6">Your tickets will be sent to your email and will be available in your account.</p>

                                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600">Event</span>
                                                <span className="font-medium text-gray-900">{event.title}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600">Date & Time</span>
                                                <span className="font-medium text-gray-900">{eventDate}, {eventTime}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600">Ticket Type</span>
                                                <span className="font-medium text-gray-900">
                                                    {event.ticketTypes.find(t => t.id === selectedTicketType)?.name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600">Quantity</span>
                                                <span className="font-medium text-gray-900">{ticketQuantity}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600">Total Paid</span>
                                                <span className="font-bold text-[#FF5722]">{formatCurrency(paymentDetails.total)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Payment Method</span>
                                                <span className="font-medium text-gray-900 capitalize">
                                                    {paymentMethod}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <button
                                                onClick={() => {
                                                    setShowBookingModal(false);
                                                    if (onBookingComplete) {
                                                        onBookingComplete({
                                                            eventId: event.id,
                                                            ticketType: selectedTicketType,
                                                            quantity: ticketQuantity,
                                                            paymentMethod,
                                                            total: paymentDetails.total,
                                                            timestamp: new Date()
                                                        });
                                                    }
                                                }}
                                                className="w-full py-3 bg-[#FF5722] text-white rounded-full font-medium shadow-md hover:bg-[#E64A19] transition-colors"
                                            >
                                                Add to Calendar
                                            </button>

                                            <button
                                                onClick={shareEvent}
                                                className="w-full py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                                            >
                                                <FiShare2 className="mr-2" />
                                                Share with Friends
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Ticket Selection Step */}
                                        {paymentStep === 'selection' && (
                                            <div>
                                                <div className="mb-6">
                                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Ticket</h3>
                                                    {event.ticketTypes.filter(ticket => ticket.id === selectedTicketType).map(ticket => (
                                                        <div key={ticket.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                            <div className="flex justify-between mb-1">
                                                                <h4 className="font-medium text-gray-900">{ticket.name}</h4>
                                                                <p className="font-bold text-[#FF5722]">{formatCurrency(ticket.price)}</p>
                                                            </div>
                                                            <p className="text-sm text-gray-500 mb-3">{ticket.description}</p>

                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center">
                                                                    <span className="text-sm text-gray-600 mr-3">Quantity:</span>
                                                                    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
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
                                                                            disabled={ticketQuantity >= ticket.maxPerOrder}
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <p className="font-medium text-gray-900">
                                                                    {formatCurrency(ticket.price * ticketQuantity)}
                                                                </p>
                                                            </div>

                                                            {showMaxTicketsWarning && (
                                                                <div className="mt-2 text-xs text-orange-500 flex items-center">
                                                                    <FiAlertCircle className="mr-1" />
                                                                    Maximum {ticket.available} tickets available
                                                                </div>
                                                            )}

                                                            {errors.quantity && (
                                                                <div className="mt-2 text-xs text-red-500 flex items-center">
                                                                    <FiAlertCircle className="mr-1" />
                                                                    {errors.quantity}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Order Summary */}
                                                <div className="mb-6">
                                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Order Summary</h3>
                                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                        <div className="space-y-2 mb-3">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">Subtotal</span>
                                                                <span className="text-gray-900">{formatCurrency(paymentDetails.subtotal)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">Service Fee</span>
                                                                <span className="text-gray-900">{formatCurrency(paymentDetails.fees)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">Tax</span>
                                                                <span className="text-gray-900">{formatCurrency(paymentDetails.tax)}</span>
                                                            </div>

                                                            {discountApplied && (
                                                                <div className="flex justify-between text-sm text-green-600">
                                                                    <span className="flex items-center">
                                                                        <FiCheck className="mr-1" size={14} />
                                                                        Group Discount (10%)
                                                                    </span>
                                                                    <span>-{formatCurrency(paymentDetails.discount)}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                                                            <span className="font-medium">Total</span>
                                                            <span className="font-bold text-lg text-[#FF5722]">{formatCurrency(paymentDetails.total)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Payment Method Selection */}
                                                <div className="mb-6">
                                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h3>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            onClick={() => setPaymentMethod('card')}
                                                            className={`p-3 rounded-lg border flex items-center justify-center transition-all ${paymentMethod === 'card'
                                                                ? 'border-[#FF5722] bg-[#FF5722]/5'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#FF5722]" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className={paymentMethod === 'card' ? 'font-medium text-[#FF5722]' : 'text-gray-700'}>Card</span>
                                                        </button>

                                                        <button
                                                            onClick={() => setPaymentMethod('crypto')}
                                                            className={`p-3 rounded-lg border flex items-center justify-center transition-all ${paymentMethod === 'crypto'
                                                                ? 'border-[#FF5722] bg-[#FF5722]/5'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#FF5722]" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                                                            </svg>
                                                            <span className={paymentMethod === 'crypto' ? 'font-medium text-[#FF5722]' : 'text-gray-700'}>Crypto</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => setPaymentStep('payment')}
                                                    className="w-full py-3 bg-[#FF5722] text-white rounded-full font-medium shadow-md hover:bg-[#E64A19] transition-colors"
                                                >
                                                    Continue to Payment
                                                </button>
                                            </div>
                                        )}

                                        {/* Payment Details Step */}
                                        {paymentStep === 'payment' && (
                                            <div>
                                                {paymentMethod === 'card' && (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                                            <input
                                                                type="text"
                                                                value={cardDetails.number}
                                                                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                                                placeholder="1234 5678 9012 3456"
                                                                className={`w-full px-4 py-3 rounded-lg border ${errors.number ? 'border-red-500' : 'border-gray-300'} focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 focus:outline-none transition-all`}
                                                            />
                                                            {errors.number && (
                                                                <p className="mt-1 text-xs text-red-500">{errors.number}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                                            <input
                                                                type="text"
                                                                value={cardDetails.name}
                                                                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                                                placeholder="John Doe"
                                                                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 focus:outline-none transition-all`}
                                                            />
                                                            {errors.name && (
                                                                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                                                <input
                                                                    type="text"
                                                                    value={cardDetails.expiry}
                                                                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                                    placeholder="MM/YY"
                                                                    className={`w-full px-4 py-3 rounded-lg border ${errors.expiry ? 'border-red-500' : 'border-gray-300'} focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 focus:outline-none transition-all`}
                                                                />
                                                                {errors.expiry && (
                                                                    <p className="mt-1 text-xs text-red-500">{errors.expiry}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                                                <input
                                                                    type="text"
                                                                    value={cardDetails.cvc}
                                                                    onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                                                    placeholder="123"
                                                                    className={`w-full px-4 py-3 rounded-lg border ${errors.cvc ? 'border-red-500' : 'border-gray-300'} focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 focus:outline-none transition-all`}
                                                                />
                                                                {errors.cvc && (
                                                                    <p className="mt-1 text-xs text-red-500">{errors.cvc}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {paymentMethod === 'crypto' && (
                                                    <div className="space-y-4">
                                                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                                                            <div className="h-32 w-32 mx-auto mb-4 bg-white p-2 rounded-lg shadow-sm">
                                                                <div className="bg-gray-200 w-full h-full rounded flex items-center justify-center">
                                                                    <span className="text-gray-500 text-xs">QR Code</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-700 mb-2">Send exactly {formatCurrency(paymentDetails.total)} worth of ETH to:</p>
                                                            <p className="text-xs bg-white p-2 rounded border border-gray-200 font-mono break-all">
                                                                0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
                                                            </p>
                                                        </div>

                                                        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg flex items-start">
                                                            <FiInfo className="mr-2 mt-0.5 flex-shrink-0" />
                                                            <p className="text-sm">
                                                                Payment will be automatically detected once confirmed on the blockchain. This usually takes 1-2 minutes.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-6 space-y-3">
                                                    <button
                                                        onClick={processPayment}
                                                        disabled={isProcessingPayment}
                                                        className={`w-full py-3 bg-[#FF5722] text-white rounded-full font-medium shadow-md hover:bg-[#E64A19] transition-colors flex items-center justify-center ${isProcessingPayment ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                    >
                                                        {isProcessingPayment ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Processing...
                                                            </>
                                                        ) : (
                                                            `Pay ${formatCurrency(paymentDetails.total)}`
                                                        )}
                                                    </button>

                                                    <button
                                                        onClick={() => setPaymentStep('selection')}
                                                        disabled={isProcessingPayment}
                                                        className="w-full py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
                                                    >
                                                        Back
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4"
                        >
                            <div className="relative p-6 border-b border-gray-100">
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    <FiX size={20} />
                                </button>
                                <h2 className="text-xl font-bold text-gray-900">Share this event</h2>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-center space-x-4 mb-6">
                                    {/* Social share buttons */}
                                    {[
                                        { name: 'Twitter', color: '#1DA1F2', icon: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
                                        { name: 'Facebook', color: '#1877F2', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                                        { name: 'WhatsApp', color: '#25D366', icon: 'M17 2H7C4.8 2 3 3.8 3 6v12c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4V6c0-2.2-1.8-4-4-4zm-1.5 6v3.5H12v3h3.5V18H18v-3.5H21v-3h-3V5h-2.5z' },
                                        { name: 'Email', color: '#DB4437', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 4.5l-8 5-8-5V6c0-.3.2-.5.5-.5h15c.3 0 .5.2.5.5v2.5z' }
                                    ].map(platform => (
                                        <button
                                            key={platform.name}
                                            className="flex flex-col items-center justify-center"
                                        >
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                                                style={{ backgroundColor: platform.color }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d={platform.icon}></path>
                                                </svg>
                                            </div>
                                            <span className="text-xs text-gray-700">{platform.name}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 mb-2">Or copy link</p>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            readOnly
                                            value={`https://event.app/${event.id}`}
                                            className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 bg-gray-50 text-sm"
                                        />
                                        <button className="px-4 py-2 bg-[#FF5722] text-white rounded-r-lg hover:bg-[#E64A19] transition-colors">
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Max Tickets Warning */}
            <AnimatePresence>
                {showMaxTicketsWarning && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-24 left-0 right-0 flex justify-center px-4 z-40"
                    >
                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-lg shadow-lg max-w-md">
                            <div className="flex items-center">
                                <FiAlertCircle className="flex-shrink-0 mr-2" />
                                <span>Maximum available tickets selected. We&apos;ve adjusted your quantity to match availability.</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confetti Canvas for Celebration */}
            {showCelebration && <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none z-50" />}

            {/* Mapbox Marker Styles */}
            <style jsx global>{`
        .custom-marker {
          cursor: pointer;
        }
        
        .marker-pin {
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: #FF5722;
          position: relative;
          transform: rotate(-45deg);
          animation: pulse 2s infinite;
        }
        
        .marker-dot {
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
        }
        
        .amenity-marker-pin {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 rgba(0, 0, 0, 0.2);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 87, 34, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 87, 34, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 87, 34, 0);
          }
        }
        
        .mapboxgl-popup {
          max-width: 200px;
        }
        
        .mapboxgl-popup-content {
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
        </div>
    );
};

export default EventBooking;