import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        organiser:organiser_id(id, name, image, verified, bio),
        tickets(id, type, tier_name, price, currency, status),
        event_likes(id, user_id),
        saved_events(id, user_id),
        reviews(id, rating, comment, user_id, created_at)
      `)
      .eq('id', id)
      .single()

    if (error || !event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await supabaseAdmin
      .from('events')
      .update({ views: (event.views || 0) + 1 })
      .eq('id', id)

    return NextResponse.json({ event })

  } catch (error) {
    console.error('Get event error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    const updates = await request.json()

    // Remove fields that shouldn't be updated directly
    const { id: _, created_at, ...allowedUpdates } = updates

    const { data: updatedEvent, error } = await supabaseAdmin
      .from('events')
      .update({
        ...allowedUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        organiser:organiser_id(id, name, image, verified)
      `)
      .single()

    if (error) {
      console.error('Error updating event:', error)
      return NextResponse.json(
        { message: 'Failed to update event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Event updated successfully',
      event: updatedEvent
    })

  } catch (error) {
    console.error('Update event error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting event:', error)
      return NextResponse.json(
        { message: 'Failed to delete event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Event deleted successfully'
    })

  } catch (error) {
    console.error('Delete event error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
