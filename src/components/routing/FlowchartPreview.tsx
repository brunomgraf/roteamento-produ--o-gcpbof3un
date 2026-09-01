import React from 'react'
import {
  Cog,
  Layers,
  Cpu,
  Gauge,
  Scissors,
  Flame,
  CheckCircle2,
  Wrench,
  ShoppingCart,
  ExternalLink,
  ChevronDown,
  Clock,
  Building2,
  Package,
  Layers3,
  Sparkles,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type {
  RoutingStep,
  MaterialPurchase,
  OutsourcedService,
  GeneratedRouting,
} from '@/types/routing'

import type { Machine } from '@/types/machine'

interface FlowchartPreviewProps {
  routing: GeneratedRouting | null
  isLoading: boolean
  machines?: Machine[]
}

const COLOR_BORDER_MAP: Record<string, string> = {
  blue: 'border-l-blue-500',
  amber: 'border-l-amber-500',
  violet: 'border-l-violet-500',
  purple: 'border-l-purple-500',
  green: 'border-l-green-500',
  emerald: 'border-l-emerald-500',
  red: 'border-l-red-500',
  orange: 'border-l-orange-500',
  pink: 'border-l-pink-500',
  cyan: 'border-l-cyan-500',
  teal: 'border-l-teal-500',
  indigo: 'border-l-indigo-500',
  yellow: 'border-l-yellow-500',
  zinc: 'border-l-zinc-500',
  gray: 'border-l-gray-500',
  slate: 'border-l-slate-500',
}

const COLOR_BG_MAP: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  zinc: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
  gray: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  slate: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
}

