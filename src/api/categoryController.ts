// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /category/add */
export async function addCategory(body: API.Category, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/category/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /category/delete */
export async function deleteCategory(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/category/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /category/list/page/vo */
export async function listCategoryVoByPage(
  body: API.AdminQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultCategoryVO>('/category/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /category/update */
export async function updateCategory(body: API.Category, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/category/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
