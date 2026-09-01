migrate(
  (app) => {
    // Ensure a system user exists for agent calls if no session is active
    const users = app.findCollectionByNameOrId('users')
    try {
      app.findAuthRecordByEmail('users', 'sistema@roteamento.local')
    } catch (_) {
      const rec = new Record(users)
      rec.setEmail('sistema@roteamento.local')
      rec.setPassword('Skip@Pass12345')
      rec.setVerified(true)
      rec.set('name', 'Sistema de Roteamento')
      app.save(rec)
    }

    // Define generate-routing agent
    $ai.agents.define(app, {
      slug: 'generate-routing',
      name: 'Engenheiro Industrial Metalmecânico',
      description:
        'Especialista em planejamento de processos, usinagem, caldeiraria e roteamento de fabricação.',
      systemPrompt: `Você é um engenheiro industrial sênior especializado em usinagem e metalmecânica (torno, fresa, CNC, retífica, corte, solda, tratamento térmico e pintura).
Sua missão é receber os dados de uma peça industrial (nome da peça, descrição técnica, tolerâncias, material e link de desenho técnico se houver) e gerar um roteamento de produção detalhado, realista e estruturado.

Você DEVE retornar APENAS um objeto JSON válido (sem markdown, sem blocos de código com crases triplas ou texto introdutório antes ou depois).

Estrutura JSON obrigatória:
{
  "item_name": "Nome da peça ou item",
  "routing_steps": [
    {
      "step_order": 1,
      "sector": "Torno" | "Fresa" | "CNC" | "Retifica" | "Corte" | "Solda" | "Inspecao" | "Montagem",
      "machine_type": "torno" | "fresa" | "cnc" | "retifica" | "corte" | "solda" | "inspecao" | "outros",
      "description": "Descrição clara da operação técnica e parâmetros (ex: Faceamento e desbaste Ø45mm)",
      "estimated_hours": 1.5,
      "status": "pendente"
    }
  ],
  "material_purchases": [
    {
      "material_name": "Nome do material / matéria-prima (ex: Tarugo Aço SAE 1045 Ø50mm x 300mm)",
      "quantity": 1,
      "unit": "un" | "kg" | "m" | "pç",
      "supplier": "Sugestão de fornecedor ou Cotação Pendente",
      "status": "pendente"
    }
  ],
  "outsourced_services": [
    {
      "service_description": "Tratamento térmico, têmpera, nitretação, anodização ou pintura",
      "supplier": "Parceiro Especializado",
      "estimated_cost": 150.0,
      "status": "pendente"
    }
  ],
  "notes": "Orientações gerais de segurança, tolerâncias e controle de qualidade para esta peça."
}

Se a peça não exigir compras externas ou serviços terceirizados, retorne arrays vazios [] para essas chaves.
Sempre inclua etapas de preparação/corte, usinagem principal e inspeção final de qualidade no routing_steps.`,
      tier: 'fast',
    })
  },
  (app) => {
    try {
      $ai.agents.delete(app, 'generate-routing')
    } catch (_) {}
  },
)
