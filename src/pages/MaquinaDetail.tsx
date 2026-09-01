import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Cog, Layers, Cpu, Gauge, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const machineConfig: Record<
  string,
  { name: string; subtitle: string; description: string; icon: React.ElementType }
> = {
  torno: {
    name: 'Torno',
    subtitle: 'Fila de Produção: Torno',
    description:
      'Fila de serviço para usinagem de eixos, superfícies cilíndricas e desbastes rotativos.',
    icon: Cog,
  },
  fresa: {
    name: 'Fresa',
    subtitle: 'Fila de Produção: Fresa',
    description:
      'Fila de serviço para fresamento de ranhuras, blocos, faces e desbastes com fresas circulares.',
    icon: Layers,
  },
  cnc: {
    name: 'CNC',
    subtitle: 'Fila de Produção: CNC',
    description: 'Fila de serviço para usinagem multieixo CNC de alta precisão e perfis complexos.',
    icon: Cpu,
  },
  retifica: {
    name: 'Retífica',
    subtitle: 'Fila de Produção: Retífica',
    description:
      'Fila de serviço para acabamento fino, retificação cilíndrica/plana e tolerâncias estreitas.',
    icon: Gauge,
  },
}

export default function MaquinaDetail() {
  const { type } = useParams<{ type: string }>()
  const currentKey = type ? type.toLowerCase() : ''
  const machine = currentKey in machineConfig ? machineConfig[currentKey] : null

  if (!machine) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
        </Button>

        <Card className="border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive mb-1">
              <AlertCircle className="w-5 h-5" />
              <CardTitle className="text-xl">Máquina não encontrada</CardTitle>
            </div>
            <CardDescription>
              O tipo de máquina &quot;{type}&quot; não é válido. Os tipos suportados são: torno,
              fresa, cnc, retifica.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/">Ir para a página principal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const Icon = machine.icon

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb / Botão de retorno */}
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>

      {/* Header com título da máquina */}
      <div className="border-b pb-6 flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{machine.subtitle}</h1>
          <p className="text-muted-foreground mt-1">{machine.description}</p>
        </div>
      </div>

      {/* Detalhe da Máquina / Fila de serviço */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Fila de Serviço da Estação</CardTitle>
          <CardDescription>
            Ordens de produção sequenciadas e prontas para execução nesta máquina.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-border p-12 text-center bg-muted/20">
            <Icon className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
            <p className="text-sm font-medium text-foreground">
              Detalhe da Máquina ({machine.name})
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Fila de serviço e controle de execução em tempo real preparados para os itens de
              produção.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
