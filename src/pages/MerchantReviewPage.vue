<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { listMerchantReview, replyReview } from '@/api/reviewController'
import MerchantGate from '@/components/MerchantGate.vue'
import MerchantNav from '@/components/MerchantNav.vue'

const rows = ref<API.ReviewVO[]>([])
const replies = ref<Record<string, string>>({})

async function load() {
  const response = await listMerchantReview({ current: 1, pageSize: 10 })
  if (response.data.code !== 0) {
    message.error(response.data.message || '评价加载失败')
    return
  }
  rows.value = response.data.data?.list ?? []
  for (const item of rows.value) {
    if (item.id) {
      replies.value[item.id] = item.replyContent || ''
    }
  }
}

async function reply(id?: string) {
  if (!id) {
    return
  }
  const response = await replyReview({ reviewId: id, content: replies.value[id] })
  if (response.data.code !== 0) {
    message.error(response.data.message || '回复失败')
    return
  }
  message.success('已回复')
  await load()
}

onMounted(load)
</script>

<template>
  <div id="merchant-review-page">
    <MerchantGate>
      <MerchantNav />
      <a-card title="评价回复">
        <a-table :data-source="rows" :pagination="false" row-key="id">
          <a-table-column title="评价" data-index="content" />
          <a-table-column title="评分" data-index="score" />
          <a-table-column title="回复">
            <template #default="{ record }">
              <a-input v-model:value="replies[record.id]" />
              <a-button type="link" @click="reply(record.id)">保存</a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-card>
    </MerchantGate>
  </div>
</template>

<style scoped>
#merchant-review-page {
  max-width: 960px;
  margin: 24px auto;
}
</style>
