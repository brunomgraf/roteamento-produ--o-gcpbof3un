import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getMachineQueue,
  updateStepStatus,
  type MachineQueueItem,
  type MachineQueueStatus,
} from '@/services/machineQueueService'
import { useToast } from '@/hooks/use-toast'

export interface UseMachineQueueReturn {
  items: MachineQueueItem[]
  rawItems: MachineQueueItem[]
  loading: boolean
  error: Error | null
  updatingIds: Record<string, boolean>
  refresh: () => Promise<void>
  handleUpdateStatus: (itemId: string, newStatus: MachineQueueStatus) => Promise<boolean>
  statusFilter: 'todos' | MachineQueueStatus
  setStatusFilter: (filter: 'todos' | MachineQueueStatus) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  debouncedSearchQuery: string
  stats: {
    total: number
    aguardando: number
    emAndamento: number
    concluido: number
  }
}

export function useMachineQueue(machineType: string): UseMachineQueueReturn {
  const { toast } = useToast()
  const [rawItems, setRawItems] = useState<MachineQueueItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({})

  // Filters and search
  const [statusFilter, setStatusFilter] = useState<'todos' | MachineQueueStatus>('todos')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('')

  // Debounce search query by 300ms
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current)
    }
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current)
      }
    }
  }, [searchQuery])

  // Fetch queue items
  const fetchQueue = useCallback(async () => {
    if (!machineType) return
    setLoading(true)
    setError(null)
    try {
      const data = await getMachineQueue(machineType)
      const sorted = [...data].sort((a, b) => a.stepOrder - b.stepOrder)
      setRawItems(sorted)
    } catch (err: any) {
      console.error('Falha ao carregar fila de produção:', err)
      setError(err instanceof Error ? err : new Error('Erro ao carregar fila'))
      toast({
        title: 'Erro ao carregar fila',
        description: 'Não foi possível buscar as ordens de serviço da máquina. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [machineType, toast])

  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  // Update status with optimistic UI and revert on failure
  const handleUpdateStatus = async (
    stepId: string,
    newStatus: MachineQueueStatus,
  ): Promise<boolean> => {
    const previousItem = rawItems.find((item) => item.id === stepId)
    if (!previousItem) return false
    const previousStatus = previousItem.status

    setUpdatingIds((prev) => ({ ...prev, [stepId]: true }))

    setRawItems((prev) =>
      prev.map((item) => (item.id === stepId ? { ...item, status: newStatus } : item)),
    )

    try {
      await updateStepStatus(stepId, newStatus)

      const statusLabels: Record<MachineQueueStatus, string> = {
        aguardando: 'Aguardando',
        em_andamento: 'Em Andamento',
        concluido: 'Concluído',
      }

      toast({
        title: 'Status atualizado',
        description: `Serviço "${previousItem.itemName}" alterado para ${statusLabels[newStatus]}.`,
      })
      return true
    } catch (err: any) {
      console.error('Erro ao atualizar status da etapa:', err)
      setRawItems((prev) =>
        prev.map((item) => (item.id === stepId ? { ...item, status: previousStatus } : item)),
      )
      toast({
        title: 'Erro ao atualizar status',
        description: 'Houve uma falha ao comunicar com o servidor. A alteração foi revertida.',
        variant: 'destructive',
      })
      return false
    } finally {
      setUpdatingIds((prev) => {
        const next = { ...prev }
        delete next[stepId]
        return next
      })
    }
  }

  const stats = {
    total: rawItems.length,
    aguardando: rawItems.filter((i) => i.status === 'aguardando').length,
    emAndamento: rawItems.filter((i) => i.status === 'em_andamento').length,
    concluido: rawItems.filter((i) => i.status === 'concluido').length,
  }

  const filteredItems = rawItems.filter((item) => {
    if (statusFilter !== 'todos' && item.status !== statusFilter) {
      return false
    }
    if (debouncedSearchQuery.trim() !== '') {
      const q = debouncedSearchQuery.toLowerCase().trim()
      const matchName = item.itemName.toLowerCase().includes(q)
      const matchDesc = item.description.toLowerCase().includes(q)
      if (!matchName && !matchDesc) {
        return false
      }
    }
    return true
  })

  return {
    items: filteredItems,
    rawItems,
    loading,
    error,
    updatingIds,
    refresh: fetchQueue,
    handleUpdateStatus,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    stats,
  }
}
