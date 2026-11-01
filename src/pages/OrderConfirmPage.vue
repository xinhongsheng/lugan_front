<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { listMyAddressVoByPage } from '@/api/addressController'
import { checkoutCart, listMyCartVoByPage, quoteCart } from '@/api/cartController'
import { listMyUserCouponVoByPage } from '@/api/userCouponController'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const acting = ref(false)
const addresses = ref<API.AddressVO[]>([])
const rows = ref<API.CartVO[]>([])
const quote = ref<API.CartQuoteVO>({})
const addressId = ref<string>()
const coupons = ref<API.UserCouponVO[]>([])
const userCouponId = ref<string>()
const useCoupon = ref(true)

const money = (value?: number) => Number(value ?? 0).toFixed(2)

function addressText(item: API.AddressVO) {
  return `${item.receiverName} ${item.receiverPhone} ${item.province || ''}${item.city || ''}${item.district || ''}${item.detailAddress || ''}`
}

async function load() {
  loading.value = true
  try {
    const [addressRes, cartRes, couponRes] = await Promise.all([
      listMyAddressVoByPage({ current: 1, pageSize: 20 }),
      listMyCartVoByPage({ current: 1, pageSize: 50 }),
      listMyUserCouponVoByPage({ current: 1, pageSize: 50 }),
    ])
    if (addressRes.data.code !== 0 || cartRes.data.code !== 0) {
      message.error(addressRes.data.message || cartRes.data.message || '订单确认加载失败')
      return
    }
    addresses.value = addressRes.data.data?.list ?? []
    rows.value = (cartRes.data.data?.list ?? []).filter((item) => item.checked === 1)
    coupons.value = (couponRes.data.data?.list ?? []).filter((item) => item.useStatus === 0)
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
  const response = await quoteCart({
    addressId: addressId.value,
    useCoupon: useCoupon.value,
    userCouponId: useCoupon.value ? userCouponId.value : undefined,
  })
  if (response.data.code === 0 && response.data.data) {
    quote.value = response.data.data
    if (useCoupon.value && !userCouponId.value && response.data.data.couponId) {
      userCouponId.value = response.data.data.couponId
    }
  } else if (response.data.code !== 0 && response.data.code !== 40100) {
    message.error(response.data.message || '优惠券不可用')
  }
}

function couponBlocked(item: API.UserCouponVO) {
  return Number(quote.value.goodsAmount ?? 0) < Number(item.minAmount ?? 0)
}

function pickCoupon(id?: string) {
  const hit = coupons.value.find((item) => item.id === id)
  if (hit && couponBlocked(hit)) {
    return
  }
  useCoupon.value = !!id
  userCouponId.value = id
  refreshQuote()
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
    const response = await checkoutCart({
      addressId: addressId.value,
      useCoupon: useCoupon.value,
      userCouponId: useCoupon.value ? userCouponId.value : undefined,
    })
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
        <div class="coupon-pick">
          <span>优惠券</span>
          <button type="button" :class="{ on: !useCoupon }" @click="pickCoupon()">不使用</button>
          <button
            v-for="item in coupons"
            :key="item.id"
            type="button"
            :disabled="couponBlocked(item)"
            :class="{ on: useCoupon && userCouponId === item.id, off: couponBlocked(item) }"
            :title="couponBlocked(item) ? `未满 ${item.minAmount} 元` : ''"
            @click="pickCoupon(item.id)"
          >
            {{ item.couponName }} 减{{ item.discountAmount }}（满{{ item.minAmount }}）
          </button>
        </div>
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
  gap: 14px;
}

.sheet {
  border-radius: var(--radius);
  background: var(--paper);
}

h1 {
  margin: 0 0 16px;
  color: var(--ink);
  font-size: clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.04em;
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
  color: var(--muted);
}

.coupon-pick {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 8px 0;
}

.coupon-pick button {
  border: 1px solid #f3d7b0;
  border-radius: 14px;
  background: #fff;
  color: #e8870a;
  padding: 4px 10px;
  cursor: pointer;
}

.coupon-pick button.on {
  background: #f39800;
  border-color: #f39800;
  color: #fff;
}

.coupon-pick button.off,
.coupon-pick button:disabled {
  background: #d9d9d9;
  border-color: #d9d9d9;
  color: #8c8c8c;
  cursor: not-allowed;
}

.pay span {
  color: var(--ink);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.04em;
}
</style>
