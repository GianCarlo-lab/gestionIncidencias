import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  MessageSquare,
  Paperclip,
  Send,
  Lock,
  FileText,
  Image,
  Video,
  CheckCircle2,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  X,
} from 'lucide-react'
import { Button } from '@shared/ui/button'
import { Textarea } from '@shared/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Badge } from '@shared/ui/badge'
import { Separator } from '@shared/ui/separator'
import { StatusBadge } from '@shared/components/StatusBadge'
import { PriorityBadge } from '@shared/components/PriorityBadge'
import { ConfirmDialog } from '@shared/components/ConfirmDialog'
import { EmptyState } from '@shared/components/EmptyState'
import { getTicketById } from '@mocks/data'
import { useAuthStore } from '@store/auth.store'
import { ROUTES } from '@constants/index'
import { cn } from '@lib/utils'
import type { MockComment, MockHistoryEntry, MockEvidencia } from '@mocks/data'

// ── Sub-components ────────────────────────────────────────────────────────────

function Avatar({ initials, size = 'sm' }: { initials: string; size?: 'sm' | 'md' }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-primary/20 font-bold text-primary',
        size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs',
      )}
    >
      {initials}
    </div>
  )
}

function CommentBubble({ comment }: { comment: MockComment }) {
  const date = new Date(comment.createdAt).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
  return (
    <div className={cn('flex gap-3', comment.isInternal && 'opacity-75')}>
      <Avatar initials={comment.author.initials} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{comment.author.fullName}</span>
          <span className="text-xs text-muted-foreground">{date}</span>
          {comment.isInternal && (
            <Badge variant="outline" className="gap-1 text-[10px]">
              <Lock className="h-2.5 w-2.5" />
              Interno
            </Badge>
          )}
        </div>
        <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">{comment.text}</p>
      </div>
    </div>
  )
}

function HistoryEntry({ entry }: { entry: MockHistoryEntry }) {
  const date = new Date(entry.createdAt).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
          <div className="h-2 w-2 rounded-full bg-primary/60" />
        </div>
        <div className="mt-1 flex-1 border-l border-dashed border-border" />
      </div>
      <div className="min-w-0 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold">{entry.action}</span>
          <span className="text-xs text-muted-foreground">por {entry.author.fullName}</span>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        {entry.fromStatus && entry.toStatus && (
          <div className="mt-1 flex items-center gap-1.5">
            <StatusBadge status={entry.fromStatus} />
            <span className="text-xs text-muted-foreground">→</span>
            <StatusBadge status={entry.toStatus} />
          </div>
        )}
        {entry.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{entry.description}</p>
        )}
      </div>
    </div>
  )
}

