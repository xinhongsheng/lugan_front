<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getHomeVo } from '@/api/homeController'
import { listOpenPresaleActivityVoByPage } from '@/api/presaleActivityController'
import { listProductVoByPage } from '@/api/productController'
import { listMyCartVoByPage } from '@/api/cartController'
import { getLoginUser } from '@/api/userController'
import { HOME_ART } from '@/constants/homeArt'
import { fileUrl } from '@/utils/fileUrl'

type Shelf = {
  id?: string
  name: string
  spec: string
  price: string
  sold: string
  badge?: string
  cover?: string
  keyword: string
}

const router = useRouter()
const presaleList = ref<API.PresaleActivityVO[]>([])
const leadPresale = computed(() => presaleList.value[0])

const CATS = [
  { name: '精品果（大果/统货）', word: '精品果' },
  { name: '普通装（日常鲜果）', word: '普通果' },
  { name: '礼盒装（送礼优选）', word: '礼盒' },
  { name: '柑干（芦柑果干）', word: '柑干' },
  { name: '柑酱（芦柑果酱/原料）', word: '柑酱' },
  { name: '永春土特产（茶叶/蜂蜜/蜜柚）', word: '土特产' },
]

const NAVS = [
  { key: 'home', label: '首页', action: 'top' },
  { key: 'fruit', label: '永春芦柑', action: 'search', word: '永春芦柑' },
  { key: 'side', label: '芦柑副产品', action: 'search', word: '副产品' },
  { key: 'local', label: '土特产', action: 'search', word: '土特产' },
  { key: 'presale', label: '采摘季预售', action: 'anchor', id: 'presale' },
  { key: 'trace', label: '一果一码验真', action: 'anchor', id: 'trace' },
  { key: 'group', label: '团购批发', action: 'route', path: '/promotion' },
  { key: 'news', label: '资讯公告', action: 'anchor', id: 'news' },
]

const HOT_SHELF: Shelf[] = [
  { name: '永春芦柑 精选大果', spec: '精品果（约20-26个）', price: '89.00', sold: '3,268', badge: '人气', keyword: '精品果', cover: HOME_ART.bigFruit },
  { name: '永春芦柑 特级果', spec: '规格：10kg（约40-52个）', price: '168.00', sold: '1,965', keyword: '10斤', cover: HOME_ART.crate },
  { name: '永春芦柑 礼盒装（送礼优选）', spec: '规格：5kg（精品大果，礼盒装）', price: '128.00', sold: '1,236', badge: '礼盒优选', keyword: '礼盒', cover: HOME_ART.gift },
  { name: '永春芦柑 家庭实惠装', spec: '规格：10kg（中果）', price: '118.00', sold: '2,973', keyword: '家庭', cover: HOME_ART.crate },
]

const NEW_SHELF: Shelf[] = [
  { name: '永春芦柑 新果尝鲜', spec: '5kg/箱', price: '79.00', sold: '', keyword: '新品', cover: HOME_ART.freshBox },
  { name: '芦柑果干（柑干）', spec: '250g/袋', price: '26.80', sold: '', keyword: '柑干', cover: HOME_ART.dried },
  { name: '芦柑果酱（柑酱）', spec: '300g/瓶', price: '28.00', sold: '', keyword: '柑酱', cover: HOME_ART.jam },
  { name: '芦柑蜜饯', spec: '200g/袋', price: '42.80', sold: '', keyword: '蜜饯', cover: HOME_ART.candy },
  { name: '永春高山茶（芦柑）', spec: '100g/罐', price: '68.00', sold: '', keyword: '高山茶', cover: HOME_ART.tea },
  { name: '永春农家蜂蜜', spec: '500g/瓶', price: '59.00', sold: '', keyword: '蜂蜜', cover: HOME_ART.honey },
]

const PICKS: Shelf[] = [
  { name: '达埔产区 精选大果', spec: '', price: '89.00', sold: '', keyword: '达埔', cover: HOME_ART.bigFruit },
  { name: '达埔产区 礼盒装', spec: '', price: '128.00', sold: '', keyword: '礼盒', cover: HOME_ART.gift },
  { name: '达埔产区 家庭装', spec: '', price: '118.00', sold: '', keyword: '达埔', cover: HOME_ART.crate },
  { name: '蓬壶产区 优选果', spec: '10kg/箱', price: '99.00', sold: '', keyword: '蓬壶', cover: HOME_ART.freshBox },
]

const NOTICE_FALLBACK = [
  { title: '关于2025年永春芦柑采摘季预售正式开始的公告', date: '01-10' },
  { title: '平台发货时效及包装标准说明', date: '01-08' },
  { title: '永春芦柑一果一码溯源功能升级公告', date: '01-05' },
  { title: '春节期间发货安排公告', date: '01-02' },
]

const NEWS_FALLBACK = [
  { title: '永春芦柑组团丰收季 预计产量再创新高', date: '2025-01-09', summary: '核心产区达埔、蓬壶开秤在即。' },
  { title: '永春芦柑产业发展新闻：品牌建设持续推进', date: '2025-01-06', summary: '地理标志与助农渠道同步拓展。' },
]

