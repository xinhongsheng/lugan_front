<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { adjustPresaleStock, listMerchantPresaleOrder, listMyPresale, shipMerchantPresale } from '@/api/merchantPortalController'
import MerchantGate from '@/components/MerchantGate.vue'
import MerchantNav from '@/components/MerchantNav.vue'

const activities = ref<API.PresaleActivityVO[]>([])
const orders = ref<API.PresaleOrderVO[]>([])
const stocks = ref<Record<string, number>>({})
const logistics = reactive<Record<string, string>>({})

async function load() {
  const activityResponse = await listMyPresale({ current: 1, pageSize: 10 })
  if (activityResponse.data.code !== 0) {
    message.error(activityResponse.data.message || '预售活动加载失败')
    return
  }
  activities.value = activityResponse.data.data?.list ?? []
  for (const item of activities.value) {
    if (item.id) {
      stocks.value[item.id] = item.totalStock ?? 0
    }
  }
  const orderResponse = await listMerchantPresaleOrder({ current: 1, pageSize: 10 })
  if (orderResponse.data.code !== 0) {
    message.error(orderResponse.data.message || '预售订单加载失败')
    return
  }
  orders.value = orderResponse.data.data?.list ?? []
}

async function saveStock(id?: string) {
  if (!id) {
    return
  }
  const response = await adjustPresaleStock({ id, totalStock: stocks.value[id] })
  if (response.data.code !== 0) {
    message.error(response.data.message || '限量更新失败')
    return
  }
  message.success('预售限量已更新')
  await load()
}

async function ship(id?: string) {
  if (!id) {
    return
  }
  const response = await shipMerchantPresale({ id, logisticsNo: logistics[id] })
  if (response.data.code !== 0) {
    message.error(response.data.message || '发货失败')
    return
  }
  message.success('已发货')
  await load()
}

onMounted(load)
</script>

<template>
  <div id="merchant-presale-page">
    <MerchantGate>
      <MerchantNav />
      <a-card title="预售限量">
        <a-table :data-source="activities" :pagination="false" row-key="id">
          <a-table-column title="标题" data-index="title" />
          <a-table-column title="已锁定" data-index="lockedStock" />
          <a-table-column title="已售" data-index="soldStock" />
          <a-table-column title="限量">
            <template #default="{ record }">
              <a-input-number v-model:value="stocks[record.id]" :min="0" />
              <a-button type="link" @click="saveStock(record.id)">保存</a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-card>
      <a-card title="预售发货" style="margin-top: 16px">
        <a-table :data-source="orders" :pagination="false" row-key="id">
          <a-table-column title="单号" data-index="orderNo" />
          <a-table-column title="状态" data-index="presaleStatus" />
          <a-table-column title="操作">
            <template #default="{ record }">
              <a-input v-model:value="logistics[record.id]" placeholder="物流单号" style="width: 140px" />
              <a-button type="link" @click="ship(record.id)">发货</a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-card>
    </MerchantGate>
  </div>
</template>

<style scoped>
#merchant-presale-page {
  max-width: 1080px;
  margin: 24px auto;
}
</style>
