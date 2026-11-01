<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { listMySkus, updateSkuStock } from '@/api/productController'
import MerchantGate from '@/components/MerchantGate.vue'
import MerchantNav from '@/components/MerchantNav.vue'

const rows = ref<API.MerchantSkuVO[]>([])
const stocks = ref<Record<string, number>>({})

async function load() {
  const response = await listMySkus()
  if (response.data.code !== 0) {
    message.error(response.data.message || '规格加载失败')
    return
  }
  rows.value = response.data.data ?? []
  for (const item of rows.value) {
    if (item.id) {
      stocks.value[item.id] = item.stock ?? 0
    }
  }
}

async function save(id?: string) {
  if (!id) {
    return
  }
  const response = await updateSkuStock({ skuId: id, stock: stocks.value[id] })
  if (response.data.code !== 0) {
    message.error(response.data.message || '库存更新失败')
    return
  }
  message.success('现货库存已更新')
  await load()
}

onMounted(load)
</script>

<template>
  <div id="merchant-stock-page">
    <MerchantGate>
      <MerchantNav />
      <a-card title="现货库存">
        <a-table :data-source="rows" :pagination="false" row-key="id">
          <a-table-column title="商品" data-index="productName" />
          <a-table-column title="规格" data-index="skuName" />
          <a-table-column title="已锁定" data-index="lockedStock" />
          <a-table-column title="库存">
            <template #default="{ record }">
              <a-input-number v-model:value="stocks[record.id]" :min="0" />
              <a-button type="link" @click="save(record.id)">保存</a-button>
            </template>
          </a-table-column>
        </a-table>
        <p>这里只改现货库存，不会改预售批次的限量。</p>
      </a-card>
    </MerchantGate>
  </div>
</template>

<style scoped>
#merchant-stock-page {
  max-width: 960px;
  margin: 24px auto;
}
</style>
