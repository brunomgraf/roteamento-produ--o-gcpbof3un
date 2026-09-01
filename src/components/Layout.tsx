import React, { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  Menu,
  Sun,
  Moon,
  Factory,
  Cog,
  Layers,
  Cpu,
  Gauge,
  Sliders,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useTheme } from '@/lib/theme-provider'
import { OfflineBanner } from '@/components/OfflineBanner'
import { cn } from '@/lib/utils'

const navItems = [
  {
    name: 'Dashboard',
    to: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Novo Item',
    to: '/novo-item',
    icon: PlusCircle,
  },
  {
    name: 'Máquinas',
    to: '/maquinas',
    icon: Sliders,
  },
]

const machineLinks = [
  { name: 'Torno', to: '/maquina/torno', icon: Cog },
  { name: 'Fresa', to: '/maquina/fresa', icon: Layers },
  { name: 'CNC', to: '/maquina/cnc', icon: Cpu },
  { name: 'Retífica', to: '/maquina/retifica', icon: Gauge },
]

export default function Layout() {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavLinks = ({ onSelect }: { onSelect?: () => void }) => (
    <nav aria-label="Navegação da aplicação" className="space-y-6">
      <div className="space-y-1">
        <p
          className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
          id="nav-main-menu"
        >
          Menu Principal
        </p>
        <div role="group" aria-labelledby="nav-main-menu" className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onSelect}
                aria-label={`Ir para ${item.name}`}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 min-h-[44px] h-11 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </div>
      </div>

      <div className="space-y-1 pt-2 border-t border-border">
        <p
          className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
          id="nav-workstations"
        >
          Estações de Trabalho
        </p>
        <div role="group" aria-labelledby="nav-workstations" className="space-y-1">
          {machineLinks.map((machine) => {
            const Icon = machine.icon
            return (
              <NavLink
                key={machine.to}
                to={machine.to}
                onClick={onSelect}
                aria-label={`Ver estação ${machine.name}`}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 min-h-[44px] h-11 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isActive
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{machine.name}</span>
              </NavLink>
            )
          })}
        </div>
      </div>
    </nav>
  )

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Offline Alert Banner */}
      <OfflineBanner />

      {/* Header Fixo */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            {/* Botão Hambúrguer Mobile */}
            <div className="lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Abrir menu de navegação"
                    className="h-11 w-11 min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-6 flex flex-col justify-between">
                  <div className="space-y-6">
                    <SheetHeader className="text-left pb-4 border-b">
                      <SheetTitle className="flex items-center gap-2 text-base font-bold text-primary">
                        <Factory className="w-5 h-5 text-primary" aria-hidden="true" />
                        <span>Roteamento Produção</span>
                      </SheetTitle>
                    </SheetHeader>
                    <NavLinks onSelect={() => setMobileOpen(false)} />
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Tema do Sistema</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTheme}
                      aria-label={
                        theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'
                      }
                      className="gap-2 min-h-[44px] h-11 px-4 focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="h-4 w-4 text-amber-500" aria-hidden="true" />
                          <span>Claro</span>
                        </>
                      ) : (
                        <>
                          <Moon className="h-4 w-4 text-blue-500" aria-hidden="true" />
                          <span>Escuro</span>
                        </>
                      )}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo Desktop / Header */}
            <Link
              to="/"
              aria-label="Página inicial do Roteamento Produção"
              className="flex items-center gap-2.5 font-bold text-lg sm:text-xl tracking-tight text-foreground hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1"
            >
              <div
                className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm"
                aria-hidden="true"
              >
                <Factory className="w-5 h-5" />
              </div>
              <span>Roteamento Produção</span>
            </Link>
          </div>

          {/* Lado Direito: Alternância de Modo Escuro */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              className="h-11 w-11 min-h-[44px] min-w-[44px] rounded-lg border-border focus-visible:ring-2 focus-visible:ring-ring"
            >
              {theme === 'dark' ? (
                <Sun
                  className="h-5 w-5 text-amber-400 transition-all hover:rotate-45"
                  aria-hidden="true"
                />
              ) : (
                <Moon
                  className="h-5 w-5 text-foreground transition-all hover:-rotate-12"
                  aria-hidden="true"
                />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Corpo com Sidebar e Conteúdo Principal */}
      <div className="flex-1 flex">
        {/* Sidebar Desktop Fixa (width: 280px) */}
        <aside
          aria-label="Menu Lateral"
          className="hidden lg:block w-[280px] shrink-0 border-r border-border bg-card/40 p-6 min-h-[calc(100vh-4rem)]"
        >
          <NavLinks />
        </aside>

        {/* Conteúdo Principal com max-w-7xl centralizado */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 outline-none"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
