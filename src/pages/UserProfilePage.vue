<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  getLoginUser,
  updateUser,
  uploadAvatar,
  userLogout,
} from '@/api/userController'
import {
  addAddress,
  deleteAddress,
  listMyAddressVoByPage,
  updateAddress,
} from '@/api/addressController'
import { deleteFavorite, listMyFavoriteVoByPage } from '@/api/favoriteController'
import { listMyTradeOrderVoByPage } from '@/api/tradeOrderController'
import { confirmPresaleOrder, finishPresaleOrder, listMyPresaleOrderVoByPage, payBalance, payDeposit } from '@/api/presaleOrderController'
import { listMyPaymentFlowVoByPage } from '@/api/paymentFlowController'
import { listMyReviewVoByPage } from '@/api/reviewController'
import { listMyUserCouponVoByPage } from '@/api/userCouponController'
import { listMyMessageVoByPage, readMessage } from '@/api/messageController'
import { ORDER_STATUS_MAP, PAY_CHANNEL_OPTIONS } from '@/constants/order'
import { PRESALE_STATUS_MAP } from '@/constants/presale'
import { HOME_ART } from '@/constants/homeArt'
import { fileUrl } from '@/utils/fileUrl'

const router = useRouter()
const user = ref<API.UserVO>({})
const profile = reactive<API.UserUpdateRequest>({
  userName: '',
  userPhone: '',
  userAvatar: '',
})
const addresses = ref<API.AddressVO[]>([])
const favorites = ref<API.FavoriteVO[]>([])
const orders = ref<API.TradeOrderVO[]>([])
const presaleOrders = ref<API.PresaleOrderVO[]>([])
const flows = ref<API.PaymentFlowVO[]>([])
const presaleActing = ref(false)
const payOpen = ref(false)
const finishOpen = ref(false)
const payTarget = ref<API.PresaleOrderVO>()
const payKind = ref<'deposit' | 'balance'>('deposit')
const payChannel = ref('alipay')
const finishTarget = ref<API.PresaleOrderVO>()
const finishScore = ref(5)
const finishContent = ref('')
const reviews = ref<API.ReviewVO[]>([])
const coupons = ref<API.UserCouponVO[]>([])
const messages = ref<API.MessageVO[]>([])
const addressOpen = ref(false)
const editingAddressId = ref<string>()
const addressForm = reactive<API.AddressAddRequest>({
  receiverName: '',
  receiverPhone: '',
  province: '福建省',
  city: '泉州市',
  district: '永春县',
  detailAddress: '',
  defaultFlag: 0,
})

const pageQuery = { current: 1, pageSize: 10 }
const section = ref('profile')
const MENUS = [
  { key: 'profile', label: '我的资料' },
  { key: 'address', label: '收货地址' },
  { key: 'order', label: '我的订单' },
  { key: 'presale', label: '我的预售' },
  { key: 'flow', label: '支付流水' },
  { key: 'favorite', label: '我的收藏' },
  { key: 'review', label: '我的评价' },
  { key: 'coupon', label: '优惠券' },
  { key: 'message', label: '消息' },
]

function avatarSrc(path?: string) {
  return fileUrl(path)
}

function orderText(status?: string) {
  if (!status) {
    return '未知'
  }
  return ORDER_STATUS_MAP[status as keyof typeof ORDER_STATUS_MAP] || status
}

async function loadUser() {
  const response = await getLoginUser()
  const body = response.data
  if (body.code !== 0 || !body.data) {
    return
  }
  user.value = body.data
  profile.userName = body.data.userName
  profile.userPhone = body.data.userPhone
  profile.userAvatar = body.data.userAvatar
}

