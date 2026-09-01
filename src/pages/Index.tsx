import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Cpu, Cog, Layers, Gauge, ChevronDown, CheckCircle2, Clock, Play } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

interface MachineInfo {
  type: 'torno' | 'fresa' | 'cnc' | 'retifica'
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

const machines: MachineInfo[] = [
  {
    type: 'torno',
    name: 'Torno',
    desc: 'Usinagem de eixos, roscas, furações axiais e peças cilíndricas.',
    icon: Cog,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    stats: {
      naFila: 4,
      emAndamento: 2,
      concluidos: 12,
    },
  },
  {
    type: 'fresa',
    name: 'Fresa',
    desc: 'Usinagem de faces planas, ranhuras, bolsões e engrenagens.',
    icon: Layers,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    stats: {
      naFila: 3,
      emAndamento: 1,
      concluidos: 9,
    },
  },
  {
    type: 'cnc',
    name: 'CNC',
    desc: 'Operações complexas multieixo de alta precisão e repetibilidade.',
    icon: Cpu,
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-500/10',
    stats: {
      naFila: 6,
      emAndamento: 3,
      concluidos: 15,
    },
  },
  {
    type: 'retifica',
    name: 'Retífica',
    desc: 'Acabamento fino, tolerâncias micrométricas e superfícies espelhadas.',
    icon: Gauge,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-500/10',
    stats: {
      naFila: 2,
      emAndamento: 1,
      concluidos: 8,
    },
  },
]

type SectorType = 'Torno' | 'Fresa' | 'CNC' | 'Retifica' | 'Terceirizado' | 'Compra'
type StatusType = 'Aguardando' | 'Em Producao' | 'Concluido' | 'Com Material'

interface RecentItem {
  id: string
  code: string
  name: string
  setor: SectorType
  status: StatusType
  data: string
}

const recentItems: RecentItem[] = [
  {
    id: '1',
    code: 'ORD-1042',
    name: 'Eixo Principal de Transmissão Ø45mm',
    setor: 'Torno',
    status: 'Em Producao',
    data: 'Hoje, 10:30',
  },
  {
    id: '2',
    code: 'ORD-1041',
    name: 'Placa Base com Canais T e Furações',
    setor: 'Fresa',
    status: 'Aguardando',
    data: 'Hoje, 09:15',
  },
  {
    id: '3',
    code: 'ORD-1040',
    name: 'Flange de Fixação Multieixo CNC',
    setor: 'CNC',
    status: 'Em Producao',
    data: 'Hoje, 08:45',
  },
  {
    id: '4',
    code: 'ORD-1039',
    name: 'Guia Linear de Precisão Micrométrica',
    setor: 'Retifica',
    status: 'Concluido',
    data: 'Ontem, 17:20',
  },
  {
    id: '5',
    code: 'ORD-1038',
    name: 'Tratamento Térmico por Indução (Nitretação)',
    setor: 'Terceirizado',
    status: 'Com Material',
    data: 'Ontem, 15:40',
  },
  {
    id: '6',
    code: 'ORD-1037',
    name: 'Bloco de Alumínio 7075 T651 (Tarugo)',
    setor: 'Compra',
    status: 'Concluido',
    data: 'Ontem, 14:10',
  },
  {
    id: '7',
    code: 'ORD-1036',
    name: 'Bucha Cônica de Ajuste com Rosca M24',
    setor: 'Torno',
    status: 'Aguardando',
    data: 'Ontem, 11:05',
  },
  {
    id: '8',
    code: 'ORD-1035',
    name: 'Eixo Sem-Fim Passo 4mm Aço 8620',
    setor: 'Torno',
    status: 'Em Producao',
    data: 'Ontem, 09:30',
  },
  {
    id: '9',
    code: 'ORD-1034',
    name: 'Suporte de Fixação Usinado em Centro CNC',
    setor: 'CNC',
    status: 'Aguardando',
    data: 'Anteontem, 16:45',
  },
  {
    id: '10',
    code: 'ORD-1033',
    name: 'Anel Espaçador Retificado 0.005mm',
    setor: 'Retifica',
    status: 'Concluido',
    data: 'Anteontem, 14:20',
  },
  {
    id: '11',
    code: 'ORD-1032',
    name: 'Engrenagem Cônica Helicoidal Módulo 3',
    setor: 'Fresa',
    status: 'Em Producao',
    data: 'Anteontem, 11:15',
  },
  {
    id: '12',
    code: 'ORD-1031',
    name: 'Tarugo Latão CLA Ø38mm x 1000mm',
    setor: 'Compra',
    status: 'Concluido',
    data: 'Anteontem, 08:30',
  },
  {
    id: '13',
    code: 'ORD-1030',
    name: 'Eixo Estriado 6 Vias SAE 4340',
    setor: 'Torno',
    status: 'Com Material',
    data: '3 dias atrás',
  },
  {
    id: '14',
    code: 'ORD-1029',
    name: 'Câmara de Válvula Hidráulica 4 Vias',
    setor: 'CNC',
    status: 'Concluido',
    data: '3 dias atrás',
  },
  {
    id: '15',
    code: 'ORD-1028',
    name: 'Tratamento Térmico Cementação e Têmpera',
    setor: 'Terceirizado',
    status: 'Concluido',
    data: '4 dias atrás',
  },
]

const sectorChipClasses: Record<SectorType, string> = {
  Torno: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Fresa: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  CNC: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  Retifica: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  Terceirizado: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  Compra: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
}

const statusBadgeClasses: Record<StatusType, string> = {
  Aguardando: 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300',
  'Em Producao': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Concluido: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  'Com Material': 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
}

const PAGE_SIZE = 10

export default function Index() {
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE)

