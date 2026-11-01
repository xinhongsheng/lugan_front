// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /productSpec/add */
export async function addProductSpec(body: API.ProductSpec, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/productSpec/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /productSpec/delete */
export async function deleteProductSpec(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/productSpec/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /productSpec/list/page/vo */
export async function listProductSpecByPage(
  body: API.AdminQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultProductSpec>('/productSpec/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /productSpec/update */
export async function updateProductSpec(body: API.ProductSpec, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/productSpec/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
