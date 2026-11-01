<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { handleRefund, listMerchantRefund } from '@/api/refundController'
import MerchantGate from '@/components/MerchantGate.vue'
import MerchantNav from '@/components/MerchantNav.vue'

const rows = ref<API.RefundOrderVO[]>([])
const remark = ref('同意退款')

async function load() {
  const response = await listMerchantRefund({ current: 1, pageSize: 10 })
  if (response.data.code !== 0) {
    message.error(response.data.message || '退款单加载失败')
    return
  }
  rows.value = response.data.data?.list ?? []
}

async function handle(id?: string, pass?: boolean) {
  const response = await handleRefund({ refundId: id, pass, auditRemark: remark.value })
  if (response.data.code !== 0) {
    message.error(response.data.message || '处理失败')
    return
  }
  message.success('已处理')
  await load()
}

onMounted(load)
</script>

<template>
  <div id="merchant-refund-page">
    <MerchantGate>
      <MerchantNav />
      <a-card title="退款处理">
        <a-input v-model:value="remark" placeholder="处理原因" />
        <a-table :data-source="rows" :pagination="false" row-key="id">
          <a-table-column title="退款单号" data-index="refundNo" />
          <a-table-column title="金额" data-index="refundAmount" />
          <a-table-column title="状态" data-index="refundStatus" />
          <a-table-column title="操作">
            <template #default="{ record }">
              <a-button type="link" @click="handle(record.id, true)">同意</a-button>
              <a-button type="link" @click="handle(record.id, false)">拒绝</a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-card>
    </MerchantGate>
  </div>
</template>

<style scoped>
#merchant-refund-page {
  max-width: 960px;
  margin: 24px auto;
}
</style>
