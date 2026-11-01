// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /presaleOrder/add */
export async function addPresaleOrder(
  body: API.PresaleOrderAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>('/presaleOrder/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /presaleOrder/admin/list/page/vo */
export async function listAllPresaleOrderVoByPage(
  body: API.PresaleOrderQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultPresaleOrderVO>('/presaleOrder/admin/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /presaleOrder/confirm */
export async function confirmPresaleOrder(
  body: API.OrderIdRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/presaleOrder/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /presaleOrder/finish */
export async function finishPresaleOrder(
  body: API.PresaleFinishRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/presaleOrder/finish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /presaleOrder/get/vo */
export async function getPresaleOrderVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPresaleOrderVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePresaleOrderDetailVO>('/presaleOrder/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /presaleOrder/my/list/page/vo */
export async function listMyPresaleOrderVoByPage(
  body: API.PageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultPresaleOrderVO>('/presaleOrder/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /presaleOrder/payBalance */
export async function payBalance(body: API.PresalePayRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/presaleOrder/payBalance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /presaleOrder/payDeposit */
export async function payDeposit(body: API.PresalePayRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/presaleOrder/payDeposit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /presaleOrder/ship */
export async function shipPresaleOrder(
  body: API.PresaleShipRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>('/presaleOrder/ship', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
