import type {
  Appearance,
  EyeColor,
  Gender,
  HairColor,
  HairStyle,
  OutfitColor,
  SkinTone,
} from './types'

export interface ColorOption<T extends string> {
  id: T
  label: string
  color: string
}

export const GENDERS: { id: Gender; label: string }[] = [
  { id: 'homem', label: 'Homem' },
  { id: 'mulher', label: 'Mulher' },
]

export const HAIR_STYLES: Record<Gender, { id: HairStyle; label: string }[]> = {
  homem: [
    { id: 0, label: 'Curto' },
    { id: 1, label: 'Topete' },
    { id: 2, label: 'Cacheado' },
    { id: 3, label: 'Black power' },
  ],
  mulher: [
    { id: 0, label: 'Longo' },
    { id: 1, label: 'Rabo de cavalo' },
    { id: 2, label: 'Coque' },
    { id: 3, label: 'Chanel' },
  ],
}

/** Do tom mais escuro ao mais claro. */
export const SKIN_TONES: ColorOption<SkinTone>[] = [
  { id: 'retinta', label: 'Retinta', color: '#5a3825' },
  { id: 'morena', label: 'Morena', color: '#8d5a3b' },
  { id: 'parda', label: 'Parda', color: '#c68a62' },
  { id: 'clara', label: 'Clara', color: '#f1c9a5' },
]

export const EYE_COLORS: ColorOption<EyeColor>[] = [
  { id: 'preto', label: 'Preto', color: '#1b1b1b' },
  { id: 'castanho', label: 'Castanho', color: '#6b3e1f' },
  { id: 'azul', label: 'Azul', color: '#3b7dd8' },
  { id: 'verde', label: 'Verde', color: '#3f9a5a' },
]

export const HAIR_COLORS: ColorOption<HairColor>[] = [
  { id: 'preto', label: 'Preto', color: '#1f1a17' },
  { id: 'castanho', label: 'Castanho', color: '#6a4027' },
  { id: 'ruivo', label: 'Ruivo', color: '#b5482a' },
  { id: 'loiro', label: 'Loiro', color: '#e0b552' },
]

export const OUTFIT_COLORS: ColorOption<OutfitColor>[] = [
  { id: 'verde', label: 'Verde', color: '#3f9a5a' },
  { id: 'preto', label: 'Preto', color: '#262626' },
  { id: 'vermelho', label: 'Vermelho', color: '#d23a3a' },
  { id: 'rosa', label: 'Rosa', color: '#e874a8' },
  { id: 'azul', label: 'Azul', color: '#3a6fd8' },
]

export const DEFAULT_APPEARANCE: Appearance = {
  hairStyle: 0,
  skinTone: 'parda',
  eyeColor: 'castanho',
  hairColor: 'castanho',
  outfitColor: 'azul',
}

export const DEFAULT_NAME: Record<Gender, string> = {
  homem: 'Webinho',
  mulher: 'Webinha',
}

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)]

export function randomAppearance(): Appearance {
  return {
    hairStyle: pick([0, 1, 2, 3] as const),
    skinTone: pick(SKIN_TONES).id,
    eyeColor: pick(EYE_COLORS).id,
    hairColor: pick(HAIR_COLORS).id,
    outfitColor: pick(OUTFIT_COLORS).id,
  }
}

export const colorOf = <T extends string>(options: ColorOption<T>[], id: T) =>
  options.find((o) => o.id === id)?.color ?? options[0].color

/**
 * Flexiona textos pelo gênero do personagem.
 * Use `{masculino|feminino}` no texto, por exemplo: "Você ficou cansad{o|a}".
 */
export function genderize(text: string, gender: Gender) {
  return text.replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (_, male: string, female: string) =>
    gender === 'mulher' ? female : male,
  )
}
