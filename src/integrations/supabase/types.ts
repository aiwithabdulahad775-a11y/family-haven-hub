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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity: string | null
          entity_id: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          body_en: string | null
          body_ur: string | null
          category_en: string | null
          category_ur: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          excerpt_en: string | null
          excerpt_ur: string | null
          hue: number | null
          id: string
          is_published: boolean | null
          title_en: string
          title_ur: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body_en?: string | null
          body_ur?: string | null
          category_en?: string | null
          category_ur?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt_en?: string | null
          excerpt_ur?: string | null
          hue?: number | null
          id?: string
          is_published?: boolean | null
          title_en: string
          title_ur: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body_en?: string | null
          body_ur?: string | null
          category_en?: string | null
          category_ur?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt_en?: string | null
          excerpt_ur?: string | null
          hue?: number | null
          id?: string
          is_published?: boolean | null
          title_en?: string
          title_ur?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name_en: string
          name_ur: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_en: string
          name_ur: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name_en?: string
          name_ur?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      content_items: {
        Row: {
          body_en: string | null
          body_ur: string | null
          category_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          excerpt_en: string | null
          excerpt_ur: string | null
          hue: number | null
          id: string
          is_published: boolean | null
          media_url: string | null
          minutes: number | null
          section: string
          title_en: string
          title_ur: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body_en?: string | null
          body_ur?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt_en?: string | null
          excerpt_ur?: string | null
          hue?: number | null
          id?: string
          is_published?: boolean | null
          media_url?: string | null
          minutes?: number | null
          section: string
          title_en: string
          title_ur: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body_en?: string | null
          body_ur?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt_en?: string | null
          excerpt_ur?: string | null
          hue?: number | null
          id?: string
          is_published?: boolean | null
          media_url?: string | null
          minutes?: number | null
          section?: string
          title_en?: string
          title_ur?: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      counseling_notes: {
        Row: {
          author_id: string
          created_at: string
          id: string
          note: string
          request_id: string
        }
        Insert: {
          author_id: string
          created_at?: string
          id?: string
          note: string
          request_id: string
        }
        Update: {
          author_id?: string
          created_at?: string
          id?: string
          note?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "counseling_notes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "counseling_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      counseling_requests: {
        Row: {
          counselor_id: string | null
          created_at: string
          description: string | null
          id: string
          preferred_date: string | null
          preferred_time: string | null
          scheduled_at: string | null
          status: Database["public"]["Enums"]["counseling_status"]
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          counselor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          preferred_date?: string | null
          preferred_time?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["counseling_status"]
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          counselor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          preferred_date?: string | null
          preferred_time?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["counseling_status"]
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "counseling_requests_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["id"]
          },
        ]
      }
      counselors: {
        Row: {
          created_at: string
          focus_en: string | null
          focus_ur: string | null
          hue: number | null
          id: string
          initials: string | null
          is_active: boolean | null
          name: string
          role_en: string | null
          role_ur: string | null
          updated_at: string
          user_id: string | null
          years: number | null
        }
        Insert: {
          created_at?: string
          focus_en?: string | null
          focus_ur?: string | null
          hue?: number | null
          id?: string
          initials?: string | null
          is_active?: boolean | null
          name: string
          role_en?: string | null
          role_ur?: string | null
          updated_at?: string
          user_id?: string | null
          years?: number | null
        }
        Update: {
          created_at?: string
          focus_en?: string | null
          focus_ur?: string | null
          hue?: number | null
          id?: string
          initials?: string | null
          is_active?: boolean | null
          name?: string
          role_en?: string | null
          role_ur?: string | null
          updated_at?: string
          user_id?: string | null
          years?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body_en: string | null
          body_ur: string | null
          created_at: string
          id: string
          is_read: boolean | null
          title_en: string
          title_ur: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body_en?: string | null
          body_ur?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          title_en: string
          title_ur?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body_en?: string | null
          body_ur?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          title_en?: string
          title_ur?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          phone: string | null
          preferred_language: string | null
          status: string | null
          theme: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          phone?: string | null
          preferred_language?: string | null
          status?: string | null
          theme?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          status?: string | null
          theme?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_kind: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_kind: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_kind?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_roles: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "counselor" | "content_manager" | "admin"
      content_type: "article" | "video" | "pdf"
      counseling_status:
        | "pending"
        | "assigned"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
      notification_type: "system" | "content" | "counseling" | "announcement"
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
    Enums: {
      app_role: ["user", "counselor", "content_manager", "admin"],
      content_type: ["article", "video", "pdf"],
      counseling_status: [
        "pending",
        "assigned",
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
      ],
      notification_type: ["system", "content", "counseling", "announcement"],
    },
  },
} as const
