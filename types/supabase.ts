export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_likes: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_likes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_shares: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          platform: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          platform?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          platform?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_shares_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          contract_address: string | null
          contract_event_id: number | null
          created_at: string | null
          date: string
          description: string | null
          end_date: string | null
          has_nft_tickets: boolean | null
          id: string
          image: string | null
          is_featured: boolean | null
          likes: number | null
          location: Json
          max_tickets_per_user: number | null
          organiser_id: string | null
          price: Json | null
          published_at: string | null
          shares: number | null
          sold_tickets: number | null
          status: string | null
          subcategory: string | null
          tags: string[] | null
          title: string
          total_tickets: number | null
          updated_at: string | null
          venue_capacity: number | null
          views: number | null
        }
        Insert: {
          category?: string | null
          contract_address?: string | null
          contract_event_id?: number | null
          created_at?: string | null
          date: string
          description?: string | null
          end_date?: string | null
          has_nft_tickets?: boolean | null
          id?: string
          image?: string | null
          is_featured?: boolean | null
          likes?: number | null
          location: Json
          max_tickets_per_user?: number | null
          organiser_id?: string | null
          price?: Json | null
          published_at?: string | null
          shares?: number | null
          sold_tickets?: number | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          total_tickets?: number | null
          updated_at?: string | null
          venue_capacity?: number | null
          views?: number | null
        }
        Update: {
          category?: string | null
          contract_address?: string | null
          contract_event_id?: number | null
          created_at?: string | null
          date?: string
          description?: string | null
          end_date?: string | null
          has_nft_tickets?: boolean | null
          id?: string
          image?: string | null
          is_featured?: boolean | null
          likes?: number | null
          location?: Json
          max_tickets_per_user?: number | null
          organiser_id?: string | null
          price?: Json | null
          published_at?: string | null
          shares?: number | null
          sold_tickets?: number | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          total_tickets?: number | null
          updated_at?: string | null
          venue_capacity?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organiser_id_fkey"
            columns: ["organiser_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          deleted: boolean | null
          edited: boolean | null
          edited_at: string | null
          event_id: string | null
          id: string
          metadata: Json | null
          reply_to_id: string | null
          sender_id: string | null
          type: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted?: boolean | null
          edited?: boolean | null
          edited_at?: string | null
          event_id?: string | null
          id?: string
          metadata?: Json | null
          reply_to_id?: string | null
          sender_id?: string | null
          type?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted?: boolean | null
          edited?: boolean | null
          edited_at?: string | null
          event_id?: string | null
          id?: string
          metadata?: Json | null
          reply_to_id?: string | null
          sender_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_text: string | null
          action_url: string | null
          created_at: string | null
          id: string
          message: string | null
          read: boolean | null
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_text?: string | null
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action_text?: string | null
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          metadata: Json | null
          provider: string | null
          provider_id: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          metadata?: Json | null
          provider?: string | null
          provider_id?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          metadata?: Json | null
          provider?: string | null
          provider_id?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          event_id: string | null
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_events: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          checked_in_by: string | null
          contract_address: string | null
          created_at: string | null
          currency: string | null
          event_id: string | null
          id: string
          is_nft: boolean | null
          metadata: Json | null
          owner_id: string | null
          price: number | null
          purchase_date: string | null
          qr_code: string | null
          seat_info: Json | null
          status: string | null
          tier_name: string | null
          token_id: string | null
          transferable: boolean | null
          type: string
          updated_at: string | null
          used_at: string | null
          verification_code: string | null
        }
        Insert: {
          checked_in_by?: string | null
          contract_address?: string | null
          created_at?: string | null
          currency?: string | null
          event_id?: string | null
          id?: string
          is_nft?: boolean | null
          metadata?: Json | null
          owner_id?: string | null
          price?: number | null
          purchase_date?: string | null
          qr_code?: string | null
          seat_info?: Json | null
          status?: string | null
          tier_name?: string | null
          token_id?: string | null
          transferable?: boolean | null
          type: string
          updated_at?: string | null
          used_at?: string | null
          verification_code?: string | null
        }
        Update: {
          checked_in_by?: string | null
          contract_address?: string | null
          created_at?: string | null
          currency?: string | null
          event_id?: string | null
          id?: string
          is_nft?: boolean | null
          metadata?: Json | null
          owner_id?: string | null
          price?: number | null
          purchase_date?: string | null
          qr_code?: string | null
          seat_info?: Json | null
          status?: string | null
          tier_name?: string | null
          token_id?: string | null
          transferable?: boolean | null
          type?: string
          updated_at?: string | null
          used_at?: string | null
          verification_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_checked_in_by_fkey"
            columns: ["checked_in_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number | null
          block_number: number | null
          completed_at: string | null
          created_at: string | null
          currency: string | null
          event_id: string | null
          gas_used: string | null
          id: string
          metadata: Json | null
          payment_id: string | null
          payment_method: string | null
          status: string | null
          ticket_id: string | null
          transaction_hash: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          block_number?: number | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          event_id?: string | null
          gas_used?: string | null
          id?: string
          metadata?: Json | null
          payment_id?: string | null
          payment_method?: string | null
          status?: string | null
          ticket_id?: string | null
          transaction_hash?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          block_number?: number | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          event_id?: string | null
          gas_used?: string | null
          id?: string
          metadata?: Json | null
          payment_id?: string | null
          payment_method?: string | null
          status?: string | null
          ticket_id?: string | null
          transaction_hash?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          attended_events: string[] | null
          auth_method: string
          base_name: string | null
          bio: string | null
          created_at: string | null
          created_events: string[] | null
          email: string | null
          email_verified: boolean | null
          ens_name: string | null
          followers_count: number | null
          following_count: number | null
          id: string
          image: string | null
          instagram: string | null
          interests: string[] | null
          is_admin: boolean | null
          is_organiser: boolean | null
          last_login_at: string | null
          name: string | null
          password_hash: string | null
          preferences: Json | null
          saved_events: string[] | null
          twitter: string | null
          updated_at: string | null
          username: string | null
          verified: boolean | null
          wallet_address: string | null
          website: string | null
        }
        Insert: {
          attended_events?: string[] | null
          auth_method: string
          base_name?: string | null
          bio?: string | null
          created_at?: string | null
          created_events?: string[] | null
          email?: string | null
          email_verified?: boolean | null
          ens_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          image?: string | null
          instagram?: string | null
          interests?: string[] | null
          is_admin?: boolean | null
          is_organiser?: boolean | null
          last_login_at?: string | null
          name?: string | null
          password_hash?: string | null
          preferences?: Json | null
          saved_events?: string[] | null
          twitter?: string | null
          updated_at?: string | null
          username?: string | null
          verified?: boolean | null
          wallet_address?: string | null
          website?: string | null
        }
        Update: {
          attended_events?: string[] | null
          auth_method?: string
          base_name?: string | null
          bio?: string | null
          created_at?: string | null
          created_events?: string[] | null
          email?: string | null
          email_verified?: boolean | null
          ens_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          image?: string | null
          instagram?: string | null
          interests?: string[] | null
          is_admin?: boolean | null
          is_organiser?: boolean | null
          last_login_at?: string | null
          name?: string | null
          password_hash?: string | null
          preferences?: Json | null
          saved_events?: string[] | null
          twitter?: string | null
          updated_at?: string | null
          username?: string | null
          verified?: boolean | null
          wallet_address?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_qr_code: {
        Args: { event_id: string; ticket_id: string; ticket_type: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
