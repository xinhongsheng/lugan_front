// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /refund/admin/list/page/vo */
export async function listRefundOrderVoByPage(
  body: API.RefundOrderQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultRefundOrderVO>('/refund/admin/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /refund/audit */
export async function auditRefund(body: API.RefundAuditRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/refund/audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
