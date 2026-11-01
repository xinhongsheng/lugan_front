<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { adminPage, adminPost } from '@/api/adminController'

type Row = Record<string, unknown>

const router = useRouter()
const tab = ref('coupon')
const rows = ref<Row[]>([])
const loading = ref(false)
const saving = ref(false)
const open = ref(false)

const couponForm = reactive({
  couponName: '',
  couponType: 'full',
  discountAmount: 5,
  minAmount: 30,
  validStart: '',
  validEnd: '',
  totalCount: 100,
  perUserLimit: 1,
  scopeType: 'all',
})
const promotionForm = reactive({
  activityName: '',
  activityType: 'seckill',
  productName: '',
  skuId: '',
  salePrice: 29.9,
  originPrice: 39.9,
  stock: 20,
  startTime: '',
  endTime: '',
  limitPerUser: 1,
  minQuantity: 1,
  groupSize: 2,
  groupHours: 24,
})
const priceForm = reactive({
  batchName: '',
  priceMode: 'fixed',
  priceValue: 19.9,
  skuIds: '',
})
const memberForm = reactive({
  orderPointRate: 1,
  reviewPoint: 10,
  photoPoint: 5,
  pointPerYuan: 100,
  maxDeductRate: 0.2,
  maxDeductAmount: 20,
  memberDayType: 'none',
  memberDayValue: 1,
  memberDayDiscount: 0.95,
  memberDayPointRate: 2,
  silverSpend: 200,
  silverDiscount: 0.98,
  goldSpend: 1000,
  goldDiscount: 0.95,
})

const tabs = [
  { key: 'coupon', tab: '优惠券' },
  { key: 'promotion', tab: '秒杀团购拼团' },
  { key: 'price', tab: '节日调价' },
  { key: 'member', tab: '会员积分' },
]

const columns = ref<TableColumnType[]>([
  { title: '名称', dataIndex: 'couponName', ellipsis: true },
  { title: '类型', dataIndex: 'couponType', width: 90 },
  { title: '面额', dataIndex: 'discountAmount', width: 80 },
  { title: '门槛', dataIndex: 'minAmount', width: 80 },
  { title: '已领', dataIndex: 'claimedCount', width: 80 },
  { title: '总量', dataIndex: 'totalCount', width: 80 },
  { title: '状态', dataIndex: 'couponStatus', width: 110 },
  { title: '操作', key: 'action', width: 180 },
])

function text(row: Row, key: string) {
  const value = row[key]
  return value === undefined || value === null ? '' : String(value)
}

async function load() {
  loading.value = true
  try {
    if (tab.value === 'member') {
      const response = await adminPost<{ rule?: Row; levels?: Row[] }>('/memberRule/get/vo', {})
      rows.value = response.data.data?.rule ? [response.data.data.rule] : []
      return
    }
    const url =
      tab.value === 'coupon'
        ? '/coupon/admin/list/page/vo'
        : tab.value === 'promotion'
          ? '/promotion/admin/list/page/vo'
          : '/priceBatch/list/page/vo'
    const response = await adminPage<Row>(url, { current: 1, pageSize: 20 })
    rows.value = response.data.code === 0 ? response.data.data?.list ?? [] : []
  } finally {
    loading.value = false
  }
}

function changeTab(key: string) {
  tab.value = key
  if (key === 'promotion') {
    columns.value = [
      { title: '活动', dataIndex: 'activityName', ellipsis: true },
      { title: '类型', dataIndex: 'activityType', width: 100 },
      { title: '活动价', dataIndex: 'salePrice', width: 90 },
      { title: '库存', dataIndex: 'stock', width: 80 },
      { title: '已售', dataIndex: 'soldCount', width: 80 },
      { title: '状态', dataIndex: 'activityStatus', width: 100 },
      { title: '操作', key: 'action', width: 180 },
    ] as TableColumnType[]
  } else if (key === 'price') {
    columns.value = [
      { title: '批次', dataIndex: 'batchName', ellipsis: true },
      { title: '方式', dataIndex: 'priceMode', width: 90 },
      { title: '数值', dataIndex: 'priceValue', width: 90 },
      { title: '状态', dataIndex: 'batchStatus', width: 120 },
      { title: '操作', key: 'action', width: 160 },
    ] as TableColumnType[]
  } else if (key === 'member') {
    columns.value = [
      { title: '下单积分', dataIndex: 'orderPointRate', width: 100 },
      { title: '评价', dataIndex: 'reviewPoint', width: 80 },
      { title: '晒单', dataIndex: 'photoPoint', width: 80 },
      { title: '抵扣积分', dataIndex: 'pointPerYuan', width: 100 },
      { title: '会员日', dataIndex: 'memberDayType', width: 100 },
    ] as TableColumnType[]
  }
  load()
}

