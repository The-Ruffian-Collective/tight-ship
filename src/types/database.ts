export type Role = 'manager' | 'staff'
export type InputType = 'text' | 'number' | 'boolean'

export interface DailySchedule {
  type: 'daily'
  time: string // HH:MM format
}

export interface WeeklySchedule {
  type: 'weekly'
  days: number[] // 0-6 (Sunday-Saturday)
  time: string // HH:MM format
}

export type Schedule = DailySchedule | WeeklySchedule

export interface Database {
  public: {
    Tables: {
      organisations: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          user_id: string
          organisation_id: string
          role: Role
          full_name: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          organisation_id: string
          role: Role
          full_name?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          organisation_id?: string
          role?: Role
          full_name?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          organisation_id: string
          title: string
          description: string | null
          input_type: InputType
          schedule: Schedule
          range_min: number | null
          range_max: number | null
          assigned_role: Role
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          organisation_id: string
          title: string
          description?: string | null
          input_type: InputType
          schedule: Schedule
          range_min?: number | null
          range_max?: number | null
          assigned_role: Role
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string
          title?: string
          description?: string | null
          input_type?: InputType
          schedule?: Schedule
          range_min?: number | null
          range_max?: number | null
          assigned_role?: Role
          is_active?: boolean
          created_at?: string
        }
      }
      task_records: {
        Row: {
          id: string
          task_id: string
          completed_by: string
          completed_at: string
          value_text: string | null
          value_number: number | null
          value_boolean: boolean | null
          flagged: boolean
          flag_comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          completed_by: string
          completed_at?: string
          value_text?: string | null
          value_number?: number | null
          value_boolean?: boolean | null
          flagged?: boolean
          flag_comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          completed_by?: string
          completed_at?: string
          value_text?: string | null
          value_number?: number | null
          value_boolean?: boolean | null
          flagged?: boolean
          flag_comment?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Helper types for easier usage
export type Organisation = Database['public']['Tables']['organisations']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskRecord = Database['public']['Tables']['task_records']['Row']
