export const PRESALE_STATUS_MAP: Record<string, string> = {
  unpaidDeposit: '待付定金',
  unpaidBalance: '待付尾款',
  unshipped: '待发货',
  unreceived: '待收货',
  uncommented: '待评价',
  finished: '已完成',
  closed: '已关闭',
}

export const PRESALE_ACTIVITY_STATUS_MAP: Record<number, string> = {
  0: '未开始',
  1: '进行中',
  2: '已结束',
}

export const TASK_STATUS_MAP: Record<string, string> = {
  processing: '处理中',
  succeeded: '成功',
  failed: '失败',
}
