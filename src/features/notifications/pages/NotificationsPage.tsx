import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, BellOff, Ticket, CheckCheck, MessageSquare, AlertCircle, Info } from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Badge } from '@shared/ui/badge'
import { Card, CardContent } from '@shared/ui/card'
import { EmptyState } from '@shared/components/EmptyState'
import { MOCK_NOTIFICATIONS, getUnreadNotifications } from '@mocks/data'
import { ticketDetailPath } from '@constants/index'
import { cn } from '@lib/utils'
import type { MockNotification } from '@mocks/data'

const TYPE_CONFIG = {
  ticket_new: {
    icon: Ticket,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'Nuevo ticket',
  },
  ticket_assigned: {
    icon: CheckCheck,
    color: 'text-primary',
    bg: 'bg-primary/10',
    label: 'Asignación',
  },
  ticket_status: {
    icon: AlertCircle,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    label: 'Cambio de estado',
  },
  comment: {
    icon: MessageSquare,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    label: 'Comentario',
  },
  system: {
    icon: Info,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    label: 'Sistema',
  },
}

function timeAgo(dateStr: string): string {
  const now = new Date('2026-06-29T14:00:00')
  const date = new Date(dateStr)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'Hace un momento'
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`
  return `Hace ${Math.floor(diff / 86400)} días`
}

function NotificationItem({
  notification,
  onNavigate,
}: {
  notification: MockNotification
  onNavigate: (id: string) => void
}) {
  const config = TYPE_CONFIG[notification.type]
  const Icon = config.icon

  return (
    <button
      className={cn(
        'flex w-full items-start gap-3 rounded-none px-3 py-2.5 text-left transition-all hover:bg-muted/70',
        !notification.read && 'bg-primary/8 hover:bg-primary/12',
      )}
      onClick={() => {
        if (notification.ticketId) onNavigate(notification.ticketId)
      }}
    >
      {/* Icon */}
      <div
        className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', config.bg)}
      >
        <Icon className={cn('h-3.5 w-3.5', config.color)} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-xs font-medium', !notification.read && 'font-semibold')}>
            {notification.title}
          </p>
          <span className="shrink-0 whitespace-nowrap text-[11px] text-muted-foreground">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{notification.body}</p>
        {notification.ticketCode && (
          <Badge variant="outline" className="mt-1 text-[10px]">
            {notification.ticketCode}
          </Badge>
        )}
      </div>

      {/* Unread dot */}
      {!notification.read && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
    </button>
  )
}

type Filter = 'all' | 'unread' | 'read'

export function NotificationsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')
  const unreadCount = getUnreadNotifications().length

  const filtered = MOCK_NOTIFICATIONS.filter((n) => {
    if (filter === 'unread') return !n.read
    if (filter === 'read') return n.read
    return true
  })

  const handleNavigate = (ticketId: string) => {
    navigate(ticketDetailPath(ticketId))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-3 lg:p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Notificaciones</h2>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground">{unreadCount} sin leer</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm">
            <CheckCheck className="mr-2 h-3.5 w-3.5" />
            Marcar todo como leído
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {(
          [
            { id: 'all', label: 'Todas', count: MOCK_NOTIFICATIONS.length },
            { id: 'unread', label: 'Sin leer', count: unreadCount },
            { id: 'read', label: 'Leídas', count: MOCK_NOTIFICATIONS.length - unreadCount },
          ] as { id: Filter; label: string; count: number }[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
              filter === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
            <Badge
              variant={filter === tab.id ? 'default' : 'secondary'}
              className="h-4 min-w-4 px-1 text-[10px]"
            >
              {tab.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="Sin notificaciones"
          description={
            filter === 'unread'
              ? 'No tienes notificaciones sin leer.'
              : 'No hay notificaciones en esta categoría.'
          }
        />
      ) : (
        <Card>
          <CardContent className="divide-y p-0">
            {filtered.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onNavigate={handleNavigate}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty all state */}
      {MOCK_NOTIFICATIONS.length === 0 && (
        <EmptyState
          icon={Bell}
          title="Todo al día"
          description="No tienes notificaciones nuevas por el momento."
        />
      )}
    </div>
  )
}
