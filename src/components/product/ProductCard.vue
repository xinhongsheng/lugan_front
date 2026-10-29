<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { homePhoto } from '@/constants/home'

const router = useRouter()

const props = defineProps<{
  product: API.ProductVO
  index?: number
}>()

const cover = computed(() => props.product.coverUrl || homePhoto(props.index ?? 0))

const priceText = computed(() => {
  const price = props.product.price
  if (price === undefined || price === null) {
    return '价格待定'
  }
  return Number(price).toFixed(2)
})

const metaText = computed(
  () => [props.product.origin, props.product.spec].filter(Boolean).join(' · ') || '永春芦柑',
)

const badges = computed(() => {
  const list: { text: string; tone: string }[] = []
  if (props.product.directFlag === 1) {
    list.push({ text: '产地直供', tone: 'direct' })
  }
  if (props.product.hotFlag === 1) {
    list.push({ text: '热销', tone: 'hot' })
  }
  if (props.product.newFlag === 1) {
    list.push({ text: '新品', tone: 'new' })
  }
  return list
})

function openDetail() {
  if (!props.product.id) {
    return
  }
  router.push({ path: '/product/detail', query: { id: props.product.id } })
}
</script>

<template>
  <article class="product-card" role="link" tabindex="0" @click="openDetail" @keyup.enter="openDetail">
    <div class="thumb">
      <img :src="cover" :alt="product.name ?? '永春芦柑'" loading="lazy" />
      <div v-if="badges.length" class="badges">
        <span v-for="badge in badges" :key="badge.text" class="badge" :class="badge.tone">
          {{ badge.text }}
        </span>
      </div>
    </div>
    <div class="info">
      <h3 class="name">{{ product.name || '永春芦柑' }}</h3>
      <p class="meta">{{ metaText }}</p>
      <div class="foot">
        <span class="price"><i>¥</i>{{ priceText }}</span>
        <span class="unit">起</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border: 1px solid #eef0e9;
  border-radius: 14px;
  transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
  cursor: pointer;
}

.product-card:hover {
  border-color: #cfe3c9;
  box-shadow: 0 10px 24px rgba(31, 92, 53, 0.12);
  transform: translateY(-4px);
}

.thumb {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #f2f5ee;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .thumb img {
  transform: scale(1.06);
}

.badges {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 6px;
}

.badge {
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 20px;
  backdrop-filter: blur(4px);
}

.badge.direct {
  color: #1f6b3a;
  background: rgba(233, 247, 233, 0.92);
}

.badge.hot {
  color: #b5450c;
  background: rgba(255, 240, 228, 0.94);
}

.badge.new {
  color: #1d5bb8;
  background: rgba(232, 241, 255, 0.94);
}

.info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px 14px;
}

.name {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: #1f2328;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.meta {
  overflow: hidden;
  margin: 0;
  color: #8a9099;
  font-size: 12.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.foot {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-top: auto;
  padding-top: 4px;
}

.price {
  color: #e8590c;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
}

.price i {
  margin-right: 1px;
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
}

.unit {
  color: #b9bec6;
  font-size: 12px;
}
</style>
