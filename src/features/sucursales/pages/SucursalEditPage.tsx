import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Skeleton } from '@shared/ui/skeleton'
import { FormField } from '@shared/components/FormField'
import { useSucursal, useActualizarSucursal } from '../hooks/useSucursales'
import { ROUTES, sucursalDetailPath } from '@constants/index'

interface FormState {
  nombre: string
  codigo: string
  ciudad: string
  pais: string
  telefono: string
  direccion: string
}

export function SucursalEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: sucursal, isLoading } = useSucursal(id ?? '')
  const actualizarSucursal = useActualizarSucursal(id ?? '')

  const [form, setForm] = useState<FormState>({
    nombre: '',
    codigo: '',
    ciudad: '',
    pais: '',
    telefono: '',
    direccion: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (sucursal && !ready) {
      setForm({
        nombre: sucursal.nombre,
        codigo: sucursal.codigo,
        ciudad: sucursal.ciudad,
        pais: sucursal.pais,
        telefono: sucursal.telefono ?? '',
        direccion: sucursal.direccion ?? '',
      })
      setReady(true)
    }
  }, [sucursal, ready])

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.nombre.trim()) next.nombre = 'Ingresa el nombre de la sucursal.'
    if (!form.codigo.trim()) next.codigo = 'Ingresa un código identificador.'
    if (!form.ciudad.trim()) next.ciudad = 'Ingresa la ciudad.'
    if (!form.pais.trim()) next.pais = 'Ingresa el país.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate() || !id) return
    actualizarSucursal.mutate(
      {
        nombre: form.nombre.trim(),
        codigo: form.codigo.trim().toUpperCase(),
        ciudad: form.ciudad.trim(),
        pais: form.pais.trim(),
        telefono: form.telefono.trim() || undefined,
        direccion: form.direccion.trim() || undefined,
      },
      { onSuccess: () => navigate(sucursalDetailPath(id)) },
    )
  }

  if (isLoading) {
    return (
      <div className="px-3 py-3 lg:px-5">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Card>
          <CardContent className="space-y-3 p-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const backPath = id ? sucursalDetailPath(id) : ROUTES.SUCURSALES

  return (
    <div className="px-3 py-3 lg:px-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => navigate(backPath)}
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-base font-semibold tracking-tight">Editar sucursal</h2>
            <p className="text-xs text-muted-foreground">{sucursal?.nombre}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(backPath)}>
          Cancelar
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Formulario */}
        <div className="flex-1 space-y-4">
          <Card>
            <CardHeader className="px-3 pb-2 pt-3">
              <CardTitle className="text-sm font-semibold">Información general</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-3 pt-0">
              <FormField label="Nombre de la sucursal" required error={errors.nombre}>
                <Input
                  className="h-9 text-sm"
                  placeholder="Ej. Sede Central"
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                />
              </FormField>
              <FormField label="Código" required error={errors.codigo}>
                <Input
                  className="h-9 font-mono text-sm uppercase"
                  placeholder="Ej. SC001"
                  value={form.codigo}
                  onChange={(e) => handleChange('codigo', e.target.value)}
                  maxLength={10}
                />
              </FormField>
              <FormField label="Teléfono" optional>
                <Input
                  className="h-9 text-sm"
                  placeholder="+51 999 000 000"
                  value={form.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-3 pb-2 pt-3">
              <CardTitle className="text-sm font-semibold">Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-3 pt-0">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField label="Ciudad" required error={errors.ciudad}>
                  <Input
                    className="h-9 text-sm"
                    placeholder="Ej. Lima"
                    value={form.ciudad}
                    onChange={(e) => handleChange('ciudad', e.target.value)}
                  />
                </FormField>
                <FormField label="País" required error={errors.pais}>
                  <Input
                    className="h-9 text-sm"
                    placeholder="Ej. Perú"
                    value={form.pais}
                    onChange={(e) => handleChange('pais', e.target.value)}
                  />
                </FormField>
              </div>
              <FormField label="Dirección" optional>
                <Input
                  className="h-9 text-sm"
                  placeholder="Av. Principal 456, San Isidro"
                  value={form.direccion}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                />
              </FormField>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-2 pb-2">
            <Button variant="outline" onClick={() => navigate(backPath)}>
              Cancelar
            </Button>
            <Button disabled={actualizarSucursal.isPending} onClick={handleSubmit}>
              {actualizarSucursal.isPending ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </div>

        {/* Panel de resumen */}
        <div className="w-full lg:w-72 lg:shrink-0">
          <Card className="lg:sticky lg:top-4">
            <CardHeader className="px-3 pb-2 pt-3">
              <CardTitle className="text-sm font-semibold">Vista previa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-3 pt-0">
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <MapPin className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">
                    {form.nombre.trim() || sucursal?.nombre || 'Nombre de la sucursal'}
                  </p>
                  {form.codigo.trim() && (
                    <span className="mt-1 inline-block rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {form.codigo.trim().toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                {(form.ciudad.trim() || form.pais.trim()) && (
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Ubicación</span>
                    <span className="font-medium">
                      {[form.ciudad.trim(), form.pais.trim()].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
                {form.telefono.trim() && (
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Teléfono</span>
                    <span className="font-medium">{form.telefono.trim()}</span>
                  </div>
                )}
                {form.direccion.trim() && (
                  <div className="flex justify-between gap-2">
                    <span className="shrink-0 text-muted-foreground">Dirección</span>
                    <span className="truncate text-right font-medium">{form.direccion.trim()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
