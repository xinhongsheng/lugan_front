<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { resetPassword } from '@/api/userController'

const router = useRouter()
const loading = ref(false)
const form = reactive<API.UserResetPasswordRequest>({
  userAccount: '',
  userPhone: '',
  newPassword: '',
  checkPassword: '',
})

async function submit() {
  loading.value = true
  try {
    const response = await resetPassword(form)
    const body = response.data
    if (body.code !== 0) {
      message.error(body.message || '重置失败')
      return
    }
    message.success('密码已更新，请登录')
    await router.push('/user/login')
  } catch {
    message.error('重置失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div id="user-reset-page">
    <a-card title="找回密码" class="card">
      <a-form layout="vertical" :model="form" @finish="submit">
        <a-form-item label="账号" name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
          <a-input v-model:value="form.userAccount" />
        </a-form-item>
        <a-form-item label="手机号" name="userPhone" :rules="[{ required: true, message: '请输入注册手机号' }]">
          <a-input v-model:value="form.userPhone" />
        </a-form-item>
        <a-form-item label="新密码" name="newPassword" :rules="[{ required: true, min: 8, message: '密码至少 8 位' }]">
          <a-input-password v-model:value="form.newPassword" />
        </a-form-item>
        <a-form-item label="确认密码" name="checkPassword" :rules="[{ required: true, message: '请再次输入密码' }]">
          <a-input-password v-model:value="form.checkPassword" />
        </a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">重置密码</a-button>
      </a-form>
      <div class="links">
        <router-link to="/user/login">返回登录</router-link>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
#user-reset-page {
  display: flex;
  justify-content: center;
  padding: 48px 16px;
}

.card {
  width: 420px;
}

.links {
  margin-top: 16px;
  text-align: right;
}
</style>
