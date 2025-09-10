'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

type UserProfile = Database['public']['Tables']['users']['Row']

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setProfile(profile)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setProfile(profile)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    // If signup successful and userData provided, create profile
    if (data.user && !error && userData) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          auth_method: 'email',
          ...userData
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
      }
    }

    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { data: null, error: new Error('No user logged in') }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (data && !error) {
      setProfile(data)
    }

    return { data, error }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    updateProfile
  }
}

export function useSupabaseData() {
  // Events hooks
  const useEvents = () => {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetchEvents = async () => {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            organiser:organiser_id(id, name, image, verified)
          `)
          .eq('status', 'published')
          .order('date', { ascending: true })

        if (data && !error) {
          setEvents(data)
        }
        setLoading(false)
      }

      fetchEvents()
    }, [])

    return { events, loading, refetch: () => window.location.reload() }
  }

  // User tickets hook
  const useUserTickets = (userId?: string) => {
    const [tickets, setTickets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      if (!userId) {
        setLoading(false)
        return
      }

      const fetchTickets = async () => {
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            *,
            event:event_id(id, title, date, location, image)
          `)
          .eq('owner_id', userId)
          .order('created_at', { ascending: false })

        if (data && !error) {
          setTickets(data)
        }
        setLoading(false)
      }

      fetchTickets()
    }, [userId])

    return { tickets, loading }
  }

  // User transactions hook
  const useUserTransactions = (userId?: string) => {
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      if (!userId) {
        setLoading(false)
        return
      }

      const fetchTransactions = async () => {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            event:event_id(id, title, date),
            ticket:ticket_id(id, type, tier_name)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (data && !error) {
          setTransactions(data)
        }
        setLoading(false)
      }

      fetchTransactions()
    }, [userId])

    return { transactions, loading }
  }

  return {
    useEvents,
    useUserTickets,
    useUserTransactions
  }
}
