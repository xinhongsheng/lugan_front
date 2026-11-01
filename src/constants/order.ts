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

export const REFUND_STATUS_MAP: Record<string, string> = {
  none: '',
  applying: '退款申请中',
  approved: '已退款',
  rejected: '已驳回',
}

export const REFUND_STATUS_OPTIONS = [
  { label: '申请中', value: 'applying' },
  { label: '已退款', value: 'approved' },
  { label: '已驳回', value: 'rejected' },
]

export const PAY_CHANNEL_MAP: Record<string, string> = {
  alipay: '支付宝',
  wechat: '微信',
}

export const PAY_CHANNEL_OPTIONS = [
  { label: '支付宝', value: 'alipay' },
  { label: '微信', value: 'wechat' },
]

export const PAY_BIZ_MAP: Record<string, string> = {
  full: '一次付清',
  deposit: '定金',
  balance: '尾款',
  depositRefund: '退定金',
}

export const ORDER_STATUS_COLOR_MAP: Record<(typeof ORDER_STATUS_ENUM)[number], string> = {
  unpaid: 'orange',
  unshipped: 'blue',
  unreceived: 'cyan',
  uncommented: 'gold',
  finished: 'green',
  cancelled: 'default',
}
