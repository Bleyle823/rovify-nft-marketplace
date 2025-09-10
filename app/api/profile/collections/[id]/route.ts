import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/auth-helpers'

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
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const userId = session.user.id

    const { data: collection, error } = await supabaseAdmin
      .from('user_collections')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !collection) {
      return NextResponse.json(
        { message: 'Collection not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ collection })

  } catch (error) {
    console.error('Get collection error:', error)
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
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const userId = session.user.id
    const updates = await request.json()

    // Remove fields that shouldn't be updated directly
    const { id: _, user_id, created_at, ...allowedUpdates } = updates

    const { data: updatedCollection, error } = await supabaseAdmin
      .from('user_collections')
      .update({
        ...allowedUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating collection:', error)
      return NextResponse.json(
        { message: 'Failed to update collection' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Collection updated successfully',
      collection: updatedCollection
    })

  } catch (error) {
    console.error('Update collection error:', error)
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

    // Check if collection exists and belongs to user
    const { data: collection, error: fetchError } = await supabaseAdmin
      .from('user_collections')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (fetchError || !collection) {
      return NextResponse.json(
        { message: 'Collection not found' },
        { status: 404 }
      )
    }

    // Don't allow deletion of default collections
    if (collection.is_default) {
      return NextResponse.json(
        { message: 'Cannot delete default collection' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('user_collections')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting collection:', error)
      return NextResponse.json(
        { message: 'Failed to delete collection' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Collection deleted successfully'
    })

  } catch (error) {
    console.error('Delete collection error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
