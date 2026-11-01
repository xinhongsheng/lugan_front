<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { clearMenuItem, getMenuData } from '@ant-design-vue/pro-layout'
import { getLoginUser } from '@/api/userController'

const router = useRouter()
const route = useRoute()
const { menuData } = getMenuData(clearMenuItem(router.getRoutes()))

const LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" fill="#1f2b4d"/>
    <circle cx="16" cy="19" r="8" fill="#f7941d"/>
    <path d="M16 9c0-3 2-5 5-5" fill="none" stroke="#f4f4f2" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,
)}`

const collapsed = ref(window.innerWidth < 992)
const openKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([route.path])
const ready = ref(false)
const loginUser = ref<API.UserVO | null>(null)

const isFlush = computed(
  () =>
    route.path === '/' ||
    route.path.startsWith('/user/login') ||
    route.path.startsWith('/user/register') ||
    route.path.startsWith('/user/reset') ||
    route.path.startsWith('/user/profile'),
)

function avatarSrc(path?: string) {
  if (!path) {
    return ''
  }
  if (path.startsWith('http')) {
    return path
  }
  return `${import.meta.env.VITE_API_BASE_URL || ''}${path}`
}

function avatarText(user: API.UserVO) {
  return (user.userName || user.userAccount || '芦').slice(0, 1)
}

async function loadLoginUser() {
  try {
    const response = await getLoginUser({ skipAuthRedirect: true })
    loginUser.value = response.data.code === 0 ? response.data.data ?? null : null
  } catch {
    loginUser.value = null
  } finally {
    ready.value = true
  }
}

watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path]
    loadLoginUser()
  },
)

onMounted(loadLoginUser)

const layoutConf = reactive({
  title: '永春芦柑营销',
  logo: LOGO,
  layout: 'top' as const,
  navTheme: 'light' as const,
  headerTheme: 'light' as const,
  contentWidth: 'Fluid' as const,
  fixedHeader: true,
  fixSiderbar: false,
  menuData,
})
</script>

<template>
  <div id="site-shell" class="site-shell" :class="{ 'is-flush': isFlush }">
    <pro-layout
      v-bind="layoutConf"
      v-model:collapsed="collapsed"
      v-model:selected-keys="selectedKeys"
      v-model:open-keys="openKeys"
      :locale="false"
    >
      <template #rightContentRender>
        <router-link v-if="loginUser" to="/user/profile" class="avatar-link" title="个人中心">
          <a-avatar :size="32" shape="square" :src="avatarSrc(loginUser.userAvatar)">
            {{ avatarText(loginUser) }}
          </a-avatar>
        </router-link>
        <div v-else-if="ready" class="account">
          <router-link to="/user/login">登录</router-link>
          <router-link to="/user/register" class="register">注册</router-link>
        </div>
      </template>
      <div class="page-shell" :class="{ flush: isFlush }">
        <router-view />
      </div>
      <template #footerRender>
        <div v-if="!isFlush" class="footer">
          <p class="footer-main">泉州永春芦柑营销平台</p>
          <p class="footer-sub">产地直供 · 采摘批次可溯源 · 助农增收</p>
        </div>
      </template>
    </pro-layout>
  </div>
</template>

<style scoped>
.account {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-right: 12px;
}

.account a {
  color: var(--ink);
  font-size: 14px;
  font-weight: 500;
}

.account .register {
  padding: 6px 12px;
  background: var(--accent);
  color: var(--accent-ink);
  border-radius: var(--radius);
  text-decoration: none;
}

.avatar-link {
  display: inline-flex;
  margin-right: 8px;
  line-height: 0;
  border: 2px solid var(--ink);
  border-radius: var(--radius);
}

.page-shell {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 24px var(--page-gutter) 48px;
}

.page-shell.flush {
  max-width: none;
  padding: 0;
}

.footer {
  padding: 20px 0 28px;
  text-align: center;
  background: var(--surface);
}

.footer-main {
  margin: 0;
  color: var(--ink);
  font-size: 13px;
  font-weight: 500;
}

.footer-sub {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 12px;
}
</style>

<style>
.site-shell .ant-pro-top-nav-header {
  background: var(--bg) !important;
  box-shadow: none !important;
  border-bottom: 1px solid var(--field-2);
}

/* 顶栏与正文同一条内容轨，避免「导航全宽、内容收窄」的宽窄错位 */
.site-shell .ant-pro-top-nav-header-main {
  box-sizing: border-box !important;
  width: 100% !important;
  max-width: var(--content-max) !important;
  margin: 0 auto !important;
  padding-left: var(--page-gutter) !important;
  padding-right: var(--page-gutter) !important;
}

.site-shell .ant-pro-top-nav-header-logo h1 {
  color: var(--ink) !important;
  font-family: var(--font) !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  letter-spacing: -0.03em;
}

.site-shell .ant-menu-horizontal {
  border-bottom: none !important;
}

.site-shell .ant-layout-content {
  width: 100%;
}

.site-shell.is-flush .ant-layout-footer,
.site-shell.is-flush .ant-pro-top-nav-header,
.site-shell.is-flush .ant-layout-header {
  display: none !important;
}

.site-shell.is-flush .ant-pro-layout .ant-layout,
.site-shell.is-flush .ant-pro-layout-content,
.site-shell.is-flush .ant-layout-content {
  padding: 0 !important;
  margin: 0 !important;
  background: #f6f6f6 !important;
}
</style>
