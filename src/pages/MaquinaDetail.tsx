import React from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Cog,
  Layers,
  Cpu,
  Gauge,
  AlertCircle,
  Search,
  Clock,
  Play,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  PlusCircle,
  Inbox,
  Filter,
  Layers as LayersIcon,
  Timer,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useMachineQueue } from '@/hooks/useMachineQueue'
import type { MachineQueueItem, MachineQueueStatus } from '@/services/machineQueueService'
import { cn } from '@/lib/utils'

interface MachineConfig {
  name: string
  subtitle: string
  description: string
  icon: React.ElementType
  colorClass: string
  bgLightClass: string
  borderColorClass: string
}

const machineConfig: Record<string, MachineConfig> = {
  torno: {
    name: 'Torno',
    subtitle: 'Fila de Produção: Torno',
    description:
      'Fila de serviço para usinagem de eixos, roscas, furações axiais e peças cilíndricas.',
    icon: Cog,
    colorClass: 'text-blue-500 dark:text-blue-400',
    bgLightClass: 'bg-blue-500/10 dark:bg-blue-500/20',
    borderColorClass: 'border-blue-500/30',
  },
  fresa: {
    name: 'Fresa',
    subtitle: 'Fila de Produção: Fresa',
    description:
      'Fila de serviço para fresamento de ranhuras, blocos, faces e usinagens prismáticas.',
    icon: Layers,
    colorClass: 'text-amber-500 dark:text-amber-400',
    bgLightClass: 'bg-amber-500/10 dark:bg-amber-500/20',
    borderColorClass: 'border-amber-500/30',
  },
  cnc: {
    name: 'CNC',
    subtitle: 'Fila de Produção: CNC',
    description:
      'Fila de serviço para usinagem multieixo CNC de alta precisão, tolerâncias rígidas e perfis 3D.',
    icon: Cpu,
    colorClass: 'text-violet-500 dark:text-violet-400',
    bgLightClass: 'bg-violet-500/10 dark:bg-violet-500/20',
    borderColorClass: 'border-violet-500/30',
  },
  retifica: {
    name: 'Retífica',
    subtitle: 'Fila de Produção: Retífica',
    description:
      'Fila de serviço para acabamento fino, retificação cilíndrica/plana e tolerâncias micrométricas.',
    icon: Gauge,
    colorClass: 'text-emerald-500 dark:text-emerald-400',
    bgLightClass: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    borderColorClass: 'border-emerald-500/30',
  },
}

const filterOptions: Array<{ key: 'todos' | MachineQueueStatus; label: string }> = [
  { key: 'todos', label: 'Todos' },
  { key: 'aguardando', label: 'Aguardando' },
  { key: 'em_andamento', label: 'Em Andamento' },
  { key: 'concluido', label: 'Concluído' },
]

