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

    const { data: achievements, error } = await supabaseAdmin
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })

    if (error) {
      console.error('Error fetching achievements:', error)
      return NextResponse.json(
        { message: 'Failed to fetch achievements' },
        { status: 500 }
      )
    }

    return NextResponse.json({ achievements })

  } catch (error) {
    console.error('Get achievements error:', error)
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
    const { achievement_type, title, description, icon, points_awarded, metadata } = await request.json()

    if (!achievement_type || !title) {
      return NextResponse.json(
        { message: 'Achievement type and title are required' },
        { status: 400 }
      )
    }

    // Check if achievement already exists for this user
    const { data: existingAchievement } = await supabaseAdmin
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_type', achievement_type)
      .single()

    if (existingAchievement) {
      return NextResponse.json(
        { message: 'Achievement already unlocked' },
        { status: 400 }
      )
    }

    const { data: achievement, error } = await supabaseAdmin
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_type,
        title,
        description,
        icon: icon || 'award',
        points_awarded: points_awarded || 0,
        metadata: metadata || {},
        unlocked_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating achievement:', error)
      return NextResponse.json(
        { message: 'Failed to unlock achievement' },
        { status: 500 }
      )
    }

    // Log the achievement unlock activity
    await supabaseAdmin
      .from('user_activity')
      .insert({
        user_id: userId,
        activity_type: 'achievement_unlocked',
        reference_type: 'achievement',
        reference_id: achievement.id,
        metadata: {
          achievement_type,
          title,
          points_awarded: points_awarded || 0
        }
      })

    return NextResponse.json({
      message: 'Achievement unlocked successfully',
      achievement
    })

  } catch (error) {
    console.error('Unlock achievement error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
