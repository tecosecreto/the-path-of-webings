'use client'

import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'
import { createInitialState, gameReducer, type GameAction } from '@/lib/game/engine'
import type { GameState } from '@/lib/game/types'

interface GameContextValue {
  state: GameState
  dispatch: Dispatch<GameAction>
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState())
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
