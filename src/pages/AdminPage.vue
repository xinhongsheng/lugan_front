<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { adminPage, adminPost } from '@/api/adminController'
import { getLoginUser } from '@/api/userController'
import request from '@/request'
import { fileUrl } from '@/utils/fileUrl'
import { rawUploadFile } from '@/utils/rawUploadFile'

type Row = Record<string, unknown>

const router = useRouter()
const role = ref('')
const loginUserId = ref('')
const tab = ref('user')
const rows = ref<Row[]>([])
const loading = ref(false)
const total = ref(0)
const current = ref(1)
const editOpen = ref(false)
const saving = ref(false)
const isAdmin = computed(() => role.value === 'admin')

const userForm = reactive({
  id: '',
  userAccount: '',
  userName: '',
  userAvatar: '',
  userPhone: '',
  userStatus: 0,
  userRole: 'user',
})
const merchantForm = reactive({
  id: '',
  shopName: '',
  licenseNo: '',
  originProof: '',
  auditStatus: 'pending',
  auditNote: '',
  shopStatus: 0,
})
const bannerForm = reactive({ id: '', title: '', imageUrl: '', linkUrl: '', sort: 0, publishStatus: 1 })
const articleForm = reactive({
  id: '',
  title: '',
  articleType: 'notice',
  coverUrl: '',
  summary: '',
  content: '',
  sort: 0,
  publishStatus: 1,
})
const dictForm = reactive({ id: '', dictCode: '', itemName: '', itemValue: '', sort: 0 })
const query = reactive({
  keyword: '',
  userRole: '',
  userStatus: '' as '' | number,
  auditStatus: '',
  shopStatus: '' as '' | number,
  articleType: '',
  publishStatus: '' as '' | number,
  dictCode: '',
  successFlag: '' as '' | number,
})

const ROLE_NAME: Record<string, string> = { user: '普通用户', operator: '运营人员', admin: '管理员' }
const AUDIT_NAME: Record<string, string> = { pending: '待审核', passed: '已通过', rejected: '已驳回' }
const ARTICLE_NAME: Record<string, string> = { notice: '公告', news: '资讯', origin: '产地介绍' }

const tabs = computed(() => {
  const content = [
    { key: 'banner', tab: '轮播图' },
    { key: 'article', tab: '公告资讯' },
    { key: 'dict', tab: '数据字典' },
    { key: 'file', tab: '文件上传' },
  ]
  if (!isAdmin.value) {
    return content
  }
  return [
    { key: 'user', tab: '用户管理' },
    { key: 'merchant', tab: '商家管理' },
    ...content,
    { key: 'log', tab: '操作日志' },
  ]
})

