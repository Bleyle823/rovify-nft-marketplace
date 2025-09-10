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
    const status = searchParams.get('status') || 'accepted'

    const { data: connections, error } = await supabaseAdmin
      .from('user_connections')
      .select(`
        *,
        requester:users!user_connections_requester_id_fkey(id, name, username, image, verified),
        addressee:users!user_connections_addressee_id_fkey(id, name, username, image, verified)
      `)
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching connections:', error)
      return NextResponse.json(
        { message: 'Failed to fetch connections' },
        { status: 500 }
      )
    }

    // Transform connections to show the other user as the connection
    const transformedConnections = connections.map(connection => {
      const isRequester = connection.requester_id === userId
      const otherUser = isRequester ? connection.addressee : connection.requester
      
      return {
        ...connection,
        user: otherUser,
        isRequester
      }
    })

    return NextResponse.json({ connections: transformedConnections })

  } catch (error) {
    console.error('Get connections error:', error)
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
    const { addressee_id } = await request.json()

    if (!addressee_id) {
      return NextResponse.json(
        { message: 'Addressee ID is required' },
        { status: 400 }
      )
    }

    if (addressee_id === userId) {
      return NextResponse.json(
        { message: 'Cannot send friend request to yourself' },
        { status: 400 }
      )
    }

    // Check if connection already exists
    const { data: existingConnection } = await supabaseAdmin
      .from('user_connections')
      .select('id, status')
      .or(`and(requester_id.eq.${userId},addressee_id.eq.${addressee_id}),and(requester_id.eq.${addressee_id},addressee_id.eq.${userId})`)
      .single()

    if (existingConnection) {
      return NextResponse.json(
        { message: `Connection already exists with status: ${existingConnection.status}` },
        { status: 400 }
      )
    }

    const { data: connection, error } = await supabaseAdmin
      .from('user_connections')
      .insert({
        requester_id: userId,
        addressee_id,
        status: 'pending'
      })
      .select(`
        *,
        requester:users!user_connections_requester_id_fkey(id, name, username, image, verified),
        addressee:users!user_connections_addressee_id_fkey(id, name, username, image, verified)
      `)
      .single()

    if (error) {
      console.error('Error creating connection:', error)
      return NextResponse.json(
        { message: 'Failed to send friend request' },
        { status: 500 }
      )
    }

    // Create notification for the addressee
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: addressee_id,
        type: 'friend_request',
        title: 'New Friend Request',
        message: `${connection.requester.name || connection.requester.username} sent you a friend request`,
        reference_type: 'user_connection',
        reference_id: connection.id,
        action_url: `/profile/friends`,
        action_text: 'View Request'
      })

    return NextResponse.json({
      message: 'Friend request sent successfully',
      connection
    })

  } catch (error) {
    console.error('Send friend request error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
