<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  checkCart,
  deleteCart,
  listMyCartVoByPage,
  quoteCart,
  updateCart,
} from '@/api/cartController'
import { luganFruitSvg } from '@/constants/taste'

const router = useRouter()
const loading = ref(false)
const acting = ref(false)
const rows = ref<API.CartVO[]>([])
const selected = ref<string[]>([])
const quote = ref<API.CartQuoteVO>({})
const province = ref('福建省')

const provinces = [
  { label: '福建省内', value: '福建省' },
  { label: '省外', value: '浙江省' },
]

const allChecked = computed(() => rows.value.length > 0 && selected.value.length === rows.value.length)
const money = (value?: number) => Number(value ?? 0).toFixed(2)

async function load() {
  loading.value = true
  try {
    const response = await listMyCartVoByPage({ current: 1, pageSize: 50 })
    const body = response.data
    if (body.code !== 0) {
      if (body.code !== 40100) {
        message.error(body.message || '购物车加载失败')
      }
      return
    }
    rows.value = body.data?.list ?? []
    selected.value = rows.value.filter((item) => item.checked === 1 && item.id).map((item) => item.id as string)
    await refreshQuote()
  } catch {
    message.error('购物车加载失败')
  } finally {
    loading.value = false
  }
}

async function refreshQuote() {
  const response = await quoteCart({ province: province.value })
  if (response.data.code === 0 && response.data.data) {
    quote.value = response.data.data
  }
}

async function syncCheck(ids: string[], checked: number) {
  if (ids.length === 0) {
    return true
  }
  const response = await checkCart({ ids, checked })
  if (response.data.code !== 0 && response.data.code !== 40100) {
    message.error(response.data.message || '勾选失败')
    return false
  }
  return response.data.code === 0
}

async function onSelectChange(keys: string[]) {
  const previous = new Set(selected.value)
  const next = new Set(keys)
  const turnedOn = keys.filter((id) => !previous.has(id))
  const turnedOff = selected.value.filter((id) => !next.has(id))
  const okOn = await syncCheck(turnedOn, 1)
  const okOff = await syncCheck(turnedOff, 0)
  if (!okOn || !okOff) {
    await load()
    return
  }
  selected.value = keys
  await refreshQuote()
}

async function toggleAll(checked: boolean) {
  const ids = rows.value.map((item) => item.id).filter((id): id is string => Boolean(id))
  const ok = await syncCheck(ids, checked ? 1 : 0)
  if (!ok) {
    return
  }
  selected.value = checked ? ids : []
  await refreshQuote()
}

async function changeQuantity(row: API.CartVO, quantity: number) {
  if (!row.id) {
    return
  }
  const response = await updateCart({ id: row.id, quantity })
  if (response.data.code !== 0) {
    if (response.data.code !== 40100) {
      message.error(response.data.message || '数量修改失败')
    }
    await load()
    return
  }
  row.quantity = quantity
  if (row.salePrice != null) {
    row.lineAmount = Number(row.salePrice) * quantity
  }
  await refreshQuote()
}

async function removeRows(ids: string[]) {
  if (ids.length === 0) {
    message.warning('请先选择商品')
    return
  }
  acting.value = true
  try {
    const response = await deleteCart({ ids })
    if (response.data.code === 0) {
      message.success('已删除')
      await load()
      return
    }
    if (response.data.code !== 40100) {
      message.error(response.data.message || '删除失败')
    }
  } catch {
    message.error('删除失败')
  } finally {
    acting.value = false
  }
}

function checkout() {
  if (selected.value.length === 0) {
    message.warning('请先选择商品')
    return
  }
  router.push({ path: '/order/confirm', query: { province: province.value } })
}

watch(province, () => {
  refreshQuote()
})

onMounted(load)
</script>