const home = ref<API.HomeVO>({})
const searching = ref(false)
const searched = ref(false)
const searchResult = ref<API.ProductVO[]>([])
const searchTotal = ref('0')
const loginUser = ref<API.UserVO | null>(null)
const cartCount = ref(0)
const traceCode = ref('')
const activeNav = ref('home')
const resultRef = ref<HTMLElement | null>(null)
const searchScope = ref('all')

const query = reactive<API.ProductQueryRequest>({
  current: 1,
  pageSize: 8,
  keyword: '',
})

const BANNER_INTERVAL_MS = 4000

type BannerSlide = {
  id: string
  title: string
  image: string
  link: string
}

const bannerIndex = ref(0)
let bannerTimer = 0

const banners = computed<BannerSlide[]>(() => {
  const slides = (home.value.bannerList ?? [])
    .map((item) => ({
      id: item.id || item.imageUrl || item.title || '',
      title: item.title || '',
      image: fileUrl(item.imageUrl),
      link: (item.linkUrl || '').trim(),
    }))
    .filter((item) => item.image)
  if (slides.length === 0) {
    return [{ id: 'fallback', title: '永春芦柑', image: HOME_ART.hero, link: '' }]
  }
  return slides
})

function showBanner(index: number) {
  const count = banners.value.length
  if (count === 0) {
    return
  }
  bannerIndex.value = (index + count) % count
}

function stopBanner() {
  if (bannerTimer) {
    window.clearInterval(bannerTimer)
    bannerTimer = 0
  }
}

function startBanner() {
  stopBanner()
  if (banners.value.length < 2) {
    return
  }
  bannerTimer = window.setInterval(() => {
    showBanner(bannerIndex.value + 1)
  }, BANNER_INTERVAL_MS)
}

function goBanner(index: number) {
  showBanner(index)
  startBanner()
}

function canOpenBanner(link: string) {
  if (!link || link === '/' || link === '#') {
    return false
  }
  return link.startsWith('/') || link.startsWith('http://') || link.startsWith('https://')
}

function openBanner(link: string) {
  if (!canOpenBanner(link)) {
    return
  }
  if (link.startsWith('http://') || link.startsWith('https://')) {
    window.open(link, '_blank', 'noopener,noreferrer')
    return
  }
  router.push(link)
}

function money(product: API.ProductVO) {
  if (product.price === undefined || product.price === null) {
    return ''
  }
  return Number(product.price).toFixed(2)
}

function toShelf(product: API.ProductVO): Shelf {
  return {
    id: product.id,
    name: product.name || '永春芦柑',
    spec: [product.spec, product.origin].filter(Boolean).join(' · '),
    price: money(product) || '待定',
    sold: '',
    cover: fileUrl(product.coverUrl) || HOME_ART.bigFruit,
    keyword: product.name || '芦柑',
  }
}

function zoneCards(designed: Shelf[], live: API.ProductVO[]) {
  if (live.length === 0) {
    return designed
  }
  return live.map(toShelf)
}

const saleCards = computed(() => (home.value.shelfList ?? []).map(toShelf))
const hotCards = computed(() => {
  if (saleCards.value.length > 0) {
    return saleCards.value
  }
  return zoneCards(HOT_SHELF, home.value.hotList ?? [])
})
const newCards = computed(() => zoneCards(NEW_SHELF, home.value.newList ?? []))
const pickCards = computed(() => zoneCards(PICKS, home.value.directList ?? []))

function noticeDate(value?: string) {
  if (!value || value.length < 10) {
    return ''
  }
  return value.slice(5, 10)
}

const noticeRows = computed(() => {
  const list = home.value.noticeList ?? []
  if (list.length === 0) {
    return NOTICE_FALLBACK.map((item) => ({ ...item, id: undefined as string | undefined }))
  }
  return list.slice(0, 4).map((item, index) => ({
    id: item.id,
    title: item.title || NOTICE_FALLBACK[index]?.title || '平台公告',
    date: noticeDate(item.createTime) || NOTICE_FALLBACK[index]?.date || '',
  }))
})

const newsRows = computed(() => {
  const list = home.value.newsList ?? []
  if (list.length === 0) {
    return NEWS_FALLBACK.map((item) => ({
      ...item,
      id: undefined as string | undefined,
      cover: HOME_ART.news,
    }))
  }
  return list.slice(0, 2).map((item, index) => ({
    id: item.id,
    title: item.title || NEWS_FALLBACK[index]?.title || '产业资讯',
    date: item.createTime?.slice(0, 10) || NEWS_FALLBACK[index]?.date || '',
    summary: item.summary || NEWS_FALLBACK[index]?.summary || '',
    cover: fileUrl(item.coverUrl) || HOME_ART.news,
  }))
})

