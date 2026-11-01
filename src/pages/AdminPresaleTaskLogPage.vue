<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { listScheduleTaskLogVoByPage } from '@/api/scheduleTaskLogController'
import { TASK_STATUS_MAP } from '@/constants/presale'

const router = useRouter()
const loading = ref(false)
const rows = ref<API.ScheduleTaskLogVO[]>([])
const total = ref(0)
const query = reactive<API.ScheduleTaskLogQueryRequest>({ current: 1, pageSize: 10 })
const taskOptions = [
  { value: 'presale_deposit_timeout', label: '定金超时' },
  { value: 'presale_balance_timeout', label: '尾款超时' },
]
const statusOptions = Object.entries(TASK_STATUS_MAP).map(([value, label]) => ({ value, label }))
const columns: TableColumnType[] = [
  { title: '任务', key: 'taskCode', width: 140 },
  { title: '预售单', dataIndex: 'bizId', width: 200 },
  { title: '状态', key: 'runStatus', width: 100 },
  { title: '说明', dataIndex: 'resultMessage' },
  { title: '执行时间', dataIndex: 'runTime', width: 180 },
]

async function load() {
  loading.value = true
  try {
    const response = await listScheduleTaskLogVoByPage({
      current: query.current,
      pageSize: query.pageSize,
      taskCode: query.taskCode || undefined,
      runStatus: query.runStatus || undefined,
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '日志加载失败')
      return
    }
    rows.value = response.data.data?.list ?? []
    total.value = Number(response.data.data?.total ?? 0)
  } finally {
    loading.value = false
  }
}

function search() {
  query.current = 1
  load()
}

function onTableChange(pagination: { current?: number }) {
  query.current = pagination.current || 1
  load()
}

function taskText(code?: string) {
  return taskOptions.find((item) => item.value === code)?.label || code
}

onMounted(load)
</script>

<template>
  <page-container title="预售关单日志">
    <template #extra>
      <a-button type="link" @click="router.push('/admin/presale-order')">预售订单</a-button>
    </template>
    <a-card :bordered="false" class="block">
      <a-form layout="inline" @finish="search">
        <a-form-item label="任务">
          <a-select v-model:value="query.taskCode" allow-clear style="width: 140px" :options="taskOptions" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="query.runStatus" allow-clear style="width: 120px" :options="statusOptions" />
        </a-form-item>
        <a-form-item><a-button type="primary" html-type="submit">查询</a-button></a-form-item>
      </a-form>
    </a-card>
    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data-source="rows"
        :loading="loading"
        row-key="id"
        size="middle"
        :pagination="{ current: query.current, pageSize: query.pageSize, total, showTotal: (count: number) => `共 ${count} 条` }"
        @change="onTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'taskCode'">{{ taskText(record.taskCode) }}</template>
          <template v-else-if="column.key === 'runStatus'">{{ TASK_STATUS_MAP[record.runStatus || ''] || record.runStatus }}</template>
        </template>
      </a-table>
    </a-card>
  </page-container>
</template>

<style scoped>
.block {
  margin-bottom: 16px;
}
</style>
