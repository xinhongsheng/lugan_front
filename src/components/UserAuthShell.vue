<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthBasket from '@/components/AuthBasket.vue'
import AuthScene from '@/components/AuthScene.vue'

const route = useRoute()

const mode = computed(() => {
  if (route.path.startsWith('/user/register')) {
    return 'register'
  }
  if (route.path.startsWith('/user/reset')) {
    return 'reset'
  }
  return 'login'
})

const copy = computed(() => {
  if (mode.value === 'register') {
    return {
      headline: '欢迎注册',
      title: '账号注册',
      sub: '注册后即可使用同一账号登录',
    }
  }
  if (mode.value === 'reset') {
    return {
      headline: '找回密码',
      title: '重置密码',
      sub: '验证注册手机号后设置新密码',
    }
  }
  return {
    headline: '欢迎登录',
    title: '账号登录',
    sub: '小程序/网页统一账户登录',
  }
})

const points = ['永春原产地直供', '果园鲜采现发', '品质优选可溯源', '助农增收 共促乡村振兴']
</script>

<template>
  <div id="user-auth-shell">
    <header class="top">
      <div class="rail bar">
        <router-link to="/" class="brand">
          <svg class="logo" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="23" r="13" fill="#f26522" />
            <ellipse cx="15" cy="18" rx="4" ry="2.4" fill="#fff" opacity="0.35" />
            <path d="M20 12c2-6 9-7 12-4-6 0-10 4-12 8Z" fill="#3d9a45" />
            <path d="M20 14c6-2 10 0 9 4" fill="none" stroke="#2f7a34" stroke-width="1.2" />
          </svg>
          <span>
            <strong>泉州永春芦柑营销平台</strong>
            <small>永春芦柑 · 产地直供 · 助农兴农</small>
          </span>
        </router-link>
        <nav class="nav" aria-label="页头">
          <router-link to="/">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linejoin="round"
              />
            </svg>
            返回首页
          </router-link>
          <a href="#auth-help">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.7" />
              <path
                d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.9-1.2 1.6V14"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              />
              <circle cx="12" cy="17" r="0.8" fill="currentColor" />
            </svg>
            帮助中心
          </a>
          <a href="mailto:service@yongchun-lugan.com">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 15v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              />
              <path
                d="M8 15a4 4 0 0 1 8 0"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
              />
              <circle cx="12" cy="9" r="2.2" fill="none" stroke="currentColor" stroke-width="1.7" />
            </svg>
            客服咨询
          </a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero" :aria-label="copy.headline">
        <AuthScene />
        <div class="rail stage">
          <div class="copy">
            <h1>
              <span>{{ copy.headline }}</span>
              <span>永春芦柑营销平台</span>
            </h1>
            <p class="badge">
              <svg viewBox="0 0 340 52" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M8 20C48 6 90 30 150 14c62-16 110 12 182-2l-4 26c-70 12-120-8-186 8-52 12-100-2-142-6l-4-16Z"
                  fill="#f26522"
                />
              </svg>
              <span>产地直供 · 新鲜优质 · 源头可溯</span>
            </p>
            <ul>
              <li v-for="point in points" :key="point">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M3 8.2 6.4 12 13 4.2"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {{ point }}
              </li>
            </ul>
          </div>
          <AuthBasket class="basket-slot" />
          <section class="card" :aria-label="copy.title">
            <h2>
              <span class="mark" aria-hidden="true" />
              {{ copy.title }}
            </h2>
            <p class="card-sub">{{ copy.sub }}</p>
            <slot />
          </section>
        </div>
      </section>

      <section class="promises" aria-label="服务保障">
        <ul class="rail">
          <li>
            <svg viewBox="0 0 40 40" aria-hidden="true">
              <path
                d="M7 25V16h16v9"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
              <path d="M23 19h6.5l3.5 4v2H23v-6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <circle cx="13" cy="27.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8" />
              <circle cx="28" cy="27.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8" />
            </svg>
            <span><strong>产地直发</strong><small>永春芦柑 · 果园直采 · 新鲜速达</small></span>
          </li>
          <li>
            <svg viewBox="0 0 40 40" aria-hidden="true">
              <path
                d="M20 6 32 11v9c0 7-5 12-12 14C13 32 8 27 8 20v-9L20 6Z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="m15 20 3.2 3.2L25 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            <span><strong>正品保障</strong><small>产地认证 · 严选品质 · 假一赔十</small></span>
          </li>
          <li>
            <svg viewBox="0 0 40 40" aria-hidden="true">
              <path
                d="M9 11h3v14H9V11Zm5 0h2v14h-2V11Zm4 0h4v14h-4V11Zm6 0h2v14h-2V11Zm4 0h3v14h-3V11Z"
                fill="currentColor"
              />
              <path d="M9 28h22v2.2H9V28Z" fill="currentColor" />
            </svg>
            <span><strong>一果一码验真</strong><small>专属溯源码 · 来源可查 · 品质可溯</small></span>
          </li>
          <li>
            <svg viewBox="0 0 40 40" aria-hidden="true">
              <path
                d="M8 24v3a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3v-3"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <path d="M13 24a7 7 0 0 1 14 0" fill="none" stroke="currentColor" stroke-width="1.8" />
              <circle cx="20" cy="14" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8" />
            </svg>
            <span><strong>售后无忧</strong><small>坏果包赔 · 快速响应 · 贴心服务</small></span>
          </li>
        </ul>
      </section>
    </main>

    <footer>
      <div class="rail foot">
        <div class="brand-col">
          <router-link to="/" class="brand">
            <svg class="logo" viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="23" r="13" fill="#f26522" />
              <ellipse cx="15" cy="18" rx="4" ry="2.4" fill="#fff" opacity="0.35" />
              <path d="M20 12c2-6 9-7 12-4-6 0-10 4-12 8Z" fill="#3d9a45" />
            </svg>
            <span>
              <strong>泉州永春芦柑营销平台</strong>
              <small>永春芦柑 · 产地直供 · 助农兴农</small>
            </span>
          </router-link>
        </div>
        <div id="auth-help">
          <h3>帮助中心</h3>
          <p><router-link to="/user/login">登录与注册</router-link></p>
          <p>账户与安全</p>
          <p>订单与支付</p>
          <p>售后与退款</p>
          <p>常见问题</p>
        </div>
        <div>
          <h3>关于我们</h3>
          <p>平台介绍</p>
          <p>产地优势</p>
          <p>服务宗旨</p>
          <p>合作共赢</p>
          <p><a href="#auth-contact">联系我们</a></p>
        </div>
        <div id="auth-contact">
          <h3>联系我们</h3>
          <p>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M8 4h8l1 4v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8l1-4Z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              />
              <path d="M10 18h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
            客服热线：0595-0000000（8:30-18:00）
          </p>
          <p>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="6" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6" />
              <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.6" />
            </svg>
            客服邮箱：service@yongchun-lugan.com
          </p>
          <p>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              />
              <circle cx="12" cy="10" r="2.2" fill="none" stroke="currentColor" stroke-width="1.6" />
            </svg>
            平台地址：福建省泉州市永春县（芦柑产业园区）
          </p>
        </div>
      </div>
      <div class="legal">
        <p>© 2026 泉州永春芦柑营销平台　版权所有　|　闽ICP备00000000号</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
