<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { getHomeVo } from '@/api/homeController'
import { listProductVoByPage } from '@/api/productController'
import ProductCard from '@/components/product/ProductCard.vue'
import { ARTICLE_TYPE_MAP } from '@/constants/article'
import { HOME_PHOTOS, homePhoto } from '@/constants/home'

const FALLBACK_CATEGORIES: API.CategoryVO[] = [
  {
    name: '永春芦柑',
    children: [{ name: '精品果' }, { name: '普通果' }, { name: '礼盒装' }],
  },
  { name: '芦柑副产品', children: [{ name: '柑干' }, { name: '柑酱' }] },
  { name: '其他永春土特产', children: [] },
]

const HOT_WORDS = ['精品果', '10 斤装', '礼盒装', '达埔产地', '柑干']

const SERVICE_ITEMS = [
  { title: '产地直发', desc: '达埔、蓬壶果园现采现发' },
  { title: '坏果包赔', desc: '签收 48 小时内可申请售后' },
  { title: '批次溯源', desc: '每箱可查采摘批次与质检' },
]

const home = ref<API.HomeVO>({})
const loading = ref(false)
const searching = ref(false)
const searched = ref(false)
const searchResult = ref<API.ProductVO[]>([])
const searchTotal = ref('0')
const pickedCategory = ref('')
const activeTopKey = ref('')
const activeNoticeTab = ref('notice')
const activeZone = ref('hot')
const resultRef = ref<HTMLElement | null>(null)

const query = reactive<API.ProductQueryRequest>({
  current: 1,
  pageSize: 8,
  keyword: '',
})

const slides = computed(() => {
  const banners = home.value.bannerList ?? []
  if (banners.length === 0) {
    return [
      { id: 'grove', title: '永春芦柑产地宣传', imageUrl: HOME_PHOTOS.grove, linkUrl: '' },
      { id: 'harvest', title: '芦柑丰收季助农活动', imageUrl: HOME_PHOTOS.harvest, linkUrl: '' },
      { id: 'poster', title: '产地直供，当日采摘', imageUrl: HOME_PHOTOS.poster, linkUrl: '' },
    ]
  }
  return banners.map((banner, index) => ({
    id: banner.id ?? `banner-${index}`,
    title: banner.title ?? '永春芦柑',
    imageUrl: banner.imageUrl || homePhoto(index),
    linkUrl: banner.linkUrl ?? '',
  }))
})

const topCategories = computed(() => {
  const list = home.value.categoryList ?? []
  return list.length > 0 ? list : FALLBACK_CATEGORIES
})

const subCategories = computed(() => {
  if (activeTopKey.value) {
    const hit = topCategories.value.find((item) => categoryKey(item) === activeTopKey.value)
    return hit?.children ?? []
  }
  const merged: API.CategoryVO[] = []
  topCategories.value.forEach((item) => {
    ;(item.children ?? []).forEach((child) => merged.push(child))
  })
  return merged.slice(0, 8)
})

const categoryOptions = computed(() =>
  topCategories.value.map((item) => ({ label: item.name ?? '未命名分类', value: categoryKey(item) })),
)

const articleTabs = computed(() => [
  { key: 'notice', title: ARTICLE_TYPE_MAP.notice, list: home.value.noticeList ?? [] },
  { key: 'news', title: ARTICLE_TYPE_MAP.news, list: home.value.newsList ?? [] },
  { key: 'origin', title: ARTICLE_TYPE_MAP.origin, list: home.value.originList ?? [] },
])

const currentArticles = computed(
  () => articleTabs.value.find((tab) => tab.key === activeNoticeTab.value)?.list ?? [],
)

const currentArticleTitle = computed(
  () => articleTabs.value.find((tab) => tab.key === activeNoticeTab.value)?.title ?? '内容',
)

const zoneTabs = computed(() => [
  { key: 'hot', label: '热门推荐', hint: '这阵子卖得最多', list: home.value.hotList ?? [] },
  { key: 'new', label: '新品上架', hint: '刚采下来的一批', list: home.value.newList ?? [] },
  { key: 'direct', label: '产地直供', hint: '从永春果园直接发出', list: home.value.directList ?? [] },
])

const zoneOptions = computed(() => zoneTabs.value.map((item) => ({ label: item.label, value: item.key })))

