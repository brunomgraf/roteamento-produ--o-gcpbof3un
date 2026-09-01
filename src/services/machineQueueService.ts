import pb from '@/lib/pocketbase/client'

export type MachineQueueStatus = 'aguardando' | 'em_andamento' | 'concluido'

export interface MachineQueueItem {
  id: string
  itemId: string
  itemName: string
  stepOrder: number
  sector: string
  machineType: 'torno' | 'fresa' | 'cnc' | 'retifica' | string
  description: string
  estimatedHours: number
  status: MachineQueueStatus
  previousStep?: {
    sector: string
    description: string
    status: string
  } | null
  nextStep?: {
    sector: string
    description: string
    status: string
  } | null
  created?: string
  updated?: string
}

// Fallback mock data matching prompt requirements
export const MOCK_MACHINE_QUEUES: Record<string, MachineQueueItem[]> = {
  torno: [
    {
      id: 'mock-torno-1',
      itemId: 'mock-item-1',
      itemName: 'Eixo Cardan',
      stepOrder: 1,
      sector: 'Torno',
      machineType: 'torno',
      description: 'Desbaste externo e usinagem de pontas',
      estimatedHours: 2,
      status: 'em_andamento',
      previousStep: null,
      nextStep: {
        sector: 'Fresa',
        description: 'Abertura de canal de chaveta 12mm',
        status: 'aguardando',
      },
    },
    {
      id: 'mock-torno-2',
      itemId: 'mock-item-2',
      itemName: 'Flange ANSI 150',
      stepOrder: 1,
      sector: 'Torno',
      machineType: 'torno',
      description: 'Faceamento e torneamento dos ressaltos',
      estimatedHours: 1,
      status: 'aguardando',
      previousStep: null,
      nextStep: {
        sector: 'CNC',
        description: 'Furação concêntrica 8 furos',
        status: 'aguardando',
      },
    },
    {
      id: 'mock-torno-3',
      itemId: 'mock-item-3',
      itemName: 'Engrenagem Helicoidal',
      stepOrder: 1,
      sector: 'Torno',
      machineType: 'torno',
      description: 'Torneamento inicial e desbaste do corpo',
      estimatedHours: 3,
      status: 'aguardando',
      previousStep: null,
      nextStep: {
        sector: 'Fresa',
        description: 'Fresamento de dentes helicoidais',
        status: 'aguardando',
      },
    },
    {
      id: 'mock-torno-4',
      itemId: 'mock-item-4',
      itemName: 'Bucha Bronze',
      stepOrder: 1,
      sector: 'Torno',
      machineType: 'torno',
      description: 'Torneamento interno e canal de lubrificação',
      estimatedHours: 0.5,
      status: 'aguardando',
      previousStep: null,
      nextStep: {
        sector: 'Retifica',
        description: 'Retífica externa de acabamento',
        status: 'aguardando',
      },
    },
  ],
  fresa: [
    {
      id: 'mock-fresa-1',
      itemId: 'mock-item-5',
      itemName: 'Placa Base com Canais T',
      stepOrder: 1,
      sector: 'Fresa',
      machineType: 'fresa',
      description: 'Faceamento e usinagem de canais T 18mm',
      estimatedHours: 2.5,
      status: 'em_andamento',
      previousStep: null,
      nextStep: {
        sector: 'Retifica',
        description: 'Retífica plana 0.01mm',
        status: 'aguardando',
      },
    },
    {
      id: 'mock-fresa-2',
      itemId: 'mock-item-1',
      itemName: 'Eixo Cardan',
      stepOrder: 2,
      sector: 'Fresa',
      machineType: 'fresa',
      description: 'Abertura de canal de chaveta 12mm',
      estimatedHours: 1.5,
      status: 'aguardando',
      previousStep: {
        sector: 'Torno',
        description: 'Desbaste externo e pontas',
        status: 'em_andamento',
      },
      nextStep: {
        sector: 'Retifica',
        description: 'Retífica dos colos h6',
        status: 'aguardando',
      },
    },
    {
      id: 'mock-fresa-3',
      itemId: 'mock-item-3',
      itemName: 'Engrenagem Helicoidal',
      stepOrder: 2,
      sector: 'Fresa',
      machineType: 'fresa',
      description: 'Fresamento de dentes helicoidais Z=28',
      estimatedHours: 4,
      status: 'aguardando',
      previousStep: {
        sector: 'Torno',
        description: 'Torneamento inicial',
        status: 'aguardando',
      },
      nextStep: null,
    },
  ],
  cnc: [
    {
      id: 'mock-cnc-1',
      itemId: 'mock-item-6',
      itemName: 'Bloco Distribuidor Hidráulico',
      stepOrder: 1,
      sector: 'CNC',
      machineType: 'cnc',
      description: 'Usinagem 3D multieixo de galerias internas',
      estimatedHours: 3.5,
      status: 'em_andamento',
      previousStep: null,
      nextStep: {
        sector: 'CNC',
        description: 'Furação profunda e rebaixo',
        status: 'aguardando',
      },
    },
    {
      id: 'mock-cnc-2',
      itemId: 'mock-item-2',
      itemName: 'Flange ANSI 150',
      stepOrder: 2,
      sector: 'CNC',
      machineType: 'cnc',
      description: 'Furação de 8 furos Ø19mm com padrão circular',
      estimatedHours: 1.2,
      status: 'aguardando',
      previousStep: {
        sector: 'Torno',
        description: 'Faceamento e ressaltos',
        status: 'aguardando',
      },
      nextStep: null,
    },
    {
      id: 'mock-cnc-3',
      itemId: 'mock-item-6',
      itemName: 'Bloco Distribuidor Hidráulico',
      stepOrder: 2,
      sector: 'CNC',
      machineType: 'cnc',
      description: 'Furação profunda e rebaixo de sedes de vedação',
      estimatedHours: 2,
      status: 'aguardando',
      previousStep: {
        sector: 'CNC',
        description: 'Usinagem 3D de galerias',
        status: 'em_andamento',
      },
      nextStep: null,
    },
  ],
  retifica: [
    {
      id: 'mock-retifica-1',
      itemId: 'mock-item-7',
      itemName: 'Guia Linear de Precisão',
      stepOrder: 1,
      sector: 'Retifica',
      machineType: 'retifica',
      description: 'Retífica tangencial de 4 faces batimento < 0.005mm',
      estimatedHours: 2,
      status: 'em_andamento',
      previousStep: null,
      nextStep: {
        sector: 'Retifica',
        description: 'Polimento e superacabamento',
        status: 'aguardando',
      },
    },
    {
      id: 'mock-retifica-2',
      itemId: 'mock-item-4',
      itemName: 'Bucha Bronze',
      stepOrder: 2,
      sector: 'Retifica',
      machineType: 'retifica',
      description: 'Retífica externa para ajuste H7/p6',
      estimatedHours: 0.8,
      status: 'aguardando',
      previousStep: {
        sector: 'Torno',
        description: 'Torneamento interno',
        status: 'aguardando',
      },
      nextStep: null,
    },
    {
      id: 'mock-retifica-3',
      itemId: 'mock-item-1',
      itemName: 'Eixo Cardan',
      stepOrder: 3,
      sector: 'Retifica',
      machineType: 'retifica',
      description: 'Retífica de precisão nos colos dos mancais h6',
      estimatedHours: 1,
      status: 'aguardando',
      previousStep: {
        sector: 'Fresa',
        description: 'Abertura canal chaveta',
        status: 'aguardando',
      },
      nextStep: null,
    },
    {
      id: 'mock-retifica-4',
      itemId: 'mock-item-5',
      itemName: 'Placa Base com Canais T',
      stepOrder: 2,
      sector: 'Retifica',
      machineType: 'retifica',
      description: 'Retífica plana para planicidade 0.01mm',
      estimatedHours: 1.5,
      status: 'aguardando',
      previousStep: {
        sector: 'Fresa',
        description: 'Faceamento e canais T',
        status: 'em_andamento',
      },
      nextStep: null,
    },
  ],
}

