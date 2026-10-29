<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { homePhoto } from '@/constants/home'

const route = useRoute()
const router = useRouter()

const mode = computed(() => (route.path.startsWith('/user/register') ? 'register' : 'login'))

function onModeChange(value: string | number) {
  const next = String(value)
  if (next === mode.value) {
    return
  }
  router.push(next === 'register' ? '/user/register' : '/user/login')
}
</script>

<template>
  <div id="user-auth-shell">
    <a-card :bordered="false" class="panel">
      <div class="portrait">
        <a-avatar :size="96" shape="circle" :src="homePhoto(2)" alt="永春芦柑" />
        <p class="name">永春芦柑</p>
      </div>
      <a-segmented
        block
        :value="mode"
        :options="[
          { label: '登录', value: 'login' },
          { label: '注册', value: 'register' },
        ]"
        @change="onModeChange"
      />
      <div class="form">
        <slot />
      </div>
    </a-card>
  </div>
</template>

<style scoped>
#user-auth-shell {
  display: flex;
  justify-content: center;
  padding: 12px 16px 8px;
}

.panel {
  width: 400px;
  max-width: 100%;
}

.portrait {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.portrait :deep(.ant-avatar) {
  box-shadow: 0 0 0 4px #fff, 0 0 0 6px #2f7d46;
}

.name {
  margin: 12px 0 0;
  color: #1c2430;
  font-family: KaiTi, STKaiti, serif;
  font-size: 22px;
  letter-spacing: 0.12em;
}

.form {
  margin-top: 20px;
}
</style>
