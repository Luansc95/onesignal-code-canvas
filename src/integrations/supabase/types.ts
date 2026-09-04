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
      admin_users_meta: {
        Row: {
          created_at: string
          deactivated_at: string | null
          id: string
          invited_by: string | null
          is_active: boolean
          last_sign_in_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deactivated_at?: string | null
          id: string
          invited_by?: string | null
          is_active?: boolean
          last_sign_in_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deactivated_at?: string | null
          id?: string
          invited_by?: string | null
          is_active?: boolean
          last_sign_in_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          device_type: string | null
          event_id: string
          event_name: string
          landing_page: string | null
          metadata: Json | null
          occurred_at: string
          page_path: string | null
          page_url: string | null
          referrer: string | null
          session_id: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          event_id?: string
          event_name: string
          landing_page?: string | null
          metadata?: Json | null
          occurred_at?: string
          page_path?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id: string
        }
        Update: {
          created_at?: string
          device_type?: string | null
          event_id?: string
          event_name?: string
          landing_page?: string | null
          metadata?: Json | null
          occurred_at?: string
          page_path?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          metadata: Json | null
          target_id: string | null
          target_type: string
          user_email: string | null
          user_id: string | null
          user_name: string | null
          user_role: Database["public"]["Enums"]["app_role"] | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          user_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          user_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          campaign: string
          content: string | null
          created_at: string
          created_by: string | null
          generated_url: string | null
          id: string
          medium: string
          name: string
          source: string
          status: string
          target_url: string
          term: string | null
          updated_at: string
        }
        Insert: {
          campaign: string
          content?: string | null
          created_at?: string
          created_by?: string | null
          generated_url?: string | null
          id?: string
          medium: string
          name: string
          source: string
          status?: string
          target_url: string
          term?: string | null
          updated_at?: string
        }
        Update: {
          campaign?: string
          content?: string | null
          created_at?: string
          created_by?: string | null
          generated_url?: string | null
          id?: string
          medium?: string
          name?: string
          source?: string
          status?: string
          target_url?: string
          term?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address_display: string
          business_hours: string
          cnpj: string | null
          commercial_email: string
          company_name: string
          created_at: string
          github: string | null
          id: string
          instagram: string
          linkedin: string
          notify_on_diagnostic: boolean
          notify_on_new_lead: boolean
          phone_display: string
          raw_whatsapp_number: string
          seo_description: string
          seo_title: string
          singleton: boolean
          support_email: string
          trading_name: string
          updated_at: string
          youtube: string | null
        }
        Insert: {
          address_display?: string
          business_hours?: string
          cnpj?: string | null
          commercial_email?: string
          company_name?: string
          created_at?: string
          github?: string | null
          id?: string
          instagram?: string
          linkedin?: string
          notify_on_diagnostic?: boolean
          notify_on_new_lead?: boolean
          phone_display?: string
          raw_whatsapp_number?: string
          seo_description?: string
          seo_title?: string
          singleton?: boolean
          support_email?: string
          trading_name?: string
          updated_at?: string
          youtube?: string | null
        }
        Update: {
          address_display?: string
          business_hours?: string
          cnpj?: string | null
          commercial_email?: string
          company_name?: string
          created_at?: string
          github?: string | null
          id?: string
          instagram?: string
          linkedin?: string
          notify_on_diagnostic?: boolean
          notify_on_new_lead?: boolean
          phone_display?: string
          raw_whatsapp_number?: string
          seo_description?: string
          seo_title?: string
          singleton?: boolean
          support_email?: string
          trading_name?: string
          updated_at?: string
          youtube?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          lead_id: string | null
          message: string
          name: string
          page_url: string | null
          referrer: string | null
          service_type: string | null
          source: string
          status: Database["public"]["Enums"]["contact_status"]
          subject: string | null
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          whatsapp: string
        }
        Insert: {
          company?: string
          created_at?: string
          email: string
          id?: string
          lead_id?: string | null
          message?: string
          name: string
          page_url?: string | null
          referrer?: string | null
          service_type?: string | null
          source?: string
          status?: Database["public"]["Enums"]["contact_status"]
          subject?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp?: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          lead_id?: string | null
          message?: string
          name?: string
          page_url?: string | null
          referrer?: string | null
          service_type?: string | null
          source?: string
          status?: Database["public"]["Enums"]["contact_status"]
          subject?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_answers: {
        Row: {
          answer_value: string | null
          answer_values: string[] | null
          created_at: string
          diagnostic_id: string
          id: string
          question_key: string
          question_label: string | null
          step_number: number | null
        }
        Insert: {
          answer_value?: string | null
          answer_values?: string[] | null
          created_at?: string
          diagnostic_id: string
          id?: string
          question_key: string
          question_label?: string | null
          step_number?: number | null
        }
        Update: {
          answer_value?: string | null
          answer_values?: string[] | null
          created_at?: string
          diagnostic_id?: string
          id?: string
          question_key?: string
          question_label?: string | null
          step_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_answers_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostics: {
        Row: {
          answers: Json
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          identified_opportunities: Json
          landing_page: string | null
          lead_id: string | null
          maturity_level: string
          maturity_percentage: number
          recommended_solutions: Json
          referrer: string | null
          score: number
          session_id: string | null
          summary_text: string | null
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          visitor_id: string | null
        }
        Insert: {
          answers?: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          identified_opportunities?: Json
          landing_page?: string | null
          lead_id?: string | null
          maturity_level?: string
          maturity_percentage?: number
          recommended_solutions?: Json
          referrer?: string | null
          score?: number
          session_id?: string | null
          summary_text?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id?: string | null
        }
        Update: {
          answers?: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          identified_opportunities?: Json
          landing_page?: string | null
          lead_id?: string | null
          maturity_level?: string
          maturity_percentage?: number
          recommended_solutions?: Json
          referrer?: string | null
          score?: number
          session_id?: string | null
          summary_text?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostics_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          author_id: string | null
          author_name: string
          created_at: string
          description: string
          id: string
          lead_id: string
          metadata: Json | null
          type: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string
          created_at?: string
          description?: string
          id?: string
          lead_id: string
          metadata?: Json | null
          type: string
        }
        Update: {
          author_id?: string | null
          author_name?: string
          created_at?: string
          description?: string
          id?: string
          lead_id?: string
          metadata?: Json | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget_range: string | null
          closed_value: number | null
          company: string
          created_at: string
          desired_timeline: string | null
          diagnostic_answers: Json | null
          diagnostic_completed: boolean
          diagnostic_score: number | null
          digital_maturity: string | null
          email: string
          estimated_value: number | null
          first_touch: Json | null
          found_us_via: string | null
          id: string
          identified_challenges: string[] | null
          internal_notes: string | null
          landing_page: string | null
          last_touch: Json | null
          lgpd_consent: boolean
          name: string
          next_follow_up_at: string | null
          notes: string | null
          page_url: string | null
          preferred_contact_method: string | null
          priority: Database["public"]["Enums"]["lead_priority"] | null
          project_description: string
          proposal_value: number | null
          recommended_solutions: string[] | null
          referrer: string | null
          revenue: number | null
          score: number | null
          score_factors: Json | null
          session_id: string | null
          solution_type: string
          source: string
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string | null
          whatsapp: string
        }
        Insert: {
          assigned_to?: string | null
          budget_range?: string | null
          closed_value?: number | null
          company?: string
          created_at?: string
          desired_timeline?: string | null
          diagnostic_answers?: Json | null
          diagnostic_completed?: boolean
          diagnostic_score?: number | null
          digital_maturity?: string | null
          email: string
          estimated_value?: number | null
          first_touch?: Json | null
          found_us_via?: string | null
          id?: string
          identified_challenges?: string[] | null
          internal_notes?: string | null
          landing_page?: string | null
          last_touch?: Json | null
          lgpd_consent?: boolean
          name: string
          next_follow_up_at?: string | null
          notes?: string | null
          page_url?: string | null
          preferred_contact_method?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"] | null
          project_description?: string
          proposal_value?: number | null
          recommended_solutions?: string[] | null
          referrer?: string | null
          revenue?: number | null
          score?: number | null
          score_factors?: Json | null
          session_id?: string | null
          solution_type?: string
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string | null
          whatsapp?: string
        }
        Update: {
          assigned_to?: string | null
          budget_range?: string | null
          closed_value?: number | null
          company?: string
          created_at?: string
          desired_timeline?: string | null
          diagnostic_answers?: Json | null
          diagnostic_completed?: boolean
          diagnostic_score?: number | null
          digital_maturity?: string | null
          email?: string
          estimated_value?: number | null
          first_touch?: Json | null
          found_us_via?: string | null
          id?: string
          identified_challenges?: string[] | null
          internal_notes?: string | null
          landing_page?: string | null
          last_touch?: Json | null
          lgpd_consent?: boolean
          name?: string
          next_follow_up_at?: string | null
          notes?: string | null
          page_url?: string | null
          preferred_contact_method?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"] | null
          project_description?: string
          proposal_value?: number | null
          recommended_solutions?: string[] | null
          referrer?: string | null
          revenue?: number | null
          score?: number | null
          score_factors?: Json | null
          session_id?: string | null
          solution_type?: string
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link_url: string | null
          message: string
          metadata: Json | null
          read: boolean
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          link_url?: string | null
          message?: string
          metadata?: Json | null
          read?: boolean
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          link_url?: string | null
          message?: string
          metadata?: Json | null
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      pending_role_assignments: {
        Row: {
          consumed_at: string | null
          created_at: string
          email: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          consumed_at?: string | null
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          consumed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          project_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          project_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          project_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          accent_color: string
          category: string
          category_label: string
          challenge: string
          client_name: string | null
          client_type: string
          cover_image: string | null
          created_at: string
          created_by: string | null
          demo_url: string | null
          featured: boolean
          features: Json
          id: string
          image_placeholder_type: string
          is_published: boolean
          name: string
          project_type: string | null
          results: Json
          short_description: string
          slug: string
          solution: string
          sort_order: number
          status: Database["public"]["Enums"]["project_status"]
          tagline: string
          technologies: string[]
          updated_at: string
          views_count: number
          year: string
        }
        Insert: {
          accent_color?: string
          category?: string
          category_label?: string
          challenge?: string
          client_name?: string | null
          client_type?: string
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          demo_url?: string | null
          featured?: boolean
          features?: Json
          id?: string
          image_placeholder_type?: string
          is_published?: boolean
          name: string
          project_type?: string | null
          results?: Json
          short_description?: string
          slug: string
          solution?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["project_status"]
          tagline?: string
          technologies?: string[]
          updated_at?: string
          views_count?: number
          year?: string
        }
        Update: {
          accent_color?: string
          category?: string
          category_label?: string
          challenge?: string
          client_name?: string | null
          client_type?: string
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          demo_url?: string | null
          featured?: boolean
          features?: Json
          id?: string
          image_placeholder_type?: string
          is_published?: boolean
          name?: string
          project_type?: string | null
          results?: Json
          short_description?: string
          slug?: string
          solution?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["project_status"]
          tagline?: string
          technologies?: string[]
          updated_at?: string
          views_count?: number
          year?: string
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
      assign_pending_role: {
        Args: { _email: string; _role: Database["public"]["Enums"]["app_role"] }
        Returns: undefined
      }
      audit_admin_action: {
        Args: {
          _action: string
          _details: string
          _metadata?: Json
          _target_id: string
          _target_type: string
        }
        Returns: undefined
      }
      has_any_role: {
        Args: { _roles: Database["public"]["Enums"]["app_role"][] }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      list_admin_users: {
        Args: never
        Returns: {
          avatar_url: string
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_sign_in_at: string
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      set_user_active: {
        Args: { _active: boolean; _user_id: string }
        Returns: undefined
      }
      set_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      storage_object_is_published: { Args: { _name: string }; Returns: boolean }
      touch_last_sign_in: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "editor" | "commercial" | "marketing"
      contact_status: "new" | "read" | "replied" | "converted"
      lead_priority: "high" | "medium" | "low"
      lead_status:
        | "new"
        | "analyzing"
        | "contacted"
        | "negotiating"
        | "converted"
        | "lost"
        | "archived"
      project_status:
        | "published"
        | "draft"
        | "archived"
        | "completed"
        | "in_development"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "editor", "commercial", "marketing"],
      contact_status: ["new", "read", "replied", "converted"],
      lead_priority: ["high", "medium", "low"],
      lead_status: [
        "new",
        "analyzing",
        "contacted",
        "negotiating",
        "converted",
        "lost",
        "archived",
      ],
      project_status: [
        "published",
        "draft",
        "archived",
        "completed",
        "in_development",
      ],
    },
  },
} as const
