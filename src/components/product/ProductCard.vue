<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { luganFruitSvg } from '@/constants/taste'

const router = useRouter()

const props = defineProps<{
  product: API.ProductVO
  index?: number
}>()

const cover = computed(() => props.product.coverUrl || luganFruitSvg(props.index ?? 0))

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

const stamp = computed(() => {
  if (props.product.directFlag === 1) {
    return '直供'
  }
  if (props.product.hotFlag === 1) {
    return '热销'
  }
  if (props.product.newFlag === 1) {
    return '新品'
  }
  return ''
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
      <img :src="cover" :alt="product.name ?? '永春芦柑'" width="400" height="400" loading="lazy" />
      <span v-if="stamp" class="stamp">{{ stamp }}</span>
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
  background: var(--surface, #f4f4f2);
  border-radius: var(--radius, 4px);
  cursor: pointer;
  transition: background 0.25s var(--ease-out, ease), transform 0.25s var(--ease-out, ease);
}

.product-card:hover {
  background: var(--field-2, #e3e1dc);
  transform: translateY(-2px);
}

.product-card:focus-visible {
  outline: 2px solid var(--accent, #f7941d);
  outline-offset: 2px;
}

.thumb {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: var(--field-2, #e3e1dc);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s var(--ease-out, ease);
}

.product-card:hover .thumb img {
  transform: scale(1.04);
}

.stamp {
  position: absolute;
  top: 0;
  left: 0;
  padding: 4px 10px;
  background: var(--accent, #f7941d);
  color: var(--accent-ink, #1f2b4d);
  font-size: var(--step-small, 0.8125rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.3;
}

.info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  padding: 14px 14px 16px;
}

.name {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: var(--ink, #1f2b4d);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.meta {
  overflow: hidden;
  margin: 0;
  color: var(--muted, #6a7186);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.foot {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-top: auto;
  padding-top: 6px;
}

.price {
  color: var(--ink, #1f2b4d);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.04em;
}

.price i {
  margin-right: 1px;
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
}

.unit {
  color: var(--muted, #6a7186);
  font-size: 12px;
}
</style>
