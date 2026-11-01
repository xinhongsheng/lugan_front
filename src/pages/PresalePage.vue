<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { listOpenPresaleActivityVoByPage } from '@/api/presaleActivityController'
import { addPresaleOrder, payDeposit } from '@/api/presaleOrderController'
import { listMyAddressVoByPage } from '@/api/addressController'
import { getLoginUser } from '@/api/userController'
import { PAY_CHANNEL_OPTIONS } from '@/constants/order'

const router = useRouter()
const activities = ref<API.PresaleActivityVO[]>([])
const addresses = ref<API.AddressVO[]>([])
const loggedIn = ref(false)
const acting = ref(false)
const activityId = ref<string>()
const addressId = ref<string>()
const quantity = ref(1)
const payChannel = ref('alipay')

function depositOpen(item: API.PresaleActivityVO) {
  if (!item.depositDeadline) {
    return false
  }
  return new Date(item.depositDeadline.replace(' ', 'T')).getTime() > Date.now()
}

async function load() {
  const [activityRes, loginRes] = await Promise.all([
    listOpenPresaleActivityVoByPage({ current: 1, pageSize: 20 }),
    getLoginUser({ skipAuthRedirect: true }),
  ])
  activities.value = activityRes.data.code === 0 ? activityRes.data.data?.list ?? [] : []
  loggedIn.value = loginRes.data.code === 0
  if (!activityId.value && activities.value[0]?.id) {
    activityId.value = activities.value[0].id
  }
  if (!loggedIn.value) {
    return
  }
  const addressRes = await listMyAddressVoByPage({ current: 1, pageSize: 20 })
  addresses.value = addressRes.data.code === 0 ? addressRes.data.data?.list ?? [] : []
  const preferred = addresses.value.find((item) => item.defaultFlag === 1) || addresses.value[0]
  addressId.value = preferred?.id
}

async function book() {
  const current = activities.value.find((item) => item.id === activityId.value)
  if (!current) {
    message.warning('请选择预售批次')
    return
  }
  if (!depositOpen(current)) {
    message.warning('已过定金截止时间')
    return
  }
  if (!loggedIn.value) {
    router.push({ path: '/user/login', query: { redirect: '/presale' } })
    return
  }
  if (!addressId.value) {
    message.warning('请先添加收货地址')
    router.push('/user/profile')
    return
  }
  acting.value = true
  try {
    const created = await addPresaleOrder({
      presaleActivityId: activityId.value,
      quantity: quantity.value,
      addressId: addressId.value,
    })
    if (created.data.code !== 0 || !created.data.data) {
      message.error(created.data.message || '下单失败')
      return
    }
    const paid = await payDeposit({ id: created.data.data, payChannel: payChannel.value })
    if (paid.data.code !== 0) {
      message.warning(paid.data.message || '定金未支付，可在个人中心继续支付')
      router.push('/user/profile')
      return
    }
    message.success('定金已支付，尾款请在截止前到个人中心支付')
    router.push('/user/profile')
  } finally {
    acting.value = false
  }
}

onMounted(load)
</script>

<template>
  <main id="presale-page">
    <h1>采摘季预售</h1>
    <p class="lead">支付定金锁定本批次份数。尾款等于总额减去定金。超过定金截止不能再付定金。</p>
    <a-empty v-if="activities.length === 0" description="当前没有进行中的预售" />
    <div v-else class="layout">
      <section class="list">
        <button
          v-for="item in activities"
          :key="item.id"
          type="button"
          :class="{ active: activityId === item.id }"
          @click="activityId = item.id"
        >
          <strong>{{ item.title }}</strong>
          <span>{{ item.productName }}</span>
          <span>开摘 {{ item.openPickDate }} · 预计发货 {{ item.expectShipDate }}</span>
          <span>定金 {{ Math.round(Number(item.depositRatio || 0) * 100) }}% · 剩余 {{ item.remainStock ?? 0 }} 份</span>
          <span>尾款截止 {{ item.balanceDeadline }}</span>
          <span>定金截止 {{ item.depositDeadline }}</span>
          <em v-if="!depositOpen(item)">定金已截止</em>
        </button>
      </section>
      <a-form layout="vertical" class="form" @finish="book">
        <a-form-item label="份数">
          <a-input-number v-model:value="quantity" :min="1" :max="999" />
        </a-form-item>
        <a-form-item label="收货地址">
          <a-select v-model:value="addressId" placeholder="选择地址" :options="addresses.map((item) => ({ value: item.id, label: `${item.receiverName} ${item.receiverPhone} ${item.detailAddress}` }))" />
        </a-form-item>
        <a-form-item label="定金支付方式">
          <a-select v-model:value="payChannel" :options="PAY_CHANNEL_OPTIONS" />
        </a-form-item>
        <a-button type="primary" html-type="submit" :loading="acting">支付定金</a-button>
      </a-form>
    </div>
  </main>
</template>

<style scoped>
#presale-page {
  max-width: 1080px;
  margin: 24px auto;
  padding: 0 16px;
}

.lead {
  color: rgba(0, 0, 0, 0.55);
}

.layout {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 24px;
  margin-top: 16px;
}

.list {
  display: grid;
  gap: 12px;
}

.list button {
  display: grid;
  gap: 4px;
  padding: 16px;
  text-align: left;
  border: 1px solid #eadfca;
  background: #fff;
  cursor: pointer;
}

.list button.active {
  border-color: #c4552a;
}

.list em {
  color: #c4552a;
}

@media (max-width: 800px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
