import { useState, useCallback } from 'react'
import { createItemWithRouting, type CreateItemPayload } from '@/services/itemService'
import type { ItemRecord } from '@/types/routing'
import { useToast } from '@/hooks/use-toast'

export interface UseItemRegistrationReturn {
  isSaving: boolean
  error: string | null
  saveItem: (payload: CreateItemPayload) => Promise<ItemRecord | null>
}

export function useItemRegistration(): UseItemRegistrationReturn {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const saveItem = useCallback(
    async (payload: CreateItemPayload): Promise<ItemRecord | null> => {
      setIsSaving(true)
      setError(null)

      try {
        const itemRecord = await createItemWithRouting(payload)
        toast({
          title: 'Sucesso!',
          description: 'Item cadastrado com sucesso!',
        })
        return itemRecord
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error && err.message
            ? err.message
            : 'Erro ao cadastrar o item no banco de dados.'
        setError(errorMsg)
        toast({
          title: 'Erro ao salvar',
          description: errorMsg,
          variant: 'destructive',
        })
        return null
      } finally {
        setIsSaving(false)
      }
    },
    [toast],
  )

  return {
    isSaving,
    error,
    saveItem,
  }
}
