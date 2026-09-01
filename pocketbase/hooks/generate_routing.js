routerAdd('POST', '/backend/v1/generate-routing', (e) => {
  try {
    const body = e.requestInfo().body || {}
    const itemName = body.item_name || ''
    const description = body.description || ''
    const drawingUrl = body.drawing_url || ''

    if (!itemName || !itemName.trim()) {
      return e.badRequestError('item_name é obrigatório')
    }

    // Determine user id: use authenticated user or fallback to system user
    let userId = e.auth ? e.auth.id : null
    if (!userId) {
      try {
        const sysUser = $app.findAuthRecordByEmail('users', 'sistema@roteamento.local')
        userId = sysUser.id
      } catch (err) {
        // Find any user as fallback
        const users = $app.findRecordsByFilter('users', '', '-created', 1, 0)
        if (users && users.length > 0) {
          userId = users[0].id
        }
      }
    }

    if (!userId) {
      return e.json(500, { error: 'Nenhum usuário configurado para o agente de IA.' })
    }

    const promptMessage = `Gere o roteamento de fabricação completo para o seguinte item industrial:
- Nome da Peça: ${itemName.trim()}
${description ? `- Descrição / Especificações Técnicas: ${description.trim()}` : '- Descrição: Peça padrão para usinagem mecânica industrial'}
${drawingUrl ? `- Link / Referência do Desenho Técnico: ${drawingUrl.trim()}` : '- Desenho Técnico: Não anexado, considerar geometria padrão baseada no nome e especificações.'}

Por favor, responda exclusivamente em formato JSON com o roteamento completo conforme a estrutura especificada.`

    const result = $ai.agent('generate-routing').chat({
      user_id: userId,
      message: promptMessage,
    })

    let rawContent = result.content || ''
    // Clean up if wrapped in code blocks
    let cleaned = rawContent.trim()
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7)
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3)
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3)
    }
    cleaned = cleaned.trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch (parseErr) {
      // Attempt to extract JSON from text if there's surrounding text
      const firstBrace = cleaned.indexOf('{')
      const lastBrace = cleaned.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonSub = cleaned.substring(firstBrace, lastBrace + 1)
        parsed = JSON.parse(jsonSub)
      } else {
        return e.json(500, {
          error: 'Falha ao processar resposta da IA no formato JSON',
          raw: rawContent,
        })
      }
    }

    return e.json(200, {
      success: true,
      data: parsed,
      conversation_id: result.conversation_id,
      message_id: result.message_id,
    })
  } catch (err) {
    if (err instanceof SkipAiConfigError) {
      return e.json(503, { error: 'Serviço de IA temporariamente indisponível' })
    }
    if (err instanceof SkipAiAgentsError) {
      const status = err.status || 500
      return e.json(status, { error: status >= 500 ? 'Falha no agente de IA' : err.message })
    }
    if (err instanceof SkipAiError) {
      const status = err.status || 502
      return e.json(status, { error: status >= 500 ? 'Erro no processamento de IA' : err.message })
    }
    return e.json(500, { error: err.message || 'Erro interno ao gerar roteamento' })
  }
})