export default function MaquinaDetail() {
  const { type } = useParams<{ type: string }>()
  const currentKey = type ? type.toLowerCase().trim() : ''
  const machine = currentKey in machineConfig ? machineConfig[currentKey] : null

  const {
    items,
    loading,
    error,
    updatingIds,
    refresh,
    handleUpdateStatus,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    stats,
  } = useMachineQueue(currentKey)

  // 1. Invalid Machine Type State
  if (!machine) {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto py-6">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
        </Button>

        <Card className="border-destructive/30 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive mb-1">
              <AlertCircle className="w-5 h-5" />
              <CardTitle className="text-xl">Máquina não encontrada</CardTitle>
            </div>
            <CardDescription className="text-base text-foreground/70">
              O tipo de máquina{' '}
              <span className="font-semibold text-foreground">&quot;{type}&quot;</span> não é válido
              no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              As estações de trabalho e máquinas cadastradas são:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(machineConfig).map(([key, item]) => {
                const Icon = item.icon
                return (
                  <Link
                    key={key}
                    to={`/maquina/${key}`}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border border-border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all text-center gap-2"
                  >
                    <Icon className="w-6 h-6 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{item.name}</span>
                  </Link>
                )
              })}
            </div>
            <div className="pt-2">
              <Button asChild variant="outline" className="gap-2">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const Icon = machine.icon

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refresh()}
          disabled={loading}
          className="gap-2 h-8 text-xs"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
          <span>Atualizar Fila</span>
        </Button>
      </div>

      {/* 1. Header: Machine icon, title, description, and status summary */}
      <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border',
                machine.bgLightClass,
                machine.colorClass,
                machine.borderColorClass,
              )}
            >
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {machine.name}
                </h1>
                <Badge variant="outline" className="font-mono text-xs uppercase px-2 py-0.5">
                  Estação /{currentKey}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{machine.description}</p>
            </div>
          </div>

          {/* Status summary pill counts */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-muted/40 p-2.5 rounded-xl border border-border/80 self-start md:self-center shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs sm:text-sm font-medium">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>
                <strong className="font-bold text-foreground mr-1">{stats.aguardando}</strong>
                na fila
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-xs sm:text-sm font-medium">
              <Play className="w-4 h-4 text-blue-500 fill-blue-500/20" />
              <span>
                <strong className="font-bold text-foreground mr-1">{stats.emAndamento}</strong>
                em andamento
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs sm:text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                <strong className="font-bold text-foreground mr-1">{stats.concluido}</strong>
                concluídos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar: Status filter and search input (flex-col mobile, flex-row desktop) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3 sm:p-4 rounded-xl shadow-sm">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mr-1 font-medium shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Filtrar:</span>
          </div>
          {filterOptions.map((opt) => {
            const isActive = statusFilter === opt.key
            return (
              <Button
                key={opt.key}
                size="sm"
                variant={isActive ? 'default' : 'outline'}
                onClick={() => setStatusFilter(opt.key)}
                className={cn(
                  'h-8 text-xs font-medium shrink-0 transition-all',
                  isActive
                    ? 'shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {opt.label}
              </Button>
            )
          })}
        </div>

        {/* Search Input with debounce */}
        <div className="relative w-full sm:w-72 md:w-80 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome da peça..."
            className="pl-9 h-9 text-xs sm:text-sm bg-background"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground px-1 py-0.5 rounded"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* 3. Service Queue Content Area */}
      <div className="w-full max-w-2xl mx-auto space-y-4">
        {/* Header with count */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <LayersIcon className="w-4 h-4 text-primary" />
            Fila Sequenciada da Estação
          </h2>
          <span className="text-xs text-muted-foreground">
            {items.length} {items.length === 1 ? 'ordem listada' : 'ordens listadas'}
          </span>
        </div>

        {/* STATE 1: LOADING (Skeleton cards) */}
        {loading && (
          <div className="space-y-4 animate-fade-in">
            {[1, 2, 3].map((idx) => (
              <Card key={idx} className="p-5 border-border shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-3.5 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-14 w-full rounded-md" />
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* STATE 2: ERROR */}
        {!loading && error && (
          <Card className="border-destructive/40 bg-destructive/5 p-8 text-center animate-fade-in shadow-sm">
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Erro ao carregar fila</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Ocorreu uma falha na comunicação ao tentar carregar as ordens de serviço do{' '}
              {machine.name}.
            </p>
            <Button
              onClick={() => refresh()}
              variant="default"
              size="sm"
              className="mt-4 gap-2 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar novamente
            </Button>
          </Card>
        )}

        {/* STATE 3: EMPTY (No items at all OR no search results) */}
        {!loading && !error && items.length === 0 && (
          <>
            {debouncedSearchQuery.trim() !== '' || statusFilter !== 'todos' ? (
              <Card className="border-border p-10 text-center animate-fade-in bg-muted/20">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  Nenhum resultado para &quot;{debouncedSearchQuery || statusFilter}&quot;
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                  Nenhuma ordem de serviço foi encontrada com os filtros atuais aplicados para esta
                  máquina.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('')
                      setStatusFilter('todos')
                    }}
                    className="text-xs"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="border-dashed border-border p-10 text-center animate-fade-in bg-card">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Nenhum serviço na fila</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  Esta máquina não possui ordens de fabricação pendentes no momento. Cadastre um
                  novo item para gerar um roteamento automático.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Button asChild size="default" className="gap-2 shadow-sm">
                    <Link to="/novo-item">
                      <PlusCircle className="w-4 h-4" />
                      Cadastrar novo item
                    </Link>
                  </Button>
                  <Button variant="outline" size="default" asChild>
                    <Link to="/">Voltar ao Dashboard</Link>
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}

        {/* STATE 4: SUCCESS (Service Queue Cards with engineering order) */}
        {!loading && !error && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item, index) => {
              const position = index + 1
              const isUpdating = !!updatingIds[item.id]

              return (
                <QueueCard
                  key={item.id}
                  item={item}
                  position={position}
                  isUpdating={isUpdating}
                  onUpdateStatus={handleUpdateStatus}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

interface QueueCardProps {
  item: MachineQueueItem
  position: number
  isUpdating: boolean
  onUpdateStatus: (id: string, newStatus: MachineQueueStatus) => Promise<boolean>
}

function QueueCard({ item, position, isUpdating, onUpdateStatus }: QueueCardProps) {
  // Status styling definitions
  const statusConfig: Record<
    MachineQueueStatus,
    { label: string; badgeClass: string; dotClass: string }
  > = {
    aguardando: {
      label: 'Aguardando',
      badgeClass:
        'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
      dotClass: 'bg-amber-500',
    },
    em_andamento: {
      label: 'Em Andamento',
      badgeClass:
        'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800',
      dotClass: 'bg-blue-500 animate-pulse',
    },
    concluido: {
      label: 'Concluído',
      badgeClass:
        'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
      dotClass: 'bg-emerald-500',
    },
  }

  const currentStatusInfo = statusConfig[item.status] || statusConfig.aguardando

  return (
    <Card
      className={cn(
        'border-border shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden animate-fade-in',
        item.status === 'em_andamento' && 'border-blue-500/40 bg-blue-500/[0.02]',
        item.status === 'concluido' && 'opacity-80 bg-muted/20',
      )}
    >
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Card Header: Position badge, Item name + link, status badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            {/* Position number in queue */}
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 border shadow-xs',
                item.status === 'em_andamento'
                  ? 'bg-blue-600 text-white border-blue-700 dark:bg-blue-600'
                  : 'bg-muted text-muted-foreground border-border',
              )}
            >
              #{position}
            </div>

            {/* Item name and step sequence */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors leading-snug">
                  {item.itemName}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="font-semibold text-primary">Etapa {item.stepOrder}</span>
                <span>•</span>
                <span>Setor: {item.sector}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            variant="outline"
            className={cn(
              'px-2.5 py-1 text-xs font-semibold shrink-0 gap-1.5 border shadow-2xs',
              currentStatusInfo.badgeClass,
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', currentStatusInfo.dotClass)} />
            {currentStatusInfo.label}
          </Badge>
        </div>

        {/* Step Description Box */}
        <div className="rounded-lg bg-muted/40 p-3.5 border border-border/80 text-sm">
          <p className="text-foreground leading-relaxed font-medium">{item.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium text-foreground/80">
              <Timer className="w-3.5 h-3.5 text-primary" />
              Tempo estimado: <strong>{item.estimatedHours}h</strong>
            </span>
          </div>
        </div>

        {/* Previous and Next Step Indicators (Engineering Workflow context) */}
        {(item.previousStep || item.nextStep) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {/* Previous Step */}
            <div className="p-2.5 rounded-md border border-border/60 bg-muted/20 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1">
                Etapa Anterior
              </span>
              {item.previousStep ? (
                <div className="flex items-start gap-1.5 text-foreground/90">
                  <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="line-clamp-2">
                    <strong className="text-foreground">{item.previousStep.sector}:</strong>{' '}
                    {item.previousStep.description}
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground italic flex items-center gap-1">
                  — Início do processo (1ª etapa)
                </span>
              )}
            </div>

            {/* Next Step */}
            <div className="p-2.5 rounded-md border border-border/60 bg-muted/20 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1">
                Próxima Etapa
              </span>
              {item.nextStep ? (
                <div className="flex items-start gap-1.5 text-foreground/90">
                  <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <div className="line-clamp-2">
                    <strong className="text-foreground">{item.nextStep.sector}:</strong>{' '}
                    {item.nextStep.description}
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground italic flex items-center gap-1">
                  — Conclusão final da peça
                </span>
              )}
            </div>
          </div>
        )}

        {/* Card Footer: Action button per status */}
        <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span>Ordem de engenharia:</span>
            <strong className="text-foreground font-mono">#{item.stepOrder}</strong>
          </div>

          <div className="flex items-center gap-2">
            {/* Action 1: Iniciar (Aguardando -> Em Andamento) */}
            {item.status === 'aguardando' && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus(item.id, 'em_andamento')}
                disabled={isUpdating}
                className="gap-1.5 h-8 px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs font-semibold"
              >
                {isUpdating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white" />
                )}
                <span>Iniciar Produção</span>
              </Button>
            )}

            {/* Action 2: Concluir (Em Andamento -> Concluido) */}
            {item.status === 'em_andamento' && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus(item.id, 'concluido')}
                disabled={isUpdating}
                className="gap-1.5 h-8 px-4 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold"
              >
                {isUpdating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Concluir Operação</span>
              </Button>
            )}

            {/* Completed state badge & re-open option */}
            {item.status === 'concluido' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Operação Finalizada
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onUpdateStatus(item.id, 'em_andamento')}
                  disabled={isUpdating}
                  className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                  title="Reabrir operação"
                >
                  {isUpdating ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <span>Reabrir</span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
