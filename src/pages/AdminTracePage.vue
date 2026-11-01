<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import request from '@/request'
import { adminPage, adminPost } from '@/api/adminController'
import { TRACE_NODE_MAP, TRACE_RESULT_MAP, TRACE_STATUS_MAP } from '@/constants/trace'

type Row = Record<string, unknown>

const router = useRouter()
const tab = ref('code')
const rows = ref<Row[]>([])
const batches = ref<Row[]>([])
const nodes = ref<Row[]>([])
const loading = ref(false)
const saving = ref(false)
const bindOpen = ref(false)

const generateForm = reactive({
  batchId: '',
  skuId: '',
  quantity: 1,
  maxScanCount: 30,
})
const nodeForm = reactive({
  traceCodeId: '',
  nodeType: 'pick',
  note: '',
  evidenceUrl: '',
})
const bindForm = reactive({
  id: '',
  batchId: '',
  skuId: '',
})

const tabs = [
  { key: 'code', tab: '溯源码' },
  { key: 'segment', tab: '码段' },
  { key: 'node', tab: '节点填报' },
  { key: 'scan', tab: '扫码日志' },
]

const columnMap: Record<string, TableColumnType[]> = {
  code: [
    { title: '溯源码', dataIndex: 'traceCode', width: 180 },
    { title: '状态', key: 'codeStatus', width: 100 },
    { title: '产区', dataIndex: 'originAreaCode', width: 90 },
    { title: '已扫', dataIndex: 'scanCount', width: 70 },
    { title: '操作', key: 'action', width: 280 },
  ],
  segment: [
    { title: '码段', dataIndex: 'segmentNo', width: 180 },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '起码', dataIndex: 'startCode', width: 180 },
    { title: '止码', dataIndex: 'endCode', width: 180 },
    { title: '状态', dataIndex: 'segmentStatus', width: 90 },
    { title: '操作', key: 'action', width: 220 },
  ],
  node: [
    { title: '序号', dataIndex: 'seq', width: 70 },
    { title: '节点', dataIndex: 'nodeName', width: 90 },
    { title: '时间', dataIndex: 'operateTime', width: 180 },
    { title: '说明', dataIndex: 'note' },
  ],
  scan: [
    { title: '溯源码', dataIndex: 'inputCode', width: 180 },
    { title: '结论', key: 'result', width: 120 },
    { title: '原因', dataIndex: 'resultReason', width: 140 },
    { title: 'IP', dataIndex: 'clientIp', width: 140 },
    { title: '时间', dataIndex: 'scanTime' },
  ],
}

const columns = ref<TableColumnType[]>(columnMap.code)

function text(row: Row, key: string) {
  const value = row[key]
  return value === undefined || value === null ? '' : String(value)
}

function nameOf(map: Record<string, string>, row: Row, key: string) {
  const value = text(row, key)
  return map[value] || value || '—'
}

async function loadBatches() {
  const response = await adminPage<Row>('/traceBatch/list/page/vo', { current: 1, pageSize: 20 })
  batches.value = response.data.code === 0 ? response.data.data?.list ?? [] : []
}

async function load() {
  loading.value = true
  try {
    if (tab.value === 'node') {
      rows.value = []
      return
    }
    const url =
      tab.value === 'code'
        ? '/traceCode/list/page/vo'
        : tab.value === 'segment'
          ? '/traceSegment/list/page/vo'
          : '/traceScan/list/page/vo'
    const response = await adminPage<Row>(url, { current: 1, pageSize: 20 })
    rows.value = response.data.code === 0 ? response.data.data?.list ?? [] : []
  } finally {
    loading.value = false
  }
}

function changeTab(key: string) {
  tab.value = key
  columns.value = columnMap[key] ?? columnMap.code
  rows.value = []
  load()
}

async function generate() {
  saving.value = true
  try {
    const response = await adminPost('/traceCode/add', {
      batchId: generateForm.batchId,
      skuId: generateForm.skuId,
      quantity: generateForm.quantity,
      maxScanCount: generateForm.maxScanCount,
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '生成失败')
      return
    }
    message.success('已生成')
    tab.value = 'code'
    columns.value = columnMap.code
    await load()
  } finally {
    saving.value = false
  }
}

async function act(url: string, id: string, ok: string) {
  const response = await adminPost(url, { id })
  if (response.data.code !== 0) {
    message.error(response.data.message || '操作失败')
    return
  }
  message.success(ok)
  await load()
}

function openBind(record: Row) {
  bindForm.id = text(record, 'id')
  bindForm.batchId = ''
  bindForm.skuId = ''
  bindOpen.value = true
}

async function saveBind() {
  const response = await adminPost('/traceCode/bind', bindForm)
  if (response.data.code !== 0) {
    message.error(response.data.message || '绑定失败')
    return
  }
  message.success('已重新绑定')
  bindOpen.value = false
  await load()
}

async function saveNode() {
  saving.value = true
  try {
    const response = await adminPost('/traceNode/add', nodeForm)
    if (response.data.code !== 0) {
      message.error(response.data.message || '保存失败')
      return
    }
    message.success('节点已写入')
    await loadNodes()
  } finally {
    saving.value = false
  }
}

