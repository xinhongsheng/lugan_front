export const SPEC_TYPE_ENUM = ['diameter', 'weight'] as const

export const SPEC_TYPE_MAP: Record<(typeof SPEC_TYPE_ENUM)[number], string> = {
  diameter: '果径',
  weight: '重量包装',
}

export const SPEC_TYPE_OPTIONS = [
  { label: '果径', value: 'diameter' },
  { label: '重量包装', value: 'weight' },
]

export const SPEC_TYPE_COLOR_MAP: Record<(typeof SPEC_TYPE_ENUM)[number], string> = {
  diameter: 'orange',
  weight: 'blue',
}
