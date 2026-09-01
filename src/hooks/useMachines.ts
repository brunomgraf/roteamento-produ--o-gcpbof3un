import { useState, useEffect, useCallback } from 'react'
import { notify } from '@/lib/notify'
import { getMachines, createMachine, updateMachine, deleteMachine } from '@/services/machineService'
import type { Machine, CreateMachineInput, UpdateMachineInput } from '@/types/machine'

export interface UseMachinesReturn {
  machines: Machine[]
  loading: boolean
  error: string | null
  saving: boolean
  deletingId: string | null
  fetchMachines: () => Promise<void>
  handleCreateMachine: (input: CreateMachineInput) => Promise<Machine | null>
  handleUpdateMachine: (id: string, input: UpdateMachineInput) => Promise<Machine | null>
  handleDeleteMachine: (id: string) => Promise<boolean>
}

export function useMachines(): UseMachinesReturn {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchMachines = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMachines()
      setMachines(data)
    } catch (err: any) {
      console.error('Error fetching machines:', err)
      const message = err?.message || 'Erro ao carregar máquinas da produção.'
      setError(message)
      notify.error('Erro ao carregar máquinas', {
        description: 'Não foi possível buscar as estações de trabalho. Tente novamente.',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMachines()
  }, [fetchMachines])

  const handleCreateMachine = useCallback(
    async (input: CreateMachineInput): Promise<Machine | null> => {
      setSaving(true)
      try {
        const created = await createMachine(input)
        notify.success('Máquina cadastrada!')
        await fetchMachines()
        return created
      } catch (err: any) {
        console.error('Error creating machine:', err)
        const errorCode =
          err?.status ??
          err?.code ??
          err?.statusCode ??
          err?.response?.code ??
          err?.response?.status ??
          err?.name ??
          'UNKNOWN'
        let errorDetail = err?.message || 'Verifique os dados informados.'
        if (err?.data?.data?.slug?.message || err?.message?.includes('slug')) {
          errorDetail = 'Já existe uma máquina com este identificador (slug).'
        }
        notify.error(`Erro ao cadastrar maquina. Codigo: ${errorCode}`, {
          description: errorDetail,
        })
        return null
      } finally {
        setSaving(false)
      }
    },
    [fetchMachines],
  )

  const handleUpdateMachine = useCallback(
    async (id: string, input: UpdateMachineInput): Promise<Machine | null> => {
      setSaving(true)
      try {
        const updated = await updateMachine(id, input)
        notify.success('Máquina atualizada!')
        await fetchMachines()
        return updated
      } catch (err: any) {
        console.error('Error updating machine:', err)
        let errorDetail = err?.message || 'Verifique as alterações.'
        if (err?.data?.data?.slug?.message || err?.message?.includes('slug')) {
          errorDetail = 'Já existe uma máquina com este identificador (slug).'
        }
        notify.error('Erro ao atualizar máquina', {
          description: errorDetail,
        })
        return null
      } finally {
        setSaving(false)
      }
    },
    [fetchMachines],
  )

  const handleDeleteMachine = useCallback(
    async (id: string): Promise<boolean> => {
      setDeletingId(id)
      try {
        await deleteMachine(id)
        notify.success('Máquina excluída!')
        await fetchMachines()
        return true
      } catch (err: any) {
        console.error('Error deleting machine:', err)
        notify.error('Erro ao excluir máquina', {
          description: err?.message || 'Não foi possível remover a estação.',
        })
        return false
      } finally {
        setDeletingId(null)
      }
    },
    [fetchMachines],
  )

  return {
    machines,
    loading,
    error,
    saving,
    deletingId,
    fetchMachines,
    handleCreateMachine,
    handleUpdateMachine,
    handleDeleteMachine,
  }
}
