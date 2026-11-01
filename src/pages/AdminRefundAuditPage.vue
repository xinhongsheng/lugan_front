<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { auditRefund, listRefundOrderVoByPage } from '@/api/refundController'
import { REFUND_STATUS_MAP, REFUND_STATUS_OPTIONS } from '@/constants/order'

const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const open = ref(false)
const rows = ref<API.RefundOrderVO[]>([])
const total = ref(0)
const timeRange = ref<[string, string]>()
const query = reactive<API.RefundOrderQueryRequest>({ current: 1, pageSize: 10 })
const form = reactive({ refundId: '', pass: true, auditRemark: '' })

const columns: TableColumnType[] = [
  { title: '退款单号', dataIndex: 'refundNo', width: 190 },
  { title: '订单号', dataIndex: 'orderNo', width: 180 },
  { title: '买家', dataIndex: 'userName', width: 100 },
  { title: '金额', dataIndex: 'refundAmount', width: 90 },
  { title: '原因', dataIndex: 'refundReason' },
  { title: '状态', key: 'refundStatus', width: 110 },
  { title: '申请时间', dataIndex: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 90 },
]

async function load() {
  loading.value = true
  try {
    const response = await listRefundOrderVoByPage({
      current: query.current,
      pageSize: query.pageSize,
      refundStatus: query.refundStatus || undefined,
      orderNo: query.orderNo || undefined,
      createTimeStart: timeRange.value?.[0],
      createTimeEnd: timeRange.value?.[1],
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '退款单加载失败')
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

function openAudit(record: API.RefundOrderVO) {
  form.refundId = record.id || ''
  form.pass = true
  form.auditRemark = ''
  open.value = true
}

async function submitAudit() {
  saving.value = true
  try {
    const response = await auditRefund({
      refundId: form.refundId,
      pass: form.pass,
      auditRemark: form.auditRemark,
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '审核失败')
      return
    }
    message.success(form.pass ? '已通过并退款' : '已驳回')
    open.value = false
    await load()
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <page-container title="售后退款审核">
    <template #extra>
      <a-space :size="4">
        <a-button type="link" @click="router.push('/admin/order')">订单</a-button>
        <a-button type="link" @click="router.push('/')">返回商城</a-button>
      </a-space>
    </template>
    <a-card :bordered="false" class="block">
      <a-form layout="inline" @finish="search">
        <a-form-item label="订单号"><a-input v-model:value="query.orderNo" allow-clear /></a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="query.refundStatus" allow-clear style="width: 140px" :options="REFUND_STATUS_OPTIONS" />
        </a-form-item>
        <a-form-item label="申请时间">
          <a-range-picker v-model:value="timeRange" show-time value-format="YYYY-MM-DD HH:mm:ss" />
        </a-form-item>
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
          <template v-if="column.key === 'refundStatus'">
            {{ REFUND_STATUS_MAP[record.refundStatus || ''] || record.refundStatus }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button v-if="record.refundStatus === 'applying'" type="link" size="small" @click="openAudit(record)">审核</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:open="open" title="审核退款" :confirm-loading="saving" @ok="submitAudit">
      <a-form layout="vertical">
        <a-form-item label="结论">
          <a-radio-group v-model:value="form.pass">
            <a-radio :value="true">通过并退款</a-radio>
            <a-radio :value="false">驳回</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="审核意见">
          <a-textarea v-model:value="form.auditRemark" :maxlength="200" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </page-container>
</template>

<style scoped>
.block {
  margin-bottom: 16px;
}
</style>
