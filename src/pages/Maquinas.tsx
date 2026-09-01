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
  { bg: string; text: string; swatchBg: string; swatchRing: string }
> = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-950/60',
    text: 'text-blue-600 dark:text-blue-400',
    swatchBg: 'bg-blue-500',
    swatchRing: 'ring-blue-500',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-950/60',
    text: 'text-amber-600 dark:text-amber-400',
    swatchBg: 'bg-amber-500',
    swatchRing: 'ring-amber-500',
  },
  violet: {
    bg: 'bg-violet-100 dark:bg-violet-950/60',
    text: 'text-violet-600 dark:text-violet-400',
    swatchBg: 'bg-violet-500',
    swatchRing: 'ring-violet-500',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-950/60',
    text: 'text-green-600 dark:text-green-400',
    swatchBg: 'bg-green-500',
    swatchRing: 'ring-green-500',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-950/60',
    text: 'text-red-600 dark:text-red-400',
    swatchBg: 'bg-red-500',
    swatchRing: 'ring-red-500',
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-950/60',
    text: 'text-orange-600 dark:text-orange-400',
    swatchBg: 'bg-orange-500',
    swatchRing: 'ring-orange-500',
  },
  pink: {
    bg: 'bg-pink-100 dark:bg-pink-950/60',
    text: 'text-pink-600 dark:text-pink-400',
    swatchBg: 'bg-pink-500',
    swatchRing: 'ring-pink-500',
  },
  cyan: {
    bg: 'bg-cyan-100 dark:bg-cyan-950/60',
    text: 'text-cyan-600 dark:text-cyan-400',
    swatchBg: 'bg-cyan-500',
    swatchRing: 'ring-cyan-500',
  },
}

function getColorStyles(color?: string) {
  const c = (color || 'blue').toLowerCase()
  return (
    COLOR_MAP[c] || {
      bg: 'bg-blue-100 dark:bg-blue-950/60',
      text: 'text-blue-600 dark:text-blue-400',
      swatchBg: 'bg-blue-500',
      swatchRing: 'ring-blue-500',
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-card rounded-xl border p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
                <div className="space-y-2 mt-3">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-24 font-mono" />
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-md" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {machines.map((machine, index) => {
              const IconComp = getIconComponent(machine.icon)
              const colorStyles = getColorStyles(machine.color)
              const delay = `${index * 50}ms`

              return (
                <div
                  key={machine.id}
                  style={{
                    animationDelay: delay,
                    animationFillMode: 'backwards',
                  }}
                  className={cn(
                    'bg-card rounded-xl border p-5 shadow-sm hover:shadow-md transition relative flex flex-col justify-between animate-card-slide-up',
                    !machine.active && 'opacity-70 bg-muted/20',
                  )}
                >
                  {/* Top row: Icon container and Top-right action buttons */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-lg flex items-center justify-center shrink-0',
                          colorStyles.bg,
                          colorStyles.text,
                        )}
                        aria-hidden="true"
                      >
                        <IconComp className="w-6 h-6" />
                      </div>

                      {/* Action buttons: top-right, icon-only, h-8 w-8, rounded-md, hover:bg-muted */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(machine)}
                          className="h-8 w-8 rounded-md hover:bg-muted p-0 text-muted-foreground hover:text-foreground"
                          aria-label={`Editar máquina ${machine.name}`}
                        >
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingMachine(machine)}
                          disabled={deletingId === machine.id}
                          className="h-8 w-8 rounded-md hover:bg-muted p-0 text-destructive hover:text-destructive hover:scale-105 transition-transform"
                          aria-label={`Excluir máquina ${machine.name}`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>

                    {/* Machine name & Slug */}
                    <div className="mt-3">
                      <h3 className="font-semibold text-base text-foreground line-clamp-1">
                        {machine.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        /{machine.slug}
                      </p>
                    </div>
                  </div>

                  {/* Bottom row: Active badge & link to queue */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60">
                    {machine.active ? (
                      <span className="text-xs rounded-full px-2 py-0.5 font-medium bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 inline-flex items-center">
                        Ativa
                      </span>
                    ) : (
                      <span className="text-xs rounded-full px-2 py-0.5 font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 inline-flex items-center">
                        Inativa
                      </span>
                    )}

                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs font-medium px-2.5 text-muted-foreground hover:text-foreground"
                      aria-label={`Ver fila da máquina ${machine.name}`}
                    >
                      <Link to={`/maquina/${machine.slug}`}>Ver Fila &rarr;</Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 4. Dialog Form: Create / Edit Machine */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="rounded-xl p-6 max-w-md w-full">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader className="p-0">
              <DialogTitle className="text-lg font-bold">
                {editingMachine ? 'Editar Máquina' : 'Nova Máquina'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {editingMachine
                  ? 'Atualize os dados e configurações da estação de trabalho.'
                  : 'Cadastre uma nova máquina ou estação no fluxo de produção.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Nome da máquina */}
              <div>
                <Label htmlFor={nameId} className="text-sm font-medium mb-1.5 block">
                  Nome da máquina <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={nameId}
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Centro de Usinagem"
                  className={cn(
                    'h-11 rounded-lg border-input focus:ring-2',
                    validationErrors.name && 'border-destructive focus-visible:ring-destructive',
                  )}
                  autoFocus
                />
                {validationErrors.name && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
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
                    'font-mono text-sm h-11 rounded-lg border-input focus:ring-2',
                    validationErrors.slug && 'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Usado na rota do navegador:{' '}
                  <span className="font-mono text-foreground">/maquina/{slug || '...'}</span>
                </p>
                {validationErrors.slug && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {validationErrors.slug}
                  </p>
                )}
              </div>

              {/* Color select: grid of color swatches, 8 options, each swatch w-8 h-8 rounded-full, selected has ring-2 ring-offset-2 */}
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Cor de identificação</Label>
                <div className="grid grid-cols-8 gap-2 pt-1 items-center">
                  {MACHINE_COLORS.map((c) => {
                    const isSelected = color === c.value
                    const swatchClass =
                      {
                        blue: 'bg-blue-500',
                        amber: 'bg-amber-500',
                        violet: 'bg-violet-500',
                        green: 'bg-green-500',
                        red: 'bg-red-500',
                        orange: 'bg-orange-500',
                        pink: 'bg-pink-500',
                        cyan: 'bg-cyan-500',
                      }[c.value] || 'bg-blue-500'

                    return (
                      <button
                        type="button"
                        key={c.value}
                        title={c.label}
                        onClick={() => setColor(c.value)}
                        className={cn(
                          'w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center focus:outline-hidden',
                          swatchClass,
                          isSelected &&
                            'ring-2 ring-offset-2 ring-foreground ring-offset-background',
                        )}
                        aria-label={`Selecionar cor ${c.label}`}
                        aria-pressed={isSelected}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Ícone */}
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Ícone representativo</Label>
                <div className="grid grid-cols-6 gap-2">
                  {Object.keys(ICON_MAP).map((iconKey) => {
                    const Icon = ICON_MAP[iconKey]
                    const isSelected = icon === iconKey
                    return (
                      <button
                        type="button"
                        key={iconKey}
                        onClick={() => setIcon(iconKey)}
                        className={cn(
                          'h-10 rounded-lg border flex items-center justify-center transition-all hover:bg-muted',
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

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="h-11 bg-primary text-primary-foreground rounded-lg font-semibold w-full"
              >
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
