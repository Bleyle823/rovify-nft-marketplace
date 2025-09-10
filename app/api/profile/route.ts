import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
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

    // Get user profile with all relevant data
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        username,
        email,
        bio,
        image,
        verified,
        is_organiser,
        is_admin,
        followers_count,
        following_count,
        twitter,
        instagram,
        website,
        preferences,
        interests,
        saved_events,
        attended_events,
        created_events,
        base_name,
        ens_name,
        wallet_address,
        created_at,
        last_login_at
      `)
      .eq('id', userId)
      .single()

    if (userError || !userProfile) {
      return NextResponse.json(
        { message: 'User profile not found' },
        { status: 404 }
      )
    }

    // Get user preferences details
    const { data: preferences, error: prefError } = await supabase
      .from('user_preference_details')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Get user collections
    const { data: collections, error: collectionsError } = await supabase
      .from('user_collections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // Get user achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })

    // Get user activity
    const { data: activity, error: activityError } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    // Get user connections (friends)
    const { data: connections, error: connectionsError } = await supabase
      .from('user_connections')
      .select(`
        *,
        requester:users!user_connections_requester_id_fkey(id, name, username, image, verified),
        addressee:users!user_connections_addressee_id_fkey(id, name, username, image, verified)
      `)
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', 'accepted')

    // Get user wallet transactions
    const { data: walletTransactions, error: walletError } = await supabase
      .from('user_wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    // Get user tickets
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select(`
        *,
        event:events(id, title, date, image, location, status)
      `)
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })

    // Calculate profile stats
    const eventsAttended = userProfile.attended_events?.length || 0
    const eventsSaved = userProfile.saved_events?.length || 0
    const eventsCreated = userProfile.created_events?.length || 0
    const totalTickets = tickets?.length || 0
    const totalSpent = walletTransactions?.reduce((sum, tx) => {
      if (tx.transaction_type === 'event_purchase' && tx.status === 'completed') {
        return sum + (parseFloat(tx.usd_value) || 0)
      }
      return sum
    }, 0) || 0

    const profileData = {
      ...userProfile,
      preferences: preferences || {},
      collections: collections || [],
      achievements: achievements || [],
      activity: activity || [],
      connections: connections || [],
      walletTransactions: walletTransactions || [],
      tickets: tickets || [],
      stats: {
        eventsAttended,
        eventsSaved,
        eventsCreated,
        totalTickets,
        totalSpent,
        followersCount: userProfile.followers_count || 0,
        followingCount: userProfile.following_count || 0
      }
    }

    return NextResponse.json({ profile: profileData })

  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const updates = await request.json()

    // Separate user profile updates from preference updates
    const {
      preferences: preferencesUpdate,
      theme,
      language,
      timezone,
      email_notifications,
      push_notifications,
      privacy_settings,
      display_preferences,
      event_preferences,
      ...profileUpdates
    } = updates

    // Remove fields that shouldn't be updated directly
    const {
      id,
      created_at,
      password_hash,
      email_verified,
      is_admin,
      followers_count,
      following_count,
      ...allowedProfileUpdates
    } = profileUpdates

    // Update user profile
    const { data: updatedProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .update({
        ...allowedProfileUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select(`
        id,
        name,
        username,
        email,
        bio,
        image,
        verified,
        is_organiser,
        followers_count,
        following_count,
        twitter,
        instagram,
        website,
        preferences,
        interests,
        base_name,
        ens_name,
        wallet_address
      `)
      .single()

    if (profileError) {
      console.error('Error updating profile:', profileError)
      return NextResponse.json(
        { message: 'Failed to update profile' },
        { status: 500 }
      )
    }

    // Update user preferences if provided
    if (theme || language || timezone || email_notifications || push_notifications || 
        privacy_settings || display_preferences || event_preferences) {
      
      const preferenceUpdates = {
        ...(theme && { theme }),
        ...(language && { language }),
        ...(timezone && { timezone }),
        ...(email_notifications && { email_notifications }),
        ...(push_notifications && { push_notifications }),
        ...(privacy_settings && { privacy_settings }),
        ...(display_preferences && { display_preferences }),
        ...(event_preferences && { event_preferences }),
        updated_at: new Date().toISOString()
      }

      const { error: prefError } = await supabaseAdmin
        .from('user_preference_details')
        .upsert({
          user_id: userId,
          ...preferenceUpdates
        })

      if (prefError) {
        console.warn('Error updating preferences:', prefError)
      }
    }

    // Log the profile update activity
    await supabaseAdmin
      .from('user_activity')
      .insert({
        user_id: userId,
        activity_type: 'profile_updated',
        reference_type: 'user',
        reference_id: userId,
        metadata: {
          updated_fields: Object.keys(allowedProfileUpdates)
        }
      })

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
