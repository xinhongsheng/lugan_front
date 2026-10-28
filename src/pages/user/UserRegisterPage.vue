<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { userRegister } from '@/api/userController'

const router = useRouter()
const loading = ref(false)
const form = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

async function submit() {
  loading.value = true
  try {
    const response = await userRegister(form)
    const body = response.data
    if (body.code !== 0) {
      message.error(body.message || '注册失败')
      return
    }
    message.success('注册成功，请登录')
    await router.push('/user/login')
  } catch {
    message.error('注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div id="user-register-page">
    <a-card title="注册" class="card">
      <a-form layout="vertical" :model="form" @finish="submit">
        <a-form-item label="账号" name="userAccount" :rules="[{ required: true, min: 4, message: '账号至少 4 位' }]">
          <a-input v-model:value="form.userAccount" />
        </a-form-item>
        <a-form-item label="密码" name="userPassword" :rules="[{ required: true, min: 8, message: '密码至少 8 位' }]">
          <a-input-password v-model:value="form.userPassword" />
        </a-form-item>
        <a-form-item label="确认密码" name="checkPassword" :rules="[{ required: true, message: '请再次输入密码' }]">
          <a-input-password v-model:value="form.checkPassword" />
        </a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">注册</a-button>
      </a-form>
      <div class="links">
        <router-link to="/user/login">已有账号，去登录</router-link>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
#user-register-page {
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
