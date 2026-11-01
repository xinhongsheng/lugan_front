// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /system/dict/add */
export async function addDict(body: API.DictItem, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/system/dict/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /system/dict/delete */
export async function deleteDict(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/system/dict/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /system/dict/list/page/vo */
export async function listDictByPage(
  body: API.AdminQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultDictItem>('/system/dict/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /system/file/delete */
export async function deleteFile(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/system/file/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /system/file/list/page/vo */
export async function listFileByPage(
  body: API.AdminQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultUploadFile>('/system/file/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /system/file/upload */
export async function uploadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadFileParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>('/system/file/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /system/log/list/page/vo */
export async function listLogByPage(body: API.AdminQueryRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageResultOperateLog>('/system/log/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
