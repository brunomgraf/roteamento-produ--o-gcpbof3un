import React from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Cpu, Cog, Layers, Gauge } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const machines = [
  {
    type: 'torno',
    name: 'Torno Mecânico / CNC',
    desc: 'Usinagem de eixos, roscas, furações axiais e peças cilíndricas.',
    icon: Cog,
  },
  {
    type: 'fresa',
    name: 'Fresadora Convencional / CNC',
    desc: 'Usinagem de faces planas, ranhuras, bolsões e engrenagens.',
    icon: Layers,
  },
  {
    type: 'cnc',
    name: 'Centro de Usinagem CNC',
    desc: 'Operações complexas multieixo de alta precisão e repetibilidade.',
    icon: Cpu,
  },
  {
    type: 'retifica',
    name: 'Retífica Plana e Cilíndrica',
    desc: 'Acabamento fino, tolerâncias micrométricas e superfícies espelhadas.',
    icon: Gauge,
  },
]

export default function Index() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard de Produção
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão geral de todas as máquinas, fluxo operacional e controle da fábrica.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="gap-2 shadow-sm">
            <Link to="/novo-item">
              <PlusCircle className="w-4 h-4" />
              Novo Item
            </Link>
          </Button>
        </div>
      </div>

      {/* Grid de Máquinas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Máquinas e Centros de Trabalho
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {machines.map((m) => {
            const Icon = m.icon
            return (
              <Card
                key={m.type}
                className="hover:shadow-md transition-all duration-200 flex flex-col justify-between border-border"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{m.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{m.desc}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild variant="outline" className="w-full justify-center">
                    <Link to={`/maquina/${m.type}`}>Ver Fila de Trabalho</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
