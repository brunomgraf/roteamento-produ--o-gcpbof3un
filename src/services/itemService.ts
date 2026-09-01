import pb from '@/lib/pocketbase/client'
import type { RoutingStep, MaterialPurchase, OutsourcedService, ItemRecord } from '@/types/routing'

export interface CreateItemPayload {
  nome: string
  descricao?: string
  status?: 'pendente' | 'em_producao' | 'finalizado'
  drawing_url?: string
  drawing_file?: File | null
  routing_steps: RoutingStep[]
  material_purchases: MaterialPurchase[]
  outsourced_services: OutsourcedService[]
}

export async function createItemWithRouting(payload: CreateItemPayload): Promise<ItemRecord> {
  // 1. Create item in `itens`
  const itemFormData = new FormData()
  itemFormData.append('nome', payload.nome)
  if (payload.descricao) {
    itemFormData.append('descricao', payload.descricao)
  }
  itemFormData.append('status', payload.status || 'pendente')
  if (payload.drawing_url) {
    itemFormData.append('drawing_url', payload.drawing_url)
  }
  if (payload.drawing_file) {
    itemFormData.append('drawing_file', payload.drawing_file)
  }

  const itemRecord = await pb.collection('itens').create<ItemRecord>(itemFormData)
  const itemId = itemRecord.id

  // 2. Create routing steps in parallel
  if (payload.routing_steps && payload.routing_steps.length > 0) {
    const stepPromises = payload.routing_steps.map((step, index) => {
      const statusValue = (step.status || 'aguardando').toLowerCase().trim()
      const normalizedStatus =
        statusValue === 'pendente' ? 'aguardando' : step.status || 'aguardando'
      return pb.collection('routing_steps').create({
        item_id: itemId,
        step_order: step.step_order || index + 1,
        sector: step.sector || 'Geral',
        machine_type: step.machine_type || 'outros',
        description: step.description,
        estimated_hours: Number(step.estimated_hours) || 0,
        status: normalizedStatus,
      })
    })
    await Promise.all(stepPromises)
  }

  // 3. Create material purchases
  if (payload.material_purchases && payload.material_purchases.length > 0) {
    const purchasePromises = payload.material_purchases.map((mat) => {
      return pb.collection('material_purchases').create({
        item_id: itemId,
        material_name: mat.material_name,
        quantity: Number(mat.quantity) || 1,
        unit: mat.unit || 'un',
        supplier: mat.supplier || '',
        status: mat.status || 'pendente',
      })
    })
    await Promise.all(purchasePromises)
  }

  // 4. Create outsourced services
  if (payload.outsourced_services && payload.outsourced_services.length > 0) {
    const servicePromises = payload.outsourced_services.map((srv) => {
      return pb.collection('outsourced_services').create({
        item_id: itemId,
        service_description: srv.service_description,
        supplier: srv.supplier || '',
        estimated_cost: Number(srv.estimated_cost) || 0,
        status: srv.status || 'pendente',
      })
    })
    await Promise.all(servicePromises)
  }

  return itemRecord
}
