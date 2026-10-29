import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/home/HomePage.vue'
import ProductDetailPage from '@/pages/product/ProductDetailPage.vue'
import CartPage from '@/pages/cart/CartPage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserResetPage from '@/pages/user/UserResetPage.vue'
import UserProfilePage from '@/pages/user/UserProfilePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: '首页',
      meta: { title: '首页' },
      component: HomePage,
    },
    {
      path: '/product/detail',
      name: '商品详情',
      meta: { title: '商品详情', hideInMenu: true },
      component: ProductDetailPage,
    },
    {
      path: '/cart',
      name: '购物车',
      meta: { title: '购物车' },
      component: CartPage,
    },
    {
      path: '/user/login',
      name: '登录',
      meta: { title: '登录', hideInMenu: true },
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '注册',
      meta: { title: '注册', hideInMenu: true },
      component: UserRegisterPage,
    },
    {
      path: '/user/reset',
      name: '找回密码',
      meta: { title: '找回密码', hideInMenu: true },
      component: UserResetPage,
    },
    {
      path: '/user/profile',
      name: '个人中心',
      meta: { title: '个人中心' },
      component: UserProfilePage,
    },
  ],
})

export default router
