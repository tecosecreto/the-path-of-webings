'use client'

import { useEffect, useEffectEvent, useRef } from 'react'
import { ChevronDown, Clock, EyeOff, FastForward, Heart, MessageCircle, Share2, Users, X } from 'lucide-react'
import { CATEGORIES, MAIN_LABELS, REELS_PER_SPEEDUP, SUB_LABELS } from '@/lib/game/data'
import { feedShare, formatClock, minutesPerSecond } from '@/lib/game/engine'
import type { MainKey, SubKey } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { useGame } from './game-provider'
import { CATEGORY_ICONS, CATEGORY_STYLES, MAIN_ICONS } from './icons'
import { StatBar } from './stat-bar'

function useSocialClock(active: boolean, tick: () => void) {
  const onTick = useEffectEvent(tick)
  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => onTick(), 1000)
    return () => window.clearInterval(id)
  }, [active])
}

export function SocialScreen() {
  const { state, dispatch } = useGame()
  const reel = state.currentReel
  const rate = minutesPerSecond(state.reelsToday)
  const toNextSpeedup = REELS_PER_SPEEDUP - (state.reelsToday % REELS_PER_SPEEDUP)
  const lastWheel = useRef(0)

  useSocialClock(state.view === 'social' && !state.modal && !state.pendingEvent, () =>
    dispatch({ type: 'SOCIAL_TICK' }),
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault()
        dispatch({ type: 'NEXT_REEL' })
      } else if (e.key === 'l') {
        dispatch({ type: 'LIKE_REEL' })
      } else if (e.key === 'Escape') {
        dispatch({ type: 'CLOSE_SOCIAL' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch])

  const onWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 20) return
    const now = Date.now()
    if (now - lastWheel.current < 600) return
    lastWheel.current = now
    dispatch({ type: 'NEXT_REEL' })
  }

  const share = feedShare(state.feedWeights).sort((a, b) => b.share - a.share)
  const style = reel ? CATEGORY_STYLES[reel.category] : null
  const CatIcon = reel ? CATEGORY_ICONS[reel.category] : null

  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center">
      <div className="relative w-full max-w-[380px] overflow-hidden rounded-[2.5rem] border-[6px] border-foreground bg-zinc-950 text-white shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <span className="font-display text-lg font-bold">Webings</span>
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold tabular-nums transition-colors',
              rate >= 8 ? 'animate-pulse bg-destructive text-white' : rate >= 2 ? 'bg-amber-400 text-amber-950' : 'bg-white/10',
            )}
            aria-live="polite"
          >
            <Clock className="size-4" aria-hidden="true" />
            {formatClock(state.minutes)}
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: 'CLOSE_SOCIAL' })}
            className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Fechar app"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div
          className={cn(
            'relative mx-3 flex aspect-[9/14] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-gradient-to-br p-5',
            style?.bg,
          )}
          onWheel={onWheel}
        >
          {reel && CatIcon ? (
            <>
              <CatIcon
                className="pointer-events-none absolute -top-6 -right-6 size-48 rotate-12 text-white/15"
                aria-hidden="true"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className={cn('flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold', style?.chip)}>
                  <CatIcon className="size-3.5" aria-hidden="true" />
                  {CATEGORIES[reel.category].label}
                </span>
              </div>
              <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'LIKE_REEL' })}
                  className="flex flex-col items-center gap-1 text-xs font-semibold focus-visible:outline-none"
                  aria-pressed={state.currentReelLiked}
                  aria-label="Curtir"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-black/30 backdrop-blur">
                    <Heart
                      className={cn('size-6', state.currentReelLiked && 'fill-rose-500 text-rose-500')}
                      aria-hidden="true"
                    />
                  </span>
                  {reel.likes}
                </button>
                <span className="flex flex-col items-center gap-1 text-xs font-semibold" aria-hidden="true">
                  <span className="flex size-11 items-center justify-center rounded-full bg-black/30 backdrop-blur">
                    <MessageCircle className="size-6" />
                  </span>
                  {Math.floor(reel.caption.length * 13.7)}
                </span>
                <span className="flex flex-col items-center gap-1 text-xs font-semibold" aria-hidden="true">
                  <span className="flex size-11 items-center justify-center rounded-full bg-black/30 backdrop-blur">
                    <Share2 className="size-6" />
                  </span>
                  Enviar
                </span>
              </div>
              <div className="relative flex flex-col gap-2 pr-14">
                <span className="text-sm font-bold">{reel.creator}</span>
                <p className="font-display text-xl font-bold leading-snug text-balance">{reel.caption}</p>
              </div>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2 p-3">
          <button
            type="button"
            onClick={() => dispatch({ type: 'NOT_INTERESTED' })}
            className="flex h-12 items-center justify-center gap-1.5 rounded-2xl bg-white/10 px-4 text-sm font-medium transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <EyeOff className="size-4" aria-hidden="true" />
            Não tenho interesse
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'NEXT_REEL' })}
            className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-white text-sm font-bold text-zinc-950 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronDown className="size-5" aria-hidden="true" />
            Próximo vídeo
          </button>
        </div>
      </div>

      <aside className="flex w-full max-w-[380px] flex-col gap-3 lg:max-w-xs">
        <div
          className={cn(
            'flex flex-col gap-2 rounded-3xl p-4',
            rate >= 8 ? 'bg-destructive text-white' : 'bg-foreground text-background',
          )}
        >
          <div className="flex items-center gap-2">
            <FastForward className="size-5" aria-hidden="true" />
            <span className="font-display text-lg font-bold">1 segundo = {rate} min</span>
          </div>
          <p className="text-sm opacity-80 text-pretty">
            O tempo acelera a cada {REELS_PER_SPEEDUP} vídeos. Faltam {toNextSpeedup} para dobrar.
            Hoje você já viu {state.reelsToday} vídeos e gastou {Math.round(state.screenMinutesToday)} min.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4">
          {(['felicidade', 'disposicao', 'dependencia'] as MainKey[]).map((k) => (
            <StatBar
              key={k}
              label={MAIN_LABELS[k]}
              value={state.main[k]}
              icon={MAIN_ICONS[k]}
              inverted={k === 'dependencia'}
            />
          ))}
          {state.lastReelEffects ? (
            <div className="flex flex-wrap gap-1.5 border-t border-border pt-3" aria-label="Efeito do último vídeo">
              {Object.entries(state.lastReelEffects.main ?? {}).map(([k, v]) => (
                <EffectChip key={k} label={MAIN_LABELS[k as MainKey]} value={v as number} invert={k === 'dependencia'} />
              ))}
              {Object.entries(state.lastReelEffects.sub ?? {}).map(([k, v]) => (
                <EffectChip key={k} label={SUB_LABELS[k as SubKey]} value={v as number} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">Seu algoritmo</h2>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="size-3.5" aria-hidden="true" />
              {state.followers.toLocaleString('pt-BR')} seguidores
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-pretty">
            O feed aprende com o que você assiste, curte e ignora.
          </p>
          <ul className="flex flex-col gap-2">
            {share.map(({ category, share: s }) => (
              <li key={category} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{CATEGORIES[category].label}</span>
                  <span className="tabular-nums text-muted-foreground">{Math.round(s * 100)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', CATEGORY_STYLES[category].bar)}
                    style={{ width: `${s * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{CATEGORIES[category].description}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}

function EffectChip({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  const good = invert ? value < 0 : value > 0
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-medium tabular-nums',
        good ? 'bg-accent/15 text-foreground' : 'bg-destructive/15 text-destructive',
      )}
    >
      {value > 0 ? '+' : ''}
      {Number(value.toFixed(1))} {label}
    </span>
  )
}
