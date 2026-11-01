<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { adminPage, adminPost } from '@/api/adminController'
import { AUDIT_STATUS_COLOR_MAP, AUDIT_STATUS_MAP, SHELF_STATUS_COLOR_MAP, SHELF_STATUS_MAP } from '@/constants/product'
import { SPEC_TYPE_COLOR_MAP, SPEC_TYPE_MAP } from '@/constants/productSpec'
import request from '@/request'
import { fileUrl } from '@/utils/fileUrl'

type Row = Record<string, unknown>

const tab = ref('category')
const rows = ref<Row[]>([])
const parentRows = ref<Row[]>([])
const loading = ref(false)
const total = ref(0)
const current = ref(1)
const editOpen = ref(false)
const saving = ref(false)

const categoryForm = reactive({
  id: '',
  name: '',
  parentId: '0',
  sort: 0,
  publishStatus: 1,
})
const auditForm = reactive({ id: '', name: '', coverUrl: '', auditStatus: 'passed', auditNote: '' })
const specForm = reactive({
  id: '',
  specType: 'diameter',
  specName: '',
  specValue: '',
  sort: 0,
  publishStatus: 1,
})
const query = reactive({
  keyword: '',
  publishStatus: '' as '' | number,
  parentId: '',
  auditStatus: '',
  shelfStatus: '' as '' | number,
  specType: '',
})

const tabs = [
  { key: 'category', tab: '商品分类' },
  { key: 'productAudit', tab: '商品审核' },
  { key: 'spec', tab: '规格管理' },
]

const columns = computed<TableColumnType[]>(() => {
  const action = { title: '操作', key: 'action', width: 160, fixed: 'right' as const }
  if (tab.value === 'category') {
    return [
      { title: '分类', dataIndex: 'name', key: 'name' },
      { title: '上级', dataIndex: 'parentName', key: 'parentName', width: 140 },
      { title: '排序', dataIndex: 'sort', key: 'sort', width: 70 },
      { title: '展示', dataIndex: 'publishStatus', key: 'publishStatus', width: 90 },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
      action,
    ]
  }
  if (tab.value === 'productAudit') {
    return [
      { title: '封面', dataIndex: 'coverUrl', key: 'coverUrl', width: 80 },
      { title: '品名', dataIndex: 'name', key: 'name' },
      { title: '产地', dataIndex: 'origin', key: 'origin', width: 120 },
      { title: '规格', dataIndex: 'spec', key: 'spec', width: 100 },
      { title: '果径', dataIndex: 'fruitDiameter', key: 'fruitDiameter', width: 110 },
      { title: '净重', dataIndex: 'netWeight', key: 'netWeight', width: 100 },
      { title: '售价', dataIndex: 'price', key: 'price', width: 90 },
      { title: '审核', dataIndex: 'auditStatus', key: 'auditStatus', width: 100 },
      { title: '上架', dataIndex: 'shelfStatus', key: 'shelfStatus', width: 80 },
      { title: '审核说明', dataIndex: 'auditNote', key: 'auditNote', ellipsis: true },
      action,
    ]
  }
  return [
    { title: '类型', dataIndex: 'specType', key: 'specType', width: 120 },
    { title: '规格名', dataIndex: 'specName', key: 'specName' },
    { title: '规格值', dataIndex: 'specValue', key: 'specValue', width: 120 },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 70 },
    { title: '启用', dataIndex: 'publishStatus', key: 'publishStatus', width: 90 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    action,
  ]
})

const canCreate = computed(() => tab.value !== 'productAudit')
const actionText = computed(() => (tab.value === 'productAudit' ? '审核' : '编辑'))

function text(row: Row, key: string) {
  const value = row[key]
  return value === undefined || value === null ? '' : String(value)
}

function imageUrl(path: unknown) {
  return fileUrl(path)
}

