import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organiser = searchParams.get('organiser')
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'published'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('events')
      .select(`
        *,
        organiser:organiser_id(id, name, image, verified),
        tickets(id, type, tier_name, price, currency, status),
        _count:event_likes(count)
      `)
      .eq('status', status)
      .order('date', { ascending: true })
      .range(offset, offset + limit - 1)

    if (organiser) {
      query = query.eq('organiser_id', organiser)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data: events, error } = await query

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json(
        { message: 'Failed to fetch events' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      events: events || [],
      count: events?.length || 0
    })

  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json()

    // Validate required fields
    const requiredFields = ['title', 'date', 'location', 'organiser_id']
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Create event
    const { data: newEvent, error: createError } = await supabaseAdmin
      .from('events')
      .insert({
        ...eventData,
        status: eventData.status || 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        organiser:organiser_id(id, name, image, verified)
      `)
      .single()

    if (createError) {
      console.error('Error creating event:', createError)
      return NextResponse.json(
        { message: 'Failed to create event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Event created successfully',
      event: newEvent
    }, { status: 201 })

  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
