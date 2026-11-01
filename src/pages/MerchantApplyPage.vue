<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { addMerchant, getMyMerchant, updateMerchant } from '@/api/merchantController'
import MerchantNav from '@/components/MerchantNav.vue'

const loading = ref(false)
const form = reactive<API.Merchant>({
  farmerName: '',
  phone: '',
  shopName: '',
  originAreaCode: 'DAPU',
  address: '',
  licenseNo: '',
  licenseUrl: '',
  originProofUrl: '',
  originProof: '',
  auditStatus: '',
  auditNote: '',
})

const statusText: Record<string, string> = {
  pending: '待审核',
  passed: '已通过',
  rejected: '已驳回',
}

async function load() {
  const response = await getMyMerchant()
  if (response.data.code !== 0 || !response.data.data) {
    return
  }
  Object.assign(form, response.data.data)
}

async function submit() {
  loading.value = true
  try {
    const response = form.auditStatus === 'rejected' ? await updateMerchant(form) : await addMerchant(form)
    if (response.data.code !== 0) {
      message.error(response.data.message || '提交失败')
      return
    }
    message.success('已提交审核')
    await load()
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div id="merchant-apply-page">
    <MerchantNav />
    <a-card title="入驻资料">
      <p v-if="form.auditStatus">当前状态：{{ statusText[form.auditStatus] || form.auditStatus }}</p>
      <p v-if="form.auditNote">驳回说明：{{ form.auditNote }}</p>
      <a-form layout="vertical">
        <a-form-item label="农户姓名"><a-input v-model:value="form.farmerName" /></a-form-item>
        <a-form-item label="联系电话"><a-input v-model:value="form.phone" /></a-form-item>
        <a-form-item label="店铺名称"><a-input v-model:value="form.shopName" /></a-form-item>
        <a-form-item label="授权产区">
          <a-select v-model:value="form.originAreaCode">
            <a-select-option value="DAPU">达埔</a-select-option>
            <a-select-option value="PENGHU">蓬壶</a-select-option>
            <a-select-option value="HUSHAN">岵山</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="产地地址"><a-input v-model:value="form.address" /></a-form-item>
        <a-form-item label="执照号"><a-input v-model:value="form.licenseNo" /></a-form-item>
        <a-form-item label="执照图片地址"><a-input v-model:value="form.licenseUrl" /></a-form-item>
        <a-form-item label="产地证明图片地址"><a-input v-model:value="form.originProofUrl" /></a-form-item>
        <a-form-item label="产地证明说明"><a-textarea v-model:value="form.originProof" /></a-form-item>
        <a-button type="primary" :loading="loading" :disabled="form.auditStatus === 'pending' || form.auditStatus === 'passed'" @click="submit">
          提交
        </a-button>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped>
#merchant-apply-page {
  max-width: 720px;
  margin: 24px auto;
}
</style>
