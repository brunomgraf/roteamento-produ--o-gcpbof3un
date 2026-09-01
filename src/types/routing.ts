export interface RoutingStep {
  id?: string
  step_order: number
  sector: string
  machine_type:
    | 'torno'
    | 'fresa'
    | 'cnc'
    | 'retifica'
    | 'corte'
    | 'solda'
    | 'inspecao'
    | 'outros'
    | string
  description: string
  estimated_hours: number
  status?: string
}

export interface MaterialPurchase {
  id?: string
  material_name: string
  quantity: number
  unit: string
  supplier?: string
  status?: string
}

export interface OutsourcedService {
  id?: string
  service_description: string
  supplier?: string
  estimated_cost: number
  status?: string
}

export interface GeneratedRouting {
  item_name: string
  routing_steps: RoutingStep[]
  material_purchases: MaterialPurchase[]
  outsourced_services: OutsourcedService[]
  notes?: string
}

export interface ItemRecord {
  id: string
  nome: string
  descricao?: string
  status: 'pendente' | 'em_producao' | 'finalizado'
  drawing_url?: string
  drawing_file?: string
  created?: string
  updated?: string
}
