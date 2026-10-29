// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /review/add */
export async function addReview(body: API.ReviewAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/review/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /review/list/page/vo */
export async function listReviewVoByPage(
  body: API.ReviewQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultReviewVO>('/review/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /review/my/list/page/vo */
export async function listMyReviewVoByPage(
  body: API.PageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultReviewVO>('/review/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /review/upload */
export async function uploadReviewImage(body: {}, options?: { [key: string]: any }) {
  return request<API.BaseResponseString>('/review/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
