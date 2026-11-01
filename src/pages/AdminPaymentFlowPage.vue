<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { listPaymentFlowVoByPage } from '@/api/paymentFlowController'
import { PAY_CHANNEL_MAP } from '@/constants/order'

const router = useRouter()
const loading = ref(false)
const rows = ref<API.PaymentFlowVO[]>([])
const total = ref(0)
const query = reactive<API.PaymentFlowQueryRequest>({ current: 1, pageSize: 10 })

const orderTypeOptions = [
  { value: 'normal', label: '现货订单' },
  { value: 'presale', label: '预售订单' },
]
const bizTypeOptions = [
  { value: 'full', label: '一次付清' },
  { value: 'deposit', label: '定金' },
  { value: 'balance', label: '尾款' },
]
const bizName: Record<string, string> = { full: '一次付清', deposit: '定金', balance: '尾款' }
const orderName: Record<string, string> = { normal: '现货', presale: '预售' }

const columns: TableColumnType[] = [
  { title: '流水号', dataIndex: 'flowNo', width: 220 },
  { title: '订单类型', key: 'orderType', width: 100 },
  { title: '款项', key: 'bizType', width: 100 },
  { title: '金额', dataIndex: 'amount', width: 100 },
  { title: '支付方式', key: 'payChannel', width: 100 },
  { title: '支付时间', dataIndex: 'payTime', width: 180 },
  { title: '订单号', dataIndex: 'orderId' },
]

async function load() {
  loading.value = true
  try {
    const response = await listPaymentFlowVoByPage({
      current: query.current,
      pageSize: query.pageSize,
      orderType: query.orderType || undefined,
      bizType: query.bizType || undefined,
      orderId: query.orderId || undefined,
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '流水加载失败')
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

onMounted(load)
</script>

<template>
  <page-container title="支付流水">
    <template #extra>
      <a-button type="link" @click="router.push('/admin/order')">订单</a-button>
    </template>
    <a-card :bordered="false" class="block">
      <a-form layout="inline" @finish="search">
        <a-form-item label="订单类型">
          <a-select v-model:value="query.orderType" allow-clear style="width: 140px" :options="orderTypeOptions" />
        </a-form-item>
        <a-form-item label="款项">
          <a-select v-model:value="query.bizType" allow-clear style="width: 140px" :options="bizTypeOptions" />
        </a-form-item>
        <a-form-item label="订单编号"><a-input v-model:value="query.orderId" allow-clear placeholder="订单 id" /></a-form-item>
        <a-form-item><a-button type="primary" html-type="submit">查询</a-button></a-form-item>
      </a-form>
    </a-card>
    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data-source="rows"
        :loading="loading"
        row-key="id"
        size="middle"
        :pagination="{ current: query.current, pageSize: query.pageSize, total, showTotal: (count: number) => `共 ${count} 条` }"
        @change="onTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'orderType'">{{ orderName[record.orderType || ''] || record.orderType }}</template>
          <template v-else-if="column.key === 'bizType'">{{ bizName[record.bizType || ''] || record.bizType }}</template>
          <template v-else-if="column.key === 'payChannel'">{{ PAY_CHANNEL_MAP[record.payChannel || ''] || record.payChannel }}</template>
        </template>
      </a-table>
    </a-card>
  </page-container>
</template>

<style scoped>
.block {
  margin-bottom: 16px;
}
</style>
