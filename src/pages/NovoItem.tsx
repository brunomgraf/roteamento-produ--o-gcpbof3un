import React from 'react'
import { Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function NovoItem() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Novo Item</h1>
        <p className="text-muted-foreground mt-1">Registrar item e gerar roteamento por IA</p>
      </div>

      {/* Placeholder Form/Card Foundation */}
      <Card className="max-w-2xl border-border">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Planejamento Automatizado
            </span>
          </div>
          <CardTitle className="text-xl">Cadastro de Peça / Ordem de Serviço</CardTitle>
          <CardDescription>
            Defina o nome da peça, especificações técnicas e parâmetros de fabricação para o
            roteamento industrial.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-border p-8 text-center bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Formulário de cadastro e assistente de roteamento por IA prontos para integração.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
