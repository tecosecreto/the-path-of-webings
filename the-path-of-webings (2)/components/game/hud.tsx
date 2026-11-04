'use client'

import { Clock, Gauge, Users } from 'lucide-react'
import { DIFFICULTIES } from '@/lib/game/difficulty'
import { cn } from '@/lib/utils'
import { MAIN_LABELS, PHASES, SUB_LABELS, DAY_END, DAY_START } from '@/lib/game/data'
import { computeSubs, formatClock, maxHealthForAge } from '@/lib/game/engine'
import type { MainKey, SubKey } from '@/lib/game/types'
import { Avatar } from './avatar'
import { useGame } from './game-provider'
import { MAIN_ICONS, SUB_ICONS } from './icons'
import { StatBar } from './stat-bar'

const MAIN_KEYS: MainKey[] = ['saude', 'disposicao', 'felicidade', 'dependencia']
const SUB_KEYS: SubKey[] = ['foco', 'sanidade', 'forca', 'inteligencia']

export function Hud() {
  const { state } = useGame()
  const subs = computeSubs(state.main, state.subBase, state.age)
  const phase = PHASES[state.phase]
  const dayProgress = ((state.minutes - DAY_START) / (DAY_END - DAY_START)) * 100

  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-14 shrink-0 overflow-hidden rounded-2xl bg-secondary">
            <Avatar gender={state.gender} appearance={state.appearance} headOnly className="size-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Fase {state.phase + 1} de 9 · {phase.ageLabel}
            </span>
            <h1 className="font-display text-2xl font-bold leading-tight text-balance">
              {state.name}, {state.age} {state.age === 1 ? 'ano' : 'anos'}
              <span className="text-primary"> · {phase.name}</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium',
              state.difficulty === 'pesadelo' || state.difficulty === 'dificil'
                ? 'bg-destructive/15 text-destructive'
                : 'bg-secondary',
            )}
          >
            <Gauge className="size-4" aria-hidden="true" />
            <span className="sr-only">Dificuldade:</span>
            {DIFFICULTIES[state.difficulty].label}
          </span>
          <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium">
            <Users className="size-4" aria-hidden="true" />
            <span className="tabular-nums">{state.followers.toLocaleString('pt-BR')}</span>
            <span className="sr-only">seguidores</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-sm font-semibold text-background">
            <Clock className="size-4" aria-hidden="true" />
            <span className="font-display tabular-nums">{formatClock(state.minutes)}</span>
          </div>
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${Math.min(100, dayProgress)}%` }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <section aria-label="Atributos principais" className="grid grid-cols-2 gap-x-4 gap-y-3">
          {MAIN_KEYS.map((key) => (
            <StatBar
              key={key}
              label={MAIN_LABELS[key]}
              value={state.main[key]}
              max={key === 'saude' ? maxHealthForAge(state.age) : 100}
              icon={MAIN_ICONS[key]}
              inverted={key === 'dependencia'}
            />
          ))}
        </section>
        <section
          aria-label="Sub atributos"
          className="grid grid-cols-4 gap-2 border-t border-border pt-3 md:border-t-0 md:border-l md:pt-0 md:pl-4"
        >
          {SUB_KEYS.map((key) => {
            const Icon = SUB_ICONS[key]
            return (
              <div key={key} className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-secondary py-2">
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="font-display text-lg font-bold tabular-nums leading-none">
                  {Math.round(subs[key])}
                </span>
                <span className="text-[11px] text-muted-foreground">{SUB_LABELS[key]}</span>
              </div>
            )
          })}
        </section>
      </div>
    </header>
  )
}
