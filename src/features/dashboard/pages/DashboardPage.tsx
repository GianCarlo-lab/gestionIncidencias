import { useNavigate } from 'react-router-dom'
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  Inbox,
  AlertCircle,
  CheckCheck,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card'
import { StatusBadge } from '@shared/components/StatusBadge'
import { PriorityBadge } from '@shared/components/PriorityBadge'
import { useAuthStore } from '@store/auth.store'
import { MOCK_TICKETS, MOCK_TREND_DATA, TICKET_STATUS_COUNTS, getTicketsByUser } from '@mocks/data'
import { ROUTES, ticketDetailPath } from '@constants/index'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string
  value: number
  description?: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  onClick?: () => void
}

function StatCard({ title, value, description, icon: Icon, iconColor, onClick }: StatCardProps) {
  return (
    <Card
      className={onClick ? 'cursor-pointer transition-shadow hover:shadow-md' : ''}
      onClick={onClick}
    >
      <CardContent className="p-4 lg:p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className={`rounded-lg p-2.5 ${iconColor}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Worker Dashboard ──────────────────────────────────────────────────────────

function WorkerDashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const myTickets = user ? getTicketsByUser(user.id) : []
  const myOpen = myTickets.filter((t) => t.status !== 'cerrado')
  const myInProgress = myTickets.filter((t) => t.status === 'en_proceso')
  const myClosed = myTickets.filter((t) => t.status === 'cerrado')
  const myCritical = myTickets.filter((t) => t.priority === 'critica' && t.status !== 'cerrado')
  const recentTickets = myTickets.slice(0, 5)

  return (
    <div className="space-y-4 p-3 lg:p-5">
      {/* Greeting */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Hola, {user?.nombre} <span aria-hidden="true">👋</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Aquí tienes el resumen de tus tickets de hoy.
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.TICKETS_NEW)} className="mt-3 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          title="Mis tickets abiertos"
          value={myOpen.length}
          icon={Ticket}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          onClick={() => navigate(ROUTES.TICKETS)}
        />
        <StatCard
          title="En proceso"
          value={myInProgress.length}
          icon={Clock}
          iconColor="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
          onClick={() => navigate(ROUTES.TICKETS)}
        />
        <StatCard
          title="Cerrados"
          value={myClosed.length}
          description="histórico total"
          icon={CheckCircle2}
          iconColor="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          title="Críticos abiertos"
          value={myCritical.length}
          icon={AlertTriangle}
          iconColor={
            myCritical.length > 0
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-muted text-muted-foreground'
          }
          onClick={myCritical.length > 0 ? () => navigate(ROUTES.TICKETS) : undefined}
        />
      </div>

      {/* Recent tickets */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base">Mis tickets recientes</CardTitle>
            <CardDescription>Últimos tickets registrados o asignados</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.TICKETS)}>
            Ver todos
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <Ticket className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Aún no tienes tickets registrados.</p>
              <Button size="sm" onClick={() => navigate(ROUTES.TICKETS_NEW)}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Crear tu primer ticket
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {recentTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50"
                  onClick={() => navigate(ticketDetailPath(ticket.id))}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {ticket.code}
                      </span>
                      <PriorityBadge priority={ticket.priority} showIcon={false} />
                    </div>
                    <p className="mt-0.5 truncate text-sm font-medium">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.sucursal} · {ticket.area}
                    </p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────

function AdminDashboard() {
  const navigate = useNavigate()
  const totalOpen =
    TICKET_STATUS_COUNTS.sin_asignar +
    TICKET_STATUS_COUNTS.asignado +
    TICKET_STATUS_COUNTS.en_proceso +
    TICKET_STATUS_COUNTS.pendiente_validacion +
    TICKET_STATUS_COUNTS.reabierto

  const criticalOpen = MOCK_TICKETS.filter(
    (t) => t.priority === 'critica' && t.status !== 'cerrado',
  ).length

  const byPriority = {
    baja: MOCK_TICKETS.filter((t) => t.priority === 'baja').length,
    media: MOCK_TICKETS.filter((t) => t.priority === 'media').length,
    alta: MOCK_TICKETS.filter((t) => t.priority === 'alta').length,
    critica: MOCK_TICKETS.filter((t) => t.priority === 'critica').length,
  }

  const statusCards = [
    {
      title: 'Sin asignar',
      value: TICKET_STATUS_COUNTS.sin_asignar,
      iconColor: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
      icon: Inbox,
    },
    {
      title: 'Asignados',
      value: TICKET_STATUS_COUNTS.asignado,
      iconColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      icon: CheckCircle2,
    },
    {
      title: 'En proceso',
      value: TICKET_STATUS_COUNTS.en_proceso,
      iconColor: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      icon: Clock,
    },
    {
      title: 'Pend. validación',
      value: TICKET_STATUS_COUNTS.pendiente_validacion,
      iconColor: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      icon: AlertCircle,
    },
    {
      title: 'Cerrados',
      value: TICKET_STATUS_COUNTS.cerrado,
      iconColor: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      icon: CheckCheck,
    },
    {
      title: 'Reabiertos',
      value: TICKET_STATUS_COUNTS.reabierto,
      iconColor: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      icon: RotateCcw,
    },
  ]

  return (
    <div className="space-y-4 p-3 lg:p-5">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Panel de Administración</h2>
          <p className="text-sm text-muted-foreground">Resumen de todos los tickets del sistema.</p>
        </div>
        <Button onClick={() => navigate(ROUTES.TICKETS_NEW)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo ticket
        </Button>
      </div>

      {/* Status cards grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {statusCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate(ROUTES.TICKETS)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                  <div className={`rounded-md p-1.5 ${stat.iconColor}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="mt-1 text-xl font-semibold tabular-nums">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary + Chart row */}
      <div className="grid gap-3 lg:grid-cols-3">
        {/* Totals */}
        <div className="flex flex-col gap-3">
          <StatCard
            title="Total abiertos"
            value={totalOpen}
            description="tickets activos en el sistema"
            icon={Ticket}
            iconColor="bg-primary/10 text-primary"
          />
          <StatCard
            title="Críticos abiertos"
            value={criticalOpen}
            description="requieren atención urgente"
            icon={AlertTriangle}
            iconColor={
              criticalOpen > 0
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-muted text-muted-foreground'
            }
          />
          <StatCard
            title="Resueltos (histórico)"
            value={TICKET_STATUS_COUNTS.cerrado}
            icon={CheckCircle2}
            iconColor="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          />
        </div>

        {/* Trend chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Tendencia — últimos 16 días
                </CardTitle>
                <CardDescription>Tickets creados vs. resueltos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={MOCK_TREND_DATA} margin={{ top: 0, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorCreados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResueltos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="fecha"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                  className="fill-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="creados"
                  name="Creados"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorCreados)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="resueltos"
                  name="Resueltos"
                  stroke="hsl(142 76% 36%)"
                  strokeWidth={2}
                  fill="url(#colorResueltos)"
                  dot={false}
                  strokeDasharray="4 2"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Priority breakdown */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: 'Crítica',
            value: byPriority.critica,
            accent: 'border-l-red-500',
          },
          {
            label: 'Alta',
            value: byPriority.alta,
            accent: 'border-l-orange-500',
          },
          {
            label: 'Media',
            value: byPriority.media,
            accent: 'border-l-yellow-500',
          },
          {
            label: 'Baja',
            value: byPriority.baja,
            accent: 'border-l-blue-400',
          },
        ].map((p) => (
          <Card key={p.label} className={`border-l-2 ${p.accent}`}>
            <CardContent className="p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {p.label}
              </p>
              <p className="mt-0.5 text-xl font-semibold tabular-nums">{p.value}</p>
              <p className="text-xs text-muted-foreground">abiertos</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent tickets table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base">Tickets recientes</CardTitle>
            <CardDescription>Últimos 5 tickets del sistema</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.TICKETS)}>
            Gestionar todos
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {MOCK_TICKETS.slice(0, 5).map((ticket) => (
              <button
                key={ticket.id}
                className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50"
                onClick={() => navigate(ticketDetailPath(ticket.id))}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {ticket.code}
                    </span>
                    <PriorityBadge priority={ticket.priority} showIcon />
                  </div>
                  <p className="mt-0.5 truncate text-sm font-medium">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {ticket.sucursal} · {ticket.area}
                    {ticket.assignedTo && ` · ${ticket.assignedTo.fullName}`}
                  </p>
                </div>
                <StatusBadge status={ticket.status} />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Entry Point ───────────────────────────────────────────────────────────────

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.rol === 'admin' || user?.rol === 'superadmin'
  return isAdmin ? <AdminDashboard /> : <WorkerDashboard />
}
