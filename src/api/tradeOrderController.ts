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

/** 此处后端没有提供注释 GET /order/admin/export */
export async function exportTradeOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.exportTradeOrderParams,
  options?: { [key: string]: any }
) {
  return request<any>('/order/admin/export', {
    method: 'GET',
    params: {
      ...params,
      queryRequest: undefined,
      ...params['queryRequest'],
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /order/admin/list/page/vo */
export async function listAllTradeOrderVoByPage(
  body: API.TradeOrderAdminQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultTradeOrderAdminVO>('/order/admin/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /order/cancel */
export async function cancelOrder(body: API.OrderIdRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/order/cancel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /order/confirm */
export async function confirmOrder(body: API.OrderIdRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/order/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /order/get/vo */
export async function getTradeOrderVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTradeOrderVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseTradeOrderDetailVO>('/order/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
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

/** 此处后端没有提供注释 POST /order/pay */
export async function payOrder(body: API.OrderPayRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/order/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /order/refund */
export async function refundOrder(body: API.OrderRefundRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/order/refund', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /order/ship */
export async function shipOrder(body: API.OrderShipRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseString>('/order/ship', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 商家现货订单 POST /order/merchant/list/page/vo */
export async function listMerchantOrder(body: API.PageRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageResultTradeOrderVO>('/order/merchant/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 发货单 GET /order/ship/sheet */
export async function getShipSheet(
  params: { id: string },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseTradeOrderDetailVO>('/order/ship/sheet', {
    method: 'GET',
    params,
    ...(options || {}),
  })
}
