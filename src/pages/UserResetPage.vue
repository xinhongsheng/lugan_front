<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { resetPassword } from '@/api/userController'
import UserAuthShell from '@/components/UserAuthShell.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const errorText = ref('')
const form = reactive<API.UserResetPasswordRequest>({
  userAccount: '',
  userPhone: '',
  newPassword: '',
  checkPassword: '',
})

async function submit() {
  errorText.value = ''
  const account = form.userAccount?.trim() ?? ''
  const phone = form.userPhone?.trim() ?? ''
  const password = form.newPassword ?? ''
  const checkPassword = form.checkPassword ?? ''
  if (!account) {
    errorText.value = '请输入账号'
    return
  }
  if (!/^1\d{10}$/.test(phone)) {
    errorText.value = '请输入 11 位注册手机号'
    return
  }
  if (password.length < 8) {
    errorText.value = '密码至少 8 位'
    return
  }
  if (password !== checkPassword) {
    errorText.value = '两次密码不一致'
    return
  }
  form.userAccount = account
  form.userPhone = phone
  loading.value = true
  try {
    const response = await resetPassword(form)
    const body = response.data
    if (body.code !== 0) {
      message.error(body.message || '重置失败')
      return
    }
    message.success('密码已更新，请登录')
    await router.push({ path: '/user/login', query: route.query })
  } catch {
    message.error('重置失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div id="user-reset-page">
    <UserAuthShell>
      <form class="auth-form" @submit.prevent="submit">
        <label class="field">
          <span class="lead" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.7" />
              <path
                d="M5.5 19c1.2-3 3.4-4.5 6.5-4.5s5.3 1.5 6.5 4.5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              />
            </svg>
          </span>
          <input v-model="form.userAccount" autocomplete="username" placeholder="请输入账号" aria-label="账号" />
        </label>
        <label class="field">
          <span class="lead" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="7" y="3" width="10" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.7" />
              <path d="M11 18h2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
          </span>
          <input
            v-model="form.userPhone"
            inputmode="numeric"
            maxlength="11"
            autocomplete="tel"
            placeholder="请输入注册手机号"
            aria-label="注册手机号"
          />
        </label>
        <label class="field">
          <span class="lead" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="6" y="11" width="12" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.7" />
              <path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" fill="none" stroke="currentColor" stroke-width="1.7" />
            </svg>
          </span>
          <input
            v-model="form.newPassword"
            type="password"
            autocomplete="new-password"
            placeholder="请输入新密码，至少 8 位"
            aria-label="新密码"
          />
        </label>
        <label class="field">
          <span class="lead" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="6" y="11" width="12" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.7" />
              <path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" fill="none" stroke="currentColor" stroke-width="1.7" />
            </svg>
          </span>
          <input
            v-model="form.checkPassword"
            type="password"
            autocomplete="new-password"
            placeholder="请再次输入新密码"
            aria-label="确认新密码"
          />
        </label>
        <p v-if="errorText" class="form-error" role="alert">{{ errorText }}</p>
        <button class="submit" type="submit" :disabled="loading">{{ loading ? '提交中…' : '重置密码' }}</button>
        <p class="switch">
          想起密码了？
          <router-link :to="{ path: '/user/login', query: route.query }">返回登录</router-link>
        </p>
      </form>
    </UserAuthShell>
  </div>
</template>

<style scoped>
#user-reset-page {
  min-height: 100%;
}
</style>
