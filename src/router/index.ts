import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', requireAuth: false },
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Dashboard' },
      },
      {
        path: 'tenant',
        name: 'Tenant',
        meta: { title: '租户管理', icon: 'User' },
        children: [
          {
            path: 'list',
            name: 'TenantList',
            component: () => import('@/views/tenant/List.vue'),
            meta: { title: '租户列表' },
          },
        ],
      },
      {
        path: 'order',
        name: 'Order',
        meta: { title: '订单管理', icon: 'Document' },
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: () => import('@/views/order/List.vue'),
            meta: { title: '订单列表' },
          },
          {
            path: 'create',
            name: 'OrderCreate',
            component: () => import('@/views/order/Create.vue'),
            meta: { title: '创建订单' },
          },
          {
            path: 'detail/:id',
            name: 'OrderDetail',
            component: () => import('@/views/order/Detail.vue'),
            meta: { title: '订单详情' },
          },
        ],
      },
      {
        path: 'payment',
        name: 'Payment',
        meta: { title: '支付管理', icon: 'CreditCard' },
        children: [
          {
            path: 'balance',
            name: 'PaymentBalance',
            component: () => import('@/views/payment/Balance.vue'),
            meta: { title: '余额管理' },
          },
          {
            path: 'list',
            name: 'PaymentList',
            component: () => import('@/views/payment/List.vue'),
            meta: { title: '支付记录' },
          },
          {
            path: 'pay/:orderId',
            name: 'PaymentPay',
            component: () => import('@/views/payment/Pay.vue'),
            meta: { title: '支付订单' },
          },
        ],
      },
      {
        path: 'currency',
        name: 'Currency',
        meta: { title: '货币管理', icon: 'Money' },
        children: [
          {
            path: 'exchange-rates',
            name: 'ExchangeRates',
            component: () => import('@/views/currency/ExchangeRates.vue'),
            meta: { title: '汇率管理' },
          },
          {
            path: 'converter',
            name: 'CurrencyConverter',
            component: () => import('@/views/currency/Converter.vue'),
            meta: { title: '货币转换器' },
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || 'Happy Billing'} - Happy Billing`

  // 权限检查（示例）
  const requireAuth = to.meta.requireAuth !== false
  const token = localStorage.getItem('token')

  if (requireAuth && !token && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router