const originCard = computed(() => {
  const first = home.value.originList?.[0]
  if (!first) {
    return {
      id: undefined as string | undefined,
      text: '走进永春芦柑之乡。中国芦柑之乡，地理标志产品。永春芦柑皮薄易剥，汁多化渣，是福建泉州的招牌鲜果。',
      cover: HOME_ART.origin,
    }
  }
  return {
    id: first.id,
    text: first.summary || first.title || '走进永春芦柑之乡。中国芦柑之乡，地理标志产品。永春芦柑皮薄易剥，汁多化渣，是福建泉州的招牌鲜果。',
    cover: fileUrl(first.coverUrl) || HOME_ART.origin,
  }
})

function openArticleList(type: 'notice' | 'news' | 'origin') {
  router.push({ path: '/article', query: { type } })
}

function openArticle(item: { id?: string }, type: 'notice' | 'news' | 'origin') {
  if (!item.id) {
    openArticleList(type)
    return
  }
  router.push({ path: '/article/detail', query: { id: item.id, type } })
}

function openShelf(item: Shelf) {
  if (item.id) {
    router.push({ path: '/product/detail', query: { id: item.id } })
    return
  }
  quickSearch(item.keyword)
}

function goAnchor(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onNav(item: (typeof NAVS)[number]) {
  activeNav.value = item.key
  if (item.action === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    resetSearch()
    return
  }
  if (item.action === 'anchor' && item.id) {
    goAnchor(item.id)
    return
  }
  if (item.action === 'route' && item.path) {
    router.push(item.path)
    return
  }
  if (item.word) {
    quickSearch(item.word)
  }
}

async function loadPresale() {
  try {
    const response = await listOpenPresaleActivityVoByPage({ current: 1, pageSize: 4 })
    presaleList.value = response.data.code === 0 ? response.data.data?.list ?? [] : []
  } catch {
    presaleList.value = []
  }
}

async function loadHome() {
  try {
    const response = await getHomeVo()
    if (response.data.code === 0 && response.data.data) {
      home.value = response.data.data
    }
  } catch {
    message.error('首页加载失败')
  }
}

async function loadSession() {
  try {
    const response = await getLoginUser({ skipAuthRedirect: true })
    loginUser.value = response.data.code === 0 ? response.data.data ?? null : null
  } catch {
    loginUser.value = null
  }
  if (!loginUser.value) {
    cartCount.value = 0
    return
  }
  try {
    const response = await listMyCartVoByPage({ current: 1, pageSize: 50 }, { skipAuthRedirect: true })
    cartCount.value = response.data.code === 0 ? (response.data.data?.list ?? []).length : 0
  } catch {
    cartCount.value = 0
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
      nextTick(() => resultRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  } catch {
    message.error('搜索失败')
  } finally {
    searching.value = false
  }
}

function quickSearch(word: string) {
  query.keyword = word
  query.categoryId = undefined
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
  query.keyword = ''
  query.categoryId = undefined
  query.current = 1
}

function askTrace() {
  const code = traceCode.value.trim()
  if (!/^YC\d{14}$/.test(code)) {
    message.warning('请输入 16 位溯源码')
    return
  }
  router.push('/t/' + code)
}

function resultShelf(product: API.ProductVO, index: number): Shelf {
  return {
    id: product.id,
    name: product.name || '永春芦柑',
    spec: [product.spec, product.origin].filter(Boolean).join(' · '),
    price: money(product) || '待定',
    sold: '',
    cover: fileUrl(product.coverUrl) || HOME_ART.bigFruit,
    keyword: product.name || '芦柑',
  }
}

watch(banners, (list) => {
  if (bannerIndex.value >= list.length) {
    bannerIndex.value = 0
  }
  startBanner()
}, { immediate: true })

onMounted(() => {
  loadHome()
  loadPresale()
  loadSession()
})

onBeforeUnmount(stopBanner)
</script>

<template>
  <div id="home-page">
    <div class="welcome">
      <div class="rail welcome-inner">
        <span>欢迎来到 泉州永春芦柑营销平台　|　原产地直供 · 产地溯源 · 助农兴农</span>
        <nav class="welcome-links">
          <router-link v-if="!loginUser" to="/user/login">登录 / 注册</router-link>
          <router-link v-else to="/user/profile">{{ loginUser.userName || loginUser.userAccount }}</router-link>
          <router-link to="/user/profile">个人中心</router-link>
          <router-link v-if="loginUser && (loginUser.userRole === 'admin' || loginUser.userRole === 'operator')" to="/admin">管理后台</router-link>
          <router-link to="/user/login">商家中心</router-link>
          <router-link to="/user/profile">我的订单</router-link>
          <a href="mailto:service@yongchun-lugan.com">客服咨询</a>
        </nav>
      </div>
    </div>

    <header class="mast">
      <div class="rail mast-inner">
        <router-link to="/" class="brand" @click="resetSearch">
          <img class="brand-mark" :src="HOME_ART.logo" alt="" />
          <span>
            <strong>泉州永春芦柑营销平台</strong>
            <small>永春芦柑 · 产地直供 · 助农兴农</small>
          </span>
        </router-link>
        <form class="search" @submit.prevent="search(true)">
          <select v-model="searchScope" aria-label="搜索范围">
            <option value="all">搜索商品、分类、产地</option>
            <option value="goods">商品</option>
            <option value="cate">分类</option>
            <option value="origin">产地</option>
          </select>
          <input v-model="query.keyword" type="search" placeholder="永春芦柑、芦柑礼盒、永春土特产" />
          <button type="submit">搜索</button>
        </form>
        <router-link to="/cart" class="cart-entry">
          <span class="cart-icon" aria-hidden="true" />
          购物车 ({{ cartCount }})
        </router-link>
      </div>
    </header>

    <nav class="main-nav">
      <div class="rail">
        <button
          v-for="item in NAVS"
          :key="item.key"
          type="button"
          :class="{ active: activeNav === item.key }"
          @click="onNav(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </nav>

    <main class="rail body">
      <section class="hero">
        <aside class="cats">
          <h2><i aria-hidden="true" />全部商品分类</h2>
          <button v-for="item in CATS" :key="item.name" type="button" @click="quickSearch(item.word)">
            <span class="dot" />{{ item.name }}
          </button>
        </aside>
        <div
          class="banner"
          role="region"
          aria-roledescription="carousel"
          aria-label="首页轮播"
          @mouseenter="stopBanner"
          @mouseleave="startBanner"
        >
          <div
            v-for="(item, index) in banners"
            :key="`${item.id}-${index}`"
            class="banner-slide"
            :class="{ active: index === bannerIndex, link: canOpenBanner(item.link) }"
            @click="openBanner(item.link)"
          >
            <img :src="item.image" :alt="item.title || '首页轮播'" />
          </div>
          <template v-if="banners.length > 1">
            <button type="button" class="banner-arrow prev" aria-label="上一张" @click="goBanner(bannerIndex - 1)">‹</button>
            <button type="button" class="banner-arrow next" aria-label="下一张" @click="goBanner(bannerIndex + 1)">›</button>
            <div class="banner-dots">
              <button
                v-for="(item, index) in banners"
                :key="`dot-${item.id}-${index}`"
                type="button"
                :class="{ on: index === bannerIndex }"
                :aria-label="`第 ${index + 1} 张`"
                @click="goBanner(index)"
              />
            </div>
          </template>
          <button type="button" class="core-tag" @click="quickSearch('达埔')">核心产区</button>
        </div>
      </section>

      <section class="services">
        <button type="button" @click="goAnchor('trace')">
          <b>一果一码溯源验真</b>
          <em>防伪验真</em>
          <span>扫码验真伪、批次、质检等全程信息</span>
        </button>
        <button type="button" @click="goAnchor('presale')">
          <b>采摘季预售</b>
          <em>平台首创</em>
          <span>果园直采 · 提前锁鲜 · 限时优惠</span>
        </button>
        <button type="button" @click="goAnchor('direct')">
          <b>芦柑产地直发</b>
          <span>永春产地 · 新鲜直达</span>
        </button>
        <button type="button" @click="goAnchor('hot')">
          <b>品质保障</b>
          <span>严格筛选 · 坏果包赔</span>
        </button>
      </section>

      <section v-if="searched" id="result" ref="resultRef" class="block">
        <header class="block-head">
          <h2>搜索结果</h2>
          <p>共 {{ searchTotal }} 件</p>
          <button type="button" class="more" @click="resetSearch">清空</button>
        </header>
        <a-spin :spinning="searching">
          <a-empty v-if="searchResult.length === 0" description="没有找到符合条件的芦柑" />
          <div v-else class="goods goods-4">
            <article v-for="(product, index) in searchResult" :key="product.id ?? index" class="card">
              <button type="button" class="hit" @click="openShelf(resultShelf(product, index))">
                <span class="thumb" :style="{ backgroundImage: `url(${fileUrl(product.coverUrl) || HOME_ART.bigFruit})` }" />
                <h3>{{ product.name || '永春芦柑' }}</h3>
                <p>{{ [product.spec, product.origin].filter(Boolean).join(' · ') }}</p>
                <strong>¥{{ money(product) || '待定' }}</strong>
              </button>
              <button type="button" class="add" @click="openShelf(resultShelf(product, index))">加入购物车</button>
            </article>
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

      <section id="hot" class="block">
        <header class="block-head">
          <h2>{{ saleCards.length > 0 ? '在售商品' : '热门芦柑推荐' }}</h2>
          <em class="flag">人气热卖</em>
          <p>永春核心产区直供，当季新鲜，香甜多汁</p>
          <button type="button" class="more" @click="quickSearch('精品果')">查看更多</button>
        </header>
        <div class="goods goods-4">
          <article v-for="item in hotCards" :key="item.id || item.name" class="card">
            <button type="button" class="hit" @click="openShelf(item)">
              <span class="thumb" :style="item.cover ? { backgroundImage: `url(${item.cover})` } : undefined">
                <i v-if="item.badge" class="badge">{{ item.badge }}</i>
              </span>
              <h3>{{ item.name }}</h3>
              <p>{{ item.spec }}</p>
              <div class="price-row">
                <strong>¥{{ item.price }}</strong>
                <span v-if="item.sold">已售 {{ item.sold }} 件</span>
              </div>
            </button>
            <button type="button" class="add" @click="openShelf(item)">加入购物车</button>
          </article>
        </div>
      </section>

      <section id="fresh" class="block">
        <header class="block-head">
          <h2>新品上架</h2>
          <p>新鲜上市 · 特色产品 · 值得尝鲜</p>
          <button type="button" class="more" @click="quickSearch('新品')">查看更多</button>
        </header>
        <div class="goods goods-6">
          <article v-for="item in newCards" :key="item.id || item.name" class="card compact">
            <button type="button" class="hit" @click="openShelf(item)">
              <span class="thumb" :style="item.cover ? { backgroundImage: `url(${item.cover})` } : undefined" />
              <h3>{{ item.name }}</h3>
              <p>{{ item.spec }}</p>
              <strong>¥{{ item.price }}</strong>
            </button>
          </article>
        </div>
      </section>

      <section id="direct" class="block">
        <header class="block-head">
          <h2>产地直供专区</h2>
          <p>永春核心产区 · 果园直发 · 产地地道风味</p>
          <button type="button" class="more" @click="quickSearch('达埔')">查看更多产地</button>
        </header>
        <div class="zones">
          <article class="zone">
            <span class="zone-photo" :style="{ backgroundImage: `url(${HOME_ART.dapu})` }" />
            <div>
              <h3>永春达埔产区</h3>
              <p>核心产区，果园直供，日照充足，糖酸比高，品质上乘。</p>
              <button type="button" @click="quickSearch('达埔')">进入该产区专区</button>
            </div>
          </article>
          <article class="picks">
            <h3>推荐产品</h3>
            <button v-for="item in pickCards" :key="item.name" type="button" class="pick" @click="openShelf(item)">
              <span class="mini" :style="item.cover ? { backgroundImage: `url(${item.cover})` } : undefined" />
              <span>
                <strong>{{ item.name }}</strong>
                <em>¥{{ item.price }}</em>
                <small v-if="item.spec">{{ item.spec }}</small>
              </span>
            </button>
          </article>
          <article class="zone">
            <span class="zone-photo" :style="{ backgroundImage: `url(${HOME_ART.penghu})` }" />
            <div>
              <h3>蓬壶产区</h3>
              <p>山地生态种植，果肉饱满，风味清甜。</p>
              <button type="button" @click="quickSearch('蓬壶')">进入蓬壶专区</button>
            </div>
          </article>
        </div>
      </section>

      <section id="news" class="news-row">
        <article>
          <header>
            <h2>平台公告</h2>
            <button type="button" class="more" @click="openArticleList('notice')">更多</button>
          </header>
          <ul>
            <li v-for="item in noticeRows" :key="item.id || item.title">
              <button type="button" class="notice-hit" @click="openArticle(item, 'notice')">
                <span>{{ item.title }}</span>
                <time>{{ item.date }}</time>
              </button>
            </li>
          </ul>
        </article>
        <article>
          <header>
            <h2>永春芦柑产业资讯</h2>
            <button type="button" class="more" @click="openArticleList('news')">更多</button>
          </header>
          <button
            v-for="item in newsRows"
            :key="item.id || item.title"
            type="button"
            class="story story-hit"
            @click="openArticle(item, 'news')"
          >
            <span class="mini" :style="{ backgroundImage: `url(${item.cover})` }" />
            <span class="story-copy">
              <strong>{{ item.title }}</strong>
              <time>{{ item.date }}</time>
              <em>{{ item.summary }}</em>
            </span>
          </button>
        </article>
        <article>
          <header>
            <h2>产地介绍</h2>
            <button type="button" class="more" @click="openArticleList('origin')">更多</button>
          </header>
          <button type="button" class="story story-hit" @click="openArticle(originCard, 'origin')">
            <span class="mini tall" :style="{ backgroundImage: `url(${originCard.cover})` }" />
            <p class="origin-copy">{{ originCard.text }}</p>
          </button>
        </article>
      </section>

      <section class="split">
        <article id="presale" class="panel">
          <header class="block-head">
            <h2>采摘季预售</h2>
            <p>果园直采 · 提前锁鲜 · 锁定当季好芦柑</p>
          </header>
          <div class="presale">
            <span class="thumb gift" :style="{ backgroundImage: `url(${HOME_ART.gift})` }" />
            <dl v-if="leadPresale">
              <div><dt>预售产品</dt><dd>{{ leadPresale.productName || leadPresale.title }}</dd></div>
              <div><dt>开摘日</dt><dd>{{ leadPresale.openPickDate }}</dd></div>
              <div><dt>预计发货</dt><dd>{{ leadPresale.expectShipDate }}</dd></div>
              <div><dt>定金比例</dt><dd>{{ Math.round(Number(leadPresale.depositRatio || 0) * 100) }}%，尾款为总额减去定金</dd></div>
              <div><dt>定金截止</dt><dd>{{ leadPresale.depositDeadline }}</dd></div>
              <div><dt>尾款截止</dt><dd>{{ leadPresale.balanceDeadline }}</dd></div>
              <div><dt>剩余数量</dt><dd>{{ leadPresale.remainStock ?? 0 }} 份（已订 {{ leadPresale.soldStock ?? 0 }} 份）</dd></div>
            </dl>
            <dl v-else>
              <div><dt>预售批次</dt><dd>当前没有进行中的采摘批次</dd></div>
            </dl>
          </div>
          <button type="button" class="solid" @click="router.push('/presale')">立即预订</button>
        </article>
        <article id="trace" class="panel">
          <header class="block-head">
            <h2>一果一码溯源验真</h2>
            <p>扫码或输入 16 位溯源码，查看采摘、质检、入库、出库</p>
          </header>
          <p class="sample">示例：YC20261101000001</p>
          <form class="trace-form" @submit.prevent="askTrace">
            <input v-model="traceCode" maxlength="32" placeholder="请输入 16 位溯源码" />
            <button type="submit">查询</button>
          </form>
          <ol class="flow">
            <li>采摘</li>
            <li>质检</li>
            <li>入库</li>
            <li>出库</li>
          </ol>
        </article>
      </section>

      <section id="group" class="group">
        <div>
          <h2>团购批发 / 企业采购</h2>
          <p>面向水果店、学校、工会与商超等渠道订购，批发及定制礼盒服务。</p>
        </div>
        <img class="group-fruit" :src="HOME_ART.pile" alt="" />
        <ul>
          <li>大单采购 · 价格更优</li>
          <li>要求大货可谈</li>
          <li>专属客服 · 一单一跟</li>
        </ul>
        <button type="button" @click="router.push('/promotion')">进入团购批发</button>
      </section>

      <section class="promises">
        <article><b>产地直发</b><span>永春果园，新鲜到家</span></article>
        <article><b>正品保障</b><span>地理标志，源头可查</span></article>
        <article><b>贴心服务</b><span>在线客服，快速响应</span></article>
        <article><b>售后无忧</b><span>坏果包赔，放心购买</span></article>
      </section>
    </main>

    <footer class="foot">
      <div class="rail foot-grid">
        <div>
          <strong>泉州永春芦柑营销平台</strong>
          <p>永春芦柑 · 产地直供 · 助农兴农</p>
        </div>
        <div>
          <strong>帮助中心</strong>
          <p>购物指南</p>
          <p>支付方式</p>
          <p>配送说明</p>
          <p>售后服务</p>
        </div>
        <div>
          <strong>商家入驻</strong>
          <p><router-link to="/merchant/apply">商家入驻流程</router-link></p>
          <p><router-link to="/merchant/apply">入驻条件说明</router-link></p>
          <p><router-link to="/merchant/apply">商家管理规则</router-link></p>
        </div>
        <div>
          <strong>关于我们</strong>
          <p>平台介绍</p>
          <p>品牌故事</p>
          <p>联系方式</p>
        </div>
        <div>
          <strong>联系我们</strong>
          <p>客服热线：0595-0000000（8:30–18:00）</p>
          <p>客服邮箱：service@yongchun-lugan.com</p>
          <p>平台地址：福建省泉州市永春县（芦柑产业园区）</p>
        </div>
      </div>
      <p class="copy">© 2026 泉州永春芦柑营销平台　版权所有　|　闽ICP备00000000号</p>
    </footer>
  </div>
</template>

<style scoped>
#home-page {
  --mall: #f39800;
  --mall-deep: #e8870a;
  --price: #ff4d00;
  --ink: #333;
  --muted: #999;
  --line: #f0f0f0;
  min-height: 100vh;
  color: var(--ink);
  background: #f5f5f5;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.rail {
  box-sizing: border-box;
  width: min(1200px, calc(100% - 24px));
  margin: 0 auto;
}

.welcome {
  background: #fff;
  border-bottom: 1px solid #f2f2f2;
  color: #999;
  font-size: 12px;
}

.welcome-inner,
.mast-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 34px;
}

