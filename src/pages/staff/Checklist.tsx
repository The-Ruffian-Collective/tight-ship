import { useState, useEffect, useMemo } from 'react'
import AppShell from '../../components/layout/AppShell'
import { useTasks } from '../../hooks/useTasks'
import { useTaskRecords } from '../../hooks/useTaskRecords'
import { validateTaskSubmission, isTaskDueToday, formatRange } from '../../lib/validation'
import type { Task, TaskRecord } from '../../types/database'

// Icons
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
)

const ChecklistIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const PartyIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

const navItems = [
  { label: 'Dashboard', href: '/staff', icon: <DashboardIcon /> },
  { label: 'Checklist', href: '/staff/checklist', icon: <ChecklistIcon /> },
]

interface TaskInputState {
  text: string
  number: string
  boolean: boolean | null
  comment: string
}

const defaultInputState: TaskInputState = {
  text: '',
  number: '',
  boolean: null,
  comment: '',
}

export default function Checklist() {
  const { tasks, loading: tasksLoading } = useTasks()
  const { createRecord, getTodaysRecords, loading: recordLoading } = useTaskRecords()
  const [todaysRecords, setTodaysRecords] = useState<TaskRecord[]>([])
  const [loadingRecords, setLoadingRecords] = useState(true)
  const [inputStates, setInputStates] = useState<Record<string, TaskInputState>>({})
  const [submittingTask, setSubmittingTask] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showCompleted, setShowCompleted] = useState(false)

  // Fetch today's records
  useEffect(() => {
    const fetchRecords = async () => {
      setLoadingRecords(true)
      const records = await getTodaysRecords()
      setTodaysRecords(records)
      setLoadingRecords(false)
    }
    fetchRecords()
  }, [getTodaysRecords])

  // Filter tasks due today for staff
  const todaysTasks = useMemo(() => {
    return tasks.filter((task) => task.assigned_role === 'staff' && isTaskDueToday(task))
  }, [tasks])

  // Separate into completed and pending
  const completedTaskIds = useMemo(() => {
    return new Set(todaysRecords.map((r) => r.task_id))
  }, [todaysRecords])

  const pendingTasks = useMemo(() => {
    return todaysTasks.filter((task) => !completedTaskIds.has(task.id))
  }, [todaysTasks, completedTaskIds])

  const completedTasks = useMemo(() => {
    return todaysTasks.filter((task) => completedTaskIds.has(task.id))
  }, [todaysTasks, completedTaskIds])

  // Initialize input states for new tasks
  useEffect(() => {
    const newStates: Record<string, TaskInputState> = {}
    pendingTasks.forEach((task) => {
      if (!inputStates[task.id]) {
        newStates[task.id] = { ...defaultInputState }
      }
    })
    if (Object.keys(newStates).length > 0) {
      setInputStates((prev) => ({ ...prev, ...newStates }))
    }
  }, [pendingTasks, inputStates])

  const updateInput = (taskId: string, field: keyof TaskInputState, value: string | boolean | null) => {
    setInputStates((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], [field]: value },
    }))
    // Clear error when user interacts
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[taskId]
      return newErrors
    })
  }

  const handleSubmit = async (task: Task) => {
    const input = inputStates[task.id]
    if (!input) return

    // Validate based on input type
    const value = {
      text: task.input_type === 'text' ? input.text : undefined,
      number: task.input_type === 'number' ? parseFloat(input.number) : undefined,
      boolean: task.input_type === 'boolean' ? input.boolean ?? undefined : undefined,
    }

    const validation = validateTaskSubmission(task, value)

    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, [task.id]: validation.message || 'Invalid input' }))
      return
    }

    if (validation.shouldFlag && !input.comment.trim()) {
      setErrors((prev) => ({ ...prev, [task.id]: validation.message || 'Comment required' }))
      return
    }

    setSubmittingTask(task.id)

    const result = await createRecord({
      task_id: task.id,
      value_text: task.input_type === 'text' ? input.text : null,
      value_number: task.input_type === 'number' ? parseFloat(input.number) : null,
      value_boolean: task.input_type === 'boolean' ? input.boolean : null,
      flagged: validation.shouldFlag,
      flag_comment: validation.shouldFlag ? input.comment : null,
    })

    setSubmittingTask(null)

    if (result.error) {
      setErrors((prev) => ({ ...prev, [task.id]: result.error?.message || 'Failed to submit' }))
    } else {
      // Refresh records
      const records = await getTodaysRecords()
      setTodaysRecords(records)
      // Clear input state
      setInputStates((prev) => {
        const newStates = { ...prev }
        delete newStates[task.id]
        return newStates
      })
    }
  }

  const getValidationState = (task: Task): { shouldFlag: boolean; message: string | null } => {
    const input = inputStates[task.id]
    if (!input) return { shouldFlag: false, message: null }

    const value = {
      text: task.input_type === 'text' ? input.text : undefined,
      number: task.input_type === 'number' && input.number ? parseFloat(input.number) : undefined,
      boolean: task.input_type === 'boolean' ? input.boolean ?? undefined : undefined,
    }

    // Only validate if there's a value
    if (
      (task.input_type === 'text' && !input.text) ||
      (task.input_type === 'number' && !input.number) ||
      (task.input_type === 'boolean' && input.boolean === null)
    ) {
      return { shouldFlag: false, message: null }
    }

    const validation = validateTaskSubmission(task, value)
    return { shouldFlag: validation.shouldFlag, message: validation.shouldFlag ? validation.message || null : null }
  }

  const loading = tasksLoading || loadingRecords

  // Format today's date
  const today = new Date()
  const dateString = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <AppShell navItems={navItems}>
      <div className="max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-navy-900 tracking-tight">
            Today's Checklist
          </h1>
          <p className="mt-1 text-navy-600">{dateString}</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-navy-200 border-t-navy-900 mx-auto" />
            <p className="mt-4 text-navy-600">Loading your tasks...</p>
          </div>
        )}

        {/* All Done State */}
        {!loading && pendingTasks.length === 0 && completedTasks.length > 0 && (
          <div className="card text-center py-12 mb-6 bg-gradient-to-br from-maritime-50 to-white border-maritime-200">
            <div className="w-20 h-20 rounded-full bg-maritime-100 flex items-center justify-center mx-auto mb-4 text-maritime-600">
              <PartyIcon />
            </div>
            <h2 className="font-display text-2xl font-bold text-maritime-800 mb-2">All caught up!</h2>
            <p className="text-maritime-600 max-w-sm mx-auto">
              You've completed all your tasks for today. Great work keeping the ship tight!
            </p>
          </div>
        )}

        {/* No Tasks State */}
        {!loading && todaysTasks.length === 0 && (
          <div className="card text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-navy-100 flex items-center justify-center mx-auto mb-4">
              <ChecklistIcon />
            </div>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">No tasks today</h2>
            <p className="text-navy-600 max-w-md mx-auto">
              There are no tasks scheduled for today. Check back tomorrow or ask your manager.
            </p>
          </div>
        )}

        {/* Pending Tasks */}
        {!loading && pendingTasks.length > 0 && (
          <div className="space-y-4 mb-8">
            {pendingTasks.map((task, index) => {
              const input = inputStates[task.id] || defaultInputState
              const validationState = getValidationState(task)
              const error = errors[task.id]
              const isSubmitting = submittingTask === task.id

              return (
                <div
                  key={task.id}
                  className="card animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="mb-4">
                    <h3 className="font-display text-lg font-semibold text-navy-900">{task.title}</h3>
                    {task.description && (
                      <p className="text-navy-600 text-sm mt-1">{task.description}</p>
                    )}
                  </div>

                  {/* Dynamic Input */}
                  <div className="space-y-4">
                    {task.input_type === 'text' && (
                      <textarea
                        value={input.text}
                        onChange={(e) => updateInput(task.id, 'text', e.target.value)}
                        className="input-field min-h-[100px] resize-none"
                        placeholder="Enter your response..."
                        disabled={isSubmitting}
                      />
                    )}

                    {task.input_type === 'number' && (
                      <div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            step="any"
                            value={input.number}
                            onChange={(e) => updateInput(task.id, 'number', e.target.value)}
                            className="input-field flex-1"
                            placeholder="Enter value"
                            disabled={isSubmitting}
                          />
                          {formatRange(task) && (
                            <span className="text-sm text-navy-500 whitespace-nowrap">
                              Range: <span className="font-semibold text-navy-700">{formatRange(task)}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {task.input_type === 'boolean' && (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => updateInput(task.id, 'boolean', true)}
                          disabled={isSubmitting}
                          className={`flex-1 py-4 rounded-xl font-display font-semibold text-lg uppercase tracking-wide transition-all ${
                            input.boolean === true
                              ? 'bg-maritime-600 text-white shadow-lg'
                              : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updateInput(task.id, 'boolean', false)}
                          disabled={isSubmitting}
                          className={`flex-1 py-4 rounded-xl font-display font-semibold text-lg uppercase tracking-wide transition-all ${
                            input.boolean === false
                              ? 'bg-signal-500 text-white shadow-lg'
                              : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    )}

                    {/* Flag Warning + Comment */}
                    {validationState.shouldFlag && (
                      <div className="p-4 bg-signal-50 border-l-4 border-signal-500 rounded-r-lg animate-fade-in">
                        <p className="text-signal-800 text-sm font-medium mb-3">{validationState.message}</p>
                        <textarea
                          value={input.comment}
                          onChange={(e) => updateInput(task.id, 'comment', e.target.value)}
                          className="input-field min-h-[80px] resize-none border-signal-300 focus:border-signal-500"
                          placeholder="Explain the situation..."
                          disabled={isSubmitting}
                        />
                      </div>
                    )}

                    {/* Error Display */}
                    {error && (
                      <p className="text-signal-600 text-sm font-medium">{error}</p>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={() => handleSubmit(task)}
                      disabled={isSubmitting || recordLoading}
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <CheckIcon />
                          <span>Submit</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Completed Tasks */}
        {!loading && completedTasks.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full flex items-center justify-between p-4 bg-navy-100 rounded-xl hover:bg-navy-200 transition-colors"
            >
              <span className="font-display font-semibold text-navy-700">
                Completed today ({completedTasks.length})
              </span>
              <ChevronDownIcon />
            </button>

            {showCompleted && (
              <div className="mt-4 space-y-3 animate-fade-in">
                {completedTasks.map((task) => {
                  const record = todaysRecords.find((r) => r.task_id === task.id)
                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border-2 ${
                        record?.flagged
                          ? 'bg-signal-50 border-signal-200'
                          : 'bg-maritime-50 border-maritime-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            record?.flagged ? 'bg-signal-200 text-signal-700' : 'bg-maritime-200 text-maritime-700'
                          }`}
                        >
                          <CheckIcon />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-semibold text-navy-900">{task.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                            <span className="text-navy-600">
                              {task.input_type === 'boolean' && (
                                <span className={record?.value_boolean ? 'text-maritime-700' : 'text-signal-700'}>
                                  {record?.value_boolean ? 'Yes' : 'No'}
                                </span>
                              )}
                              {task.input_type === 'number' && (
                                <span>{record?.value_number}</span>
                              )}
                              {task.input_type === 'text' && (
                                <span className="truncate max-w-[200px]">{record?.value_text}</span>
                              )}
                            </span>
                            {record?.flagged && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase bg-signal-200 text-signal-800">
                                Flagged
                              </span>
                            )}
                          </div>
                          {record?.flag_comment && (
                            <p className="mt-2 text-sm text-navy-600 italic">"{record.flag_comment}"</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}
