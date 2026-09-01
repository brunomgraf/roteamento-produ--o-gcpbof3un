import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Cpu,
  Cog,
  Layers,
  Gauge,
  Wrench,
  Factory,
  ChevronDown,
  CheckCircle2,
  Clock,
  Play,
  RotateCw,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import pb from '@/lib/pocketbase/client'
import type { Machine } from '@/types/machine'
import { normalizeStatus } from '@/services/machineQueueService'

const ICON_MAP: Record<string, React.ElementType> = {
  Cog,
  Layers,
  Cpu,
  Gauge,
  Wrench,
  Factory,
}

function getIconComponent(iconName?: string): React.ElementType {
  if (!iconName) return Cog
  return ICON_MAP[iconName] || Cog
}

const COLOR_STYLES_MAP: Record<string, { text: string; bg: string }> = {
  blue: { text: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10 dark:bg-blue-500/20' },
  amber: { text: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10 dark:bg-amber-500/20' },
  violet: {
    text: 'text-violet-500 dark:text-violet-400',
    bg: 'bg-violet-500/10 dark:bg-violet-500/20',
  },
  green: { text: 'text-green-500 dark:text-green-400', bg: 'bg-green-500/10 dark:bg-green-500/20' },
  red: { text: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10 dark:bg-red-500/20' },
  orange: {
    text: 'text-orange-500 dark:text-orange-400',
    bg: 'bg-orange-500/10 dark:bg-orange-500/20',
  },
  pink: { text: 'text-pink-500 dark:text-pink-400', bg: 'bg-pink-500/10 dark:bg-pink-500/20' },
  cyan: { text: 'text-cyan-500 dark:text-cyan-400', bg: 'bg-cyan-500/10 dark:bg-cyan-500/20' },
}

function getColorStyles(color?: string) {
  const c = (color || 'blue').toLowerCase()
  return COLOR_STYLES_MAP[c] || COLOR_STYLES_MAP.blue
}

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  torno: 'Usinagem de eixos, roscas, furações axiais e peças cilíndricas.',
  fresa: 'Usinagem de faces planas, ranhuras, bolsões e engrenagens.',
  cnc: 'Operações complexas multieixo de alta precisão e repetibilidade.',
  retifica: 'Acabamento fino, tolerâncias micrométricas e superfícies espelhadas.',
}

interface DynamicMachineCard {
  id: string
  slug: string
  name: string
  desc: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  stats: {
    naFila: number
    emAndamento: number
    concluidos: number
  }
}

type SectorType = 'Torno' | 'Fresa' | 'CNC' | 'Retifica' | 'Terceirizado' | 'Compra'
type StatusType = 'Aguardando' | 'Em Producao' | 'Concluido' | 'Com Material'

interface RecentItem {
  id: string
  code: string
  name: string
  descricao?: string
  setor: string
  status: string
  statusLabel: string
  data: string
}

const sectorChipClasses: Record<string, string> = {
  Torno: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  torno: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Fresa: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  fresa: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  CNC: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  cnc: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  Retifica: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  retifica: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  Retífica: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  Terceirizado: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  terceirizado: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  Compra: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  compra: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  Corte: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  corte: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  Solda: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  solda: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  Inspeção: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  inspecao: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
}

function getSectorChipClass(sector?: string): string {
  if (!sector) return 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300'
  return (
    sectorChipClasses[sector] ||
    sectorChipClasses[sector.toLowerCase()] ||
    'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300'
  )
}

function formatRelativeDate(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const timeStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    const isToday =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()

    if (isToday) {
      return `Hoje, ${timeStr}`
    }

    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday =
      d.getFullYear() === yesterday.getFullYear() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getDate() === yesterday.getDate()

    if (isYesterday) {
      return `Ontem, ${timeStr}`
    }

    if (diffDays === 2) {
      return `Anteontem, ${timeStr}`
    }

    if (diffDays > 2 && diffDays <= 7) {
      return `${diffDays} dias atrás`
    }

    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function getItemStatusDetails(status?: string): { label: string; badgeClass: string } {
  const norm = (status || '').toLowerCase().trim()
  if (
    norm === 'em_producao' ||
    norm === 'em producao' ||
    norm === 'em_andamento' ||
    norm === 'em andamento'
  ) {
    return {
      label: 'Em Produção',
      badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    }
  }
  if (norm === 'finalizado' || norm === 'concluido' || norm === 'concluído') {
    return {
      label: 'Finalizado',
      badgeClass: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    }
  }
  if (norm === 'com_material' || norm === 'com material') {
    return {
      label: 'Com Material',
      badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    }
  }
  return {
    label: 'Pendente',
    badgeClass: 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300',
  }
}

const PAGE_SIZE = 10

export default function Index() {
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE)
  const [machinesData, setMachinesData] = useState<DynamicMachineCard[]>([])
  const [recentItemsList, setRecentItemsList] = useState<RecentItem[]>([])
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(true)
  const [dashboardError, setDashboardError] = useState<string | null>(null)

  const loadDashboardData = useCallback(async () => {
    try {
      setLoadingDashboard(true)
      setDashboardError(null)

      // 1. Fetch active machines from PocketBase
      const activeMachines = await pb.collection('machines').getFullList<Machine>({
        filter: 'active = true',
        sort: '+created',
      })

      // 2. Fetch all routing steps
      const routingSteps = await pb.collection('routing_steps').getFullList({
        fields: 'id,item_id,machine_type,sector,step_order,status,updated,created',
      })

      // 3. Fetch all itens from PocketBase (sorted newest first)
      const rawItens = await pb.collection('itens').getFullList({
        sort: '-created',
      })

      // Build a map of item_id -> first/active step sector
      const itemStepsMap = new Map<string, any[]>()
      for (const step of routingSteps) {
        if (step.item_id) {
          const list = itemStepsMap.get(step.item_id) || []
          list.push(step)
          itemStepsMap.set(step.item_id, list)
        }
      }

      // Format items list for table
      const formattedItems: RecentItem[] = rawItens.map((item, idx) => {
        const itemSteps = (itemStepsMap.get(item.id) || []).sort(
          (a, b) => (Number(a.step_order) || 0) - (Number(b.step_order) || 0),
        )

        // Find current/relevant sector (active or first step sector)
        let sectorDisplay = 'Geral'
        if (itemSteps.length > 0) {
          const inProgressStep = itemSteps.find((s) => normalizeStatus(s.status) === 'em_andamento')
          const firstStep = itemSteps[0]
          const targetStep = inProgressStep || firstStep
          sectorDisplay = targetStep.sector || targetStep.machine_type || 'Geral'
        }

        const code = `ORD-${1000 + (rawItens.length - idx)}`
        const statusInfo = getItemStatusDetails(item.status)

        return {
          id: item.id,
          code,
          name: item.nome || 'Item sem nome',
          descricao: item.descricao,
          setor: sectorDisplay,
          status: item.status || 'pendente',
          statusLabel: statusInfo.label,
          data: formatRelativeDate(item.updated || item.created),
        }
      })

      setRecentItemsList(formattedItems)

      // Helper for "today" in local date string format YYYY-MM-DD
      const now = new Date()
      const todayYear = now.getFullYear()
      const todayMonth = now.getMonth()
      const todayDate = now.getDate()

      const isToday = (dateStr?: string) => {
        if (!dateStr) return false
        const d = new Date(dateStr)
        return (
          d.getFullYear() === todayYear && d.getMonth() === todayMonth && d.getDate() === todayDate
        )
      }

      // 4. Compute stats per machine
      const calculatedCards: DynamicMachineCard[] = activeMachines.map((m) => {
        const slug = m.slug?.toLowerCase().trim() || ''
        const mSteps = routingSteps.filter(
          (step) => (step.machine_type || '').toLowerCase().trim() === slug,
        )

        const naFila = mSteps.filter((s) => normalizeStatus(s.status) === 'aguardando').length
        const emAndamento = mSteps.filter(
          (s) => normalizeStatus(s.status) === 'em_andamento',
        ).length
        const concluidos = mSteps.filter((s) => {
          if (normalizeStatus(s.status) !== 'concluido') return false
          const timestamp = s.updated || s.created
          return isToday(timestamp)
        }).length

        const colorStyles = getColorStyles(m.color)
        const iconComp = getIconComponent(m.icon)
        const desc = DEFAULT_DESCRIPTIONS[slug] || `Estação de trabalho operacional para ${m.name}.`

        return {
          id: m.id,
          slug: m.slug,
          name: m.name,
          desc,
          icon: iconComp,
          iconColor: colorStyles.text,
          iconBg: colorStyles.bg,
          stats: {
            naFila,
            emAndamento,
            concluidos,
          },
        }
      })

      setMachinesData(calculatedCards)
    } catch (err: any) {
      console.error('Erro ao carregar dados do dashboard:', err)
      setDashboardError(err?.message || 'Falha ao carregar os dados do dashboard.')
    } finally {
      setLoadingDashboard(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  // Memoized machine calculations and aggregated stats for performance
  const machineTotals = useMemo(() => {
    return machinesData.reduce(
      (acc, machine) => {
        return {
          totalFila: acc.totalFila + machine.stats.naFila,
          totalEmAndamento: acc.totalEmAndamento + machine.stats.emAndamento,
          totalConcluidos: acc.totalConcluidos + machine.stats.concluidos,
        }
      },
      { totalFila: 0, totalEmAndamento: 0, totalConcluidos: 0 },
    )
  }, [machinesData])

  // Pagination for recent items: 10 per page with "Carregar mais"
  const visibleItems = useMemo(() => {
    return recentItemsList.slice(0, visibleCount)
  }, [recentItemsList, visibleCount])

  const hasMoreItems = visibleCount < recentItemsList.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, recentItemsList.length))
  }

  return (
    <div className="space-y-8 pb-16 md:pb-0 animate-page-fade">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard de Produção</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visão geral de todas as máquinas, fluxo operacional e controle da fábrica.
          </p>
        </div>

        {/* Botão de Ação Rápida no Desktop com touch target h-11 */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            asChild
            size="lg"
            className="gap-2 shadow-sm min-h-[44px] h-11 px-5 focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Cadastrar novo item no sistema"
          >
            <Link to="/novo-item">
              <Plus className="w-5 h-5" aria-hidden="true" />
              Novo Item
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat Cards (resumo de máquinas) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Resumo das Máquinas
          </h2>
          {!loadingDashboard && !dashboardError && machinesData.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                Total na Fila: {machineTotals.totalFila}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-blue-400">
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                Em Andamento: {machineTotals.totalEmAndamento}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                Concluídos: {machineTotals.totalConcluidos}
              </span>
            </div>
          )}{' '}
        </div>

        {/* Loading State */}
        {loadingDashboard && (
          <div
            role="status"
            aria-live="polite"
            aria-label="Carregando resumo das máquinas"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-5 border-border shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <Skeleton className="w-9 h-9 rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <div className="pt-2 border-t border-border space-y-2">
                  <Skeleton className="h-6 w-full rounded-full" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
              </Card>
            ))}
            <span className="sr-only">Carregando máquinas...</span>
          </div>
        )}

        {/* Error State */}
        {!loadingDashboard && dashboardError && (
          <Card className="border-destructive/30 bg-destructive/5 p-6 text-center max-w-lg mx-auto space-y-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">Erro ao carregar máquinas</h3>
              <p className="text-xs text-muted-foreground">{dashboardError}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadDashboardData}
              className="gap-2 min-h-[44px] h-11 px-4 text-xs font-medium"
            >
              <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Tentar novamente</span>
            </Button>
          </Card>
        )}

        {/* Empty State */}
        {!loadingDashboard && !dashboardError && machinesData.length === 0 && (
          <Card className="border-dashed border-2 border-border p-10 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Factory className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Nenhuma máquina cadastrada</h3>
              <p className="text-xs text-muted-foreground">
                Cadastre máquinas e estações de trabalho para visualizar as estatísticas de
                produção.
              </p>
            </div>
            <Button
              asChild
              className="gap-2 min-h-[44px] h-11 px-5 shadow-sm text-xs font-semibold"
            >
              <Link to="/maquinas">
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Cadastrar Máquina</span>
              </Link>
            </Button>
          </Card>
        )}

        {/* Dynamic Machine Cards */}
        {!loadingDashboard && !dashboardError && machinesData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {machinesData.map((m, index) => {
              const Icon = m.icon
              const delay = `${index * 50}ms`
              return (
                <Card
                  key={m.id || m.slug}
                  style={{
                    animationDelay: delay,
                    animationFillMode: 'backwards',
                  }}
                  className="p-5 border-border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-fade-in-stagger flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${m.iconBg} ${m.iconColor}`}
                        aria-hidden="true"
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <CardHeader className="p-0 mb-3 space-y-1">
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {m.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground line-clamp-2">{m.desc}</p>
                    </CardHeader>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Stats em linha flex com badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border">
                      <span className="inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <span>Fila:</span>
                        <strong className="font-bold">{m.stats.naFila}</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        <span>Andamento:</span>
                        <strong className="font-bold">{m.stats.emAndamento}</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 font-medium bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
                        <span>Concluídos:</span>
                        <strong className="font-bold">{m.stats.concluidos}</strong>
                      </span>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full justify-center text-xs mt-2 min-h-[44px] h-11 focus-visible:ring-2 focus-visible:ring-ring font-medium"
                      aria-label={`Ver detalhes da fila da máquina ${m.name}`}
                    >
                      <Link to={`/maquina/${m.slug}`}>Ver Detalhes</Link>
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Tabela de Itens Recentes com Paginação */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Itens Recentes</h2>
            <p className="text-xs text-muted-foreground">
              {loadingDashboard
                ? 'Carregando itens cadastrados...'
                : recentItemsList.length > 0
                  ? `Mostrando ${visibleItems.length} de ${recentItemsList.length} ordens de fabricação registradas`
                  : 'Nenhum item cadastrado no sistema ainda.'}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
          {loadingDashboard ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-48 flex-1" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : recentItemsList.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Nenhum item de produção cadastrado até o momento.
              </p>
              <Button asChild size="sm" className="gap-2 min-h-[44px] h-11 px-5">
                <Link to="/novo-item">
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Cadastrar Primeiro Item
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted">
                <TableRow className="hover:bg-muted/80 border-b border-border">
                  <TableHead className="text-xs uppercase text-muted-foreground font-semibold">
                    Código
                  </TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-semibold">
                    Descrição do Item
                  </TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-semibold">
                    Setor
                  </TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-semibold text-right">
                    Atualização
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleItems.map((item, index) => {
                  const rowDelay = `${Math.min(index * 30, 300)}ms`
                  const statusInfo = getItemStatusDetails(item.status)
                  return (
                    <TableRow
                      key={item.id}
                      style={{
                        animationDelay: rowDelay,
                        animationFillMode: 'backwards',
                      }}
                      className="border-b border-border hover:bg-muted/50 transition-colors animate-fade-in-stagger"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-foreground py-3">
                        {item.code}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="text-sm font-medium text-foreground">{item.name}</div>
                        {item.descricao && (
                          <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {item.descricao}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getSectorChipClass(
                            item.setor,
                          )}`}
                        >
                          {item.setor}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.badgeClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground py-3">
                        {item.data}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {/* Paginação: Botão Carregar Mais */}
          {!loadingDashboard && hasMoreItems && (
            <div className="p-4 border-t border-border flex items-center justify-center bg-muted/20">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                className="gap-2 min-h-[44px] h-11 px-6 font-medium text-sm focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Carregar mais itens recentes (mostrando ${visibleItems.length} de ${recentItemsList.length})`}
              >
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
                <span>
                  Carregar mais ({recentItemsList.length - visibleItems.length} restantes)
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Botão de Ação Rápida Fixo no Mobile com touch target adequado */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button
          asChild
          size="lg"
          className="rounded-full shadow-lg gap-2 min-h-[44px] h-14 px-6 text-base font-semibold focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Cadastrar novo item"
        >
          <Link to="/novo-item">
            <Plus className="w-6 h-6" aria-hidden="true" />
            Novo Item
          </Link>
        </Button>
      </div>
    </div>
  )
}
