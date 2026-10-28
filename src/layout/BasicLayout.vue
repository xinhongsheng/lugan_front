<template>
  <a-layout id="basic-layout">
    <a-layout-header class="header">泉州永春芦柑营销平台</a-layout-header>
    <a-layout-content class="content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
#basic-layout {
  min-height: 100vh;
}

.header {
  color: #fff;
  font-size: 18px;
}

.content {
  padding: 24px;
}
</style>