<template>
  <div id="cart-page">
    <a-card :bordered="false" class="sheet">
      <div class="head">
        <div>
          <h1>勾选后一起结算</h1>
        </div>
        <a-button :disabled="selected.length === 0" :loading="acting" @click="removeRows(selected)">删除选中</a-button>
      </div>
      <a-table
        :loading="loading"
        :data-source="rows"
        :pagination="false"
        row-key="id"
        :row-selection="{ selectedRowKeys: selected, onChange: onSelectChange }"
      >
        <a-table-column title="商品" key="product">
          <template #default="{ record }">
            <div class="product">
              <img :src="record.coverUrl || luganFruitSvg(1)" :alt="record.productName || '永春芦柑'" />
              <div>
                <strong>{{ record.productName || '永春芦柑' }}</strong>
                <p>{{ record.skuName }} · {{ record.priceMode === 'jin' ? '按斤' : '按件' }}</p>
              </div>
            </div>
          </template>
        </a-table-column>
        <a-table-column title="单价" key="price" width="120">
          <template #default="{ record }">¥{{ money(record.salePrice) }}</template>
        </a-table-column>
        <a-table-column title="数量" key="quantity" width="140">
          <template #default="{ record }">
            <a-input-number
              :value="record.quantity"
              :min="1"
              :max="Math.max(record.stock || 1, 1)"
              @change="(value: number) => changeQuantity(record, value)"
            />
          </template>
        </a-table-column>
        <a-table-column title="可售" key="stock" width="90">
          <template #default="{ record }">{{ record.stock ?? 0 }}</template>
        </a-table-column>
        <a-table-column title="小计" key="line" width="120">
          <template #default="{ record }">¥{{ money(record.lineAmount) }}</template>
        </a-table-column>
        <a-table-column title="" key="action" width="80">
          <template #default="{ record }">
            <a-button type="link" @click="removeRows(record.id ? [record.id] : [])">删除</a-button>
          </template>
        </a-table-column>
        <template #emptyText>
          <a-empty description="购物车还是空的">
            <router-link to="/">去首页看看</router-link>
          </a-empty>
        </template>
      </a-table>
      <div v-if="rows.length" class="select-all">
        <a-checkbox :checked="allChecked" @change="toggleAll(!allChecked)">全选</a-checkbox>
      </div>
    </a-card>

    <a-card :bordered="false" class="sheet summary">
      <div class="summary-row">
        <span>商品总额</span>
        <strong>¥{{ money(quote.goodsAmount) }}</strong>
      </div>
      <div class="summary-row">
        <span>运费 {{ quote.freeShipping ? '（已包邮）' : '' }}</span>
        <strong>¥{{ money(quote.freightAmount) }}</strong>
      </div>
      <div class="summary-row">
        <span>优惠 {{ quote.couponName || '暂无可用券' }}</span>
        <strong class="discount">-¥{{ money(quote.discountAmount) }}</strong>
      </div>
      <p class="rule">{{ quote.ruleText }}</p>
      <div class="pay-row">
        <a-segmented v-model:value="province" :options="provinces" />
        <div class="pay">
          <span>应付</span>
          <strong>¥{{ money(quote.payAmount) }}</strong>
        </div>
        <a-button type="primary" :disabled="selected.length === 0" :loading="acting" @click="checkout">
          去确认（{{ selected.length }}）
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
#cart-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.sheet {
  border-radius: var(--radius);
  background: var(--paper);
}

.head,
.pay-row,
.summary-row,
.product {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

h1 {
  margin: 0 0 16px;
  color: var(--ink);
  font-size: clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.04em;
}

.product {
  justify-content: flex-start;
}

.product img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: var(--radius);
  background: var(--field-2);
}

.product p,
.rule {
  margin: 4px 0 0;
  color: var(--muted);
}

.select-all {
  margin-top: 12px;
}

.summary-row {
  padding: 8px 0;
}

.discount,
.pay strong {
  color: var(--ink);
}

.pay strong {
  margin-left: 8px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.04em;
}

@media (max-width: 800px) {
  .pay-row,
  .head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
