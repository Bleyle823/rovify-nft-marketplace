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
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')

    let query = supabaseAdmin
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) {
      query = query.eq('activity_type', type)
    }

    const { data: activities, error } = await query

    if (error) {
      console.error('Error fetching activities:', error)
      return NextResponse.json(
        { message: 'Failed to fetch activities' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      activities,
      pagination: {
        limit,
        offset,
        hasMore: activities.length === limit
      }
    })

  } catch (error) {
    console.error('Get activities error:', error)
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
    const { activity_type, reference_type, reference_id, metadata } = await request.json()

    if (!activity_type) {
      return NextResponse.json(
        { message: 'Activity type is required' },
        { status: 400 }
      )
    }

    const { data: activity, error } = await supabaseAdmin
      .from('user_activity')
      .insert({
        user_id: userId,
        activity_type,
        reference_type,
        reference_id,
        metadata: metadata || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating activity:', error)
      return NextResponse.json(
        { message: 'Failed to create activity' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Activity logged successfully',
      activity
    })

  } catch (error) {
    console.error('Create activity error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