const currentZone = computed(
  () => zoneTabs.value.find((tab) => tab.key === activeZone.value) ?? zoneTabs.value[0],
)

const filterText = computed(() => {
  const parts: string[] = []
  if (pickedCategory.value) {
    parts.push(pickedCategory.value)
  }
  if (query.minPrice != null || query.maxPrice != null) {
    parts.push(`¥${query.minPrice ?? 0} — ${query.maxPrice ?? '不限'}`)
  }
  return parts.join(' · ')
})

const resultTitle = computed(() => {
  if (query.keyword && !pickedCategory.value) {
    return `“${query.keyword}”的搜索结果`
  }
  return pickedCategory.value || '搜索结果'
})

function categoryKey(category: API.CategoryVO) {
  return category.id || category.name || ''
}

function selectCategoryKey(value: unknown) {
  if (!value) {
    activeTopKey.value = ''
    query.categoryId = undefined
    pickedCategory.value = ''
    return
  }
  const hit = topCategories.value.find((item) => categoryKey(item) === value)
  if (hit) {
    activeTopKey.value = categoryKey(hit)
    applyCategory(hit)
  }
}

async function loadHome() {
  loading.value = true
  try {
    const response = await getHomeVo()
    const body = response.data
    if (body.code !== 0 || !body.data) {
      message.error(body.message || '首页加载失败')
      return
    }
    home.value = body.data
  } catch {
    message.error('首页加载失败')
  } finally {
    loading.value = false
  }
}

async function search(resetPage = true) {
  if (resetPage) {
    query.current = 1
  }
  searching.value = true
  searched.value = true
  try {
    const response = await listProductVoByPage({ ...query })
    const body = response.data
    if (body.code !== 0 || !body.data) {
      message.error(body.message || '搜索失败')
      searchResult.value = []
      searchTotal.value = '0'
      return
    }
    searchResult.value = body.data.list ?? []
    searchTotal.value = body.data.total ?? '0'
    if (resetPage) {
      scoreToResult()
    }
  } catch {
    message.error('搜索失败')
  } finally {
    searching.value = false
  }
}