/**
 * Normalizes status strings from pocketbase / inputs to known values
 */
export function normalizeStatus(rawStatus?: string): MachineQueueStatus {
  if (!rawStatus) return 'aguardando'
  const s = rawStatus.toLowerCase().trim()
  if (s === 'em_andamento' || s === 'em andamento' || s === 'em_producao' || s === 'em produção') {
    return 'em_andamento'
  }
  if (s === 'concluido' || s === 'concluído' || s === 'finalizado') {
    return 'concluido'
  }
  return 'aguardando'
}

/**
 * Fetches the machine service queue for a given machine type from PocketBase,
 * resolving item relations and previous/next steps.
 * Falls back gracefully to mock data if PocketBase is unreachable.
 */
export async function getMachineQueue(machineType: string): Promise<MachineQueueItem[]> {
  const normalizedType = machineType.toLowerCase().trim()

  try {
    // 1. Query routing steps for this machine_type ordered by step_order, expanding the parent item
    // Filter by machine_type or matching sector
    const steps = await pb.collection('routing_steps').getFullList({
      filter: `machine_type ~ "${normalizedType}" || sector ~ "${normalizedType}"`,
      sort: 'step_order,created',
      expand: 'item_id',
    })

    if (steps.length === 0) {
      // If DB has no steps for this machine type, check mock fallback
      return MOCK_MACHINE_QUEUES[normalizedType] || []
    }

    // Collect all distinct item IDs to fetch sibling steps for prev/next step indicators
    const itemIds = Array.from(new Set(steps.map((s) => s.item_id).filter(Boolean)))

    // Fetch all steps for these items to calculate prev/next context accurately
    let allItemSteps: any[] = []
    if (itemIds.length > 0) {
      try {
        const itemFilter = itemIds.map((id) => `item_id = "${id}"`).join(' || ')
        allItemSteps = await pb.collection('routing_steps').getFullList({
          filter: itemFilter,
          sort: 'step_order',
        })
      } catch (err) {
        console.warn('Could not fetch sibling steps for prev/next indicators:', err)
      }
    }

    const itemsMap = new Map<string, any[]>()
    for (const st of allItemSteps) {
      const list = itemsMap.get(st.item_id) || []
      list.push(st)
      itemsMap.set(st.item_id, list)
    }

    return steps.map((step) => {
      const expandedItem = step.expand?.item_id
      const itemName =
        (typeof expandedItem === 'object' && expandedItem?.nome) ||
        step.item_name ||
        `Item #${step.item_id?.substring(0, 6) || step.id?.substring(0, 6)}`

      // Find previous and next steps for the same item
      const siblingSteps = (itemsMap.get(step.item_id) || []).sort(
        (a, b) => a.step_order - b.step_order,
      )
      const currentIndex = siblingSteps.findIndex((s) => s.id === step.id)

      let previousStep = null
      let nextStep = null

      if (currentIndex > 0) {
        const prev = siblingSteps[currentIndex - 1]
        previousStep = {
          sector: prev.sector || prev.machine_type || 'Anterior',
          description: prev.description,
          status: normalizeStatus(prev.status),
        }
      }

      if (currentIndex >= 0 && currentIndex < siblingSteps.length - 1) {
        const next = siblingSteps[currentIndex + 1]
        nextStep = {
          sector: next.sector || next.machine_type || 'Próxima',
          description: next.description,
          status: normalizeStatus(next.status),
        }
      }

      return {
        id: step.id,
        itemId: step.item_id,
        itemName,
        stepOrder: Number(step.step_order) || 1,
        sector: step.sector || machineType.toUpperCase(),
        machineType: step.machine_type || normalizedType,
        description: step.description || 'Operação técnica de usinagem',
        estimatedHours: Number(step.estimated_hours) || 0,
        status: normalizeStatus(step.status),
        previousStep,
        nextStep,
        created: step.created,
        updated: step.updated,
      }
    })
  } catch (error) {
    console.warn(
      `Error fetching machine queue from PocketBase for ${machineType}, using mock:`,
      error,
    )
    return MOCK_MACHINE_QUEUES[normalizedType] || []
  }
}

/**
 * Updates the status of a specific routing step in PocketBase.
 */
export async function updateStepStatus(
  stepId: string,
  newStatus: MachineQueueStatus,
): Promise<void> {
  // If it's a mock ID (e.g. mock-torno-1), just resolve
  if (stepId.startsWith('mock-')) {
    return
  }

  await pb.collection('routing_steps').update(stepId, {
    status: newStatus,
  })
}
