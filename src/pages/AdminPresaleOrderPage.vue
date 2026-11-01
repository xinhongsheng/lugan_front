<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { bindPresaleTrace, closePresaleOrder, listAllPresaleOrderVoByPage, shipPresaleOrder } from '@/api/presaleOrderController'
import { PRESALE_STATUS_MAP } from '@/constants/presale'

const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const open = ref(false)
const bindOpen = ref(false)
const traceIds = ref('')
const rows = ref<API.PresaleOrderVO[]>([])
const total = ref(0)
const query = reactive<API.PresaleOrderQueryRequest>({ current: 1, pageSize: 10 })
const shipForm = reactive<API.PresaleShipRequest>({})

const statusOptions = Object.entries(PRESALE_STATUS_MAP).map(([value, label]) => ({ value, label }))
const columns: TableColumnType[] = [
  { title: '预售单号', dataIndex: 'orderNo', width: 200 },
  { title: '批次', dataIndex: 'activityTitle' },
  { title: '份数', dataIndex: 'quantity', width: 70 },
  { title: '总额', dataIndex: 'totalAmount', width: 90 },
  { title: '定金', dataIndex: 'depositAmount', width: 90 },
  { title: '尾款', dataIndex: 'balanceAmount', width: 90 },
  { title: '状态', key: 'presaleStatus', width: 110 },
  { title: '物流单号', dataIndex: 'logisticsNo', width: 180 },
  { title: '操作', key: 'action', width: 220 },
]

async function load() {
  loading.value = true
  try {
    const response = await listAllPresaleOrderVoByPage({
      current: query.current,
      pageSize: query.pageSize,
      orderNo: query.orderNo || undefined,
      presaleStatus: query.presaleStatus || undefined,
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '预售单加载失败')
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

function openShip(record: API.PresaleOrderVO) {
  shipForm.id = record.id
  shipForm.logisticsNo = ''
  open.value = true
}

function openBind(record: API.PresaleOrderVO) {
  shipForm.id = record.id
  traceIds.value = ''
  bindOpen.value = true
}

async function bindTrace() {
  const traceCodeIds = traceIds.value.split(/[,，\s]+/).map((item) => item.trim()).filter(Boolean)
  if (!shipForm.id || traceCodeIds.length === 0) {
    message.warning('请填写溯源码 id')
    return
  }
  saving.value = true
  try {
    const response = await bindPresaleTrace({ id: shipForm.id, traceCodeIds })
    if (response.data.code !== 0) {
      message.error(response.data.message || '绑定失败')
      return
    }
    message.success('已绑定溯源码')
    bindOpen.value = false
    await load()
  } finally {
    saving.value = false
  }
}

async function closeOrder(id?: string) {
  if (!id) {
    return
  }
  const response = await closePresaleOrder({ id })
  if (response.data.code !== 0) {
    message.error(response.data.message || '关闭失败')
    return
  }
  message.success('已关闭')
  await load()
}

async function ship() {
  saving.value = true
  try {
    const response = await shipPresaleOrder(shipForm)
    if (response.data.code !== 0) {
      message.error(response.data.message || '发货失败')
      return
    }
    message.success(`已发货，物流单号 ${response.data.data}`)
    open.value = false
    await load()
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <page-container title="预售订单">
    <template #extra>
      <a-space :size="4">
        <a-button type="link" @click="router.push('/admin/presale')">预售配置</a-button>
        <a-button type="link" @click="router.push('/admin/presale-task')">关单日志</a-button>
        <a-button type="link" @click="router.push('/admin/order')">现货订单</a-button>
      </a-space>
    </template>
    <a-card :bordered="false" class="block">
      <a-form layout="inline" @finish="search">
        <a-form-item label="单号"><a-input v-model:value="query.orderNo" allow-clear /></a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="query.presaleStatus" allow-clear style="width: 140px" :options="statusOptions" />
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
        :scroll="{ x: 1200 }"
        :pagination="{ current: query.current, pageSize: query.pageSize, total, showTotal: (count: number) => `共 ${count} 条` }"
        @change="onTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'presaleStatus'">
            {{ PRESALE_STATUS_MAP[record.presaleStatus || ''] || record.presaleStatus }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button v-if="record.presaleStatus === 'unpaidDeposit' || record.presaleStatus === 'unpaidBalance'" type="link" size="small" @click="closeOrder(record.id)">关闭</a-button>
            <a-button v-if="record.presaleStatus === 'unshipped'" type="link" size="small" @click="openBind(record)">绑溯源码</a-button>
            <a-button v-if="record.presaleStatus === 'unshipped'" type="link" size="small" @click="openShip(record)">发货</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:open="open" title="预售发货" :confirm-loading="saving" @ok="ship">
      <a-form layout="vertical">
        <a-form-item label="物流单号">
          <a-input v-model:value="shipForm.logisticsNo" placeholder="不填则按预售单号生成" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:open="bindOpen" title="绑定溯源码" :confirm-loading="saving" @ok="bindTrace">
      <a-form layout="vertical">
        <a-form-item label="溯源码 id">
          <a-textarea v-model:value="traceIds" :rows="3" placeholder="按份数填写，多个用逗号分隔" />
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
