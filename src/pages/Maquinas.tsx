import React, { useState, useEffect, useId } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Cog,
  Layers,
  Cpu,
  Gauge,
  Wrench,
  RotateCw,
  AlertTriangle,
  Factory,
  Check,
  Power,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useMachines } from '@/hooks/useMachines'
import { MACHINE_COLORS, generateSlug, type Machine, type MachineColor } from '@/types/machine'
import { cn } from '@/lib/utils'

// Map of icon names to Lucide icons
const ICON_MAP: Record<string, React.ElementType> = {
  Cog,
  Layers,
  Cpu,
  Gauge,
  Wrench,
  Factory,
}

function getIconComponent(iconName?: string) {
  if (!iconName) return Cog
  return ICON_MAP[iconName] || Cog
}

const COLOR_MAP: Record<
  string,
  { bg: string; text: string; border: string; badge: string; ring: string }
> = {
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    ring: 'border-blue-500 ring-blue-500/30',
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    ring: 'border-amber-500 ring-amber-500/30',
  },
  violet: {
    bg: 'bg-violet-500/10 dark:bg-violet-500/20',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-500/30',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
    ring: 'border-violet-500 ring-violet-500/30',
  },
  green: {
    bg: 'bg-green-500/10 dark:bg-green-500/20',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-500/30',
    badge: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    ring: 'border-green-500 ring-green-500/30',
  },
  red: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-500/30',
    badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    ring: 'border-red-500 ring-red-500/30',
  },
  orange: {
    bg: 'bg-orange-500/10 dark:bg-orange-500/20',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/30',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    ring: 'border-orange-500 ring-orange-500/30',
  },
  pink: {
    bg: 'bg-pink-500/10 dark:bg-pink-500/20',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-500/30',
    badge: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
    ring: 'border-pink-500 ring-pink-500/30',
  },
  cyan: {
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
    ring: 'border-cyan-500 ring-cyan-500/30',
  },
}

function getColorStyles(color?: string) {
  const c = (color || 'blue').toLowerCase()
  return (
    COLOR_MAP[c] || {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/30',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      ring: 'border-blue-500 ring-blue-500/30',
    }
  )
}

