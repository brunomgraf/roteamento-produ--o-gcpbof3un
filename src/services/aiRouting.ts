import pb from '@/lib/pocketbase/client'
import type { GeneratedRouting } from '@/types/routing'

export interface GenerateRoutingParams {
  item_name: string
  description?: string
  drawing_url?: string
}

export async function callGenerateRoutingAgent(
  params: GenerateRoutingParams,
): Promise<GeneratedRouting> {
  const baseUrl = import.meta.env.VITE_POCKETBASE_URL || ''
  const endpoint = `${baseUrl}/backend/v1/generate-routing`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (pb.authStore.token) {
    headers.Authorization = pb.authStore.token
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    let errorMsg = 'Não foi possível gerar o roteamento.'
    try {
      const errorJson = (await response.json()) as { error?: string }
      if (errorJson.error) {
        errorMsg = errorJson.error
      }
    } catch {
      const text = await response.text().catch(() => '')
      if (text) errorMsg = text
    }
    throw new Error(errorMsg)
  }

  const data = (await response.json()) as { success: boolean; data: GeneratedRouting }
  if (!data || !data.data) {
    throw new Error('Formato inválido retornado pelo serviço de roteamento.')
  }

  return data.data
}
