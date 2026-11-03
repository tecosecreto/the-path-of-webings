'use client'

import { useState } from 'react'
import { Check, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DAY_END, DAY_START, PHASES, SLEEP_OPTIONS } from '@/lib/game/data'
import { clamp, formatClock } from '@/lib/game/engine'
import { cn } from '@/lib/utils'
import { useGame } from './game-provider'

export function SleepScreen() {
  const { state, dispatch } = useGame()
  const [selected, setSelected] = useState<string[]>([])
  const options = SLEEP_OPTIONS.filter((o) => o.phases.includes(state.phase))
  const sleepHours = state.forcedSleep ? 6 : clamp(DAY_END + DAY_START - state.minutes, 360, 720) / 60
  const years = PHASES[state.phase].yearsPerSleep

  const toggle = (id: string) => {
    const option = SLEEP_OPTIONS.find((o) => o.id === id)!
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev.filter((x) => !option.conflictsWith?.includes(x)), id],
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-[2rem] bg-foreground p-6 text-background md:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-chart-4">
          <Moon className="size-6 text-white" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <h2 className="font-display text-2xl font-bold">
            {state.forcedSleep ? 'Meia-noite. Hora de dormir.' : 'Hora de dormir'}
          </h2>
          <p className="text-sm text-background/70">
            {formatClock(state.minutes)} · você vai dormir cerca de {Math.round(sleepHours)}h ·{' '}
            {years === 1 ? '1 ano vai passar' : `${years} anos vão passar`}
          </p>
        </div>
      </div>

      {state.forcedSleep ? (
        <p className="rounded-2xl bg-destructive/20 p-3 text-sm text-pretty">
          Você ficou acordado até o limite. Vai acordar com menos Disposição e Felicidade.
        </p>
      ) : null}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-background/70">
          O que você faz antes de dormir? Isso afeta os ganhos do dia seguinte.
        </legend>
        {options.map((option) => {
          const active = selected.includes(option.id)
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(option.id)}
              className={cn(
                'flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                active ? 'border-primary bg-primary/20' : 'border-background/15 hover:bg-background/5',
              )}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-lg border',
                  active ? 'border-primary bg-primary text-primary-foreground' : 'border-background/30',
                )}
                aria-hidden="true"
              >
                {active ? <Check className="size-4" /> : null}
              </span>
              <span className="flex flex-col">
                <span className="font-medium">{option.name}</span>
                <span className="text-xs text-background/60">{option.description}</span>
              </span>
            </button>
          )
        })}
      </fieldset>

      <div className="flex flex-wrap gap-2">
        <Button
          size="lg"
          className="h-12 flex-1 rounded-2xl text-base"
          onClick={() => dispatch({ type: 'CONFIRM_SLEEP', optionIds: selected })}
        >
          Dormir
        </Button>
        {!state.forcedSleep ? (
          <Button
            size="lg"
            variant="ghost"
            className="h-12 rounded-2xl text-base text-background hover:bg-background/10 hover:text-background"
            onClick={() => dispatch({ type: 'CANCEL_SLEEP' })}
          >
            Ainda não
          </Button>
        ) : null}
      </div>
    </div>
  )
}
