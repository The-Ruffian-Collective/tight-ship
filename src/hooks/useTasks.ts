import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { Task, Schedule, InputType, Role } from '../types/database'

interface CreateTaskInput {
  title: string
  description?: string
  input_type: InputType
  schedule: Schedule
  range_min?: number | null
  range_max?: number | null
  assigned_role: Role
}

interface UpdateTaskInput extends Partial<CreateTaskInput> {
  is_active?: boolean
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { organisation } = useAuth()

  const fetchTasks = useCallback(async () => {
    if (!organisation?.id) return

    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('organisation_id', organisation.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }, [organisation?.id])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = async (input: CreateTaskInput): Promise<{ error: Error | null }> => {
    if (!organisation?.id) {
      return { error: new Error('No organisation found') }
    }

    const { error: insertError } = await supabase
      .from('tasks')
      .insert({
        organisation_id: organisation.id,
        title: input.title,
        description: input.description || null,
        input_type: input.input_type,
        schedule: input.schedule,
        range_min: input.range_min ?? null,
        range_max: input.range_max ?? null,
        assigned_role: input.assigned_role,
      })

    if (insertError) {
      return { error: insertError }
    }

    await fetchTasks()
    return { error: null }
  }

  const updateTask = async (
    taskId: string,
    input: UpdateTaskInput
  ): Promise<{ error: Error | null }> => {
    const { error: updateError } = await supabase
      .from('tasks')
      .update(input)
      .eq('id', taskId)

    if (updateError) {
      return { error: updateError }
    }

    await fetchTasks()
    return { error: null }
  }

  const deleteTask = async (taskId: string): Promise<{ error: Error | null }> => {
    // Soft delete by setting is_active to false
    const { error: deleteError } = await supabase
      .from('tasks')
      .update({ is_active: false })
      .eq('id', taskId)

    if (deleteError) {
      return { error: deleteError }
    }

    await fetchTasks()
    return { error: null }
  }

  const seedTasks = async (seedData: CreateTaskInput[]): Promise<{ error: Error | null }> => {
    if (!organisation?.id) {
      return { error: new Error('No organisation found') }
    }

    const tasksToInsert = seedData.map((task) => ({
      organisation_id: organisation.id,
      title: task.title,
      description: task.description || null,
      input_type: task.input_type,
      schedule: task.schedule,
      range_min: task.range_min ?? null,
      range_max: task.range_max ?? null,
      assigned_role: task.assigned_role,
    }))

    const { error: insertError } = await supabase
      .from('tasks')
      .insert(tasksToInsert)

    if (insertError) {
      return { error: insertError }
    }

    await fetchTasks()
    return { error: null }
  }

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    seedTasks,
    refetch: fetchTasks,
  }
}
