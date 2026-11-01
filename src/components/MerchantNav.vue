<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const links = [
  { path: '/merchant/apply', label: '入驻资料' },
  { path: '/merchant/product', label: '商品管理' },
  { path: '/merchant/stock', label: '现货库存' },
  { path: '/merchant/order', label: '现货订单' },
  { path: '/merchant/refund', label: '退款处理' },
  { path: '/merchant/stat', label: '经营统计' },
  { path: '/merchant/review', label: '评价回复' },
  { path: '/merchant/trace', label: '溯源建档' },
  { path: '/merchant/presale', label: '预售供货' },
]
</script>

<template>
  <a-space wrap class="merchant-nav">
    <a-button
      v-for="item in links"
      :key="item.path"
      type="link"
      @click="router.push(item.path)"
    >
      {{ item.label }}
    </a-button>
  </a-space>
</template>

<style scoped>
.merchant-nav {
  margin-bottom: 12px;
}
</style>
