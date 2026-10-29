// @ts-ignore
/* eslint-disable */
import request from '@/request'

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
