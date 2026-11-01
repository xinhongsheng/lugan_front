<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { listOpenArticleVoByPage } from '@/api/articleController'
import { ARTICLE_TYPE_MAP } from '@/constants/article'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const rows = ref<API.ArticleVO[]>([])
const total = ref(0)
const query = reactive<API.ArticleQueryRequest>({ current: 1, pageSize: 10, articleType: 'notice' })

function resolveType() {
  const value = route.query.type
  if (value === 'news' || value === 'origin' || value === 'notice') {
    return value
  }
  return 'notice'
}

const pageTitle = computed(() => ARTICLE_TYPE_MAP[resolveType()])
const emptyText = computed(() => {
  if (resolveType() === 'news') {
    return '暂无已发布资讯'
  }
  if (resolveType() === 'origin') {
    return '暂无已发布产地介绍'
  }
  return '暂无已发布公告'
})
const summaryFallback = computed(() => {
  if (resolveType() === 'news') {
    return '查看资讯正文'
  }
  if (resolveType() === 'origin') {
    return '查看产地介绍'
  }
  return '查看公告正文'
})

function noticeDate(value?: string) {
  if (!value) {
    return ''
  }
  return value.slice(0, 10)
}

async function load() {
  loading.value = true
  try {
    const response = await listOpenArticleVoByPage(query)
    if (response.data.code !== 0) {
      message.error(response.data.message || '内容加载失败')
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

function openDetail(id?: string) {
  if (!id) {
    return
  }
  router.push({ path: '/article/detail', query: { id, type: resolveType() } })
}

function onPage(page: number) {
  query.current = page
  load()
}

watch(
  () => route.query.type,
  () => {
    query.current = 1
    query.articleType = resolveType()
    load()
  },
  { immediate: true },
)
</script>

<template>
  <main id="article-list-page">
    <header class="head">
      <div>
        <p>资讯公告</p>
        <h1>{{ pageTitle }}</h1>
      </div>
      <button type="button" @click="router.push('/')">返回首页</button>
    </header>
    <a-spin :spinning="loading">
      <a-empty v-if="!loading && rows.length === 0" :description="emptyText" />
      <ul v-else>
        <li v-for="item in rows" :key="item.id">
          <button type="button" @click="openDetail(item.id)">
            <strong>{{ item.title }}</strong>
            <span>{{ item.summary || summaryFallback }}</span>
            <time>{{ noticeDate(item.createTime) }}</time>
          </button>
        </li>
      </ul>
      <div v-if="total > Number(query.pageSize)" class="pager">
        <a-pagination
          :current="query.current"
          :page-size="Number(query.pageSize)"
          :total="total"
          :show-size-changer="false"
          @change="onPage"
        />
      </div>
    </a-spin>
  </main>
</template>

<style scoped>
#article-list-page {
  max-width: 880px;
  margin: 24px auto;
  padding: 0 16px 32px;
}

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.head p {
  margin: 0;
  color: #e8870a;
  font-size: 13px;
}

.head h1 {
  margin: 4px 0 0;
  color: #333;
  font-size: 28px;
}

.head > button,
li button {
  border: 0;
  background: transparent;
  cursor: pointer;
}

.head > button {
  color: #e8870a;
  font: inherit;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
  background: #fff;
  border-radius: 8px;
}

li + li {
  border-top: 1px dashed #f0f0f0;
}

li button {
  display: grid;
  width: 100%;
  padding: 16px 18px;
  color: inherit;
  font: inherit;
  text-align: left;
}

li strong {
  color: #333;
  font-size: 16px;
}

li span {
  margin-top: 6px;
  color: #888;
  font-size: 13px;
  line-height: 1.6;
}

li time {
  margin-top: 8px;
  color: #bbb;
  font-size: 12px;
}

li button:hover strong {
  color: #e8870a;
}

.pager {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
