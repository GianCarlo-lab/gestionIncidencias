import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, CheckCircle2, Loader2, MapPin, ChevronLeft } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Textarea } from '@shared/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { useAuthStore } from '@store/auth.store'
import { MOCK_SUCURSALES, MOCK_AREAS, TICKET_TYPES } from '@mocks/data'
import { ROUTES } from '@constants/index'

const createTicketSchema = z.object({
  title: z
    .string()
    .min(10, 'El título debe tener al menos 10 caracteres')
    .max(150, 'Máximo 150 caracteres'),
  type: z.string().min(1, 'Selecciona el tipo de solicitud'),
  priority: z.enum(['baja', 'media', 'alta', 'critica']),
  sucursalId: z.string().min(1, 'Selecciona la sucursal'),
  areaId: z.string().min(1, 'Selecciona el área'),
  location: z.string().max(200, 'Máximo 200 caracteres').optional(),
  description: z
    .string()
    .min(20, 'Describe el problema con al menos 20 caracteres')
    .max(5000, 'Máximo 5000 caracteres'),
})
type CreateTicketForm = z.infer<typeof createTicketSchema>

const PRIORITY_OPTIONS = [
  { value: 'baja', label: 'Baja', description: 'Sin impacto operativo urgente' },
  { value: 'media', label: 'Media', description: 'Afecta parcialmente las operaciones' },
  { value: 'alta', label: 'Alta', description: 'Impacto significativo en operaciones' },
  { value: 'critica', label: 'Crítica', description: 'Detiene completamente las operaciones' },
]

export function CreateTicketPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<string[]>([])

  const defaultSucursal = user?.sucursalId ?? ''

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateTicketForm>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      priority: 'media',
      sucursalId: defaultSucursal,
    },
  })

  const watchedSucursal = watch('sucursalId')
  const areasForSucursal = MOCK_AREAS.filter((a) => a.sucursalId === watchedSucursal && a.activo)

  const onSubmit = (_data: CreateTicketForm) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  const addFakeFile = () => {
    const fakes = ['foto-equipo.jpg', 'captura-error.png', 'reporte.pdf', 'video-fallo.mp4']
    const name = fakes[files.length % fakes.length]
    setFiles((f) => [...f, name])
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Ticket creado exitosamente</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tu solicitud fue registrada y será asignada en breve.
          </p>
          <p className="mt-1 font-mono text-sm font-semibold text-primary">PS-0016</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(ROUTES.TICKETS)}>
            Ver mis tickets
          </Button>
          <Button onClick={() => navigate(ROUTES.DASHBOARD)}>Ir al dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-3 lg:p-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Nuevo ticket</h2>
          <p className="text-sm text-muted-foreground">
            Describe tu solicitud o incidencia con el mayor detalle posible.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Tipo y prioridad */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Clasificación</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {/* Tipo */}
            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-xs font-medium">
                Tipo de solicitud
              </Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Seleccionar tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TICKET_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
            </div>

            {/* Prioridad */}
            <div className="space-y-1.5">
              <Label htmlFor="priority" className="text-xs font-medium">
                Prioridad
              </Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          <div>
                            <p className="font-medium">{p.label}</p>
                            <p className="text-xs text-muted-foreground">{p.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Ubicación</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {/* Sucursal */}
            <div className="space-y-1.5">
              <Label htmlFor="sucursalId" className="text-xs font-medium">
                Sucursal
              </Label>
              <Controller
                control={control}
                name="sucursalId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="sucursalId">
                      <SelectValue placeholder="Seleccionar sucursal..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_SUCURSALES.filter((s) => s.activo).map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.sucursalId && (
                <p className="text-xs text-destructive">{errors.sucursalId.message}</p>
              )}
            </div>

            {/* Área */}
            <div className="space-y-1.5">
              <Label htmlFor="areaId" className="text-xs font-medium">
                Área
              </Label>
              <Controller
                control={control}
                name="areaId"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!watchedSucursal}
                  >
                    <SelectTrigger id="areaId">
                      <SelectValue
                        placeholder={
                          watchedSucursal ? 'Seleccionar área...' : 'Primero elige la sucursal'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {areasForSucursal.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.areaId && <p className="text-xs text-destructive">{errors.areaId.message}</p>}
            </div>

            {/* Ubicación específica */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="location" className="flex items-center gap-1.5 text-xs font-medium">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Ubicación específica{' '}
                <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="location"
                placeholder="Ej: Piso 3 — Módulo B, Impresora del fondo..."
                {...register('location')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Descripción */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Detalle de la solicitud</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-medium">
                Título
              </Label>
              <Input
                id="title"
                placeholder="Describe brevemente el problema o solicitud..."
                {...register('title')}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-medium">
                Descripción completa
              </Label>
              <Textarea
                id="description"
                rows={5}
                placeholder="Describe con detalle: ¿Qué ocurrió? ¿Cuándo empezó? ¿Qué intentaste hacer para resolverlo? ¿A cuántos usuarios afecta?"
                className="resize-none"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Evidencias */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Evidencias</CardTitle>
            <CardDescription>Adjunta fotos, capturas de pantalla o documentos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-xs"
                  >
                    <span className="max-w-32 truncate font-medium">{f}</span>
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={addFakeFile}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-6 py-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">Haz clic para adjuntar archivo</p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, PDF, MP4 · máx. 10 MB por archivo
                </p>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="sm:min-w-32">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar ticket'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
