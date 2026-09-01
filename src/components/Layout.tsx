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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useTheme } from '@/lib/theme-provider'
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
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Menu Principal
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onSelect}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                    : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </div>

      <div className="space-y-1 pt-2 border-t border-border">
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Estações de Trabalho
        </p>
        {machineLinks.map((machine) => {
          const Icon = machine.icon
          return (
            <NavLink
              key={machine.to}
              to={machine.to}
              onClick={onSelect}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{machine.name}</span>
            </NavLink>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
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
                    className="h-9 w-9"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-6 flex flex-col justify-between">
                  <div className="space-y-6">
                    <SheetHeader className="text-left pb-4 border-b">
                      <SheetTitle className="flex items-center gap-2 text-base font-bold text-primary">
                        <Factory className="w-5 h-5 text-primary" />
                        <span>Roteamento Produção</span>
                      </SheetTitle>
                    </SheetHeader>
                    <NavLinks onSelect={() => setMobileOpen(false)} />
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Tema do Sistema</span>
                    <Button variant="outline" size="sm" onClick={toggleTheme} className="gap-2 h-8">
                      {theme === 'dark' ? (
                        <>
                          <Sun className="h-4 w-4 text-amber-500" />
                          <span>Claro</span>
                        </>
                      ) : (
                        <>
                          <Moon className="h-4 w-4 text-blue-500" />
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
              className="flex items-center gap-2.5 font-bold text-lg sm:text-xl tracking-tight text-foreground hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
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
              className="h-9 w-9 rounded-lg border-border"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400 transition-all hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-foreground transition-all hover:-rotate-12" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Corpo com Sidebar e Conteúdo Principal */}
      <div className="flex-1 flex">
        {/* Sidebar Desktop Fixa (width: 280px) */}
        <aside className="hidden lg:block w-[280px] shrink-0 border-r border-border bg-card/40 p-6 min-h-[calc(100vh-4rem)]">
          <NavLinks />
        </aside>

        {/* Conteúdo Principal com max-w-7xl centralizado */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
