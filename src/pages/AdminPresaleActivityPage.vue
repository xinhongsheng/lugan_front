<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import {
  addPresaleActivity,
  deletePresaleActivity,
  listPresaleActivityVoByPage,
  updatePresaleActivity,
} from '@/api/presaleActivityController'
import { getProductVoById, listProductVoByPage } from '@/api/productController'
import { PRESALE_ACTIVITY_STATUS_MAP } from '@/constants/presale'

const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const open = ref(false)
const rows = ref<API.PresaleActivityVO[]>([])
const products = ref<API.ProductVO[]>([])
const skus = ref<API.ProductSkuVO[]>([])
const total = ref(0)
const query = reactive<API.PresaleActivityQueryRequest>({ current: 1, pageSize: 10 })
const form = reactive<API.PresaleActivitySaveRequest>({
  title: '',
  depositRatio: 0.3,
  totalStock: 100,
})

const columns: TableColumnType[] = [
  { title: '标题', dataIndex: 'title' },
  { title: '商品', dataIndex: 'productName', width: 160 },
  { title: '开摘日', dataIndex: 'openPickDate', width: 120 },
  { title: '预计发货', dataIndex: 'expectShipDate', width: 120 },
  { title: '定金比例', dataIndex: 'depositRatio', width: 100 },
  { title: '限量', dataIndex: 'totalStock', width: 80 },
  { title: '锁定', dataIndex: 'lockedStock', width: 80 },
  { title: '已售', dataIndex: 'soldStock', width: 80 },
  { title: '剩余', dataIndex: 'remainStock', width: 80 },
  { title: '状态', key: 'status', width: 90 },
  { title: '操作', key: 'action', width: 140 },
]

async function loadSkus(productId?: string) {
  skus.value = []
  if (!productId) {
    return
  }
  const response = await getProductVoById({ id: productId })
  skus.value = response.data.code === 0 ? response.data.data?.skuList ?? [] : []
}

async function loadProducts() {
  const response = await listProductVoByPage({ current: 1, pageSize: 20 })
  products.value = response.data.code === 0 ? response.data.data?.list ?? [] : []
}

async function load() {
  loading.value = true
  try {
    const response = await listPresaleActivityVoByPage({
      current: query.current,
      pageSize: query.pageSize,
      title: query.title || undefined,
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '预售活动加载失败')
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

function onProductChange(productId: string) {
  form.skuId = undefined
  loadSkus(productId)
}

function openCreate() {
  form.id = undefined
  form.productId = undefined
  form.title = ''
  form.openPickDate = undefined
  form.expectShipDate = undefined
  form.depositRatio = 0.3
  form.totalStock = 100
  form.depositForfeit = 1
  form.skuId = undefined
  form.depositDeadline = undefined
  form.balanceDeadline = undefined
  skus.value = []
  open.value = true
}

async function openEdit(record: API.PresaleActivityVO) {
  form.id = record.id
  form.productId = record.productId
  form.title = record.title
  form.openPickDate = record.openPickDate
  form.expectShipDate = record.expectShipDate
  form.depositRatio = record.depositRatio
  form.totalStock = record.totalStock
  form.depositForfeit = record.depositForfeit ?? 1
  form.skuId = record.skuId
  form.depositDeadline = record.depositDeadline
  form.balanceDeadline = record.balanceDeadline
  await loadSkus(record.productId)
  open.value = true
}

async function save() {
  saving.value = true
  try {
    const response = form.id ? await updatePresaleActivity(form) : await addPresaleActivity(form)
    if (response.data.code !== 0) {
      message.error(response.data.message || '保存失败')
      return
    }
    message.success('已保存')
    open.value = false
    await load()
  } finally {
    saving.value = false
  }
}

async function remove(record: API.PresaleActivityVO) {
  if (!record.id) {
    return
  }
  const response = await deletePresaleActivity({ id: record.id })
  if (response.data.code !== 0) {
    message.error(response.data.message || '删除失败')
    return
  }
  message.success('已删除')
  await load()
}

onMounted(async () => {
  await loadProducts()
  await load()
})
</script>

<template>
  <page-container title="采摘季预售">
    <template #extra>
      <a-space :size="4">
        <a-button type="link" @click="router.push('/admin/presale-order')">预售订单</a-button>
        <a-button type="link" @click="router.push('/admin/presale-task')">关单日志</a-button>
        <a-button type="link" @click="router.push('/admin/order')">订单</a-button>
        <a-button type="link" @click="router.push('/')">返回商城</a-button>
      </a-space>
    </template>
    <a-card :bordered="false" class="block">
      <a-form layout="inline" @finish="search">
        <a-form-item label="标题"><a-input v-model:value="query.title" allow-clear /></a-form-item>
        <a-form-item><a-button type="primary" html-type="submit">查询</a-button></a-form-item>
      </a-form>
    </a-card>
    <a-card :bordered="false">
      <div class="toolbar"><a-button type="primary" @click="openCreate">新建批次</a-button></div>
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
          <template v-if="column.key === 'status'">
            {{ PRESALE_ACTIVITY_STATUS_MAP[Number(record.status)] || record.status }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button type="link" size="small" @click="openEdit(record)">编辑</a-button>
            <a-popconfirm title="已有预订的批次不能删除。确认删除？" @confirm="remove(record)">
              <a-button type="link" danger size="small">删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:open="open" :title="form.id ? '编辑预售' : '新建预售'" :confirm-loading="saving" @ok="save">
      <a-form layout="vertical">
        <a-form-item label="标题"><a-input v-model:value="form.title" :maxlength="64" placeholder="如达埔第 3 批 · 11 月开摘" /></a-form-item>
        <a-form-item label="商品">
          <a-select v-model:value="form.productId" show-search option-filter-prop="label" :options="products.map((item) => ({ value: item.id, label: item.name }))" @change="onProductChange" />
        </a-form-item>
        <a-form-item label="规格">
          <a-select v-model:value="form.skuId" :options="skus.map((item) => ({ value: item.id, label: `${item.skuName} / ${item.priceMode === 'jin' ? '按斤' : '按件'}` }))" />
        </a-form-item>
        <a-form-item label="开摘日"><a-date-picker v-model:value="form.openPickDate" value-format="YYYY-MM-DD" style="width: 100%" /></a-form-item>
        <a-form-item label="预计发货日"><a-date-picker v-model:value="form.expectShipDate" value-format="YYYY-MM-DD" style="width: 100%" /></a-form-item>
        <a-form-item label="定金比例"><a-input-number v-model:value="form.depositRatio" :min="0.01" :max="0.99" :step="0.05" :precision="2" style="width: 160px" /></a-form-item>
        <a-form-item label="批次限量"><a-input-number v-model:value="form.totalStock" :min="1" :max="100000" style="width: 160px" /></a-form-item>
        <a-form-item label="尾款超时定金">
          <a-radio-group v-model:value="form.depositForfeit">
            <a-radio :value="1">不退</a-radio>
            <a-radio :value="0">退还</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="定金截止"><a-date-picker v-model:value="form.depositDeadline" show-time value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" /></a-form-item>
        <a-form-item label="尾款截止"><a-date-picker v-model:value="form.balanceDeadline" show-time value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" /></a-form-item>
      </a-form>
    </a-modal>
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
</style>
