import { supabase } from './supabase'
import { Database } from '@/types/supabase'

type UserProfile = Database['public']['Tables']['users']['Row']

// Authentication helper functions
export const authHelpers = {
  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  },

  // Get current user session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Get current user profile
  async getCurrentUser(): Promise<{ user: UserProfile | null; error: any }> {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { user: null, error: authError }
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    return { user: profile, error: profileError }
  },

  // Create user profile after OAuth signup
  async createUserProfile(userData: {
    id: string
    email?: string
    name?: string
    image?: string
    auth_method: 'email' | 'google' | 'metamask' | 'base'
    wallet_address?: string
  }): Promise<{ user: UserProfile | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        image: userData.image,
        auth_method: userData.auth_method,
        wallet_address: userData.wallet_address,
        preferences: {
          currency: 'USD',
          newsletter: true,
          notifications: true,
          locationRadius: 25,
          notificationTypes: ['REMINDER', 'FRIEND_GOING', 'NEW_EVENT']
        }
      })
      .select()
      .single()

    return { user: data, error }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ user: UserProfile | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    return { user: data, error }
  },

  // Sign in with email and password
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign up with email and password
  async signUpWithEmail(email: string, password: string, userData?: { name?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData?.name
        }
      }
    })
    return { data, error }
  },

  // Sign in with Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Reset password
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    return { data, error }
  },

  // Update password
  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  },

  // Verify email
  async verifyEmail(token: string, type: 'signup' | 'recovery') {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type === 'signup' ? 'email' : 'recovery'
    })
    return { data, error }
  }
}

// Permission helpers
export const permissionHelpers = {
  // Check if user can edit event
  canEditEvent(user: UserProfile | null, event: any): boolean {
    if (!user || !event) return false
    return user.id === event.organiser_id || user.is_admin
  },

  // Check if user can manage tickets
  canManageTickets(user: UserProfile | null, event: any): boolean {
    if (!user || !event) return false
    return user.id === event.organiser_id || user.is_admin
  },

  // Check if user is organiser
  isOrganiser(user: UserProfile | null): boolean {
    return !!(user?.is_organiser || user?.is_admin)
  },

  // Check if user is admin
  isAdmin(user: UserProfile | null): boolean {
    return !!user?.is_admin
  },

  // Check if user can view admin dashboard
  canViewAdminDashboard(user: UserProfile | null): boolean {
    return !!user?.is_admin
  },

  // Check if user can view organiser dashboard
  canViewOrganiserDashboard(user: UserProfile | null): boolean {
    return !!(user?.is_organiser || user?.is_admin)
  }
}
