// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /freight/active */
export async function activateFreight(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/freight/active', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /freight/add */
export async function addFreight(body: API.FreightSaveRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/freight/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /freight/calc */
export async function calcFreight(body: API.FreightCalcRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseFreightQuoteVO>('/freight/calc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /freight/delete */
export async function deleteFreight(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/freight/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /freight/list/page/vo */
export async function listFreightVoByPage(
  body: API.FreightQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultFreightRuleVO>('/freight/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /freight/update */
export async function updateFreight(
  body: API.FreightSaveRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>('/freight/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
