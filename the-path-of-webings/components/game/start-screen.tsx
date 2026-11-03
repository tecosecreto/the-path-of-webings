'use client'

import { useState } from 'react'
import { Clock, Link2, Moon, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PHASES } from '@/lib/game/data'
import { useGame } from './game-provider'

const RULES = [
  {
    icon: Smartphone,
    title: 'A rede é o centro',
    text: 'Vídeos dão felicidade rápida, mas cada categoria muda seus atributos. E o feed aprende com você.',
  },
  {
    icon: Clock,
    title: 'Cada ano é um dia',
    text: 'Das 07:00 à meia-noite. Dentro da rede, o tempo dobra de velocidade a cada 4 vídeos.',
  },
  {
    icon: Link2,
    title: 'Cuidado com a Dependência',
    text: 'Ela drena Disposição e Felicidade e reduz o ganho de tudo o que você faz.',
  },
  {
    icon: Moon,
    title: 'Dormir é avançar',
    text: 'Dormir passa o ano e recupera atributos. Suas escolhas antes de dormir contam.',
  },
]

export function StartScreen() {
  const { dispatch } = useGame()
  const [name, setName] = useState('')

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center gap-10 px-4 py-10">
      <section className="flex flex-col gap-6">
        <span className="w-fit rounded-full bg-foreground px-3 py-1 text-xs font-bold uppercase tracking-widest text-background">
          MVP · Simulador de vida digital
        </span>
        <h1 className="font-display text-5xl font-bold leading-[0.95] text-balance md:text-7xl">
          The Path Of <span className="text-primary">Webings</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground text-pretty">
          Viva no corpo de alguém que cresce totalmente conectado. Do primeiro tablet à terceira idade,
          tente chegar o mais longe possível equilibrando saúde, felicidade, vida social e sua relação com as redes.
        </p>
        <form
          className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault()
            dispatch({ type: 'START', name })
          }}
        >
          <label htmlFor="player-name" className="sr-only">
            Nome do personagem
          </label>
          <input
            id="player-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="Nome do personagem"
            className="h-12 flex-1 rounded-2xl border border-input bg-card px-4 text-base outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
          />
          <Button type="submit" size="lg" className="h-12 rounded-2xl px-6 text-base">
            Nascer
          </Button>
        </form>
      </section>

      <section aria-label="Como jogar" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {RULES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-4">
            <Icon className="size-6 text-primary" aria-hidden="true" />
            <h2 className="font-display font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground text-pretty">{text}</p>
          </div>
        ))}
      </section>

      <section aria-label="Fases da vida">
        <ol className="flex flex-wrap gap-2">
          {PHASES.map((p) => (
            <li key={p.id} className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm">
              <span className="font-display font-bold text-primary">{p.id + 1}</span>
              {p.name}
              <span className="text-xs text-muted-foreground">{p.ageLabel}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
