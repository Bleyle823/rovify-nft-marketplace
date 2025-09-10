/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
    FiCalendar, FiChevronLeft, FiChevronRight, FiPlus, FiClock,
    FiUsers, FiMapPin, FiEdit3, FiTrash2, FiEye, FiFilter,
    FiRefreshCw, FiDownload, FiGrid, FiList, FiMoreHorizontal,
    FiX, FiSave, FiSearch, FiTrendingUp, FiDollarSign
} from 'react-icons/fi';

// Types for API integration
type EventStatus = 'confirmed' | 'draft' | 'cancelled';

type CalendarEvent = {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    image: string;
    location: string;
    attendees: number;
    capacity: number;
    status: EventStatus;
    category: string;
    color: string;
    revenue: number;
    description: string;
};

type CreateEventData = Omit<CalendarEvent, 'id' | 'attendees' | 'revenue'>;

// API simulation functions (replace with real API calls)
const apiSimulation = {
    getEvents: async (): Promise<CalendarEvent[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockEvents;
    },
    createEvent: async (eventData: CreateEventData): Promise<CalendarEvent> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
            ...eventData,
            id: Date.now().toString(),
            attendees: 0,
            revenue: 0
        };
    },
    updateEvent: async (id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const existingEvent = mockEvents.find(e => e.id === id);
        return { ...existingEvent, ...eventData } as CalendarEvent;
    },
    deleteEvent: async (id: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 300));
    }
};

// Mock data
const mockEvents: CalendarEvent[] = [
    {
        id: '1',
        title: 'AI & ML Summit 2025',
        date: '2025-06-25',
        startTime: '09:00',
        endTime: '18:00',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop',
        location: 'Tech Convention Center',
        attendees: 847,
        capacity: 1000,
        status: 'confirmed',
        category: 'Technology',
        color: 'from-blue-500 to-blue-600',
        revenue: 252653,
        description: 'Annual summit bringing together AI researchers and industry leaders'
    },
    {
        id: '2',
        title: 'Electronic Music Festival',
        date: '2025-06-28',
        startTime: '18:00',
        endTime: '23:59',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=200&fit=crop',
        location: 'Downtown Arena',
        attendees: 1247,
        capacity: 2000,
        status: 'confirmed',
        category: 'Music',
        color: 'from-purple-500 to-purple-600',
        revenue: 160863,
        description: 'Three days of electronic music with top international DJs'
    },
    {
        id: '3',
        title: 'Startup Pitch Day',
        date: '2025-07-05',
        startTime: '14:00',
        endTime: '20:00',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
        location: 'Innovation Hub',
        attendees: 156,
        capacity: 200,
        status: 'draft',
        category: 'Business',
        color: 'from-emerald-500 to-emerald-600',
        revenue: 13884,
        description: 'Early-stage startups compete for $100K in funding'
    }
];

const statusConfig = {
    confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
};

const categoryColors: { [key: string]: string } = {
    'Technology': 'from-blue-500 to-blue-600',
    'Music': 'from-purple-500 to-purple-600',
    'Business': 'from-emerald-500 to-emerald-600',
    'Education': 'from-orange-500 to-orange-600',
    'Networking': 'from-pink-500 to-rose-600'
};

