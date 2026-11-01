<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { adminPage, adminPost } from '@/api/adminController'
import { AUDIT_STATUS_COLOR_MAP, AUDIT_STATUS_MAP, SHELF_STATUS_COLOR_MAP, SHELF_STATUS_MAP } from '@/constants/product'
import request from '@/request'
import { fileUrl } from '@/utils/fileUrl'
import { rawUploadFile } from '@/utils/rawUploadFile'

type Row = Record<string, unknown>

const router = useRouter()
const tab = ref('category')
const specTab = ref<'diameter' | 'weight'>('diameter')
const rows = ref<Row[]>([])
const parentRows = ref<Row[]>([])
const categoryRows = ref<Row[]>([])
const specRows = ref<Row[]>([])
const loading = ref(false)
const total = ref(0)
const current = ref(1)
const editOpen = ref(false)
const saving = ref(false)
const creatingProduct = ref(false)
const addingSpec = ref(false)
const savingSpec = ref(false)

const categoryForm = reactive({
  id: '',
  name: '',
  parentId: '0',
  sort: 0,
  publishStatus: 1,
})
const auditForm = reactive({ id: '', name: '', coverUrl: '', auditStatus: 'passed', auditNote: '' })
const productForm = reactive({
  categoryId: '',
  name: '',
  coverUrl: '',
  origin: '',
  specKind: 'weight' as 'diameter' | 'weight',
  specId: '',
  spec: '',
  price: 0,
  grade: '',
  fruitDiameter: '',
  netWeight: '',
  pickTime: '',
  freshNote: '',
  detailText: '',
  priceMode: 'pack',
  stock: 0,
  hotFlag: 0,
  newFlag: 1,
  directFlag: 0,
})
const specDraft = reactive({ specName: '', specValue: '' })
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
  const action = { title: '操作', key: 'action', width: 128, align: 'right' as const }
  if (tab.value === 'category') {
    return [
      { title: '分类', dataIndex: 'name', key: 'name', width: 180, ellipsis: true },
      { title: '上级', dataIndex: 'parentName', key: 'parentName', width: 140 },
      { title: '排序', dataIndex: 'sort', key: 'sort', width: 70 },
      { title: '展示', dataIndex: 'publishStatus', key: 'publishStatus', width: 90 },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
      action,
    ]
  }
  if (tab.value === 'productAudit') {
    return [
      { title: '封面', dataIndex: 'coverUrl', key: 'coverUrl', width: 72 },
      { title: '品名', dataIndex: 'name', key: 'name', width: 160, ellipsis: true },
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
    { title: '规格名', dataIndex: 'specName', key: 'specName', width: 180, ellipsis: true },
    { title: '规格值', dataIndex: 'specValue', key: 'specValue', width: 140, ellipsis: true },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 70 },
    { title: '启用', dataIndex: 'publishStatus', key: 'publishStatus', width: 90 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    action,
  ]
})

const actionText = computed(() => (tab.value === 'productAudit' ? '审核' : '编辑'))
const createText = computed(() => (tab.value === 'productAudit' ? '添加商品' : '新建'))

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
    specType: tab.value === 'spec' ? specTab.value : undefined,
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

async function loadCategories() {
  const response = await adminPage<Row>('/category/list/page/vo', { current: 1, pageSize: 200 })
  categoryRows.value = response.data.code === 0 ? response.data.data?.list ?? [] : []
}

async function loadSpecs(specType: 'diameter' | 'weight') {
  const response = await adminPage<Row>('/productSpec/list/page/vo', {
    current: 1,
    pageSize: 200,
    publishStatus: 1,
    specType,
  })
  specRows.value = response.data.code === 0 ? response.data.data?.list ?? [] : []
}

function onSpecKind() {
  productForm.specId = ''
  productForm.spec = ''
  productForm.fruitDiameter = ''
  productForm.netWeight = ''
  addingSpec.value = false
  loadSpecs(productForm.specKind)
}

function specLabel(row: Row) {
  const name = text(row, 'specName')
  const value = text(row, 'specValue')
  return value ? `${name}（${value}）` : name
}

function applySpec(id?: string) {
  if (!id) {
    productForm.specId = ''
    productForm.spec = ''
    return
  }
  const row = specRows.value.find((item) => text(item, 'id') === id)
  if (!row) {
    return
  }
  productForm.specId = id
  productForm.spec = text(row, 'specName')
  const value = text(row, 'specValue') || text(row, 'specName')
  if (text(row, 'specType') === 'diameter') {
    productForm.fruitDiameter = value
    return
  }
  productForm.netWeight = value
}

async function saveQuickSpec() {
  const specName = specDraft.specName.trim()
  if (!specName) {
    message.warning('请填写规格名称')
    return
  }
  savingSpec.value = true
  try {
    const response = await adminPost<string>('/productSpec/add', {
      specType: productForm.specKind,
      specName,
      specValue: specDraft.specValue.trim(),
      sort: 0,
      publishStatus: 1,
    })
    if (response.data.code !== 0 || !response.data.data) {
      message.error(response.data.message || '规格添加失败')
      return
    }
    await loadSpecs(productForm.specKind)
    applySpec(String(response.data.data))
    specDraft.specName = ''
    specDraft.specValue = ''
    addingSpec.value = false
    message.success('规格已加入规格管理')
  } finally {
    savingSpec.value = false
  }
}

