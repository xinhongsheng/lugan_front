<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getArticleVoById } from '@/api/articleController'
import { ARTICLE_TYPE_MAP } from '@/constants/article'
import { fileUrl } from '@/utils/fileUrl'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const missing = ref(false)
const article = ref<API.ArticleDetailVO>({})

function resolveType(value?: string) {
  if (value === 'news' || value === 'origin' || value === 'notice') {
    return value
  }
  return 'notice'
}

const typeLabel = computed(() => ARTICLE_TYPE_MAP[resolveType(article.value.articleType || String(route.query.type || ''))])

function backToList() {
  const type = resolveType(article.value.articleType || String(route.query.type || ''))
  router.push({ path: '/article', query: { type } })
}

function noticeDate(value?: string) {
  if (!value) {
    return ''
  }
  return value.slice(0, 16)
}

async function load() {
  const id = typeof route.query.id === 'string' ? route.query.id : ''
  if (!id) {
    missing.value = true
    article.value = {}
    return
  }
  loading.value = true
  missing.value = false
  try {
    const response = await getArticleVoById({ id })
    if (response.data.code !== 0 || !response.data.data) {
      missing.value = true
      article.value = {}
      message.error(response.data.message || '内容不存在')
      return
    }
    article.value = response.data.data
  } finally {
    loading.value = false
  }
}

watch(() => route.query.id, load, { immediate: true })
</script>

<template>
  <main id="article-detail-page">
    <button type="button" class="back" @click="backToList">返回列表</button>
    <a-spin :spinning="loading">
      <a-empty v-if="missing" description="内容不存在或已下线" />
      <article v-else-if="article.id">
        <p>{{ typeLabel }}</p>
        <h1>{{ article.title }}</h1>
        <time>{{ noticeDate(article.createTime) }}</time>
        <img v-if="article.coverUrl" :src="fileUrl(article.coverUrl)" :alt="article.title || '公告封面'" />
        <p v-if="article.summary" class="summary">{{ article.summary }}</p>
        <div class="content">{{ article.content }}</div>
      </article>
    </a-spin>
  </main>
</template>

<style scoped>
#article-detail-page {
  max-width: 880px;
  margin: 24px auto;
  padding: 0 16px 40px;
}

.back {
  margin-bottom: 12px;
  border: 0;
  background: transparent;
  color: #e8870a;
  font: inherit;
  cursor: pointer;
}

article {
  padding: 28px 28px 36px;
  background: #fff;
  border-radius: 8px;
}

article > p {
  margin: 0;
  color: #e8870a;
  font-size: 13px;
}

h1 {
  margin: 8px 0 0;
  color: #333;
  font-size: 28px;
  line-height: 1.4;
}

time {
  display: block;
  margin-top: 10px;
  color: #bbb;
  font-size: 13px;
}

img {
  display: block;
  width: 100%;
  max-height: 360px;
  margin-top: 18px;
  object-fit: cover;
  border-radius: 8px;
}

.summary {
  margin: 18px 0 0;
  color: #666;
  font-size: 15px;
  line-height: 1.7;
}

.content {
  margin-top: 18px;
  color: #333;
  font-size: 16px;
  line-height: 1.9;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
