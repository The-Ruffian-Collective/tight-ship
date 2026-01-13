import { useState } from 'react'
import AppShell from '../../components/layout/AppShell'
import { useTasks } from '../../hooks/useTasks'
import { SEED_TASKS } from '../../lib/seedTasks'
import { formatRange } from '../../lib/validation'
import type { Task, InputType, Role, Schedule } from '../../types/database'

// Icons
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
)

const TasksIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
)

const LogIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const RocketIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const navItems = [
  { label: 'Dashboard', href: '/manager', icon: <DashboardIcon /> },
  { label: 'Tasks', href: '/manager/tasks', icon: <TasksIcon /> },
  { label: 'Compliance Log', href: '/manager/log', icon: <LogIcon /> },
]

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const INPUT_TYPE_LABELS: Record<InputType, string> = {
  text: 'Text',
  number: 'Number',
  boolean: 'Yes/No',
}

const INPUT_TYPE_COLORS: Record<InputType, string> = {
  text: 'bg-navy-100 text-navy-700',
  number: 'bg-maritime-100 text-maritime-700',
  boolean: 'bg-signal-100 text-signal-700',
}

interface TaskFormData {
  title: string
  description: string
  input_type: InputType
  schedule_type: 'daily' | 'weekly'
  schedule_time: string
  schedule_days: number[]
  range_min: string
  range_max: string
  assigned_role: Role
}

const defaultFormData: TaskFormData = {
  title: '',
  description: '',
  input_type: 'boolean',
  schedule_type: 'daily',
  schedule_time: '09:00',
  schedule_days: [1, 2, 3, 4, 5],
  range_min: '',
  range_max: '',
  assigned_role: 'staff',
}

function formatSchedule(schedule: Schedule): string {
  if (schedule.type === 'daily') {
    return `Daily at ${schedule.time}`
  }
  const dayNames = schedule.days.map((d) => DAYS_OF_WEEK[d]).join(', ')
  return `${dayNames} at ${schedule.time}`
}