#user-auth-shell {
  --auth-orange: #f26522;
  --auth-orange-deep: #d95416;
  --auth-ink: #2c2c2c;
  --auth-muted: #5f5f5f;
  min-height: 100svh;
  background: #fff;
  color: var(--auth-ink);
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.rail {
  box-sizing: border-box;
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

.top {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.bar,
.brand {
  display: flex;
  align-items: center;
}

.bar {
  justify-content: space-between;
  min-height: 74px;
  gap: 16px;
}

.brand {
  gap: 10px;
  color: inherit;
  text-decoration: none;
}

.logo {
  width: 40px;
  height: 40px;
  flex: none;
}

.brand strong {
  display: block;
  color: var(--auth-orange);
  font-size: 20px;
  font-weight: 750;
  letter-spacing: 0.01em;
  line-height: 1.2;
}

.brand small {
  display: block;
  margin-top: 2px;
  color: var(--auth-muted);
  font-size: 12px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 22px;
}

.nav a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #3f3f3f;
  font-size: 14px;
  text-decoration: none;
}

.nav a:hover {
  color: var(--auth-orange);
}

.nav svg {
  width: 18px;
  height: 18px;
}

.hero {
  position: relative;
  overflow: hidden;
  background: #c5e4f2;
}

.stage {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  grid-template-areas: 'copy card';
  align-items: center;
  min-height: 620px;
  padding: 28px 0 8px;
}

.copy {
  grid-area: copy;
  position: relative;
  z-index: 2;
  max-width: 500px;
}

.copy h1 {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  color: #f25c12;
  font-size: clamp(34px, 3.6vw, 48px);
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 1.18;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
}

.badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin: 22px 0 18px;
  padding: 0 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  line-height: 40px;
}

