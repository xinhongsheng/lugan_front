<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getProductVoById } from '@/api/productController'
import { listReviewVoByPage } from '@/api/reviewController'
import { calcFreight } from '@/api/freightController'
import { addCart } from '@/api/cartController'
import { addOrder } from '@/api/tradeOrderController'
import { addFavorite } from '@/api/favoriteController'
import { homePhoto } from '@/constants/home'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const acting = ref(false)
const detail = ref<API.ProductDetailVO>({})
const reviews = ref<API.ReviewVO[]>([])
const quote = ref<API.FreightQuoteVO>({})
const skuId = ref<string>()
const quantity = ref(1)
const province = ref('福建省')

const provinces = [
  { label: '福建省内', value: '福建省' },
  { label: '省外', value: '浙江省' },
]

const currentSku = computed(() => detail.value.skuList?.find((item) => item.id === skuId.value))

const cover = computed(() => detail.value.coverUrl || homePhoto(1))

const priceText = computed(() => {
  const price = currentSku.value?.salePrice ?? detail.value.price
  if (price === undefined || price === null) {
    return '--'
  }
  return Number(price).toFixed(2)
})

const priceUnit = computed(() => (currentSku.value?.priceMode === 'jin' ? '/斤' : '/件'))

const stock = computed(() => currentSku.value?.stock ?? 0)

const facts = computed(() => [
  { label: '产地', value: detail.value.origin },
  { label: '果径', value: detail.value.fruitDiameter },
  { label: '净重', value: detail.value.netWeight },
  { label: '等级', value: detail.value.grade },
  { label: '采摘', value: detail.value.pickTime },
  { label: '保鲜', value: detail.value.freshNote },
])

