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

export const AUDIT_STATUS_ENUM = ['pending', 'passed', 'rejected'] as const

export const AUDIT_STATUS_MAP: Record<(typeof AUDIT_STATUS_ENUM)[number], string> = {
  pending: '待审核',
  passed: '已通过',
  rejected: '已驳回',
}

export const AUDIT_STATUS_OPTIONS = [
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'passed' },
  { label: '已驳回', value: 'rejected' },
]

export const AUDIT_STATUS_COLOR_MAP: Record<(typeof AUDIT_STATUS_ENUM)[number], string> = {
  pending: 'gold',
  passed: 'green',
  rejected: 'red',
}
