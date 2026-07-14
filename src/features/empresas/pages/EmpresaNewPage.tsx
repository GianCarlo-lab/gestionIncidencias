import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2 } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { FormField } from '@shared/components/FormField'
import { useCrearEmpresa } from '../hooks/useEmpresas'
import { ROUTES } from '@constants/index'

interface FormState {
  nombre: string
  ruc: string
  correo: string
  telefono: string
  direccion: string
  descripcion: string
  sitioWeb: string
}

const INITIAL: FormState = {
  nombre: '',
  ruc: '',
  correo: '',
  telefono: '',
  direccion: '',
  descripcion: '',
  sitioWeb: '',
}

export function EmpresaNewPage() {
  const navigate = useNavigate()
  const crearEmpresa = useCrearEmpresa()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.nombre.trim()) next.nombre = 'Ingresa el nombre de la empresa.'
    if (!form.ruc.trim()) next.ruc = 'Ingresa el RUC o número de identificación fiscal.'
    if (!form.correo.trim()) next.correo = 'Ingresa un correo electrónico.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
      next.correo = 'Ingresa un correo electrónico válido.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    crearEmpresa.mutate(
      {
        nombre: form.nombre.trim(),
        ruc: form.ruc.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim() || undefined,
        direccion: form.direccion.trim() || undefined,
        descripcion: form.descripcion.trim() || undefined,
        sitioWeb: form.sitioWeb.trim() || undefined,
      },
      { onSuccess: () => navigate(ROUTES.EMPRESAS) },
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
            onClick={() => navigate(ROUTES.EMPRESAS)}
            aria-label="Volver a empresas"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-base font-semibold tracking-tight">Nueva empresa</h2>
            <p className="text-xs text-muted-foreground">
              Completa los datos para registrar la empresa
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.EMPRESAS)}>
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
              <FormField label="Nombre de la empresa" required error={errors.nombre}>
                <Input
                  className="h-9 text-sm"
                  placeholder="Ej. Empresa ABC S.A.C."
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                />
              </FormField>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField label="RUC / ID Fiscal" required error={errors.ruc}>
                  <Input
                    className="h-9 text-sm"
                    placeholder="Ej. 20123456789"
                    value={form.ruc}
                    onChange={(e) => handleChange('ruc', e.target.value)}
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
              </div>
              <FormField label="Correo electrónico" required error={errors.correo}>
                <Input
                  className="h-9 text-sm"
                  type="email"
                  placeholder="contacto@empresa.com"
                  value={form.correo}
                  onChange={(e) => handleChange('correo', e.target.value)}
                />
              </FormField>
              <FormField label="Sitio web" optional>
                <Input
                  className="h-9 text-sm"
                  placeholder="https://www.empresa.com"
                  value={form.sitioWeb}
                  onChange={(e) => handleChange('sitioWeb', e.target.value)}
                />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-3 pb-2 pt-3">
              <CardTitle className="text-sm font-semibold">Ubicación y descripción</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-3 pt-0">
              <FormField label="Dirección" optional>
                <Input
                  className="h-9 text-sm"
                  placeholder="Av. Principal 123, Lima"
                  value={form.direccion}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                />
              </FormField>
              <FormField label="Descripción" optional>
                <textarea
                  className="flex min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Breve descripción de la empresa..."
                  value={form.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  rows={3}
                />
              </FormField>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-2 pb-2">
            <Button variant="outline" onClick={() => navigate(ROUTES.EMPRESAS)}>
              Cancelar
            </Button>
            <Button disabled={crearEmpresa.isPending} onClick={handleSubmit}>
              {crearEmpresa.isPending ? 'Creando...' : 'Crear empresa'}
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
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">
                    {form.nombre.trim() || 'Nombre de la empresa'}
                  </p>
                  {form.ruc.trim() && (
                    <p className="mt-0.5 text-xs text-muted-foreground">RUC: {form.ruc.trim()}</p>
                  )}
                  {form.correo.trim() && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{form.correo.trim()}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
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