async function loadLists() {
  const [addressRes, favoriteRes, orderRes, reviewRes, couponRes, messageRes, presaleRes, flowRes] = await Promise.all([
    listMyAddressVoByPage(pageQuery),
    listMyFavoriteVoByPage(pageQuery),
    listMyTradeOrderVoByPage(pageQuery),
    listMyReviewVoByPage(pageQuery),
    listMyUserCouponVoByPage(pageQuery),
    listMyMessageVoByPage(pageQuery),
    listMyPresaleOrderVoByPage(pageQuery),
    listMyPaymentFlowVoByPage(pageQuery),
  ])
  addresses.value = addressRes.data.data?.list ?? []
  favorites.value = favoriteRes.data.data?.list ?? []
  orders.value = orderRes.data.data?.list ?? []
  reviews.value = reviewRes.data.data?.list ?? []
  coupons.value = couponRes.data.data?.list ?? []
  messages.value = messageRes.data.data?.list ?? []
  presaleOrders.value = presaleRes.data.data?.list ?? []
  flows.value = flowRes.data.data?.list ?? []
}

function presaleText(status?: string) {
  return PRESALE_STATUS_MAP[status || ''] || status || '未知'
}

function openPay(item: API.PresaleOrderVO, kind: 'deposit' | 'balance') {
  payTarget.value = item
  payKind.value = kind
  payChannel.value = 'alipay'
  payOpen.value = true
}

async function submitPay() {
  if (!payTarget.value?.id) {
    return
  }
  presaleActing.value = true
  try {
    const payload = { id: payTarget.value.id, payChannel: payChannel.value }
    const response = payKind.value === 'deposit' ? await payDeposit(payload) : await payBalance(payload)
    if (response.data.code !== 0) {
      message.error(response.data.message || '支付失败')
      return
    }
    message.success(payKind.value === 'deposit' ? '定金已支付' : '尾款已支付')
    payOpen.value = false
    await loadLists()
  } finally {
    presaleActing.value = false
  }
}

async function confirmPresale(id?: string) {
  if (!id) {
    return
  }
  const response = await confirmPresaleOrder({ id })
  if (response.data.code !== 0) {
    message.error(response.data.message || '确认收货失败')
    return
  }
  message.success('已确认收货，可以评价')
  await loadLists()
}

function openFinish(item: API.PresaleOrderVO) {
  finishTarget.value = item
  finishScore.value = 5
  finishContent.value = ''
  finishOpen.value = true
}

async function submitFinish() {
  if (!finishTarget.value?.id) {
    return
  }
  presaleActing.value = true
  try {
    const response = await finishPresaleOrder({
      id: finishTarget.value.id,
      score: finishScore.value,
      content: finishContent.value,
    })
    if (response.data.code !== 0) {
      message.error(response.data.message || '评价失败')
      return
    }
    message.success('评价已提交，预售单已完成')
    finishOpen.value = false
    await loadLists()
  } finally {
    presaleActing.value = false
  }
}

async function saveProfile() {
  const response = await updateUser(profile)
  if (response.data.code !== 0) {
    message.error(response.data.message || '保存失败')
    return
  }
  message.success('资料已保存')
  await loadUser()
}

