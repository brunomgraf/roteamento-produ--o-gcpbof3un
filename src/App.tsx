import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ThemeProvider } from './lib/theme-provider'
import { Loader2 } from 'lucide-react'

// Lazy loading de todas as rotas da aplicação
const Index = lazy(() => import('./pages/Index'))
const NovoItem = lazy(() => import('./pages/NovoItem'))
const Maquinas = lazy(() => import('./pages/Maquinas'))
const MaquinaDetail = lazy(() => import('./pages/MaquinaDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center min-h-[50vh] w-full animate-page-fade"
    >
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">Carregando...</p>
      </div>
    </div>
  )
}

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/novo-item" element={<NovoItem />} />
                <Route path="/maquinas" element={<Maquinas />} />
                <Route path="/maquina/:type" element={<MaquinaDetail />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </ErrorBoundary>
)

export default App