const columns = computed<TableColumnType[]>(() => {
  const action = { title: '操作', key: 'action', width: 120, align: 'right' as const }
  if (tab.value === 'user') {
    return [
      { title: '头像', dataIndex: 'userAvatar', key: 'userAvatar', width: 64 },
      { title: '昵称', dataIndex: 'userName', key: 'userName', width: 120, ellipsis: true },
      { title: '账号', dataIndex: 'userAccount', key: 'userAccount', width: 120, ellipsis: true },
      { title: '手机号', dataIndex: 'userPhone', key: 'userPhone', width: 130 },
      { title: '角色', dataIndex: 'userRole', key: 'userRole', width: 110 },
      { title: '状态', dataIndex: 'userStatus', key: 'userStatus', width: 90 },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
      action,
    ]
  }
  if (tab.value === 'merchant') {
    return [
      { title: '店铺', dataIndex: 'shopName', key: 'shopName', width: 140, ellipsis: true },
      { title: '申请人', dataIndex: 'userName', key: 'userName', width: 100, ellipsis: true },
      { title: '账号', dataIndex: 'userAccount', key: 'userAccount', width: 120, ellipsis: true },
      { title: '手机号', dataIndex: 'userPhone', key: 'userPhone', width: 130 },
      { title: '执照号', dataIndex: 'licenseNo', key: 'licenseNo', width: 140, ellipsis: true },
      { title: '产地证明', dataIndex: 'originProof', key: 'originProof', ellipsis: true },
      { title: '审核', dataIndex: 'auditStatus', key: 'auditStatus', width: 100 },
      { title: '店铺', dataIndex: 'shopStatus', key: 'shopStatus', width: 80 },
      { title: '申请时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
      action,
    ]
  }
  if (tab.value === 'banner') {
    return [
      { title: '图片', dataIndex: 'imageUrl', key: 'imageUrl', width: 88 },
      { title: '标题', dataIndex: 'title', key: 'title', width: 180, ellipsis: true },
      { title: '链接', dataIndex: 'linkUrl', key: 'linkUrl', width: 160, ellipsis: true },
      { title: '排序', dataIndex: 'sort', key: 'sort', width: 70 },
      { title: '发布', dataIndex: 'publishStatus', key: 'publishStatus', width: 90 },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
      action,
    ]
  }
  if (tab.value === 'article') {
    return [
      { title: '标题', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
      { title: '类型', dataIndex: 'articleType', key: 'articleType', width: 110 },
      { title: '摘要', dataIndex: 'summary', key: 'summary', ellipsis: true },
      { title: '发布', dataIndex: 'publishStatus', key: 'publishStatus', width: 90 },
      { title: '排序', dataIndex: 'sort', key: 'sort', width: 70 },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
      action,
    ]
  }
  if (tab.value === 'dict') {
    return [
      { title: '字典编码', dataIndex: 'dictCode', key: 'dictCode', width: 140, ellipsis: true },
      { title: '名称', dataIndex: 'itemName', key: 'itemName', width: 140, ellipsis: true },
      { title: '值', dataIndex: 'itemValue', key: 'itemValue', width: 160, ellipsis: true },
      { title: '排序', dataIndex: 'sort', key: 'sort', width: 70 },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
      action,
    ]
  }
  if (tab.value === 'file') {
    return [
      { title: '预览', dataIndex: 'fileUrl', key: 'fileUrl', width: 88 },
      { title: '文件名', dataIndex: 'fileName', key: 'fileName', width: 180, ellipsis: true },
      { title: '路径', dataIndex: 'fileUrlText', key: 'fileUrlText', ellipsis: true },
      { title: '上传时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
      action,
    ]
  }
  return [
    { title: '账号', dataIndex: 'userAccount', key: 'userAccount', width: 140 },
    { title: '操作', dataIndex: 'actionName', key: 'actionName' },
    { title: '结果', dataIndex: 'successFlag', key: 'successFlag', width: 90 },
    { title: '时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  ]
})

const canEdit = computed(() => tab.value !== 'file' && tab.value !== 'log')
const canDelete = computed(() => tab.value !== 'log')

function text(row: Row, key: string) {
  const value = row[key]
  return value === undefined || value === null ? '' : String(value)
}

function avatarUrl(path: unknown) {
  return fileUrl(path)
}

function searchBody() {
  return {
    current: current.value,
    pageSize: 20,
    keyword: query.keyword || undefined,
    userRole: tab.value === 'user' ? query.userRole || undefined : undefined,
    userStatus: tab.value === 'user' && query.userStatus !== '' ? query.userStatus : undefined,
    auditStatus: tab.value === 'merchant' ? query.auditStatus || undefined : undefined,
    shopStatus: tab.value === 'merchant' && query.shopStatus !== '' ? query.shopStatus : undefined,
    articleType: tab.value === 'article' ? query.articleType || undefined : undefined,
    publishStatus:
      (tab.value === 'banner' || tab.value === 'article') && query.publishStatus !== ''
        ? query.publishStatus
        : undefined,
    dictCode: tab.value === 'dict' ? query.dictCode || undefined : undefined,
    successFlag: tab.value === 'log' && query.successFlag !== '' ? query.successFlag : undefined,
  }
}

async function load() {
  const url: Record<string, string> = {
    user: '/user/admin/list/page/vo',
    merchant: '/merchant/list/page/vo',
    banner: '/banner/list/page/vo',
    article: '/article/list/page/vo',
    dict: '/system/dict/list/page/vo',
    file: '/system/file/list/page/vo',
    log: '/system/log/list/page/vo',
  }
  loading.value = true
  try {
    const response = await adminPage<Row>(url[tab.value], searchBody())
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

function search() {
  current.value = 1
  load()
}

function resetQuery() {
  query.keyword = ''
  query.userRole = ''
  query.userStatus = ''
  query.auditStatus = ''
  query.shopStatus = ''
  query.articleType = ''
  query.publishStatus = ''
  query.dictCode = ''
  query.successFlag = ''
  search()
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
  if (tab.value === 'banner') {
    Object.assign(bannerForm, { id: '', title: '', imageUrl: '', linkUrl: '', sort: 0, publishStatus: 1 })
  } else if (tab.value === 'article') {
    Object.assign(articleForm, { id: '', title: '', articleType: 'notice', coverUrl: '', summary: '', content: '', sort: 0, publishStatus: 1 })
  } else if (tab.value === 'dict') {
    Object.assign(dictForm, { id: '', dictCode: '', itemName: '', itemValue: '', sort: 0 })
  } else if (tab.value === 'merchant') {
    Object.assign(merchantForm, { id: '', shopName: '', licenseNo: '', originProof: '', auditStatus: 'pending', auditNote: '', shopStatus: 0 })
  }
  editOpen.value = true
}

function openEdit(row: Row) {
  if (tab.value === 'user') {
    Object.assign(userForm, {
      id: text(row, 'id'),
      userAccount: text(row, 'userAccount'),
      userName: text(row, 'userName'),
      userAvatar: text(row, 'userAvatar'),
      userPhone: text(row, 'userPhone'),
      userStatus: Number(text(row, 'userStatus') || 0),
      userRole: text(row, 'userRole') || 'user',
    })
  } else if (tab.value === 'merchant') {
    Object.assign(merchantForm, {
      id: text(row, 'id'),
      shopName: text(row, 'shopName'),
      licenseNo: text(row, 'licenseNo'),
      originProof: text(row, 'originProof'),
      auditStatus: text(row, 'auditStatus') === 'rejected' ? 'rejected' : 'passed',
      auditNote: text(row, 'auditNote'),
      shopStatus: text(row, 'auditStatus') === 'pending' ? 1 : Number(text(row, 'shopStatus') || 0),
    })
  } else if (tab.value === 'banner') {
    Object.assign(bannerForm, {
      id: text(row, 'id'),
      title: text(row, 'title'),
      imageUrl: text(row, 'imageUrl'),
      linkUrl: text(row, 'linkUrl'),
      sort: Number(text(row, 'sort') || 0),
      publishStatus: Number(text(row, 'publishStatus') || 0),
    })
  } else if (tab.value === 'article') {
    Object.assign(articleForm, {
      id: text(row, 'id'),
      title: text(row, 'title'),
      articleType: text(row, 'articleType') || 'notice',
      coverUrl: text(row, 'coverUrl'),
      summary: text(row, 'summary'),
      content: text(row, 'content'),
      sort: Number(text(row, 'sort') || 0),
      publishStatus: Number(text(row, 'publishStatus') || 0),
    })
  } else if (tab.value === 'dict') {
    Object.assign(dictForm, {
      id: text(row, 'id'),
      dictCode: text(row, 'dictCode'),
      itemName: text(row, 'itemName'),
      itemValue: text(row, 'itemValue'),
      sort: Number(text(row, 'sort') || 0),
    })
  }
  editOpen.value = true
}

async function saveEdit() {
  saving.value = true
  try {
    let ok = false
    if (tab.value === 'user') {
      ok = await run(
        '/user/admin/update',
        {
          id: userForm.id,
          userName: userForm.userName,
          userAvatar: userForm.userAvatar,
          userPhone: userForm.userPhone,
        },
        '资料已更新',
      )
      if (ok && userForm.id !== loginUserId.value) {
        const statusOk = await run('/user/admin/status', userForm, '状态已更新')
        ok = statusOk && (await run('/user/admin/role', userForm, '角色已更新'))
      }
    } else if (tab.value === 'merchant' && merchantForm.id) {
      if (merchantForm.auditStatus !== 'passed' && merchantForm.auditStatus !== 'rejected') {
        message.warning('请选择通过或驳回')
        return
      }
      const audit = await adminPost('/merchant/audit', {
        id: merchantForm.id,
        auditStatus: merchantForm.auditStatus,
        auditNote: merchantForm.auditNote,
      })
      const notPending = String(audit.data.message || '').includes('不是待审')
      if (audit.data.code !== 0 && !notPending) {
        message.error(audit.data.message || '审核失败')
        return
      }
      if (merchantForm.auditStatus === 'rejected' && !notPending) {
        message.success('已驳回并关停')
        await load()
        ok = true
      } else {
        ok = await run('/merchant/shop/status', { id: merchantForm.id, shopStatus: merchantForm.shopStatus }, '商家信息已更新')
      }
    } else if (tab.value === 'merchant') {
      ok = await run('/merchant/add', merchantForm, '入驻已提交')
    } else if (tab.value === 'banner') {
      ok = await run(bannerForm.id ? '/banner/update' : '/banner/add', bannerForm, '轮播已保存')
    } else if (tab.value === 'article') {
      ok = await run(articleForm.id ? '/article/update' : '/article/add', articleForm, '内容已保存')
    } else if (tab.value === 'dict') {
      ok = await run('/system/dict/add', dictForm, '字典已保存')
    }
    if (ok) {
      editOpen.value = false
    }
  } finally {
    saving.value = false
  }
}

async function removeRow(row: Row) {
  const id = text(row, 'id')
  if (tab.value === 'user') {
    await run('/user/admin/status', { id, userStatus: 1 }, '账号已禁用')
    return
  }
  if (tab.value === 'merchant') {
    await run('/merchant/shop/status', { id, shopStatus: 0 }, '店铺已关停')
    return
  }
  const url: Record<string, string> = {
    banner: '/banner/delete',
    article: '/article/delete',
    dict: '/system/dict/delete',
    file: '/system/file/delete',
  }
  await run(url[tab.value], { id }, '已删除')
}

async function onFile(info: { file?: File & { originFileObj?: File } }) {
  const file = rawUploadFile(info)
  if (!file) {
    return
  }
  const url = await uploadImage(file, 'file')
  if (url) {
    message.success('已上传')
    await load()
  }
}

async function uploadImage(file: File, folder: string) {
  const form = new FormData()
  form.append('file', file)
  const response = await request<{ code?: number; data?: string; message?: string }>(
    `/system/file/upload?folder=${folder}`,
    {
      method: 'POST',
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  if (response.data.code !== 0) {
    message.error(response.data.message || '上传失败')
    return ''
  }
  return response.data.data || ''
}

function onUserAvatar(info: { file?: File & { originFileObj?: File } }) {
  return onBizFile(info, 'avatar')
}

function onBannerFile(info: { file?: File & { originFileObj?: File } }) {
  return onBizFile(info, 'banner')
}

function onArticleFile(info: { file?: File & { originFileObj?: File } }) {
  return onBizFile(info, 'article')
}

async function onBizFile(info: { file?: File & { originFileObj?: File } }, folder: 'avatar' | 'banner' | 'article') {
  const file = rawUploadFile(info)
  if (!file) {
    return
  }
  const url = await uploadImage(file, folder)
  if (!url) {
    return
  }
  if (folder === 'avatar') {
    userForm.userAvatar = url
  } else if (folder === 'banner') {
    bannerForm.imageUrl = url
  } else {
    articleForm.coverUrl = url
  }
  message.success('图片已上传')
}

onMounted(async () => {
  const response = await getLoginUser()
  role.value = response.data.data?.userRole || ''
  loginUserId.value = response.data.data?.id || ''
  if (role.value !== 'admin') {
    tab.value = 'banner'
  }
  await load()
})
</script>

<template>
  <page-container
    title="基础系统管理"
    :tab-list="tabs"
    :tab-active-key="tab"
    @tab-change="changeTab"
  >
    <template #extra>
      <a-space :size="4">
        <a-button type="link" @click="router.push('/admin/catalog')">商品类目</a-button>
        <a-button type="link" @click="router.push('/admin/order')">订单交易</a-button>
        <a-button type="link" @click="router.push('/')">返回商城</a-button>
        <a-tag color="orange">{{ isAdmin ? '管理员' : '运营人员' }}</a-tag>
      </a-space>
    </template>

    <a-card :bordered="false" class="block">
      <a-form layout="inline" @finish="search">
        <a-form-item label="关键字">
          <a-input v-model:value="query.keyword" allow-clear placeholder="账号、昵称、标题或店铺" />
        </a-form-item>
        <a-form-item v-if="tab === 'user'" label="角色">
          <a-select v-model:value="query.userRole" allow-clear placeholder="全部" style="width: 140px">
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="operator">运营人员</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="tab === 'user'" label="状态">
          <a-select v-model:value="query.userStatus" allow-clear placeholder="全部" style="width: 120px">
            <a-select-option :value="0">正常</a-select-option>
            <a-select-option :value="1">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="tab === 'merchant'" label="审核">
          <a-select v-model:value="query.auditStatus" allow-clear placeholder="全部" style="width: 120px">
            <a-select-option value="pending">待审核</a-select-option>
            <a-select-option value="passed">已通过</a-select-option>
            <a-select-option value="rejected">已驳回</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="tab === 'merchant'" label="店铺">
          <a-select v-model:value="query.shopStatus" allow-clear placeholder="全部" style="width: 120px">
            <a-select-option :value="1">营业</a-select-option>
            <a-select-option :value="0">关停</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="tab === 'article'" label="类型">
          <a-select v-model:value="query.articleType" allow-clear placeholder="全部" style="width: 140px">
            <a-select-option value="notice">公告</a-select-option>
            <a-select-option value="news">资讯</a-select-option>
            <a-select-option value="origin">产地介绍</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="tab === 'banner' || tab === 'article'" label="发布">
          <a-select v-model:value="query.publishStatus" allow-clear placeholder="全部" style="width: 120px">
            <a-select-option :value="1">已发布</a-select-option>
            <a-select-option :value="0">未发布</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="tab === 'dict'" label="编码">
          <a-input v-model:value="query.dictCode" allow-clear placeholder="字典编码" />
        </a-form-item>
        <a-form-item v-if="tab === 'log'" label="结果">
          <a-select v-model:value="query.successFlag" allow-clear placeholder="全部" style="width: 120px">
            <a-select-option :value="1">成功</a-select-option>
            <a-select-option :value="0">失败</a-select-option>
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
        <a-button v-if="tab === 'banner' || tab === 'article' || tab === 'dict' || tab === 'merchant'" type="primary" @click="openCreate">新建</a-button>
        <a-upload v-if="tab === 'file'" :show-upload-list="false" :before-upload="() => false" @change="onFile">
          <a-button type="primary">上传图片</a-button>
        </a-upload>
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
          <template v-if="column.key === 'userAvatar'">
            <a-avatar :src="avatarUrl(record.userAvatar)">{{ text(record, 'userName').slice(0, 1) || '芦' }}</a-avatar>
          </template>
          <template v-else-if="column.key === 'imageUrl' || column.key === 'fileUrl'">
            <a-image :width="72" :src="avatarUrl(record.imageUrl || record.fileUrl)" />
          </template>
          <template v-else-if="column.key === 'fileUrlText'">{{ text(record, 'fileUrl') }}</template>
          <template v-else-if="column.key === 'userRole'">
            <a-tag :color="record.userRole === 'admin' ? 'orange' : 'blue'">
              {{ ROLE_NAME[text(record, 'userRole')] || text(record, 'userRole') }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'userStatus'">
            <a-badge :status="String(record.userStatus) === '1' ? 'error' : 'success'" :text="String(record.userStatus) === '1' ? '禁用' : '正常'" />
          </template>
          <template v-else-if="column.key === 'auditStatus'">
            {{ AUDIT_NAME[text(record, 'auditStatus')] || text(record, 'auditStatus') }}
          </template>
          <template v-else-if="column.key === 'shopStatus' || column.key === 'publishStatus'">
            <a-tag :color="String(record[column.dataIndex as string]) === '1' ? 'green' : 'default'">
              {{ String(record[column.dataIndex as string]) === '1' ? (column.key === 'shopStatus' ? '营业' : '已发布') : (column.key === 'shopStatus' ? '关停' : '未发布') }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'articleType'">
            {{ ARTICLE_NAME[text(record, 'articleType')] || text(record, 'articleType') }}
          </template>
          <template v-else-if="column.key === 'successFlag'">
            <a-tag :color="String(record.successFlag) === '1' ? 'green' : 'red'">
              {{ String(record.successFlag) === '1' ? '成功' : '失败' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'userPhone'">{{ text(record, 'userPhone') || '—' }}</template>
          <template v-else-if="column.key === 'action'">
            <a-space :size="0" class="row-actions">
              <a-button v-if="canEdit" type="link" size="small" @click="openEdit(record)">编辑</a-button>
              <a-popconfirm
                v-if="canDelete"
                :title="tab === 'user' ? '确认禁用该账号？' : tab === 'merchant' ? '确认关停该店铺？' : '确认删除？'"
                @confirm="removeRow(record)"
              >
                <a-button type="link" danger size="small">{{ tab === 'user' ? '禁用' : tab === 'merchant' ? '关停' : '删除' }}</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="editOpen" :title="userForm.id || bannerForm.id || articleForm.id || dictForm.id || merchantForm.id ? '编辑' : '新建'" :confirm-loading="saving" @ok="saveEdit">
      <a-form v-if="tab === 'user'" layout="vertical">
        <a-form-item label="账号">
          <a-input :value="userForm.userAccount" disabled />
        </a-form-item>
        <a-form-item label="头像">
          <a-upload :show-upload-list="false" :before-upload="() => false" accept="image/*" @change="onUserAvatar">
            <a-button>上传图片</a-button>
          </a-upload>
          <div v-if="userForm.userAvatar" class="preview">
            <a-avatar :size="72" :src="fileUrl(userForm.userAvatar)">
              {{ userForm.userName.slice(0, 1) || '芦' }}
            </a-avatar>
          </div>
        </a-form-item>
        <a-form-item label="昵称">
          <a-input v-model:value="userForm.userName" :maxlength="64" placeholder="显示名称" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="userForm.userPhone" :maxlength="11" placeholder="11 位手机号" />
        </a-form-item>
        <a-form-item label="状态">
          <a-radio-group v-model:value="userForm.userStatus" :disabled="userForm.id === loginUserId">
            <a-radio :value="0">正常</a-radio>
            <a-radio :value="1">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-model:value="userForm.userRole" :disabled="userForm.id === loginUserId">
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="operator">运营人员</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <a-form v-else-if="tab === 'merchant'" layout="vertical">
        <template v-if="!merchantForm.id">
          <a-form-item label="店铺名"><a-input v-model:value="merchantForm.shopName" /></a-form-item>
          <a-form-item label="营业执照号"><a-input v-model:value="merchantForm.licenseNo" /></a-form-item>
          <a-form-item label="产地证明"><a-input v-model:value="merchantForm.originProof" /></a-form-item>
        </template>
        <template v-else>
          <a-form-item label="审核">
            <a-select v-model:value="merchantForm.auditStatus">
              <a-select-option value="passed">通过</a-select-option>
              <a-select-option value="rejected">驳回</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="审核说明"><a-input v-model:value="merchantForm.auditNote" /></a-form-item>
          <a-form-item label="店铺">
            <a-radio-group v-model:value="merchantForm.shopStatus">
              <a-radio :value="1">营业</a-radio>
              <a-radio :value="0">关停</a-radio>
            </a-radio-group>
          </a-form-item>
        </template>
      </a-form>
      <a-form v-else-if="tab === 'banner'" layout="vertical">
        <a-form-item label="标题"><a-input v-model:value="bannerForm.title" /></a-form-item>
        <a-form-item label="轮播图">
          <a-upload :show-upload-list="false" :before-upload="() => false" accept="image/*" @change="onBannerFile">
            <a-button>上传图片</a-button>
          </a-upload>
          <div v-if="bannerForm.imageUrl" class="preview">
            <a-image :width="160" :src="fileUrl(bannerForm.imageUrl)" />
          </div>
        </a-form-item>
        <a-form-item label="跳转链接"><a-input v-model:value="bannerForm.linkUrl" /></a-form-item>
        <a-form-item label="排序"><a-input-number v-model:value="bannerForm.sort" :min="0" /></a-form-item>
        <a-form-item label="发布">
          <a-switch :checked="bannerForm.publishStatus === 1" @change="(checked: boolean) => (bannerForm.publishStatus = checked ? 1 : 0)" />
        </a-form-item>
      </a-form>
      <a-form v-else-if="tab === 'article'" layout="vertical">
        <a-form-item label="标题"><a-input v-model:value="articleForm.title" /></a-form-item>
        <a-form-item label="类型">
          <a-select v-model:value="articleForm.articleType">
            <a-select-option value="notice">公告</a-select-option>
            <a-select-option value="news">资讯</a-select-option>
            <a-select-option value="origin">产地介绍</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="封面">
          <a-upload :show-upload-list="false" :before-upload="() => false" accept="image/*" @change="onArticleFile">
            <a-button>上传图片</a-button>
          </a-upload>
          <div v-if="articleForm.coverUrl" class="preview">
            <a-image :width="160" :src="fileUrl(articleForm.coverUrl)" />
          </div>
        </a-form-item>
        <a-form-item label="摘要"><a-input v-model:value="articleForm.summary" /></a-form-item>
        <a-form-item label="正文"><a-textarea v-model:value="articleForm.content" :rows="4" /></a-form-item>
      </a-form>
      <a-form v-else-if="tab === 'dict'" layout="vertical">
        <a-form-item label="字典编码"><a-input v-model:value="dictForm.dictCode" /></a-form-item>
        <a-form-item label="名称"><a-input v-model:value="dictForm.itemName" /></a-form-item>
        <a-form-item label="值"><a-input v-model:value="dictForm.itemValue" /></a-form-item>
        <a-form-item label="排序"><a-input-number v-model:value="dictForm.sort" :min="0" /></a-form-item>
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
</style>
