// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /product/add */
export async function addProduct(body: API.ProductAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/product/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /product/audit */
export async function auditProduct(body: API.Product, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/product/audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /product/audit/list/page/vo */
export async function listProductAuditByPage(
  body: API.AdminQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultProduct>('/product/audit/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /product/get/vo */
export async function getProductVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseProductDetailVO>('/product/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /product/list/page/vo */
export async function listProductVoByPage(
  body: API.ProductQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResultProductVO>('/product/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /product/update */
export async function updateProduct(body: API.Product, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/product/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
