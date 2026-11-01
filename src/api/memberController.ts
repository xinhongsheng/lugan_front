import request from '@/request'

/** 我的会员 GET /member/get/vo */
export async function getMemberVo(options?: { [key: string]: any }) {
  return request<API.BaseResponseMemberVO>('/member/get/vo', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 积分兑换 POST /member/point/redeem */
export async function redeemPoint(body: API.PointRedeemRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/member/point/redeem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}
