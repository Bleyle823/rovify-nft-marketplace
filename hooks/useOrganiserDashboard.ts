import { useState, useEffect, useCallback } from 'react';

interface OrganiserInfo {
  name: string;
  level: string;
  levelProgress: number;
  points: number;
  streakDays: number;
  eventsCreated: number;
  totalAttendees: number;
  totalRevenue: number;
  monthlyGrowth: number;
  rating: number;
  completedEvents: number;
}

interface QuickStat {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

interface RecentActivity {
  id: string;
  type: string;
  amount: number;
  currency: string;
  event: string;
  time: string;
  status: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  image: string;
  location: any;
  price: any;
  attendees: number;
  capacity: number;
  status: string;
  views: number;
  likes: number;
}

interface DashboardData {
  organiserInfo: OrganiserInfo;
  quickStats: QuickStat[];
  recentActivity: RecentActivity[];
  upcomingEvents: UpcomingEvent[];
  summary: {
    totalEvents: number;
    publishedEvents: number;
    draftEvents: number;
    completedEvents: number;
    totalAttendees: number;
    monthlyRevenue: number;
    avgRating: number;
    revenueGrowth: number;
  };
}

interface EventData {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  end_date?: string;
  location: any;
  category: string;
  subcategory?: string;
  tags: string[];
  price: any;
  venue_capacity?: number;
  total_tickets?: number;
  sold_tickets?: number;
  status: string;
  is_featured: boolean;
  likes: number;
  views: number;
  shares: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  attendees: number;
  capacity: number;
  revenue: number;
  rating: number;
  conversionRate: number;
  daysUntil: number;
  lastUpdated: string;
}

interface EventsData {
  events: EventData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: {
    totalEvents: number;
    totalRevenue: number;
    totalAttendees: number;
    avgRating: number;
  };
  filters: {
    status: string;
    search: string;
    sortBy: string;
    sortOrder: string;
  };
}

interface AnalyticsData {
  metrics: {
    totalRevenue: number;
    totalTicketsSold: number;
    totalViews: number;
    totalLikes: number;
    conversionRate: number;
    revenueGrowth: number;
    averageTicketPrice: number;
    eventsCount: number;
  };
  trendingMetrics: Array<{
    label: string;
    value: string;
    change: string;
    trend: string;
  }>;
  chartData: Array<{
    date: string;
    revenue: number;
    ticketsSold: number;
  }>;
  eventAnalytics: Array<{
    id: string;
    title: string;
    date: string;
    status: string;
    revenue: number;
    ticketsSold: number;
    totalTickets: number;
    views: number;
    likes: number;
    shares: number;
    conversionRate: number;
    performance: any;
  }>;
  topEvents: Array<{
    id: string;
    title: string;
    revenue: number;
    ticketsSold: number;
    views: number;
    conversionRate: number;
  }>;
  period: string;
  dateRange: {
    start: string;
    end: string;
  };
}

interface AttendeeData {
  attendees: Array<{
    id: string;
    status: string;
    joinedAt: string;
    event: {
      id: string;
      title: string;
      date: string;
    };
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      image: string;
      verified: boolean;
      eventsAttended: number;
      connectionStatus: string;
    };
    ticket: any;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: {
    totalAttendees: number;
    goingCount: number;
    interestedCount: number;
    attendedCount: number;
  };
  demographics: {
    topInterests: Array<{ interest: string; count: number }>;
    totalUsers: number;
  };
  filters: {
    eventId: string | null;
    status: string;
    search: string;
  };
}

interface PaymentsData {
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    currency: string;
    payment_method: string;
    status: string;
    created_at: string;
    event: { title: string };
    user: { name: string; email: string };
  }>;
  payouts: Array<{
    id: string;
    amount: number;
    currency: string;
    fees: number;
    net_amount: number;
    payout_method: string;
    status: string;
    created_at: string;
  }>;
  paymentSummary: {
    totalRevenue: number;
    netRevenue: number;
    platformFee: number;
    totalTransactions: number;
    pendingAmount: number;
    totalPayouts: number;
    pendingPayouts: number;
    availableBalance: number;
    averageTransactionValue: number;
  };
  chartData: Array<{
    date: string;
    revenue: number;
    displayDate: string;
  }>;
  topEvents: Array<{
    eventId: string;
    title: string;
    amount: number;
    transactions: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    amount: number;
    percentage: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    status: string;
    period: string;
  };
}

interface SettingsData {
  profile: {
    id: string;
    name: string;
    email: string;
    username: string;
    bio: string;
    image: string;
    verified: boolean;
    twitter: string;
    instagram: string;
    website: string;
    followers_count: number;
    following_count: number;
  };
  settings: {
    business_name: string;
    business_type: string;
    tax_id: string;
    business_address: any;
    payout_preferences: any;
    notification_preferences: any;
    branding_settings: any;
    api_settings: any;
  };
  preferences: any;
  paymentMethods: any[];
}

interface UseOrganiserDashboardReturn {
  // Data states
  dashboardData: DashboardData | null;
  eventsData: EventsData | null;
  analyticsData: AnalyticsData | null;
  attendeesData: AttendeeData | null;
  paymentsData: PaymentsData | null;
  settingsData: SettingsData | null;
  
  // Loading states
  loading: boolean;
  eventsLoading: boolean;
  analyticsLoading: boolean;
  attendeesLoading: boolean;
  paymentsLoading: boolean;
  settingsLoading: boolean;
  
  // Error states
  error: string | null;
  eventsError: string | null;
  analyticsError: string | null;
  attendeesError: string | null;
  paymentsError: string | null;
  settingsError: string | null;
  
  // Dashboard methods
  refreshDashboard: () => Promise<void>;
  
