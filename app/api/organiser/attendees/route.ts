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
        const limit = parseInt(searchParams.get('limit') || '20');
        const eventId = searchParams.get('eventId');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || 'all'; // all, going, interested, attended
        
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

        // Get organiser's events
        let eventsQuery = supabase
            .from('events')
            .select('id, title, date, status')
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

        if (eventIds.length === 0) {
            return NextResponse.json({
                success: true,
                data: {
                    attendees: [],
                    pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
                    summary: { totalAttendees: 0, goingCount: 0, interestedCount: 0, attendedCount: 0 }
                }
            });
        }

        // Build attendees query
        let attendeesQuery = supabase
            .from('event_attendees')
            .select(`
                id, status, created_at,
                event:events(id, title, date),
                user:users(id, name, username, email, image, verified)
            `)
            .in('event_id', eventIds);

        // Apply status filter
        if (status !== 'all') {
            attendeesQuery = attendeesQuery.eq('status', status);
        }

        // Get total count for pagination
        const { count } = await supabase
            .from('event_attendees')
            .select('id', { count: 'exact', head: true })
            .in('event_id', eventIds)
            .eq(status !== 'all' ? 'status' : 'event_id', status !== 'all' ? status : eventIds[0]);

        // Get paginated results
        const { data: attendeesData, error: attendeesError } = await attendeesQuery
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (attendeesError) {
            console.error('Attendees query error:', attendeesError);
            return NextResponse.json({ error: 'Failed to fetch attendees' }, { status: 500 });
        }

        // Filter by search if provided
        let filteredAttendees = attendeesData || [];
        if (search) {
            filteredAttendees = filteredAttendees.filter(attendee => 
                attendee.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                attendee.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
                attendee.user?.email?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Get additional data for each attendee
        const attendeesWithDetails = await Promise.all(
            filteredAttendees.map(async (attendee) => {
                // Get ticket information
                const { data: ticket } = await supabase
                    .from('tickets')
                    .select('id, type, tier_name, price, currency, status, created_at')
                    .eq('event_id', attendee.event?.id)
                    .eq('owner_id', attendee.user?.id)
                    .single();

                // Get user's total events attended
                const { count: eventsAttended } = await supabase
                    .from('event_attendees')
                    .select('id', { count: 'exact', head: true })
                    .eq('user_id', attendee.user?.id)
                    .eq('status', 'attended');

                // Get user's connection status with organiser
                const { data: connection } = await supabase
                    .from('user_connections')
                    .select('status')
                    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
                    .or(`requester_id.eq.${attendee.user?.id},addressee_id.eq.${attendee.user?.id}`)
                    .single();

                return {
                    id: attendee.id,
                    status: attendee.status,
                    joinedAt: attendee.created_at,
                    event: attendee.event,
                    user: {
                        ...attendee.user,
                        eventsAttended: eventsAttended || 0,
                        connectionStatus: connection?.status || 'none'
                    },
                    ticket: ticket || null
                };
            })
        );

        // Calculate summary statistics
        const allAttendees = await supabase
            .from('event_attendees')
            .select('status')
            .in('event_id', eventIds);

        const summary = {
            totalAttendees: allAttendees.data?.length || 0,
            goingCount: allAttendees.data?.filter(a => a.status === 'going').length || 0,
            interestedCount: allAttendees.data?.filter(a => a.status === 'interested').length || 0,
            attendedCount: allAttendees.data?.filter(a => a.status === 'attended').length || 0
        };

        // Get attendee demographics
        const { data: demographics } = await supabase
            .from('event_attendees')
            .select(`
                user:users(interests, created_at)
            `)
            .in('event_id', eventIds);

        // Process demographics
        const interestCounts: Record<string, number> = {};
        const signupDates: string[] = [];

        (demographics || []).forEach(d => {
            if (d.user?.interests) {
                d.user.interests.forEach((interest: string) => {
                    interestCounts[interest] = (interestCounts[interest] || 0) + 1;
                });
            }
            if (d.user?.created_at) {
                signupDates.push(d.user.created_at);
            }
        });

        const topInterests = Object.entries(interestCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([interest, count]) => ({ interest, count }));

        return NextResponse.json({
            success: true,
            data: {
                attendees: attendeesWithDetails,
                pagination: {
                    page,
                    limit,
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / limit),
                    hasNext: offset + limit < (count || 0),
                    hasPrev: page > 1
                },
                summary,
                demographics: {
                    topInterests,
                    totalUsers: demographics?.length || 0
                },
                filters: {
                    eventId,
                    status,
                    search
                }
            }
        });

    } catch (error) {
        console.error('Attendees API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch attendees data' },
            { status: 500 }
        );
    }
}
