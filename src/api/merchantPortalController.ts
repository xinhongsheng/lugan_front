import request from '@/request'

export function addMyTraceBatch(body: API.TraceBatch) {
  return request<API.BaseResponseLong>('/traceBatch/my/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  })
}

export function listMyTraceBatch(body: API.PageRequest) {
  return request<API.BaseResponsePageResultTraceBatch>('/traceBatch/my/list/page/vo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  })
}

export function addMyTraceCode(body: { batchId?: string; skuId?: string; quantity?: number }) {
  return request<API.BaseResponseLong>('/traceBatch/my/code/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  })
}

export function appendMyTraceNode(body: { batchId?: string; nodeType?: string; note?: string }) {
  return request<API.BaseResponseInteger>('/traceBatch/my/node/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  })
}

export function submitTraceBatch(body: { id?: string }) {
  return request<API.BaseResponseBoolean>('/traceBatch/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  })
}

export function listMyPresale(body: API.PageRequest) {
  return request<API.BaseResponsePageResultPresaleActivityVO>('/presaleActivity/my/list/page/vo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  })
}

export function adjustPresaleStock(body: { id?: string; totalStock?: number }) {
  return request<API.BaseResponseBoolean>('/presaleActivity/stock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  })
}

export function listMerchantPresaleOrder(body: API.PageRequest) {
  return request<API.BaseResponsePageResultPresaleOrderVO>('/presaleOrder/merchant/list/page/vo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  })
}

export function shipMerchantPresale(body: { id?: string; logisticsNo?: string }) {
  return request<API.BaseResponseString>('/presaleOrder/merchant/ship', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  })
}
