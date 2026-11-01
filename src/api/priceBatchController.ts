// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /priceBatch/add */
export async function addPriceBatch(
  body: API.PriceBatchAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>('/priceBatch/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /priceBatch/apply */
export async function applyPriceBatch(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/priceBatch/apply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /priceBatch/list/page/vo */
export async function listByPage1(body: API.PageRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageResultPriceBatch>('/priceBatch/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /priceBatch/log/list/page/vo */
export async function listLogByPage1(body: API.PageRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageResultPriceChangeLog>('/priceBatch/log/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /priceBatch/rollback */
export async function rollbackPriceBatch(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/priceBatch/rollback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