export default function Tasks() {
  const { tasks, loading, createTask, updateTask, deleteTask, seedTasks } = useTasks()
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [formData, setFormData] = useState<TaskFormData>(defaultFormData)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [seeding, setSeeding] = useState(false)

  const openCreateModal = () => {
    setEditingTask(null)
    setFormData(defaultFormData)
    setFormError(null)
    setShowModal(true)
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      input_type: task.input_type,
      schedule_type: task.schedule.type,
      schedule_time: task.schedule.time,
      schedule_days: task.schedule.type === 'weekly' ? task.schedule.days : [1, 2, 3, 4, 5],
      range_min: task.range_min?.toString() || '',
      range_max: task.range_max?.toString() || '',
      assigned_role: task.assigned_role,
    })
    setFormError(null)
    setShowModal(true)
  }

  const openDeleteModal = (task: Task) => {
    setTaskToDelete(task)
    setShowDeleteModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.title.trim()) {
      setFormError('Title is required')
      return
    }

    setSubmitting(true)

    const schedule: Schedule =
      formData.schedule_type === 'daily'
        ? { type: 'daily', time: formData.schedule_time }
        : { type: 'weekly', days: formData.schedule_days, time: formData.schedule_time }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      input_type: formData.input_type,
      schedule,
      range_min: formData.range_min ? parseFloat(formData.range_min) : null,
      range_max: formData.range_max ? parseFloat(formData.range_max) : null,
      assigned_role: formData.assigned_role,
    }

    let result
    if (editingTask) {
      result = await updateTask(editingTask.id, taskData)
    } else {
      result = await createTask(taskData)
    }

    setSubmitting(false)

    if (result.error) {
      setFormError(result.error.message)
    } else {
      setShowModal(false)
    }
  }

  const handleDelete = async () => {
    if (!taskToDelete) return

    setSubmitting(true)
    const result = await deleteTask(taskToDelete.id)
    setSubmitting(false)

    if (result.error) {
      setFormError(result.error.message)
    } else {
      setShowDeleteModal(false)
      setTaskToDelete(null)
    }
  }

  const handleQuickStart = async () => {
    setSeeding(true)
    await seedTasks(SEED_TASKS)
    setSeeding(false)
  }

  const toggleDay = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      schedule_days: prev.schedule_days.includes(day)
        ? prev.schedule_days.filter((d) => d !== day)
        : [...prev.schedule_days, day].sort(),
    }))
  }

  return (
    <AppShell navItems={navItems}>
      <div className="max-w-4xl animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-navy-900 tracking-tight">
              Task Templates
            </h1>
            <p className="mt-1 text-navy-600">Create and manage recurring compliance tasks</p>
          </div>
          <button onClick={openCreateModal} className="btn-primary w-auto flex items-center justify-center gap-2">
            <PlusIcon />
            <span>Create Task</span>
          </button>
        </div>

        {/* Quick Start Banner */}
        {!loading && tasks.length === 0 && (
          <div className="mb-8 p-6 bg-gradient-to-r from-maritime-600 to-maritime-700 rounded-xl text-white animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <RocketIcon />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold mb-1">Quick Start</h3>
                <p className="text-maritime-100 text-sm">
                  Get up and running instantly with 8 standard HACCP compliance tasks. You can customise them later.
                </p>
              </div>
              <button
                onClick={handleQuickStart}
                disabled={seeding}
                className="w-full sm:w-auto py-3 px-6 bg-white text-maritime-700 font-display font-semibold uppercase tracking-wide rounded-lg hover:bg-maritime-50 transition-all disabled:opacity-50"
              >
                {seeding ? 'Setting up...' : 'Add Standard Tasks'}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-navy-200 border-t-navy-900 mx-auto" />
            <p className="mt-4 text-navy-600">Loading tasks...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && tasks.length === 0 && (
          <div className="card text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-navy-100 flex items-center justify-center mx-auto mb-4">
              <TasksIcon />
            </div>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">No tasks yet</h2>
            <p className="text-navy-600 max-w-md mx-auto">
              Create your first task template or use Quick Start to add standard HACCP tasks.
            </p>
          </div>
        )}

        {/* Task List */}
        {!loading && tasks.length > 0 && (
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="card hover:shadow-card-hover transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-display text-lg font-semibold text-navy-900">{task.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${INPUT_TYPE_COLORS[task.input_type]}`}>
                        {INPUT_TYPE_LABELS[task.input_type]}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-navy-100 text-navy-600">
                        {task.assigned_role}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-navy-600 text-sm mb-3">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-navy-500">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatSchedule(task.schedule)}
                      </span>
                      {task.input_type === 'number' && formatRange(task) && (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l4-4m0 0l4-4m-4 4V3" />
                          </svg>
                          Range: {formatRange(task)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-2.5 rounded-lg border-2 border-navy-200 text-navy-600 hover:border-navy-400 hover:bg-navy-50 transition-all"
                      title="Edit task"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => openDeleteModal(task)}
                      className="p-2.5 rounded-lg border-2 border-navy-200 text-signal-600 hover:border-signal-400 hover:bg-signal-50 transition-all"
                      title="Delete task"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl animate-fade-in max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-navy-100 px-6 py-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-navy-900">
                  {editingTask ? 'Edit Task' : 'Create Task'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-navy-100 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {formError && (
                  <div className="p-4 bg-signal-50 border-l-4 border-signal-500 text-signal-800 rounded-r-lg">
                    <p className="font-medium">{formError}</p>
                  </div>
                )}

                <div>
                  <label className="input-label">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Fridge temperature check"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field min-h-[80px] resize-none"
                    placeholder="Optional instructions for staff"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Input Type</label>
                    <select
                      value={formData.input_type}
                      onChange={(e) => setFormData({ ...formData, input_type: e.target.value as InputType })}
                      className="input-field"
                    >
                      <option value="boolean">Yes/No</option>
                      <option value="number">Number</option>
                      <option value="text">Text</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Assigned To</label>
                    <select
                      value={formData.assigned_role}
                      onChange={(e) => setFormData({ ...formData, assigned_role: e.target.value as Role })}
                      className="input-field"
                    >
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                </div>

                {formData.input_type === 'number' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Min Value</label>
                      <input
                        type="number"
                        step="any"
                        value={formData.range_min}
                        onChange={(e) => setFormData({ ...formData, range_min: e.target.value })}
                        className="input-field"
                        placeholder="e.g., 0"
                      />
                    </div>
                    <div>
                      <label className="input-label">Max Value</label>
                      <input
                        type="number"
                        step="any"
                        value={formData.range_max}
                        onChange={(e) => setFormData({ ...formData, range_max: e.target.value })}
                        className="input-field"
                        placeholder="e.g., 5"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Schedule</label>
                    <select
                      value={formData.schedule_type}
                      onChange={(e) => setFormData({ ...formData, schedule_type: e.target.value as 'daily' | 'weekly' })}
                      className="input-field"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Time</label>
                    <input
                      type="time"
                      value={formData.schedule_time}
                      onChange={(e) => setFormData({ ...formData, schedule_time: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                {formData.schedule_type === 'weekly' && (
                  <div>
                    <label className="input-label">Days</label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day, index) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(index)}
                          className={`w-12 h-10 rounded-lg font-display font-medium text-sm uppercase transition-all ${
                            formData.schedule_days.includes(index)
                              ? 'bg-navy-900 text-white'
                              : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn-primary flex-1">
                    {submitting ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && taskToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl animate-fade-in p-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-signal-100 flex items-center justify-center mx-auto mb-4">
                  <TrashIcon />
                </div>
                <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">Delete Task?</h2>
                <p className="text-navy-600 mb-6">
                  Are you sure you want to delete "{taskToDelete.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={submitting}
                    className="btn-signal flex-1"
                  >
                    {submitting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
