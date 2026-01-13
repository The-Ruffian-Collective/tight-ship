import type { InputType, Role, Schedule } from '../types/database'

interface SeedTask {
  title: string
  description: string
  input_type: InputType
  schedule: Schedule
  range_min: number | null
  range_max: number | null
  assigned_role: Role
}

export const SEED_TASKS: SeedTask[] = [
  {
    title: 'Fridge temperature check',
    description: 'Check and record the main fridge temperature. Should be between 0-5°C.',
    input_type: 'number',
    schedule: { type: 'daily', time: '09:00' },
    range_min: 0,
    range_max: 5,
    assigned_role: 'staff',
  },
  {
    title: 'Freezer temperature check',
    description: 'Check and record the freezer temperature. Should be between -22°C and -18°C.',
    input_type: 'number',
    schedule: { type: 'daily', time: '09:00' },
    range_min: -22,
    range_max: -18,
    assigned_role: 'staff',
  },
  {
    title: 'Hot hold temperature check',
    description: 'Check hot held food is above 63°C. Record the temperature.',
    input_type: 'number',
    schedule: { type: 'daily', time: '12:00' },
    range_min: 63,
    range_max: 100,
    assigned_role: 'staff',
  },
  {
    title: 'Delivery inspection',
    description: 'Inspect all deliveries for damage, temperature, and best before dates.',
    input_type: 'boolean',
    schedule: { type: 'daily', time: '07:00' },
    range_min: null,
    range_max: null,
    assigned_role: 'staff',
  },
  {
    title: 'Handwash station stocked',
    description: 'Ensure handwash stations have soap, paper towels, and sanitiser.',
    input_type: 'boolean',
    schedule: { type: 'daily', time: '08:00' },
    range_min: null,
    range_max: null,
    assigned_role: 'staff',
  },
  {
    title: 'Cleaning checklist complete',
    description: 'Confirm all cleaning tasks for the day have been completed.',
    input_type: 'boolean',
    schedule: { type: 'daily', time: '22:00' },
    range_min: null,
    range_max: null,
    assigned_role: 'staff',
  },
  {
    title: 'Allergen labels checked',
    description: 'Verify all food items are correctly labelled with allergen information.',
    input_type: 'boolean',
    schedule: { type: 'daily', time: '10:00' },
    range_min: null,
    range_max: null,
    assigned_role: 'staff',
  },
  {
    title: 'Waste disposal completed',
    description: 'Confirm all waste has been properly disposed of and bins are clean.',
    input_type: 'boolean',
    schedule: { type: 'daily', time: '22:00' },
    range_min: null,
    range_max: null,
    assigned_role: 'staff',
  },
]
