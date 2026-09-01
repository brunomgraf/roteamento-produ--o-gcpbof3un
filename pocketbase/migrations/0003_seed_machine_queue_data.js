migrate(
  (app) => {
    const itensCol = app.findCollectionByNameOrId('itens')
    const routingStepsCol = app.findCollectionByNameOrId('routing_steps')

    // Helper to create an item and its steps if it doesn't already exist
    const seedData = [
      // 1. Eixo Cardan (Torno in progress, etc.)
      {
        nome: 'Eixo Cardan',
        descricao: 'Eixo cardan industrial usinado em aço SAE 4140 com chaveta e furos de fixação.',
        status: 'em_producao',
        steps: [
          {
            step_order: 1,
            sector: 'Torno',
            machine_type: 'torno',
            description: 'Desbaste externo e faceamento de pontas',
            estimated_hours: 2,
            status: 'em_andamento',
          },
          {
            step_order: 2,
            sector: 'Fresa',
            machine_type: 'fresa',
            description: 'Abertura de canal de chaveta 12mm',
            estimated_hours: 1.5,
            status: 'aguardando',
          },
          {
            step_order: 3,
            sector: 'Retifica',
            machine_type: 'retifica',
            description: 'Retífica de precisão nos colos dos mancais h6',
            estimated_hours: 1,
            status: 'aguardando',
          },
        ],
      },
      // 2. Flange ANSI 150
      {
        nome: 'Flange ANSI 150',
        descricao: 'Flange sobreposto 4 polegadas com ranhuras concêntricas de vedação.',
        status: 'pendente',
        steps: [
          {
            step_order: 1,
            sector: 'Torno',
            machine_type: 'torno',
            description: 'Faceamento e torneamento dos ressaltos',
            estimated_hours: 1,
            status: 'aguardando',
          },
          {
            step_order: 2,
            sector: 'CNC',
            machine_type: 'cnc',
            description: 'Furação de 8 furos Ø19mm com padrão circular',
            estimated_hours: 1.2,
            status: 'aguardando',
          },
        ],
      },
      // 3. Engrenagem Helicoidal
      {
        nome: 'Engrenagem Helicoidal',
        descricao: 'Engrenagem cônica helicoidal módulo 3.5 em aço 8620 com tratamento térmico.',
        status: 'pendente',
        steps: [
          {
            step_order: 1,
            sector: 'Torno',
            machine_type: 'torno',
            description: 'Torneamento inicial e desbaste do corpo',
            estimated_hours: 3,
            status: 'aguardando',
          },
          {
            step_order: 2,
            sector: 'Fresa',
            machine_type: 'fresa',
            description: 'Fresamento de dentes helicoidais Z=28',
            estimated_hours: 4,
            status: 'aguardando',
          },
        ],
      },
      // 4. Bucha Bronze
      {
        nome: 'Bucha Bronze',
        descricao: 'Bucha autolubrificante em bronze TM 23 para mancais de deslizamento.',
        status: 'pendente',
        steps: [
          {
            step_order: 1,
            sector: 'Torno',
            machine_type: 'torno',
            description: 'Torneamento interno e canal helicoidal de lubrificação',
            estimated_hours: 0.5,
            status: 'aguardando',
          },
          {
            step_order: 2,
            sector: 'Retifica',
            machine_type: 'retifica',
            description: 'Retífica externa para ajuste H7/p6',
            estimated_hours: 0.8,
            status: 'aguardando',
          },
        ],
      },
      // 5. Placa Base Fresada
      {
        nome: 'Placa Base com Canais T',
        descricao:
          'Placa base estrutural 300x200mm em ferro fundido nodular com canais de fixação.',
        status: 'em_producao',
        steps: [
          {
            step_order: 1,
            sector: 'Fresa',
            machine_type: 'fresa',
            description: 'Faceamento superior/inferior e usinagem de canais T 18mm',
            estimated_hours: 2.5,
            status: 'em_andamento',
          },
          {
            step_order: 2,
            sector: 'Retifica',
            machine_type: 'retifica',
            description: 'Retífica plana para planicidade 0.01mm',
            estimated_hours: 1.5,
            status: 'aguardando',
          },
        ],
      },
      // 6. Bloco Distribuidor Hidráulico (CNC)
      {
        nome: 'Bloco Distribuidor Hidráulico',
        descricao: 'Bloco manifold 5 vias em duralumínio 7075-T6 para sistema de alta pressão.',
        status: 'em_producao',
        steps: [
          {
            step_order: 1,
            sector: 'CNC',
            machine_type: 'cnc',
            description: 'Usinagem 3D multieixo de galerias internas e roscas BSP',
            estimated_hours: 3.5,
            status: 'em_andamento',
          },
          {
            step_order: 2,
            sector: 'CNC',
            machine_type: 'cnc',
            description: 'Furação profunda e rebaixo de sedes de vedação',
            estimated_hours: 2,
            status: 'aguardando',
          },
        ],
      },
      // 7. Guia Linear de Precisão
      {
        nome: 'Guia Linear de Precisão',
        descricao: 'Barra guia temperada por indução 60 HRC retificada para máquina CNC.',
        status: 'em_producao',
        steps: [
          {
            step_order: 1,
            sector: 'Retifica',
            machine_type: 'retifica',
            description: 'Retífica tangencial de 4 faces com batimento < 0.005mm',
            estimated_hours: 2,
            status: 'em_andamento',
          },
          {
            step_order: 2,
            sector: 'Retifica',
            machine_type: 'retifica',
            description: 'Polimento e superacabamento especular',
            estimated_hours: 1,
            status: 'aguardando',
          },
        ],
      },
    ]

    for (const itemData of seedData) {
      try {
        app.findFirstRecordByData('itens', 'nome', itemData.nome)
        // Already exists
        continue
      } catch (_) {}

      const itemRec = new Record(itensCol)
      itemRec.set('nome', itemData.nome)
      itemRec.set('descricao', itemData.descricao)
      itemRec.set('status', itemData.status)
      app.save(itemRec)

      const itemId = itemRec.id

      for (const step of itemData.steps) {
        const stepRec = new Record(routingStepsCol)
        stepRec.set('item_id', itemId)
        stepRec.set('step_order', step.step_order)
        stepRec.set('sector', step.sector)
        stepRec.set('machine_type', step.machine_type)
        stepRec.set('description', step.description)
        stepRec.set('estimated_hours', step.estimated_hours)
        stepRec.set('status', step.status)
        app.save(stepRec)
      }
    }
  },
  (app) => {
    // Revert seed
    const itemNames = [
      'Eixo Cardan',
      'Flange ANSI 150',
      'Engrenagem Helicoidal',
      'Bucha Bronze',
      'Placa Base com Canais T',
      'Bloco Distribuidor Hidráulico',
      'Guia Linear de Precisão',
    ]
    for (const name of itemNames) {
      try {
        const item = app.findFirstRecordByData('itens', 'nome', name)
        app.delete(item)
      } catch (_) {}
    }
  },
)
