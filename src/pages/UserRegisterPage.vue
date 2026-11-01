<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { userRegister } from '@/api/userController'
import UserAuthShell from '@/components/UserAuthShell.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const showPassword = ref(false)
const errorText = ref('')
const form = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

async function submit() {
  errorText.value = ''
  const account = form.userAccount?.trim() ?? ''
  const password = form.userPassword ?? ''
  const checkPassword = form.checkPassword ?? ''
  if (account.length < 4) {
    errorText.value = '账号至少 4 位'
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
  loading.value = true
  try {
    const response = await userRegister(form)
    const body = response.data
    if (body.code !== 0) {
      message.error(body.message || '注册失败')
      return
    }
    message.success('注册成功，请登录')
    await router.push({ path: '/user/login', query: route.query })
  } catch {
    message.error('注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div id="user-register-page">
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
          <input
            v-model="form.userAccount"
            name="userAccount"
            autocomplete="username"
            placeholder="请输入账号，至少 4 位"
            aria-label="账号"
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
            v-model="form.userPassword"
            name="userPassword"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="请输入密码，至少 8 位"
            aria-label="密码"
          />
          <button
            class="trail"
            type="button"
            :aria-label="showPassword ? '隐藏密码' : '显示密码'"
            @click="showPassword = !showPassword"
          >
            <svg v-if="showPassword" viewBox="0 0 24 24">
              <path d="M3 3l18 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              <path
                d="M2 12s3.5-6 10-6c1.6 0 3 .3 4.2.8M22 12s-3.5 6-10 6c-1.6 0-3-.3-4.2-.8"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              />
            </svg>
            <svg v-else viewBox="0 0 24 24">
              <path
                d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
              />
              <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7" />
            </svg>
          </button>
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
            name="checkPassword"
            type="password"
            autocomplete="new-password"
            placeholder="请再次输入密码"
            aria-label="确认密码"
          />
        </label>
        <p v-if="errorText" class="form-error" role="alert">{{ errorText }}</p>
        <button class="submit" type="submit" :disabled="loading">{{ loading ? '注册中…' : '立即注册' }}</button>
        <p class="switch">
          已有账号？
          <router-link :to="{ path: '/user/login', query: route.query }">立即登录</router-link>
        </p>
      </form>
    </UserAuthShell>
  </div>
</template>

<style scoped>
#user-register-page {
  min-height: 100%;
}
</style>
