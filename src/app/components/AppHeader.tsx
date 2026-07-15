import {
  Menu,
  Bell,
  LogOut,
  User,
  Settings,
  Command,
  CheckCheck,
  Info,
  AlertCircle,
  Ticket,
  MessageSquare,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/ui/button'
import { Badge } from '@shared/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu'
import { ROUTES, ticketDetailPath } from '@constants/index'
import { useAuthStore } from '@store/auth.store'
import {
  useConteoNotificaciones,
  useNotificaciones,
  useMarcarLeida,
} from '@features/notifications/hooks/useNotificaciones'
import { authService } from '@features/auth/services/authService'
import { cn } from '@lib/utils'

interface AppHeaderProps {
  onMenuClick?: () => void
  title?: string
  onCommandOpen?: () => void
}

const NOTIF_TYPE_ICON: Record<string, React.ElementType> = {
  'ticket.nuevo': Ticket,
  'ticket.asignado': CheckCheck,
  'ticket.reasignado': CheckCheck,
  'ticket.pendiente_validacion': AlertCircle,
  'ticket.cerrado': AlertCircle,
  'ticket.rechazado': AlertCircle,
  'ticket.comentario': MessageSquare,
}

function timeAgoShort(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

export function AppHeader({ onMenuClick, title, onCommandOpen }: AppHeaderProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.rol === 'admin' || user?.rol === 'superadmin'

  const { data: conteoData } = useConteoNotificaciones()
  const unreadCount = conteoData?.sinLeer ?? 0

  const { data: notifsData } = useNotificaciones({ tamanoPagina: 6 })
  const { mutate: marcarLeida } = useMarcarLeida()

  const recientes = (notifsData?.items ?? []).slice(0, 5)

  const handleNotifClick = (id: string, ticketId: string | null) => {
    marcarLeida(id)
    if (ticketId) navigate(ticketDetailPath(ticketId))
    else navigate(ROUTES.NOTIFICATIONS)
  }

  const handleLogout = async () => {
    await authService.logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <header className="flex h-header shrink-0 items-center justify-between border-b bg-background px-4 lg:px-6">
      {/* Left: hamburger (mobile) + title */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {title && <h1 className="text-sm font-semibold text-foreground">{title}</h1>}
      </div>

      {/* Right: command button + notifications + avatar */}
      <div className="flex items-center gap-1">
        {/* Command Menu trigger */}
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
          onClick={onCommandOpen}
          aria-label="Abrir menú de comandos"
        >
          <Command className="h-3 w-3" />
          <span className="hidden sm:inline">Ctrl+K</span>
        </Button>

        {/* Notifications bell — dropdown con recientes */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={
                unreadCount > 0 ? `Notificaciones — ${unreadCount} sin leer` : 'Notificaciones'
              }
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <Badge
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 p-0">
            <DropdownMenuLabel className="flex items-center justify-between px-3 py-2.5">
              <span className="text-sm font-semibold">Notificaciones</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-[10px]">
                  {unreadCount} sin leer
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="m-0" />

            {recientes.length === 0 ? (
              <div className="flex flex-col items-center gap-1 px-3 py-6 text-center">
                <Bell className="h-6 w-6 text-muted-foreground/50" />
                <p className="text-xs text-muted-foreground">Sin notificaciones</p>
              </div>
            ) : (
              recientes.map((n) => {
                const Icon = NOTIF_TYPE_ICON[n.tipoEvento ?? ''] ?? Info
                const isUnread = !n.esLeida
                return (
                  <DropdownMenuItem
                    key={n.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-2.5 px-3 py-2.5 focus:bg-accent',
                      isUnread && 'bg-primary/5',
                    )}
                    onClick={() => handleNotifClick(n.id, n.ticketId)}
                  >
                    <div
                      className={cn(
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                        isUnread ? 'bg-primary/15' : 'bg-muted',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-3 w-3',
                          isUnread ? 'text-primary' : 'text-muted-foreground',
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'truncate text-xs leading-snug',
                          isUnread
                            ? 'font-semibold text-foreground'
                            : 'font-medium text-foreground/75',
                        )}
                      >
                        {n.titulo}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                        {n.cuerpo}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {timeAgoShort(n.createdAt)}
                    </span>
                  </DropdownMenuItem>
                )
              })
            )}

            <DropdownMenuSeparator className="m-0" />
            <DropdownMenuItem
              className="justify-center py-2 text-xs font-medium text-primary focus:text-primary"
              onClick={() => navigate(ROUTES.NOTIFICATIONS)}
            >
              Ver todas las notificaciones
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                  {user.nombre.charAt(0)}
                  {user.apellido?.charAt(0) ?? ''}
                </div>
                <span className="hidden max-w-20 truncate text-xs font-medium lg:block">
                  {user.nombre}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-semibold">
                  {user.nombre} {user.apellido}
                </p>
                <p className="text-xs text-muted-foreground">{user.correo}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)}>
                <User className="mr-2 h-4 w-4" />
                Mi perfil
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={() => navigate(ROUTES.SETTINGS)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
