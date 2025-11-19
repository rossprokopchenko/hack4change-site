export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          dietary_restrictions: string | null
          tshirt_size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | null
          rsvp_status: 'pending' | 'confirmed' | 'declined' | 'waitlist'
          registration_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          dietary_restrictions?: string | null
          tshirt_size?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | null
          rsvp_status?: 'pending' | 'confirmed' | 'declined' | 'waitlist'
          registration_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          dietary_restrictions?: string | null
          tshirt_size?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | null
          rsvp_status?: 'pending' | 'confirmed' | 'declined' | 'waitlist'
          registration_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          description: string | null
          max_members: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          max_members?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          max_members?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: 'leader' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: 'leader' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: 'leader' | 'member'
          joined_at?: string
        }
      }
    }
  }
}
