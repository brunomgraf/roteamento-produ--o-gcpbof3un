import { useState, useCallback } from 'react'
import { callGenerateRoutingAgent, type GenerateRoutingParams } from '@/services/aiRouting'
import type { GeneratedRouting } from '@/types/routing'
import { useToast } from '@/hooks/use-toast'

export interface UseGenerateRoutingReturn {
  isGenerating: boolean
  routing: GeneratedRouting | null
  error: string | null
  generateRouting: (params: GenerateRoutingParams) => Promise<GeneratedRouting | null>
  setRouting: React.Dispatch<React.SetStateAction<GeneratedRouting | null>>
  clearRouting: () => void
}

export function useGenerateRouting(): UseGenerateRoutingReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [routing, setRouting] = useState<GeneratedRouting | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const generateRouting = useCallback(
    async (params: GenerateRoutingParams): Promise<GeneratedRouting | null> => {
      setIsGenerating(true)
      setError(null)

      try {
        const result = await callGenerateRoutingAgent(params)
        setRouting(result)
        return result
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error && err.message ? err.message : 'Não foi possível gerar o roteamento.'
        setError(errorMsg)
        toast({
          title: 'Erro no roteamento',
          description: errorMsg.includes('Não foi possível')
            ? errorMsg
            : `Não foi possível gerar o roteamento. ${errorMsg}`,
          variant: 'destructive',
        })
        return null
      } finally {
        setIsGenerating(false)
      }
    },
    [toast],
  )

  const clearRouting = useCallback(() => {
    setRouting(null)
    setError(null)
  }, [])

  return {
    isGenerating,
    routing,
    error,
    generateRouting,
    setRouting,
    clearRouting,
  }
}
