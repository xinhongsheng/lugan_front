// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /merchant/add */
export async function addMerchant(body: API.Merchant, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/merchant/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /merchant/audit */
export async function auditMerchant(body: API.Merchant, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/merchant/audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /merchant/list/page/vo */
export async function listMerchantByPage(
  body: API.AdminQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultMerchantVO>('/merchant/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /merchant/shop/status */
export async function updateShopStatus(body: API.Merchant, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/merchant/shop/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /merchant/my */
export async function getMyMerchant(options?: { [key: string]: any }) {
  return request<API.BaseResponseMerchantVO>('/merchant/my', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /merchant/update */
export async function updateMerchant(body: API.Merchant, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/merchant/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