  // Memoized machine calculations and aggregated stats for performance
  const machineTotals = useMemo(() => {
    return machines.reduce(
      (acc, machine) => {
        return {
          totalFila: acc.totalFila + machine.stats.naFila,
          totalEmAndamento: acc.totalEmAndamento + machine.stats.emAndamento,
          totalConcluidos: acc.totalConcluidos + machine.stats.concluidos,
        }
      },
      { totalFila: 0, totalEmAndamento: 0, totalConcluidos: 0 },
    )
  }, [])

  const machineList = useMemo(() => {
    return machines.map((m) => ({
      ...m,
      totalOperacoes: m.stats.naFila + m.stats.emAndamento + m.stats.concluidos,
    }))
  }, [])

  // Pagination for recent items: 10 per page with "Carregar mais"
  const visibleItems = useMemo(() => {
    return recentItems.slice(0, visibleCount)
  }, [visibleCount])

  const hasMoreItems = visibleCount < recentItems.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, recentItems.length))
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {machineList.map((m, index) => {
            const Icon = m.icon
            const delay = `${index * 50}ms`
            return (
              <Card
                key={m.type}
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
                    <Link to={`/maquina/${m.type}`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Tabela de Itens Recentes com Paginação */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Itens Recentes</h2>
            <p className="text-xs text-muted-foreground">
              Mostrando {visibleItems.length} de {recentItems.length} ordens de fabricação
              registradas
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
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
                    <TableCell className="text-sm font-medium text-foreground py-3">
                      {item.name}
                    </TableCell>
                    <TableCell className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${sectorChipClasses[item.setor]}`}
                      >
                        {item.setor}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClasses[item.status]}`}
                      >
                        {item.status}
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

          {/* Paginação: Botão Carregar Mais */}
          {hasMoreItems && (
            <div className="p-4 border-t border-border flex items-center justify-center bg-muted/20">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                className="gap-2 min-h-[44px] h-11 px-6 font-medium text-sm focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Carregar mais itens recentes (mostrando ${visibleItems.length} de ${recentItems.length})`}
              >
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
                <span>Carregar mais ({recentItems.length - visibleItems.length} restantes)</span>
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