// Compact Calendar Component
const CompactCalendar = ({
    currentDate,
    events,
    onDateClick,
    selectedDate
}: {
    currentDate: Date;
    events: CalendarEvent[];
    onDateClick: (dateString: string) => void;
    selectedDate: string | null;
}) => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());

    const days = [];
    const currentDateObj = new Date(startDate);

    for (let i = 0; i < 42; i++) {
        days.push(new Date(currentDateObj));
        currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    const getEventsForDate = (date: Date) => {
        const dateString = date.toISOString().split('T')[0];
        return events.filter(event => event.date === dateString);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentDate.getMonth();
    };

    const isSelected = (date: Date) => {
        return selectedDate === date.toISOString().split('T')[0];
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Compact Calendar Header */}
            <div className="p-2 sm:p-3 border-b border-gray-100 bg-gray-50">
                <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="p-1 sm:p-2 text-center text-xs font-semibold text-gray-600">
                            <span className="hidden sm:inline">{day}</span>
                            <span className="sm:hidden">{day.slice(0, 1)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Compact Calendar Grid */}
            <div className="p-2 sm:p-3">
                <div className="grid grid-cols-7 gap-1">
                    {days.map((date, index) => {
                        const dayEvents = getEventsForDate(date);
                        const dateString = date.toISOString().split('T')[0];

                        return (
                            <button
                                key={index}
                                className={`min-h-8 sm:min-h-10 md:min-h-12 p-1 sm:p-2 rounded-lg transition-all border text-left relative group ${isSelected(date)
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                                    : isToday(date)
                                        ? 'bg-orange-50 border-orange-200 text-orange-900'
                                        : isCurrentMonth(date)
                                            ? 'hover:bg-gray-50 border-transparent hover:border-gray-200'
                                            : 'text-gray-400 border-transparent opacity-50'
                                    }`}
                                onClick={() => onDateClick(dateString)}
                            >
                                <div className={`text-xs sm:text-sm font-medium ${isSelected(date) ? 'text-white' : ''}`}>
                                    {date.getDate()}
                                </div>

                                {/* Event indicators */}
                                {dayEvents.length > 0 && (
                                    <div className="flex gap-0.5 mt-0.5">
                                        {dayEvents.slice(0, 3).map((event, i) => (
                                            <div
                                                key={i}
                                                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${isSelected(date) ? 'bg-white/60' : 'bg-orange-400'
                                                    }`}
                                            />
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <div className={`text-xs ${isSelected(date) ? 'text-white/80' : 'text-gray-500'}`}>
                                                +{dayEvents.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Event Form Modal
const EventModal = ({
    isOpen,
    onClose,
    event,
    onSave
}: {
    isOpen: boolean;
    onClose: () => void;
    event?: CalendarEvent | null;
    onSave: (eventData: CalendarEvent | CreateEventData) => Promise<void>;
}) => {
    const [formData, setFormData] = useState<CreateEventData>({
        title: '',
        date: '',
        startTime: '09:00',
        endTime: '17:00',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop',
        location: '',
        capacity: 100,
        status: 'draft',
        category: 'Technology',
        color: 'from-blue-500 to-blue-600',
        description: ''
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title,
                date: event.date,
                startTime: event.startTime,
                endTime: event.endTime,
                image: event.image,
                location: event.location,
                capacity: event.capacity,
                status: event.status,
                category: event.category,
                color: event.color,
                description: event.description
            });
        } else {
            setFormData({
                title: '',
                date: '',
                startTime: '09:00',
                endTime: '17:00',
                image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop',
                location: '',
                capacity: 100,
                status: 'draft',
                category: 'Technology',
                color: 'from-blue-500 to-blue-600',
                description: ''
            });
        }
    }, [event, isOpen]);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (event) {
                await onSave({ ...event, ...formData });
            } else {
                await onSave(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving event:', error);
        }
        setSaving(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg sm:text-xl font-bold">
                            {event ? 'Edit Event' : 'Create Event'}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                            <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                                placeholder="Event title"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                                placeholder="Event location"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        category: e.target.value,
                                        color: categoryColors[e.target.value] || 'from-blue-500 to-blue-600'
                                    })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                                >
                                    {Object.keys(categoryColors).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                                rows={3}
                                placeholder="Event description"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 p-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !formData.title || !formData.date}
                            className="flex-1 bg-orange-500 text-white p-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            {saving ? (
                                <FiRefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <FiSave className="w-4 h-4" />
                            )}
                            {saving ? 'Saving...' : 'Save Event'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Event Card with Fixed Image Issue
const EventCard = ({ event, onEdit, onDelete, onView }: {
    event: CalendarEvent;
    onEdit: () => void;
    onDelete: () => void;
    onView: () => void;
}) => {
    const formatTime = (time: string) => {
        const [hour, minute] = time.split(':');
        const hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum % 12 || 12;
        return `${displayHour}:${minute} ${ampm}`;
    };

    const fillPercentage = (event.attendees / event.capacity) * 100;

    return (
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="flex gap-3 sm:gap-4">
                {/* Fixed Image Container */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                    <Image
                        src={event.image}
                        alt={event.title}
                        width={80}
                        height={80}
                        className="object-cover rounded-lg w-full h-full"
                        sizes="(max-width: 640px) 64px, 80px"
                    />
                    <div className={`absolute -top-1 -right-1 w-3 h-3 ${statusConfig[event.status].dot} rounded-full border-2 border-white`}></div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-lg mb-1 group-hover:text-orange-600 transition-colors truncate">
                                {event.title}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm line-clamp-1">{event.description}</p>
                        </div>
                        <div className="flex gap-1 ml-2 flex-shrink-0">
                            <span className={`${statusConfig[event.status].color} px-2 py-1 rounded-full text-xs font-medium`}>
                                {statusConfig[event.status].label}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                            <FiClock className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FiMapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FiUsers className="w-3 h-3 flex-shrink-0" />
                            <span>{event.attendees}/{event.capacity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FiDollarSign className="w-3 h-3 flex-shrink-0" />
                            <span className="text-green-600 font-semibold">${event.revenue.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                            <div className="w-12 sm:w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${fillPercentage}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-500">{Math.round(fillPercentage)}% full</span>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                            <button
                                onClick={onView}
                                className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors"
                                title="View event"
                            >
                                <FiEye className="w-3 h-3 text-gray-600" />
                            </button>
                            <button
                                onClick={onEdit}
                                className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Edit event"
                            >
                                <FiEdit3 className="w-3 h-3 text-gray-600" />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete event"
                            >
                                <FiTrash2 className="w-3 h-3 text-red-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Calendar Component
export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState('calendar');
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    // Load events on component mount
    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const data = await apiSimulation.getEvents();
            setEvents(data);
        } catch (error) {
            console.error('Error loading events:', error);
        }
        setLoading(false);
    };

    const handleCreateEvent = async (eventData: CreateEventData) => {
        try {
            const newEvent = await apiSimulation.createEvent(eventData);
            setEvents(prev => [...prev, newEvent]);
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const handleUpdateEvent = async (eventData: CalendarEvent) => {
        try {
            const updatedEvent = await apiSimulation.updateEvent(eventData.id, eventData);
            setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                await apiSimulation.deleteEvent(id);
                setEvents(prev => prev.filter(e => e.id !== id));
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    const handleEventSave = async (eventData: CalendarEvent | CreateEventData) => {
        if ('id' in eventData) {
            await handleUpdateEvent(eventData);
        } else {
            await handleCreateEvent(eventData);
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || event.category === filterCategory;
        const matchesDate = !selectedDate || event.date === selectedDate;

        return matchesSearch && matchesCategory && matchesDate;
    });

    const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
    const todayEvents = events.filter(event => event.date === new Date().toISOString().split('T')[0]);

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(newDate.getMonth() - 1);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <div className="text-center">
                    <FiRefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
                    <p className="text-gray-600">Loading calendar...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Responsive Header */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-xl p-4 sm:p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 flex items-center gap-2">
                                <FiCalendar className="w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8" />
                                Calendar
                            </h1>
                            <p className="text-orange-100 text-sm sm:text-base">
                                {upcomingEvents.length} upcoming • {todayEvents.length} today
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => {
                                    setEditingEvent(null);
                                    setModalOpen(true);
                                }}
                                className="bg-white text-orange-600 px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-all flex items-center gap-2 text-sm sm:text-base"
                            >
                                <FiPlus className="w-4 h-4" />
                                <span className="hidden sm:inline">New Event</span>
                                <span className="sm:hidden">New</span>
                            </button>
                            <button className="bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-all flex items-center gap-2 text-sm sm:text-base">
                                <FiDownload className="w-4 h-4" />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Responsive Controls */}
            <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                        </button>

                        <h2 className="text-base sm:text-lg font-bold text-gray-900">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h2>

                        <button
                            onClick={() => navigateMonth('next')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full"
                            />
                        </div>

                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="">All Categories</option>
                            {Object.keys(categoryColors).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`px-2 sm:px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${viewMode === 'calendar' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                                    }`}
                            >
                                <FiCalendar className="w-4 h-4" />
                                <span className="hidden sm:inline">Calendar</span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-2 sm:px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                                    }`}
                            >
                                <FiList className="w-4 h-4" />
                                <span className="hidden sm:inline">List</span>
                            </button>
                        </div>
                    </div>
                </div>

                {selectedDate && (
                    <div className="flex items-center justify-between bg-orange-50 rounded-lg p-3 mt-4 border border-orange-200">
                        <span className="text-orange-800 font-medium text-sm">
                            📅 {new Date(selectedDate).toLocaleDateString()}
                        </span>
                        <button
                            onClick={() => setSelectedDate(null)}
                            className="text-orange-600 hover:text-orange-800 transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Responsive Main Content */}
            {viewMode === 'calendar' ? (
                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:col-span-1">
                        <CompactCalendar
                            currentDate={currentDate}
                            events={events}
                            onDateClick={setSelectedDate}
                            selectedDate={selectedDate}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                                {selectedDate ? `Events for ${new Date(selectedDate).toLocaleDateString()}` : 'Upcoming Events'}
                            </h3>

                            {filteredEvents.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-3xl mb-3">📅</div>
                                    <p className="text-gray-600 mb-4">No events found</p>
                                    <button
                                        onClick={() => {
                                            setEditingEvent(null);
                                            setModalOpen(true);
                                        }}
                                        className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all flex items-center gap-2 mx-auto text-sm sm:text-base"
                                    >
                                        <FiPlus className="w-4 h-4" />
                                        Create Event
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredEvents.map(event => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            onEdit={() => {
                                                setEditingEvent(event);
                                                setModalOpen(true);
                                            }}
                                            onDelete={() => handleDeleteEvent(event.id)}
                                            onView={() => console.log('View event:', event.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">All Events</h3>

                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-gray-400 text-3xl mb-3">📅</div>
                            <p className="text-gray-600 mb-4">No events found</p>
                            <button
                                onClick={() => {
                                    setEditingEvent(null);
                                    setModalOpen(true);
                                }}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all flex items-center gap-2 mx-auto text-sm sm:text-base"
                            >
                                <FiPlus className="w-4 h-4" />
                                Create Event
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredEvents.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onEdit={() => {
                                        setEditingEvent(event);
                                        setModalOpen(true);
                                    }}
                                    onDelete={() => handleDeleteEvent(event.id)}
                                    onView={() => console.log('View event:', event.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Event Modal */}
            <EventModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingEvent(null);
                }}
                event={editingEvent}
                onSave={handleEventSave}
            />
        </div>
    );
}