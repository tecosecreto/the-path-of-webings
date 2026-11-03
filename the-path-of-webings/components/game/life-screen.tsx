'use client'

import { AlertTriangle, Check, Lock, Moon, Smartphone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ACTIVITIES, CHALLENGES, PHASES, SLEEP_FROM, SUB_LABELS } from '@/lib/game/data'
import {
  activityRequirementChecks,
  computeSubs,
  dependencyGainMultiplier,
  formatClock,
  isActivityAvailable,
} from '@/lib/game/engine'
import { cn } from '@/lib/utils'
import { useGame } from './game-provider'
import { ACTIVITY_ICONS } from './icons'

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h${m ? String(m).padStart(2, '0') : ''}` : `${m}min`
}

export function LifeScreen() {
  const { state, dispatch } = useGame()
  const subs = computeSubs(state.main, state.subBase)
  const mult = dependencyGainMultiplier(state.main.dependencia)
  const canSleep = state.minutes >= SLEEP_FROM
  const scheduled = state.challenge ? CHALLENGES.find((c) => c.id === state.challenge!.id) : null

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4">
        {scheduled && state.challenge ? (
          <div
            className="flex flex-wrap items-center gap-3 rounded-3xl border-2 border-dashed border-primary bg-primary/10 p-4"
            role="status"
          >
            <AlertTriangle className="size-6 shrink-0 text-primary" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="font-display font-bold">
                Desafio obrigatório às {formatClock(state.challenge.hour * 60)}: {scheduled.name}
              </span>
              <span className="text-sm text-muted-foreground">
                Precisa de{' '}
                {scheduled.requires
                  .map((k) => `${SUB_LABELS[k]} ${state.challenge!.threshold} (você: ${Math.round(subs[k])})`)
                  .join(' e ')}
                . Se falhar, perde muitos atributos.
              </span>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => dispatch({ type: 'OPEN_SOCIAL' })}
          className="group relative flex items-center gap-4 overflow-hidden rounded-3xl bg-foreground p-5 text-left text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
        >
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-primary to-amber-400">
            <Smartphone className="size-7 text-white" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="font-display text-xl font-bold">Abrir a Webings</span>
            <span className="text-sm text-background/70 text-pretty">
              {state.phase === 0
                ? 'O tablet dos seus pais está ali, dando sopa...'
                : 'Felicidade fácil. Mas o tempo passa cada vez mais rápido lá dentro.'}
            </span>
          </div>
          <span className="hidden rounded-full bg-background/10 px-3 py-1 text-xs font-medium sm:block">
            Hoje: {Math.round(state.screenMinutesToday)} min de tela
          </span>
        </button>

        <section aria-labelledby="atividades-title" className="flex flex-col gap-3">
          <div className="flex items-end justify-between gap-2">
            <h2 id="atividades-title" className="font-display text-lg font-bold">
              Atividades da vida real
            </h2>
            {mult < 1 ? (
              <span className="text-xs font-medium text-destructive">
                Dependência reduz seus ganhos em {Math.round((1 - mult) * 100)}%
              </span>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {ACTIVITIES.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.id]
              const available = isActivityAvailable(state, activity.id)
              const checks = available ? activityRequirementChecks(state, activity.id) : []
              const ok = available && checks.every((c) => c.ok)
              return (
                <button
                  key={activity.id}
                  type="button"
                  disabled={!ok}
                  onClick={() => dispatch({ type: 'DO_ACTIVITY', id: activity.id })}
                  className={cn(
                    'flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50',
                    ok ? 'hover:-translate-y-0.5 hover:border-primary hover:shadow-md' : 'cursor-not-allowed opacity-60',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-2xl',
                        ok ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {available ? <Icon className="size-5" aria-hidden="true" /> : <Lock className="size-5" aria-hidden="true" />}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="flex items-center justify-between gap-2 font-display font-bold">
                        {activity.name}
                        <span className="text-xs font-medium text-muted-foreground">
                          {formatDuration(activity.minutes)}
                        </span>
                      </span>
                      <span className="text-sm text-muted-foreground text-pretty">{activity.description}</span>
                    </div>
                  </div>
                  {!available ? (
                    <span className="text-xs font-medium text-muted-foreground">
                      Libera em: {PHASES[activity.minPhase].name}
                    </span>
                  ) : checks.length > 0 ? (
                    <ul className="flex flex-wrap gap-1.5" aria-label="Requisitos">
                      {checks.map((c) => (
                        <li
                          key={c.key}
                          className={cn(
                            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                            c.ok ? 'bg-accent/15 text-foreground' : 'bg-destructive/15 text-destructive',
                          )}
                        >
                          {c.ok ? <Check className="size-3" aria-hidden="true" /> : <X className="size-3" aria-hidden="true" />}
                          {SUB_LABELS[c.key]} {Math.round(c.value)}/{c.required}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sem requisitos</span>
                  )}
                </button>
              )
            })}
          </div>
        </section>
      </div>

      <aside className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Moon className="size-5 text-chart-4" aria-hidden="true" />
            <h2 className="font-display font-bold">Dormir</h2>
          </div>
          <p className="text-sm text-muted-foreground text-pretty">
            Dormir passa {PHASES[state.phase].yearsPerSleep === 1 ? '1 ano' : `${PHASES[state.phase].yearsPerSleep} anos`} e
            recupera seus atributos. Quanto mais cedo, mais você descansa. À meia-noite você dorme à força.
          </p>
          <Button
            size="lg"
            className="h-11 rounded-2xl text-base"
            disabled={!canSleep}
            onClick={() => dispatch({ type: 'GO_TO_SLEEP' })}
          >
            {canSleep ? 'Ir para a cama' : `Disponível a partir das ${formatClock(SLEEP_FROM)}`}
          </Button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-3xl border border-border bg-card p-4">
          <h2 className="font-display font-bold">Diário</h2>
          {state.log.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sua história começa agora.</p>
          ) : (
            <ol className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1">
              {state.log.map((entry) => (
                <li key={entry.id} className="flex gap-2 text-sm">
                  <span
                    className={cn(
                      'mt-1.5 size-2 shrink-0 rounded-full',
                      entry.tone === 'good' ? 'bg-accent' : entry.tone === 'bad' ? 'bg-destructive' : 'bg-muted-foreground/40',
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-pretty">
                    <span className="font-medium tabular-nums text-muted-foreground">
                      {entry.age}a · {formatClock(entry.time)}
                    </span>{' '}
                    {entry.text}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </aside>
    </div>
  )
}
