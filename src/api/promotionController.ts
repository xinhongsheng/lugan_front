// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 GET /promotion/group/get/vo */
export async function getGroupVo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGroupVOParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseGroupTeamVO>('/promotion/group/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /promotion/group/join */
export async function joinGroup(
  body: API.PromotionActionRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseGroupTeamVO>('/promotion/group/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /promotion/group/list/page/vo */
export async function listOpenGroupVo(body: API.PageRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageResultGroupTeamVO>('/promotion/group/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /promotion/group/open */
export async function openGroup(
  body: API.PromotionActionRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>('/promotion/group/open', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /promotion/list/page/vo */
export async function listPromotionVoByPage(
  body: API.PageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultPromotionActivityVO>('/promotion/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /promotion/seckill */
export async function seckill(body: API.PromotionActionRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/promotion/seckill', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /promotion/wholesale */
export async function wholesale(
  body: API.PromotionActionRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/promotion/wholesale', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
