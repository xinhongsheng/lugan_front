// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /memberRule/add */
export async function publish1(body: API.MemberRuleSaveRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/memberRule/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /memberRule/get/vo */
export async function current(options?: { [key: string]: any }) {
  return request<API.BaseResponseMapStringObject>('/memberRule/get/vo', {
    method: 'GET',
    ...(options || {}),
  })
}
