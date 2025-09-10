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
        const { searchParams } = new URL(request.url);
        
        // Query parameters
        const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y
        const eventId = searchParams.get('eventId');
        
        // Check if user is an organiser
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('is_organiser')
            .eq('id', userId)
            .single();

        if (userError || !user?.is_organiser) {
            return NextResponse.json({ error: 'Access denied. Organiser account required.' }, { status: 403 });
        }

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        
        switch (period) {
            case '7d':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(endDate.getDate() - 90);
                break;
            case '1y':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(endDate.getDate() - 30);
        }

        // Get events for this organiser
        let eventsQuery = supabase
            .from('events')
            .select('id, title, date, status, sold_tickets, total_tickets, views, likes, shares')
            .eq('organiser_id', userId);

        if (eventId) {
            eventsQuery = eventsQuery.eq('id', eventId);
        }

        const { data: events, error: eventsError } = await eventsQuery;

        if (eventsError) {
            console.error('Events query error:', eventsError);
            return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
        }

        const eventIds = (events || []).map(e => e.id);

        // Get analytics data in parallel
        const [
            revenueResult,
            ticketSalesResult,
            viewsResult,
            engagementResult,
            performanceResult
        ] = await Promise.all([
            // Revenue analytics
            supabase
                .from('transactions')
                .select('amount, currency, created_at, event_id')
                .in('event_id', eventIds)
                .eq('type', 'purchase')
                .eq('status', 'completed')
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString())
                .order('created_at', { ascending: true }),

            // Ticket sales analytics
            supabase
                .from('tickets')
                .select('created_at, event_id, price, currency')
                .in('event_id', eventIds)
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString())
                .order('created_at', { ascending: true }),

            // Views analytics (from analytics_events table)
            supabase
                .from('analytics_events')
                .select('created_at, event_data')
                .eq('event_type', 'event_view')
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString()),

            // Engagement analytics (likes, shares, saves)
            supabase
                .from('event_likes')
                .select('created_at, event_id')
                .in('event_id', eventIds)
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString()),

            // Event performance data
            supabase
                .from('event_performance')
                .select('*')
                .in('event_id', eventIds)
        ]);

        // Process revenue data
        const revenueData = revenueResult.data || [];
        const totalRevenue = revenueData.reduce((sum, t) => sum + Number(t.amount || 0), 0);
        
        // Group revenue by date for chart
        const revenueByDate = revenueData.reduce((acc, transaction) => {
            const date = new Date(transaction.created_at).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + Number(transaction.amount || 0);
            return acc;
        }, {} as Record<string, number>);

        // Process ticket sales
        const ticketSales = ticketSalesResult.data || [];
        const totalTicketsSold = ticketSales.length;
        
        // Group ticket sales by date
        const ticketSalesByDate = ticketSales.reduce((acc, ticket) => {
            const date = new Date(ticket.created_at).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Process views data
        const viewsData = viewsResult.data || [];
        const totalViews = viewsData.length;

        // Process engagement
        const likesData = engagementResult.data || [];
        const totalLikes = likesData.length;

        // Calculate conversion metrics
        const conversionRate = totalViews > 0 ? (totalTicketsSold / totalViews) * 100 : 0;

        // Event-specific analytics
        const eventAnalytics = (events || []).map(event => {
            const eventRevenue = revenueData
                .filter(t => t.event_id === event.id)
                .reduce((sum, t) => sum + Number(t.amount || 0), 0);
            
            const eventTicketsSold = ticketSales.filter(t => t.event_id === event.id).length;
            const eventLikes = likesData.filter(l => l.event_id === event.id).length;
            
            const performance = performanceResult.data?.find(p => p.event_id === event.id);
            
            return {
                id: event.id,
                title: event.title,
                date: event.date,
                status: event.status,
                revenue: eventRevenue,
                ticketsSold: eventTicketsSold,
                totalTickets: event.total_tickets || 0,
                views: event.views || 0,
                likes: eventLikes,
                shares: event.shares || 0,
                conversionRate: event.views > 0 ? (eventTicketsSold / event.views) * 100 : 0,
                performance: performance || null
            };
        });

        // Top performing events
        const topEvents = eventAnalytics
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Generate date range for charts
        const dateRange = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            dateRange.push({
                date: dateStr,
                revenue: revenueByDate[dateStr] || 0,
                ticketsSold: ticketSalesByDate[dateStr] || 0
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Calculate growth metrics
        const midPoint = Math.floor(dateRange.length / 2);
        const firstHalfRevenue = dateRange.slice(0, midPoint).reduce((sum, d) => sum + d.revenue, 0);
        const secondHalfRevenue = dateRange.slice(midPoint).reduce((sum, d) => sum + d.revenue, 0);
        const revenueGrowth = firstHalfRevenue > 0 ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100 : 0;

        // Key metrics
        const metrics = {
            totalRevenue,
            totalTicketsSold,
            totalViews,
            totalLikes,
            conversionRate: Number(conversionRate.toFixed(2)),
            revenueGrowth: Number(revenueGrowth.toFixed(1)),
            averageTicketPrice: totalTicketsSold > 0 ? totalRevenue / totalTicketsSold : 0,
            eventsCount: events?.length || 0
        };

        // Trending metrics for comparison
        const trendingMetrics = [
            {
                label: 'Event Views',
                value: `${(totalViews / 1000).toFixed(1)}K`,
                change: '+12.5%', // TODO: Calculate actual change
                trend: 'up'
            },
            {
                label: 'Conversion Rate',
                value: `${conversionRate.toFixed(1)}%`,
                change: '+2.1%',
                trend: 'up'
            },
            {
                label: 'Avg Ticket Price',
                value: `$${(totalRevenue / Math.max(totalTicketsSold, 1)).toFixed(0)}`,
                change: '+$23',
                trend: 'up'
            },
            {
                label: 'Customer Retention',
                value: '92%', // TODO: Calculate actual retention
                change: '+5%',
                trend: 'up'
            }
        ];

        return NextResponse.json({
            success: true,
            data: {
                metrics,
                trendingMetrics,
                chartData: dateRange,
                eventAnalytics,
                topEvents,
                period,
                dateRange: {
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                }
            }
        });

    } catch (error) {
        console.error('Analytics API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics data' },
            { status: 500 }
        );
    }
}