function buyerPhotos(imageUrls?: string) {
  if (!imageUrls) {
    return []
  }
  return imageUrls
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

async function loadDetail() {
  const id = String(route.query.id ?? '')
  if (!id) {
    message.error('缺少商品')
    return
  }
  loading.value = true
  try {
    const response = await getProductVoById({ id })
    const body = response.data
    if (body.code !== 0 || !body.data) {
      message.error(body.message || '商品加载失败')
      return
    }
    detail.value = body.data
    skuId.value = body.data.skuList?.[0]?.id
    quantity.value = 1
    await loadReviews(id)
    await refreshFreight()
  } catch {
    message.error('商品加载失败')
  } finally {
    loading.value = false
  }
}

async function loadReviews(productId: string) {
  const response = await listReviewVoByPage({ productId, current: 1, pageSize: 10 })
  if (response.data.code === 0) {
    reviews.value = response.data.data?.list ?? []
  }
}

async function refreshFreight() {
  if (!skuId.value) {
    return
  }
  const response = await calcFreight({
    skuId: skuId.value,
    quantity: quantity.value,
    province: province.value,
  })
  if (response.data.code === 0 && response.data.data) {
    quote.value = response.data.data
  }
}

async function submitCart() {
  if (!skuId.value) {
    return
  }
  acting.value = true
  try {
    const response = await addCart({ skuId: skuId.value, quantity: quantity.value })
    if (response.data.code === 0) {
      message.success('已加入购物车')
    } else if (response.data.code !== 40100) {
      message.error(response.data.message || '加入购物车失败')
    }
  } catch {
    message.error('加入购物车失败')
  } finally {
    acting.value = false
  }
}

async function buyNow() {
  if (!skuId.value) {
    return
  }
  acting.value = true
  try {
    const response = await addOrder({
      skuId: skuId.value,
      quantity: quantity.value,
      province: province.value,
    })
    if (response.data.code === 0) {
      message.success('已生成待付款订单')
      await router.push({ path: '/order/detail', query: { id: response.data.data } })
      return
    }
    if (response.data.code !== 40100) {
      message.error(response.data.message || '下单失败')
    }
  } catch {
    message.error('下单失败')
  } finally {
    acting.value = false
  }
}

async function collect() {
  const productId = detail.value.id
  if (!productId) {
    return
  }
  acting.value = true
  try {
    const response = await addFavorite({ productId })
    if (response.data.code === 0) {
      message.success('已收藏')
    } else if (response.data.code !== 40100) {
      message.error(response.data.message || '收藏失败')
    }
  } catch {
    message.error('收藏失败')
  } finally {
    acting.value = false
  }
}

watch([skuId, quantity, province], () => {
  refreshFreight()
})

onMounted(loadDetail)
watch(
  () => route.query.id,
  () => {
    loadDetail()
  },
)
</script>

<template>
  <div id="product-detail-page">
    <a-spin :spinning="loading">
      <a-card :bordered="false" class="sheet">
        <div class="hero">
          <img class="cover" :src="cover" :alt="detail.name || '永春芦柑'" />
          <div class="buy">
            <p class="eyebrow">永春芦柑</p>
            <h1>{{ detail.name || '商品详情' }}</h1>
            <p class="detail-text">{{ detail.detailText }}</p>
            <div class="price-row">
              <span class="price"><i>¥</i>{{ priceText }}</span>
              <span class="unit">{{ priceUnit }}</span>
              <span class="stock">库存 {{ stock }}</span>
            </div>
            <div class="sku-row">
              <button
                v-for="sku in detail.skuList"
                :key="sku.id"
                type="button"
                class="sku"
                :class="{ active: sku.id === skuId }"
                @click="skuId = sku.id"
              >
                {{ sku.skuName }}
              </button>
            </div>
            <div class="qty-row">
              <span>{{ currentSku?.priceMode === 'jin' ? '斤数' : '数量' }}</span>
              <a-input-number v-model:value="quantity" :min="1" :max="Math.max(stock, 1)" />
              <a-segmented v-model:value="province" :options="provinces" />
            </div>
            <p class="freight">
              {{ quote.freeShipping ? '已满包邮' : `运费 ¥${Number(quote.freightAmount ?? 0).toFixed(2)}` }}
              · 应付 ¥{{ Number(quote.payAmount ?? 0).toFixed(2) }}
            </p>
            <p class="rule">{{ detail.freightText || quote.ruleText }}</p>
            <div class="actions">
              <a-button :disabled="stock < 1" :loading="acting" @click="submitCart">加入购物车</a-button>
              <a-button type="primary" :disabled="stock < 1" :loading="acting" @click="buyNow">立即购买</a-button>
              <a-button :loading="acting" @click="collect">收藏商品</a-button>
            </div>
          </div>
        </div>
        <div class="facts">
          <div v-for="fact in facts" :key="fact.label" class="fact">
            <span>{{ fact.label }}</span>
            <strong>{{ fact.value || '—' }}</strong>
          </div>
        </div>
      </a-card>

      <a-card title="图文详情" :bordered="false" class="sheet">
        <p class="detail-text">{{ detail.detailText || '暂无图文详情' }}</p>
        <p class="detail-text">保鲜说明：{{ detail.freshNote || '常温通风存放' }}</p>
      </a-card>

      <a-card title="买家评价" :bordered="false" class="sheet">
        <a-empty v-if="reviews.length === 0" description="还没有评价" />
        <div v-for="review in reviews" :key="review.id" class="review">
          <a-rate :value="review.score" disabled />
          <p>{{ review.content }}</p>
          <div v-if="buyerPhotos(review.imageUrls).length" class="photos">
            <img v-for="photo in buyerPhotos(review.imageUrls)" :key="photo" :src="photo" alt="买家实拍" />
          </div>
        </div>
      </a-card>

      <a-card title="采摘批次" :bordered="false" class="sheet">
        <a-empty v-if="!detail.traceList?.length" description="暂无溯源批次" />
        <div v-for="trace in detail.traceList" :key="trace.batchNo" class="trace">
          <strong>{{ trace.batchNo }}</strong>
          <span>{{ trace.originPlace }} · {{ trace.pickDate }}</span>
          <p>{{ trace.inspectNote }}</p>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<style scoped>
#product-detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sheet {
  border-radius: 16px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(240px, 420px) 1fr;
  gap: 28px;
}

.cover {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 16px;
  background: #f2f5ee;
}

.eyebrow {
  margin: 0;
  color: #2f7d46;
  font-size: 13px;
  letter-spacing: 0.12em;
}

h1 {
  margin: 6px 0 8px;
  color: #1f2328;
  font-family: KaiTi, '楷体', serif;
  font-size: 32px;
  font-weight: 700;
}

.detail-text {
  margin: 0;
  color: #5c6570;
  line-height: 1.7;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 16px 0;
}

.price {
  color: #e8590c;
  font-size: 32px;
  font-weight: 700;
}

.price i {
  margin-right: 2px;
  font-size: 16px;
  font-style: normal;
}

.unit,
.stock,
.rule,
.freight {
  color: #6b7280;
}

.sku-row,
.qty-row,
.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.sku {
  padding: 6px 14px;
  border: 1px solid #d9e3d4;
  border-radius: 999px;
  background: #fff;
  color: #24402c;
  cursor: pointer;
}

.sku.active {
  border-color: #2f7d46;
  background: #eef7ef;
  color: #1f6b3a;
}

.facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
}

.fact {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f6f8f3;
}

.fact span {
  color: #8a9099;
  font-size: 12px;
}

.review,
.trace {
  padding: 12px 0;
  border-bottom: 1px solid #eef0e9;
}

.photos {
  display: flex;
  gap: 8px;
}

.photos img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
}

@media (max-width: 800px) {
  .hero,
  .facts {
    grid-template-columns: 1fr;
  }
}
</style>
