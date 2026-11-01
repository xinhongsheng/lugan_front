import request from '@/request'

type Resp<T> = { code?: number; data?: T; message?: string }
type Page<T> = { list?: T[]; total?: number | string }

const json = { 'Content-Type': 'application/json' }

export function adminPage<T>(url: string, body: object) {
  return request<Resp<Page<T>>>(url, { method: 'POST', headers: json, data: body })
}

export function adminPost<T>(url: string, body: unknown) {
  return request<Resp<T>>(url, { method: 'POST', headers: json, data: body })
}