function resetProductForm() {
  Object.assign(productForm, {
    categoryId: '',
    name: '',
    coverUrl: '',
    origin: '',
    specKind: 'weight',
    specId: '',
    spec: '',
    price: 0,
    grade: '',
    fruitDiameter: '',
    netWeight: '',
    pickTime: '',
    freshNote: '',
    detailText: '',
    priceMode: 'pack',
    stock: 0,
    hotFlag: 0,
    newFlag: 1,
    directFlag: 0,
  })
}

function search() {
  current.value = 1
  load()
}

function resetQuery() {
  query.keyword = ''
  query.publishStatus = ''
  query.parentId = ''
  query.auditStatus = ''
  query.shelfStatus = ''
  query.specType = ''
  search()
}

function changeTab(key: string) {
  tab.value = key
  current.value = 1
  load()
}

function changeSpecTab(key: string) {
  specTab.value = key === 'weight' ? 'weight' : 'diameter'
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
  creatingProduct.value = false
  if (tab.value === 'category') {
    Object.assign(categoryForm, { id: '', name: '', parentId: '0', sort: 0, publishStatus: 1 })
    loadParents()
  } else if (tab.value === 'productAudit') {
    creatingProduct.value = true
    addingSpec.value = false
    resetProductForm()
    loadCategories()
    loadSpecs(productForm.specKind)
  } else {
    Object.assign(specForm, { id: '', specType: specTab.value, specName: '', specValue: '', sort: 0, publishStatus: 1 })
  }
  editOpen.value = true
}

function openEdit(row: Row) {
  creatingProduct.value = false
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
    } else if (tab.value === 'productAudit' && creatingProduct.value) {
      if (!productForm.spec) {
        message.warning('请从规格管理中选择规格')
        return
      }
      ok = await run(
        '/product/add',
        {
          categoryId: productForm.categoryId || undefined,
          name: productForm.name,
          coverUrl: productForm.coverUrl,
          origin: productForm.origin,
          spec: productForm.spec,
          price: productForm.price,
          grade: productForm.grade,
          fruitDiameter: productForm.fruitDiameter,
          netWeight: productForm.netWeight,
          pickTime: productForm.pickTime,
          freshNote: productForm.freshNote,
          detailText: productForm.detailText,
          priceMode: productForm.priceMode,
          stock: productForm.stock,
          hotFlag: productForm.hotFlag,
          newFlag: productForm.newFlag,
          directFlag: productForm.directFlag,
        },
        '商品已添加，审核通过后上架',
      )
    } else if (tab.value === 'productAudit') {
      if (auditForm.coverUrl) {
        await run('/product/update', { id: auditForm.id, coverUrl: auditForm.coverUrl }, '封面已更新')
      }
      ok = await run('/product/audit', auditForm, auditForm.auditStatus === 'passed' ? '已通过并上架' : '已驳回并下架')
    } else {
      specForm.specType = specTab.value
      ok = await run(specForm.id ? '/productSpec/update' : '/productSpec/add', specForm, '规格已保存')
    }
    if (ok) {
      editOpen.value = false
    }
  } finally {
    saving.value = false
  }
}

