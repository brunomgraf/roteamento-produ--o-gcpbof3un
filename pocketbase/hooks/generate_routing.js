routerAdd('POST', '/backend/v1/generate-routing', (e) => {
  try {
    // 1. Auth check: verify auth token and require authenticated user
    const authHeader = e.requestInfo().headers['authorization'] || ''
    const authRecord = e.auth
    if (!authRecord && !authHeader) {
      return e.json(401, {
        error: 'Não autorizado. Faça login para gerar o roteamento.',
      })
    }

    // 2. Validation: require item_name
    const body = e.requestInfo().body || {}
    const itemName = body.item_name
    if (!itemName || typeof itemName !== 'string' || !itemName.trim()) {
      return e.json(400, {
        error: 'O campo "item_name" é obrigatório.',
      })
    }

    const description = typeof body.description === 'string' ? body.description.trim() : ''
    const drawingUrl = typeof body.drawing_url === 'string' ? body.drawing_url.trim() : ''

    // 3. Prepare OpenAI Structured Outputs payload
    const systemPrompt =
      'You are a manufacturing engineer expert in machining processes. Analyze the item and generate a production routing plan. The available machines are: Torno (Lathe), Fresa (Milling), CNC, Retifica (Grinding). Determine which sectors the item passes through, in order. Identify if outsourced services are needed (heat treatment, plating, etc). Identify if material purchase is needed. Respond in Portuguese.'

    // Construct user content parts (text and optional image_url)
    let userContent
    if (
      drawingUrl &&
      (drawingUrl.startsWith('http://') ||
        drawingUrl.startsWith('https://') ||
        drawingUrl.startsWith('data:image/'))
    ) {
      userContent = [
        {
          type: 'text',
          text: `Item: ${itemName.trim()}\nDescrição: ${description || 'Sem descrição adicional.'}`,
        },
        {
          type: 'image_url',
          image_url: {
            url: drawingUrl,
          },
        },
      ]
    } else {
      userContent = `Item: ${itemName.trim()}\nDescrição: ${description || 'Sem descrição adicional.'}${drawingUrl ? `\nReferência do Desenho: ${drawingUrl}` : ''}`
    }

    const jsonSchema = {
      name: 'manufacturing_routing_plan',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          routing_steps: {
            type: 'array',
            description: 'Etapas ordenadas do roteamento de usinagem e fabricação',
            items: {
              type: 'object',
              properties: {
                step_order: { type: 'integer', description: 'Número de ordem da etapa' },
                sector: {
                  type: 'string',
                  description: 'Setor de fabricação (ex: Torno, Fresa, CNC, Retifica)',
                },
                machine_type: {
                  type: ['string', 'null'],
                  description:
                    'Tipo de máquina normalizado (torno, fresa, cnc, retifica, corte, solda, inspecao, outros) ou null',
                },
                description: {
                  type: 'string',
                  description: 'Descrição técnica detalhada da operação',
                },
                estimated_hours: { type: 'number', description: 'Tempo estimado em horas' },
              },
              required: ['step_order', 'sector', 'machine_type', 'description', 'estimated_hours'],
              additionalProperties: false,
            },
          },
          material_purchases: {
            type: 'array',
            description: 'Lista de materiais e matérias-primas necessárias para compra',
            items: {
              type: 'object',
              properties: {
                material_name: { type: 'string', description: 'Nome e especificação do material' },
                quantity: { type: 'number', description: 'Quantidade necessária' },
                unit: { type: 'string', description: 'Unidade de medida (un, kg, m, pç)' },
                supplier: { type: ['string', 'null'], description: 'Fornecedor sugerido ou null' },
              },
              required: ['material_name', 'quantity', 'unit', 'supplier'],
              additionalProperties: false,
            },
          },
          outsourced_services: {
            type: 'array',
            description: 'Serviços terceirizados necessários (tratamento térmico, pintura, etc)',
            items: {
              type: 'object',
              properties: {
                service_description: {
                  type: 'string',
                  description: 'Descrição do serviço terceirizado',
                },
                supplier: { type: ['string', 'null'], description: 'Fornecedor sugerido ou null' },
                estimated_cost: {
                  type: ['number', 'null'],
                  description: 'Custo estimado em reais ou null',
                },
              },
              required: ['service_description', 'supplier', 'estimated_cost'],
              additionalProperties: false,
            },
          },
          notes: {
            type: 'string',
            description: 'Observações gerais técnicas de fabricação, segurança e qualidade',
          },
        },
        required: ['routing_steps', 'material_purchases', 'outsourced_services', 'notes'],
        additionalProperties: false,
      },
    }

    const openAiPayload = {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: jsonSchema,
      },
      temperature: 0.3,
      max_tokens: 2000,
    }

    const openAiApiKey = $os.getenv('OPENAI_API_KEY') || $secrets.get('OPENAI_API_KEY') || ''

    let parsedResult = null

    // If OPENAI_API_KEY is configured, call OpenAI directly with retry logic
    if (openAiApiKey) {
      const delays = [2000, 4000, 8000]
      let lastErr = null
      let response = null

      for (let attempt = 0; attempt <= 3; attempt++) {
        try {
          response = $http.send({
            url: 'https://api.openai.com/v1/chat/completions',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openAiApiKey}`,
            },
            body: JSON.stringify(openAiPayload),
            timeout: 60,
          })

          if (response.statusCode === 200) {
            lastErr = null
            break
          }

          // If 503 or 502/504, retry with backoff up to 3 attempts
          if (
            response.statusCode === 503 ||
            response.statusCode === 502 ||
            response.statusCode === 504
          ) {
            console.log(
              `OpenAI returned ${response.statusCode}, retrying attempt ${attempt + 1}...`,
            )
            if (attempt < 3) {
              $os.sleep(delays[attempt])
              continue
            }
          }

          // No retry for 400, 401, 404 or other client errors
          console.log(`OpenAI API error ${response.statusCode}:`, response.raw)
          lastErr = new Error(`OpenAI HTTP ${response.statusCode}`)
          break
        } catch (netErr) {
          console.log(
            `Network error connecting to OpenAI (attempt ${attempt + 1}):`,
            netErr.message,
          )
          lastErr = netErr
          if (attempt < 3) {
            $os.sleep(delays[attempt])
            continue
          }
          break
        }
      }

      if (!lastErr && response && response.statusCode === 200) {
        try {
          const respJson = response.json
          const contentStr = respJson.choices[0].message.content
          parsedResult = JSON.parse(contentStr)
        } catch (parseErr) {
          console.log('Error parsing OpenAI response JSON:', parseErr.message)
        }
      }
    }

    // If OpenAI wasn't used or failed, fall back seamlessly to Skip Cloud native AI ($ai.chat / agent)
    if (!parsedResult) {
      try {
        const skipAiRes = $ai.chat({
          model: 'fast',
          messages: [
            {
              role: 'system',
              content: `${systemPrompt}\nRetorne estritamente um JSON com a estrutura: {"routing_steps": [...], "material_purchases": [...], "outsourced_services": [...], "notes": "..."}`,
            },
            {
              role: 'user',
              content:
                typeof userContent === 'string'
                  ? userContent
                  : `Item: ${itemName}\nDescrição: ${description}`,
            },
          ],
        })

        if (skipAiRes && skipAiRes.choices && skipAiRes.choices.length > 0) {
          let text = skipAiRes.choices[0].message.content || ''
          text = text.trim()
          if (text.startsWith('```json')) text = text.slice(7)
          if (text.startsWith('```')) text = text.slice(3)
          if (text.endsWith('```')) text = text.slice(0, -3)
          text = text.trim()

          const firstBrace = text.indexOf('{')
          const lastBrace = text.lastIndexOf('}')
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            parsedResult = JSON.parse(text.substring(firstBrace, lastBrace + 1))
          }
        }
      } catch (skipAiErr) {
        console.log('Skip AI chat fallback error:', skipAiErr.message)
      }
    }

    // If still no result, try agent fallback
    if (!parsedResult) {
      try {
        let agentUserId = authRecord ? authRecord.id : null
        if (!agentUserId) {
          try {
            const sysUser = $app.findAuthRecordByEmail('users', 'sistema@roteamento.local')
            agentUserId = sysUser.id
          } catch (_) {
            const u = $app.findRecordsByFilter('users', '', '-created', 1, 0)
            if (u && u.length > 0) agentUserId = u[0].id
          }
        }

        if (agentUserId) {
          const agentRes = $ai.agent('generate-routing').chat({
            user_id: agentUserId,
            message: `Item: ${itemName.trim()}\nDescrição: ${description}`,
          })
          let raw = (agentRes.content || '').trim()
          if (raw.startsWith('```json')) raw = raw.slice(7)
          if (raw.startsWith('```')) raw = raw.slice(3)
          if (raw.endsWith('```')) raw = raw.slice(0, -3)
          raw = raw.trim()
          const firstBrace = raw.indexOf('{')
          const lastBrace = raw.lastIndexOf('}')
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            parsedResult = JSON.parse(raw.substring(firstBrace, lastBrace + 1))
          }
        }
      } catch (agentErr) {
        console.log('Skip AI agent fallback error:', agentErr.message)
      }
    }

    if (!parsedResult) {
      return e.json(500, {
        error: 'Erro ao gerar roteamento',
      })
    }

    // Normalize output format
    const output = {
      item_name: itemName.trim(),
      routing_steps: Array.isArray(parsedResult.routing_steps) ? parsedResult.routing_steps : [],
      material_purchases: Array.isArray(parsedResult.material_purchases)
        ? parsedResult.material_purchases
        : [],
      outsourced_services: Array.isArray(parsedResult.outsourced_services)
        ? parsedResult.outsourced_services
        : [],
      notes: typeof parsedResult.notes === 'string' ? parsedResult.notes : '',
    }

    return e.json(200, {
      success: true,
      data: output,
      routing_steps: output.routing_steps,
      material_purchases: output.material_purchases,
      outsourced_services: output.outsourced_services,
      notes: output.notes,
    })
  } catch (err) {
    console.log('Unhandled error in generate-routing hook:', err.message || err)
    return e.json(500, {
      error: 'Erro ao gerar roteamento',
    })
  }
})