async function loadNodes() {
  if (!nodeForm.traceCodeId) {
    return
  }
  const response = await adminPost<Row[]>('/traceNode/list', { id: nodeForm.traceCodeId })
  nodes.value = response.data.code === 0 ? response.data.data ?? [] : []
}

async function download(segmentId: string, type: string) {
  const response = await request('/traceCode/export', {
    method: 'GET',
    params: { segmentId, type },
    responseType: 'blob',
  })
  const url = URL.createObjectURL(response.data as Blob)
  const link = document.createElement('a')
  link.href = url
  link.download = type === 'image' ? 'qrcodes.zip' : 'codes.csv'
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(async () => {
  await loadBatches()
  await load()
})
</script>

<template>
  <page-container title="溯源管理" :tab-list="tabs" :tab-active-key="tab" @tab-change="changeTab">
    <template #extra>
      <a-space :size="4">
        <a-button type="link" @click="router.push('/admin')">基础系统</a-button>
        <a-button type="link" @click="router.push('/')">返回商城</a-button>
      </a-space>
    </template>
    <a-card v-if="tab === 'code'" :bordered="false" class="block">
      <a-form layout="inline">
        <a-form-item label="批次">
          <a-select v-model:value="generateForm.batchId" style="width: 220px" placeholder="选择批次">
            <a-select-option v-for="item in batches" :key="text(item, 'id')" :value="text(item, 'id')">
              {{ text(item, 'batchNo') }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="SKU"><a-input v-model:value="generateForm.skuId" style="width: 180px" /></a-form-item>
        <a-form-item label="数量"><a-input-number v-model:value="generateForm.quantity" :min="1" :max="500" /></a-form-item>
        <a-form-item label="扫码上限"><a-input-number v-model:value="generateForm.maxScanCount" :min="0" /></a-form-item>
        <a-form-item><a-button type="primary" :loading="saving" @click="generate">生成</a-button></a-form-item>
      </a-form>
    </a-card>
    <a-card v-if="tab === 'node'" :bordered="false" class="block">
      <a-form layout="inline">
        <a-form-item label="码 id"><a-input v-model:value="nodeForm.traceCodeId" style="width: 200px" /></a-form-item>
        <a-form-item label="节点">
          <a-select v-model:value="nodeForm.nodeType" style="width: 120px">
            <a-select-option value="pick">采摘</a-select-option>
            <a-select-option value="inspect">质检</a-select-option>
            <a-select-option value="inbound">入库</a-select-option>
            <a-select-option value="outbound">出库</a-select-option>
            <a-select-option value="correct">更正</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="说明"><a-input v-model:value="nodeForm.note" style="width: 220px" /></a-form-item>
        <a-form-item label="图片"><a-input v-model:value="nodeForm.evidenceUrl" placeholder="已上传的地址，可空" style="width: 220px" /></a-form-item>
        <a-form-item>
          <a-button type="primary" :loading="saving" @click="saveNode">写入</a-button>
          <a-button @click="loadNodes">查看</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card :bordered="false">
      <a-table
        :columns="tab === 'node' ? columnMap.node : columns"
        :data-source="tab === 'node' ? nodes : rows"
        :loading="loading"
        row-key="id"
        size="middle"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'codeStatus'">{{ nameOf(TRACE_STATUS_MAP, record, 'codeStatus') }}</template>
          <template v-else-if="column.key === 'result'">{{ nameOf(TRACE_RESULT_MAP, record, 'result') }}</template>
          <template v-else-if="column.dataIndex === 'nodeType'">{{ nameOf(TRACE_NODE_MAP, record, 'nodeType') }}</template>
          <template v-else-if="column.key === 'action' && tab === 'code'">
            <a-space :size="0">
              <a-button type="link" size="small" @click="act('/traceCode/activate', text(record, 'id'), '已激活')">激活</a-button>
              <a-button type="link" size="small" @click="act('/traceCode/void', text(record, 'id'), '已作废')">作废</a-button>
              <a-button type="link" size="small" @click="act('/traceCode/unbind', text(record, 'id'), '已解绑')">解绑</a-button>
              <a-button type="link" size="small" @click="openBind(record)">重绑</a-button>
            </a-space>
          </template>
          <template v-else-if="column.key === 'action' && tab === 'segment'">
            <a-space :size="0">
              <a-button type="link" size="small" @click="download(text(record, 'id'), 'csv')">码包</a-button>
              <a-button type="link" size="small" @click="download(text(record, 'id'), 'image')">二维码</a-button>
              <a-button type="link" size="small" @click="act('/traceSegment/close', text(record, 'id'), '已关闭')">关闭</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:open="bindOpen" title="重新绑定" @ok="saveBind">
      <a-form layout="vertical">
        <a-form-item label="批次 id"><a-input v-model:value="bindForm.batchId" /></a-form-item>
        <a-form-item label="SKU id"><a-input v-model:value="bindForm.skuId" /></a-form-item>
      </a-form>
    </a-modal>
  </page-container>
</template>

<style scoped>
.block {
  margin-bottom: 12px;
}
</style>
