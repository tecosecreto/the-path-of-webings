'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { Check, PartyPopper, Sparkles, Trophy, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ACTIVITIES, PHASES, SUB_LABELS } from '@/lib/game/data'
import { cn } from '@/lib/utils'
import { useGame } from './game-provider'

function Overlay({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>('button')?.focus()
  }, [title])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-4 backdrop-blur-sm sm:items-center">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex w-full max-w-md flex-col gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95"
      >
        {children}
      </div>
    </div>
  )
}

export function GameDialogs() {
  const { state, dispatch } = useGame()
  if (state.status !== 'playing') return null

  const modal = state.modal
  if (modal) {
    const close = () => dispatch({ type: 'DISMISS_MODAL' })
    if (modal.kind === 'challenge') {
      return (
        <Overlay title={modal.name}>
          <div
            className={cn(
              'flex size-14 items-center justify-center rounded-2xl',
              modal.passed ? 'bg-accent text-accent-foreground' : 'bg-destructive text-white',
            )}
          >
            {modal.passed ? <Trophy className="size-7" aria-hidden="true" /> : <X className="size-7" aria-hidden="true" />}
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-2xl font-bold">
              {modal.passed ? 'Você passou!' : 'Você não passou...'}
            </h2>
            <p className="text-muted-foreground text-pretty">
              {modal.interruptedSocial ? 'Você estava rolando o feed quando chegou a hora. ' : ''}
              {modal.name}: {modal.passed ? 'mandou bem! Ganhou Felicidade e experiência.' : 'perdeu muita Saúde, Disposição e Felicidade.'}
            </p>
          </div>
          <ul className="flex flex-col gap-2">
            {modal.checks.map((c) => {
              const ok = c.value >= c.required
              return (
                <li key={c.key} className="flex items-center justify-between rounded-2xl bg-secondary px-3 py-2 text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    {ok ? <Check className="size-4 text-accent" aria-hidden="true" /> : <X className="size-4 text-destructive" aria-hidden="true" />}
                    {SUB_LABELS[c.key]}
                  </span>
                  <span className="tabular-nums">
                    {Math.round(c.value)} / {c.required}
                  </span>
                </li>
              )
            })}
          </ul>
          <Button size="lg" className="h-11 rounded-2xl" onClick={close}>
            Continuar
          </Button>
        </Overlay>
      )
    }
    if (modal.kind === 'phase') {
      const phase = PHASES[modal.phase]
      const unlocked = ACTIVITIES.filter((a) => a.minPhase === modal.phase)
      return (
        <Overlay title={phase.name}>
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <PartyPopper className="size-7" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Fase {modal.phase + 1} · {phase.ageLabel}
            </span>
            <h2 className="font-display text-3xl font-bold">{phase.name}</h2>
            <p className="text-muted-foreground text-pretty">{phase.description}</p>
          </div>
          {unlocked.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {unlocked.map((a) => (
                <span key={a.id} className="flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-sm font-medium">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Nova: {a.name}
                </span>
              ))}
            </div>
          ) : null}
          <Button size="lg" className="h-11 rounded-2xl" onClick={close}>
            Vamos lá
          </Button>
        </Overlay>
      )
    }
    return (
      <Overlay title={modal.title}>
        <h2 className="font-display text-2xl font-bold">{modal.title}</h2>
        <p className="text-muted-foreground">{modal.text}</p>
        <Button size="lg" className="h-11 rounded-2xl" onClick={close}>
          Ok
        </Button>
      </Overlay>
    )
  }

  const event = state.pendingEvent
  if (event) {
    return (
      <Overlay title={event.title}>
        <span className="w-fit rounded-full bg-chart-3/30 px-3 py-1 text-xs font-bold uppercase tracking-widest">
          Evento
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-bold">{event.title}</h2>
          <p className="text-muted-foreground text-pretty">{event.text}</p>
        </div>
        <div className="flex flex-col gap-2">
          {event.choices.map((choice, index) => (
            <Button
              key={choice.label}
              size="lg"
              variant={index === 0 ? 'default' : 'outline'}
              className="h-11 rounded-2xl"
              onClick={() => dispatch({ type: 'EVENT_CHOICE', index })}
            >
              {choice.label}
            </Button>
          ))}
        </div>
      </Overlay>
    )
  }

  return null
}
