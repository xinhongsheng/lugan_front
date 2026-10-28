<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import BasicLayout from '@/layout/BasicLayout.vue'

const theme = {
  token: {
    colorPrimary: '#2f7d46',
    colorInfo: '#2f7d46',
    colorLink: '#2f7d46',
    colorLinkHover: '#4e9a5c',
    colorTextBase: '#1f2328',
    colorBgLayout: '#f6f7f3',
    borderRadius: 10,
    fontFamily:
      "'PingFang SC', 'HarmonyOS Sans SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Card: { borderRadiusLG: 16 },
  },
}
</script>

<template>
  <a-config-provider :theme="theme" :locale="zhCN">
    <basic-layout />
  </a-config-provider>
</template>

<style scoped>
:global(body) {
  background: #f6f7f3;
}

:global(a) {
  transition: color 0.2s;
}

/* pro-layout 自带的旧版样式会把主按钮刷回蓝色，这里按品牌色覆盖 */
:global(.ant-btn-primary:not(:disabled):not(.ant-btn-disabled)) {
  border-color: #2f7d46;
  background-color: #2f7d46;
  box-shadow: none;
}

:global(.ant-btn-primary:not(:disabled):not(.ant-btn-disabled):hover) {
  border-color: #4e9a5c;
  background-color: #4e9a5c;
}
</style>
