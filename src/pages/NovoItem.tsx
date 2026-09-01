import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  UploadCloud,
  FileText,
  X,
  Loader2,
  Check,
  Edit3,
  RefreshCw,
  AlertCircle,
  FileCode,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FlowchartPreview } from '@/components/routing/FlowchartPreview'
import { EditRoutingDialog } from '@/components/routing/EditRoutingDialog'
import { useGenerateRouting } from '@/hooks/useGenerateRouting'
import { useItemRegistration } from '@/hooks/useItemRegistration'
import type { GeneratedRouting } from '@/types/routing'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg']

export default function NovoItem() {
  const navigate = useNavigate()

  // Form State
  const [itemName, setItemName] = useState('')
  const [description, setDescription] = useState('')
  const [drawingUrl, setDrawingUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Hooks
  const { isGenerating, routing, generateRouting, setRouting } = useGenerateRouting()
  const { isSaving, saveItem } = useItemRegistration()

  const fileInputRef = useRef<HTMLInputElement>(null)

  // File handling
  const handleValidateAndSetFile = (file: File) => {
    setFileError(null)

    // Check size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError('O arquivo excede o limite máximo permitido de 10MB.')
      return
    }

    // Check extension / mime type
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
    const isValidMime = ALLOWED_MIME_TYPES.includes(file.type)
    const isValidExt = ALLOWED_EXTENSIONS.includes(fileExt)

    if (!isValidMime && !isValidExt) {
      setFileError('Formato inválido. Por favor envie um arquivo PDF, PNG ou JPG.')
      return
    }

    setSelectedFile(file)

    // Generate preview URL if it's an image
    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file)
      setFilePreviewUrl(previewUrl)
    } else {
      setFilePreviewUrl(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleValidateAndSetFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleValidateAndSetFile(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl)
      setFilePreviewUrl(null)
    }
    setFileError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Generation action
  const handleGenerate = async () => {
    if (!itemName.trim() || isGenerating || isSaving) return

    await generateRouting({
      item_name: itemName.trim(),
      description: description.trim() || undefined,
      drawing_url:
        drawingUrl.trim() ||
        (selectedFile ? `Arquivo local anexado: ${selectedFile.name}` : undefined),
    })
  }

  // Save action
  const handleConfirmAndSave = async () => {
    if (!itemName.trim() || !routing || isSaving || isGenerating) return

    const success = await saveItem({
      nome: itemName.trim(),
      descricao: description.trim() || undefined,
      status: 'pendente',
      drawing_url: drawingUrl.trim() || undefined,
      drawing_file: selectedFile,
      routing_steps: routing.routing_steps || [],
      material_purchases: routing.material_purchases || [],
      outsourced_services: routing.outsourced_services || [],
    })

    if (success) {
      setSaveSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 400)
    }
  }

  const isFormDisabled = isGenerating || isSaving

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Header with back button, Title, Etapa 1 Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <Link to="/" title="Voltar ao Dashboard">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Novo Item
              </h1>
              <Badge variant="secondary" className="font-semibold px-2.5 py-0.5">
                Etapa 1
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Cadastre a peça e gere o roteamento automático de fabricação por inteligência
              artificial.
            </p>
          </div>
        </div>

        {/* Action button if routing generated (Quick desktop save) */}
        {routing && (
          <div className="hidden sm:flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              disabled={isFormDisabled}
              className="gap-1.5 h-11 bg-secondary text-secondary-foreground"
            >
              <Edit3 className="w-4 h-4" />
              Editar Roteamento
            </Button>
            <Button
              type="button"
              onClick={handleConfirmAndSave}
              disabled={isFormDisabled}
              className={`gap-2 h-11 rounded-lg text-white font-semibold shadow-sm transition-all duration-200 ${
                saveSuccess
                  ? 'bg-green-500 scale-[1.02] ring-4 ring-green-300 dark:ring-green-800'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando Item...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirmar e Salvar
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* 2. Two-column Layout (Desktop: grid-cols-2 lg:gap-6, Mobile: grid-cols-1 gap-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
        {/* LEFT COLUMN: Input Form */}
        <div className="space-y-6">
          <Card className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <CardHeader className="p-0 pb-6">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Especificação Técnica
                </span>
              </div>
              <CardTitle className="text-xl">Dados da Peça</CardTitle>
              <CardDescription>
                Informe os parâmetros de engenharia para o agente industrial calcular os tempos e
                operações.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 space-y-5">
              {/* Item Name (Required) */}
              <div>
                <label
                  htmlFor="itemName"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Nome do Item / Peça <span className="text-destructive">*</span>
                </label>
                <Input
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Ex: Eixo Cardan Ø50mm com Estrias"
                  disabled={isFormDisabled}
                  className="h-11 rounded-lg border-input focus:ring-2 font-medium text-sm"
                />
              </div>

              {/* Description (Optional) */}
              <div>
                <label
                  htmlFor="itemDescription"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Descrição e Requisitos Técnicos
                </label>
                <Textarea
                  id="itemDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o item, material (ex: Aço SAE 4140), dimensões, tolerâncias H7, rugosidade Ra 0.8..."
                  disabled={isFormDisabled}
                  className="min-h-[120px] rounded-lg border-input focus:ring-2 text-sm resize-y"
                />
              </div>

              {/* Drawing Upload Dropzone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  <span>Desenho Técnico / Arquivo (Opcional)</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isFormDisabled}
                />

                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !isFormDisabled && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                      isDragOver
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-muted/50 hover:border-primary/50 hover:bg-muted/70'
                    } ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        Arraste ou clique para enviar o desenho técnico
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PDF, PNG, JPG até 10MB • Ou pule o upload e use apenas texto
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-lg border border-border bg-card flex items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      {filePreviewUrl ? (
                        <img
                          src={filePreviewUrl}
                          alt="Pré-visualização do desenho"
                          className="w-14 h-14 object-cover rounded-lg border border-border shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          {selectedFile.name.endsWith('.pdf') ? (
                            <FileCode className="w-7 h-7" />
                          ) : (
                            <FileText className="w-7 h-7" />
                          )}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB •{' '}
                          {selectedFile.type || 'Documento'}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveFile}
                      disabled={isFormDisabled}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Inline Error if validation fails */}
                {fileError && (
                  <Alert
                    variant="destructive"
                    className="mt-2 py-2 px-3 text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <AlertDescription>{fileError}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Optional Drawing URL link */}
              <div>
                <label
                  htmlFor="drawingUrl"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Ou link externo para o desenho (Google Drive, Onedrive, ERP)
                </label>
                <Input
                  id="drawingUrl"
                  value={drawingUrl}
                  onChange={(e) => setDrawingUrl(e.target.value)}
                  placeholder="https://exemplo.com/desenhos/DWG-4091.pdf"
                  disabled={isFormDisabled}
                  className="h-11 rounded-lg border-input focus:ring-2 text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                {/* 1. Generate Button */}
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!itemName.trim() || isFormDisabled}
                  className={`h-12 w-full bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    routing ? 'animate-pulse' : ''
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Engenheiro IA analisando e gerando roteamento...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      {routing ? 'Gerar Novamente' : 'Gerar Roteamento com IA'}
                    </>
                  )}
                </Button>

                {/* 2. After Generation Buttons (Confirm, Edit, Regenerate) */}
                {routing && (
                  <div className="pt-4 border-t border-border animate-fade-in flex flex-col sm:flex-row gap-3 w-full">
                    <Button
                      type="button"
                      onClick={handleConfirmAndSave}
                      disabled={isFormDisabled}
                      className={`h-11 rounded-lg text-white font-semibold flex-1 flex items-center justify-center gap-2 transition-all duration-200 ${
                        saveSuccess
                          ? 'bg-green-500 scale-[1.02] ring-4 ring-green-300 dark:ring-green-800'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Gravando Peça no Sistema...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Confirmar e Salvar
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsEditDialogOpen(true)}
                      disabled={isFormDisabled}
                      className="h-11 bg-secondary text-secondary-foreground rounded-lg font-medium flex-1 flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-4 h-4" />
                      Editar Roteamento
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleGenerate}
                      disabled={isFormDisabled}
                      className="h-11 bg-transparent text-primary underline hover:bg-primary/5 rounded-lg font-medium flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Gerar Novamente
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Flowchart Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>Fluxo de Fabricação</span>
              {routing && (
                <Badge variant="outline" className="text-xs font-normal">
                  {routing.routing_steps?.length || 0} etapas
                </Badge>
              )}
            </h2>
            {routing && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                disabled={isFormDisabled}
                className="text-xs gap-1 text-primary hover:text-primary"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar
              </Button>
            )}
          </div>

          {/* Flowchart Component */}
          <FlowchartPreview routing={routing} isLoading={isGenerating} />
        </div>
      </div>

      {/* Edit Routing Modal Dialog */}
      {routing && (
        <EditRoutingDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          routing={routing}
          onSave={(updated: GeneratedRouting) => setRouting(updated)}
        />
      )}
    </div>
  )
}
