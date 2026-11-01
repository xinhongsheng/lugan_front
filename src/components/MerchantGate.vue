<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getMyMerchant } from '@/api/merchantController'

const router = useRouter()
const ready = ref(false)

onMounted(async () => {
  const response = await getMyMerchant()
  const shop = response.data.data
  const open = shop?.auditStatus === 'passed' && shop.shopStatus === 1
  if (!open) {
    await router.replace('/merchant/apply')
    return
  }
  ready.value = true
})
</script>

<template>
  <slot v-if="ready" />
</template>