async function onAvatar(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }
  const form = new FormData()
  form.append('file', file)
  const response = await uploadAvatar(
    {},
    {
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  if (response.data.code !== 0) {
    message.error(response.data.message || '上传失败')
    return
  }
  profile.userAvatar = response.data.data
  message.success('头像已更新')
  await loadUser()
}

function resetAddressForm() {
  editingAddressId.value = undefined
  addressForm.receiverName = ''
  addressForm.receiverPhone = ''
  addressForm.province = '福建省'
  addressForm.city = '泉州市'
  addressForm.district = '永春县'
  addressForm.detailAddress = ''
  addressForm.defaultFlag = 0
}

function openAddress(item?: API.AddressVO) {
  if (!item) {
    resetAddressForm()
  } else {
    editingAddressId.value = item.id
    addressForm.receiverName = item.receiverName
    addressForm.receiverPhone = item.receiverPhone
    addressForm.province = item.province
    addressForm.city = item.city
    addressForm.district = item.district
    addressForm.detailAddress = item.detailAddress
    addressForm.defaultFlag = item.defaultFlag
  }
  addressOpen.value = true
}

async function saveAddress() {
  const response = editingAddressId.value
    ? await updateAddress({ ...addressForm, id: editingAddressId.value })
    : await addAddress(addressForm)
  if (response.data.code !== 0) {
    message.error(response.data.message || '保存地址失败')
    return
  }
  addressOpen.value = false
  message.success(editingAddressId.value ? '地址已更新' : '地址已添加')
  await loadLists()
}

async function makeDefault(item: API.AddressVO) {
  const response = await updateAddress({
    id: item.id,
    receiverName: item.receiverName,
    receiverPhone: item.receiverPhone,
    province: item.province,
    city: item.city,
    district: item.district,
    detailAddress: item.detailAddress,
    defaultFlag: 1,
  })
  if (response.data.code !== 0) {
    message.error(response.data.message || '设置默认地址失败')
    return
  }
  message.success('已设为默认地址')
  await loadLists()
}

async function removeAddress(id?: string) {
  if (!id) {
    return
  }
  await deleteAddress({ id })
  await loadLists()
}

async function removeFavorite(id?: string) {
  if (!id) {
    return
  }
  await deleteFavorite({ id })
  await loadLists()
}

async function markRead(id?: string) {
  if (!id) {
    return
  }
  await readMessage({ id })
  await loadLists()
}

async function logout() {
  await userLogout()
  message.success('已退出')
  await router.push('/user/login')
}

onMounted(async () => {
  await loadUser()
  await loadLists()
})
</script>

<template>
  <div id="user-profile-page">
    <div class="welcome">
      <div class="rail welcome-inner">
        <span>欢迎来到 泉州永春芦柑营销平台　|　原产地直供 · 产地溯源 · 助农兴农</span>
        <nav class="welcome-links">
          <router-link to="/">首页</router-link>
          <router-link to="/user/profile">个人中心</router-link>
          <router-link to="/cart">购物车</router-link>
          <button type="button" @click="logout">退出</button>
        </nav>
      </div>
    </div>
    <header class="mast">
      <div class="rail mast-inner">
        <router-link to="/" class="brand">
          <img class="brand-mark" :src="HOME_ART.logo" alt="" />
          <span>
            <strong>泉州永春芦柑营销平台</strong>
            <small>永春芦柑 · 产地直供 · 助农兴农</small>
          </span>
        </router-link>
        <p class="mast-title">个人中心</p>
      </div>
    </header>
    <nav class="main-nav">
      <div class="rail">
        <router-link to="/">首页</router-link>
        <span class="active">个人中心</span>
        <router-link to="/cart">购物车</router-link>
        <router-link to="/promotion">营销活动</router-link>
      </div>
    </nav>

    <main class="rail body">
      <section class="summary">
        <a-avatar :size="64" shape="circle" :src="avatarSrc(user.userAvatar)">
          {{ user.userName?.[0] || '芦' }}
        </a-avatar>
        <div>
          <h1>{{ user.userName || user.userAccount || '买家' }}</h1>
          <p>{{ user.userAccount }}</p>
        </div>
        <ul>
          <li><button type="button" @click="section = 'order'"><strong>{{ orders.length }}</strong>订单</button></li>
          <li><button type="button" @click="section = 'favorite'"><strong>{{ favorites.length }}</strong>收藏</button></li>
          <li><button type="button" @click="section = 'coupon'"><strong>{{ coupons.length }}</strong>优惠券</button></li>
          <li><button type="button" @click="section = 'message'"><strong>{{ messages.length }}</strong>消息</button></li>
        </ul>
      </section>

      <div class="desk">
        <aside>
          <button
            v-for="item in MENUS"
            :key="item.key"
            type="button"
            :class="{ active: section === item.key }"
            @click="section = item.key"
          >
            {{ item.label }}
          </button>
        </aside>
        <section class="panel">
          <template v-if="section === 'profile'">
            <h2>我的资料</h2>
            <div class="profile-row">
              <div>
                <label class="file">
                  <a-avatar :size="72" shape="circle" :src="avatarSrc(user.userAvatar)">
                    {{ user.userName?.[0] || '芦' }}
                  </a-avatar>
                  <span>更换头像</span>
                  <input type="file" accept="image/*" @change="onAvatar" />
                </label>
              </div>
              <a-form layout="vertical" :model="profile" @finish="saveProfile">
                <a-form-item label="账号">
                  <a-input :value="user.userAccount" disabled />
                </a-form-item>
                <a-form-item label="昵称">
                  <a-input v-model:value="profile.userName" />
                </a-form-item>
                <a-form-item label="手机号">
                  <a-input v-model:value="profile.userPhone" placeholder="用于找回密码" />
                </a-form-item>
                <a-button type="primary" html-type="submit">保存</a-button>
              </a-form>
            </div>
          </template>

          <template v-else-if="section === 'address'">
            <header class="panel-head">
              <h2>收货地址</h2>
              <button type="button" class="solid" @click="openAddress()">新增地址</button>
            </header>
            <a-empty v-if="addresses.length === 0" description="还没有收货地址" />
            <article v-for="item in addresses" :key="item.id" class="row">
              <div>
                <strong>{{ item.receiverName }} {{ item.receiverPhone }}</strong>
                <p>{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detailAddress }}</p>
              </div>
              <div class="ops">
                <em v-if="item.defaultFlag === 1">默认</em>
                <button v-else type="button" @click="makeDefault(item)">设为默认</button>
                <button type="button" @click="openAddress(item)">编辑</button>
                <button type="button" @click="removeAddress(item.id)">删除</button>
              </div>
            </article>
          </template>

          <template v-else-if="section === 'favorite'">
            <h2>我的收藏</h2>
            <a-empty v-if="favorites.length === 0" description="还没有收藏" />
            <article v-for="item in favorites" :key="item.id" class="row">
              <div>
                <strong>{{ item.productName || '商品' }}</strong>
                <p class="price">¥{{ item.price ?? '' }}</p>
              </div>
              <button type="button" @click="removeFavorite(item.id)">取消收藏</button>
            </article>
          </template>

          <template v-else-if="section === 'order'">
            <h2>我的订单</h2>
            <a-empty v-if="orders.length === 0" description="还没有订单" />
            <article v-for="item in orders" :key="item.id" class="row">
              <div>
                <strong>{{ item.orderNo }}</strong>
                <p>{{ orderText(item.orderStatus) }}</p>
              </div>
              <button type="button" class="price" @click="router.push({ path: '/order/detail', query: { id: item.id } })">
                ¥{{ item.payAmount }}
              </button>
            </article>
          </template>

          <template v-else-if="section === 'presale'">
            <h2>我的预售</h2>
            <a-empty v-if="presaleOrders.length === 0" description="还没有预售订单" />
            <article v-for="item in presaleOrders" :key="item.id" class="row">
              <div>
                <strong>{{ item.activityTitle || item.orderNo }}</strong>
                <p>{{ presaleText(item.presaleStatus) }} · 定金 ¥{{ item.depositAmount }} · 尾款 ¥{{ item.balanceAmount }}</p>
                <p v-if="item.logisticsNo">物流 {{ item.logisticsNo }}</p>
              </div>
              <div class="ops">
                <button v-if="item.presaleStatus === 'unpaidDeposit'" type="button" @click="openPay(item, 'deposit')">付定金</button>
                <button v-if="item.presaleStatus === 'unpaidBalance'" type="button" @click="openPay(item, 'balance')">付尾款</button>
                <button v-if="item.presaleStatus === 'unreceived'" type="button" @click="confirmPresale(item.id)">确认收货</button>
                <button v-if="item.presaleStatus === 'uncommented'" type="button" @click="openFinish(item)">评价</button>
              </div>
            </article>
          </template>

          <template v-else-if="section === 'flow'">
            <h2>支付流水</h2>
            <a-empty v-if="flows.length === 0" description="还没有支付记录" />
            <article v-for="item in flows" :key="item.id" class="row">
              <div>
                <strong>{{ item.flowNo }}</strong>
                <p>{{ item.orderType === 'presale' ? '预售' : '现货' }} · {{ item.bizType === 'deposit' ? '定金' : item.bizType === 'balance' ? '尾款' : '一次付清' }} · ¥{{ item.amount }}</p>
              </div>
              <em>{{ item.payTime }}</em>
            </article>
          </template>

          <template v-else-if="section === 'review'">
            <h2>我的评价</h2>
            <a-empty v-if="reviews.length === 0" description="还没有评价" />
            <article v-for="item in reviews" :key="item.id" class="row">
              <div>
                <strong>{{ item.score }} 分</strong>
                <p>{{ item.content }}</p>
              </div>
            </article>
          </template>

          <template v-else-if="section === 'coupon'">
            <h2>优惠券</h2>
            <a-empty v-if="coupons.length === 0" description="还没有优惠券" />
            <article v-for="item in coupons" :key="item.id" class="row coupon">
              <strong>减 {{ item.discountAmount }} 元</strong>
              <div>
                <b>{{ item.couponName || '优惠券' }}</b>
                <p>满 {{ item.minAmount }} 可用</p>
              </div>
            </article>
          </template>

          <template v-else>
            <h2>消息</h2>
            <a-empty v-if="messages.length === 0" description="还没有消息" />
            <article v-for="item in messages" :key="item.id" class="row">
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.content }}</p>
              </div>
              <button v-if="item.readFlag !== 1" type="button" @click="markRead(item.id)">标为已读</button>
              <em v-else>已读</em>
            </article>
          </template>
        </section>
      </div>
    </main>

    <a-modal v-model:open="payOpen" :title="payKind === 'deposit' ? '支付定金' : '支付尾款'" :confirm-loading="presaleActing" ok-text="确认支付" @ok="submitPay">
      <a-select v-model:value="payChannel" :options="PAY_CHANNEL_OPTIONS" style="width: 100%" />
    </a-modal>
    <a-modal v-model:open="finishOpen" title="预售评价" :confirm-loading="presaleActing" ok-text="提交" @ok="submitFinish">
      <a-form layout="vertical">
        <a-form-item label="评分"><a-rate v-model:value="finishScore" /></a-form-item>
        <a-form-item label="内容"><a-textarea v-model:value="finishContent" :rows="3" :maxlength="500" /></a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:open="addressOpen" :title="editingAddressId ? '编辑地址' : '新增地址'" ok-text="保存" @ok="saveAddress">
      <a-form layout="vertical" :model="addressForm">
        <a-form-item label="收货人">
          <a-input v-model:value="addressForm.receiverName" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="addressForm.receiverPhone" />
        </a-form-item>
        <a-form-item label="详细地址">
          <a-input v-model:value="addressForm.detailAddress" />
        </a-form-item>
        <a-form-item label="默认地址">
          <a-switch
            :checked="addressForm.defaultFlag === 1"
            @change="(checked: boolean) => (addressForm.defaultFlag = checked ? 1 : 0)"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