function searchBody() {
  return {
    current: current.value,
    pageSize: 20,
    keyword: query.keyword || undefined,
    publishStatus:
      (tab.value === 'category' || tab.value === 'spec') && query.publishStatus !== ''
        ? query.publishStatus
        : undefined,
    parentId: tab.value === 'category' && query.parentId ? query.parentId : undefined,
    auditStatus: tab.value === 'productAudit' ? query.auditStatus || undefined : undefined,
    shelfStatus: tab.value === 'productAudit' && query.shelfStatus !== '' ? query.shelfStatus : undefined,
    specType: tab.value === 'spec' ? query.specType || undefined : undefined,
  }
}

const urlMap: Record<string, string> = {
  category: '/category/list/page/vo',
  productAudit: '/product/audit/list/page/vo',
  spec: '/productSpec/list/page/vo',
}

async function load() {
  loading.value = true
  try {
    const response = await adminPage<Row>(urlMap[tab.value], searchBody())
    if (response.data.code !== 0) {
      message.error(response.data.message || '加载失败')
      rows.value = []
      total.value = 0
      return
    }
    rows.value = response.data.data?.list ?? []
    total.value = Number(response.data.data?.total ?? 0)
  } finally {
    loading.value = false
  }
}

async function loadParents() {
  const response = await adminPage<Row>('/category/list/page/vo', { current: 1, pageSize: 200, parentId: 0 })
  parentRows.value = response.data.code === 0 ? response.data.data?.list ?? [] : []
}

function search() {
  current.value = 1
  load()
}

function changeTab(key: string) {
  tab.value = key
  current.value = 1
  load()
}

function onTableChange(page: { current?: number }) {
  current.value = page.current || 1
  load()
}

async function run(url: string, body: unknown, ok: string) {
  const response = await adminPost(url, body)
  if (response.data.code !== 0) {
    message.error(response.data.message || '操作失败')
    return false
  }
  message.success(ok)
  await load()
  return true
}

function openCreate() {
  if (tab.value === 'category') {
    Object.assign(categoryForm, { id: '', name: '', parentId: '0', sort: 0, publishStatus: 1 })
    loadParents()
  } else {
    Object.assign(specForm, { id: '', specType: 'diameter', specName: '', specValue: '', sort: 0, publishStatus: 1 })
  }
  editOpen.value = true
}

function openEdit(row: Row) {
  if (tab.value === 'category') {
    Object.assign(categoryForm, {
      id: text(row, 'id'),
      name: text(row, 'name'),
      parentId: text(row, 'parentId') || '0',
      sort: Number(text(row, 'sort') || 0),
      publishStatus: Number(text(row, 'publishStatus') || 0),
    })
    loadParents()
  } else if (tab.value === 'productAudit') {
    Object.assign(auditForm, {
      id: text(row, 'id'),
      name: text(row, 'name'),
      coverUrl: text(row, 'coverUrl'),
      auditStatus: text(row, 'auditStatus') === 'rejected' ? 'rejected' : 'passed',
      auditNote: text(row, 'auditNote'),
    })
  } else {
    Object.assign(specForm, {
      id: text(row, 'id'),
      specType: text(row, 'specType') || 'diameter',
      specName: text(row, 'specName'),
      specValue: text(row, 'specValue'),
      sort: Number(text(row, 'sort') || 0),
      publishStatus: Number(text(row, 'publishStatus') || 0),
    })
  }
  editOpen.value = true
}

async function saveEdit() {
  saving.value = true
  try {
    let ok = false
    if (tab.value === 'category') {
      const body = { ...categoryForm, parentId: categoryForm.parentId === '0' ? 0 : categoryForm.parentId }
      ok = await run(categoryForm.id ? '/category/update' : '/category/add', body, '分类已保存')
    } else if (tab.value === 'productAudit') {
      if (auditForm.coverUrl) {
        await run('/product/update', { id: auditForm.id, coverUrl: auditForm.coverUrl }, '封面已更新')
      }
      ok = await run('/product/audit', auditForm, auditForm.auditStatus === 'passed' ? '已通过并上架' : '已驳回并下架')
    } else {
      ok = await run(specForm.id ? '/productSpec/update' : '/productSpec/add', specForm, '规格已保存')
    }
    if (ok) {
      editOpen.value = false
    }
  } finally {
    saving.value = false
  }
}

