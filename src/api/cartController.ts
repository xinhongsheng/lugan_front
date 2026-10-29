// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /cart/add */
export async function addCart(body: API.CartAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /cart/check */
export async function checkCart(body: API.CartCheckRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/cart/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /cart/checkout */
export async function checkoutCart(body: API.CartQuoteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/cart/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /cart/delete */
export async function deleteCart(body: API.CartDeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/cart/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /cart/my/list/page/vo */
export async function listMyCartVoByPage(body: API.PageRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageResultCartVO>('/cart/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /cart/quote */
export async function quoteCart(body: API.CartQuoteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseCartQuoteVO>('/cart/quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /cart/update */
export async function updateCart(body: API.CartUpdateRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/cart/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
