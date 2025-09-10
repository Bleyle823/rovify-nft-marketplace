import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { getSession } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createClient();
        const userId = session.user.id;

        // Check if user is an organiser
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('is_organiser')
            .eq('id', userId)
            .single();

        if (userError || !user?.is_organiser) {
            return NextResponse.json({ error: 'Access denied. Organiser account required.' }, { status: 403 });
        }

        // Get dashboard stats in parallel
        const [
            eventsResult,
            metricsResult,
            recentActivityResult,
            upcomingEventsResult,
            revenueResult
        ] = await Promise.all([
            // Total events stats
            supabase
                .from('events')
                .select('id, status, sold_tickets, total_tickets, created_at')
                .eq('organiser_id', userId),

            // Get recent metrics
            supabase
                .from('organiser_metrics')
                .select('*')
                .eq('organiser_id', userId)
                .order('created_at', { ascending: false })
                .limit(10),

            // Recent activity from transactions and event updates
            supabase
                .from('transactions')
                .select(`
                    id, type, amount, currency, created_at, status,
                    event:events(title)
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(5),

            // Upcoming events
            supabase
                .from('events')
                .select(`
                    id, title, date, image, location, price, 
                    sold_tickets, total_tickets, status, views, likes
                `)
                .eq('organiser_id', userId)
                .gte('date', new Date().toISOString())
                .order('date', { ascending: true })
                .limit(5),

            // Revenue data for the last 30 days
            supabase
                .from('transactions')
                .select('amount, currency, created_at')
                .eq('user_id', userId)
                .eq('type', 'purchase')
                .eq('status', 'completed')
                .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        ]);

        // Calculate dashboard metrics
        const events = eventsResult.data || [];
        const totalEvents = events.length;
        const publishedEvents = events.filter(e => e.status === 'published').length;
        const draftEvents = events.filter(e => e.status === 'draft').length;
        const completedEvents = events.filter(e => e.status === 'completed').length;

        // Calculate total attendees and revenue
        const totalAttendees = events.reduce((sum, event) => sum + (event.sold_tickets || 0), 0);
        const totalTickets = events.reduce((sum, event) => sum + (event.total_tickets || 0), 0);

        // Calculate revenue from transactions
        const revenueData = revenueResult.data || [];
        const monthlyRevenue = revenueData.reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

        // Calculate growth metrics (comparing with previous period)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

        const { data: previousPeriodRevenue } = await supabase
            .from('transactions')
            .select('amount')
            .eq('user_id', userId)
            .eq('type', 'purchase')
            .eq('status', 'completed')
            .gte('created_at', sixtyDaysAgo.toISOString())
            .lt('created_at', thirtyDaysAgo.toISOString());

        const previousRevenue = (previousPeriodRevenue || []).reduce((sum, t) => sum + Number(t.amount || 0), 0);
        const revenueGrowth = previousRevenue > 0 ? ((monthlyRevenue - previousRevenue) / previousRevenue) * 100 : 0;

        // Calculate average rating
        const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .in('event_id', events.map(e => e.id));

        const avgRating = reviews && reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
            : 0;

        // Format recent activity
        const recentActivity = (recentActivityResult.data || []).map(transaction => ({
            id: transaction.id,
            type: transaction.type,
            amount: transaction.amount,
            currency: transaction.currency,
            event: transaction.event?.title || 'Unknown Event',
            time: transaction.created_at,
            status: transaction.status
        }));

        // Format upcoming events
        const upcomingEvents = (upcomingEventsResult.data || []).map(event => ({
            id: event.id,
            title: event.title,
            date: event.date,
            image: event.image,
            location: typeof event.location === 'object' ? event.location : JSON.parse(event.location || '{}'),
            price: typeof event.price === 'object' ? event.price : JSON.parse(event.price || '{}'),
            attendees: event.sold_tickets || 0,
            capacity: event.total_tickets || 0,
            status: event.status,
            views: event.views || 0,
            likes: event.likes || 0
        }));

        // Quick stats for the dashboard
        const quickStats = [
            {
                id: 'revenue',
                title: 'Monthly Revenue',
                value: `$${monthlyRevenue.toLocaleString()}`,
                change: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`,
                trend: revenueGrowth >= 0 ? 'up' : 'down',
                icon: 'dollar-sign',
                color: 'emerald'
            },
            {
                id: 'events',
                title: 'Active Events',
                value: publishedEvents.toString(),
                change: `+${events.filter(e => new Date(e.created_at) > thirtyDaysAgo).length}`,
                trend: 'up',
                icon: 'calendar',
                color: 'blue'
            },
            {
                id: 'attendees',
                title: 'Total Attendees',
                value: totalAttendees.toLocaleString(),
                change: `${Math.round((totalAttendees / Math.max(totalTickets, 1)) * 100)}% capacity`,
                trend: 'up',
                icon: 'users',
                color: 'purple'
            },
            {
                id: 'rating',
                title: 'Avg Rating',
                value: avgRating.toFixed(1),
                change: reviews?.length ? `${reviews.length} reviews` : 'No reviews yet',
                trend: avgRating >= 4 ? 'up' : 'neutral',
                icon: 'star',
                color: 'amber'
            }
        ];

        // Organiser profile info
        const organiserInfo = {
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Organiser',
            level: totalEvents >= 20 ? 'Pro' : totalEvents >= 10 ? 'Advanced' : 'Starter',
            levelProgress: Math.min((totalEvents / 20) * 100, 100),
            points: totalAttendees * 10 + publishedEvents * 50 + completedEvents * 100,
            streakDays: Math.floor(Math.random() * 30) + 1, // TODO: Calculate actual streak
            eventsCreated: totalEvents,
            totalAttendees,
            totalRevenue: monthlyRevenue,
            monthlyGrowth: revenueGrowth,
            rating: avgRating,
            completedEvents
        };

        return NextResponse.json({
            success: true,
            data: {
                organiserInfo,
                quickStats,
                recentActivity,
                upcomingEvents,
                summary: {
                    totalEvents,
                    publishedEvents,
                    draftEvents,
                    completedEvents,
                    totalAttendees,
                    monthlyRevenue,
                    avgRating,
                    revenueGrowth
                }
            }
        });

    } catch (error) {
        console.error('Dashboard API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}
