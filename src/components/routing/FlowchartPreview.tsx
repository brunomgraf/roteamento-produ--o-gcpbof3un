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
  ShoppingBag,
  ExternalLink,
  ArrowDown,
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

interface FlowchartPreviewProps {
  routing: GeneratedRouting | null
  isLoading: boolean
}

// Helpers for icon and styling based on sector / machine_type
function getSectorConfig(sector: string, machineType?: string) {
  const norm = (sector + ' ' + (machineType || '')).toLowerCase()

  if (norm.includes('torno') || norm.includes('tornear')) {
    return {
      icon: Cog,
      label: sector || 'Torno',
      bgClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    }
  }
  if (norm.includes('fresa') || norm.includes('fresagem')) {
    return {
      icon: Layers,
      label: sector || 'Fresa',
      bgClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    }
  }
  if (norm.includes('cnc') || norm.includes('centro de usinagem')) {
    return {
      icon: Cpu,
      label: sector || 'CNC',
      bgClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
      badgeClass: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
    }
  }
  if (norm.includes('retifica') || norm.includes('retífica')) {
    return {
      icon: Gauge,
      label: sector || 'Retífica',
      bgClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    }
  }
  if (
    norm.includes('corte') ||
    norm.includes('serra') ||
    norm.includes('plasma') ||
    norm.includes('laser')
  ) {
    return {
      icon: Scissors,
      label: sector || 'Corte / Serra',
      bgClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      badgeClass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
    }
  }
  if (norm.includes('solda') || norm.includes('caldeiraria') || norm.includes('aquecimento')) {
    return {
      icon: Flame,
      label: sector || 'Solda / Caldeiraria',
      bgClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    }
  }
  if (
    norm.includes('inspec') ||
    norm.includes('qualidade') ||
    norm.includes('metrologia') ||
    norm.includes('medicao')
  ) {
    return {
      icon: CheckCircle2,
      label: sector || 'Inspeção / Qualidade',
      bgClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      badgeClass: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
    }
  }

  return {
    icon: Wrench,
    label: sector || 'Operação Mecânica',
    bgClass: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
    badgeClass: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  }
}

