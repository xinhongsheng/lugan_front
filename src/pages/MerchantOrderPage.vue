<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { getShipSheet, listMerchantOrder, shipOrder } from '@/api/tradeOrderController'
import MerchantGate from '@/components/MerchantGate.vue'
import MerchantNav from '@/components/MerchantNav.vue'

const rows = ref<API.TradeOrderVO[]>([])
const query = reactive<API.PageRequest>({ current: 1, pageSize: 10 })
const logistics = reactive<Record<string, string>>({})
const sheetText = ref('')

async function load() {
  const response = await listMerchantOrder(query)
  if (response.data.code !== 0) {
    message.error(response.data.message || '订单加载失败')
    return
  }
  rows.value = response.data.data?.list ?? []
}

async function ship(id?: string) {
  if (!id) {
    return
  }
  const response = await shipOrder({ id, logisticsNo: logistics[id] })
  if (response.data.code !== 0) {
    message.error(response.data.message || '发货失败')
    return
  }
  message.success('已发货')
  await load()
}

async function printSheet(id?: string) {
  if (!id) {
    return
  }
  const response = await getShipSheet({ id })
  if (response.data.code !== 0 || !response.data.data) {
    message.error(response.data.message || '发货单加载失败')
    return
  }
  const detail = response.data.data
  sheetText.value = `${detail.orderNo || ''} ${detail.receiverName || ''} ${detail.receiverPhone || ''}`
  window.print()
}

onMounted(load)
</script>

<template>
  <div id="merchant-order-page">
    <MerchantGate>
      <MerchantNav />
      <a-card title="现货订单">
        <a-table :data-source="rows" :pagination="false" row-key="id">
          <a-table-column title="订单号" data-index="orderNo" />
          <a-table-column title="状态" data-index="orderStatus" />
          <a-table-column title="金额" data-index="payAmount" />
          <a-table-column title="操作">
            <template #default="{ record }">
              <a-input v-model:value="logistics[record.id]" placeholder="物流单号" style="width: 140px" />
              <a-button type="link" @click="printSheet(record.id)">打印</a-button>
              <a-button type="link" @click="ship(record.id)">发货</a-button>
            </template>
          </a-table-column>
        </a-table>
        <p class="sheet">{{ sheetText }}</p>
      </a-card>
    </MerchantGate>
  </div>
</template>

<style scoped>
#merchant-order-page {
  max-width: 1080px;
  margin: 24px auto;
}
</style>
