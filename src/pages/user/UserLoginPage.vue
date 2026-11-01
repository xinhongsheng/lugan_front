<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { userLogin } from '@/api/userController'
import UserAuthShell from '@/components/user/UserAuthShell.vue'

const REMEMBER_KEY = 'lugan_login_account'
const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CAPTCHA_COLORS = ['#5c4030', '#2a6fdb', '#e24b8a', '#f26522']

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const showPassword = ref(false)
const remember = ref(false)
const captcha = ref('')
const captchaInput = ref('')
const captchaAngles = ref<number[]>([0, 0, 0, 0])
const errorText = ref('')
const form = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

function readRememberedAccount() {
  try {
    return localStorage.getItem(REMEMBER_KEY) ?? ''
  } catch {
    return ''
  }
}

function writeRememberedAccount(account: string) {
  try {
    if (account) {
      localStorage.setItem(REMEMBER_KEY, account)
      return
    }
    localStorage.removeItem(REMEMBER_KEY)
  } catch {
    // 浏览器禁用本地存储时仍允许登录，只是记不住账号。
  }
}

function refreshCaptcha() {
  let next = ''
  const angles: number[] = []
  for (let index = 0; index < 4; index += 1) {
    next += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)]
    angles.push(Math.round((Math.random() - 0.5) * 28))
  }
  captcha.value = next
  captchaAngles.value = angles
  captchaInput.value = ''
}

refreshCaptcha()

onMounted(() => {
  const saved = readRememberedAccount()
  if (saved) {
    form.userAccount = saved
    remember.value = true
  }
})

async function submit() {
  errorText.value = ''
  const account = form.userAccount?.trim() ?? ''
  const password = form.userPassword ?? ''
  if (!account) {
    errorText.value = '请输入手机号或用户名'
    return
  }
  if (!password) {
    errorText.value = '请输入登录密码'
    return
  }
  if (captchaInput.value.trim().toUpperCase() !== captcha.value) {
    errorText.value = '验证码不正确，请重新输入'
    refreshCaptcha()
    return
  }
  form.userAccount = account
  loading.value = true
  try {
    const response = await userLogin(form)
    const body = response.data
    if (body.code !== 0) {
      message.error(body.message || '登录失败')
      refreshCaptcha()
      return
    }
    writeRememberedAccount(remember.value ? account : '')
    message.success('已登录')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/user/profile'
    await router.push(redirect)
  } catch {
    message.error('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div id="user-login-page">
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
            placeholder="请输入手机号/用户名"
            aria-label="手机号或用户名"
          />
        </label>
        <label class="field">
          <span class="lead" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="6" y="11" width="12" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.7" />
              <path
                d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
              />
            </svg>
          </span>
          <input
            v-model="form.userPassword"
            name="userPassword"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="请输入登录密码"
            aria-label="登录密码"
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
        <div class="captcha-row">
          <label class="field">
            <span class="lead" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 3.5 19 6.5v6c0 4.2-2.8 7-7 8.5-4.2-1.5-7-4.3-7-8.5v-6L12 3.5Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                />
              </svg>
            </span>
            <input
              v-model="captchaInput"
              name="captcha"
              maxlength="4"
              autocomplete="off"
              spellcheck="false"
              placeholder="请输入验证码"
              aria-label="验证码"
            />
          </label>
          <button class="captcha-plate" type="button" aria-label="验证码，点击刷新" @click="refreshCaptcha">
            <span
              v-for="(char, index) in captcha"
              :key="`${captcha}-${index}`"
              :style="{ color: CAPTCHA_COLORS[index], transform: `rotate(${captchaAngles[index]}deg)` }"
            >
              {{ char }}
            </span>
          </button>
          <button class="refresh" type="button" aria-label="换一张验证码" @click="refreshCaptcha">
            <svg viewBox="0 0 24 24">
              <path
                d="M20 12a8 8 0 1 1-2.2-5.5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <path
                d="M20 4.5V9h-4.5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <div class="meta">
          <label class="remember">
            <input v-model="remember" type="checkbox" />
            <span>记住我</span>
          </label>
          <router-link :to="{ path: '/user/reset', query: route.query }">忘记密码?</router-link>
        </div>
        <p v-if="errorText" class="form-error" role="alert">{{ errorText }}</p>
        <button class="submit" type="submit" :disabled="loading">{{ loading ? '登录中…' : '立即登录' }}</button>
        <p class="switch">
          还没有账号？
          <router-link :to="{ path: '/user/register', query: route.query }">立即注册</router-link>
        </p>
      </form>
    </UserAuthShell>
  </div>
</template>

<style scoped>
#user-login-page {
  min-height: 100%;
}
</style>
