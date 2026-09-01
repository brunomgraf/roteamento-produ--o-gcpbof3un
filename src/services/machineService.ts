import pb from '@/lib/pocketbase/client'
import type { Machine, CreateMachineInput, UpdateMachineInput } from '@/types/machine'

/**
 * Fallback initial machines if database is empty or running offline without auth
 */
export const DEFAULT_FALLBACK_MACHINES: Machine[] = [
  {
    id: 'fallback-torno',
    name: 'Torno',
    slug: 'torno',
    icon: 'Cog',
    color: 'blue',
    active: true,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
  {
    id: 'fallback-fresa',
    name: 'Fresa',
    slug: 'fresa',
    icon: 'Layers',
    color: 'amber',
    active: true,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
  {
    id: 'fallback-cnc',
    name: 'CNC',
    slug: 'cnc',
    icon: 'Cpu',
    color: 'violet',
    active: true,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
  {
    id: 'fallback-retifica',
    name: 'Retífica',
    slug: 'retifica',
    icon: 'Gauge',
    color: 'green',
    active: true,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
]

/**
 * Fetch all machines ordered by created asc.
 */
export async function getMachines(): Promise<Machine[]> {
  const records = await pb.collection('machines').getFullList<Machine>({
    sort: '+created',
  })
  return records
}

/**
 * Create a new machine record in PocketBase.
 */
export async function createMachine(input: CreateMachineInput): Promise<Machine> {
  const payload: Record<string, any> = {
    name: input.name.trim(),
    slug: input.slug.trim(),
    icon: input.icon || 'Cog',
    color: input.color || 'blue',
    active: input.active !== undefined ? input.active : true,
  }

  // If user is authenticated, attach user_id
  if (pb.authStore.record?.id) {
    payload.user_id = pb.authStore.record.id
  }

  const record = await pb.collection('machines').create<Machine>(payload)
  return record
}

/**
 * Update an existing machine in PocketBase.
 */
export async function updateMachine(id: string, input: UpdateMachineInput): Promise<Machine> {
  const payload: Record<string, any> = {}
  if (input.name !== undefined) payload.name = input.name.trim()
  if (input.slug !== undefined) payload.slug = input.slug.trim()
  if (input.icon !== undefined) payload.icon = input.icon
  if (input.color !== undefined) payload.color = input.color
  if (input.active !== undefined) payload.active = input.active

  const record = await pb.collection('machines').update<Machine>(id, payload)
  return record
}

/**
 * Delete a machine record in PocketBase.
 */
export async function deleteMachine(id: string): Promise<boolean> {
  await pb.collection('machines').delete(id)
  return true
}
