import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProductDetailPage from '@/pages/ProductDetailPage.vue'
import CartPage from '@/pages/CartPage.vue'
import OrderConfirmPage from '@/pages/OrderConfirmPage.vue'
import OrderDetailPage from '@/pages/OrderDetailPage.vue'
import UserLoginPage from '@/pages/UserLoginPage.vue'
import UserRegisterPage from '@/pages/UserRegisterPage.vue'
import UserResetPage from '@/pages/UserResetPage.vue'
import UserProfilePage from '@/pages/UserProfilePage.vue'
import PromotionPage from '@/pages/PromotionPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import AdminCatalogPage from '@/pages/AdminCatalogPage.vue'
import AdminOrderListPage from '@/pages/AdminOrderListPage.vue'
import AdminRefundAuditPage from '@/pages/AdminRefundAuditPage.vue'
import AdminFreightListPage from '@/pages/AdminFreightListPage.vue'
import AdminPresaleActivityPage from '@/pages/AdminPresaleActivityPage.vue'
import AdminMarketingPage from '@/pages/AdminMarketingPage.vue'
import AdminPresaleOrderPage from '@/pages/AdminPresaleOrderPage.vue'
import AdminPaymentFlowPage from '@/pages/AdminPaymentFlowPage.vue'
import PresalePage from '@/pages/PresalePage.vue'

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
      path: '/order/confirm',
      name: '订单确认',
      meta: { title: '订单确认', hideInMenu: true },
      component: OrderConfirmPage,
    },
    {
      path: '/order/detail',
      name: '订单详情',
      meta: { title: '订单详情', hideInMenu: true },
      component: OrderDetailPage,
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
      path: '/admin',
      name: '系统管理',
      meta: { title: '系统管理', hideInMenu: true },
      component: AdminPage,
    },
    {
      path: '/admin/catalog',
      name: '商品类目',
      meta: { title: '商品类目', hideInMenu: true },
      component: AdminCatalogPage,
    },
    {
      path: '/admin/order',
      name: '订单管理',
      meta: { title: '订单管理', hideInMenu: true },
      component: AdminOrderListPage,
    },
    {
      path: '/admin/refund',
      name: '退款审核',
      meta: { title: '退款审核', hideInMenu: true },
      component: AdminRefundAuditPage,
    },
    {
      path: '/admin/freight',
      name: '运费模板',
      meta: { title: '运费模板', hideInMenu: true },
      component: AdminFreightListPage,
    },
    {
      path: '/admin/presale',
      name: '预售配置',
      meta: { title: '预售配置', hideInMenu: true },
      component: AdminPresaleActivityPage,
    },
    {
      path: '/admin/marketing',
      name: '营销管理',
      meta: { title: '营销管理', hideInMenu: true },
      component: AdminMarketingPage,
    },
    {
      path: '/admin/presale-order',
      name: '预售订单',
      meta: { title: '预售订单', hideInMenu: true },
      component: AdminPresaleOrderPage,
    },
    {
      path: '/admin/payment',
      name: '支付流水',
      meta: { title: '支付流水', hideInMenu: true },
      component: AdminPaymentFlowPage,
    },
    {
      path: '/presale',
      name: '采摘季预售',
      meta: { title: '采摘季预售' },
      component: PresalePage,
    },
    {
      path: '/promotion',
      name: '营销活动',
      meta: { title: '营销活动', hideInMenu: true },
      component: PromotionPage,
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
