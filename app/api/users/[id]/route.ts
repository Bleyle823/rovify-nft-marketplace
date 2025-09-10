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

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        image,
        bio,
        verified,
        is_organiser,
        followers_count,
        following_count,
        interests,
        twitter,
        instagram,
        website,
        created_at,
        base_name,
        ens_name
      `)
      .eq('id', id)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Get user error:', error)
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
    const { 
      id: _, 
      created_at, 
      password_hash,
      email_verified,
      is_admin,
      ...allowedUpdates 
    } = updates

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({
        ...allowedUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        id,
        name,
        email,
        image,
        bio,
        verified,
        is_organiser,
        followers_count,
        following_count,
        interests,
        twitter,
        instagram,
        website,
        preferences
      `)
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json(
        { message: 'Failed to update user profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
