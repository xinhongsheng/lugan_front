// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 GET /member/get/vo */
export async function getMemberVo(options?: { [key: string]: any }) {
  return request<API.BaseResponseMemberVO>('/member/get/vo', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /member/point/list/page/vo */
export async function listMyPointLogVoByPage(
  body: API.PageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultPointLogVO>('/member/point/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /member/point/redeem */
export async function redeemPoint(body: API.PointRedeemRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/member/point/redeem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
