// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /coupon/add */
export async function addCoupon(body: API.CouponSaveRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/coupon/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /coupon/admin/list/page/vo */
export async function listCouponByPage(body: API.PageRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageResultCoupon>('/coupon/admin/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /coupon/grant */
export async function grantCoupon(body: API.CouponGrantRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseInteger>('/coupon/grant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /coupon/offline */
export async function offlineCoupon(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/coupon/offline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /coupon/publish */
export async function publishCoupon(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/coupon/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /coupon/record/list/page/vo */
export async function listRecordByPage(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageResultUserCouponVO>('/coupon/record/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /coupon/update */
export async function updateCoupon(body: API.CouponSaveRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/coupon/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /coupon/void */
export async function voidCoupon(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/coupon/void', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
