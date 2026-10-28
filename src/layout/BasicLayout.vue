<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { clearMenuItem, getMenuData } from '@ant-design-vue/pro-layout'

const router = useRouter()
const route = useRoute()
const { menuData } = getMenuData(clearMenuItem(router.getRoutes()))

const LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <circle cx="16" cy="20" r="10.5" fill="#ef8f2f"/>
    <path d="M16 9.5c0-3.2 2-5.2 5.2-5.2" fill="none" stroke="#2f7d46" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M16.6 7.4c1.8-1.6 4.4-1.7 6-.6-1 1.9-3.6 2.9-6 2.4z" fill="#2f7d46"/>
  </svg>`,
)}`

// 窄屏默认收起，避免 pro-layout 的移动端菜单遮住页面内容
const collapsed = ref(window.innerWidth < 992)
const openKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([route.path])

watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path]
  },
)

const layoutConf = reactive({
  title: '永春芦柑',
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
  <pro-layout
    id="basic-layout"
    v-bind="layoutConf"
    v-model:collapsed="collapsed"
    v-model:selected-keys="selectedKeys"
    v-model:open-keys="openKeys"
    :locale="false"
  >
    <template #rightContentRender>
      <div class="account">
        <router-link to="/user/login">登录</router-link>
        <router-link to="/user/register">注册</router-link>
      </div>
    </template>
    <router-view />
    <template #footerRender>
      <div class="footer">
        <p class="footer-main">泉州永春芦柑营销平台</p>
        <p class="footer-sub">产地直供 · 采摘批次可溯源 · 助农增收</p>
      </div>
    </template>
  </pro-layout>
</template>

<style scoped>
.account {
  display: flex;
  gap: 16px;
  margin-right: 16px;
}

.account a {
  color: rgba(0, 0, 0, 0.75);
}

.footer {
  padding: 20px 0 28px;
  border-top: 1px solid #eceee6;
  text-align: center;
}

.footer-main {
  margin: 0;
  color: #5c636e;
  font-size: 13px;
}

.footer-sub {
  margin: 4px 0 0;
  color: #a3a8b0;
  font-size: 12px;
}
</style>
