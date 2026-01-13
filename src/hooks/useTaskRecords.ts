import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { TaskRecord, Task } from '../types/database'

interface CreateRecordInput {
  task_id: string
  value_text?: string | null
  value_number?: number | null
  value_boolean?: boolean | null
  flagged: boolean
  flag_comment?: string | null
}

interface TaskRecordWithTask extends TaskRecord {
  tasks: Pick<Task, 'title' | 'input_type'>
}

export function useTaskRecords() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const createRecord = async (input: CreateRecordInput): Promise<{ error: Error | null }> => {
    if (!user?.id) {
      return { error: new Error('Not authenticated') }
    }

    setLoading(true)
    setError(null)

    const { error: insertError } = await supabase
      .from('task_records')
      .insert({
        task_id: input.task_id,
        completed_by: user.id,
        value_text: input.value_text ?? null,
        value_number: input.value_number ?? null,
        value_boolean: input.value_boolean ?? null,
        flagged: input.flagged,
        flag_comment: input.flag_comment ?? null,
      })

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return { error: insertError }
    }

    return { error: null }
  }

  const getTodaysRecords = useCallback(async (): Promise<TaskRecord[]> => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data, error: fetchError } = await supabase
      .from('task_records')
      .select('*')
      .gte('completed_at', today.toISOString())
      .lt('completed_at', tomorrow.toISOString())

    if (fetchError) {
      console.error('Error fetching today\'s records:', fetchError)
      return []
    }

    return data || []
  }, [])

  const getRecordsForTask = useCallback(async (taskId: string): Promise<TaskRecord[]> => {
    const { data, error: fetchError } = await supabase
      .from('task_records')
      .select('*')
      .eq('task_id', taskId)
      .order('completed_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching records for task:', fetchError)
      return []
    }

    return data || []
  }, [])

  const getRecordsWithFilters = useCallback(async (filters: {
    startDate?: Date
    endDate?: Date
    taskId?: string
    flaggedOnly?: boolean
  }): Promise<TaskRecordWithTask[]> => {
    let query = supabase
      .from('task_records')
      .select('*, tasks(title, input_type)')
      .order('completed_at', { ascending: false })

    if (filters.startDate) {
      query = query.gte('completed_at', filters.startDate.toISOString())
    }

    if (filters.endDate) {
      const endOfDay = new Date(filters.endDate)
      endOfDay.setHours(23, 59, 59, 999)
      query = query.lte('completed_at', endOfDay.toISOString())
    }

    if (filters.taskId) {
      query = query.eq('task_id', filters.taskId)
    }

    if (filters.flaggedOnly) {
      query = query.eq('flagged', true)
    }

    const { data, error: fetchError } = await query

    if (fetchError) {
      console.error('Error fetching records:', fetchError)
      return []
    }

    return (data as TaskRecordWithTask[]) || []
  }, [])

  return {
    loading,
    error,
    createRecord,
    getTodaysRecords,
    getRecordsForTask,
    getRecordsWithFilters,
  }
}