  // Events methods
  getEvents: (options?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => Promise<void>;
  createEvent: (eventData: any) => Promise<boolean>;
  
  // Analytics methods
  getAnalytics: (options?: {
    period?: string;
    eventId?: string;
  }) => Promise<void>;
  
  // Attendees methods
  getAttendees: (options?: {
    page?: number;
    limit?: number;
    eventId?: string;
    search?: string;
    status?: string;
  }) => Promise<void>;
  
  // Payments methods
  getPayments: (options?: {
    page?: number;
    limit?: number;
    status?: string;
    period?: string;
  }) => Promise<void>;
  requestPayout: (payoutData: {
    amount: number;
    payoutMethod: string;
    payoutDetails?: any;
  }) => Promise<boolean>;
  
  // Settings methods
  getSettings: () => Promise<void>;
  updateSettings: (section: string, data: any) => Promise<boolean>;
}

export const useOrganiserDashboard = (): UseOrganiserDashboardReturn => {
  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [eventsData, setEventsData] = useState<EventsData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [attendeesData, setAttendeesData] = useState<AttendeeData | null>(null);
  const [paymentsData, setPaymentsData] = useState<PaymentsData | null>(null);
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [attendeesError, setAttendeesError] = useState<string | null>(null);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Dashboard methods
  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/organiser/dashboard');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Events methods
  const getEvents = useCallback(async (options: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}) => {
    setEventsLoading(true);
    setEventsError(null);
    
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.status) params.append('status', options.status);
      if (options.search) params.append('search', options.search);
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);
      
      const response = await fetch(`/api/organiser/events?${params.toString()}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch events');
      }
      
      if (result.success) {
        setEventsData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch events');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setEventsError(errorMessage);
      console.error('Events fetch error:', err);
    } finally {
      setEventsLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/organiser/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create event');
      }
      
      if (result.success) {
        // Refresh events data
        await getEvents();
        return true;
      } else {
        throw new Error(result.error || 'Failed to create event');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setEventsError(errorMessage);
      console.error('Event creation error:', err);
      return false;
    }
  }, [getEvents]);

  // Analytics methods
  const getAnalytics = useCallback(async (options: {
    period?: string;
    eventId?: string;
  } = {}) => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    
    try {
      const params = new URLSearchParams();
      if (options.period) params.append('period', options.period);
      if (options.eventId) params.append('eventId', options.eventId);
      
      const response = await fetch(`/api/organiser/analytics?${params.toString()}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch analytics');
      }
      
      if (result.success) {
        setAnalyticsData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch analytics');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setAnalyticsError(errorMessage);
      console.error('Analytics fetch error:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Attendees methods
  const getAttendees = useCallback(async (options: {
    page?: number;
    limit?: number;
    eventId?: string;
    search?: string;
    status?: string;
  } = {}) => {
    setAttendeesLoading(true);
    setAttendeesError(null);
    
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.eventId) params.append('eventId', options.eventId);
      if (options.search) params.append('search', options.search);
      if (options.status) params.append('status', options.status);
      
      const response = await fetch(`/api/organiser/attendees?${params.toString()}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch attendees');
      }
      
      if (result.success) {
        setAttendeesData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch attendees');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setAttendeesError(errorMessage);
      console.error('Attendees fetch error:', err);
    } finally {
      setAttendeesLoading(false);
    }
  }, []);

  // Payments methods
  const getPayments = useCallback(async (options: {
    page?: number;
    limit?: number;
    status?: string;
    period?: string;
  } = {}) => {
    setPaymentsLoading(true);
    setPaymentsError(null);
    
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.status) params.append('status', options.status);
      if (options.period) params.append('period', options.period);
      
      const response = await fetch(`/api/organiser/payments?${params.toString()}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch payments');
      }
      
      if (result.success) {
        setPaymentsData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch payments');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setPaymentsError(errorMessage);
      console.error('Payments fetch error:', err);
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

  const requestPayout = useCallback(async (payoutData: {
    amount: number;
    payoutMethod: string;
    payoutDetails?: any;
  }): Promise<boolean> => {
    try {
      const response = await fetch('/api/organiser/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'request_payout',
          ...payoutData,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to request payout');
      }
      
      if (result.success) {
        // Refresh payments data
        await getPayments();
        return true;
      } else {
        throw new Error(result.error || 'Failed to request payout');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setPaymentsError(errorMessage);
      console.error('Payout request error:', err);
      return false;
    }
  }, [getPayments]);

  // Settings methods
  const getSettings = useCallback(async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    
    try {
      const response = await fetch('/api/organiser/settings');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch settings');
      }
      
      if (result.success) {
        setSettingsData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch settings');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setSettingsError(errorMessage);
      console.error('Settings fetch error:', err);
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (section: string, data: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/organiser/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, data }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update settings');
      }
      
      if (result.success) {
        // Refresh settings data
        await getSettings();
        return true;
      } else {
        throw new Error(result.error || 'Failed to update settings');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setSettingsError(errorMessage);
      console.error('Settings update error:', err);
      return false;
    }
  }, [getSettings]);

  // Load dashboard data on mount
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  return {
    // Data states
    dashboardData,
    eventsData,
    analyticsData,
    attendeesData,
    paymentsData,
    settingsData,
    
    // Loading states
    loading,
    eventsLoading,
    analyticsLoading,
    attendeesLoading,
    paymentsLoading,
    settingsLoading,
    
    // Error states
    error,
    eventsError,
    analyticsError,
    attendeesError,
    paymentsError,
    settingsError,
    
    // Methods
    refreshDashboard,
    getEvents,
    createEvent,
    getAnalytics,
    getAttendees,
    getPayments,
    requestPayout,
    getSettings,
    updateSettings,
  };
};
