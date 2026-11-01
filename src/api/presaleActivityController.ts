// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /presaleActivity/add */
export async function addPresaleActivity(
  body: API.PresaleActivitySaveRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>('/presaleActivity/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /presaleActivity/delete */
export async function deletePresaleActivity(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/presaleActivity/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /presaleActivity/list/page/vo */
export async function listPresaleActivityVoByPage(
  body: API.PresaleActivityQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultPresaleActivityVO>('/presaleActivity/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /presaleActivity/open/list/vo */
export async function listOpenPresaleActivityVoByPage(
  body: API.PageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultPresaleActivityVO>('/presaleActivity/open/list/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /presaleActivity/update */
export async function updatePresaleActivity(
  body: API.PresaleActivitySaveRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>('/presaleActivity/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
