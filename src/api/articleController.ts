// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /article/add */
export async function addArticle(body: API.Article, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/article/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /article/delete */
export async function deleteArticle(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/article/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /article/list/page/vo */
export async function listArticleByPage(
  body: API.AdminQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultArticle>('/article/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /article/update */
export async function updateArticle(body: API.Article, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/article/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
