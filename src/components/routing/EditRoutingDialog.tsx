import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Cog, ShoppingBag, ExternalLink } from 'lucide-react'
import type {
  GeneratedRouting,
  RoutingStep,
  MaterialPurchase,
  OutsourcedService,
} from '@/types/routing'

interface EditRoutingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  routing: GeneratedRouting
  onSave: (updated: GeneratedRouting) => void
}

export function EditRoutingDialog({ open, onOpenChange, routing, onSave }: EditRoutingDialogProps) {
  const [formData, setFormData] = useState<GeneratedRouting>(() =>
    JSON.parse(JSON.stringify(routing)),
  )

  // Reset form when opened with new routing
  React.useEffect(() => {
    if (open) {
      setFormData(JSON.parse(JSON.stringify(routing)))
    }
  }, [open, routing])

  // Routing Step Handlers
  const handleStepChange = (index: number, field: keyof RoutingStep, value: string | number) => {
    setFormData((prev) => {
      const steps = [...prev.routing_steps]
      steps[index] = { ...steps[index], [field]: value }
      return { ...prev, routing_steps: steps }
    })
  }

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      routing_steps: [
        ...prev.routing_steps,
        {
          step_order: prev.routing_steps.length + 1,
          sector: 'Torno',
          machine_type: 'torno',
          description: '',
          estimated_hours: 1,
          status: 'pendente',
        },
      ],
    }))
  }

  const removeStep = (index: number) => {
    setFormData((prev) => {
      const steps = prev.routing_steps
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, step_order: i + 1 }))
      return { ...prev, routing_steps: steps }
    })
  }

  // Material Purchases Handlers
  const handleMaterialChange = (
    index: number,
    field: keyof MaterialPurchase,
    value: string | number,
  ) => {
    setFormData((prev) => {
      const mats = [...prev.material_purchases]
      mats[index] = { ...mats[index], [field]: value }
      return { ...prev, material_purchases: mats }
    })
  }

  const addMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      material_purchases: [
        ...prev.material_purchases,
        {
          material_name: '',
          quantity: 1,
          unit: 'un',
          supplier: '',
          status: 'pendente',
        },
      ],
    }))
  }

  const removeMaterial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      material_purchases: prev.material_purchases.filter((_, i) => i !== index),
    }))
  }

  // Outsourced Services Handlers
  const handleOutsourcedChange = (
    index: number,
    field: keyof OutsourcedService,
    value: string | number,
  ) => {
    setFormData((prev) => {
      const srvs = [...prev.outsourced_services]
      srvs[index] = { ...srvs[index], [field]: value }
      return { ...prev, outsourced_services: srvs }
    })
  }

  const addOutsourced = () => {
    setFormData((prev) => ({
      ...prev,
      outsourced_services: [
        ...prev.outsourced_services,
        {
          service_description: '',
          supplier: '',
          estimated_cost: 0,
          status: 'pendente',
        },
      ],
    }))
  }

  const removeOutsourced = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      outsourced_services: prev.outsourced_services.filter((_, i) => i !== index),
    }))
  }

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Roteamento Gerado</DialogTitle>
          <DialogDescription>
            Ajuste as etapas industriais, insumos e serviços antes de finalizar o cadastro.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Orientações e Notas Técnicas
            </label>
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Notas gerais de fabricação, controle de qualidade..."
              rows={2}
            />
          </div>

          {/* Section 1: Routing Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cog className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">
                  Etapas de Fabricação (Usinagem)
                </h4>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStep}
                className="h-8 gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Etapa
              </Button>
            </div>

            <div className="space-y-3">
              {formData.routing_steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-1 font-mono text-xs font-bold text-muted-foreground">
                      #{idx + 1}
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        value={step.sector}
                        onChange={(e) => handleStepChange(idx, 'sector', e.target.value)}
                        placeholder="Setor (ex: Torno)"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        value={step.machine_type || ''}
                        onChange={(e) => handleStepChange(idx, 'machine_type', e.target.value)}
                        placeholder="Máquina / Tipo"
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          value={step.estimated_hours}
                          onChange={(e) =>
                            handleStepChange(
                              idx,
                              'estimated_hours',
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="Horas"
                          className="h-8 text-xs"
                        />
                        <span className="text-xs text-muted-foreground">h</span>
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(idx)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Input
                      value={step.description}
                      onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                      placeholder="Descrição detalhada da operação técnica..."
                      className="text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Material Purchases */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-500" />
                <h4 className="text-sm font-semibold text-foreground">
                  Compras de Matéria-Prima / Insumos
                </h4>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMaterial}
                className="h-8 gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Compra
              </Button>
            </div>

            <div className="space-y-2">
              {formData.material_purchases.map((mat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-orange-500/30 bg-orange-500/5 space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-5">
                      <Input
                        value={mat.material_name}
                        onChange={(e) => handleMaterialChange(idx, 'material_name', e.target.value)}
                        placeholder="Nome do material / especificação"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        type="number"
                        min="0"
                        value={mat.quantity}
                        onChange={(e) =>
                          handleMaterialChange(idx, 'quantity', parseFloat(e.target.value) || 0)
                        }
                        placeholder="Qtd"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        value={mat.unit}
                        onChange={(e) => handleMaterialChange(idx, 'unit', e.target.value)}
                        placeholder="Unid (kg, un)"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        value={mat.supplier || ''}
                        onChange={(e) => handleMaterialChange(idx, 'supplier', e.target.value)}
                        placeholder="Fornecedor"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMaterial(idx)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Outsourced Services */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-red-500" />
                <h4 className="text-sm font-semibold text-foreground">Serviços Terceirizados</h4>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOutsourced}
                className="h-8 gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Terceirizado
              </Button>
            </div>

            <div className="space-y-2">
              {formData.outsourced_services.map((srv, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-red-500/30 bg-red-500/5 space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-5">
                      <Input
                        value={srv.service_description}
                        onChange={(e) =>
                          handleOutsourcedChange(idx, 'service_description', e.target.value)
                        }
                        placeholder="Descrição do serviço (ex: Nitretação)"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        value={srv.supplier || ''}
                        onChange={(e) => handleOutsourcedChange(idx, 'supplier', e.target.value)}
                        placeholder="Prestador / Parceiro"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={srv.estimated_cost}
                        onChange={(e) =>
                          handleOutsourcedChange(
                            idx,
                            'estimated_cost',
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        placeholder="Custo Estimado R$"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOutsourced(idx)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