function normalizeString(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// Helpers for icon and styling based on sector / machine_type and registered machines
function getSectorConfig(sector: string, machineType?: string, machines: Machine[] = []) {
  const normSector = normalizeString(sector)
  const normMachineType = normalizeString(machineType || '')
  const normCombined = `${normSector} ${normMachineType}`

  // Check if sector/machineType matches any registered machine
  let matchedMachine: Machine | undefined
  if (machines.length > 0) {
    matchedMachine = machines.find((m) => {
      const mName = normalizeString(m.name)
      const mSlug = normalizeString(m.slug)
      return (
        (mName && (normSector === mName || normCombined.includes(mName))) ||
        (mSlug &&
          (normSector === mSlug || normMachineType === mSlug || normCombined.includes(mSlug)))
      )
    })
  }

  // Resolve icon
  let icon = Wrench
  if (normCombined.includes('torno') || normCombined.includes('tornear')) {
    icon = Cog
  } else if (normCombined.includes('fresa') || normCombined.includes('fresagem')) {
    icon = Layers
  } else if (normCombined.includes('cnc') || normCombined.includes('centro de usinagem')) {
    icon = Cpu
  } else if (normCombined.includes('retifica')) {
    icon = Gauge
  } else if (
    normCombined.includes('terceirizado') ||
    normCombined.includes('terceiro') ||
    normCombined.includes('externo')
  ) {
    icon = ExternalLink
  } else if (
    normCombined.includes('compra') ||
    normCombined.includes('materia') ||
    normCombined.includes('aquisicao')
  ) {
    icon = ShoppingCart
  } else if (
    normCombined.includes('corte') ||
    normCombined.includes('serra') ||
    normCombined.includes('plasma') ||
    normCombined.includes('laser')
  ) {
    icon = Scissors
  } else if (
    normCombined.includes('solda') ||
    normCombined.includes('caldeiraria') ||
    normCombined.includes('aquecimento')
  ) {
    icon = Flame
  } else if (
    normCombined.includes('inspec') ||
    normCombined.includes('qualidade') ||
    normCombined.includes('metrologia') ||
    normCombined.includes('medicao')
  ) {
    icon = CheckCircle2
  }

  // Determine border color:
  // If matched a registered machine, use its color. Fallback for unknown sectors is gray (border-l-gray-500 / border-l-zinc-500).
  let borderLeftClass = 'border-l-[4px] border-l-gray-400 dark:border-l-gray-600'
  let bgClass = 'bg-muted text-muted-foreground border-border'

  if (matchedMachine && matchedMachine.color) {
    const colorKey = matchedMachine.color.toLowerCase()
    const borderCls = COLOR_BORDER_MAP[colorKey] || 'border-l-blue-500'
    const bgCls =
      COLOR_BG_MAP[colorKey] || 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    borderLeftClass = `border-l-[4px] ${borderCls}`
    bgClass = bgCls
  } else if (
    normCombined.includes('compra') ||
    normCombined.includes('materia') ||
    normCombined.includes('aquisicao')
  ) {
    borderLeftClass = 'border-l-[4px] border-l-orange-500'
    bgClass = 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
  } else if (
    normCombined.includes('terceirizado') ||
    normCombined.includes('terceiro') ||
    normCombined.includes('externo')
  ) {
    borderLeftClass = 'border-l-[4px] border-l-red-500'
    bgClass = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
  }

  return {
    icon,
    label: sector || 'Operação Mecânica',
    borderLeftClass,
    bgClass,
  }
}

export function FlowchartPreview({ routing, isLoading, machines = [] }: FlowchartPreviewProps) {
  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Gerando e calculando etapas do fluxograma"
        className="bg-muted/30 rounded-xl p-6 min-h-[400px] space-y-4 animate-page-fade"
      >
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="space-y-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="space-y-6 py-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <Card className="w-full max-w-none lg:max-w-md p-4 bg-card rounded-lg border shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex justify-between pt-2 border-t border-border">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </Card>
              {i < 3 && (
                <div className="my-2 relative flex items-center justify-center">
                  <div className="w-px h-6 bg-border" />
                  <ChevronDown className="w-4 h-4 text-muted-foreground/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              )}
            </div>
          ))}
        </div>
        <span className="sr-only">IA calculando etapas industriais do fluxograma...</span>
      </div>
    )
  }

  if (
    !routing ||
    (!routing.routing_steps?.length &&
      !routing.material_purchases?.length &&
      !routing.outsourced_services?.length)
  ) {
    return (
      <div
        aria-live="polite"
        className="bg-muted/30 rounded-xl p-6 min-h-[400px] flex flex-col items-center justify-center text-center animate-page-fade"
      >
        <div className="relative mb-4 flex items-center justify-center" aria-hidden="true">
          {/* Simple dashed-line path / illustration */}
          <div className="absolute inset-0 rounded-full border border-dashed border-muted-foreground/30 scale-125" />
          <Layers3 className="w-16 h-16 text-muted-foreground/40" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground">O fluxograma aparecerá aqui</h3>
        <p className="text-sm text-muted-foreground/70 mt-2 max-w-sm">
          Preencha o nome da peça e os detalhes à esquerda e clique em{' '}
          <strong className="text-foreground">&quot;Gerar Roteamento com IA&quot;</strong> para
          visualizar as etapas industriais, compras e serviços terceirizados.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
            <Cog className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" /> Torno
          </span>
          <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
            <Layers className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" /> Fresa
          </span>
          <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
            <Cpu className="w-3.5 h-3.5 text-violet-500" aria-hidden="true" /> CNC
          </span>
          <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
            <Gauge className="w-3.5 h-3.5 text-green-500" aria-hidden="true" /> Retífica
          </span>
          <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
            <ShoppingCart className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" /> Compra
          </span>
          <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
            <ExternalLink className="w-3.5 h-3.5 text-red-500" aria-hidden="true" /> Terceirizado
          </span>
        </div>
      </div>
    )
  }

  // Calculate totals
  const totalHours =
    routing.routing_steps?.reduce((acc, step) => acc + (Number(step.estimated_hours) || 0), 0) || 0
  const totalSteps = routing.routing_steps?.length || 0
  const totalPurchases = routing.material_purchases?.length || 0
  const totalOutsourced = routing.outsourced_services?.length || 0

  const hasPurchases = routing.material_purchases && routing.material_purchases.length > 0
  const hasSteps = routing.routing_steps && routing.routing_steps.length > 0
  const hasOutsourced = routing.outsourced_services && routing.outsourced_services.length > 0

  let globalStepCounter = 0

  return (
    <div
      aria-live="polite"
      className="bg-muted/30 rounded-xl p-6 min-h-[400px] space-y-6 animate-page-fade"
    >
      {/* Header Summary Card */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Roteamento Gerado</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">{routing.item_name}</h2>
          {routing.notes && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 max-w-xl">
              <strong className="text-foreground">Nota técnica:</strong> {routing.notes}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Tempo Estimado</div>
            <div className="text-lg font-bold text-foreground flex items-center gap-1 justify-end">
              <Clock className="w-4 h-4 text-primary" />
              {totalHours.toFixed(1)}h
            </div>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Operações</div>
            <div className="text-lg font-bold text-foreground">
              {totalSteps + totalPurchases + totalOutsourced}
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Flowchart Sequence */}
      <div className="flex flex-col items-center w-full">
        {/* 1. Material Purchases (bg-orange-50, border-orange-200, shopping cart top-right 20x20 text-orange-500) */}
        {hasPurchases &&
          routing.material_purchases!.map((purchase: MaterialPurchase, idx: number) => {
            const currentItemIndex = globalStepCounter++
            const isVeryLast =
              idx === routing.material_purchases!.length - 1 && !hasSteps && !hasOutsourced

            return (
              <div
                key={`mat-${idx}`}
                style={{ animationDelay: `${currentItemIndex * 100}ms` }}
                className="animate-step-card w-full flex flex-col items-center"
              >
                <div className="w-full max-w-none lg:max-w-md bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-lg p-4 shadow-sm relative mb-[24px]">
                  {/* Shopping cart icon top-right, 20x20px, text-orange-500 */}
                  <div className="absolute top-4 right-4">
                    <ShoppingCart className="w-5 h-5 text-orange-500" />
                  </div>

                  <div className="pr-8">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                        Matéria-Prima / Compra
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-foreground">
                      {purchase.material_name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                      <span className="inline-flex items-center gap-1 font-medium text-foreground">
                        <Package className="w-3.5 h-3.5 text-orange-500" />
                        Quantidade: {purchase.quantity} {purchase.unit}
                      </span>
                      {purchase.supplier && (
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                          Fornecedor: {purchase.supplier}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-orange-200/60 dark:border-orange-900/40 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Aquisição de insumo</span>
                    <span className="text-xs rounded-full px-2 py-0.5 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 font-medium capitalize">
                      {purchase.status || 'Pendente'}
                    </span>
                  </div>
                </div>

                {/* Connecting arrow with ChevronDown */}
                {!isVeryLast && (
                  <div className="relative flex items-center justify-center -mt-3 mb-3">
                    <div className="w-px h-6 bg-border" />
                    <ChevronDown className="w-4 h-4 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted/30" />
                  </div>
                )}
              </div>
            )
          })}

        {/* 2. Routing Steps (Machine operations with step badge and left sector border) */}
        {hasSteps &&
          routing.routing_steps!.map((step: RoutingStep, idx: number) => {
            const secConfig = getSectorConfig(step.sector, step.machine_type, machines)
            const StepIcon = secConfig.icon
            const currentItemIndex = globalStepCounter++
            const isVeryLast = idx === routing.routing_steps!.length - 1 && !hasOutsourced
            const stepNumber = step.step_order || idx + 1

            return (
              <div
                key={`step-${stepNumber}`}
                style={{ animationDelay: `${currentItemIndex * 100}ms` }}
                className="animate-step-card w-full flex flex-col items-center"
              >
                <div
                  className={`w-full max-w-none lg:max-w-md bg-card rounded-lg border border-border p-4 shadow-sm relative mb-[24px] ${secConfig.borderLeftClass}`}
                >
                  {/* Step number badge: absolute, top-left, -left-3, w-8 h-8, rounded-full, bg-primary, text-primary-foreground, flex items-center justify-center, font-bold, text-sm */}
                  <div className="absolute -left-3 top-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
                    {stepNumber}
                  </div>

                  <div className="pl-3">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold rounded-md px-2 py-0.5 border ${secConfig.bgClass}`}
                        >
                          <StepIcon className="w-3.5 h-3.5" />
                          {step.sector}
                        </span>
                        {step.machine_type && (
                          <span className="text-xs text-muted-foreground uppercase font-mono">
                            • {step.machine_type}
                          </span>
                        )}
                      </div>

                      {/* Status badge: text-xs, rounded-full, px-2 py-0.5 */}
                      <span className="text-xs rounded-full px-2 py-0.5 bg-muted text-foreground font-medium capitalize shrink-0">
                        {step.status || 'Pendente'}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      {step.description}
                    </p>

                    {/* Estimated hours: text-xs, text-muted-foreground, with Clock icon 14x14px */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Tempo estimado: {Number(step.estimated_hours).toFixed(1)}h</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Etapa #{stepNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Connecting arrow with ChevronDown */}
                {!isVeryLast && (
                  <div className="relative flex items-center justify-center -mt-3 mb-3">
                    <div className="w-px h-6 bg-border" />
                    <ChevronDown className="w-4 h-4 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted/30" />
                  </div>
                )}
              </div>
            )
          })}

        {/* 3. Outsourced Service Card: bg-red-50, border-red-200. External link icon top-right, 20x20px, text-red-500. */}
        {hasOutsourced &&
          routing.outsourced_services!.map((srv: OutsourcedService, idx: number) => {
            const currentItemIndex = globalStepCounter++
            const isVeryLast = idx === routing.outsourced_services!.length - 1

            return (
              <div
                key={`srv-${idx}`}
                style={{ animationDelay: `${currentItemIndex * 100}ms` }}
                className="animate-step-card w-full flex flex-col items-center"
              >
                <div className="w-full max-w-none lg:max-w-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 shadow-sm relative mb-[24px]">
                  {/* External link icon top-right, 20x20px, text-red-500 */}
                  <div className="absolute top-4 right-4">
                    <ExternalLink className="w-5 h-5 text-red-500" />
                  </div>

                  <div className="pr-8">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                        Serviço Terceirizado
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-foreground">
                      {srv.service_description}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                      {srv.supplier && (
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-red-500" />
                          Prestador: {srv.supplier}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 font-medium text-foreground">
                        Custo Estimado: R$ {Number(srv.estimated_cost).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-red-200/60 dark:border-red-900/40 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Operação Externa</span>
                    {/* Status badge: text-xs, rounded-full, px-2 py-0.5 */}
                    <span className="text-xs rounded-full px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 font-medium capitalize">
                      {srv.status || 'Pendente'}
                    </span>
                  </div>
                </div>

                {/* Connecting arrow with ChevronDown */}
                {!isVeryLast && (
                  <div className="relative flex items-center justify-center -mt-3 mb-3">
                    <div className="w-px h-6 bg-border" />
                    <ChevronDown className="w-4 h-4 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted/30" />
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
