export type MainKey = 'saude' | 'disposicao' | 'felicidade' | 'dependencia'
export type SubKey = 'foco' | 'sanidade' | 'forca' | 'inteligencia'

export type MainStats = Record<MainKey, number>
export type SubStats = Record<SubKey, number>

export interface Effects {
  main?: Partial<MainStats>
  sub?: Partial<SubStats>
  followers?: number
  minutes?: number
}

export type Category =
  | 'meme'
  | 'brainrot'
  | 'educativo'
  | 'amigos'
  | 'lifestyle'
  | 'fitness'
  | 'noticias'

export interface Phase {
  id: number
  name: string
  ageLabel: string
  minAge: number
  yearsPerSleep: number
  description: string
}

export type ActivityId = 'exercicio' | 'estudar' | 'socializar' | 'criar' | 'descansar'

export interface Activity {
  id: ActivityId
  name: string
  description: string
  minutes: number
  minPhase: number
  requirements: (phase: number) => Partial<SubStats>
  effects: Effects
}

export type ChallengeId = 'prova' | 'apresentacao' | 'entrevista' | 'campeonato'

export interface Challenge {
  id: ChallengeId
  name: string
  description: string
  phases: number[]
  requires: SubKey[]
}

export interface ScheduledChallenge {
  id: ChallengeId
  hour: number
  threshold: number
}

export interface Reel {
  id: string
  category: Category
  creator: string
  caption: string
  likes: string
}

export interface EventChoice {
  label: string
  effects: Effects
  log: string
}

export interface GameEvent {
  id: string
  title: string
  text: string
  phases: number[]
  minFollowers?: number
  choices: EventChoice[]
}

export interface SleepOption {
  id: string
  name: string
  description: string
  phases: number[]
  conflictsWith?: string[]
  effects: Effects
  disposicaoGainModifier?: number
}

export type LogTone = 'good' | 'bad' | 'neutral'

export interface LogEntry {
  id: number
  age: number
  time: number
  text: string
  tone: LogTone
}

export interface YearSnapshot {
  age: number
  phase: number
  main: MainStats
  followers: number
  screenMinutes: number
}

export type DeathCause = 'saude' | 'exaustao' | 'felicidade' | 'velhice'

export type Modal =
  | {
      kind: 'challenge'
      name: string
      passed: boolean
      checks: { key: SubKey; value: number; required: number }[]
      interruptedSocial: boolean
    }
  | { kind: 'phase'; phase: number }
  | { kind: 'info'; title: string; text: string }

export interface GameState {
  status: 'start' | 'playing' | 'dead'
  view: 'life' | 'social' | 'sleep'
  name: string
  age: number
  phase: number
  minutes: number
  main: MainStats
  subBase: SubStats
  followers: number
  feedWeights: Record<Category, number>
  currentReel: Reel | null
  currentReelSeconds: number
  currentReelLiked: boolean
  lastReelEffects: Effects | null
  reelsToday: number
  screenMinutesToday: number
  totalScreenMinutes: number
  reelsByCategory: Record<Category, number>
  challenge: ScheduledChallenge | null
  challengesPassed: number
  challengesFailed: number
  activityCounts: Record<ActivityId, number>
  pendingEvent: GameEvent | null
  eventsSeen: string[]
  modal: Modal | null
  forcedSleep: boolean
  log: LogEntry[]
  logCounter: number
  history: YearSnapshot[]
  deathCause: DeathCause | null
}