export function FlowchartPreview({ routing, isLoading }: FlowchartPreviewProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="space-y-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="space-y-4 py-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-3">
              <Card className="w-full p-4 border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
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
              {i < 4 && <Skeleton className="w-5 h-5 rounded-full" />}
            </div>
          ))}
        </div>
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
      <div className="rounded-xl border border-dashed border-border p-10 text-center bg-muted/20 flex flex-col items-center justify-center min-h-[420px]">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
          <Layers3 className="w-8 h-8 opacity-80" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">O fluxograma aparecerá aqui</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          Preencha o nome da peça e os detalhes à esquerda e clique em{' '}
          <strong className="text-foreground">"Gerar Roteamento com IA"</strong> para visualizar as
          etapas industriais, compras e serviços terceirizados.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
            <Cog className="w-3.5 h-3.5 text-blue-500" /> Usinagem
          </span>
          <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
            <ShoppingBag className="w-3.5 h-3.5 text-orange-500" /> Matéria-Prima
          </span>
          <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
            <ExternalLink className="w-3.5 h-3.5 text-red-500" /> Terceirizados
          </span>
          <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Qualidade
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

  return (
    <div className="space-y-6">
      {/* Header Summary Card */}
      <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
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
      <div className="space-y-4">
        {/* 1. Material Purchases (Special Cards) */}
        {routing.material_purchases && routing.material_purchases.length > 0 && (
          <div className="space-y-3">
            {routing.material_purchases.map((purchase: MaterialPurchase, idx: number) => (
              <div
                key={`mat-${idx}`}
                style={{ animationDelay: `${idx * 80}ms` }}
                className="animate-fade-in flex flex-col items-center"
              >
                <Card className="w-full p-4 border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 transition-colors shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                            Matéria-Prima / Compra
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-mono border-orange-500/40 text-orange-600 dark:text-orange-400"
                          >
                            Aquisição
                          </Badge>
                        </div>
                        <h4 className="text-base font-semibold text-foreground mt-0.5">
                          {purchase.material_name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
                          <span className="inline-flex items-center gap-1 font-medium text-foreground">
                            <Package className="w-3.5 h-3.5 text-orange-500" />
                            Quantidade: {purchase.quantity} {purchase.unit}
                          </span>
                          {purchase.supplier && (
                            <span className="inline-flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5" />
                              Fornecedor: {purchase.supplier}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 shrink-0">
                      {purchase.status || 'Pendente'}
                    </span>
                  </div>
                </Card>

                {/* Arrow connector */}
                <div className="my-2 flex items-center justify-center text-muted-foreground">
                  <ArrowDown className="w-5 h-5 animate-pulse text-muted-foreground/60" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Routing Steps (Factory floor machine operations) */}
        {routing.routing_steps && routing.routing_steps.length > 0 && (
          <div className="space-y-3">
            {routing.routing_steps.map((step: RoutingStep, idx: number) => {
              const secConfig = getSectorConfig(step.sector, step.machine_type)
              const StepIcon = secConfig.icon
              const isLast =
                idx === (routing.routing_steps?.length || 0) - 1 &&
                (!routing.outsourced_services || routing.outsourced_services.length === 0)

              return (
                <div
                  key={`step-${step.step_order || idx}`}
                  style={{
                    animationDelay: `${(idx + (routing.material_purchases?.length || 0)) * 80}ms`,
                  }}
                  className="animate-fade-in flex flex-col items-center"
                >
                  <Card className="w-full p-4 border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Step Order Badge */}
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                          {step.step_order || idx + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            {/* Sector Pill */}
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

                          <p className="text-sm font-medium text-foreground leading-relaxed">
                            {step.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2.5 pt-2 border-t border-border">
                            <span className="inline-flex items-center gap-1 font-medium text-foreground">
                              <Clock className="w-3.5 h-3.5 text-primary" />
                              Tempo estimado: {Number(step.estimated_hours).toFixed(1)}h
                            </span>
                            <span className="text-muted-foreground">
                              Operação #{step.step_order || idx + 1}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-foreground shrink-0 capitalize">
                        {step.status || 'Pendente'}
                      </span>
                    </div>
                  </Card>

                  {/* Flow connector arrow if not the very last item */}
                  {!isLast && (
                    <div className="my-2 flex items-center justify-center text-muted-foreground">
                      <ArrowDown className="w-5 h-5 text-muted-foreground/60" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* 3. Outsourced Services (Special Red Cards) */}
        {routing.outsourced_services && routing.outsourced_services.length > 0 && (
          <div className="space-y-3">
            {routing.outsourced_services.map((srv: OutsourcedService, idx: number) => {
              const isLast = idx === (routing.outsourced_services?.length || 0) - 1

              return (
                <div
                  key={`srv-${idx}`}
                  style={{
                    animationDelay: `${
                      (idx +
                        (routing.material_purchases?.length || 0) +
                        (routing.routing_steps?.length || 0)) *
                      80
                    }ms`,
                  }}
                  className="animate-fade-in flex flex-col items-center"
                >
                  <Card className="w-full p-4 border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-colors shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                          <ExternalLink className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                              Serviço Terceirizado
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] uppercase font-mono border-red-500/40 text-red-600 dark:text-red-400"
                            >
                              Externo
                            </Badge>
                          </div>
                          <h4 className="text-base font-semibold text-foreground mt-0.5">
                            {srv.service_description}
                          </h4>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
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
                      </div>

                      <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 shrink-0">
                        {srv.status || 'Pendente'}
                      </span>
                    </div>
                  </Card>

                  {!isLast && (
                    <div className="my-2 flex items-center justify-center text-muted-foreground">
                      <ArrowDown className="w-5 h-5 text-muted-foreground/60" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
