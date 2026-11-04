'use client'

import { useState, type ReactNode } from 'react'
import { ArrowLeft, Check, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DEFAULT_APPEARANCE,
  DEFAULT_NAME,
  EYE_COLORS,
  GENDERS,
  HAIR_COLORS,
  HAIR_STYLES,
  OUTFIT_COLORS,
  SKIN_TONES,
  randomAppearance,
  type ColorOption,
} from '@/lib/game/character'
import { DIFFICULTIES, DIFFICULTY_ORDER } from '@/lib/game/difficulty'
import type { Appearance, Difficulty, Gender } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { Avatar } from './avatar'
import { useGame } from './game-provider'

function Section({ title, value, children }: { title: string; value?: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-baseline justify-between gap-2" aria-hidden="true">
        <span className="font-display font-bold">{title}</span>
        {value ? <span className="text-sm text-muted-foreground">{value}</span> : null}
      </div>
      {children}
    </fieldset>
  )
}

function OptionTile({
  name,
  checked,
  onSelect,
  label,
  className,
  children,
}: {
  name: string
  checked: boolean
  onSelect: () => void
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <label
      className={cn(
        'relative flex cursor-pointer items-center justify-center rounded-2xl border-2 transition-all has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/40',
        checked ? 'border-primary bg-primary/10' : 'border-transparent bg-secondary hover:border-border',
        className,
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="sr-only" aria-label={label} />
      {children}
    </label>
  )
}

function SwatchGroup<T extends string>({
  name,
  title,
  options,
  value,
  onChange,
}: {
  name: string
  title: string
  options: ColorOption<T>[]
  value: T
  onChange: (id: T) => void
}) {
  return (
    <Section title={title} value={options.find((o) => o.id === value)?.label}>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => {
          const checked = o.id === value
          return (
            <label
              key={o.id}
              title={o.label}
              className={cn(
                'relative flex size-11 cursor-pointer items-center justify-center rounded-full ring-offset-2 ring-offset-card transition-all has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/40',
                checked ? 'ring-[3px] ring-primary' : 'ring-1 ring-border hover:scale-105',
              )}
              style={{ backgroundColor: o.color }}
            >
              <input
                type="radio"
                name={name}
                checked={checked}
                onChange={() => onChange(o.id)}
                className="sr-only"
                aria-label={o.label}
              />
              {checked ? <Check className="size-5 text-white drop-shadow" aria-hidden="true" /> : null}
            </label>
          )
        })}
      </div>
    </Section>
  )
}

