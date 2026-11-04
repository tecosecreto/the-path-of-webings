import type { ActivityId, Difficulty, SubStats } from './types'

export interface DifficultyConfig {
  id: Difficulty
  label: string
  tagline: string
  bullets: string[]
  /** Multiplica ganhos positivos de atributos, sub atributos e seguidores. */
  gainMult: number
  /** Multiplica perdas (efeitos negativos). */
  lossMult: number
  /** Multiplica todo aumento de Dependência. */
  dependencyMult: number
  /** Dependência que sobe sozinha por hora acordad{o|a} (a partir da 2ª Infância). */
  passiveDependencyPerHour: number
  /** Multiplica o desgaste de Disposição/Felicidade com o passar das horas. */
  drainMult: number
  /** Multiplica a recuperação básica do sono. */
  sleepRecoveryMult: number
  /** Multiplica o envelhecimento (perda de Saúde com a idade). */
  agingMult: number
  /** Multiplica a chance de eventos aleatórios. */
  eventChanceMult: number
  /** Peso dos eventos ruins no sorteio (0 = nunca aparecem). */
  badEventWeight: number
  /** Chance de um evento ruim vir logo em seguida a outro evento ou a um desafio perdido. */
  chainChance: number
  /** Multiplica os requisitos das atividades. */
  requirementMult: number
  /** Atividades passam a exigir sub atributos extras. */
  extraActivityRequirements: boolean
  /** Chance de haver um desafio no dia. */
  challengeChance: number
  /** Pontos extras de requisito nos desafios, por fase. */
  challengeThresholdPerPhase: number
  /** Quantos sub atributos extras os desafios exigem. */
  extraChallengeSubs: number
  /** Redução de ganho a cada repetição da mesma atividade no mesmo dia. */
  repeatPenalty: number
  /** Dependência extra ao falhar num desafio (descontar a frustração na tela). */
  failDependency: number
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  casual: {
    id: 'casual',
    label: 'Casual',
    tagline: 'Para conhecer a história sem pressão.',
    bullets: ['Ganhos maiores, perdas menores', 'Menos desafios e sem eventos ruins'],
    gainMult: 1.15,
    lossMult: 0.8,
    dependencyMult: 0.8,
    passiveDependencyPerHour: 0,
    drainMult: 0.85,
    sleepRecoveryMult: 1.1,
    agingMult: 0.8,
    eventChanceMult: 0.8,
    badEventWeight: 0,
    chainChance: 0,
    requirementMult: 0.85,
    extraActivityRequirements: false,
    challengeChance: 0.55,
    challengeThresholdPerPhase: 0,
    extraChallengeSubs: 0,
    repeatPenalty: 0,
    failDependency: 0,
  },
  normal: {
    id: 'normal',
    label: 'Normal',
    tagline: 'A experiência equilibrada.',
    bullets: ['Eventos ruins ocasionais', 'Repetir a mesma atividade rende um pouco menos'],
    gainMult: 1,
    lossMult: 1,
    dependencyMult: 1,
    passiveDependencyPerHour: 0,
    drainMult: 1,
    sleepRecoveryMult: 1,
    agingMult: 1,
    eventChanceMult: 1,
    badEventWeight: 0.5,
    chainChance: 0.1,
    requirementMult: 1,
    extraActivityRequirements: false,
    challengeChance: 0.75,
    challengeThresholdPerPhase: 0,
    extraChallengeSubs: 0,
    repeatPenalty: 0.1,
    failDependency: 0,
  },
  dificil: {
    id: 'dificil',
    label: 'Difícil',
    tagline: 'A vida conectada cobra seu preço.',
    bullets: [
      'Menos ganhos, mais perdas e mais Dependência',
      'Eventos ruins frequentes e em sequência',
      'Desafios exigem 3 sub atributos',
      'Atividades pedem sub atributos extras',
    ],
    gainMult: 0.75,
    lossMult: 1.3,
    dependencyMult: 1.4,
    passiveDependencyPerHour: 0.12,
    drainMult: 1.3,
    sleepRecoveryMult: 0.85,
    agingMult: 1.25,
    eventChanceMult: 1.4,
    badEventWeight: 1.6,
    chainChance: 0.35,
    requirementMult: 1.2,
    extraActivityRequirements: true,
    challengeChance: 0.9,
    challengeThresholdPerPhase: 2,
    extraChallengeSubs: 1,
    repeatPenalty: 0.2,
    failDependency: 4,
  },
  pesadelo: {
    id: 'pesadelo',
    label: 'Pesadelo',
    tagline: 'Sobreviver já é uma vitória.',
    bullets: [
      'Ganhos pela metade, perdas pesadas',
      'A Dependência sobe sozinha com o tempo',
      'Desgraças vêm em cadeia',
      'Desafios todo dia exigindo os 4 sub atributos',
    ],
    gainMult: 0.55,
    lossMult: 1.6,
    dependencyMult: 1.8,
    passiveDependencyPerHour: 0.28,
    drainMult: 1.6,
    sleepRecoveryMult: 0.72,
    agingMult: 1.5,
    eventChanceMult: 1.8,
    badEventWeight: 3,
    chainChance: 0.6,
    requirementMult: 1.4,
    extraActivityRequirements: true,
    challengeChance: 1,
    challengeThresholdPerPhase: 3,
    extraChallengeSubs: 2,
    repeatPenalty: 0.3,
    failDependency: 8,
  },
}

export const DIFFICULTY_ORDER: Difficulty[] = ['casual', 'normal', 'dificil', 'pesadelo']

const scale = (base: number, step: number) => (phase: number) => base + step * phase

/** Requisitos adicionais das atividades nos modos difíceis. */
export const EXTRA_ACTIVITY_REQUIREMENTS: Record<ActivityId, (phase: number) => Partial<SubStats>> = {
  exercicio: (p) => ({ sanidade: scale(5, 2)(p) }),
  estudar: (p) => ({ sanidade: scale(6, 2)(p) }),
  socializar: (p) => (p === 0 ? {} : { foco: scale(5, 2)(p) }),
  criar: (p) => ({ inteligencia: scale(10, 3)(p), sanidade: scale(8, 2)(p) }),
  descansar: () => ({}),
}
