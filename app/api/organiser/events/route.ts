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
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status') || 'all';
        const search = searchParams.get('search') || '';
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        
        const offset = (page - 1) * limit;

        // Check if user is an organiser
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('is_organiser')
            .eq('id', userId)
            .single();

        if (userError || !user?.is_organiser) {
            return NextResponse.json({ error: 'Access denied. Organiser account required.' }, { status: 403 });
        }

        // Build query
        let query = supabase
            .from('events')
            .select(`
                id, title, description, image, date, end_date, location, 
                category, subcategory, tags, price, venue_capacity,
                total_tickets, sold_tickets, status, is_featured,
                likes, views, shares, created_at, updated_at, published_at
            `)
            .eq('organiser_id', userId);

        // Apply filters
        if (status !== 'all') {
            query = query.eq('status', status);
        }

        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
        }

        // Apply sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Get total count for pagination
        const { count } = await supabase
            .from('events')
            .select('id', { count: 'exact', head: true })
            .eq('organiser_id', userId)
            .eq(status !== 'all' ? 'status' : 'id', status !== 'all' ? status : userId);

        // Get paginated results
        const { data: events, error } = await query
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Events query error:', error);
            return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
        }

        // Get additional data for each event
        const eventsWithMetrics = await Promise.all(
            (events || []).map(async (event) => {
                // Get event performance metrics
                const { data: performance } = await supabase
                    .from('event_performance')
                    .select('*')
                    .eq('event_id', event.id)
                    .single();

                // Get recent reviews for rating
                const { data: reviews } = await supabase
                    .from('reviews')
                    .select('rating')
                    .eq('event_id', event.id);

                // Calculate metrics
                const avgRating = reviews && reviews.length > 0 
                    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
                    : 0;

                const conversionRate = performance?.conversion_rate || 
                    (event.views > 0 ? ((event.sold_tickets || 0) / event.views) * 100 : 0);

                // Calculate revenue
                const { data: eventRevenue } = await supabase
                    .from('transactions')
                    .select('amount')
                    .eq('event_id', event.id)
                    .eq('type', 'purchase')
                    .eq('status', 'completed');

                const revenue = (eventRevenue || []).reduce((sum, t) => sum + Number(t.amount || 0), 0);

                return {
                    ...event,
                    location: typeof event.location === 'object' ? event.location : JSON.parse(event.location || '{}'),
                    price: typeof event.price === 'object' ? event.price : JSON.parse(event.price || '{}'),
                    attendees: event.sold_tickets || 0,
                    capacity: event.total_tickets || event.venue_capacity || 0,
                    revenue,
                    rating: avgRating,
                    conversionRate: Number(conversionRate.toFixed(1)),
                    daysUntil: Math.ceil((new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                    lastUpdated: event.updated_at
                };
            })
        );

        // Calculate summary stats
        const totalRevenue = eventsWithMetrics.reduce((sum, event) => sum + event.revenue, 0);
        const totalAttendees = eventsWithMetrics.reduce((sum, event) => sum + event.attendees, 0);
        const avgRating = eventsWithMetrics.length > 0 
            ? eventsWithMetrics.reduce((sum, event) => sum + event.rating, 0) / eventsWithMetrics.length 
            : 0;

        return NextResponse.json({
            success: true,
            data: {
                events: eventsWithMetrics,
                pagination: {
                    page,
                    limit,
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / limit),
                    hasNext: offset + limit < (count || 0),
                    hasPrev: page > 1
                },
                summary: {
                    totalEvents: eventsWithMetrics.length,
                    totalRevenue,
                    totalAttendees,
                    avgRating: Number(avgRating.toFixed(1))
                },
                filters: {
                    status,
                    search,
                    sortBy,
                    sortOrder
                }
            }
        });

    } catch (error) {
        console.error('Events API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createClient();
        const userId = session.user.id;
        const eventData = await request.json();

        // Check if user is an organiser
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('is_organiser')
            .eq('id', userId)
            .single();

        if (userError || !user?.is_organiser) {
            return NextResponse.json({ error: 'Access denied. Organiser account required.' }, { status: 403 });
        }

        // Validate required fields
        if (!eventData.title || !eventData.date || !eventData.location) {
            return NextResponse.json(
                { error: 'Missing required fields: title, date, and location are required' },
                { status: 400 }
            );
        }

        // Create event
        const { data: event, error } = await supabase
            .from('events')
            .insert({
                ...eventData,
                organiser_id: userId,
                status: eventData.status || 'draft',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Event creation error:', error);
            return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
        }

        // Create initial event performance record
        await supabase
            .from('event_performance')
            .insert({
                event_id: event.id,
                total_views: 0,
                unique_views: 0,
                conversion_rate: 0,
                total_revenue: 0,
                tickets_sold: 0,
                refund_rate: 0,
                avg_rating: 0,
                total_reviews: 0,
                social_shares: 0
            });

        // Log activity
        await supabase
            .from('user_activity')
            .insert({
                user_id: userId,
                activity_type: 'event_created',
                reference_type: 'event',
                reference_id: event.id,
                metadata: {
                    event_title: event.title,
                    event_status: event.status
                }
            });

        return NextResponse.json({
            success: true,
            data: { event },
            message: 'Event created successfully'
        });

    } catch (error) {
        console.error('Event creation API Error:', error);
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        );
    }
}
