// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 GET /home/get/vo */
export async function getHomeVo(options?: { [key: string]: any }) {
  return request<API.BaseResponseHomeVO>('/home/get/vo', {
    method: 'GET',
    ...(options || {}),
  })
}
