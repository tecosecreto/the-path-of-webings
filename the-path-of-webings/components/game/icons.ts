import {
  BookOpen,
  Brain,
  Dumbbell,
  Heart,
  Laugh,
  Leaf,
  Link2,
  Newspaper,
  Smile,
  Sofa,
  Sparkles,
  Target,
  Users,
  Video,
  Zap,
  Crown,
  Activity as ActivityIcon,
  type LucideIcon,
} from 'lucide-react'
import type { ActivityId, Category, MainKey, SubKey } from '@/lib/game/types'

export const MAIN_ICONS: Record<MainKey, LucideIcon> = {
  saude: Heart,
  disposicao: Zap,
  felicidade: Smile,
  dependencia: Link2,
}

export const SUB_ICONS: Record<SubKey, LucideIcon> = {
  foco: Target,
  sanidade: Leaf,
  forca: Dumbbell,
  inteligencia: Brain,
}

export const ACTIVITY_ICONS: Record<ActivityId, LucideIcon> = {
  exercicio: ActivityIcon,
  estudar: BookOpen,
  socializar: Users,
  criar: Video,
  descansar: Sofa,
}

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  meme: Laugh,
  brainrot: Sparkles,
  educativo: BookOpen,
  amigos: Users,
  lifestyle: Crown,
  fitness: Dumbbell,
  noticias: Newspaper,
}

export const CATEGORY_STYLES: Record<Category, { bg: string; chip: string; bar: string }> = {
  meme: {
    bg: 'from-amber-400 via-orange-500 to-rose-500',
    chip: 'bg-amber-300 text-amber-950',
    bar: 'bg-amber-400',
  },
  brainrot: {
    bg: 'from-fuchsia-500 via-purple-600 to-indigo-700',
    chip: 'bg-fuchsia-300 text-fuchsia-950',
    bar: 'bg-fuchsia-400',
  },
  educativo: {
    bg: 'from-sky-500 via-cyan-600 to-teal-700',
    chip: 'bg-sky-300 text-sky-950',
    bar: 'bg-sky-400',
  },
  amigos: {
    bg: 'from-emerald-400 via-teal-500 to-cyan-700',
    chip: 'bg-emerald-300 text-emerald-950',
    bar: 'bg-emerald-400',
  },
  lifestyle: {
    bg: 'from-rose-400 via-pink-500 to-fuchsia-600',
    chip: 'bg-rose-300 text-rose-950',
    bar: 'bg-rose-400',
  },
  fitness: {
    bg: 'from-lime-400 via-green-500 to-emerald-700',
    chip: 'bg-lime-300 text-lime-950',
    bar: 'bg-lime-400',
  },
  noticias: {
    bg: 'from-slate-500 via-slate-700 to-zinc-900',
    chip: 'bg-slate-300 text-slate-950',
    bar: 'bg-slate-400',
  },
}