#user-profile-page {
  --mall: #f39800;
  --mall-deep: #e8870a;
  --price: #ff4d00;
  min-height: 100vh;
  background: #f5f5f5;
  color: #333;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.rail {
  box-sizing: border-box;
  width: min(1200px, calc(100% - 24px));
  margin: 0 auto;
}

.welcome {
  background: #fff;
  border-bottom: 1px solid #f2f2f2;
  color: #999;
  font-size: 12px;
}

.welcome-inner,
.mast-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 34px;
}

.welcome-links {
  display: flex;
  align-items: center;
  gap: 14px;
}

.welcome-links a,
.welcome-links button {
  border: 0;
  background: transparent;
  color: #666;
  font: inherit;
  cursor: pointer;
  padding: 0;
}

.mast {
  background: #fff;
  padding: 14px 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--mall-deep);
  text-decoration: none;
}

.brand-mark {
  width: 46px;
  height: 46px;
}

.brand strong {
  display: block;
  font-size: 20px;
}

.brand small {
  color: #b0b0b0;
  font-size: 12px;
}

.mast-title {
  margin: 0;
  color: var(--mall-deep);
  font-size: 18px;
  font-weight: 600;
}

.main-nav {
  background: var(--mall);
}

.main-nav .rail {
  display: flex;
  align-items: stretch;
  min-height: 44px;
  gap: 4px;
}

