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
        const status = searchParams.get('status') || 'all';
        const period = searchParams.get('period') || '30d';
        
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

        // Get organiser's events for filtering
        const { data: events } = await supabase
            .from('events')
            .select('id, title')
            .eq('organiser_id', userId);

        const eventIds = (events || []).map(e => e.id);

        // Get transactions for organiser's events
        let transactionsQuery = supabase
            .from('transactions')
            .select(`
                id, type, amount, currency, payment_method, payment_id,
                status, metadata, created_at, completed_at,
                event:events(id, title, date),
                user:users(id, name, email, username)
            `)
            .in('event_id', eventIds)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());

        if (status !== 'all') {
            transactionsQuery = transactionsQuery.eq('status', status);
        }

        // Get total count for pagination
        const { count } = await supabase
            .from('transactions')
            .select('id', { count: 'exact', head: true })
            .in('event_id', eventIds)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .eq(status !== 'all' ? 'status' : 'type', status !== 'all' ? status : 'purchase');

        // Get paginated results
        const { data: transactions, error: transactionsError } = await transactionsQuery
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (transactionsError) {
            console.error('Transactions query error:', transactionsError);
            return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
        }

        // Get payment payouts
        let payoutsQuery = supabase
            .from('payment_payouts')
            .select('*')
            .eq('organiser_id', userId)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());

        const { data: payouts } = await payoutsQuery
            .order('created_at', { ascending: false });

        // Calculate payment statistics
        const completedTransactions = (transactions || []).filter(t => t.status === 'completed');
        const totalRevenue = completedTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
        const totalTransactions = transactions?.length || 0;
        const pendingAmount = (transactions || [])
            .filter(t => t.status === 'pending')
            .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        // Calculate fees (assuming 3% platform fee)
        const platformFee = totalRevenue * 0.03;
        const netRevenue = totalRevenue - platformFee;

        // Payment method breakdown
        const paymentMethods: Record<string, { count: number; amount: number }> = {};
        completedTransactions.forEach(transaction => {
            const method = transaction.payment_method || 'unknown';
            if (!paymentMethods[method]) {
                paymentMethods[method] = { count: 0, amount: 0 };
            }
            paymentMethods[method].count += 1;
            paymentMethods[method].amount += Number(transaction.amount || 0);
        });

        // Revenue by event
        const revenueByEvent: Record<string, { title: string; amount: number; transactions: number }> = {};
        completedTransactions.forEach(transaction => {
            const eventId = transaction.event?.id;
            const eventTitle = transaction.event?.title || 'Unknown Event';
            if (eventId) {
                if (!revenueByEvent[eventId]) {
                    revenueByEvent[eventId] = { title: eventTitle, amount: 0, transactions: 0 };
                }
                revenueByEvent[eventId].amount += Number(transaction.amount || 0);
                revenueByEvent[eventId].transactions += 1;
            }
        });

        // Top performing events by revenue
        const topEvents = Object.entries(revenueByEvent)
            .sort(([,a], [,b]) => b.amount - a.amount)
            .slice(0, 5)
            .map(([eventId, data]) => ({ eventId, ...data }));

        // Daily revenue chart data
        const revenueByDate: Record<string, number> = {};
        completedTransactions.forEach(transaction => {
            const date = new Date(transaction.created_at).toISOString().split('T')[0];
            revenueByDate[date] = (revenueByDate[date] || 0) + Number(transaction.amount || 0);
        });

        const chartData = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            chartData.push({
                date: dateStr,
                revenue: revenueByDate[dateStr] || 0,
                displayDate: currentDate.toLocaleDateString()
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Calculate payout statistics
        const totalPayouts = (payouts || []).reduce((sum, p) => sum + Number(p.net_amount || 0), 0);
        const pendingPayouts = (payouts || [])
            .filter(p => p.status === 'pending')
            .reduce((sum, p) => sum + Number(p.net_amount || 0), 0);
        const availableBalance = netRevenue - totalPayouts;

        // Payment summary
        const paymentSummary = {
            totalRevenue,
            netRevenue,
            platformFee,
            totalTransactions,
            pendingAmount,
            totalPayouts,
            pendingPayouts,
            availableBalance,
            averageTransactionValue: totalTransactions > 0 ? totalRevenue / totalTransactions : 0
        };

        return NextResponse.json({
            success: true,
            data: {
                transactions: transactions || [],
                payouts: payouts || [],
                paymentSummary,
                chartData,
                topEvents,
                paymentMethods: Object.entries(paymentMethods).map(([method, data]) => ({
                    method,
                    ...data,
                    percentage: totalRevenue > 0 ? (data.amount / totalRevenue) * 100 : 0
                })),
                pagination: {
                    page,
                    limit,
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / limit),
                    hasNext: offset + limit < (count || 0),
                    hasPrev: page > 1
                },
                filters: {
                    status,
                    period
                }
            }
        });

    } catch (error) {
        console.error('Payments API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payments data' },
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
        const { action, ...data } = await request.json();

        // Check if user is an organiser
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('is_organiser')
            .eq('id', userId)
            .single();

        if (userError || !user?.is_organiser) {
            return NextResponse.json({ error: 'Access denied. Organiser account required.' }, { status: 403 });
        }

        switch (action) {
            case 'request_payout':
                // Request a payout
                const { amount, payoutMethod, payoutDetails } = data;

                if (!amount || !payoutMethod) {
                    return NextResponse.json(
                        { error: 'Amount and payout method are required' },
                        { status: 400 }
                    );
                }

                // Calculate fees (assuming 2% payout fee)
                const fees = amount * 0.02;
                const netAmount = amount - fees;

                const { data: payout, error: payoutError } = await supabase
                    .from('payment_payouts')
                    .insert({
                        organiser_id: userId,
                        amount,
                        fees,
                        net_amount: netAmount,
                        payout_method: payoutMethod,
                        payout_details: payoutDetails || {},
                        status: 'pending'
                    })
                    .select()
                    .single();

                if (payoutError) {
                    console.error('Payout creation error:', payoutError);
                    return NextResponse.json({ error: 'Failed to create payout request' }, { status: 500 });
                }

                // Log activity
                await supabase
                    .from('user_activity')
                    .insert({
                        user_id: userId,
                        activity_type: 'payout_requested',
                        reference_type: 'payout',
                        reference_id: payout.id,
                        metadata: {
                            amount,
                            payout_method: payoutMethod
                        }
                    });

                return NextResponse.json({
                    success: true,
                    data: { payout },
                    message: 'Payout request created successfully'
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error('Payments POST API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process payment request' },
            { status: 500 }
        );
    }
}