.welcome-links {
  display: flex;
  gap: 14px;
  white-space: nowrap;
}

.welcome-links a {
  color: #666;
}

.mast {
  background: #fff;
  padding: 16px 0 12px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 280px;
  color: var(--mall-deep);
  text-decoration: none;
}

.brand strong {
  display: block;
  font-size: 22px;
  line-height: 1.2;
}

.brand small {
  color: #b0b0b0;
  font-size: 12px;
}

.brand-mark {
  width: 46px;
  height: 46px;
  display: block;
}

.search {
  display: flex;
  flex: 1;
  max-width: 620px;
  height: 40px;
  overflow: hidden;
  border: 2px solid var(--mall);
  border-radius: 20px;
  background: #fff;
}

.search select,
.search input {
  border: 0;
  background: transparent;
  font: inherit;
  font-size: 13px;
  outline: none;
}

.search select {
  width: 168px;
  padding-left: 14px;
  color: #888;
}

.search input {
  flex: 1;
  min-width: 0;
}

.search button {
  width: 86px;
  border: 0;
  background: var(--mall);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.cart-entry {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--mall-deep);
  text-decoration: none;
  white-space: nowrap;
  font-size: 14px;
}

.cart-icon {
  width: 18px;
  height: 14px;
  border: 2px solid var(--mall-deep);
  border-top: 0;
  border-radius: 0 0 3px 3px;
  position: relative;
}