async function saveCoupon() {
  saving.value = true
  try {
    const response = await adminPost('/coupon/add', couponForm)
    if (response.data.code !== 0) {
      message.error(response.data.message || '保存失败')
      return
    }
    message.success('优惠券已创建')
    open.value = false
    await load()
  } finally {
    saving.value = false
  }
}

async function savePromotion() {
  saving.value = true
  try {
    const response = await adminPost('/promotion/add', {
      ...promotionForm,
      skuId: promotionForm.skuId || undefined,
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '保存失败')
      return
    }
    message.success('活动已创建')
    open.value = false
    await load()
  } finally {
    saving.value = false
  }
}

async function savePrice() {
  const skuIds = priceForm.skuIds
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
  saving.value = true
  try {
    const response = await adminPost('/priceBatch/add', { ...priceForm, skuIds })
    if (response.data.code !== 0) {
      message.error(response.data.message || '保存失败')
      return
    }
    message.success('调价批次已创建')
    open.value = false
    await load()
  } finally {
    saving.value = false
  }
}

async function saveMember() {
  saving.value = true
  try {
    const response = await adminPost('/memberRule/add', memberForm)
    if (response.data.code !== 0) {
      message.error(response.data.message || '保存失败')
      return
    }
    message.success('规则已发布')
    open.value = false
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

onMounted(load)
</script>

<template>
  <page-container title="营销管理" :tab-list="tabs" :tab-active-key="tab" @tab-change="changeTab">
    <template #extra>
      <a-space :size="4">
        <a-button type="link" @click="router.push('/admin')">基础系统</a-button>
        <a-button type="link" @click="router.push('/admin/presale')">预售批次</a-button>
        <a-button type="link" @click="router.push('/')">返回商城</a-button>
      </a-space>
    </template>
    <a-card :bordered="false">
      <div class="toolbar">
        <a-button type="primary" @click="open = true">新建</a-button>
      </div>
      <a-table :columns="columns" :data-source="rows" :loading="loading" row-key="id" size="middle" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action' && tab === 'coupon'">
            <a-space :size="0">
              <a-button type="link" size="small" @click="act('/coupon/publish', text(record, 'id'), '已开始发放')">发放</a-button>
              <a-button type="link" size="small" @click="act('/coupon/offline', text(record, 'id'), '已停止领取')">下线</a-button>
              <a-button type="link" danger size="small" @click="act('/coupon/void', text(record, 'id'), '已作废')">作废</a-button>
            </a-space>
          </template>
          <template v-else-if="column.key === 'action' && tab === 'promotion'">
            <a-space :size="0">
              <a-button type="link" size="small" @click="act('/promotion/publish', text(record, 'id'), '已上架')">上架</a-button>
              <a-button type="link" size="small" @click="act('/promotion/pause', text(record, 'id'), '已暂停')">暂停</a-button>
              <a-button type="link" size="small" @click="act('/promotion/offline', text(record, 'id'), '已下架')">下架</a-button>
            </a-space>
          </template>
          <template v-else-if="column.key === 'action' && tab === 'price'">
            <a-space :size="0">
              <a-button type="link" size="small" @click="act('/priceBatch/apply', text(record, 'id'), '已改价')">生效</a-button>
              <a-button type="link" size="small" @click="act('/priceBatch/rollback', text(record, 'id'), '已回滚')">回滚</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:open="open" title="新建" :confirm-loading="saving" @ok="tab === 'coupon' ? saveCoupon() : tab === 'promotion' ? savePromotion() : tab === 'price' ? savePrice() : saveMember()">
      <a-form v-if="tab === 'coupon'" layout="vertical">
        <a-form-item label="名称"><a-input v-model:value="couponForm.couponName" /></a-form-item>
        <a-form-item label="类型">
          <a-select v-model:value="couponForm.couponType">
            <a-select-option value="full">满减</a-select-option>
            <a-select-option value="newcomer">新人</a-select-option>
            <a-select-option value="festival">节日</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="面额"><a-input-number v-model:value="couponForm.discountAmount" :min="0.01" /></a-form-item>
        <a-form-item label="门槛"><a-input-number v-model:value="couponForm.minAmount" :min="0" /></a-form-item>
        <a-form-item label="开始"><a-input v-model:value="couponForm.validStart" placeholder="2026-11-01 00:00:00" /></a-form-item>
        <a-form-item label="结束"><a-input v-model:value="couponForm.validEnd" placeholder="2026-12-01 00:00:00" /></a-form-item>
        <a-form-item label="总量"><a-input-number v-model:value="couponForm.totalCount" :min="1" /></a-form-item>
        <a-form-item label="每人限领"><a-input-number v-model:value="couponForm.perUserLimit" :min="1" /></a-form-item>
      </a-form>
      <a-form v-else-if="tab === 'promotion'" layout="vertical">
        <a-form-item label="名称"><a-input v-model:value="promotionForm.activityName" /></a-form-item>
        <a-form-item label="类型">
          <a-select v-model:value="promotionForm.activityType">
            <a-select-option value="seckill">秒杀</a-select-option>
            <a-select-option value="wholesale">团购</a-select-option>
            <a-select-option value="group">拼团</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="商品"><a-input v-model:value="promotionForm.productName" /></a-form-item>
        <a-form-item label="SKU"><a-input v-model:value="promotionForm.skuId" /></a-form-item>
        <a-form-item label="活动价"><a-input-number v-model:value="promotionForm.salePrice" :min="0.01" /></a-form-item>
        <a-form-item label="原价"><a-input-number v-model:value="promotionForm.originPrice" :min="0.01" /></a-form-item>
        <a-form-item label="库存"><a-input-number v-model:value="promotionForm.stock" :min="1" /></a-form-item>
        <a-form-item label="开始"><a-input v-model:value="promotionForm.startTime" placeholder="2026-11-01 00:00:00" /></a-form-item>
        <a-form-item label="结束"><a-input v-model:value="promotionForm.endTime" placeholder="2026-12-01 00:00:00" /></a-form-item>
        <a-form-item label="限购"><a-input-number v-model:value="promotionForm.limitPerUser" :min="1" :max="5" /></a-form-item>
        <a-form-item v-if="promotionForm.activityType === 'group'" label="成团人数">
          <a-select v-model:value="promotionForm.groupSize">
            <a-select-option :value="2">2 人</a-select-option>
            <a-select-option :value="3">3 人</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <a-form v-else-if="tab === 'price'" layout="vertical">
        <a-form-item label="批次"><a-input v-model:value="priceForm.batchName" /></a-form-item>
        <a-form-item label="方式">
          <a-select v-model:value="priceForm.priceMode">
            <a-select-option value="fixed">统一价</a-select-option>
            <a-select-option value="rate">折扣</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="数值"><a-input-number v-model:value="priceForm.priceValue" :min="0.01" /></a-form-item>
        <a-form-item label="SKU"><a-input v-model:value="priceForm.skuIds" placeholder="多个 id 用逗号分隔" /></a-form-item>
      </a-form>
      <a-form v-else layout="vertical">
        <a-form-item label="每元积分"><a-input-number v-model:value="memberForm.orderPointRate" :min="0" /></a-form-item>
        <a-form-item label="评价积分"><a-input-number v-model:value="memberForm.reviewPoint" :min="0" /></a-form-item>
        <a-form-item label="晒单积分"><a-input-number v-model:value="memberForm.photoPoint" :min="0" /></a-form-item>
        <a-form-item label="多少积分抵 1 元"><a-input-number v-model:value="memberForm.pointPerYuan" :min="1" /></a-form-item>
        <a-form-item label="抵扣比例"><a-input-number v-model:value="memberForm.maxDeductRate" :min="0" :max="1" /></a-form-item>
        <a-form-item label="银卡门槛"><a-input-number v-model:value="memberForm.silverSpend" :min="0" /></a-form-item>
        <a-form-item label="金卡门槛"><a-input-number v-model:value="memberForm.goldSpend" :min="0" /></a-form-item>
        <a-form-item label="会员日">
          <a-select v-model:value="memberForm.memberDayType">
            <a-select-option value="none">无</a-select-option>
            <a-select-option value="week">每周</a-select-option>
            <a-select-option value="month">每月</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </page-container>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}
</style>
