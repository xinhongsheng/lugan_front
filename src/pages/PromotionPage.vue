<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { claimCoupon, listCouponVoByPage } from '@/api/userCouponController'
import {
  joinGroup,
  listOpenGroupVo,
  listPromotionVoByPage,
  openGroup,
  seckill,
  wholesale,
} from '@/api/promotionController'
import { getMemberVo, redeemPoint } from '@/api/memberController'
import { HOME_ART } from '@/constants/homeArt'

const route = useRoute()
const coupons = ref<API.CouponVO[]>([])
const activities = ref<API.PromotionActivityVO[]>([])
const teams = ref<API.GroupTeamVO[]>([])
const member = ref<API.MemberVO>({})
const points = ref(100)
const qty = ref<Record<string, number>>({})

const TYPE_NAME: Record<string, string> = {
  full: '满减券',
  newcomer: '新人券',
  festival: '节日券',
  seckill: '采摘季秒杀',
  wholesale: '团购批发',
  group: '社交拼团',
}

function artOf(type?: string) {
  if (type === 'seckill') {
    return HOME_ART.bigFruit
  }
  if (type === 'wholesale') {
    return HOME_ART.crate
  }
  return HOME_ART.gift
}

async function load() {
  const page = { current: 1, pageSize: 20 }
  const [couponRes, activityRes, teamRes, memberRes] = await Promise.all([
    listCouponVoByPage(page),
    listPromotionVoByPage(page),
    listOpenGroupVo(page),
    getMemberVo(),
  ])
  coupons.value = couponRes.data.data?.list ?? []
  activities.value = activityRes.data.data?.list ?? []
  teams.value = teamRes.data.data?.list ?? []
  member.value = memberRes.data.data ?? {}
}

async function claim(item: API.CouponVO) {
  const response = await claimCoupon({ couponId: item.id })
  if (response.data.code !== 0) {
    message.error(response.data.message || '领取失败')
    return
  }
  message.success('已领取，结算时自动用最大优惠')
  await load()
}

async function buy(item: API.PromotionActivityVO) {
  const quantity = qty.value[item.id || ''] || item.minQuantity || 1
  const body = { activityId: item.id, quantity }
  const response = item.activityType === 'wholesale' ? await wholesale(body) : await seckill(body)
  if (response.data.code !== 0) {
    message.error(response.data.message || '锁定失败')
    return
  }
  message.success(item.activityType === 'wholesale' ? '批发库存已锁定' : '秒杀库存已锁定')
  await load()
}

async function startGroup(item: API.PromotionActivityVO) {
  const response = await openGroup({ activityId: item.id })
  if (response.data.code !== 0 || !response.data.data) {
    message.error(response.data.message || '开团失败')
    return
  }
  const link = `${location.origin}/promotion?teamId=${response.data.data}`
  await navigator.clipboard.writeText(link).catch(() => undefined)
  message.success('已开团，分享链接已复制')
  await load()
}

async function enterGroup(team: API.GroupTeamVO) {
  const response = await joinGroup({ teamId: team.id })
  if (response.data.code !== 0) {
    message.error(response.data.message || '参团失败')
    return
  }
  message.success(response.data.data?.teamStatus === 'success' ? '已成团，将按团合并发货' : '已参团')
  await load()
}

async function share(team: API.GroupTeamVO) {
  const link = `${location.origin}${team.sharePath || '/promotion'}`
  await navigator.clipboard.writeText(link).catch(() => undefined)
  message.success('分享链接已复制')
}

async function redeem() {
  const response = await redeemPoint({ points: points.value })
  if (response.data.code !== 0) {
    message.error(response.data.message || '兑换失败')
    return
  }
  message.success('已兑换成抵现券，下单时可用')
  await load()
}

onMounted(async () => {
  await load()
  if (route.query.teamId) {
    message.info('打开分享链接后，在下方拼团列表点参团')
  }
})
</script>