.cart-icon::before {
  content: '';
  position: absolute;
  left: 3px;
  top: -7px;
  width: 8px;
  height: 6px;
  border: 2px solid var(--mall-deep);
  border-bottom: 0;
  border-radius: 8px 8px 0 0;
}

.main-nav {
  background: var(--mall);
}

.main-nav .rail {
  display: flex;
  min-height: 44px;
  overflow-x: auto;
}

.main-nav button {
  flex: 0 0 auto;
  border: 0;
  background: transparent;
  color: #fff;
  padding: 0 22px;
  font: inherit;
  font-size: 15px;
  white-space: nowrap;
  cursor: pointer;
}

.main-nav button.active {
  background: var(--mall-deep);
}

.body {
  padding: 14px 0 24px;
}

.hero {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  gap: 12px;
  min-height: 340px;
}

.cats,
.card,
.panel,
.zone,
.picks,
.news-row article,
.services button,
.promises {
  background: #fff;
  border-radius: 8px;
}

.cats h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 12px 14px;
  border-radius: 8px 8px 0 0;
  background: var(--mall);
  color: #fff;
  font-size: 15px;
}

.cats h2 i {
  width: 14px;
  height: 2px;
  background: #fff;
  box-shadow: 0 4px 0 #fff, 0 8px 0 #fff;
}