.main-nav a,
.main-nav .active {
  display: inline-flex;
  align-items: center;
  padding: 0 22px;
  color: #fff;
  text-decoration: none;
}

.main-nav .active {
  background: var(--mall-deep);
}

.body {
  padding: 16px 0 32px;
}

.summary {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: #fff;
  border-radius: 8px;
}

.summary h1 {
  margin: 0;
  font-size: 20px;
}

.summary p {
  margin: 4px 0 0;
  color: #999;
  font-size: 13px;
}

.summary ul {
  display: flex;
  gap: 18px;
  margin: 0 0 0 auto;
  padding: 0;
  list-style: none;
}

.summary button {
  border: 0;
  background: transparent;
  color: #666;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.summary strong {
  display: block;
  color: var(--price);
  font-size: 20px;
}

.desk {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 12px;
  margin-top: 12px;
  align-items: start;
}

aside,
.panel {
  background: #fff;
  border-radius: 8px;
}

aside {
  display: flex;
  flex-direction: column;
  padding: 8px;
}

aside button {
  height: 40px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #444;
  font: inherit;
  text-align: left;
  padding: 0 12px;
  cursor: pointer;
}

aside button.active {
  background: #fff6ea;
  color: var(--mall-deep);
  font-weight: 600;
}

.panel {
  min-height: 420px;
  padding: 16px 18px 20px;
}

