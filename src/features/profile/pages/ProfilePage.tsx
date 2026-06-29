import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Save, Lock, Bell, Moon, Globe, Loader2, Check } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card'
import { Switch } from '@shared/ui/switch'
import { Separator } from '@shared/ui/separator'
import { Badge } from '@shared/ui/badge'
import { useAuthStore } from '@store/auth.store'

const profileSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido: z.string().min(2, 'Mínimo 2 caracteres'),
  correo: z.string().email('Correo inválido'),
  telefono: z.string().optional(),
})
type ProfileForm = z.infer<typeof profileSchema>

const passwordSchema = z
  .object({
    actual: z.string().min(1, 'Ingresa tu contraseña actual'),
    nueva: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmar: z.string(),
  })
  .refine((d) => d.nueva === d.confirmar, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar'],
  })
type PasswordForm = z.infer<typeof passwordSchema>

const ROL_LABEL: Record<string, string> = {
  superadmin: 'SuperAdministrador',
  admin: 'Administrador',
  worker: 'Trabajador',
  user: 'Usuario',
}

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    assignments: true,
    statusChanges: true,
    comments: false,
  })

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombre: user?.nombre ?? '',
      apellido: user?.apellido ?? '',
      correo: user?.correo ?? '',
      telefono: '',
    },
  })

  const {
    register: regPw,
    handleSubmit: handlePw,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

  const onSaveProfile = (_data: ProfileForm) => {
    setSavingProfile(true)
    setTimeout(() => {
      setSavingProfile(false)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    }, 1000)
  }

  const onSavePw = (_data: PasswordForm) => {
    setSavingPw(true)
    setTimeout(() => {
      setSavingPw(false)
      resetPw()
    }, 1000)
  }

  const initials = user
    ? `${user.nombre.charAt(0)}${user.apellido?.charAt(0) ?? ''}`.toUpperCase()
    : '??'

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-3 lg:p-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Mi perfil</h2>
        <p className="text-sm text-muted-foreground">
          Gestiona tu información personal y preferencias.
        </p>
      </div>

      {/* Avatar section */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90">
              <Camera className="h-3 w-3" />
            </button>
          </div>
          <div>
            <p className="text-lg font-bold">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-sm text-muted-foreground">{user?.correo}</p>
            <div className="mt-1 flex items-center gap-2">
              {user?.rol && (
                <Badge variant="secondary" className="text-xs">
                  {ROL_LABEL[user.rol] ?? user.rol}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400">
                Activo
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Datos personales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfile(onSaveProfile)} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="nombre" className="text-xs">
                  Nombre
                </Label>
                <Input id="nombre" className="h-9 text-sm" {...regProfile('nombre')} />
                {profileErrors.nombre && (
                  <p className="text-xs text-destructive">{profileErrors.nombre.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apellido" className="text-xs">
                  Apellido
                </Label>
                <Input id="apellido" className="h-9 text-sm" {...regProfile('apellido')} />
                {profileErrors.apellido && (
                  <p className="text-xs text-destructive">{profileErrors.apellido.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="correo" className="text-xs">
                Correo electrónico
              </Label>
              <Input id="correo" type="email" className="h-9 text-sm" {...regProfile('correo')} />
              {profileErrors.correo && (
                <p className="text-xs text-destructive">{profileErrors.correo.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefono" className="text-xs">
                Teléfono
              </Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="+51 999 000 000"
                className="h-9 text-sm"
                {...regProfile('telefono')}
              />
            </div>

            {/* Read-only info */}
            <Separator />
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Sucursal
                </p>
                <p className="font-medium">Sede Central</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Área
                </p>
                <p className="font-medium">Sistemas / TI</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Usuario
                </p>
                <p className="font-medium">{user?.usuario ?? 'N/A'}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={savingProfile} className="min-w-28">
                {savingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : profileSaved ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Guardado
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Lock className="h-4 w-4" />
            Cambiar contraseña
          </CardTitle>
          <CardDescription>Tu contraseña debe tener al menos 8 caracteres.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePw(onSavePw)} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="actual" className="text-xs">
                Contraseña actual
              </Label>
              <Input id="actual" type="password" className="h-9 text-sm" {...regPw('actual')} />
              {pwErrors.actual && (
                <p className="text-xs text-destructive">{pwErrors.actual.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nueva" className="text-xs">
                Nueva contraseña
              </Label>
              <Input id="nueva" type="password" className="h-9 text-sm" {...regPw('nueva')} />
              {pwErrors.nueva && (
                <p className="text-xs text-destructive">{pwErrors.nueva.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmar" className="text-xs">
                Confirmar contraseña
              </Label>
              <Input
                id="confirmar"
                type="password"
                className="h-9 text-sm"
                {...regPw('confirmar')}
              />
              {pwErrors.confirmar && (
                <p className="text-xs text-destructive">{pwErrors.confirmar.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="outline" disabled={savingPw} className="min-w-36">
                {savingPw ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar contraseña'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Bell className="h-4 w-4" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              id: 'email',
              label: 'Notificaciones por correo',
              description: 'Recibe un email cuando cambie el estado de tus tickets',
            },
            {
              id: 'push',
              label: 'Notificaciones push',
              description: 'Alertas en tiempo real en el navegador',
            },
            {
              id: 'assignments',
              label: 'Nuevas asignaciones',
              description: 'Cuando te asignen un ticket',
            },
            {
              id: 'statusChanges',
              label: 'Cambios de estado',
              description: 'Actualizaciones de tickets que sigues',
            },
            {
              id: 'comments',
              label: 'Comentarios',
              description: 'Cuando alguien comente en tus tickets',
            },
          ].map((pref) => (
            <div key={pref.id} className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.description}</p>
              </div>
              <Switch
                checked={notifications[pref.id as keyof typeof notifications]}
                onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [pref.id]: v }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* App preferences */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Globe className="h-4 w-4" />
            Apariencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Modo oscuro</p>
                <p className="text-xs text-muted-foreground">Cambia el tema de la aplicación</p>
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
