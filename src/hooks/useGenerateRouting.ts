import { useState, useCallback } from 'react'
import { callGenerateRoutingAgent, type GenerateRoutingParams } from '@/services/aiRouting'
import type { GeneratedRouting } from '@/types/routing'
import { withRetry } from '@/lib/retry'
import { notify } from '@/lib/notify'

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

  const generateRouting = useCallback(
    async (params: GenerateRoutingParams): Promise<GeneratedRouting | null> => {
      setIsGenerating(true)
      setError(null)

      try {
        const result = await withRetry(() => callGenerateRoutingAgent(params), {
          maxRetries: 3,
          delays: [1000, 2000, 4000],
        })
        setRouting(result)
        notify.success('Roteamento gerado com sucesso!', {
          description: `${result.routing_steps?.length || 0} etapas industriais calculadas.`,
        })
        return result
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error && err.message ? err.message : 'Não foi possível gerar o roteamento.'
        setError(errorMsg)
        notify.error('Erro no roteamento', {
          description: errorMsg.includes('Não foi possível')
            ? errorMsg
            : `Não foi possível gerar o roteamento após 3 tentativas. ${errorMsg}`,
        })
        return null
      } finally {
        setIsGenerating(false)
      }
    },
    [],
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
