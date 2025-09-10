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

    const { data: collections, error } = await supabaseAdmin
      .from('user_collections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching collections:', error)
      return NextResponse.json(
        { message: 'Failed to fetch collections' },
        { status: 500 }
      )
    }

    return NextResponse.json({ collections })

  } catch (error) {
    console.error('Get collections error:', error)
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
    const { name, description, color, icon, event_ids } = await request.json()

    if (!name) {
      return NextResponse.json(
        { message: 'Collection name is required' },
        { status: 400 }
      )
    }

    const { data: collection, error } = await supabaseAdmin
      .from('user_collections')
      .insert({
        user_id: userId,
        name,
        description,
        color: color || '#6366f1',
        icon: icon || 'bookmark',
        event_ids: event_ids || [],
        is_default: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating collection:', error)
      return NextResponse.json(
        { message: 'Failed to create collection' },
        { status: 500 }
      )
    }

    // Log the collection creation activity
    await supabaseAdmin
      .from('user_activity')
      .insert({
        user_id: userId,
        activity_type: 'collection_created',
        reference_type: 'collection',
        reference_id: collection.id,
        metadata: {
          collection_name: name,
          event_count: event_ids?.length || 0
        }
      })

    return NextResponse.json({
      message: 'Collection created successfully',
      collection
    })

  } catch (error) {
    console.error('Create collection error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
