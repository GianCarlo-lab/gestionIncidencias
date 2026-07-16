import { useState } from 'react'
import { Plus, Pencil, Power, PowerOff, Tag } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuthStore } from '@store/auth.store'
import { categoriaAdminService } from '../services/catalogosAdminService'
import type { CategoriaDto } from '@features/tickets/services/catalogoService'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Button } from '@shared/ui/button'
import { Badge } from '@shared/ui/badge'
import { Input } from '@shared/ui/input'
import { Textarea } from '@shared/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@shared/ui/dialog'
import { FormField } from '@shared/components/FormField'
import { Skeleton } from '@shared/ui/skeleton'

const schema = z.object({
  nombre: z.string().min(1, 'Requerido').max(100, 'Máximo 100 caracteres'),
  descripcion: z.string().max(500, 'Máximo 500 caracteres').optional(),
})
type FormValues = z.infer<typeof schema>

export function SeccionCategorias() {
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const empresaId = user?.empresaId
  const isSuperAdmin = user?.rol === 'superadmin'

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<CategoriaDto | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['categorias-admin', empresaId],
    queryFn: () => categoriaAdminService.listar(empresaId ?? undefined),
  })

  const items = data?.items ?? []

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: '', descripcion: '' },
  })

  const { mutateAsync: crear } = useMutation({
    mutationFn: (v: FormValues) =>
      categoriaAdminService.crear({
        nombre: v.nombre.trim(),
        descripcion: v.descripcion?.trim() || undefined,
        // SuperAdmin sin empresaId crea categoría global; Admin la asocia a su empresa
        empresaId: isSuperAdmin ? undefined : (empresaId ?? undefined),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['categorias-admin'] })
      void qc.invalidateQueries({ queryKey: ['categorias'] })
      toast.success('Categoría creada')
      setDialogOpen(false)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const { mutateAsync: actualizar } = useMutation({
    mutationFn: (v: FormValues) =>
      categoriaAdminService.actualizar(editItem!.id, {
        nombre: v.nombre.trim(),
        descripcion: v.descripcion?.trim() || undefined,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['categorias-admin'] })
      void qc.invalidateQueries({ queryKey: ['categorias'] })
      toast.success('Categoría actualizada')
      setDialogOpen(false)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const { mutate: toggle } = useMutation({
    mutationFn: (item: CategoriaDto) =>
      item.activa
        ? categoriaAdminService.desactivar(item.id)
        : categoriaAdminService.activar(item.id),
    onSuccess: (_, item) => {
      void qc.invalidateQueries({ queryKey: ['categorias-admin'] })
      void qc.invalidateQueries({ queryKey: ['categorias'] })
      toast.success(item.activa ? 'Categoría desactivada' : 'Categoría activada')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  function openCreate() {
    setEditItem(null)
    reset({ nombre: '', descripcion: '' })
    setDialogOpen(true)
  }

  function openEdit(item: CategoriaDto) {
    setEditItem(item)
    reset({ nombre: item.nombre, descripcion: item.descripcion ?? '' })
    setDialogOpen(true)
  }

  async function onSubmit(v: FormValues) {
    if (editItem) await actualizar(v)
    else await crear(v)
  }

  return (
    <>
      <Card className="lg:col-span-2">
        <CardHeader className="px-3 pb-2 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <Tag className="h-3.5 w-3.5 text-blue-500" />
              Categorías
            </CardTitle>
            <Button size="sm" className="h-7 gap-1 text-xs" onClick={openCreate}>
              <Plus className="h-3.5 w-3.5" />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No hay categorías configuradas.{' '}
              <button
                className="text-primary underline-offset-4 hover:underline"
                onClick={openCreate}
              >
                Agrega la primera.
              </button>
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    <th className="pb-2 pr-3">Nombre</th>
                    <th className="hidden pb-2 pr-3 sm:table-cell">Descripción</th>
                    <th className="w-20 pb-2 pr-3 text-center">Alcance</th>
                    <th className="w-20 pb-2 pr-3 text-center">Estado</th>
                    <th className="w-16 pb-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 pr-3 font-medium">{item.nombre}</td>
                      <td className="hidden py-2.5 pr-3 text-muted-foreground sm:table-cell">
                        {item.descripcion ?? '—'}
                      </td>
                      <td className="py-2.5 pr-3 text-center">
                        <Badge variant="outline" className="text-[10px]">
                          {item.esGlobal ? 'Global' : 'Empresa'}
                        </Badge>
                      </td>
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
                            title="Editar"
                            onClick={() => openEdit(item)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            title={item.activa ? 'Desactivar' : 'Activar'}
                            onClick={() => toggle(item)}
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
            <DialogTitle>{editItem ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-1">
            <FormField label="Nombre" required error={errors.nombre?.message}>
              <Input
                className="h-8 text-sm"
                placeholder="Ej: Soporte técnico"
                {...register('nombre')}
              />
            </FormField>
            <FormField label="Descripción" error={errors.descripcion?.message}>
              <Textarea
                className="resize-none text-sm"
                rows={2}
                placeholder="Descripción opcional..."
                {...register('descripcion')}
              />
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
                {editItem ? 'Guardar cambios' : 'Crear categoría'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
