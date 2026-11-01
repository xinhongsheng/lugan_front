export const COUPON_TYPE_ENUM = ['full', 'newcomer', 'festival'] as const

export const COUPON_TYPE_MAP: Record<(typeof COUPON_TYPE_ENUM)[number], string> = {
  full: '满减',
  newcomer: '新人券',
  festival: '节日券',
}

export const COUPON_TYPE_OPTIONS = COUPON_TYPE_ENUM.map((value) => ({
  label: COUPON_TYPE_MAP[value],
  value,
}))

export const COUPON_TYPE_COLOR_MAP: Record<(typeof COUPON_TYPE_ENUM)[number], string> = {
  full: 'blue',
  newcomer: 'green',
  festival: 'gold',
}

export const COUPON_STATUS_ENUM = ['draft', 'published', 'offline', 'voided'] as const

export const COUPON_STATUS_MAP: Record<(typeof COUPON_STATUS_ENUM)[number], string> = {
  draft: '草稿',
  published: '发放中',
  offline: '已下线',
  voided: '已作废',
}

export const COUPON_STATUS_OPTIONS = COUPON_STATUS_ENUM.map((value) => ({
  label: COUPON_STATUS_MAP[value],
  value,
}))

export const COUPON_STATUS_COLOR_MAP: Record<(typeof COUPON_STATUS_ENUM)[number], string> = {
  draft: 'default',
  published: 'green',
  offline: 'orange',
  voided: 'red',
}

export const ACTIVITY_TYPE_ENUM = ['seckill', 'wholesale', 'group'] as const

export const ACTIVITY_TYPE_MAP: Record<(typeof ACTIVITY_TYPE_ENUM)[number], string> = {
  seckill: '秒杀',
  wholesale: '团购',
  group: '拼团',
}

export const ACTIVITY_TYPE_OPTIONS = ACTIVITY_TYPE_ENUM.map((value) => ({
  label: ACTIVITY_TYPE_MAP[value],
  value,
}))

export const ACTIVITY_TYPE_COLOR_MAP: Record<(typeof ACTIVITY_TYPE_ENUM)[number], string> = {
  seckill: 'red',
  wholesale: 'blue',
  group: 'purple',
}

export const ACTIVITY_STATUS_ENUM = ['draft', 'online', 'paused', 'offline', 'ended'] as const

export const ACTIVITY_STATUS_MAP: Record<(typeof ACTIVITY_STATUS_ENUM)[number], string> = {
  draft: '草稿',
  online: '已上架',
  paused: '已暂停',
  offline: '已下架',
  ended: '已结束',
}

export const ACTIVITY_STATUS_OPTIONS = ACTIVITY_STATUS_ENUM.map((value) => ({
  label: ACTIVITY_STATUS_MAP[value],
  value,
}))

export const ACTIVITY_STATUS_COLOR_MAP: Record<(typeof ACTIVITY_STATUS_ENUM)[number], string> = {
  draft: 'default',
  online: 'green',
  paused: 'gold',
  offline: 'orange',
  ended: 'red',
}

export const PRICE_MODE_ENUM = ['fixed', 'rate'] as const

export const PRICE_MODE_MAP: Record<(typeof PRICE_MODE_ENUM)[number], string> = {
  fixed: '统一价',
  rate: '折扣',
}

export const PRICE_MODE_OPTIONS = PRICE_MODE_ENUM.map((value) => ({
  label: PRICE_MODE_MAP[value],
  value,
}))

export const PRICE_MODE_COLOR_MAP: Record<(typeof PRICE_MODE_ENUM)[number], string> = {
  fixed: 'blue',
  rate: 'gold',
}

export const PRICE_BATCH_STATUS_ENUM = ['draft', 'applied', 'rolled_back'] as const

export const PRICE_BATCH_STATUS_MAP: Record<(typeof PRICE_BATCH_STATUS_ENUM)[number], string> = {
  draft: '草稿',
  applied: '已生效',
  rolled_back: '已回滚',
}

export const PRICE_BATCH_STATUS_OPTIONS = PRICE_BATCH_STATUS_ENUM.map((value) => ({
  label: PRICE_BATCH_STATUS_MAP[value],
  value,
}))

export const PRICE_BATCH_STATUS_COLOR_MAP: Record<(typeof PRICE_BATCH_STATUS_ENUM)[number], string> = {
  draft: 'default',
  applied: 'green',
  rolled_back: 'orange',
}

export const MEMBER_DAY_ENUM = ['none', 'week', 'month'] as const

export const MEMBER_DAY_MAP: Record<(typeof MEMBER_DAY_ENUM)[number], string> = {
  none: '无',
  week: '每周',
  month: '每月',
}

export const MEMBER_DAY_OPTIONS = MEMBER_DAY_ENUM.map((value) => ({
  label: MEMBER_DAY_MAP[value],
  value,
}))

export const MEMBER_DAY_COLOR_MAP: Record<(typeof MEMBER_DAY_ENUM)[number], string> = {
  none: 'default',
  week: 'blue',
  month: 'gold',
}
