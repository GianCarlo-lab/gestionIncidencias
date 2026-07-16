import { useState } from 'react'
import { Plus, ExternalLink, Power, PowerOff, Building2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { empresaService } from '@features/empresas/services/empresaService'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Button } from '@shared/ui/button'
import { Badge } from '@shared/ui/badge'
import { Input } from '@shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@shared/ui/dialog'
import { FormField } from '@shared/components/FormField'
import { Skeleton } from '@shared/ui/skeleton'
import { ROUTES } from '@constants/index'

const schema = z.object({
  nombreComercial: z.string().min(1, 'Requerido').max(100, 'Máximo 100 caracteres'),
  razonSocial: z.string().min(1, 'Requerido').max(150, 'Máximo 150 caracteres'),
  identificacionFiscal: z.string().min(1, 'Requerido').max(30, 'Máximo 30 caracteres'),
  zonaHoraria: z.string().min(1, 'Requerido'),
})
type FormValues = z.infer<typeof schema>

export function SeccionEmpresas() {
  const qc = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['empresas-config'],
    queryFn: () => empresaService.listar({ tamanoPagina: 100 }),
  })

  const items = data?.items ?? []

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombreComercial: '',
      razonSocial: '',
      identificacionFiscal: '',
      zonaHoraria: 'America/Lima',
    },
  })

  const zonaHoraria = watch('zonaHoraria')

  const { mutateAsync: crear } = useMutation({
    mutationFn: (v: FormValues) =>
      empresaService.crear({
        nombreComercial: v.nombreComercial.trim(),
        razonSocial: v.razonSocial.trim(),
        identificacionFiscal: v.identificacionFiscal.trim(),
        zonaHoraria: v.zonaHoraria,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['empresas-config'] })
      void qc.invalidateQueries({ queryKey: ['empresas'] })
      toast.success('Empresa creada')
      setDialogOpen(false)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const { mutate: toggle } = useMutation({
    mutationFn: ({ id, activa }: { id: string; activa: boolean }) =>
      activa ? empresaService.desactivar(id) : empresaService.activar(id),
    onSuccess: (_, { activa }) => {
      void qc.invalidateQueries({ queryKey: ['empresas-config'] })
      void qc.invalidateQueries({ queryKey: ['empresas'] })
      toast.success(activa ? 'Empresa desactivada' : 'Empresa activada')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  function openCreate() {
    reset({
      nombreComercial: '',
      razonSocial: '',
      identificacionFiscal: '',
      zonaHoraria: 'America/Lima',
    })
    setDialogOpen(true)
  }

  async function onSubmit(v: FormValues) {
    await crear(v)
  }

  return (
    <>
      <Card className="lg:col-span-2">
        <CardHeader className="px-3 pb-2 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 text-blue-500" />
              Empresas
            </CardTitle>
            <Button size="sm" className="h-7 gap-1 text-xs" onClick={openCreate}>
              <Plus className="h-3.5 w-3.5" />
              Nueva empresa
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No hay empresas registradas.{' '}
              <button
                className="text-primary underline-offset-4 hover:underline"
                onClick={openCreate}
              >
                Crea la primera.
              </button>
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    <th className="pb-2 pr-3">Nombre comercial</th>
                    <th className="w-20 pb-2 pr-3 text-center">Estado</th>
                    <th className="w-20 pb-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 pr-3 font-medium">{item.nombreComercial}</td>
                      <td className="py-2.5 pr-3 text-center">
                        <Badge
                          variant={item.activa ? 'default' : 'secondary'}
                          className="text-[10px]"
                        >
                          {item.activa ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </td>
                      <td className="py-2.5">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            title="Ver detalle"
                            asChild
                          >
                            <Link to={ROUTES.EMPRESAS_DETAIL.replace(':id', item.id)}>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            title={item.activa ? 'Desactivar' : 'Activar'}
                            onClick={() => toggle({ id: item.id, activa: item.activa })}
                          >
                            {item.activa ? (
                              <PowerOff className="h-3 w-3 text-amber-500" />
                            ) : (
                              <Power className="h-3 w-3 text-emerald-500" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nueva empresa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-1">
            <FormField label="Nombre comercial" required error={errors.nombreComercial?.message}>
              <Input
                className="h-8 text-sm"
                placeholder="Ej: Inmoveg S.A.C."
                {...register('nombreComercial')}
              />
            </FormField>
            <FormField label="Razón social" required error={errors.razonSocial?.message}>
              <Input
                className="h-8 text-sm"
                placeholder="Razón social legal"
                {...register('razonSocial')}
              />
            </FormField>
            <FormField
              label="RUC / Identificación fiscal"
              required
              error={errors.identificacionFiscal?.message}
            >
              <Input
                className="h-8 text-sm"
                placeholder="20xxxxxxxxx"
                {...register('identificacionFiscal')}
              />
            </FormField>
            <FormField label="Zona horaria" required error={errors.zonaHoraria?.message}>
              <Select value={zonaHoraria} onValueChange={(v) => setValue('zonaHoraria', v)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Lima">America/Lima (UTC-5)</SelectItem>
                  <SelectItem value="America/Bogota">America/Bogota (UTC-5)</SelectItem>
                  <SelectItem value="America/Santiago">America/Santiago (UTC-4)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                Crear empresa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
