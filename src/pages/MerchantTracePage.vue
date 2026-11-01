<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { listMyProduct } from '@/api/productController'
import { listMySkus } from '@/api/productController'
import {
  addMyTraceBatch,
  addMyTraceCode,
  appendMyTraceNode,
  listMyTraceBatch,
  submitTraceBatch,
} from '@/api/merchantPortalController'
import MerchantGate from '@/components/MerchantGate.vue'
import MerchantNav from '@/components/MerchantNav.vue'

const products = ref<API.Product[]>([])
const skus = ref<API.MerchantSkuVO[]>([])
const rows = ref<API.TraceBatch[]>([])
const form = reactive<API.TraceBatch>({
  productId: undefined,
  batchNo: '',
  originPlace: '永春达埔',
  originAreaCode: 'DAPU',
  pickDate: '',
})
const codeForm = reactive({ batchId: '', skuId: '', quantity: 1, note: '采摘完成' })

async function load() {
  const productResponse = await listMyProduct({ current: 1, pageSize: 20 })
  products.value = productResponse.data.data?.list ?? []
  const skuResponse = await listMySkus()
  skus.value = skuResponse.data.data ?? []
  const response = await listMyTraceBatch({ current: 1, pageSize: 10 })
  if (response.data.code !== 0) {
    message.error(response.data.message || '批次加载失败')
    return
  }
  rows.value = response.data.data?.list ?? []
}

async function createBatch() {
  const response = await addMyTraceBatch(form)
  if (response.data.code !== 0) {
    message.error(response.data.message || '建档失败')
    return
  }
  message.success('草稿批次已创建')
  await load()
}

async function makeCode() {
  const response = await addMyTraceCode(codeForm)
  if (response.data.code !== 0) {
    message.error(response.data.message || '生成溯源码失败')
    return
  }
  message.success('已生成溯源码')
}

async function append(nodeType: string) {
  const response = await appendMyTraceNode({ batchId: codeForm.batchId, nodeType, note: codeForm.note })
  if (response.data.code !== 0) {
    message.error(response.data.message || '追加节点失败')
    return
  }
  message.success('节点已追加')
}

async function submit(id?: string) {
  const response = await submitTraceBatch({ id })
  if (response.data.code !== 0) {
    message.error(response.data.message || '提交失败')
    return
  }
  message.success('已提交审核')
  await load()
}

onMounted(load)
</script>

<template>
  <div id="merchant-trace-page">
    <MerchantGate>
      <MerchantNav />
      <a-card title="新建采摘批次">
        <a-form layout="inline">
          <a-form-item label="商品">
            <a-select v-model:value="form.productId" style="width: 180px">
              <a-select-option v-for="item in products" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="批次号"><a-input v-model:value="form.batchNo" /></a-form-item>
          <a-form-item label="产地"><a-input v-model:value="form.originPlace" /></a-form-item>
          <a-form-item label="采摘日"><a-input v-model:value="form.pickDate" placeholder="2026-11-10" /></a-form-item>
          <a-button type="primary" @click="createBatch">建档</a-button>
        </a-form>
      </a-card>
      <a-card title="生成码并追加节点" style="margin-top: 16px">
        <a-form layout="inline">
          <a-form-item label="批次">
            <a-select v-model:value="codeForm.batchId" style="width: 180px">
              <a-select-option v-for="item in rows" :key="item.id" :value="item.id">{{ item.batchNo }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="规格">
            <a-select v-model:value="codeForm.skuId" style="width: 180px">
              <a-select-option v-for="item in skus" :key="item.id" :value="item.id">{{ item.productName }} {{ item.skuName }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="说明"><a-input v-model:value="codeForm.note" /></a-form-item>
          <a-button @click="makeCode">生成溯源码</a-button>
          <a-button @click="append('pick')">采摘</a-button>
          <a-button @click="append('inspect')">质检</a-button>
          <a-button @click="append('inbound')">入库</a-button>
        </a-form>
      </a-card>
      <a-card title="我的批次" style="margin-top: 16px">
        <a-table :data-source="rows" :pagination="false" row-key="id">
          <a-table-column title="批次号" data-index="batchNo" />
          <a-table-column title="审核" data-index="auditStatus" />
          <a-table-column title="操作">
            <template #default="{ record }">
              <a-button type="link" @click="submit(record.id)">提交审核</a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-card>
    </MerchantGate>
  </div>
</template>

<style scoped>
#merchant-trace-page {
  max-width: 1080px;
  margin: 24px auto;
}
</style>