export default function Maquinas() {
  const {
    machines,
    loading,
    error,
    saving,
    deletingId,
    fetchMachines,
    handleCreateMachine,
    handleUpdateMachine,
    handleDeleteMachine,
  } = useMachines()

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)

  // Form fields
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugManual, setIsSlugManual] = useState(false)
  const [color, setColor] = useState<MachineColor>('blue')
  const [icon, setIcon] = useState('Cog')
  const [active, setActive] = useState(true)
  const [validationErrors, setValidationErrors] = useState<{
    name?: string
    slug?: string
  }>({})

  // Delete Dialog state
  const [deletingMachine, setDeletingMachine] = useState<Machine | null>(null)

  // Form field IDs for accessibility
  const nameId = useId()
  const slugId = useId()
  const colorId = useId()
  const activeId = useId()

  const openCreateDialog = () => {
    setEditingMachine(null)
    setName('')
    setSlug('')
    setIsSlugManual(false)
    setColor('blue')
    setIcon('Cog')
    setActive(true)
    setValidationErrors({})
    setIsFormOpen(true)
  }

  const openEditDialog = (m: Machine) => {
    setEditingMachine(m)
    setName(m.name)
    setSlug(m.slug)
    setIsSlugManual(true)
    setColor((m.color as MachineColor) || 'blue')
    setIcon(m.icon || 'Cog')
    setActive(m.active ?? true)
    setValidationErrors({})
    setIsFormOpen(true)
  }

  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingMachine && !isSlugManual) {
      setSlug(generateSlug(val))
    }
    if (validationErrors.name && val.trim()) {
      setValidationErrors((prev) => ({ ...prev, name: undefined }))
    }
  }

  const handleSlugChange = (val: string) => {
    setIsSlugManual(true)
    setSlug(val)
    if (validationErrors.slug && val.trim()) {
      setValidationErrors((prev) => ({ ...prev, slug: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: { name?: string; slug?: string } = {}
    if (!name.trim()) {
      errors.name = 'O nome da máquina é obrigatório.'
    }
    const finalSlug = slug.trim() || generateSlug(name)
    if (!finalSlug) {
      errors.slug = 'O slug identificador é obrigatório.'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    if (editingMachine) {
      const res = await handleUpdateMachine(editingMachine.id, {
        name: name.trim(),
        slug: finalSlug,
        color,
        icon,
        active,
      })
      if (res) {
        setIsFormOpen(false)
      }
    } else {
      const res = await handleCreateMachine({
        name: name.trim(),
        slug: finalSlug,
        color,
        icon,
        active,
      })
      if (res) {
        setIsFormOpen(false)
      }
    }
  }

  const confirmDelete = async () => {
    if (!deletingMachine) return
    const success = await handleDeleteMachine(deletingMachine.id)
    if (success) {
      setDeletingMachine(null)
    }
  }

  return (
    <div className="space-y-8 pb-16 md:pb-8 animate-page-fade">
      {/* 1. Header: Back button to /, title "Maquinas e Estacoes", subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-2 h-9 px-2.5 text-muted-foreground hover:text-foreground -ml-2"
              aria-label="Voltar para o dashboard"
            >
              <Link to="/">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span className="text-xs font-medium">Voltar ao Dashboard</span>
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Máquinas e Estações
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as estações de trabalho da produção.
          </p>
        </div>

        {/* 2. "Nova Máquina" button top-right */}
        <div className="flex items-center gap-3">
          <Button
            onClick={openCreateDialog}
            size="lg"
            className="gap-2 min-h-[44px] h-11 px-5 shadow-sm focus-visible:ring-2 focus-visible:ring-ring font-medium"
            aria-label="Cadastrar nova máquina"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Nova Máquina</span>
          </Button>
        </div>
      </div>

      {/* STATE 1: LOADING */}
      {loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-5 border-border space-y-4">
                <div className="flex items-start justify-between">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24 font-mono" />
                </div>
                <div className="pt-3 border-t border-border flex gap-2">
                  <Skeleton className="h-9 flex-1 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* STATE 3: ERROR */}
      {!loading && error && (
        <Card className="border-destructive/30 bg-destructive/5 p-8 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Erro ao carregar máquinas</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button
            variant="outline"
            onClick={fetchMachines}
            className="gap-2 min-h-[44px] h-11 px-5"
          >
            <RotateCw className="w-4 h-4" aria-hidden="true" />
            <span>Tentar novamente</span>
          </Button>
        </Card>
      )}

      {/* STATE 2: EMPTY */}
      {!loading && !error && machines.length === 0 && (
        <Card className="border-dashed border-2 border-border p-12 text-center max-w-md mx-auto space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Factory className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-foreground">Nenhuma máquina cadastrada</h3>
            <p className="text-sm text-muted-foreground">
              Cadastre a primeira estação de trabalho para começar a gerenciar sua produção.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2 min-h-[44px] h-11 px-6 shadow-sm">
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Cadastrar máquina</span>
          </Button>
        </Card>
      )}

      {/* STATE 4: SUCCESS - Grid of machine cards */}
      {!loading && !error && machines.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Total de <strong>{machines.length}</strong>{' '}
              {machines.length === 1 ? 'estação' : 'estações'} de trabalho
            </span>
            <span className="text-xs">{machines.filter((m) => m.active).length} ativas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {machines.map((machine, index) => {
              const IconComp = getIconComponent(machine.icon)
              const colorStyles = getColorStyles(machine.color)
              const delay = `${Math.min(index * 40, 300)}ms`

              return (
                <Card
                  key={machine.id}
                  style={{
                    animationDelay: delay,
                    animationFillMode: 'backwards',
                  }}
                  className={cn(
                    'p-5 border-border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between animate-fade-in-stagger',
                    !machine.active && 'opacity-70 bg-muted/30',
                  )}
                >
                  <div>
                    {/* Top row: Icon and Active status badge */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-xs',
                          colorStyles.bg,
                          colorStyles.text,
                          colorStyles.border,
                        )}
                        aria-hidden="true"
                      >
                        <IconComp className="w-5 h-5" />
                      </div>

                      {machine.active ? (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 font-medium text-xs px-2.5 py-0.5 flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Ativa
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground border-border text-xs px-2.5 py-0.5"
                        >
                          Inativa
                        </Badge>
                      )}
                    </div>

                    {/* Machine info */}
                    <CardHeader className="p-0 mb-3 space-y-1">
                      <CardTitle className="text-lg font-bold text-foreground line-clamp-1">
                        {machine.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border/60">
                          /{machine.slug}
                        </span>
                      </div>
                    </CardHeader>
                  </div>

                  {/* Actions: Ver Fila, Edit, Delete */}
                  <div className="space-y-2 pt-3 border-t border-border mt-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full justify-center text-xs min-h-[38px] h-9 focus-visible:ring-2 focus-visible:ring-ring font-medium"
                      aria-label={`Ver fila da máquina ${machine.name}`}
                    >
                      <Link to={`/maquina/${machine.slug}`}>Ver Fila de Produção</Link>
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openEditDialog(machine)}
                        className="flex-1 text-xs min-h-[38px] h-9 gap-1.5 font-medium"
                        aria-label={`Editar máquina ${machine.name}`}
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Editar</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeletingMachine(machine)}
                        disabled={deletingId === machine.id}
                        className="h-9 w-9 min-h-[38px] min-w-[38px] text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 shrink-0"
                        aria-label={`Excluir máquina ${machine.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* 4. Dialog Form: Create / Edit Machine */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {editingMachine ? 'Editar Máquina' : 'Nova Máquina'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {editingMachine
                  ? 'Atualize os dados e configurações da estação de trabalho.'
                  : 'Cadastre uma nova máquina ou estação no fluxo de produção.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Nome da máquina (text, required, placeholder "Ex: Centro de Usinagem") */}
              <div className="space-y-1.5">
                <Label htmlFor={nameId} className="text-sm font-medium">
                  Nome da máquina <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={nameId}
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Centro de Usinagem"
                  className={cn(
                    'h-11',
                    validationErrors.name && 'border-destructive focus-visible:ring-destructive',
                  )}
                  autoFocus
                />
                {validationErrors.name && (
                  <p className="text-xs text-destructive font-medium">{validationErrors.name}</p>
                )}
              </div>

              {/* Slug (text, required, auto-generated from name) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor={slugId} className="text-sm font-medium">
                    Identificador (Slug) <span className="text-destructive">*</span>
                  </Label>
                  {!editingMachine && isSlugManual && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSlugManual(false)
                        setSlug(generateSlug(name))
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Gerar automaticamente
                    </button>
                  )}
                </div>
                <Input
                  id={slugId}
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="ex: centro-de-usinagem"
                  className={cn(
                    'font-mono text-sm h-11',
                    validationErrors.slug && 'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <p className="text-[11px] text-muted-foreground">
                  Usado na rota do navegador:{' '}
                  <span className="font-mono text-foreground">/maquina/{slug || '...'}</span>
                </p>
                {validationErrors.slug && (
                  <p className="text-xs text-destructive font-medium">{validationErrors.slug}</p>
                )}
              </div>

              {/* Cor (select: blue, amber, violet, green, red, orange, pink, cyan) */}
              <div className="space-y-1.5">
                <Label htmlFor={colorId} className="text-sm font-medium">
                  Cor de identificação
                </Label>
                <Select value={color} onValueChange={(val) => setColor(val as MachineColor)}>
                  <SelectTrigger id={colorId} className="h-11">
                    <SelectValue placeholder="Selecione uma cor" />
                  </SelectTrigger>
                  <SelectContent>
                    {MACHINE_COLORS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'w-3.5 h-3.5 rounded-full border',
                              c.bgClass,
                              c.borderClass,
                              c.textClass,
                            )}
                            style={{ backgroundColor: `currentColor` }}
                          />
                          <span>{c.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ícone */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Ícone representativo</Label>
                <div className="grid grid-cols-6 gap-2 pt-1">
                  {Object.keys(ICON_MAP).map((iconKey) => {
                    const Icon = ICON_MAP[iconKey]
                    const isSelected = icon === iconKey
                    return (
                      <button
                        type="button"
                        key={iconKey}
                        onClick={() => setIcon(iconKey)}
                        className={cn(
                          'h-11 rounded-lg border flex items-center justify-center transition-all hover:bg-muted',
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                            : 'border-border text-muted-foreground',
                        )}
                        aria-label={`Selecionar ícone ${iconKey}`}
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Ativa (switch, default true) */}
              <div className="flex items-center justify-between rounded-lg border border-border p-3.5 bg-muted/20">
                <div className="space-y-0.5">
                  <Label htmlFor={activeId} className="text-sm font-medium cursor-pointer">
                    Estação Ativa
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Define se a máquina está disponível para alocação de itens.
                  </p>
                </div>
                <Switch id={activeId} checked={active} onCheckedChange={setActive} />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={saving}
                className="min-h-[44px] h-11"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="min-h-[44px] h-11 px-5">
                {saving
                  ? 'Salvando...'
                  : editingMachine
                    ? 'Salvar Alterações'
                    : 'Cadastrar Máquina'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 5. Delete confirmation Dialog */}
      <AlertDialog
        open={!!deletingMachine}
        onOpenChange={(open) => !open && setDeletingMachine(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir máquina?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir a estação <strong>"{deletingMachine?.name}"</strong>
              ? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingId !== null} className="min-h-[44px] h-11">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                confirmDelete()
              }}
              disabled={deletingId !== null}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground min-h-[44px] h-11"
            >
              {deletingId ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
