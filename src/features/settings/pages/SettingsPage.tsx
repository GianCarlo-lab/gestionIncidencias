import { Settings, Bell, Shield, Clock, Ticket, Building2, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card'
import { Switch } from '@shared/ui/switch'
import { Button } from '@shared/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { Label } from '@shared/ui/label'
import { Input } from '@shared/ui/input'
import { useState } from 'react'

export function SettingsPage() {
  const [sessionTimeout, setSessionTimeout] = useState('60')
  const [maxFileSize, setMaxFileSize] = useState('10')

  return (
    <div className="mx-auto max-w-2xl space-y-3 p-3 lg:p-4">
      {/* Header */}
      <div>
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <Settings className="h-5 w-5" />
          Configuración
        </h2>
        <p className="text-xs text-muted-foreground">Ajustes globales del sistema Pide Servicio.</p>
      </div>

      {/* General settings */}
      <Card>
        <CardHeader className="px-3 pb-2 pt-3">
          <CardTitle className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Building2 className="h-4 w-4" />
            General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3 pt-0">
          <div className="space-y-2">
            <Label htmlFor="empresa" className="text-xs font-medium">
              Nombre de la empresa
            </Label>
            <Input id="empresa" defaultValue="Empresa Demo S.A.C." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zona" className="text-xs font-medium">
              Zona horaria
            </Label>
            <Select defaultValue="America/Lima">
              <SelectTrigger id="zona">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Lima">América/Lima (UTC-5)</SelectItem>
                <SelectItem value="America/Bogota">América/Bogotá (UTC-5)</SelectItem>
                <SelectItem value="America/Santiago">América/Santiago (UTC-4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium">Modo de mantenimiento</p>
              <p className="text-xs text-muted-foreground">
                Bloquea el acceso a todos los usuarios excepto superadmin
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader className="px-3 pb-2 pt-3">
          <CardTitle className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Shield className="h-4 w-4" />
            Seguridad y sesiones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3 pt-0">
          <div className="space-y-2">
            <Label htmlFor="session" className="text-xs font-medium">
              Tiempo de sesión (minutos)
            </Label>
            <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
              <SelectTrigger id="session">
                <Clock className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['30', '60', '120', '240', '480'].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v} minutos
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium">Autenticación de dos factores</p>
              <p className="text-xs text-muted-foreground">Requerir 2FA para administradores</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium">Bloqueo por intentos fallidos</p>
              <p className="text-xs text-muted-foreground">
                Bloquear cuenta tras 5 intentos fallidos
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Tickets */}
      <Card>
        <CardHeader className="px-3 pb-2 pt-3">
          <CardTitle className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Ticket className="h-4 w-4" />
            Configuración de tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3 pt-0">
          <div className="space-y-2">
            <Label htmlFor="filesize" className="text-xs font-medium">
              Tamaño máximo de archivo adjunto (MB)
            </Label>
            <Select value={maxFileSize} onValueChange={setMaxFileSize}>
              <SelectTrigger id="filesize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['5', '10', '20', '50'].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v} MB
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium">Asignación automática</p>
              <p className="text-xs text-muted-foreground">
                Asignar tickets automáticamente al trabajador disponible del área
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium">Permitir reapertura de tickets</p>
              <p className="text-xs text-muted-foreground">
                Los usuarios pueden reabrir tickets cerrados dentro de 7 días
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium">SLA por prioridad</p>
              <p className="text-xs text-muted-foreground">
                Alertas de vencimiento según prioridad
              </p>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              Configurar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications global */}
      <Card>
        <CardHeader className="px-3 pb-2 pt-3">
          <CardTitle className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Bell className="h-4 w-4" />
            Notificaciones del sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3 pt-0">
          {[
            {
              label: 'Notificaciones por correo',
              description: 'Enviar emails automáticos para cambios de estado',
              checked: true,
            },
            {
              label: 'Resumen diario a administradores',
              description: 'Email con métricas a las 8:00 AM',
              checked: false,
            },
            {
              label: 'Alertas de tickets críticos',
              description: 'Notificar inmediatamente por email y push',
              checked: true,
            },
            {
              label: 'Recordatorios de SLA',
              description: 'Alertar cuando un ticket está próximo a vencer',
              checked: true,
            },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium">{setting.label}</p>
                <p className="text-xs text-muted-foreground">{setting.description}</p>
              </div>
              <Switch defaultChecked={setting.checked} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/50">
        <CardHeader className="bg-destructive/5 px-3 pb-2 pt-3">
          <CardTitle className="text-[11px] font-semibold uppercase tracking-widest text-destructive">
            Zona de peligro
          </CardTitle>
          <CardDescription>Estas acciones son irreversibles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 p-3 pt-0">
          {[
            {
              label: 'Limpiar logs de auditoría',
              description: 'Elimina registros con más de 1 año de antigüedad',
            },
            {
              label: 'Restablecer configuración',
              description: 'Volver a los valores predeterminados del sistema',
            },
          ].map((action) => (
            <button
              key={action.label}
              className="flex w-full items-center justify-between rounded-lg border border-destructive/20 px-4 py-3 text-left transition-colors hover:bg-destructive/5"
            >
              <div>
                <p className="text-xs font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Guardar cambios</Button>
      </div>
    </div>
  )
}