.cats button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 11px 14px;
  border: 0;
  background: #fff;
  color: #444;
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}

.cats button:hover {
  background: #fff8ee;
  color: var(--mall-deep);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--mall);
  flex: none;
}

.banner {
  position: relative;
  overflow: hidden;
  height: 340px;
  border-radius: 8px;
  background: #fff6e4;
}

.banner-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.45s ease;
  pointer-events: none;
}

.banner-slide.active {
  z-index: 1;
  opacity: 1;
  pointer-events: auto;
}

.banner-slide.link {
  cursor: pointer;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.banner-arrow {
  position: absolute;
  top: 50%;
  z-index: 2;
  width: 32px;
  height: 32px;
  margin-top: -16px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: var(--mall-deep);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.banner-arrow.prev {
  left: 12px;
}

.banner-arrow.next {
  right: 12px;
}

.banner-dots {
  position: absolute;
  left: 0;
  right: 88px;
  bottom: 12px;
  z-index: 2;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.banner-dots button {
  width: 8px;
  height: 8px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85);
  cursor: pointer;
}

.banner-dots button.on {
  width: 18px;
  border-radius: 4px;
  background: var(--mall);
}

.core-tag {
  position: absolute;
  right: 28px;
  bottom: 36px;
  z-index: 3;
  border: 0;
  border-radius: 4px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--mall-deep);
  font-weight: 700;
  cursor: pointer;
}

.services {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.services button {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
  padding: 16px 14px;
  border: 0;
  text-align: left;
  cursor: pointer;
}

.services b {
  font-size: 15px;
}

.services em {
  padding: 0 6px;
  border-radius: 8px;
  background: #fff1df;
  color: var(--mall-deep);
  font-style: normal;
  font-size: 12px;
}

.services span,
.block-head p,
.card p,
.zone p,
.story p {
  color: var(--muted);
  font-size: 12px;
}

.services span {
  flex: 1 0 100%;
}

.block {
  margin-top: 16px;
}

.block-head,
.news-row header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.block-head h2,
.news-row h2,
.group h2 {
  margin: 0;
  font-size: 18px;
}

.block-head h2::before,
.news-row h2::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  margin-right: 8px;
  border-radius: 2px;
  background: var(--mall);
  vertical-align: -2px;
}

.block-head p {
  margin: 0;
}

.flag {
  padding: 1px 8px;
  border-radius: 10px;
  background: #ffefe0;
  color: var(--price);
  font-style: normal;
  font-size: 12px;
}

.more {
  margin-left: auto;
  border: 0;
  background: transparent;
  color: #aaa;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.goods-4 {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.goods-6 {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.card {
  padding: 10px;
  background: #fff;
  border-radius: 8px;
}

.hit {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.thumb,
.zone-photo,
.mini {
  display: block;
  width: 100%;
  aspect-ratio: 1.45;
  border-radius: 6px;
  background: #ececec center / cover no-repeat;
  position: relative;
}

.badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--mall);
  color: #fff;
  font-style: normal;
  font-size: 12px;
}

