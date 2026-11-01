<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import BasicLayout from '@/layout/BasicLayout.vue'

const theme = {
  token: {
    colorPrimary: '#f7941d',
    colorInfo: '#1f2b4d',
    colorLink: '#1f2b4d',
    colorLinkHover: '#f7941d',
    colorTextBase: '#1f2b4d',
    colorBgLayout: '#ffffff',
    colorBgContainer: '#ffffff',
    borderRadius: 4,
    fontSize: 16,
    fontFamily:
      "'Switzer', 'PingFang SC', 'HarmonyOS Sans SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif",
  },
  components: {
    Card: { borderRadiusLG: 4 },
    Button: { borderRadius: 4, controlHeight: 40 },
  },
}
</script>

<template>
  <a-config-provider :theme="theme" :locale="zhCN">
    <basic-layout />
  </a-config-provider>
</template>

<style>
@import './styles/tokens.css';

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font);
}

a {
  transition: color 0.2s var(--ease-out);
}

.ant-btn-primary:not(:disabled):not(.ant-btn-disabled) {
  border-color: var(--accent);
  background-color: var(--accent);
  color: var(--accent-ink);
  box-shadow: none;
  font-weight: 600;
}

.ant-btn-primary:not(:disabled):not(.ant-btn-disabled):hover {
  border-color: #e08312;
  background-color: #e08312;
  color: var(--accent-ink);
}

.ant-pro-basicLayout-content {
  margin: 0 !important;
}

.ant-layout-content {
  background: transparent !important;
}
</style>