async function onProductCover(info: { file?: { originFileObj?: File } }) {
  const file = info.file?.originFileObj
  if (!file) {
    return
  }
  const form = new FormData()
  form.append('file', file)
  const response = await request<{ code?: number; data?: string; message?: string }>(
    '/system/file/upload?folder=product',
    {
      method: 'POST',
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  if (response.data.code !== 0) {
    message.error(response.data.message || '上传失败')
    return
  }
  auditForm.coverUrl = response.data.data || ''
  message.success('商品图片已上传')
}

async function removeRow(row: Row) {
  const id = text(row, 'id')
  if (tab.value === 'productAudit') {
    await run('/product/audit', { id, auditStatus: 'rejected', auditNote: '不合规，已驳回' }, '已驳回并下架')
    return
  }
  const url = tab.value === 'category' ? '/category/delete' : '/productSpec/delete'
  await run(url, { id }, '已删除')
}

onMounted(async () => {
  await loadParents()
  await load()
})
</script>

<template>
  <page-container
    title="商品类目与审核管理"
    :tab-list="tabs"
    :tab-active-key="tab"
    @tab-change="changeTab"
  >
    <template #extra>
      <router-link to="/admin">基础系统</router-link>
      <router-link to="/">返回商城</router-link>
    </template>

    <a-card :bordered="false" class="block">
      <a-form layout="inline" @finish="search">
        <a-form-item label="关键字">
          <a-input v-model:value="query.keyword" allow-clear placeholder="分类、品名、规格或产地" />
        </a-form-item>
        <a-form-item v-if="tab === 'category'" label="上级">
          <a-select v-model:value="query.parentId" allow-clear placeholder="全部" style="width: 160px">
            <a-select-option value="0">一级分类</a-select-option>
            <a-select-option v-for="item in parentRows" :key="text(item, 'id')" :value="text(item, 'id')">
              {{ text(item, 'name') }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="tab === 'category' || tab === 'spec'" label="展示">
          <a-select v-model:value="query.publishStatus" allow-clear placeholder="全部" style="width: 120px">
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">停用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="tab === 'productAudit'" label="审核">
          <a-select v-model:value="query.auditStatus" allow-clear placeholder="全部" style="width: 120px">
            <a-select-option value="pending">待审核</a-select-option>
            <a-select-option value="passed">已通过</a-select-option>
            <a-select-option value="rejected">已驳回</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="tab === 'productAudit'" label="上架">
          <a-select v-model:value="query.shelfStatus" allow-clear placeholder="全部" style="width: 120px">
            <a-select-option :value="1">上架</a-select-option>
            <a-select-option :value="0">下架</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="tab === 'spec'" label="类型">
          <a-select v-model:value="query.specType" allow-clear placeholder="全部" style="width: 140px">
            <a-select-option value="diameter">果径</a-select-option>
            <a-select-option value="weight">重量包装</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">查询</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card :bordered="false">
      <div class="toolbar">
        <a-button v-if="canCreate" type="primary" @click="openCreate">新建</a-button>
      </div>
      <a-table
        :columns="columns"
        :data-source="rows"
        :loading="loading"
        row-key="id"
        :scroll="{ x: 960 }"
        :pagination="{ current, pageSize: 20, total, showTotal: (count: number) => `共 ${count} 条` }"
        @change="onTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'coverUrl'">
            <a-image v-if="text(record, 'coverUrl')" :width="56" :src="imageUrl(record.coverUrl)" />
            <span v-else>无图</span>
          </template>
          <template v-else-if="column.key === 'parentName'">
            {{ text(record, 'parentName') || '一级分类' }}
          </template>
          <template v-else-if="column.key === 'publishStatus'">
            <a-tag :color="String(record.publishStatus) === '1' ? 'green' : 'default'">
              {{ String(record.publishStatus) === '1' ? '启用' : '停用' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'auditStatus'">
            <a-tag :color="AUDIT_STATUS_COLOR_MAP[text(record, 'auditStatus') as keyof typeof AUDIT_STATUS_MAP] || 'default'">
              {{ AUDIT_STATUS_MAP[text(record, 'auditStatus') as keyof typeof AUDIT_STATUS_MAP] || text(record, 'auditStatus') }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'shelfStatus'">
            <a-tag :color="SHELF_STATUS_COLOR_MAP[Number(record.shelfStatus) as 0 | 1] || 'default'">
              {{ SHELF_STATUS_MAP[Number(record.shelfStatus) as 0 | 1] || text(record, 'shelfStatus') }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'specType'">
            <a-tag :color="SPEC_TYPE_COLOR_MAP[text(record, 'specType') as keyof typeof SPEC_TYPE_MAP] || 'default'">
              {{ SPEC_TYPE_MAP[text(record, 'specType') as keyof typeof SPEC_TYPE_MAP] || text(record, 'specType') }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="openEdit(record)">{{ actionText }}</a-button>
              <a-popconfirm
                :title="tab === 'productAudit' ? '确认驳回该商品？' : '确认删除？'"
                @confirm="removeRow(record)"
              >
                <a-button type="link" danger size="small">
                  {{ tab === 'productAudit' ? '驳回' : '删除' }}
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="editOpen"
      :title="tab === 'productAudit' ? '商品审核' : categoryForm.id || specForm.id ? '编辑' : '新建'"
      :confirm-loading="saving"
      @ok="saveEdit"
    >
      <a-form v-if="tab === 'category'" layout="vertical">
        <a-form-item label="分类名称"><a-input v-model:value="categoryForm.name" placeholder="如芦柑主类、礼盒类、副产品" /></a-form-item>
        <a-form-item label="上级分类">
          <a-select v-model:value="categoryForm.parentId">
            <a-select-option value="0">一级分类</a-select-option>
            <a-select-option
              v-for="item in parentRows.filter((row) => text(row, 'id') !== categoryForm.id)"
              :key="text(item, 'id')"
              :value="text(item, 'id')"
            >
              {{ text(item, 'name') }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="排序"><a-input-number v-model:value="categoryForm.sort" :min="0" /></a-form-item>
        <a-form-item label="展示">
          <a-switch :checked="categoryForm.publishStatus === 1" @change="(checked: boolean) => (categoryForm.publishStatus = checked ? 1 : 0)" />
        </a-form-item>
      </a-form>
      <a-form v-else-if="tab === 'productAudit'" layout="vertical">
        <a-form-item label="商品">{{ auditForm.name }}</a-form-item>
        <a-form-item label="商品图片">
          <a-upload :show-upload-list="false" :before-upload="() => false" accept="image/*" @change="onProductCover">
            <a-button>上传到 MinIO</a-button>
          </a-upload>
          <div v-if="auditForm.coverUrl" class="preview">
            <a-image :width="160" :src="fileUrl(auditForm.coverUrl)" />
          </div>
        </a-form-item>
        <a-form-item label="审核结论">
          <a-select v-model:value="auditForm.auditStatus">
            <a-select-option value="passed">通过并上架</a-select-option>
            <a-select-option value="rejected">驳回并下架</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="审核说明"><a-textarea v-model:value="auditForm.auditNote" :rows="3" placeholder="驳回时请写明不合规原因" /></a-form-item>
      </a-form>
      <a-form v-else layout="vertical">
        <a-form-item label="规格类型">
          <a-select v-model:value="specForm.specType">
            <a-select-option value="diameter">果径</a-select-option>
            <a-select-option value="weight">重量包装</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="规格名称"><a-input v-model:value="specForm.specName" placeholder="如 65mm 以上、5斤装" /></a-form-item>
        <a-form-item label="规格值"><a-input v-model:value="specForm.specValue" placeholder="如 65mm、5斤" /></a-form-item>
        <a-form-item label="排序"><a-input-number v-model:value="specForm.sort" :min="0" /></a-form-item>
        <a-form-item label="启用">
          <a-switch :checked="specForm.publishStatus === 1" @change="(checked: boolean) => (specForm.publishStatus = checked ? 1 : 0)" />
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

.preview {
  margin-top: 8px;
}
</style>