.card h3,
.pick strong {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
}

.price-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  width: 100%;
}

.card strong,
.pick em {
  color: var(--price);
  font-style: normal;
  font-size: 18px;
}

.price-row span,
.pick small {
  color: #bbb;
  font-size: 12px;
}

.add,
.zone button,
.solid,
.group > button,
.trace-form button {
  border: 0;
  background: var(--mall);
  color: #fff;
  cursor: pointer;
}

.add {
  width: 100%;
  height: 32px;
  margin-top: 8px;
  border-radius: 16px;
  font-size: 13px;
}

.pager {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.zones {
  display: grid;
  grid-template-columns: 1.15fr 0.9fr 1.15fr;
  gap: 12px;
}

.zone,
.picks {
  padding: 14px;
}

.zone {
  display: grid;
  grid-template-columns: 116px 1fr;
  gap: 12px;
}

.zone-photo {
  width: 116px;
  height: 116px;
  aspect-ratio: auto;
}

.zone-photo {
  background-size: cover;
}

.zone h3,
.picks h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.zone p {
  margin: 0 0 10px;
  line-height: 1.5;
}

.zone button {
  padding: 5px 12px;
  border-radius: 14px;
  font-size: 12px;
}

.pick {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.mini {
  width: 52px;
  height: 52px;
  aspect-ratio: 1;
  flex: none;
}

.pick em {
  display: block;
  font-size: 14px;
}

.news-row {
  display: grid;
  grid-template-columns: 1fr 1.15fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.news-row article {
  padding: 12px 14px;
}

.news-row ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.news-row li,
.story {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-top: 1px dashed #f0f0f0;
  font-size: 13px;
}

.news-row li {
  padding: 0;
}

.notice-hit {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.notice-hit:hover span {
  color: var(--mall-deep);
}

.news-row time {
  color: #bbb;
  font-size: 12px;
  white-space: nowrap;
}

.story {
  align-items: flex-start;
}

.story-hit {
  width: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.story-hit:hover strong,
.story-hit:hover .origin-copy {
  color: var(--mall-deep);
}

.story-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.story-copy em {
  color: #999;
  font-style: normal;
  font-size: 12px;
  line-height: 1.6;
}

.story .mini.tall {
  width: 92px;
  height: 72px;
}

.origin-copy {
  margin: 0;
  color: #666;
  font-size: 13px;
  line-height: 1.7;
}

.split {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 12px;
  margin-top: 16px;
}

.panel {
  padding: 14px 16px 16px;
}

.presale {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 14px;
  margin-bottom: 12px;
}

.presale .thumb {
  height: 180px;
  aspect-ratio: auto;
}

.presale dl {
  margin: 0;
}

.presale div {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 8px;
  padding: 4px 0;
  font-size: 13px;
}

.presale dt {
  color: #999;
}

.presale dd {
  margin: 0;
}

.solid {
  padding: 7px 18px;
  border-radius: 16px;
}

.sample {
  margin: 0 0 8px;
  color: #888;
  font-size: 12px;
}

.trace-form {
  display: flex;
  gap: 8px;
}

.trace-form input {
  flex: 1;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  font: inherit;
}

.trace-form button {
  width: 72px;
  border-radius: 4px;
}

.flow {
  display: flex;
  gap: 8px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.flow li {
  flex: 1;
  padding: 12px 0;
  border-radius: 6px;
  background: #fff6ea;
  color: var(--mall-deep);
  text-align: center;
  font-size: 13px;
}

.group {
  display: grid;
  grid-template-columns: 1.4fr 80px 1fr auto;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  padding: 18px 20px;
  border-radius: 8px;
  background: linear-gradient(90deg, #fff6ea, #ffe7c7);
}

.group p {
  margin: 6px 0 0;
  color: #9a3412;
  font-size: 13px;
}

.group ul {
  margin: 0;
  padding: 0;
  list-style: none;
  color: #9a3412;
  font-size: 13px;
  line-height: 1.8;
}

.group-fruit {
  width: 72px;
  height: 72px;
  object-fit: contain;
}

.group > button {
  padding: 8px 16px;
  border-radius: 18px;
}

.promises {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 12px;
  padding: 16px 8px;
  text-align: center;
}

.promises b {
  display: block;
  margin-bottom: 4px;
}

.promises span {
  color: #999;
  font-size: 12px;
}

.foot {
  margin-top: 8px;
  padding: 28px 0 16px;
  background: #4d4d4d;
  color: #ddd;
  font-size: 13px;
}

.foot-grid {
  display: grid;
  grid-template-columns: 1.3fr repeat(4, 1fr);
  gap: 18px;
}

.foot strong {
  display: block;
  margin-bottom: 10px;
  color: #fff;
}

.foot p {
  margin: 0 0 6px;
}

.copy {
  margin: 18px 0 0;
  text-align: center;
  color: #aaa;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .goods-6,
  .zones,
  .group {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 860px) {
  .hero,
  .services,
  .goods-4,
  .goods-6,
  .zones,
  .news-row,
  .split,
  .promises,
  .foot-grid,
  .mast-inner,
  .group {
    grid-template-columns: 1fr;
  }

  .welcome-inner,
  .mast-inner {
    flex-wrap: wrap;
  }
}
</style>
