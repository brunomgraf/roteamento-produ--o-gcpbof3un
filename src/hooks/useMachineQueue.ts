import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getMachineQueue,
  updateStepStatus,
  type MachineQueueItem,
  type MachineQueueStatus,
} from '@/services/machineQueueService'
import { withRetry } from '@/lib/retry'
import { notify } from '@/lib/notify'

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
  const [rawItems, setRawItems] = useState<MachineQueueItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({})

  // Filters and search
  const [statusFilter, setStatusFilter] = useState<'todos' | MachineQueueStatus>('todos')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('')

  const setStatusFilterCallback = useCallback((filter: 'todos' | MachineQueueStatus) => {
    setStatusFilter(filter)
  }, [])

  const setSearchQueryCallback = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

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
      const data = await withRetry(() => getMachineQueue(machineType), {
        maxRetries: 3,
        delays: [1000, 2000, 4000],
      })
      const sorted = [...data].sort((a, b) => a.stepOrder - b.stepOrder)
      setRawItems(sorted)
    } catch (err: any) {
      console.error('Falha ao carregar fila de produção após 3 tentativas:', err)
      setError(err instanceof Error ? err : new Error('Erro ao carregar fila'))
      notify.error('Erro ao carregar fila', {
        description:
          'Não foi possível buscar as ordens de serviço da máquina após várias tentativas. Verifique sua conexão.',
      })
    } finally {
      setLoading(false)
    }
  }, [machineType])

  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  // Update status with optimistic UI and revert on failure wrapped in useCallback for performance
  const handleUpdateStatus = useCallback(
    async (stepId: string, newStatus: MachineQueueStatus): Promise<boolean> => {
      let previousStatus: MachineQueueStatus | undefined
      let previousItemName = ''

      setRawItems((prev) => {
        const found = prev.find((item) => item.id === stepId)
        if (found) {
          previousStatus = found.status
          previousItemName = found.itemName
        }
        return prev.map((item) => (item.id === stepId ? { ...item, status: newStatus } : item))
      })

      setUpdatingIds((prev) => ({ ...prev, [stepId]: true }))

      try {
        await withRetry(() => updateStepStatus(stepId, newStatus), {
          maxRetries: 3,
          delays: [1000, 2000, 4000],
        })

        const statusLabels: Record<MachineQueueStatus, string> = {
          aguardando: 'Aguardando',
          em_andamento: 'Em Andamento',
          concluido: 'Concluído',
        }

        notify.success('Status atualizado com sucesso!', {
          description: `Serviço "${previousItemName || 'peça'}" alterado para ${statusLabels[newStatus]}.`,
        })
        return true
      } catch (err: any) {
        console.error('Erro ao atualizar status da etapa após retries:', err)
        if (previousStatus) {
          const revertedStatus = previousStatus
          setRawItems((prev) =>
            prev.map((item) => (item.id === stepId ? { ...item, status: revertedStatus } : item)),
          )
        }
        notify.error('Erro ao atualizar status', {
          description:
            'Houve uma falha ao comunicar com o servidor após 3 tentativas. A alteração foi revertida.',
        })
        return false
      } finally {
        setUpdatingIds((prev) => {
          const next = { ...prev }
          delete next[stepId]
          return next
        })
      }
    },
    [],
  )

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
    setStatusFilter: setStatusFilterCallback,
    searchQuery,
    setSearchQuery: setSearchQueryCallback,
    debouncedSearchQuery,
    stats,
  }
}
