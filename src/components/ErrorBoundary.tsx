import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro não tratado:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Ops! Algo deu errado.
              </h1>
              <p className="text-sm text-muted-foreground">
                Por favor, tente recarregar a página ou voltar para o início.
              </p>
              {this.state.error?.message && (
                <div className="mt-3 p-3 bg-muted rounded text-xs text-left font-mono overflow-x-auto text-muted-foreground border border-border">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-center">
              <Button onClick={this.handleReload} className="w-full sm:w-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Recarregar a página
              </Button>
              <Button onClick={this.handleReset} variant="outline" className="w-full sm:w-auto">
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