function EvidenciaItem({ ev }: { ev: MockEvidencia }) {
  const Icon = ev.type === 'imagen' ? Image : ev.type === 'pdf' ? FileText : Video
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 text-sm hover:bg-muted/50">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{ev.name}</p>
        <p className="text-xs text-muted-foreground">
          {ev.size} · {ev.tipo === 'inicial' ? 'Evidencia inicial' : 'Evidencia de cierre'}
        </p>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type ActiveTab = 'comments' | 'history' | 'evidencias'

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.rol === 'admin' || user?.rol === 'superadmin'

  const ticket = getTicketById(id ?? '')
  const [activeTab, setActiveTab] = useState<ActiveTab>('comments')
  const [comment, setComment] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [closeDialog, setCloseDialog] = useState(false)

  if (!ticket) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
        <EmptyState
          icon={AlertTriangle}
          title="Ticket no encontrado"
          description="El ticket que buscas no existe o no tienes acceso."
          action={<Button onClick={() => navigate(ROUTES.TICKETS)}>Volver a tickets</Button>}
        />
      </div>
    )
  }

  const tabs: { id: ActiveTab; label: string; count: number }[] = [
    { id: 'comments', label: 'Comentarios', count: ticket.comments.length },
    { id: 'history', label: 'Historial', count: ticket.history.length },
    { id: 'evidencias', label: 'Evidencias', count: ticket.evidencias.length },
  ]

  const createdDate = new Date(ticket.createdAt).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const updatedDate = new Date(ticket.updatedAt).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-3 lg:p-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="mt-0.5 h-8 w-8 shrink-0"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              {ticket.code}
            </span>
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
          <h2 className="mt-1 text-lg font-semibold leading-snug">{ticket.title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Creado el {createdDate} por{' '}
            <span className="font-medium">{ticket.createdBy.fullName}</span> · Última actualización:{' '}
            {updatedDate}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Card>
            {/* Tab bar */}
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            <CardContent className="pt-3">
              {/* Comments tab */}
              {activeTab === 'comments' && (
                <div className="space-y-3">
                  {ticket.comments.length === 0 ? (
                    <div className="py-6 text-center">
                      <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/40" />
                      <p className="mt-2 text-sm text-muted-foreground">Aún no hay comentarios.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ticket.comments.map((c) => (
                        <CommentBubble key={c.id} comment={c} />
                      ))}
                    </div>
                  )}

                  <Separator />

                  {/* New comment */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {user && (
                        <Avatar
                          initials={`${user.nombre.charAt(0)}${user.apellido?.charAt(0) ?? ''}`}
                          size="md"
                        />
                      )}
                      <div className="flex-1">
                        <Textarea
                          placeholder="Escribe un comentario..."
                          aria-label="Escribe un comentario"
                          rows={2}
                          className="resize-none text-sm"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pl-10">
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => setIsInternal((v) => !v)}
                          className={cn(
                            'flex items-center gap-1.5 text-xs transition-colors',
                            isInternal
                              ? 'text-primary'
                              : 'text-muted-foreground hover:text-foreground',
                          )}
                        >
                          <Lock className="h-3.5 w-3.5" />
                          {isInternal ? 'Comentario interno' : 'Marcar como interno'}
                        </button>
                      )}
                      <div className="ml-auto">
                        <Button size="sm" disabled={!comment.trim()}>
                          <Send className="mr-1.5 h-3.5 w-3.5" />
                          Comentar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* History tab */}
              {activeTab === 'history' && (
                <div className="space-y-1">
                  {ticket.history.map((entry) => (
                    <HistoryEntry key={entry.id} entry={entry} />
                  ))}
                </div>
              )}

              {/* Evidencias tab */}
              {activeTab === 'evidencias' && (
                <div className="space-y-2">
                  {ticket.evidencias.length === 0 ? (
                    <div className="py-6 text-center">
                      <Paperclip className="mx-auto h-8 w-8 text-muted-foreground/40" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        No hay evidencias adjuntas.
                      </p>
                    </div>
                  ) : (
                    ticket.evidencias.map((ev) => <EvidenciaItem key={ev.id} ev={ev} />)
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column — metadata + actions */}
        <div className="space-y-4">
          {/* Info card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { label: 'Tipo', value: ticket.type },
                { label: 'Sucursal', value: ticket.sucursal },
                { label: 'Área', value: ticket.area },
                ...(ticket.location ? [{ label: 'Ubicación', value: ticket.location }] : []),
                {
                  label: 'Asignado a',
                  value: ticket.assignedTo?.fullName ?? 'Sin asignar',
                },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {/* Worker: validate / admin: assign */}
              {ticket.status === 'pendiente_validacion' && (
                <Button className="w-full" onClick={() => setCloseDialog(true)}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirmar y cerrar
                </Button>
              )}

              {isAdmin && ticket.status === 'sin_asignar' && (
                <Button className="w-full">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Asignar trabajador
                </Button>
              )}

              {ticket.status === 'cerrado' && (
                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reabrir ticket
                </Button>
              )}

              {ticket.status !== 'cerrado' && (
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar ticket
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm close dialog */}
      <ConfirmDialog
        open={closeDialog}
        onOpenChange={setCloseDialog}
        title="Confirmar cierre de ticket"
        description={`¿Confirmas que el problema reportado en "${ticket.title}" fue resuelto correctamente? Esta acción cerrará el ticket.`}
        confirmLabel="Sí, cerrar ticket"
        variant="default"
        onConfirm={() => setCloseDialog(false)}
      />
    </div>
  )
}