async function onProductCover(info: { file?: File & { originFileObj?: File } }) {
  const file = rawUploadFile(info)
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
  const target = creatingProduct.value ? productForm : auditForm
  target.coverUrl = response.data.data || ''
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
      <a-space :size="4">
        <a-button type="link" @click="router.push('/admin')">基础系统</a-button>
        <a-button type="link" @click="router.push('/')">返回商城</a-button>
      </a-space>
    </template>

    <a-tabs v-if="tab === 'spec'" :active-key="specTab" class="spec-tabs" @change="(key: string) => changeSpecTab(key)">
      <a-tab-pane key="diameter" tab="果径" />
      <a-tab-pane key="weight" tab="重量" />
    </a-tabs>

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
        <a-form-item>
          <a-button type="primary" html-type="submit">查询</a-button>
          <a-button class="reset" @click="resetQuery">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card :bordered="false">
      <div class="toolbar">
        <a-button type="primary" @click="openCreate">{{ createText }}</a-button>
      </div>
      <a-table
        :columns="columns"
        :data-source="rows"
        :loading="loading"
        row-key="id"
        size="middle"
        table-layout="fixed"
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
          <template v-else-if="column.key === 'action'">
            <a-space :size="0" class="row-actions">
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
      :title="creatingProduct ? '添加商品' : tab === 'productAudit' ? '商品审核' : categoryForm.id || specForm.id ? '编辑' : '新建'"
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
      <a-form v-else-if="creatingProduct" layout="vertical">
        <a-form-item label="分类">
          <a-select v-model:value="productForm.categoryId" placeholder="选择分类">
            <a-select-option v-for="item in categoryRows" :key="text(item, 'id')" :value="text(item, 'id')">
              {{ text(item, 'parentName') ? `${text(item, 'parentName')} / ${text(item, 'name')}` : text(item, 'name') }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="品名"><a-input v-model:value="productForm.name" :maxlength="128" placeholder="如永春达埔精品芦柑" /></a-form-item>
        <a-form-item label="商品图片">
          <a-upload :show-upload-list="false" :before-upload="() => false" accept="image/*" @change="onProductCover">
            <a-button>上传图片</a-button>
          </a-upload>
          <div v-if="productForm.coverUrl" class="preview">
            <a-image :width="160" :src="fileUrl(productForm.coverUrl)" />
          </div>
        </a-form-item>
        <a-form-item label="产地"><a-input v-model:value="productForm.origin" :maxlength="64" placeholder="如永春达埔" /></a-form-item>
        <a-form-item label="规格类型">
          <a-radio-group v-model:value="productForm.specKind" @change="onSpecKind">
            <a-radio value="weight">重量</a-radio>
            <a-radio value="diameter">果径</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="productForm.specKind === 'diameter' ? '果径' : '重量'">
          <a-select
            v-model:value="productForm.specId"
            allow-clear
            :placeholder="productForm.specKind === 'diameter' ? '选择果径' : '选择重量'"
            @change="(value: string) => applySpec(value)"
          >
            <a-select-option v-for="item in specRows" :key="text(item, 'id')" :value="text(item, 'id')">
              {{ specLabel(item) }}
            </a-select-option>
          </a-select>
          <a-button type="link" class="spec-add-btn" @click="addingSpec = !addingSpec">
            {{ addingSpec ? '收起' : '没有合适的，新增规格' }}
          </a-button>
          <div v-if="addingSpec" class="spec-add">
            <a-input v-model:value="specDraft.specName" :maxlength="64" :placeholder="productForm.specKind === 'diameter' ? '规格名称，如 65mm 以上' : '规格名称，如 5斤装'" />
            <a-input v-model:value="specDraft.specValue" :maxlength="32" :placeholder="productForm.specKind === 'diameter' ? '规格值，如 65mm' : '规格值，如 5斤'" />
            <a-button type="primary" :loading="savingSpec" @click="saveQuickSpec">加入规格库</a-button>
          </div>
        </a-form-item>
        <a-form-item label="计价">
          <a-select v-model:value="productForm.priceMode">
            <a-select-option value="pack">按件</a-select-option>
            <a-select-option value="jin">按斤</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="售价"><a-input-number v-model:value="productForm.price" :min="0" :precision="2" style="width: 160px" /></a-form-item>
        <a-form-item label="库存"><a-input-number v-model:value="productForm.stock" :min="0" :max="100000" style="width: 160px" /></a-form-item>
        <a-form-item label="热门">
          <a-switch :checked="productForm.hotFlag === 1" @change="(checked: boolean) => (productForm.hotFlag = checked ? 1 : 0)" />
        </a-form-item>
        <a-form-item label="新品">
          <a-switch :checked="productForm.newFlag === 1" @change="(checked: boolean) => (productForm.newFlag = checked ? 1 : 0)" />
        </a-form-item>
        <a-form-item label="产地直供">
          <a-switch :checked="productForm.directFlag === 1" @change="(checked: boolean) => (productForm.directFlag = checked ? 1 : 0)" />
        </a-form-item>
        <a-form-item label="果径"><a-input v-model:value="productForm.fruitDiameter" placeholder="如 65mm 以上" /></a-form-item>
        <a-form-item label="净重"><a-input v-model:value="productForm.netWeight" placeholder="如 5斤" /></a-form-item>
        <a-form-item label="等级"><a-input v-model:value="productForm.grade" placeholder="如特级" /></a-form-item>
        <a-form-item label="详情"><a-textarea v-model:value="productForm.detailText" :rows="3" :maxlength="1000" /></a-form-item>
      </a-form>
      <a-form v-else-if="tab === 'productAudit'" layout="vertical">
        <a-form-item label="商品">{{ auditForm.name }}</a-form-item>
        <a-form-item label="商品图片">
          <a-upload :show-upload-list="false" :before-upload="() => false" accept="image/*" @change="onProductCover">
            <a-button>上传图片</a-button>
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
          <a-input :value="specTab === 'diameter' ? '果径' : '重量'" disabled />
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

.reset {
  margin-left: 8px;
}

.row-actions :deep(.ant-btn-link) {
  height: 24px;
  padding: 0 6px;
}

.preview {
  margin-top: 8px;
}

.spec-tabs {
  margin-bottom: 0;
}

.spec-tabs :deep(.ant-tabs-content) {
  display: none;
}

.spec-add-btn {
  padding-left: 0;
}

.spec-add {
  display: grid;
  gap: 8px;
  margin-top: 8px;
}
</style>
