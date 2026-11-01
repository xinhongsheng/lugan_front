<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  cancelOrder,
  confirmOrder,
  getTradeOrderVoById,
  payOrder,
  refundOrder,
  shipOrder,
} from '@/api/tradeOrderController'
import { addReview, uploadReviewImage } from '@/api/reviewController'
import { ORDER_STATUS_MAP, PAY_CHANNEL_MAP, REFUND_STATUS_MAP } from '@/constants/order'
import { listMyUserCouponVoByPage } from '@/api/userCouponController'
import { fileUrl } from '@/utils/fileUrl'

const route = useRoute()
const loading = ref(false)
const acting = ref(false)
const detail = ref<API.TradeOrderDetailVO>({})
const refundReason = ref('')
const reviewContent = ref('')
const reviewScore = ref(5)
const reviewImages = ref<string[]>([])
const reviewProductId = ref<string>()
const coupons = ref<API.UserCouponVO[]>([])
const userCouponId = ref<string>()

const money = (value?: number) => Number(value ?? 0).toFixed(2)
const statusText = computed(() => ORDER_STATUS_MAP[detail.value.orderStatus as keyof typeof ORDER_STATUS_MAP] || detail.value.orderStatus || '')
const refundText = computed(() => REFUND_STATUS_MAP[detail.value.refundStatus || 'none'] || '')
const addressText = computed(() =>
  [detail.value.receiverName, detail.value.receiverPhone, detail.value.province, detail.value.city, detail.value.district, detail.value.detailAddress]
    .filter(Boolean)
    .join(' '),
)

async function load() {
  const id = String(route.query.id ?? '')
  if (!id) {
    message.error('缺少订单')
    return
  }
  loading.value = true
  try {
    const response = await getTradeOrderVoById({ id })
    if (response.data.code !== 0 || !response.data.data) {
      if (response.data.code !== 40100) {
        message.error(response.data.message || '订单加载失败')
      }
      return
    }
    detail.value = response.data.data
    reviewProductId.value = response.data.data.itemList?.[0]?.productId
    if (response.data.data.orderStatus === 'unpaid' && Number(response.data.data.discountAmount ?? 0) === 0) {
      const couponRes = await listMyUserCouponVoByPage({ current: 1, pageSize: 50 })
      coupons.value = (couponRes.data.data?.list ?? []).filter((item) => item.useStatus === 0)
    } else {
      coupons.value = []
    }
  } catch {
    message.error('订单加载失败')
  } finally {
    loading.value = false
  }
}

async function run(action: () => Promise<{ data: { code?: number; message?: string } }>, success: string) {
  if (!detail.value.id) {
    return
  }
  acting.value = true
  try {
    const response = await action()
    if (response.data.code === 0) {
      message.success(success)
      await load()
      return
    }
    if (response.data.code !== 40100) {
      message.error(response.data.message || '操作失败')
    }
  } catch {
    message.error('操作失败')
  } finally {
    acting.value = false
  }
}

function couponBlocked(item: API.UserCouponVO) {
  return Number(detail.value.goodsAmount ?? 0) < Number(item.minAmount ?? 0)
}

function pay(channel: string) {
  return run(
    () => payOrder({ id: detail.value.id, payChannel: channel, userCouponId: userCouponId.value }),
    channel === 'alipay' ? '支付宝模拟支付成功' : '微信模拟支付成功',
  )
}

function cancel() {
  return run(() => cancelOrder({ id: detail.value.id }), '订单已取消，库存已释放')
}

function ship() {
  return run(() => shipOrder({ id: detail.value.id }), '已模拟发货')
}

function confirmReceive() {
  return run(() => confirmOrder({ id: detail.value.id }), '已确认收货')
}

async function refund() {
  if (!refundReason.value.trim()) {
    message.warning('请填写退款原因')
    return
  }
  await run(() => refundOrder({ id: detail.value.id, reason: refundReason.value.trim() }), '退款申请已提交')
}

async function onImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) {
    return
  }
  const form = new FormData()
  form.append('file', file)
  const response = await uploadReviewImage({}, { data: form, headers: { 'Content-Type': 'multipart/form-data' } })
  if (response.data.code === 0 && response.data.data) {
    reviewImages.value.push(response.data.data)
    return
  }
  if (response.data.code !== 40100) {
    message.error(response.data.message || '图片上传失败')
  }
}

async function submitReview() {
  if (!reviewProductId.value) {
    return
  }
  await run(
    () =>
      addReview({
        orderId: detail.value.id,
        productId: reviewProductId.value,
        content: reviewContent.value,
        score: reviewScore.value,
        imageUrls: reviewImages.value.join(','),
      }),
    '评价已提交',
  )
  reviewContent.value = ''
  reviewImages.value = []
}

onMounted(load)
watch(() => route.query.id, load)
</script>

