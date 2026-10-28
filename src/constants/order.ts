export const ORDER_STATUS_ENUM = [
  'unpaid',
  'unshipped',
  'unreceived',
  'uncommented',
  'finished',
  'cancelled',
] as const

export const ORDER_STATUS_MAP: Record<(typeof ORDER_STATUS_ENUM)[number], string> = {
  unpaid: '待付款',
  unshipped: '待发货',
  unreceived: '待收货',
  uncommented: '待评价',
  finished: '已完成',
  cancelled: '已取消',
}

export const ORDER_STATUS_OPTIONS = ORDER_STATUS_ENUM.map((value) => ({
  label: ORDER_STATUS_MAP[value],
  value,
}))

export const ORDER_STATUS_COLOR_MAP: Record<(typeof ORDER_STATUS_ENUM)[number], string> = {
  unpaid: 'orange',
  unshipped: 'blue',
  unreceived: 'cyan',
  uncommented: 'gold',
  finished: 'green',
  cancelled: 'default',
}