.badge svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.badge span {
  position: relative;
}

.copy ul {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.copy li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 650;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

.copy li svg {
  width: 16px;
  height: 16px;
  color: #fff;
}

.basket-slot {
  grid-column: 1 / -1;
  grid-row: 1;
  align-self: end;
  justify-self: end;
  width: min(600px, 56%);
  margin-right: 372px;
  z-index: 1;
  pointer-events: none;
}

.card {
  grid-area: card;
  position: relative;
  z-index: 3;
  box-sizing: border-box;
  width: 100%;
  padding: 28px 28px 22px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 14px 40px rgba(78, 38, 8, 0.14), 0 2px 8px rgba(78, 38, 8, 0.06);
}

.card h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #2a2a2a;
  font-size: 22px;
  font-weight: 750;
  line-height: 1.2;
}

.mark {
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: var(--auth-orange);
}

.card-sub {
  margin: 8px 0 18px;
  color: #666;
  font-size: 13px;
}

.promises {
  background: #fff;
  border-top: 1px solid #f2f2f2;
}

.promises ul {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  margin: 0;
  padding: 22px 0;
  list-style: none;
}

.promises li {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 8px 18px;
}

.promises li + li {
  border-left: 1px solid #eee;
}

.promises svg {
  width: 36px;
  height: 36px;
  flex: none;
  color: var(--auth-orange);
}

.promises strong,
.promises small {
  display: block;
}

.promises strong {
  color: #333;
  font-size: 16px;
  font-weight: 700;
}

.promises small {
  margin-top: 4px;
  color: #555;
  font-size: 12px;
  line-height: 1.4;
}

footer {
  background: #f7f7f7;
}

.foot {
  display: grid;
  grid-template-columns: 1.35fr 1fr 1fr 1.45fr;
  gap: 28px;
  padding: 36px 0 28px;
}

.foot h3 {
  margin: 0 0 14px;
  color: #333;
  font-size: 16px;
  font-weight: 700;
}

.foot p {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0 0 8px;
  color: #666;
  font-size: 13px;
  line-height: 1.6;
}

.foot svg {
  width: 16px;
  height: 16px;
  flex: none;
  margin-top: 2px;
  color: var(--auth-orange);
}

.foot a {
  color: #666;
  text-decoration: none;
}

.foot a:hover {
  color: var(--auth-orange);
}

.legal {
  background: #2b2b2b;
}

.legal p {
  margin: 0;
  padding: 14px 16px;
  color: #f2f2f2;
  font-size: 12px;
  text-align: center;
}

