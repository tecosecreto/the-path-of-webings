import { EYE_COLORS, HAIR_COLORS, OUTFIT_COLORS, SKIN_TONES, colorOf } from '@/lib/game/character'
import type { Appearance, Gender } from '@/lib/game/types'
import { cn } from '@/lib/utils'

interface AvatarProps {
  gender: Gender
  appearance: Appearance
  className?: string
  /** Mostra só a cabeça (usado nas miniaturas de corte de cabelo). */
  headOnly?: boolean
  title?: string
}

const CAP =
  'M52 102 C48 56 74 38 100 38 C126 38 152 56 148 102 C142 80 124 68 100 68 C76 68 58 80 52 102 Z'

function HairBack({ gender, style, color }: { gender: Gender; style: number; color: string }) {
  if (gender === 'homem') {
    if (style === 3) return <circle cx="100" cy="88" r="68" fill={color} />
    return null
  }
  switch (style) {
    case 0:
      return (
        <path
          d="M46 100 C42 48 74 34 100 34 C126 34 158 48 154 100 L160 200 C130 212 70 212 40 200 Z"
          fill={color}
        />
      )
    case 1:
      return (
        <path d="M136 62 C178 60 186 126 168 178 C160 136 150 104 128 84 Z" fill={color} />
      )
    case 2:
      return <circle cx="100" cy="36" r="24" fill={color} />
    default:
      return (
        <path
          d="M44 100 C42 48 74 34 100 34 C126 34 158 48 156 100 L158 146 C138 156 62 156 42 146 Z"
          fill={color}
        />
      )
  }
}

function HairFront({ gender, style, color }: { gender: Gender; style: number; color: string }) {
  if (gender === 'homem') {
    switch (style) {
      case 0:
        return <path d={CAP} fill={color} />
      case 1:
        return (
          <g fill={color}>
            <path d={CAP} />
            <path d="M64 62 C66 22 124 12 142 48 C128 38 106 36 88 50 C80 56 72 60 64 62 Z" />
          </g>
        )
      case 2:
        return (
          <g fill={color}>
            <path d={CAP} />
            {[
              [58, 76],
              [68, 56],
              [86, 44],
              [106, 42],
              [124, 48],
              [138, 62],
              [146, 80],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="15" />
            ))}
          </g>
        )
      default:
        return <path d="M54 90 C54 60 76 46 100 46 C124 46 146 60 146 90 C132 74 116 68 100 68 C84 68 68 74 54 90 Z" fill={color} />
    }
  }
  switch (style) {
    case 3:
      return (
        <path d="M52 94 C52 56 76 40 100 40 C124 40 148 56 148 94 L148 80 C128 70 72 70 52 80 Z" fill={color} />
      )
    default:
      return (
        <path
          d="M52 104 C48 56 74 38 100 38 C126 38 152 56 148 104 C140 80 120 64 90 66 C72 70 60 84 52 104 Z"
          fill={color}
        />
      )
  }
}

export function Avatar({ gender, appearance, className, headOnly, title }: AvatarProps) {
  const skin = colorOf(SKIN_TONES, appearance.skinTone)
  const eye = colorOf(EYE_COLORS, appearance.eyeColor)
  const hair = colorOf(HAIR_COLORS, appearance.hairColor)
  const outfit = colorOf(OUTFIT_COLORS, appearance.outfitColor)
  const isFemale = gender === 'mulher'

  return (
    <svg
      viewBox={headOnly ? '20 10 160 170' : '0 0 200 240'}
      className={cn('block', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {!headOnly ? (
        <g>
          <path d="M26 240 C26 196 58 176 100 176 C142 176 174 196 174 240 Z" fill={outfit} />
          {isFemale ? (
            <path d="M80 178 Q100 206 120 178 Z" fill={skin} />
          ) : (
            <path d="M82 178 Q100 192 118 178" fill="none" stroke="#000" strokeOpacity="0.2" strokeWidth="4" />
          )}
        </g>
      ) : null}

      <HairBack gender={gender} style={appearance.hairStyle} color={hair} />

      <rect x="86" y="140" width="28" height="40" rx="10" fill={skin} />
      <rect x="86" y="140" width="28" height="16" fill="#000" opacity="0.12" />

      <ellipse cx="52" cy="108" rx="9" ry="12" fill={skin} />
      <ellipse cx="148" cy="108" rx="9" ry="12" fill={skin} />
      {isFemale ? (
        <>
          <circle cx="50" cy="122" r="3.5" fill="#f3c74b" />
          <circle cx="150" cy="122" r="3.5" fill="#f3c74b" />
        </>
      ) : null}

      <ellipse cx="100" cy="102" rx="48" ry="54" fill={skin} />

      <g>
        <ellipse cx="80" cy="106" rx="9" ry="10" fill="#fff" />
        <ellipse cx="120" cy="106" rx="9" ry="10" fill="#fff" />
        <circle cx="81" cy="107" r="6" fill={eye} />
        <circle cx="121" cy="107" r="6" fill={eye} />
        <circle cx="81" cy="107" r="2.6" fill="#111" />
        <circle cx="121" cy="107" r="2.6" fill="#111" />
        <circle cx="83" cy="104.5" r="1.6" fill="#fff" />
        <circle cx="123" cy="104.5" r="1.6" fill="#fff" />
        {isFemale ? (
          <g stroke="#111" strokeWidth="2.4" strokeLinecap="round">
            <path d="M71 98 L67 94" />
            <path d="M129 98 L133 94" />
          </g>
        ) : null}
      </g>

      <g stroke={hair} strokeLinecap="round" fill="none" strokeWidth={isFemale ? 2.6 : 4}>
        <path d="M70 90 Q80 84 90 89" />
        <path d="M110 89 Q120 84 130 90" />
      </g>

      <ellipse cx="68" cy="124" rx="7" ry="4" fill="#e8746c" opacity="0.35" />
      <ellipse cx="132" cy="124" rx="7" ry="4" fill="#e8746c" opacity="0.35" />
      <path d="M98 114 Q100 120 103 117" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M88 130 Q100 140 112 130"
        fill="none"
        stroke={isFemale ? '#b8434f' : '#5a2a22'}
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      <HairFront gender={gender} style={appearance.hairStyle} color={hair} />
    </svg>
  )
}
