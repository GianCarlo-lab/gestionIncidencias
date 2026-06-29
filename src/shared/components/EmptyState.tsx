import { cn } from '@lib/utils'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { wrapper: 'py-8', iconBox: 'p-3', icon: 'h-6 w-6', title: 'text-sm', desc: 'text-xs' },
  md: { wrapper: 'py-12', iconBox: 'p-4', icon: 'h-8 w-8', title: 'text-sm', desc: 'text-sm' },
  lg: { wrapper: 'py-20', iconBox: 'p-5', icon: 'h-10 w-10', title: 'text-base', desc: 'text-sm' },
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const s = sizeMap[size]
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 text-center',
        s.wrapper,
        className,
      )}
      aria-live="polite"
    >
      {Icon && (
        <div className={cn('rounded-full bg-muted', s.iconBox)}>
          <Icon className={cn('text-muted-foreground', s.icon)} />
        </div>
      )}
      <div className="max-w-xs space-y-1">
        <p className={cn('font-medium text-foreground', s.title)}>{title}</p>
        {description && <p className={cn('text-muted-foreground', s.desc)}>{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
