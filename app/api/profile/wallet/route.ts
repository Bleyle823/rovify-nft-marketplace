import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')

    let query = supabaseAdmin
      .from('user_wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) {
      query = query.eq('transaction_type', type)
    }

    const { data: transactions, error } = await query

    if (error) {
      console.error('Error fetching wallet transactions:', error)
      return NextResponse.json(
        { message: 'Failed to fetch wallet transactions' },
        { status: 500 }
      )
    }

    // Get wallet summary stats
    const { data: summaryData, error: summaryError } = await supabaseAdmin
      .from('user_wallet_transactions')
      .select('transaction_type, amount, usd_value, currency, status')
      .eq('user_id', userId)
      .eq('status', 'completed')

    let walletStats = {
      totalBalance: 0,
      totalSpent: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      transactionCount: 0
    }

    if (!summaryError && summaryData) {
      walletStats = summaryData.reduce((stats, tx) => {
        const usdValue = parseFloat(tx.usd_value) || 0
        
        stats.transactionCount++
        
        switch (tx.transaction_type) {
          case 'deposit':
            stats.totalDeposits += usdValue
            stats.totalBalance += usdValue
            break
          case 'withdrawal':
            stats.totalWithdrawals += usdValue
            stats.totalBalance -= usdValue
            break
          case 'event_purchase':
            stats.totalSpent += usdValue
            stats.totalBalance -= usdValue
            break
        }
        
        return stats
      }, walletStats)
    }

    return NextResponse.json({ 
      transactions,
      walletStats,
      pagination: {
        limit,
        offset,
        hasMore: transactions.length === limit
      }
    })

  } catch (error) {
    console.error('Get wallet transactions error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const {
      transaction_type,
      amount,
      currency,
      usd_value,
      from_address,
      to_address,
      transaction_hash,
      event_id,
      metadata
    } = await request.json()

    if (!transaction_type || !amount || !currency) {
      return NextResponse.json(
        { message: 'Transaction type, amount, and currency are required' },
        { status: 400 }
      )
    }

    const { data: transaction, error } = await supabaseAdmin
      .from('user_wallet_transactions')
      .insert({
        user_id: userId,
        transaction_type,
        amount,
        currency,
        usd_value,
        from_address,
        to_address,
        transaction_hash,
        event_id,
        metadata: metadata || {},
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating wallet transaction:', error)
      return NextResponse.json(
        { message: 'Failed to create wallet transaction' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Wallet transaction created successfully',
      transaction
    })

  } catch (error) {
    console.error('Create wallet transaction error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
