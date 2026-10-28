<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { userLogin } from '@/api/userController'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const form = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

async function submit() {
  loading.value = true
  try {
    const response = await userLogin(form)
    const body = response.data
    if (body.code !== 0) {
      message.error(body.message || '登录失败')
      return
    }
    message.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/user/profile'
    await router.push(redirect)
  } catch {
    message.error('登录失败，请确认 Redis 已启动')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div id="user-login-page">
    <a-card title="登录" class="card">
      <a-form layout="vertical" :model="form" @finish="submit">
        <a-form-item label="账号" name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
          <a-input v-model:value="form.userAccount" placeholder="至少 4 位" />
        </a-form-item>
        <a-form-item label="密码" name="userPassword" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model:value="form.userPassword" placeholder="至少 8 位" />
        </a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">登录</a-button>
      </a-form>
      <div class="links">
        <router-link to="/user/register">注册账号</router-link>
        <router-link to="/user/reset">找回密码</router-link>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
#user-login-page {
  display: flex;
  justify-content: center;
  padding: 48px 16px;
}

.card {
  width: 420px;
}

.links {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
</style>
