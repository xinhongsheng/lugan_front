// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /user/admin/list/page/vo */
export async function listUserVoByPage(
  body: API.AdminQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultUserVO>('/user/admin/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /user/admin/role */
export async function updateUserRole(body: API.UserAdminRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/user/admin/role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /user/admin/status */
export async function updateUserStatus(
  body: API.UserAdminRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/user/admin/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /user/admin/update */
export async function updateUser1(body: API.UserAdminRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/user/admin/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
