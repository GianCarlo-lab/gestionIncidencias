import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Card, CardContent } from '@shared/ui/card'
import { Separator } from '@shared/ui/separator'
import { ROUTES } from '@constants/index'
import { useAuthStore } from '@store/auth.store'
import { MOCK_USERS } from '@mocks/data'
import type { UserRole } from '@types-app/index'

const loginSchema = z.object({
  correo: z.string().email('Ingresa un correo válido'),
  contrasena: z.string().min(1, 'La contraseña es requerida'),
})
type LoginForm = z.infer<typeof loginSchema>

const DEMO_USERS = [
  { label: 'Trabajador', correo: 'mlopez@empresa.com', id: 'u3' },
  { label: 'Administrador', correo: 'jperez@empresa.com', id: 'u2' },
  { label: 'SuperAdmin', correo: 'gcbarrionuevo@empresa.com', id: 'u1' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const loginWithUser = (userId: string) => {
    const mockUser = MOCK_USERS.find((u) => u.id === userId)!
    setUser({
      id: mockUser.id,
      authUserId: mockUser.id,
      nombre: mockUser.name,
      apellido: mockUser.apellido,
      correo: mockUser.correo,
      usuario: mockUser.usuario,
      rolId: mockUser.id,
      rol: mockUser.rol as UserRole,
      sucursalId: mockUser.sucursalId,
      areaId: mockUser.areaId,
      estadoLaboral: 'activo',
      activo: true,
    })
    navigate(ROUTES.DASHBOARD)
  }

  const onSubmit = (_data: LoginForm) => {
    setLoading(true)
    setTimeout(() => {
      const found = MOCK_USERS.find((u) => u.correo === _data.correo)
      const target = found ?? MOCK_USERS[2]
      loginWithUser(target.id)
    }, 800)
  }

  const handleDemoLogin = (userId: string, correo: string) => {
    setValue('correo', correo)
    setValue('contrasena', 'demo1234')
    setLoading(true)
    setTimeout(() => {
      loginWithUser(userId)
    }, 600)
  }

  return (
    <div className="space-y-5">
      {/* Login card */}
      <Card className="shadow-lg">
        <CardContent className="p-3 pt-0">
          <div className="mb-5 pt-3">
            <h2 className="text-base font-semibold tracking-tight">Iniciar sesión</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="correo" className="text-xs font-medium">
                Correo electrónico
              </Label>
              <Input
                id="correo"
                type="email"
                placeholder="tu@empresa.com"
                autoComplete="email"
                disabled={loading}
                className="h-9 text-sm"
                {...register('correo')}
              />
              {errors.correo && <p className="text-xs text-destructive">{errors.correo.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="contrasena" className="text-xs font-medium">
                  Contraseña
                </Label>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs font-normal text-primary"
                  tabIndex={0}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="contrasena"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  className="h-9 pr-10 text-sm"
                  {...register('contrasena')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.contrasena && (
                <p className="text-xs text-destructive">{errors.contrasena.message}</p>
              )}
            </div>

            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {loading ? 'Iniciando sesión, por favor espera.' : ''}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Demo access — outside card,visually secondary */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">Acceso demo</span>
          <Separator className="flex-1" />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Prueba la aplicación con distintos roles
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DEMO_USERS.map((u) => (
            <Button
              key={u.id}
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => handleDemoLogin(u.id, u.correo)}
              className="h-9 text-xs"
            >
              {u.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
