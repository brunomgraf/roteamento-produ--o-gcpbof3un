import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.warn('Rota não encontrada (404):', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">404</h1>
          <p className="text-lg font-medium text-foreground">Página não encontrada</p>
          <p className="text-sm text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild className="gap-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Início
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
