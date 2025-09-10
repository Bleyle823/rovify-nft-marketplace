'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'

interface ProfileData {
  id: string
  name: string
  username: string
  email: string
  bio: string
  image: string
  verified: boolean
  is_organiser: boolean
  is_admin: boolean
  followers_count: number
  following_count: number
  twitter: string
  instagram: string
  website: string
  preferences: any
  interests: string[]
  saved_events: string[]
  attended_events: string[]
  created_events: string[]
  base_name: string
  ens_name: string
  wallet_address: string
  created_at: string
  last_login_at: string
  collections: any[]
  achievements: any[]
  activity: any[]
  connections: any[]
  walletTransactions: any[]
  tickets: any[]
  stats: {
    eventsAttended: number
    eventsSaved: number
    eventsCreated: number
    totalTickets: number
    totalSpent: number
    followersCount: number
    followingCount: number
  }
}

interface UseProfileReturn {
  profile: ProfileData | null
  loading: boolean
  error: string | null
  updateProfile: (updates: Partial<ProfileData>) => Promise<boolean>
  refreshProfile: () => Promise<void>
  createCollection: (collection: any) => Promise<boolean>
  updateCollection: (id: string, updates: any) => Promise<boolean>
  deleteCollection: (id: string) => Promise<boolean>
  getActivity: (options?: { limit?: number; offset?: number; type?: string }) => Promise<any[]>
  getConnections: (status?: string) => Promise<any[]>
  sendFriendRequest: (addresseeId: string) => Promise<boolean>
  updateConnection: (id: string, status: string) => Promise<boolean>
  deleteConnection: (id: string) => Promise<boolean>
  getWalletTransactions: (options?: { limit?: number; offset?: number; type?: string }) => Promise<any>
  createWalletTransaction: (transaction: any) => Promise<boolean>
}

export const useProfile = (): UseProfileReturn => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      setProfile(data.profile)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const updateProfile = useCallback(async (updates: Partial<ProfileData>): Promise<boolean> => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const data = await response.json()
      setProfile(prev => prev ? { ...prev, ...data.profile } : data.profile)
      return true
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      return false
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    await fetchProfile()
  }, [fetchProfile])

  const createCollection = useCallback(async (collection: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/profile/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collection),
      })

      if (!response.ok) {
        throw new Error('Failed to create collection')
      }

      await refreshProfile()
      return true
    } catch (err) {
      console.error('Error creating collection:', err)
      setError(err instanceof Error ? err.message : 'Failed to create collection')
      return false
    }
  }, [refreshProfile])

  const updateCollection = useCallback(async (id: string, updates: any): Promise<boolean> => {
    try {
      const response = await fetch(`/api/profile/collections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update collection')
      }

      await refreshProfile()
      return true
    } catch (err) {
      console.error('Error updating collection:', err)
      setError(err instanceof Error ? err.message : 'Failed to update collection')
      return false
    }
  }, [refreshProfile])

  const deleteCollection = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/profile/collections/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete collection')
      }

      await refreshProfile()
      return true
    } catch (err) {
      console.error('Error deleting collection:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete collection')
      return false
    }
  }, [refreshProfile])

  const getActivity = useCallback(async (options?: { limit?: number; offset?: number; type?: string }) => {
    try {
      const params = new URLSearchParams()
      if (options?.limit) params.append('limit', options.limit.toString())
      if (options?.offset) params.append('offset', options.offset.toString())
      if (options?.type) params.append('type', options.type)

      const response = await fetch(`/api/profile/activity?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch activity')
      }

      const data = await response.json()
      return data.activities
    } catch (err) {
      console.error('Error fetching activity:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch activity')
      return []
    }
  }, [])

  const getConnections = useCallback(async (status: string = 'accepted') => {
    try {
      const response = await fetch(`/api/profile/connections?status=${status}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch connections')
      }

      const data = await response.json()
      return data.connections
    } catch (err) {
      console.error('Error fetching connections:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch connections')
      return []
    }
  }, [])

  const sendFriendRequest = useCallback(async (addresseeId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/profile/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressee_id: addresseeId }),
      })

      if (!response.ok) {
        throw new Error('Failed to send friend request')
      }

      return true
    } catch (err) {
      console.error('Error sending friend request:', err)
      setError(err instanceof Error ? err.message : 'Failed to send friend request')
      return false
    }
  }, [])

  const updateConnection = useCallback(async (id: string, status: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/profile/connections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update connection')
      }

      await refreshProfile()
      return true
    } catch (err) {
      console.error('Error updating connection:', err)
      setError(err instanceof Error ? err.message : 'Failed to update connection')
      return false
    }
  }, [refreshProfile])

  const deleteConnection = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/profile/connections/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete connection')
      }

      await refreshProfile()
      return true
    } catch (err) {
      console.error('Error deleting connection:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete connection')
      return false
    }
  }, [refreshProfile])

  const getWalletTransactions = useCallback(async (options?: { limit?: number; offset?: number; type?: string }) => {
    try {
      const params = new URLSearchParams()
      if (options?.limit) params.append('limit', options.limit.toString())
      if (options?.offset) params.append('offset', options.offset.toString())
      if (options?.type) params.append('type', options.type)

      const response = await fetch(`/api/profile/wallet?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch wallet transactions')
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error fetching wallet transactions:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet transactions')
      return { transactions: [], walletStats: {}, pagination: {} }
    }
  }, [])

  const createWalletTransaction = useCallback(async (transaction: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/profile/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      })

      if (!response.ok) {
        throw new Error('Failed to create wallet transaction')
      }

      return true
    } catch (err) {
      console.error('Error creating wallet transaction:', err)
      setError(err instanceof Error ? err.message : 'Failed to create wallet transaction')
      return false
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
    createCollection,
    updateCollection,
    deleteCollection,
    getActivity,
    getConnections,
    sendFriendRequest,
    updateConnection,
    deleteConnection,
    getWalletTransactions,
    createWalletTransaction,
  }
}
