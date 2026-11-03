'use client'

import { Flower2, Skull } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ACTIVITIES, CATEGORIES, CATEGORY_ORDER, HEALTHY_TIPS, PHASES } from '@/lib/game/data'
import type { DeathCause } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { Avatar } from './avatar'
import { useGame } from './game-provider'
import { CATEGORY_STYLES } from './icons'

const CAUSES: Record<DeathCause, { title: string; text: string }> = {
  saude: {
    title: 'Virou esqueletinho',
    text: 'Sua Saúde chegou a zero. O corpo cobrou o preço de tanto tempo parado.',
  },
  exaustao: {
    title: 'Exaustão total',
    text: 'Sem Disposição, sua Saúde foi se esgotando aos poucos até acabar.',
  },
  felicidade: {
    title: 'A felicidade acabou',
    text: 'Sua Felicidade chegou a zero. A felicidade fácil das telas não sustentou a vida real.',
  },
  velhice: {
    title: 'Uma vida inteira',
    text: 'Você chegou aos 100 anos. Uma jornada longa, vivida até o fim.',
  },
}

export function DeathScreen() {
  const { state, dispatch } = useGame()
  const cause = CAUSES[state.deathCause ?? 'saude']
  const totalReels = CATEGORY_ORDER.reduce((s, c) => s + state.reelsByCategory[c], 0)
  const topCategory = [...CATEGORY_ORDER].sort((a, b) => state.reelsByCategory[b] - state.reelsByCategory[a])[0]
  const screenHours = Math.round(state.totalScreenMinutes / 60)
  const maxScreen = Math.max(60, ...state.history.map((h) => h.screenMinutes))

  const lessons: string[] = []
  if (state.totalScreenMinutes > state.history.length * 180)
    lessons.push('Você passou, em média, mais de 3 horas por dia nas redes.')
  if (state.activityCounts.socializar < state.history.length)
    lessons.push('Você socializou pouco presencialmente — isso ajuda muito a reduzir a dependência.')
  if (topCategory === 'brainrot' || topCategory === 'meme')
    lessons.push(`Seu feed foi dominado por ${CATEGORIES[topCategory].label}, que corroem o Foco.`)
  if (state.challengesFailed > state.challengesPassed)
    lessons.push('Você falhou em mais desafios do que passou. Sub atributos baixos cobram seu preço.')
  if (lessons.length === 0) lessons.push('Você encontrou um bom equilíbrio entre a vida real e a digital.')

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 px-4 py-10">
      <section className="flex flex-col items-start gap-4 rounded-[2rem] bg-foreground p-6 text-background md:p-8">
        <span className="rounded-full bg-background/10 px-3 py-1 text-xs font-bold uppercase tracking-widest">
          Fase 9 · Morte · Resumo
        </span>
        <div className="flex items-center gap-4">
          <div className="size-16 overflow-hidden rounded-2xl bg-background/10">
            <Avatar gender={state.gender} appearance={state.appearance} headOnly className="size-full" />
          </div>
          <div
            className={cn(
              'flex size-16 items-center justify-center rounded-2xl',
              state.deathCause === 'velhice' ? 'bg-accent' : 'bg-background text-foreground',
            )}
          >
            {state.deathCause === 'velhice' ? (
              <Flower2 className="size-8" aria-hidden="true" />
            ) : (
              <Skull className="size-8" aria-hidden="true" />
            )}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">{cause.title}</h1>
            <p className="text-background/70">
              {state.name} viveu até os {state.age} anos · {PHASES[state.phase].name}
            </p>
          </div>
        </div>
        <p className="text-pretty text-background/80">{cause.text}</p>
      </section>

      <section aria-label="Números da vida" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Idade final', value: `${state.age} anos` },
          { label: 'Tempo de tela', value: `${screenHours}h` },
          { label: 'Vídeos vistos', value: totalReels.toLocaleString('pt-BR') },
          { label: 'Seguidores', value: state.followers.toLocaleString('pt-BR') },
          { label: 'Desafios vencidos', value: `${state.challengesPassed}/${state.challengesPassed + state.challengesFailed}` },
          ...ACTIVITIES.filter((a) => a.id !== 'descansar').map((a) => ({
            label: a.name,
            value: `${state.activityCounts[a.id]}x`,
          })),
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 rounded-3xl border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            <span className="font-display text-2xl font-bold tabular-nums">{stat.value}</span>
          </div>
        ))}
      </section>

      {state.history.length > 1 ? (
        <section className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5" aria-labelledby="tela-title">
          <h2 id="tela-title" className="font-display text-lg font-bold">
            Tempo de tela por ano vivido
          </h2>
          <div className="flex h-32 items-end gap-1" role="img" aria-label="Gráfico de tempo de tela por ano">
            {state.history.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                <div
                  className={cn('w-full rounded-t-md', h.screenMinutes > 180 ? 'bg-destructive' : 'bg-accent')}
                  style={{ height: `${Math.max(3, (h.screenMinutes / maxScreen) * 100)}%` }}
                  title={`${h.age} anos: ${Math.round(h.screenMinutes)} min`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{state.history[0].age} anos</span>
            <span>{state.history[state.history.length - 1].age} anos</span>
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5" aria-labelledby="feed-title">
          <h2 id="feed-title" className="font-display text-lg font-bold">
            O que você consumiu
          </h2>
          <ul className="flex flex-col gap-2">
            {CATEGORY_ORDER.map((c) => {
              const pct = totalReels ? (state.reelsByCategory[c] / totalReels) * 100 : 0
              return (
                <li key={c} className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    <span>{CATEGORIES[c].label}</span>
                    <span className="tabular-nums text-muted-foreground">{Math.round(pct)}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={cn('h-full rounded-full', CATEGORY_STYLES[c].bar)} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5" aria-labelledby="licoes-title">
          <h2 id="licoes-title" className="font-display text-lg font-bold">
            Reflexões da sua jornada
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            {lessons.map((l) => (
              <li key={l} className="rounded-2xl bg-secondary p-3 text-pretty">
                {l}
              </li>
            ))}
          </ul>
          <h3 className="mt-2 font-display font-bold">Para usar as redes de forma saudável</h3>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
            {HEALTHY_TIPS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      </div>

      <Button size="lg" className="h-12 self-center rounded-2xl px-8 text-base" onClick={() => dispatch({ type: 'RESTART' })}>
        Viver de novo
      </Button>
    </main>
  )
}