<template>
  <div id="order-detail-page">
    <a-spin :spinning="loading">
      <a-card :bordered="false" class="sheet">
        <p class="meta">订单号 {{ detail.orderNo }}</p>
        <h1>{{ statusText }}</h1>
        <p v-if="refundText" class="warn">{{ refundText }}：{{ detail.refundReason }}</p>
        <p class="meta">{{ addressText || '未填写收货地址' }}</p>
        <p v-if="detail.logisticsNo" class="meta">物流单号 {{ detail.logisticsNo }}</p>
        <p v-if="detail.payChannel" class="meta">{{ PAY_CHANNEL_MAP[detail.payChannel] || detail.payChannel }} 已支付</p>
      </a-card>

      <a-card title="商品清单" :bordered="false" class="sheet">
        <div v-for="item in detail.itemList" :key="`${item.skuId}`" class="line">
          <div>
            <strong>{{ item.productName }}</strong>
            <p>{{ item.skuName }} × {{ item.quantity }}</p>
          </div>
          <span>¥{{ money(item.lineAmount) }}</span>
        </div>
        <div class="sum"><span>商品总额</span><strong>¥{{ money(detail.goodsAmount) }}</strong></div>
        <div class="sum"><span>运费</span><strong>¥{{ money(detail.freightAmount) }}</strong></div>
        <div class="sum"><span>优惠</span><strong>-¥{{ money(detail.discountAmount) }}</strong></div>
        <div class="sum pay"><span>实付</span><strong>¥{{ money(detail.payAmount) }}</strong></div>
      </a-card>

      <a-card v-if="detail.orderStatus === 'unpaid'" title="模拟支付" :bordered="false" class="sheet">
        <div v-if="Number(detail.discountAmount ?? 0) === 0" class="coupon-pick">
          <span>使用优惠券</span>
          <button type="button" :class="{ on: !userCouponId }" @click="userCouponId = undefined">不使用</button>
          <button
            v-for="item in coupons"
            :key="item.id"
            type="button"
            :disabled="couponBlocked(item)"
            :class="{ on: userCouponId === item.id, off: couponBlocked(item) }"
            :title="couponBlocked(item) ? `未满 ${item.minAmount} 元` : ''"
            @click="userCouponId = item.id"
          >
            {{ item.couponName }} 减{{ item.discountAmount }}（满{{ item.minAmount }}）
          </button>
          <p v-if="coupons.length === 0" class="meta">暂无未使用的优惠券，可先到营销活动领取</p>
        </div>
        <a-space>
          <a-button type="primary" :loading="acting" @click="pay('alipay')">支付宝支付</a-button>
          <a-button :loading="acting" @click="pay('wechat')">微信支付</a-button>
          <a-button danger :loading="acting" @click="cancel">取消订单</a-button>
        </a-space>
      </a-card>

      <a-card v-if="detail.orderStatus === 'unshipped'" :bordered="false" class="sheet">
        <a-space>
          <a-button type="primary" :loading="acting" @click="ship">模拟发货</a-button>
          <a-input v-model:value="refundReason" placeholder="退款原因" style="width: 220px" />
          <a-button :loading="acting" @click="refund">申请退款</a-button>
        </a-space>
      </a-card>

      <a-card v-if="detail.orderStatus === 'unreceived'" :bordered="false" class="sheet">
        <a-space>
          <a-button type="primary" :loading="acting" @click="confirmReceive">确认收货</a-button>
          <a-input v-model:value="refundReason" placeholder="退款原因" style="width: 220px" />
          <a-button :loading="acting" @click="refund">申请退款</a-button>
        </a-space>
      </a-card>

      <a-card v-if="detail.orderStatus === 'uncommented'" title="评价" :bordered="false" class="sheet">
        <a-select
          v-model:value="reviewProductId"
          :options="(detail.itemList || []).map((item) => ({ label: item.productName, value: item.productId }))"
          style="width: 240px"
        />
        <div class="review-row">
          <a-rate v-model:value="reviewScore" />
          <a-textarea v-model:value="reviewContent" :rows="3" placeholder="说说这箱芦柑" />
        </div>
        <div class="photos">
          <img v-for="photo in reviewImages" :key="photo" :src="fileUrl(photo)" alt="实拍" />
          <input type="file" accept="image/*" @change="onImage" />
        </div>
        <a-button type="primary" :loading="acting" @click="submitReview">提交评价</a-button>
      </a-card>
    </a-spin>
  </div>
</template>

<style scoped>
#order-detail-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.sheet {
  border-radius: var(--radius);
  background: var(--paper);
}

h1 {
  margin: 4px 0 8px;
  color: var(--ink);
  font-size: clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.04em;
}

.meta,
.warn {
  margin: 4px 0;
  color: var(--muted);
}

.warn {
  color: #9a3412;
}

.coupon-pick {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
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

.line,
.sum {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
}

.line p {
  margin: 4px 0 0;
  color: var(--muted);
}

.pay strong {
  color: var(--ink);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.04em;
}

.review-row,
.photos {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
}

.photos img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: var(--radius);
}
</style>
