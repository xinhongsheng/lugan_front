export const SHELF_STATUS_ENUM = [0, 1] as const

export const SHELF_STATUS_MAP: Record<(typeof SHELF_STATUS_ENUM)[number], string> = {
  0: '下架',
  1: '上架',
}

export const SHELF_STATUS_OPTIONS = [
  { label: '下架', value: 0 },
  { label: '上架', value: 1 },
]

export const SHELF_STATUS_COLOR_MAP: Record<(typeof SHELF_STATUS_ENUM)[number], string> = {
  0: 'default',
  1: 'green',
}
