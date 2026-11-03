'use client'

import { DeathScreen } from './death-screen'
import { GameDialogs } from './game-dialogs'
import { GameProvider, useGame } from './game-provider'
import { Hud } from './hud'
import { LifeScreen } from './life-screen'
import { SleepScreen } from './sleep-screen'
import { SocialScreen } from './social-screen'
import { StartScreen } from './start-screen'

function GameView() {
  const { state } = useGame()

  if (state.status === 'start') return <StartScreen />
  if (state.status === 'dead') return <DeathScreen />

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-4 px-3 py-4 md:px-6 md:py-6">
      <Hud />
      {state.view === 'life' ? <LifeScreen /> : null}
      {state.view === 'social' ? <SocialScreen /> : null}
      {state.view === 'sleep' ? <SleepScreen /> : null}
      <GameDialogs />
    </main>
  )
}

export function Game() {
  return (
    <GameProvider>
      <GameView />
    </GameProvider>
  )
}
