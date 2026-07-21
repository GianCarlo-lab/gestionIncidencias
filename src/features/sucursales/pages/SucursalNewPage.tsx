import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { FormField } from '@shared/components/FormField'
import { useCrearSucursal } from '../hooks/useSucursales'
import { useEmpresas } from '@features/empresas/hooks/useEmpresas'
import { useAuthStore } from '@store/auth.store'
import { SearchableSelect } from '@shared/components/SearchableSelect'
import { ROUTES } from '@constants/index'

interface FormState {
  empresaId: string
  nombre: string
  descripcion: string
  direccion: string
}

const INITIAL: FormState = {
  empresaId: '',
  nombre: '',
  descripcion: '',
  direccion: '',
}

export function SucursalNewPage() {
  const navigate = useNavigate()
  const crearSucursal = useCrearSucursal()
  const currentUser = useAuthStore((s) => s.user)
  const isSuperAdmin = currentUser?.rol === 'superadmin'

  const { data: empresasData } = useEmpresas({ soloActivas: true, tamanoPagina: 100 })
  const empresas = empresasData?.items ?? []

  const [form, setForm] = useState<FormState>({
    ...INITIAL,
    empresaId: isSuperAdmin ? '' : (currentUser?.empresaId ?? ''),
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.empresaId) next.empresaId = 'Selecciona una empresa.'
    if (!form.nombre.trim()) next.nombre = 'Ingresa el nombre de la sucursal.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    crearSucursal.mutate(
      {
        empresaId: form.empresaId,
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || undefined,
        direccion: form.direccion.trim() || undefined,
      },
      { onSuccess: () => navigate(ROUTES.SUCURSALES) },
    )
  }

  return (
    <div className="px-3 py-3 lg:px-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => navigate(ROUTES.SUCURSALES)}
            aria-label="Volver a sucursales"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-base font-semibold tracking-tight">Nueva sucursal</h2>
            <p className="text-xs text-muted-foreground">
              Completa los datos para registrar la sucursal
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.SUCURSALES)}>
          Cancelar
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-4">
          <Card>
            <CardHeader className="px-3 pb-2 pt-3">
              <CardTitle className="text-sm font-semibold">Información general</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-3 pt-0">
              {isSuperAdmin && (
                <FormField label="Empresa" required error={errors.empresaId}>
                  <SearchableSelect
                    options={empresas.map((e) => ({ value: e.id, label: e.nombreComercial }))}
                    value={form.empresaId}
                    onChange={(v) => handleChange('empresaId', v)}
                    placeholder="Seleccionar empresa"
                    searchPlaceholder="Buscar empresa..."
                    emptyMessage="Sin empresas."
                    hasError={!!errors.empresaId}
                  />
                </FormField>
              )}

              <FormField label="Nombre de la sucursal" required error={errors.nombre}>
                <Input
                  className="h-9 text-sm"
                  placeholder="Ej. Sede Central"
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                />
              </FormField>

              <FormField label="Descripción" optional>
                <Input
                  className="h-9 text-sm"
                  placeholder="Descripción breve de la sucursal"
                  value={form.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                />
              </FormField>

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
            <Button variant="outline" onClick={() => navigate(ROUTES.SUCURSALES)}>
              Cancelar
            </Button>
            <Button disabled={crearSucursal.isPending} onClick={handleSubmit}>
              {crearSucursal.isPending ? 'Creando...' : 'Crear sucursal'}
            </Button>
          </div>
        </div>

        {/* Panel resumen */}
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
                    {form.nombre.trim() || 'Nombre de la sucursal'}
                  </p>
                  {form.descripcion.trim() && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {form.descripcion.trim()}
                    </p>
                  )}
                </div>
              </div>
              {form.direccion.trim() && (
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between gap-2">
                    <span className="shrink-0 text-muted-foreground">Dirección</span>
                    <span className="truncate text-right font-medium">{form.direccion.trim()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