export function CharacterCreation({ onBack }: { onBack: () => void }) {
  const { dispatch } = useGame()
  const [name, setName] = useState('')
  const [gender, setGender] = useState<Gender>('homem')
  const [appearance, setAppearance] = useState<Appearance>(DEFAULT_APPEARANCE)
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')

  const update = <K extends keyof Appearance>(key: K, value: Appearance[K]) =>
    setAppearance((prev) => ({ ...prev, [key]: value }))

  const hairStyles = HAIR_STYLES[gender]
  const displayName = name.trim() || DEFAULT_NAME[gender]

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="sm" className="w-fit -ml-2" onClick={onBack}>
            <ArrowLeft aria-hidden="true" />
            Voltar
          </Button>
          <span className="w-fit rounded-full bg-foreground px-3 py-1 text-xs font-bold uppercase tracking-widest text-background">
            Criação de personagem
          </span>
          <h1 className="font-display text-4xl font-bold text-balance">Quem vai nascer?</h1>
          <p className="max-w-xl text-muted-foreground text-pretty">
            Monte seu personagem. O gênero muda os textos e os eventos que aparecem durante a vida.
          </p>
        </div>
        <Button variant="outline" className="rounded-2xl" onClick={() => setAppearance(randomAppearance())}>
          <Shuffle aria-hidden="true" />
          Aleatório
        </Button>
      </header>

      <form
        className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]"
        onSubmit={(e) => {
          e.preventDefault()
          dispatch({ type: 'START', character: { name, gender, appearance, difficulty } })
        }}
      >
        <section
          aria-label="Prévia do personagem"
          className="flex flex-col items-center gap-4 self-start rounded-[2rem] bg-foreground p-6 text-background md:sticky md:top-6"
        >
          <div className="w-full max-w-64 rounded-[1.5rem] bg-background/10 p-4">
            <Avatar
              gender={gender}
              appearance={appearance}
              className="mx-auto w-full"
              title={`Prévia de ${displayName}`}
            />
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold">{displayName}</p>
            <p className="text-sm text-background/70">
              {gender === 'mulher' ? 'Mulher' : 'Homem'} · {hairStyles[appearance.hairStyle].label} ·{' '}
              Modo {DIFFICULTIES[difficulty].label}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <label htmlFor="player-name" className="text-sm font-medium">
              Nome
            </label>
            <input
              id="player-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              autoComplete="off"
              placeholder={DEFAULT_NAME[gender]}
              className="h-12 rounded-2xl border border-background/20 bg-background/10 px-4 text-base text-background outline-none placeholder:text-background/50 focus-visible:ring-4 focus-visible:ring-primary/50"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 w-full rounded-2xl text-base">
            Nascer
          </Button>
        </section>

        <div className="flex flex-col gap-4">
          <Section title="Dificuldade" value={DIFFICULTIES[difficulty].tagline}>
            <div className="grid gap-3 sm:grid-cols-2">
              {DIFFICULTY_ORDER.map((id) => {
                const d = DIFFICULTIES[id]
                const checked = difficulty === id
                return (
                  <OptionTile
                    key={id}
                    name="difficulty"
                    label={`${d.label}: ${d.tagline}`}
                    checked={checked}
                    onSelect={() => setDifficulty(id)}
                    className="flex-col items-start justify-start gap-1.5 p-3 text-left"
                  >
                    <span className="flex w-full items-center justify-between gap-2 font-display font-bold">
                      {d.label}
                      <span className="flex gap-0.5" aria-hidden="true">
                        {DIFFICULTY_ORDER.map((_, i) => (
                          <span
                            key={i}
                            className={cn(
                              'size-1.5 rounded-full',
                              i <= DIFFICULTY_ORDER.indexOf(id)
                                ? id === 'pesadelo'
                                  ? 'bg-destructive'
                                  : 'bg-primary'
                                : 'bg-border',
                            )}
                          />
                        ))}
                      </span>
                    </span>
                    <ul className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                      {d.bullets.map((b) => (
                        <li key={b}>· {b}</li>
                      ))}
                    </ul>
                  </OptionTile>
                )
              })}
            </div>
          </Section>

          <Section title="Gênero">
            <div className="grid grid-cols-2 gap-3">
              {GENDERS.map((g) => (
                <OptionTile
                  key={g.id}
                  name="gender"
                  label={g.label}
                  checked={gender === g.id}
                  onSelect={() => setGender(g.id)}
                  className="h-14 gap-2 font-display font-bold"
                >
                  {g.label}
                </OptionTile>
              ))}
            </div>
          </Section>

          <Section title="Corte de cabelo" value={hairStyles[appearance.hairStyle].label}>
            <div className="grid grid-cols-4 gap-3">
              {hairStyles.map((style) => (
                <OptionTile
                  key={style.id}
                  name="hair-style"
                  label={style.label}
                  checked={appearance.hairStyle === style.id}
                  onSelect={() => update('hairStyle', style.id)}
                  className="aspect-square p-1.5"
                >
                  <Avatar
                    gender={gender}
                    appearance={{ ...appearance, hairStyle: style.id }}
                    headOnly
                    className="size-full"
                  />
                </OptionTile>
              ))}
            </div>
          </Section>

          <SwatchGroup
            name="skin"
            title="Tom de pele"
            options={SKIN_TONES}
            value={appearance.skinTone}
            onChange={(v) => update('skinTone', v)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SwatchGroup
              name="eyes"
              title="Cor dos olhos"
              options={EYE_COLORS}
              value={appearance.eyeColor}
              onChange={(v) => update('eyeColor', v)}
            />
            <SwatchGroup
              name="hair-color"
              title="Cor do cabelo"
              options={HAIR_COLORS}
              value={appearance.hairColor}
              onChange={(v) => update('hairColor', v)}
            />
          </div>
          <SwatchGroup
            name="outfit"
            title="Cor da roupa"
            options={OUTFIT_COLORS}
            value={appearance.outfitColor}
            onChange={(v) => update('outfitColor', v)}
          />
        </div>
      </form>
    </main>
  )
}
