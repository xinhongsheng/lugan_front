// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /paymentFlow/list/page/vo */
export async function listPaymentFlowVoByPage(
  body: API.PaymentFlowQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultPaymentFlowVO>('/paymentFlow/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /paymentFlow/my/list/page/vo */
export async function listMyPaymentFlowVoByPage(
  body: API.PaymentFlowQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultPaymentFlowVO>('/paymentFlow/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