function scoreToResult() {
  nextTick(() => {
    resultRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function applyCategory(category: API.CategoryVO) {
  query.categoryId = category.id || undefined
  query.keyword = category.id ? '' : category.name ?? ''
  pickedCategory.value = category.name ?? ''
  search(true)
}

function pickTop(category: API.CategoryVO) {
  activeTopKey.value = categoryKey(category)
  applyCategory(category)
}

function pickAll() {
  activeTopKey.value = ''
  query.categoryId = undefined
  pickedCategory.value = ''
  if (searched.value) {
    resetSearch()
  }
}

function quickSearch(word: string) {
  query.keyword = word
  query.categoryId = undefined
  pickedCategory.value = ''
  activeTopKey.value = ''
  search(true)
}

function changePage(page: number) {
  query.current = page
  search(false)
}

function resetSearch() {
  searched.value = false
  searchResult.value = []
  searchTotal.value = '0'
  pickedCategory.value = ''
  activeTopKey.value = ''
  query.keyword = ''
  query.categoryId = undefined
  query.minPrice = undefined
  query.maxPrice = undefined
  query.current = 1
}

onMounted(loadHome)
</script>

<template>
  <div id="home-page">
    <div class="wrap">
      <!-- 搜索 + 分类：同一区块 -->
      <section class="hero">
        <div class="hero-body">
          <div class="hero-left">
            <span class="hero-tag">永春 · 中国芦柑之乡</span>
            <h1 class="hero-title">从达埔果园，直发一箱新鲜芦柑</h1>
            <p class="hero-sub">当季采摘 · 采摘批次可溯源 · 省内次日达</p>

          <div class="search-bar">
            <a-select
              class="search-cat"
              :value="activeTopKey || undefined"
              :options="categoryOptions"
              :bordered="false"
              placeholder="全部分类"
              allow-clear
              @change="selectCategoryKey"
            />
            <span class="search-split" />
            <a-input
              v-model:value="query.keyword"
              class="search-input"
              :bordered="false"
              allow-clear
              placeholder="搜一搜：品名、规格或产地，如「精品果」「10 斤装」"
              @press-enter="search(true)"
            />
            <a-button type="primary" class="search-btn" :loading="searching" @click="search(true)">
              搜索
            </a-button>
          </div>

          <div class="search-extra">
            <div class="hot-words">
              <span class="extra-label">大家在搜</span>
              <a v-for="word in HOT_WORDS" :key="word" class="hot-word" @click="quickSearch(word)">
                {{ word }}
              </a>
            </div>
            <div class="price-range">
              <span class="extra-label">价格</span>
              <a-input-number
                v-model:value="query.minPrice"
                :min="0"
                :precision="0"
                :controls="false"
                placeholder="最低"
                size="small"
              />
              <span class="dash">—</span>
              <a-input-number
                v-model:value="query.maxPrice"
                :min="0"
                :precision="0"
                :controls="false"
                placeholder="最高"
                size="small"
              />
              <span class="extra-label unit-label">元</span>
            </div>
          </div>
          </div>

          <div class="hero-visual" :style="{ backgroundImage: `url(${HOME_PHOTOS.harvest})` }">
            <div class="visual-caption">
              <span class="visual-tag">产地直采</span>
              <p>永春达埔 · 蓬壶果园现采现发</p>
            </div>
          </div>
        </div>

        <div class="hero-foot">
          <div class="cat-row">
            <a class="cat-chip" :class="{ active: !activeTopKey }" @click="pickAll">全部</a>
            <a
              v-for="category in topCategories"
              :key="categoryKey(category)"
              class="cat-chip"
              :class="{ active: activeTopKey === categoryKey(category) }"
              @click="pickTop(category)"
            >
              {{ category.name }}
            </a>
          </div>

          <div v-if="subCategories.length" class="sub-row">
            <a
              v-for="child in subCategories"
              :key="categoryKey(child)"
              class="sub-chip"
              @click="applyCategory(child)"
            >
              {{ child.name }}
            </a>
          </div>
        </div>
      </section>

      <!-- 搜索结果 -->
      <section v-if="searched" ref="resultRef" class="panel result">
        <header class="panel-head">
          <div class="head-left">
            <h2 class="panel-title">{{ resultTitle }}</h2>
            <span class="head-count">共 {{ searchTotal }} 件</span>
            <span v-if="filterText" class="head-filter">{{ filterText }}</span>
          </div>
          <a-button type="link" class="head-action" @click="resetSearch">清空筛选</a-button>
        </header>
        <a-spin :spinning="searching">
          <a-empty v-if="searchResult.length === 0" class="empty" description="没有找到符合条件的产品，换个关键词试试" />
          <div v-else class="grid">
            <product-card
              v-for="(product, index) in searchResult"
              :key="product.id ?? index"
              :product="product"
              :index="index"
            />
          </div>
          <div v-if="Number(searchTotal) > Number(query.pageSize)" class="pager">
            <a-pagination
              :current="query.current"
              :page-size="Number(query.pageSize)"
              :total="Number(searchTotal)"
              :show-size-changer="false"
              @change="changePage"
            />
          </div>
        </a-spin>
      </section>

      <!-- 轮播 + 公告 -->
      <div class="main-row">
        <section class="panel gallery">
          <a-carousel autoplay class="banner">
            <div v-for="slide in slides" :key="slide.id">
              <a
                v-if="slide.linkUrl"
                class="slide"
                :href="slide.linkUrl"
                :style="{ backgroundImage: `url(${slide.imageUrl})` }"
              >
                <span class="slide-title">{{ slide.title }}</span>
              </a>
              <div v-else class="slide" :style="{ backgroundImage: `url(${slide.imageUrl})` }">
                <span class="slide-title">{{ slide.title }}</span>
              </div>
            </div>
          </a-carousel>
        </section>

        <section class="panel notice">
          <a-tabs v-model:activeKey="activeNoticeTab" size="small" class="notice-tabs">
            <a-tab-pane v-for="tab in articleTabs" :key="tab.key" :tab="tab.title" />
          </a-tabs>
          <div class="notice-list">
            <a-empty v-if="currentArticles.length === 0" :image="false" description="内容整理中" />
            <a v-for="(article, index) in currentArticles" :key="article.id ?? index" class="notice-item">
              <span class="dot" :class="activeNoticeTab" />
              <span class="notice-title">{{ article.title }}</span>
              <span v-if="index === 0" class="new-flag">NEW</span>
            </a>
          </div>
          <a class="notice-more">查看全部{{ currentArticleTitle }} →</a>
        </section>
      </div>

      <!-- 商品专区 -->
      <section class="panel zone">
        <header class="panel-head">
          <div class="head-left">
            <h2 class="panel-title">{{ currentZone.label }}</h2>
            <span class="head-count">{{ currentZone.hint }}</span>
          </div>
          <a-segmented v-model:value="activeZone" :options="zoneOptions" />
        </header>
        <a-spin :spinning="loading">
          <a-empty v-if="currentZone.list.length === 0" class="empty" :image="false" description="这个专区还没有上架的芦柑" />
          <div v-else class="grid">
            <product-card
              v-for="(product, index) in currentZone.list.slice(0, 8)"
              :key="product.id ?? index"
              :product="product"
              :index="index"
            />
          </div>
        </a-spin>
      </section>

      <!-- 服务保障 -->
      <section class="service">
        <div v-for="item in SERVICE_ITEMS" :key="item.title" class="service-item">
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
#home-page {
  box-sizing: border-box;
  width: 100%;
  padding: 20px 24px 48px;
  overflow-x: hidden;
  background: #f6f7f3;
}

.wrap {
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  margin: 0 auto;
}

/* ---------- Hero ---------- */
.hero {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: radial-gradient(120% 140% at 88% 8%, #4e9a5c 0%, #2f7d46 46%, #1c5a34 100%);
}

.hero-body {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 32px;
  align-items: center;
  padding: 32px 36px 8px;
}

.hero-left {
  min-width: 0;
}

.hero-visual {
  position: relative;
  height: 236px;
  border-radius: 16px;
  background-position: center;
  background-size: cover;
  box-shadow: 0 12px 28px rgba(6, 32, 16, 0.28);
}

.visual-caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 36px 16px 12px;
  border-radius: 0 0 16px 16px;
  background: linear-gradient(180deg, transparent, rgba(8, 30, 16, 0.72));
}

.visual-tag {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  color: #1f6b3a;
  font-size: 11.5px;
  line-height: 18px;
}

.visual-caption p {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.92);
  font-size: 12.5px;
}

.hero-foot {
  position: relative;
  padding: 0 36px 26px;
}

.hero-tag {
  display: inline-block;
  padding: 2px 10px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  color: #eaf5e6;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.hero-title {
  margin: 12px 0 6px;
  color: #fff;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.hero-sub {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 13.5px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  margin-top: 22px;
  padding: 5px 6px 5px 10px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(12, 45, 24, 0.18);
}

.search-cat {
  width: 116px;
}

.search-cat :deep(.ant-select-selector) {
  padding-left: 2px;
  color: #3c4450;
}

.search-split {
  width: 1px;
  height: 20px;
  background: #e8ebe4;
}

.search-input {
  flex: 1;
  min-width: 0;
  font-size: 14px;
}

.search-btn {
  height: 40px;
  padding: 0 26px;
  border-radius: 10px;
  font-size: 15px;
}

.search-extra {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 100%;
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
}

.hot-words {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.extra-label {
  color: rgba(255, 255, 255, 0.62);
  font-size: 12.5px;
}

.hot-word {
  color: #eaf5e6;
  text-decoration: none;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.35);
}

.hot-word:hover {
  color: #fff;
  border-bottom-color: #fff;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 6px;
}

.price-range :deep(.ant-input-number) {
  width: 64px;
  border-color: transparent;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
}

.price-range :deep(.ant-input-number input) {
  font-size: 12px;
  text-align: center;
}

.dash {
  color: rgba(255, 255, 255, 0.55);
}

.unit-label {
  margin-left: -2px;
}

.cat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.cat-chip {
  padding: 5px 16px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  color: #f1f8ee;
  font-size: 13.5px;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.cat-chip:hover {
  background: rgba(255, 255, 255, 0.16);
}

.cat-chip.active {
  border-color: #fff;
  background: #fff;
  color: #1f6b3a;
  font-weight: 600;
}

.sub-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
}

.sub-chip {
  padding: 3px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #eaf5e6;
  font-size: 12.5px;
}

.sub-chip:hover {
  background: rgba(255, 255, 255, 0.26);
  color: #fff;
}

/* ---------- 通用面板 ---------- */
.panel {
  padding: 18px 20px;
  background: #fff;
  border: 1px solid #eef0e9;
  border-radius: 16px;
}

.panel,
.main-row,
.service {
  margin-top: 16px;
}

.main-row .panel {
  margin-top: 0;
}

.panel-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.head-left {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.panel-title {
  position: relative;
  margin: 0;
  padding-left: 12px;
  color: #1f2328;
  font-size: 18px;
  font-weight: 600;
}

.panel-title::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 4px;
  height: 16px;
  border-radius: 2px;
  background: #2f7d46;
  content: '';
  transform: translateY(-50%);
}

.head-count,
.head-filter {
  color: #8a9099;
  font-size: 13px;
}

.head-filter {
  padding: 1px 8px;
  border-radius: 6px;
  background: #f2f5ee;
  color: #43764f;
}

.head-action {
  padding: 0;
}

.empty {
  padding: 22px 0 26px;
}

.empty :deep(.ant-empty-image) {
  height: 46px;
  opacity: 0.8;
}

.empty :deep(.ant-empty-description) {
  color: #9aa0a8;
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.pager {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* ---------- 搜索结果 ---------- */
.result {
  border-color: #dcead7;
  box-shadow: 0 8px 22px rgba(31, 92, 53, 0.06);
}

/* ---------- 轮播 + 公告 ---------- */
.main-row {
  display: grid;
  grid-template-columns: minmax(0, 1.85fr) minmax(0, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.gallery,
.notice {
  margin-top: 0;
}

.gallery {
  padding: 0;
  overflow: hidden;
}

.banner :deep(.slick-slide) > div {
  line-height: 0;
}

.slide {
  display: flex;
  align-items: flex-end;
  height: 336px;
  background-position: center;
  background-size: cover;
  line-height: 1.5;
  text-decoration: none;
}

.slide-title {
  width: 100%;
  padding: 40px 24px 20px;
  background: linear-gradient(180deg, transparent, rgba(10, 32, 18, 0.68));
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.notice {
  display: flex;
  flex-direction: column;
  height: 336px;
  box-sizing: border-box;
}

.notice-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 8px;
}

.notice-list {
  flex: 1;
  overflow-y: auto;
}

.notice-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 2px;
  color: #3c4450;
  font-size: 13.5px;
  text-decoration: none;
}

.notice-item:hover .notice-title {
  color: #2f7d46;
}

.notice-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #2f7d46;
}

.dot.news {
  background: #3a7bd5;
}

.dot.origin {
  background: #d9a300;
}

.new-flag {
  padding: 0 5px;
  border-radius: 4px;
  background: #fff1e8;
  color: #e8590c;
  font-size: 10px;
  line-height: 15px;
}

.notice-more {
  padding-top: 10px;
  border-top: 1px solid #f2f4ee;
  color: #8a9099;
  font-size: 12.5px;
  text-align: right;
  text-decoration: none;
}

.notice-more:hover {
  color: #2f7d46;
}

/* ---------- 服务保障 ---------- */
.service {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid #eef0e9;
  border-radius: 16px;
}

.service-item h4 {
  margin: 0 0 4px;
  color: #1f2328;
  font-size: 14.5px;
  font-weight: 600;
}

.service-item h4::before {
  margin-right: 6px;
  color: #2f7d46;
  content: '◆';
  font-size: 10px;
}

.service-item p {
  margin: 0;
  color: #8a9099;
  font-size: 12.5px;
}

/* ---------- 响应式 ---------- */
@media (max-width: 1100px) {
  .main-row {
    grid-template-columns: minmax(0, 1fr);
  }

  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .notice {
    height: auto;
  }
}

@media (max-width: 720px) {
  #home-page {
    padding: 12px 12px 32px;
  }

  .hero-body {
    display: block;
    padding: 22px 18px 6px;
  }

  .hero-visual {
    display: none;
  }

  .hero-foot {
    padding: 0 18px 20px;
  }

  .hero-title {
    font-size: 21px;
  }

  .search-bar {
    width: 100%;
    box-sizing: border-box;
    flex-wrap: wrap;
    gap: 8px;
  }

  .search-cat {
    width: 96px;
  }

  .search-split {
    display: none;
  }

  .search-btn {
    width: 100%;
  }

  .search-input {
    flex: 1 1 120px;
  }

  .price-range {
    flex-wrap: wrap;
  }

  .slide {
    height: 200px;
  }

  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .service {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
