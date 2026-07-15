import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, MapPin, Power, FileText } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@shared/ui/button'
import { Badge } from '@shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Skeleton } from '@shared/ui/skeleton'
import { ConfirmDialog } from '@shared/components/ConfirmDialog'
import { useSucursal, useToggleSucursal } from '../hooks/useSucursales'
import { ROUTES, sucursalEditPath } from '@constants/index'

export function SucursalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [confirmToggle, setConfirmToggle] = useState(false)

  const { data: sucursal, isLoading, isError } = useSucursal(id ?? '')
  const toggleSucursal = useToggleSucursal()

  if (isLoading) {
    return (
      <div className="px-3 py-3 lg:px-5">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <Card>
            <CardContent className="space-y-3 p-4">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isError || !sucursal) {
    return (
      <div className="px-3 py-3 lg:px-5">
        <div className="mb-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(ROUTES.SUCURSALES)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <MapPin className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">No se pudo cargar la sucursal</p>
            <Button size="sm" onClick={() => navigate(ROUTES.SUCURSALES)}>
              Volver a sucursales
            </Button>
          </CardContent>
        </Card>
      </div>
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
            <h2 className="text-base font-semibold tracking-tight">{sucursal.nombre}</h2>
            <p className="text-xs text-muted-foreground">Detalle de sucursal</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => navigate(sucursalEditPath(sucursal.id))}
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="px-3 pb-2 pt-3">
              <CardTitle className="text-sm font-semibold">Información general</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-3 pt-0">
              <InfoRow
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Nombre"
                value={sucursal.nombre}
              />
              {sucursal.descripcion && (
                <InfoRow
                  icon={<FileText className="h-3.5 w-3.5" />}
                  label="Descripción"
                  value={sucursal.descripcion}
                />
              )}
              {sucursal.direccion && (
                <InfoRow
                  icon={<MapPin className="h-3.5 w-3.5" />}
                  label="Dirección"
                  value={sucursal.direccion}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="px-3 pb-2 pt-3">
              <CardTitle className="text-sm font-semibold">Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-3 pt-0">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Estado actual</span>
                <Badge
                  className={
                    sucursal.activa
                      ? 'border-transparent bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'border-transparent bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  }
                >
                  {sucursal.activa ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Registrada el</span>
                <span className="font-medium">
                  {new Date(sucursal.createdAt).toLocaleDateString('es-PE')}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-3 pb-2 pt-3">
              <CardTitle className="text-sm font-semibold">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <Button
                variant="outline"
                size="sm"
                className={`w-full gap-1.5 ${sucursal.activa ? 'border-destructive/50 text-destructive hover:bg-destructive/10' : ''}`}
                onClick={() => setConfirmToggle(true)}
              >
                <Power className="h-3.5 w-3.5" />
                {sucursal.activa ? 'Desactivar sucursal' : 'Activar sucursal'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmToggle}
        onOpenChange={setConfirmToggle}
        title={sucursal.activa ? 'Desactivar sucursal' : 'Activar sucursal'}
        description={
          sucursal.activa
            ? `¿Desactivar "${sucursal.nombre}"? Los usuarios de esta sucursal no podrán acceder.`
            : `¿Activar "${sucursal.nombre}"? Los usuarios de esta sucursal podrán volver a acceder.`
        }
        confirmLabel={sucursal.activa ? 'Desactivar' : 'Activar'}
        variant={sucursal.activa ? 'destructive' : 'default'}
        loading={toggleSucursal.isPending}
        onConfirm={() => {
          toggleSucursal.mutate(
            { id: sucursal.id, activa: sucursal.activa },
            { onSuccess: () => setConfirmToggle(false) },
          )
        }}
      />
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 text-xs">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