<template>
  <div id="promotion-page">
    <header class="mast">
      <div class="rail">
        <router-link to="/" class="brand">
          <img :src="HOME_ART.logo" alt="" />
          <strong>营销活动</strong>
        </router-link>
        <router-link to="/user/profile">个人中心</router-link>
      </div>
    </header>
    <main class="rail">
      <section id="member" class="panel member">
        <div>
          <h1>{{ member.levelName || '普通' }}会员</h1>
          <p>积分 {{ member.pointBalance ?? 0 }} · 累计消费 ¥{{ member.totalSpend ?? 0 }}</p>
          <p>专属折扣 {{ member.discountRate ?? 1 }} · 包邮门槛 ¥{{ member.freeFreightAmount ?? 99 }}</p>
          <p v-if="member.memberDay">今天是会员日，专享再减 ¥{{ member.memberDayOff }}</p>
        </div>
        <div class="redeem">
          <input v-model.number="points" type="number" min="100" step="100" />
          <button type="button" @click="redeem">积分抵现</button>
        </div>
      </section>

      <section class="panel">
        <h2>优惠券</h2>
        <div class="cards">
          <article v-for="item in coupons" :key="item.id" class="ticket">
            <strong>¥{{ item.discountAmount }}</strong>
            <div>
              <b>{{ item.couponName }}</b>
              <p>{{ TYPE_NAME[item.couponType || ''] || item.couponType }} · 满 {{ item.minAmount }} 可用</p>
            </div>
            <button type="button" :disabled="item.claimed" @click="claim(item)">
              {{ item.claimed ? '已领取' : '领取' }}
            </button>
          </article>
          <p v-if="coupons.length === 0" class="empty">登录后可领取满减券、新人券和节日券</p>
        </div>
      </section>

      <section class="panel">
        <h2>限时特惠与团购批发</h2>
        <div class="goods">
          <article v-for="item in activities" :key="item.id" class="good">
            <img :src="artOf(item.activityType)" :alt="item.productName" />
            <h3>{{ item.activityName }}</h3>
            <p>{{ item.productName }}</p>
            <p class="price">¥{{ item.salePrice }} <s>¥{{ item.originPrice }}</s></p>
            <p>库存 {{ item.stock }}<span v-if="item.groupSize"> · {{ item.groupSize }} 人成团</span></p>
            <input v-if="item.activityType !== 'group'" v-model.number="qty[item.id || '']" type="number" :min="item.minQuantity || 1" :placeholder="`起订 ${item.minQuantity || 1}`" />
            <button v-if="item.activityType === 'group'" type="button" @click="startGroup(item)">开团并分享</button>
            <button v-else type="button" @click="buy(item)">{{ item.activityType === 'wholesale' ? '锁定批发' : '马上秒杀' }}</button>
          </article>
        </div>
      </section>

      <section class="panel">
        <h2>正在拼团</h2>
        <article v-for="team in teams" :key="team.id" class="team">
          <div>
            <strong>{{ team.activityName }} · {{ team.productName }}</strong>
            <p>¥{{ team.salePrice }} · 还差 {{ team.remainCount }} 人</p>
            <div class="bar"><i :style="{ width: `${team.percent || 0}%` }" /></div>
            <p v-if="team.leader && team.memberNames?.length">团员：{{ team.memberNames.join('、') }}</p>
          </div>
          <div class="ops">
            <button type="button" @click="share(team)">分享</button>
            <button type="button" @click="enterGroup(team)">参团</button>
          </div>
        </article>
        <p v-if="teams.length === 0" class="empty">还没有进行中的团。成团后合并发货，超时未满员模拟原路退款。</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
#promotion-page {
  --mall: #f39800;
  --price: #ff4d00;
  min-height: 100vh;
  background: #f5f5f5;
  color: #333;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.rail {
  width: min(1200px, calc(100% - 24px));
  margin: 0 auto;
}

.mast {
  background: #fff;
  border-bottom: 3px solid var(--mall);
}

.mast .rail,
.brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 64px;
}

.brand {
  color: #e8870a;
  text-decoration: none;
  font-size: 20px;
}

.brand img {
  width: 42px;
  height: 42px;
}

.panel {
  margin-top: 14px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.panel h2,
.member h1 {
  margin: 0 0 12px;
  font-size: 18px;
}

.panel h2::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  margin-right: 8px;
  background: var(--mall);
  vertical-align: -2px;
}

.member {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  background: #fff8ee;
}

.member p {
  margin: 4px 0;
  color: #666;
}

.redeem,
.ops {
  display: flex;
  gap: 8px;
  align-items: center;
}

input {
  width: 96px;
  height: 32px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 0 8px;
}

button {
  height: 32px;
  padding: 0 14px;
  border: 0;
  border-radius: 16px;
  background: var(--mall);
  color: #fff;
  cursor: pointer;
}

button:disabled {
  background: #ddd;
  cursor: default;
}

.cards,
.goods {
  display: grid;
  gap: 12px;
}

.cards {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.goods {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.ticket,
.good,
.team {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #fafafa;
}

.good {
  flex-direction: column;
  align-items: flex-start;
}

.good img {
  width: 100%;
  height: 120px;
  object-fit: contain;
  background: #f6f1ea;
  border-radius: 6px;
}

.ticket strong,
.price {
  color: var(--price);
  font-size: 20px;
}

.price s,
.good p,
.ticket p,
.team p,
.empty {
  color: #888;
  font-size: 13px;
}

.team {
  justify-content: space-between;
  margin-top: 8px;
}

.bar {
  width: 220px;
  height: 8px;
  border-radius: 4px;
  background: #f3e2c4;
  overflow: hidden;
}

.bar i {
  display: block;
  height: 100%;
  background: var(--mall);
}

@media (max-width: 900px) {
  .cards,
  .goods,
  .member {
    grid-template-columns: 1fr;
    display: block;
  }
}
</style>
