import { useState, useCallback } from 'react'
import { createItemWithRouting, type CreateItemPayload } from '@/services/itemService'
import type { ItemRecord } from '@/types/routing'
import { withRetry } from '@/lib/retry'
import { notify } from '@/lib/notify'

export interface UseItemRegistrationReturn {
  isSaving: boolean
  error: string | null
  saveItem: (payload: CreateItemPayload) => Promise<ItemRecord | null>
}

export function useItemRegistration(): UseItemRegistrationReturn {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveItem = useCallback(async (payload: CreateItemPayload): Promise<ItemRecord | null> => {
    setIsSaving(true)
    setError(null)

    try {
      const itemRecord = await withRetry(() => createItemWithRouting(payload), {
        maxRetries: 3,
        delays: [1000, 2000, 4000],
      })
      notify.success('Item cadastrado com sucesso!', {
        description: 'A peça e suas etapas de fabricação foram registradas no sistema.',
      })
      return itemRecord
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error && err.message
          ? err.message
          : 'Erro ao cadastrar o item no banco de dados após 3 tentativas.'
      setError(errorMsg)
      notify.error('Erro ao salvar item', {
        description: errorMsg,
      })
      return null
    } finally {
      setIsSaving(false)
    }
  }, [])

  return {
    isSaving,
    error,
    saveItem,
  }
}
