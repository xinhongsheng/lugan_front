<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { addFreight, deleteFreight, listFreightVoByPage, updateFreight } from '@/api/freightController'

const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const open = ref(false)
const rows = ref<API.FreightRuleVO[]>([])
const total = ref(0)
const query = reactive<API.FreightQueryRequest>({ current: 1, pageSize: 10 })
const form = reactive<API.FreightSaveRequest>({
  ruleName: '',
  inProvinceFee: 8,
  outProvinceFee: 15,
  freeAmount: 99,
})

const columns: TableColumnType[] = [
  { title: '名称', dataIndex: 'ruleName' },
  { title: '省内运费', dataIndex: 'inProvinceFee', width: 120 },
  { title: '省外运费', dataIndex: 'outProvinceFee', width: 120 },
  { title: '满额包邮', dataIndex: 'freeAmount', width: 120 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 140 },
]

async function load() {
  loading.value = true
  try {
    const response = await listFreightVoByPage({
      current: query.current,
      pageSize: query.pageSize,
      ruleName: query.ruleName || undefined,
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '运费模板加载失败')
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

function openCreate() {
  form.id = undefined
  form.ruleName = ''
  form.inProvinceFee = 8
  form.outProvinceFee = 15
  form.freeAmount = 99
  open.value = true
}

function openEdit(record: API.FreightRuleVO) {
  form.id = record.id
  form.ruleName = record.ruleName
  form.inProvinceFee = record.inProvinceFee
  form.outProvinceFee = record.outProvinceFee
  form.freeAmount = record.freeAmount
  open.value = true
}

async function save() {
  saving.value = true
  try {
    const response = form.id ? await updateFreight(form) : await addFreight(form)
    if (response.data.code !== 0) {
      message.error(response.data.message || '保存失败')
      return
    }
    message.success('已保存')
    open.value = false
    await load()
  } finally {
    saving.value = false
  }
}

async function remove(id?: string) {
  if (!id) {
    return
  }
  const response = await deleteFreight({ id })
  if (response.data.code !== 0) {
    message.error(response.data.message || '删除失败')
    return
  }
  message.success('已删除')
  await load()
}

onMounted(load)
</script>

<template>
  <page-container title="运费模板">
    <template #extra>
      <a-space :size="4">
        <a-button type="link" @click="router.push('/admin/order')">订单</a-button>
        <a-button type="link" @click="router.push('/')">返回商城</a-button>
      </a-space>
    </template>
    <a-card :bordered="false" class="block">
      <a-form layout="inline" @finish="search">
        <a-form-item label="名称"><a-input v-model:value="query.ruleName" allow-clear /></a-form-item>
        <a-form-item><a-button type="primary" html-type="submit">查询</a-button></a-form-item>
      </a-form>
    </a-card>
    <a-card :bordered="false">
      <div class="toolbar"><a-button type="primary" @click="openCreate">新建</a-button></div>
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
          <template v-if="column.key === 'action'">
            <a-button type="link" size="small" @click="openEdit(record)">编辑</a-button>
            <a-popconfirm title="确认删除？订单没有保存模板编号，删除后只是不再使用。" @confirm="remove(record.id)">
              <a-button type="link" danger size="small">删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:open="open" :title="form.id ? '编辑运费模板' : '新建运费模板'" :confirm-loading="saving" @ok="save">
      <a-form layout="vertical">
        <a-form-item label="名称"><a-input v-model:value="form.ruleName" :maxlength="64" /></a-form-item>
        <a-form-item label="省内运费"><a-input-number v-model:value="form.inProvinceFee" :min="0" :precision="2" style="width: 160px" /></a-form-item>
        <a-form-item label="省外运费"><a-input-number v-model:value="form.outProvinceFee" :min="0" :precision="2" style="width: 160px" /></a-form-item>
        <a-form-item label="满额包邮">
          <a-input-number v-model:value="form.freeAmount" :min="0" :precision="2" style="width: 160px" />
          <div class="hint">填 0 表示不启用满额包邮。大于 0 时不能低于省内运费。</div>
        </a-form-item>
      </a-form>
    </a-modal>
  </page-container>
</template>

<style scoped>
.block {
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.hint {
  margin-top: 6px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
