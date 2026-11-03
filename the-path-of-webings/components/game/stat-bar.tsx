import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatBarProps {
  label: string
  value: number
  max?: number
  icon: LucideIcon
  inverted?: boolean
  compact?: boolean
  dark?: boolean
}

export function StatBar({ label, value, max = 100, icon: Icon, inverted, compact, dark }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, value))
  const danger = inverted ? pct >= 70 : pct <= 20
  const warning = inverted ? pct >= 40 : pct <= 40
  const fill = danger ? 'bg-destructive' : warning ? 'bg-chart-3' : inverted ? 'bg-chart-4' : 'bg-accent'

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          'flex items-center justify-between text-xs font-medium',
          dark ? 'text-white/80' : 'text-foreground',
        )}
      >
        <span className="flex items-center gap-1.5">
          <Icon className={cn('size-3.5', danger && 'text-destructive')} aria-hidden="true" />
          {label}
        </span>
        <span className="tabular-nums">
          {Math.round(value)}
          {max < 100 && !compact ? <span className="opacity-50">/{Math.round(max)}</span> : null}
        </span>
      </div>
      <div
        className={cn('relative h-2 overflow-hidden rounded-full', dark ? 'bg-white/15' : 'bg-muted')}
        role="meter"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {max < 100 ? (
          <div
            className="absolute inset-y-0 right-0 bg-foreground/15"
            style={{ width: `${100 - max}%` }}
            aria-hidden="true"
          />
        ) : null}
        <div
          className={cn('h-full rounded-full transition-all duration-500', fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
