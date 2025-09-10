import { supabase, supabaseAdmin } from './supabase'
import { Database } from '@/types/supabase'

type Tables = Database['public']['Tables']
type User = Tables['users']['Row']
type Event = Tables['events']['Row']
type Ticket = Tables['tickets']['Row']
type Transaction = Tables['transactions']['Row']

// User API functions
export const userAPI = {
  // Get user profile by ID
  async getProfile(userId: string): Promise<{ data: User | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<{ data: User | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    return { data, error }
  },

  // Create user profile
  async createProfile(userData: Tables['users']['Insert']): Promise<{ data: User | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    return { data, error }
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<{ data: User | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    return { data, error }
  },

  // Get user by wallet address
  async getUserByWallet(walletAddress: string): Promise<{ data: User | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()
    
    return { data, error }
  }
}

// Event API functions
export const eventAPI = {
  // Get all published events
  async getPublicEvents(): Promise<{ data: Event[] | null; error: any }> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organiser:organiser_id(id, name, image, verified)
      `)
      .eq('status', 'published')
      .order('date', { ascending: true })
    
    return { data, error }
  },

  // Get event by ID
  async getEvent(eventId: string): Promise<{ data: any | null; error: any }> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organiser:organiser_id(id, name, image, verified, bio),
        tickets(id, type, tier_name, price, currency, status),
        event_likes(id, user_id),
        saved_events(id, user_id)
      `)
      .eq('id', eventId)
      .single()
    
    return { data, error }
  },

  // Get events by organiser
  async getEventsByOrganiser(organiserId: string): Promise<{ data: Event[] | null; error: any }> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('organiser_id', organiserId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Create new event
  async createEvent(eventData: Tables['events']['Insert']): Promise<{ data: Event | null; error: any }> {
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single()
    
    return { data, error }
  },

  // Update event
  async updateEvent(eventId: string, updates: Tables['events']['Update']): Promise<{ data: Event | null; error: any }> {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single()
    
    return { data, error }
  },

  // Like/unlike event
  async toggleEventLike(eventId: string, userId: string): Promise<{ data: any; error: any }> {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('event_likes')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single()

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('event_likes')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId)
      
      return { data: { liked: false }, error }
    } else {
      // Like
      const { data, error } = await supabase
        .from('event_likes')
        .insert({ event_id: eventId, user_id: userId })
        .select()
        .single()
      
      return { data: { liked: true, ...data }, error }
    }
  },

  // Save/unsave event
  async toggleEventSave(eventId: string, userId: string): Promise<{ data: any; error: any }> {
    // Check if already saved
    const { data: existingSave } = await supabase
      .from('saved_events')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single()

    if (existingSave) {
      // Unsave
      const { error } = await supabase
        .from('saved_events')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId)
      
      return { data: { saved: false }, error }
    } else {
      // Save
      const { data, error } = await supabase
        .from('saved_events')
        .insert({ event_id: eventId, user_id: userId })
        .select()
        .single()
      
      return { data: { saved: true, ...data }, error }
    }
  }
}

// Ticket API functions
export const ticketAPI = {
  // Get user's tickets
  async getUserTickets(userId: string): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        event:event_id(id, title, date, location, image)
      `)
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get ticket by ID
  async getTicket(ticketId: string): Promise<{ data: any | null; error: any }> {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        event:event_id(*),
        owner:owner_id(id, name, email)
      `)
      .eq('id', ticketId)
      .single()
    
    return { data, error }
  },

  // Create ticket (usually done through purchase)
  async createTicket(ticketData: Tables['tickets']['Insert']): Promise<{ data: Ticket | null; error: any }> {
    const { data, error } = await supabase
      .from('tickets')
      .insert(ticketData)
      .select()
      .single()
    
    return { data, error }
  },

  // Update ticket status
  async updateTicketStatus(ticketId: string, status: string): Promise<{ data: Ticket | null; error: any }> {
    const { data, error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', ticketId)
      .select()
      .single()
    
    return { data, error }
  }
}

// Transaction API functions
export const transactionAPI = {
  // Get user's transactions
  async getUserTransactions(userId: string): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        event:event_id(id, title, date),
        ticket:ticket_id(id, type, tier_name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Create transaction
  async createTransaction(transactionData: Tables['transactions']['Insert']): Promise<{ data: Transaction | null; error: any }> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single()
    
    return { data, error }
  },

  // Update transaction status
  async updateTransactionStatus(transactionId: string, status: string, metadata?: any): Promise<{ data: Transaction | null; error: any }> {
    const updates: any = { status }
    if (metadata) updates.metadata = metadata
    
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', transactionId)
      .select()
      .single()
    
    return { data, error }
  }
}

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to event updates
  subscribeToEvent(eventId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`event_${eventId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events',
        filter: `id=eq.${eventId}`
      }, callback)
      .subscribe()
  },

  // Subscribe to user's tickets
  subscribeToUserTickets(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user_tickets_${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tickets',
        filter: `owner_id=eq.${userId}`
      }, callback)
      .subscribe()
  },

  // Subscribe to user's transactions
  subscribeToUserTransactions(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user_transactions_${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  }
}
