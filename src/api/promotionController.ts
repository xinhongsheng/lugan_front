import request from '@/request'

/** 营销活动 POST /promotion/list/page/vo */
export async function listPromotionVoByPage(body: API.PageRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePromotionPage>('/promotion/list/page/vo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

/** 秒杀 POST /promotion/seckill */
export async function seckill(body: API.PromotionActionRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/promotion/seckill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

/** 批发 POST /promotion/wholesale */
export async function wholesale(body: API.PromotionActionRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/promotion/wholesale', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

/** 开团 POST /promotion/group/open */
export async function openGroup(body: API.PromotionActionRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/promotion/group/open', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

/** 参团 POST /promotion/group/join */
export async function joinGroup(body: API.PromotionActionRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseGroupTeamVO>('/promotion/group/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

/** 进行中的团 POST /promotion/group/list/page/vo */
export async function listOpenGroupVo(body: API.PageRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseGroupPage>('/promotion/group/list/page/vo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}
