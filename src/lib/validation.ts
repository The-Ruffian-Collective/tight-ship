import type { Task } from '../types/database'

interface ValidationResult {
  isValid: boolean
  shouldFlag: boolean
  message?: string
}

/**
 * Validates a task submission and determines if it should be flagged
 */
export function validateTaskSubmission(
  task: Task,
  value: {
    text?: string
    number?: number
    boolean?: boolean
  }
): ValidationResult {
  switch (task.input_type) {
    case 'number': {
      if (value.number === undefined || value.number === null) {
        return {
          isValid: false,
          shouldFlag: false,
          message: 'Please enter a number',
        }
      }

      const num = value.number
      const hasRange = task.range_min !== null || task.range_max !== null

      if (hasRange) {
        const belowMin = task.range_min !== null && num < task.range_min
        const aboveMax = task.range_max !== null && num > task.range_max

        if (belowMin || aboveMax) {
          let rangeStr = ''
          if (task.range_min !== null && task.range_max !== null) {
            rangeStr = `${task.range_min} to ${task.range_max}`
          } else if (task.range_min !== null) {
            rangeStr = `at least ${task.range_min}`
          } else if (task.range_max !== null) {
            rangeStr = `at most ${task.range_max}`
          }

          return {
            isValid: true,
            shouldFlag: true,
            message: `Value ${num} is outside the acceptable range (${rangeStr}). Please add a comment explaining the situation.`,
          }
        }
      }

      return { isValid: true, shouldFlag: false }
    }

    case 'boolean': {
      if (value.boolean === undefined || value.boolean === null) {
        return {
          isValid: false,
          shouldFlag: false,
          message: 'Please select Yes or No',
        }
      }

      if (value.boolean === false) {
        return {
          isValid: true,
          shouldFlag: true,
          message: 'You selected "No". Please add a comment explaining why.',
        }
      }

      return { isValid: true, shouldFlag: false }
    }

    case 'text': {
      if (!value.text || value.text.trim() === '') {
        return {
          isValid: false,
          shouldFlag: false,
          message: 'Please enter a response',
        }
      }

      return { isValid: true, shouldFlag: false }
    }

    default:
      return { isValid: true, shouldFlag: false }
  }
}

/**
 * Formats the range display for a number task
 */
export function formatRange(task: Task): string | null {
  if (task.input_type !== 'number') return null
  if (task.range_min === null && task.range_max === null) return null

  if (task.range_min !== null && task.range_max !== null) {
    return `${task.range_min} to ${task.range_max}`
  } else if (task.range_min !== null) {
    return `≥ ${task.range_min}`
  } else if (task.range_max !== null) {
    return `≤ ${task.range_max}`
  }

  return null
}

/**
 * Checks if a task is due today based on its schedule
 */
export function isTaskDueToday(task: Task): boolean {
  const schedule = task.schedule
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday, 6 = Saturday

  if (schedule.type === 'daily') {
    return true
  }

  if (schedule.type === 'weekly') {
    return schedule.days.includes(dayOfWeek)
  }

  return false
}

/**
 * Gets the scheduled time for a task as a Date object for today
 */
export function getScheduledTimeToday(task: Task): Date {
  const schedule = task.schedule
  const [hours, minutes] = schedule.time.split(':').map(Number)

  const scheduledTime = new Date()
  scheduledTime.setHours(hours ?? 0, minutes ?? 0, 0, 0)

  return scheduledTime
}

/**
 * Checks if a task is overdue (past its scheduled time with no completion today)
 */
export function isTaskOverdue(task: Task, completedToday: boolean): boolean {
  if (completedToday) return false
  if (!isTaskDueToday(task)) return false

  const now = new Date()
  const scheduledTime = getScheduledTimeToday(task)

  return now > scheduledTime
}
