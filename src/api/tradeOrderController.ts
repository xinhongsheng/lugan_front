// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /order/add */
export async function addOrder(body: API.OrderAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/order/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /order/my/list/page/vo */
export async function listMyTradeOrderVoByPage(
  body: API.PageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultTradeOrderVO>('/order/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
