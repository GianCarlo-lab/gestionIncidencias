import { cn } from '@lib/utils'
import { ArrowDown, ArrowRight, ArrowUp, Flame } from 'lucide-react'
import type { TicketPriority } from '@types-app/index'
import type { LucideIcon } from 'lucide-react'

interface PriorityConfig {
  label: string
  icon: LucideIcon
  className: string
}

const PRIORITY_CONFIG: Record<TicketPriority, PriorityConfig> = {
  baja: {
    label: 'Baja',
    icon: ArrowDown,
    className: 'bg-priority-baja text-priority-baja-foreground border-transparent',
  },
  media: {
    label: 'Media',
    icon: ArrowRight,
    className: 'bg-priority-media text-priority-media-foreground border-transparent',
  },
  alta: {
    label: 'Alta',
    icon: ArrowUp,
    className: 'bg-priority-alta text-priority-alta-foreground border-transparent',
  },
  critica: {
    label: 'Crítica',
    icon: Flame,
    className: 'bg-priority-critica text-priority-critica-foreground border-transparent',
  },
}

interface PriorityBadgeProps {
  priority: TicketPriority
  showIcon?: boolean
  className?: string
}

export function PriorityBadge({ priority, showIcon = true, className }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority]
  const Icon = config.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        config.className,
        className,
      )}
    >
      {showIcon && <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />}
      {config.label}
    </span>
  )
}
