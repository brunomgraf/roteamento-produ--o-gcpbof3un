export type MachineColor =
  | 'blue'
  | 'amber'
  | 'violet'
  | 'green'
  | 'red'
  | 'orange'
  | 'pink'
  | 'cyan'

export interface Machine {
  id: string
  user_id?: string
  name: string
  slug: string
  icon?: string
  color?: MachineColor | string
  active: boolean
  created?: string
  updated?: string
}

export interface CreateMachineInput {
  name: string
  slug: string
  icon?: string
  color?: MachineColor | string
  active?: boolean
}

export interface UpdateMachineInput {
  name?: string
  slug?: string
  icon?: string
  color?: MachineColor | string
  active?: boolean
}

export const MACHINE_COLORS: {
  value: MachineColor
  label: string
  bgClass: string
  textClass: string
  borderClass: string
}[] = [
  {
    value: 'blue',
    label: 'Azul',
    bgClass: 'bg-blue-500/10 dark:bg-blue-500/20',
    textClass: 'text-blue-600 dark:text-blue-400',
    borderClass: 'border-blue-500/30',
  },
  {
    value: 'amber',
    label: 'Âmbar',
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/20',
    textClass: 'text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-500/30',
  },
  {
    value: 'violet',
    label: 'Violeta',
    bgClass: 'bg-violet-500/10 dark:bg-violet-500/20',
    textClass: 'text-violet-600 dark:text-violet-400',
    borderClass: 'border-violet-500/30',
  },
  {
    value: 'green',
    label: 'Verde',
    bgClass: 'bg-green-500/10 dark:bg-green-500/20',
    textClass: 'text-green-600 dark:text-green-400',
    borderClass: 'border-green-500/30',
  },
  {
    value: 'red',
    label: 'Vermelho',
    bgClass: 'bg-red-500/10 dark:bg-red-500/20',
    textClass: 'text-red-600 dark:text-red-400',
    borderClass: 'border-red-500/30',
  },
  {
    value: 'orange',
    label: 'Laranja',
    bgClass: 'bg-orange-500/10 dark:bg-orange-500/20',
    textClass: 'text-orange-600 dark:text-orange-400',
    borderClass: 'border-orange-500/30',
  },
  {
    value: 'pink',
    label: 'Rosa',
    bgClass: 'bg-pink-500/10 dark:bg-pink-500/20',
    textClass: 'text-pink-600 dark:text-pink-400',
    borderClass: 'border-pink-500/30',
  },
  {
    value: 'cyan',
    label: 'Ciano',
    bgClass: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    textClass: 'text-cyan-600 dark:text-cyan-400',
    borderClass: 'border-cyan-500/30',
  },
]

/**
 * Auto-generate slug from name:
 * Lowercase, remove accents, replace spaces and special characters with dashes
 */
export function generateSlug(name: string): string {
  if (!name) return ''
  return name
    .normalize('NFD') // decompose accented letters into base letter + combining mark
    .replace(/[\u0300-\u036f]/g, '') // remove combining marks (accents)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/[\s_]+/g, '-') // replace spaces & underscores with dashes
    .replace(/-+/g, '-') // collapse consecutive dashes
    .replace(/^-+|-+$/g, '') // trim leading/trailing dashes
}
