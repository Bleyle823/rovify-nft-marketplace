import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/auth-helpers'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const userId = session.user.id
    const { status } = await request.json()

    if (!status || !['accepted', 'declined', 'blocked'].includes(status)) {
      return NextResponse.json(
        { message: 'Valid status is required (accepted, declined, blocked)' },
        { status: 400 }
      )
    }

    // Get the connection to verify user can update it
    const { data: connection, error: fetchError } = await supabaseAdmin
      .from('user_connections')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !connection) {
      return NextResponse.json(
        { message: 'Connection not found' },
        { status: 404 }
      )
    }

    // Only the addressee can accept/decline, or either party can block
    if (status === 'blocked') {
      // Either party can block
      if (connection.requester_id !== userId && connection.addressee_id !== userId) {
        return NextResponse.json(
          { message: 'Unauthorized to update this connection' },
          { status: 403 }
        )
      }
    } else {
      // Only addressee can accept/decline
      if (connection.addressee_id !== userId) {
        return NextResponse.json(
          { message: 'Only the recipient can accept or decline friend requests' },
          { status: 403 }
        )
      }
    }

    const { data: updatedConnection, error } = await supabaseAdmin
      .from('user_connections')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        requester:users!user_connections_requester_id_fkey(id, name, username, image, verified),
        addressee:users!user_connections_addressee_id_fkey(id, name, username, image, verified)
      `)
      .single()

    if (error) {
      console.error('Error updating connection:', error)
      return NextResponse.json(
        { message: 'Failed to update connection' },
        { status: 500 }
      )
    }

    // Update followers/following counts if accepted
    if (status === 'accepted') {
      // Increment following count for requester
      await supabaseAdmin
        .from('users')
        .update({
          following_count: supabaseAdmin.raw('following_count + 1')
        })
        .eq('id', connection.requester_id)

      // Increment followers count for addressee
      await supabaseAdmin
        .from('users')
        .update({
          followers_count: supabaseAdmin.raw('followers_count + 1')
        })
        .eq('id', connection.addressee_id)

      // Log friend added activity for both users
      await supabaseAdmin
        .from('user_activity')
        .insert([
          {
            user_id: connection.requester_id,
            activity_type: 'friend_added',
            reference_type: 'user',
            reference_id: connection.addressee_id,
            metadata: {
              friend_name: updatedConnection.addressee.name || updatedConnection.addressee.username
            }
          },
          {
            user_id: connection.addressee_id,
            activity_type: 'friend_added',
            reference_type: 'user',
            reference_id: connection.requester_id,
            metadata: {
              friend_name: updatedConnection.requester.name || updatedConnection.requester.username
            }
          }
        ])

      // Create notification for the requester
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: connection.requester_id,
          type: 'friend_accepted',
          title: 'Friend Request Accepted',
          message: `${updatedConnection.addressee.name || updatedConnection.addressee.username} accepted your friend request`,
          reference_type: 'user',
          reference_id: connection.addressee_id,
          action_url: `/profile/${connection.addressee_id}`,
          action_text: 'View Profile'
        })
    }

    return NextResponse.json({
      message: `Connection ${status} successfully`,
      connection: updatedConnection
    })

  } catch (error) {
    console.error('Update connection error:', error)
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
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const userId = session.user.id

    // Get the connection to verify user can delete it
    const { data: connection, error: fetchError } = await supabaseAdmin
      .from('user_connections')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !connection) {
      return NextResponse.json(
        { message: 'Connection not found' },
        { status: 404 }
      )
    }

    // Only parties involved can delete the connection
    if (connection.requester_id !== userId && connection.addressee_id !== userId) {
      return NextResponse.json(
        { message: 'Unauthorized to delete this connection' },
        { status: 403 }
      )
    }

    // If connection was accepted, update follower counts
    if (connection.status === 'accepted') {
      // Decrement following count for requester
      await supabaseAdmin
        .from('users')
        .update({
          following_count: supabaseAdmin.raw('following_count - 1')
        })
        .eq('id', connection.requester_id)

      // Decrement followers count for addressee
      await supabaseAdmin
        .from('users')
        .update({
          followers_count: supabaseAdmin.raw('followers_count - 1')
        })
        .eq('id', connection.addressee_id)
    }

    const { error } = await supabaseAdmin
      .from('user_connections')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting connection:', error)
      return NextResponse.json(
        { message: 'Failed to delete connection' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Connection deleted successfully'
    })

  } catch (error) {
    console.error('Delete connection error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
