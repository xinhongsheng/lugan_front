<script setup lang="ts">
import MerchantGate from '@/components/MerchantGate.vue'
import MerchantNav from '@/components/MerchantNav.vue'
</script>

<template>
  <div id="merchant-stat-page">
    <MerchantGate>
      <MerchantNav />
      <a-card title="经营统计">
        <p>本月销量、销售明细和导出会按店铺汇总现货与已付尾款的预售。统计接口仍在后续波次接入。</p>
      </a-card>
    </MerchantGate>
  </div>
</template>

<style scoped>
#merchant-stat-page {
  max-width: 960px;
  margin: 24px auto;
}
</style>