@media (prefers-reduced-motion: no-preference) {
  .card {
    animation: card-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 1080px) {
  .basket-slot {
    width: min(460px, 50%);
    margin-right: 280px;
  }

  .copy {
    max-width: 420px;
  }
}

@media (max-width: 960px) {
  .stage {
    grid-template-columns: 1fr;
    grid-template-areas:
      'copy'
      'basket'
      'card';
    min-height: 0;
    gap: 8px;
    padding-bottom: 28px;
  }

  .basket-slot {
    grid-area: basket;
    grid-column: auto;
    grid-row: auto;
    width: min(460px, 100%);
    margin: 0 auto;
    justify-self: center;
  }

  .copy h1 {
    font-size: 32px;
  }

  .promises ul,
  .foot {
    grid-template-columns: 1fr 1fr;
  }

  .promises li + li {
    border-left: 0;
  }
}

@media (max-width: 640px) {
  .rail {
    width: min(1180px, calc(100% - 28px));
  }

  .bar {
    align-items: flex-start;
    flex-direction: column;
    padding: 12px 0;
  }

  .nav {
    flex-wrap: wrap;
    gap: 12px 16px;
  }

  .brand strong {
    font-size: 16px;
  }

  .card {
    padding: 22px 16px 16px;
  }

  .promises ul,
  .foot {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
#user-auth-shell .auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

#user-auth-shell .field {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 12px;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  background: #fff;
  color: #8d8d8d;
}

#user-auth-shell .field:focus-within {
  border-color: #f26522;
  box-shadow: 0 0 0 3px rgba(242, 101, 34, 0.16);
}

#user-auth-shell .field input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #2c2c2c;
  font-size: 15px;
  caret-color: #f26522;
}

#user-auth-shell .field input::placeholder {
  color: #767676;
}

#user-auth-shell .field input:focus-visible,
#user-auth-shell .trail:focus-visible,
#user-auth-shell .captcha-plate:focus-visible,
#user-auth-shell .refresh:focus-visible {
  outline: none;
}

#user-auth-shell .lead,
#user-auth-shell .trail {
  display: inline-flex;
  flex: none;
  color: #8a8a8a;
}

#user-auth-shell .lead svg,
#user-auth-shell .trail svg,
#user-auth-shell .refresh svg {
  width: 18px;
  height: 18px;
}

#user-auth-shell .trail,
#user-auth-shell .refresh,
#user-auth-shell .captcha-plate {
  border: 0;
  background: transparent;
  cursor: pointer;
}

#user-auth-shell .trail:hover,
#user-auth-shell .refresh:hover {
  color: #f26522;
}

#user-auth-shell .captcha-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 118px 36px;
  gap: 8px;
  align-items: center;
}

#user-auth-shell .captcha-plate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  height: 46px;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  background:
    repeating-linear-gradient(-18deg, transparent, transparent 6px, rgba(242, 101, 34, 0.08) 7px),
    #fff;
  cursor: pointer;
}

#user-auth-shell .captcha-plate span {
  display: inline-block;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 22px;
  font-weight: 750;
  line-height: 1;
}

#user-auth-shell .refresh {
  display: grid;
  place-items: center;
  width: 36px;
  height: 46px;
  color: #f26522;
}

#user-auth-shell .meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #5f5f5f;
  font-size: 14px;
}

#user-auth-shell .remember {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

#user-auth-shell .remember input {
  width: 15px;
  height: 15px;
  margin: 0;
  accent-color: #f26522;
}

#user-auth-shell .meta a,
#user-auth-shell .switch a {
  color: #f26522;
  font-weight: 700;
  text-decoration: none;
}

#user-auth-shell .meta a:hover,
#user-auth-shell .switch a:hover {
  color: #d95416;
}

#user-auth-shell .form-error {
  margin: 0;
  color: #b43300;
  font-size: 13px;
}

#user-auth-shell .submit {
  height: 48px;
  border: 0;
  border-radius: 6px;
  background: #f26522;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.14em;
  cursor: pointer;
}

#user-auth-shell .submit:hover {
  background: #e25716;
}

#user-auth-shell .submit:disabled {
  cursor: wait;
  opacity: 0.72;
}

#user-auth-shell .switch {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 2px 0 0;
  color: #5f5f5f;
  font-size: 14px;
}

#user-auth-shell .switch::before,
#user-auth-shell .switch::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #ececec;
}
</style>
