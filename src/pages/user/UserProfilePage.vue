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
import { listMyReviewVoByPage } from '@/api/reviewController'
import { listMyUserCouponVoByPage } from '@/api/userCouponController'
import { listMyMessageVoByPage, readMessage } from '@/api/messageController'
import { ORDER_STATUS_MAP } from '@/constants/order'

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

function apiBase() {
  return import.meta.env.VITE_API_BASE_URL || ''
}

function avatarSrc(path?: string) {
  if (!path) {
    return ''
  }
  if (path.startsWith('http')) {
    return path
  }
  return `${apiBase()}${path}`
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
  const [addressRes, favoriteRes, orderRes, reviewRes, couponRes, messageRes] = await Promise.all([
    listMyAddressVoByPage(pageQuery),
    listMyFavoriteVoByPage(pageQuery),
    listMyTradeOrderVoByPage(pageQuery),
    listMyReviewVoByPage(pageQuery),
    listMyUserCouponVoByPage(pageQuery),
    listMyMessageVoByPage(pageQuery),
  ])
  addresses.value = addressRes.data.data?.list ?? []
  favorites.value = favoriteRes.data.data?.list ?? []
  orders.value = orderRes.data.data?.list ?? []
  reviews.value = reviewRes.data.data?.list ?? []
  coupons.value = couponRes.data.data?.list ?? []
  messages.value = messageRes.data.data?.list ?? []
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
  <page-container id="user-profile-page" title="个人中心">
    <a-card title="我的资料" :bordered="false">
      <a-space align="start" :size="24">
        <div>
          <a-avatar :size="72" shape="circle" :src="avatarSrc(user.userAvatar)">{{ user.userName?.[0] || '芦' }}</a-avatar>
          <input class="file" type="file" accept="image/*" @change="onAvatar" />
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
          <a-space>
            <a-button type="primary" html-type="submit">保存</a-button>
            <a-button @click="logout">退出登录</a-button>
          </a-space>
        </a-form>
      </a-space>
    </a-card>

    <a-card class="gap" :bordered="false">
      <a-tabs>
        <a-tab-pane key="address" tab="收货地址">
          <a-button type="primary" @click="openAddress()">新增地址</a-button>
          <a-list class="gap" :data-source="addresses" item-layout="horizontal">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta
                  :title="`${item.receiverName} ${item.receiverPhone}`"
                  :description="`${item.province || ''}${item.city || ''}${item.district || ''}${item.detailAddress || ''}`"
                />
                <a-tag v-if="item.defaultFlag === 1" color="green">默认</a-tag>
                <a-button v-else type="link" @click="makeDefault(item)">设为默认</a-button>
                <a-button type="link" @click="openAddress(item)">编辑</a-button>
                <a-button type="link" @click="removeAddress(item.id)">删除</a-button>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-if="addresses.length === 0" description="还没有收货地址" />
        </a-tab-pane>
        <a-tab-pane key="favorite" tab="我的收藏">
          <a-empty v-if="favorites.length === 0" description="还没有收藏" />
          <a-list v-else :data-source="favorites">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :title="item.productName || '商品'" :description="`¥${item.price ?? ''}`" />
                <a-button type="link" @click="removeFavorite(item.id)">取消收藏</a-button>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
        <a-tab-pane key="order" tab="我的订单">
          <a-empty v-if="orders.length === 0" description="还没有订单" />
          <a-list v-else :data-source="orders">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :title="item.orderNo" :description="orderText(item.orderStatus)" />
                <a-button type="link" @click="router.push({ path: '/order/detail', query: { id: item.id } })">
                  ¥{{ item.payAmount }}
                </a-button>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
        <a-tab-pane key="review" tab="我的评价">
          <a-empty v-if="reviews.length === 0" description="还没有评价" />
          <a-list v-else :data-source="reviews">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :title="`${item.score} 分`" :description="item.content" />
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
        <a-tab-pane key="coupon" tab="优惠券">
          <a-empty v-if="coupons.length === 0" description="还没有优惠券" />
          <a-list v-else :data-source="coupons">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta
                  :title="item.couponName || '优惠券'"
                  :description="`减 ${item.discountAmount} 元，满 ${item.minAmount} 可用`"
                />
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
        <a-tab-pane key="message" tab="消息">
          <a-empty v-if="messages.length === 0" description="还没有消息" />
          <a-list v-else :data-source="messages">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :title="item.title" :description="item.content" />
                <a-button v-if="item.readFlag !== 1" type="link" @click="markRead(item.id)">标为已读</a-button>
                <a-tag v-else>已读</a-tag>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
      </a-tabs>
    </a-card>

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
  </page-container>
</template>

<style scoped>
#user-profile-page {
  min-height: 100%;
}

.gap {
  margin-top: 16px;
}

.file {
  display: block;
  margin-top: 8px;
  max-width: 180px;
}
</style>
