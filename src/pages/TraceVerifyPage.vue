<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import request from '@/request'
import { fileUrl } from '@/utils/fileUrl'
import { TRACE_NODE_MAP, TRACE_REASON_MAP, TRACE_RESULT_MAP } from '@/constants/trace'

type NodeRow = {
  seq?: number
  nodeName?: string
  operateTime?: string
  note?: string
  evidenceUrl?: string
}

type VerifyData = {
  result?: string
  resultReason?: string
  brokenSeq?: number
  missing?: string[]
  orderBroken?: boolean
  traceCode?: string
  skuName?: string
  originAreaName?: string
  giMark?: boolean
  scanCount?: number
  maxScanCount?: number
  nodes?: NodeRow[]
}

const route = useRoute()
const loading = ref(false)
const data = ref<VerifyData>({})
const code = computed(() => String(route.params.code || ''))

const title = computed(() => TRACE_RESULT_MAP[data.value.result as keyof typeof TRACE_RESULT_MAP] || '溯源码无效')
const reason = computed(() => TRACE_REASON_MAP[data.value.resultReason || ''] || data.value.resultReason || '')

function nodeLabel(code: string) {
  return TRACE_NODE_MAP[code as keyof typeof TRACE_NODE_MAP] || code
}

async function load() {
  if (!code.value) {
    return
  }
  loading.value = true
  try {
    const response = await request<{ code?: number; data?: VerifyData }>('/trace/verify', {
      method: 'GET',
      params: { code: code.value },
    })
    data.value = response.data.code === 0 && response.data.data ? response.data.data : {}
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(code, load)
</script>

<template>
  <div id="trace-verify" class="page">
    <header v-if="data.giMark" class="mark">
      <span>国家地理标志</span>
      <strong>永春芦柑</strong>
    </header>
    <a-card :loading="loading" :bordered="false">
      <p class="code">{{ data.traceCode || code }}</p>
      <h1>{{ title }}</h1>
      <p class="reason">{{ reason }}</p>
      <p v-if="data.brokenSeq" class="reason">第 {{ data.brokenSeq }} 条记录起哈希不一致</p>
      <p v-if="data.orderBroken" class="reason">节点顺序不正确</p>
      <p v-if="data.missing?.length" class="reason">缺少：{{ data.missing.map(nodeLabel).join('、') }}</p>
      <dl class="meta">
        <div><dt>规格</dt><dd>{{ data.skuName || '—' }}</dd></div>
        <div><dt>产区</dt><dd>{{ data.originAreaName || '—' }}</dd></div>
        <div><dt>已验真</dt><dd>{{ data.scanCount ?? 0 }} / {{ data.maxScanCount ?? '—' }}</dd></div>
      </dl>
      <ol class="timeline">
        <li v-for="node in data.nodes || []" :key="node.seq">
          <b>{{ node.nodeName }}</b>
          <span>{{ node.operateTime }}</span>
          <p>{{ node.note }}</p>
          <img v-if="node.evidenceUrl" :src="fileUrl(node.evidenceUrl)" alt="" />
        </li>
      </ol>
    </a-card>
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 24px auto;
  padding: 0 16px 48px;
}

.mark {
  display: flex;
  gap: 12px;
  align-items: baseline;
  margin-bottom: 16px;
  color: #8c4a16;
}

.mark strong {
  font-size: 28px;
}

.code {
  color: rgba(0, 0, 0, 0.45);
}

h1 {
  margin: 0 0 8px;
}

.reason {
  margin: 0 0 8px;
}

.meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 16px 0;
}

.meta dt {
  color: rgba(0, 0, 0, 0.45);
}

.timeline {
  margin: 0;
  padding-left: 18px;
}

.timeline li {
  margin-bottom: 16px;
}

.timeline span {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.45);
}

.timeline img {
  display: block;
  max-width: 240px;
  margin-top: 8px;
}
</style>
