// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /coupon/claim */
export async function claimCoupon(body: API.CouponClaimRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/coupon/claim', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /coupon/list/page/vo */
export async function listCouponVoByPage(body: API.PageRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageResultCouponVO>('/coupon/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /coupon/my/list/page/vo */
export async function listMyUserCouponVoByPage(
  body: API.PageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultUserCouponVO>('/coupon/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
