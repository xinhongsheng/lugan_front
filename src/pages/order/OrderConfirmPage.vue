<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { listMyAddressVoByPage } from '@/api/addressController'
import { checkoutCart, listMyCartVoByPage, quoteCart } from '@/api/cartController'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const acting = ref(false)
const addresses = ref<API.AddressVO[]>([])
const rows = ref<API.CartVO[]>([])
const quote = ref<API.CartQuoteVO>({})
const addressId = ref<string>()

const money = (value?: number) => Number(value ?? 0).toFixed(2)

function addressText(item: API.AddressVO) {
  return `${item.receiverName} ${item.receiverPhone} ${item.province || ''}${item.city || ''}${item.district || ''}${item.detailAddress || ''}`
}

async function load() {
  loading.value = true
  try {
    const [addressRes, cartRes] = await Promise.all([
      listMyAddressVoByPage({ current: 1, pageSize: 20 }),
      listMyCartVoByPage({ current: 1, pageSize: 50 }),
    ])
    if (addressRes.data.code !== 0 || cartRes.data.code !== 0) {
      message.error(addressRes.data.message || cartRes.data.message || '订单确认加载失败')
      return
    }
    addresses.value = addressRes.data.data?.list ?? []
    rows.value = (cartRes.data.data?.list ?? []).filter((item) => item.checked === 1)
    const preferred = addresses.value.find((item) => item.defaultFlag === 1) || addresses.value[0]
    addressId.value = preferred?.id
    await refreshQuote()
  } catch {
    message.error('订单确认加载失败')
  } finally {
    loading.value = false
  }
}

async function refreshQuote() {
  if (!addressId.value) {
    return
  }
  const response = await quoteCart({ addressId: addressId.value })
  if (response.data.code === 0 && response.data.data) {
    quote.value = response.data.data
  }
}

async function submit() {
  if (!addressId.value) {
    message.warning('请先添加收货地址')
    return
  }
  if (rows.value.length === 0) {
    message.warning('没有可结算的商品')
    return
  }
  acting.value = true
  try {
    const response = await checkoutCart({ addressId: addressId.value })
    if (response.data.code === 0 && response.data.data) {
      message.success('订单已生成，请支付')
      await router.push({ path: '/order/detail', query: { id: response.data.data } })
      return
    }
    if (response.data.code !== 40100) {
      message.error(response.data.message || '提交订单失败')
    }
  } catch {
    message.error('提交订单失败')
  } finally {
    acting.value = false
  }
}

watch(addressId, () => {
  refreshQuote()
})

onMounted(load)
</script>

<template>
  <div id="order-confirm-page">
    <a-spin :spinning="loading">
      <a-card :bordered="false" class="sheet">
        <p class="eyebrow">订单确认</p>
        <h1>核对地址和金额</h1>
        <a-empty v-if="addresses.length === 0" description="还没有收货地址">
          <router-link to="/user/profile">去添加地址</router-link>
        </a-empty>
        <a-radio-group v-else v-model:value="addressId" class="addresses">
          <a-radio v-for="item in addresses" :key="item.id" :value="item.id" class="address">
            {{ addressText(item) }}
            <a-tag v-if="item.province?.includes('福建')" color="green">福建本地配送</a-tag>
            <a-tag v-if="item.defaultFlag === 1">默认</a-tag>
          </a-radio>
        </a-radio-group>
      </a-card>

      <a-card title="商品清单" :bordered="false" class="sheet">
        <a-empty v-if="rows.length === 0" description="没有勾选商品" />
        <div v-for="row in rows" :key="row.id" class="line">
          <div>
            <strong>{{ row.productName }}</strong>
            <p>{{ row.skuName }} × {{ row.quantity }}</p>
          </div>
          <span>¥{{ money(row.lineAmount) }}</span>
        </div>
      </a-card>

      <a-card :bordered="false" class="sheet">
        <div class="sum"><span>商品总额</span><strong>¥{{ money(quote.goodsAmount) }}</strong></div>
        <div class="sum"><span>运费</span><strong>¥{{ money(quote.freightAmount) }}</strong></div>
        <div class="sum"><span>优惠 {{ quote.couponName || '无' }}</span><strong>-¥{{ money(quote.discountAmount) }}</strong></div>
        <p class="rule">{{ quote.ruleText || route.query.province }}</p>
        <div class="pay">
          <span>实付 ¥{{ money(quote.payAmount) }}</span>
          <a-button type="primary" :loading="acting" :disabled="rows.length === 0" @click="submit">提交订单</a-button>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<style scoped>
#order-confirm-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sheet {
  border-radius: 16px;
}

.eyebrow {
  margin: 0;
  color: #2f7d46;
  letter-spacing: 0.12em;
}

h1 {
  margin: 4px 0 16px;
  font-family: KaiTi, '楷体', serif;
  font-size: 32px;
}

.addresses {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.address {
  padding: 8px 0;
}

.line,
.sum,
.pay {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
}

.line p,
.rule {
  margin: 4px 0 0;
  color: #6b7280;
}

.pay span {
  color: #e8590c;
  font-size: 24px;
  font-weight: 700;
}
</style>
