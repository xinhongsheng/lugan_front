<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { exportTradeOrder, listAllTradeOrderVoByPage } from '@/api/tradeOrderController'
import {
  ORDER_STATUS_MAP,
  ORDER_STATUS_OPTIONS,
  PAY_CHANNEL_MAP,
  PAY_CHANNEL_OPTIONS,
  REFUND_STATUS_MAP,
  REFUND_STATUS_OPTIONS,
} from '@/constants/order'

const router = useRouter()
const loading = ref(false)
const exporting = ref(false)
const rows = ref<API.TradeOrderAdminVO[]>([])
const total = ref(0)
const timeRange = ref<[string, string]>()
const query = reactive<API.TradeOrderAdminQueryRequest>({
  current: 1,
  pageSize: 10,
  orderStatus: [],
})

const columns: TableColumnType[] = [
  { title: '订单号', dataIndex: 'orderNo', width: 180 },
  { title: '买家', dataIndex: 'userName', width: 100 },
  { title: '收货人', dataIndex: 'receiverName', width: 100 },
  { title: '手机号', dataIndex: 'receiverPhone', width: 130 },
  { title: '实付', dataIndex: 'payAmount', width: 90 },
  { title: '状态', key: 'orderStatus', width: 90 },
  { title: '退款', key: 'refundStatus', width: 110 },
  { title: '退款单号', dataIndex: 'refundNo', width: 180 },
  { title: '支付', key: 'payChannel', width: 90 },
  { title: '下单时间', dataIndex: 'createTime', width: 170 },
  { title: '明细', dataIndex: 'itemCount', width: 70 },
]

function filters() {
  return {
    orderNo: query.orderNo || undefined,
    receiverName: query.receiverName || undefined,
    receiverPhone: query.receiverPhone || undefined,
    orderStatus: query.orderStatus?.length ? query.orderStatus : undefined,
    refundStatus: query.refundStatus || undefined,
    payChannel: query.payChannel || undefined,
    minPayAmount: query.minPayAmount,
    maxPayAmount: query.maxPayAmount,
    createTimeStart: timeRange.value?.[0],
    createTimeEnd: timeRange.value?.[1],
  }
}

async function load() {
  loading.value = true
  try {
    const response = await listAllTradeOrderVoByPage({
      ...filters(),
      current: query.current,
      pageSize: query.pageSize,
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '订单加载失败')
      return
    }
    rows.value = response.data.data?.list ?? []
    total.value = Number(response.data.data?.total ?? 0)
  } finally {
    loading.value = false
  }
}

function search() {
  query.current = 1
  load()
}

function onTableChange(pagination: { current?: number }) {
  query.current = pagination.current || 1
  load()
}

async function exportOrders() {
  exporting.value = true
  try {
    const response = await exportTradeOrder({ queryRequest: filters() }, {
      responseType: 'blob',
      paramsSerializer: (params: Record<string, unknown>) => {
        const search = new URLSearchParams()
        Object.entries(params || {}).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') {
            return
          }
          if (Array.isArray(value)) {
            value.forEach((item) => search.append(key, String(item)))
            return
          }
          search.append(key, String(value))
        })
        return search.toString()
      },
    })
    const blob = response.data as Blob
    if (blob.type.includes('json')) {
      const body = JSON.parse(await blob.text()) as { message?: string }
      message.error(body.message || '导出失败')
      return
    }
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `订单报表.xlsx`
    link.click()
    URL.revokeObjectURL(url)
  } catch {
    message.error('导出失败')
  } finally {
    exporting.value = false
  }
}

onMounted(load)
</script>

<template>
  <page-container title="订单与交易">
    <template #extra>
      <a-space :size="4">
        <a-button type="link" @click="router.push('/admin')">基础系统</a-button>
        <a-button type="link" @click="router.push('/admin/refund')">退款审核</a-button>
        <a-button type="link" @click="router.push('/admin/freight')">运费模板</a-button>
        <a-button type="link" @click="router.push('/admin/presale')">预售配置</a-button>
        <a-button type="link" @click="router.push('/')">返回商城</a-button>
      </a-space>
    </template>

    <a-card :bordered="false" class="block">
      <a-form layout="inline" @finish="search">
        <a-form-item label="订单号"><a-input v-model:value="query.orderNo" allow-clear /></a-form-item>
        <a-form-item label="收货人"><a-input v-model:value="query.receiverName" allow-clear /></a-form-item>
        <a-form-item label="手机号"><a-input v-model:value="query.receiverPhone" allow-clear /></a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="query.orderStatus" mode="multiple" allow-clear style="width: 220px" :options="ORDER_STATUS_OPTIONS" />
        </a-form-item>
        <a-form-item label="退款">
          <a-select v-model:value="query.refundStatus" allow-clear style="width: 120px" :options="REFUND_STATUS_OPTIONS" />
        </a-form-item>
        <a-form-item label="支付">
          <a-select v-model:value="query.payChannel" allow-clear style="width: 120px" :options="PAY_CHANNEL_OPTIONS" />
        </a-form-item>
        <a-form-item label="实付">
          <a-input-number v-model:value="query.minPayAmount" :min="0" :precision="2" placeholder="最低" />
          <span class="split">-</span>
          <a-input-number v-model:value="query.maxPayAmount" :min="0" :precision="2" placeholder="最高" />
        </a-form-item>
        <a-form-item label="下单时间">
          <a-range-picker v-model:value="timeRange" show-time value-format="YYYY-MM-DD HH:mm:ss" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">查询</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card :bordered="false">
      <div class="toolbar">
        <a-button type="primary" :loading="exporting" @click="exportOrders">导出报表</a-button>
      </div>
      <a-table
        :columns="columns"
        :data-source="rows"
        :loading="loading"
        row-key="id"
        size="middle"
        :scroll="{ x: 1400 }"
        :pagination="{ current: query.current, pageSize: query.pageSize, total, showTotal: (count: number) => `共 ${count} 条` }"
        @change="onTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'orderStatus'">
            {{ ORDER_STATUS_MAP[record.orderStatus as keyof typeof ORDER_STATUS_MAP] || record.orderStatus }}
          </template>
          <template v-else-if="column.key === 'refundStatus'">
            {{ REFUND_STATUS_MAP[record.refundStatus || 'none'] || record.refundStatus || '—' }}
          </template>
          <template v-else-if="column.key === 'payChannel'">
            {{ PAY_CHANNEL_MAP[record.payChannel || ''] || record.payChannel || '—' }}
          </template>
        </template>
      </a-table>
    </a-card>
  </page-container>
</template>

<style scoped>
.block {
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.split {
  margin: 0 8px;
}
</style>