.panel h2 {
  margin: 0 0 14px;
  font-size: 18px;
}

.panel h2::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  margin-right: 8px;
  border-radius: 2px;
  background: var(--mall);
  vertical-align: -2px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-row {
  display: grid;
  grid-template-columns: 120px minmax(0, 360px);
  gap: 24px;
}

.file {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  color: var(--mall-deep);
  font-size: 13px;
  cursor: pointer;
}

.file input {
  display: none;
}

.solid,
.row > button,
.ops button {
  border: 0;
  background: transparent;
  color: var(--mall-deep);
  font: inherit;
  cursor: pointer;
}

.solid {
  height: 32px;
  padding: 0 14px;
  border-radius: 16px;
  background: var(--mall);
  color: #fff;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid #f3f3f3;
}

.row p {
  margin: 4px 0 0;
  color: #888;
  font-size: 13px;
}

.ops {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.ops em,
.row > em {
  padding: 1px 8px;
  border-radius: 10px;
  background: #fff1df;
  color: var(--mall-deep);
  font-style: normal;
  font-size: 12px;
}

.price {
  color: var(--price);
  font-weight: 600;
}

.coupon strong {
  min-width: 92px;
  color: var(--price);
  font-size: 18px;
}

@media (max-width: 800px) {
  .summary,
  .desk,
  .profile-row,
  .welcome-inner {
    display: block;
  }

  .summary ul {
    margin: 12px 0 0;
  }

  aside {
    flex-direction: row;
    overflow-x: auto;
    margin-bottom: 12px;
  }
}
</style>
