<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { adminPage, adminPost } from '@/api/adminController'
import {
  ACTIVITY_STATUS_MAP,
  ACTIVITY_TYPE_MAP,
  COUPON_STATUS_MAP,
  COUPON_TYPE_MAP,
  MEMBER_DAY_MAP,
  PRICE_BATCH_STATUS_MAP,
  PRICE_MODE_MAP,
} from '@/constants/marketing'

type Row = Record<string, unknown>

const router = useRouter()
const tab = ref('coupon')
const rows = ref<Row[]>([])
const loading = ref(false)
const saving = ref(false)
const open = ref(false)
const editingId = ref('')
const memberLevels = ref<Row[]>([])

const couponForm = reactive({
  id: '',
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
  id: '',
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
  id: '',
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

const columnMap: Record<string, TableColumnType[]> = {
  coupon: [
    { title: '名称', dataIndex: 'couponName', ellipsis: true },
    { title: '类型', key: 'couponType', width: 100 },
    { title: '面额', dataIndex: 'discountAmount', width: 80 },
    { title: '门槛', dataIndex: 'minAmount', width: 80 },
    { title: '已领', dataIndex: 'claimedCount', width: 80 },
    { title: '总量', dataIndex: 'totalCount', width: 80 },
    { title: '状态', key: 'couponStatus', width: 110 },
    { title: '操作', key: 'action', width: 300 },
  ],
  promotion: [
    { title: '活动', dataIndex: 'activityName', ellipsis: true },
    { title: '类型', key: 'activityType', width: 90 },
    { title: '活动价', dataIndex: 'salePrice', width: 90 },
    { title: '库存', dataIndex: 'stock', width: 80 },
    { title: '已售', dataIndex: 'soldCount', width: 80 },
    { title: '状态', key: 'activityStatus', width: 100 },
    { title: '操作', key: 'action', width: 280 },
  ],
  price: [
    { title: '批次', dataIndex: 'batchName', ellipsis: true },
    { title: '方式', key: 'priceMode', width: 90 },
    { title: '数值', dataIndex: 'priceValue', width: 90 },
    { title: '状态', key: 'batchStatus', width: 110 },
    { title: '操作', key: 'action', width: 240 },
  ],
  member: [
    { title: '下单积分', dataIndex: 'orderPointRate', width: 100 },
    { title: '评价', dataIndex: 'reviewPoint', width: 80 },
    { title: '晒单', dataIndex: 'photoPoint', width: 80 },
    { title: '抵扣积分', dataIndex: 'pointPerYuan', width: 100 },
    { title: '会员日', key: 'memberDayType', width: 100 },
    { title: '操作', key: 'action', width: 140 },
  ],
}

const modalTitle = computed(() => (editingId.value ? '编辑' : '新建'))

const columns = ref<TableColumnType[]>(columnMap.coupon)

function text(row: Row, key: string) {
  const value = row[key]
  return value === undefined || value === null ? '' : String(value)
}

function nameOf<T extends string>(map: Record<T, string>, row: Row, key: string) {
  const value = text(row, key)
  const named = (map as Record<string, string>)[value]
  return named || value || '—'
}

function num(row: Row, key: string, fallback: number) {
  const parsed = Number(row[key])
  return Number.isFinite(parsed) ? parsed : fallback
}

function dateText(row: Row, key: string) {
  return text(row, key).replace('T', ' ').slice(0, 19)
}

async function load() {
  loading.value = true
  try {
    if (tab.value === 'member') {
      const response = await adminPost<{ rule?: Row; levels?: Row[] }>('/memberRule/get/vo', {})
      memberLevels.value = response.data.data?.levels ?? []
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
  columns.value = columnMap[key] ?? columnMap.coupon
  rows.value = []
  open.value = false
  editingId.value = ''
  load()
}

function openCreate() {
  editingId.value = ''
  couponForm.id = ''
  couponForm.couponName = ''
  couponForm.couponType = 'full'
  couponForm.discountAmount = 5
  couponForm.minAmount = 30
  couponForm.validStart = ''
  couponForm.validEnd = ''
  couponForm.totalCount = 100
  couponForm.perUserLimit = 1
  couponForm.scopeType = 'all'
  promotionForm.id = ''
  promotionForm.activityName = ''
  promotionForm.activityType = 'seckill'
  promotionForm.productName = ''
  promotionForm.skuId = ''
  promotionForm.salePrice = 29.9
  promotionForm.originPrice = 39.9
  promotionForm.stock = 20
  promotionForm.startTime = ''
  promotionForm.endTime = ''
  promotionForm.limitPerUser = 1
  promotionForm.groupSize = 2
  priceForm.id = ''
  priceForm.batchName = ''
  priceForm.priceMode = 'fixed'
  priceForm.priceValue = 19.9
  priceForm.skuIds = ''
  open.value = true
}

async function openEdit(record: Row) {
  editingId.value = text(record, 'id')
  if (tab.value === 'coupon') {
    couponForm.id = editingId.value
    couponForm.couponName = text(record, 'couponName')
    couponForm.couponType = text(record, 'couponType') || 'full'
    couponForm.discountAmount = num(record, 'discountAmount', 5)
    couponForm.minAmount = num(record, 'minAmount', 0)
    couponForm.validStart = dateText(record, 'validStart')
    couponForm.validEnd = dateText(record, 'validEnd')
    couponForm.totalCount = num(record, 'totalCount', 1)
    couponForm.perUserLimit = num(record, 'perUserLimit', 1)
    couponForm.scopeType = text(record, 'scopeType') || 'all'
  } else if (tab.value === 'promotion') {
    promotionForm.id = editingId.value
    promotionForm.activityName = text(record, 'activityName')
    promotionForm.activityType = text(record, 'activityType') || 'seckill'
    promotionForm.productName = text(record, 'productName')
    promotionForm.skuId = text(record, 'skuId')
    promotionForm.salePrice = num(record, 'salePrice', 29.9)
    promotionForm.originPrice = num(record, 'originPrice', 39.9)
    promotionForm.stock = num(record, 'stock', 1)
    promotionForm.startTime = dateText(record, 'startTime')
    promotionForm.endTime = dateText(record, 'endTime')
    promotionForm.limitPerUser = num(record, 'limitPerUser', 1)
    promotionForm.minQuantity = num(record, 'minQuantity', 1)
    promotionForm.groupSize = num(record, 'groupSize', 2)
    promotionForm.groupHours = num(record, 'groupHours', 24)
  } else if (tab.value === 'price') {
    const detail = await adminPost<{ skuIds?: Array<string | number> }>('/priceBatch/get/vo', { id: editingId.value })
    if (detail.data.code !== 0) {
      message.error(detail.data.message || '批次加载失败')
      return
    }
    priceForm.id = editingId.value
    priceForm.batchName = text(record, 'batchName')
    priceForm.priceMode = text(record, 'priceMode') || 'fixed'
    priceForm.priceValue = num(record, 'priceValue', 19.9)
    priceForm.skuIds = (detail.data.data?.skuIds ?? []).map((item) => String(item)).join(',')
  } else {
    const silver = memberLevels.value.find((item) => item.levelCode === 'silver')
    const gold = memberLevels.value.find((item) => item.levelCode === 'gold')
    memberForm.orderPointRate = num(record, 'orderPointRate', 1)
    memberForm.reviewPoint = num(record, 'reviewPoint', 10)
    memberForm.photoPoint = num(record, 'photoPoint', 5)
    memberForm.pointPerYuan = num(record, 'pointPerYuan', 100)
    memberForm.maxDeductRate = num(record, 'maxDeductRate', 0.2)
    memberForm.maxDeductAmount = num(record, 'maxDeductAmount', 20)
    memberForm.memberDayType = text(record, 'memberDayType') || 'none'
    memberForm.memberDayValue = num(record, 'memberDayValue', 1)
    memberForm.memberDayDiscount = num(record, 'memberDayDiscount', 0.95)
    memberForm.memberDayPointRate = num(record, 'memberDayPointRate', 2)
    memberForm.silverSpend = silver ? num(silver, 'minSpend', 200) : 200
    memberForm.silverDiscount = silver ? num(silver, 'discountRate', 0.98) : 0.98
    memberForm.goldSpend = gold ? num(gold, 'minSpend', 1000) : 1000
    memberForm.goldDiscount = gold ? num(gold, 'discountRate', 0.95) : 0.95
  }
  open.value = true
}

async function saveCoupon() {
  saving.value = true
  try {
    const response = await adminPost(couponForm.id ? '/coupon/update' : '/coupon/add', {
      ...couponForm,
      id: couponForm.id || undefined,
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '保存失败')
      return
    }
    message.success(couponForm.id ? '已保存' : '优惠券已创建')
    open.value = false
    await load()
  } finally {
    saving.value = false
  }
}

async function savePromotion() {
  saving.value = true
  try {
    const response = await adminPost(promotionForm.id ? '/promotion/update' : '/promotion/add', {
      ...promotionForm,
      id: promotionForm.id || undefined,
      skuId: promotionForm.skuId || undefined,
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '保存失败')
      return
    }
    message.success(promotionForm.id ? '已保存' : '活动已创建')
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
    const response = await adminPost(priceForm.id ? '/priceBatch/update' : '/priceBatch/add', {
      ...priceForm,
      id: priceForm.id || undefined,
      skuIds,
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '保存失败')
      return
    }
    message.success(priceForm.id ? '已保存' : '调价批次已创建')
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
    message.success(editingId.value ? '已保存' : '规则已发布')
    open.value = false
    await load()
  } finally {
    saving.value = false
  }
}

async function remove(id: string) {
  const url =
    tab.value === 'coupon'
      ? '/coupon/delete'
      : tab.value === 'promotion'
        ? '/promotion/delete'
        : tab.value === 'price'
          ? '/priceBatch/delete'
          : '/memberRule/delete'
  await act(url, id, '已删除')
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
        <a-button type="primary" @click="openCreate">新建</a-button>
      </div>
      <a-table :columns="columns" :data-source="rows" :loading="loading" row-key="id" size="middle" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'couponType'">{{ nameOf(COUPON_TYPE_MAP, record, 'couponType') }}</template>
          <template v-else-if="column.key === 'couponStatus'">{{ nameOf(COUPON_STATUS_MAP, record, 'couponStatus') }}</template>
          <template v-else-if="column.key === 'activityType'">{{ nameOf(ACTIVITY_TYPE_MAP, record, 'activityType') }}</template>
          <template v-else-if="column.key === 'activityStatus'">{{ nameOf(ACTIVITY_STATUS_MAP, record, 'activityStatus') }}</template>
          <template v-else-if="column.key === 'priceMode'">{{ nameOf(PRICE_MODE_MAP, record, 'priceMode') }}</template>
          <template v-else-if="column.key === 'batchStatus'">{{ nameOf(PRICE_BATCH_STATUS_MAP, record, 'batchStatus') }}</template>
          <template v-else-if="column.key === 'memberDayType'">{{ nameOf(MEMBER_DAY_MAP, record, 'memberDayType') }}</template>
          <template v-else-if="column.key === 'action'">
            <a-space :size="0">
              <template v-if="tab === 'coupon'">
                <a-button type="link" size="small" @click="act('/coupon/publish', text(record, 'id'), '已开始发放')">发放</a-button>
                <a-button type="link" size="small" @click="act('/coupon/offline', text(record, 'id'), '已停止领取')">下线</a-button>
                <a-button type="link" size="small" @click="act('/coupon/void', text(record, 'id'), '已作废')">作废</a-button>
              </template>
              <template v-else-if="tab === 'promotion'">
                <a-button type="link" size="small" @click="act('/promotion/publish', text(record, 'id'), '已上架')">上架</a-button>
                <a-button type="link" size="small" @click="act('/promotion/pause', text(record, 'id'), '已暂停')">暂停</a-button>
                <a-button type="link" size="small" @click="act('/promotion/offline', text(record, 'id'), '已下架')">下架</a-button>
              </template>
              <template v-else-if="tab === 'price'">
                <a-button type="link" size="small" @click="act('/priceBatch/apply', text(record, 'id'), '已改价')">生效</a-button>
                <a-button type="link" size="small" @click="act('/priceBatch/rollback', text(record, 'id'), '已回滚')">回滚</a-button>
              </template>
              <a-button type="link" size="small" @click="openEdit(record)">编辑</a-button>
              <a-popconfirm title="确认删除这条记录？" @confirm="remove(text(record, 'id'))">
                <a-button type="link" danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:open="open" :title="modalTitle" :confirm-loading="saving" @ok="tab === 'coupon' ? saveCoupon() : tab === 'promotion' ? savePromotion() : tab === 'price' ? savePrice() : saveMember()">
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
