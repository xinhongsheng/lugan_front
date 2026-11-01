export const TRACE_STATUS_ENUM = ['inactive', 'active', 'voided', 'unbound'] as const

export const TRACE_STATUS_MAP: Record<(typeof TRACE_STATUS_ENUM)[number], string> = {
  inactive: '未激活',
  active: '已激活',
  voided: '已作废',
  unbound: '已解绑',
}

export const TRACE_STATUS_OPTIONS = TRACE_STATUS_ENUM.map((value) => ({
  label: TRACE_STATUS_MAP[value],
  value,
}))

export const TRACE_STATUS_COLOR_MAP: Record<(typeof TRACE_STATUS_ENUM)[number], string> = {
  inactive: 'default',
  active: 'green',
  voided: 'red',
  unbound: 'orange',
}

export const TRACE_NODE_ENUM = ['pick', 'inspect', 'inbound', 'outbound', 'correct'] as const

export const TRACE_NODE_MAP: Record<(typeof TRACE_NODE_ENUM)[number], string> = {
  pick: '采摘',
  inspect: '质检',
  inbound: '入库',
  outbound: '出库',
  correct: '更正',
}

export const TRACE_NODE_OPTIONS = TRACE_NODE_ENUM.map((value) => ({
  label: TRACE_NODE_MAP[value],
  value,
}))

export const TRACE_NODE_COLOR_MAP: Record<(typeof TRACE_NODE_ENUM)[number], string> = {
  pick: 'green',
  inspect: 'blue',
  inbound: 'gold',
  outbound: 'purple',
  correct: 'default',
}

export const TRACE_RESULT_ENUM = ['complete', 'incomplete', 'tampered', 'invalid'] as const

export const TRACE_RESULT_MAP: Record<(typeof TRACE_RESULT_ENUM)[number], string> = {
  complete: '链路完整',
  incomplete: '链路待补齐',
  tampered: '记录被篡改',
  invalid: '溯源码无效',
}

export const TRACE_RESULT_OPTIONS = TRACE_RESULT_ENUM.map((value) => ({
  label: TRACE_RESULT_MAP[value],
  value,
}))

export const TRACE_RESULT_COLOR_MAP: Record<(typeof TRACE_RESULT_ENUM)[number], string> = {
  complete: 'green',
  incomplete: 'gold',
  tampered: 'red',
  invalid: 'red',
}

export const TRACE_REASON_MAP: Record<string, string> = {
  not_found: '码不存在或格式不正确',
  voided: '溯源码已作废',
  unauthorized: '不属于永春芦柑地理标志授权码',
  inactive: '溯源码尚未激活',
  over_limit: '重复扫码超限',
  tampered: '链路校验哈希不匹配',
  missing_node: '链路节点缺失或顺序不对',
  ok: '全流程节点记录齐全',
}
