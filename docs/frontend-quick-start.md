# Happy Billing 前端快速启动指南

> 本文档提供项目初始化和关键代码示例，帮助快速搭建项目。

---

## 一、项目初始化

### 1.1 创建项目

```bash
# 使用 Vite 创建项目
npm create vite@latest happy-billing-frontend -- --template vue-ts

cd happy-billing-frontend
```

### 1.2 安装依赖

```bash
# 核心依赖
npm install vue@^3.4.0 vue-router@^4.2.0 pinia@^2.1.0

# UI 组件库
npm install element-plus@^2.5.0
npm install @element-plus/icons-vue

# 国际化
npm install vue-i18n@^9.9.0

# 工具库
npm install axios@^1.6.0
npm install dayjs@^1.11.0
npm install lodash-es@^4.17.0
npm install decimal.js@^10.4.0

# 样式相关
npm install unocss@^0.58.0 -D
npm install sass@^1.70.0 -D
npm install postcss@^8.4.0 postcss-px-to-viewport@^1.1.0 autoprefixer@^10.4.0 -D

# VueUse
npm install @vueuse/core@^10.7.0

# 开发工具
npm install @types/node@^20.0.0 -D
npm install @types/lodash-es@^4.17.0 -D
npm install eslint@^8.56.0 prettier@^3.2.0 -D
npm install @antfu/eslint-config@^2.6.0 -D
```

---

## 二、关键配置文件

### 2.1 Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    // Element Plus 自动导入
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

### 2.2 TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path Mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2.3 UnoCSS 配置

```typescript
// uno.config.ts
import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  shortcuts: {
    // 常用布局
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',

    // 响应式容器
    'container-responsive': 'w-full mx-auto px-4 sm:px-6 lg:px-8',

    // 卡片样式
    'card': 'bg-white rounded-lg shadow-sm p-4',
  },
  theme: {
    breakpoints: {
      xs: '0px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1600px',
    },
  },
})
```

### 2.4 PostCSS 配置（移动端适配）

```javascript
// postcss.config.cjs
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport': {
      viewportWidth: 375,        // 设计稿宽度
      viewportUnit: 'vw',        // 转换单位
      selectorBlackList: ['.el-'], // Element Plus 不转换
      minPixelValue: 1,
      mediaQuery: false,
      exclude: [/node_modules/], // 排除 node_modules
    },
  },
}
```

### 2.5 环境变量配置

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=Happy Billing (Dev)

# .env.production
VITE_API_BASE_URL=https://api.happybilling.com
VITE_APP_TITLE=Happy Billing
```

---

## 三、核心代码示例

### 3.1 main.ts

```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createI18n } from 'vue-i18n'
import 'uno.css'
import '@/assets/styles/reset.scss'

import App from './App.vue'
import router from './router'

// 国际化
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(i18n)

app.mount('#app')
```

### 3.2 路由配置

```typescript
// src/router/index.ts
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
router.beforeEach((to, from, next) => {
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
```

### 3.3 API 请求封装

```typescript
// src/api/request.ts
import axios from 'axios'
import type { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PageResult<T = any> {
  total: number
  page: number
  page_size: number
  data: T[]
}

class Request {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        const tenantId = localStorage.getItem('tenantId')
        if (tenantId) {
          config.headers['X-Tenant-ID'] = tenantId
        }

        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { code, message, data } = response.data

        if (code === 0) {
          return { data, message }
        }

        ElMessage.error(message || '请求失败')
        return Promise.reject(new Error(message))
      },
      (error: AxiosError<ApiResponse>) => {
        if (error.response) {
          const { status, data } = error.response

          switch (status) {
            case 401:
              ElMessage.error('未授权，请重新登录')
              localStorage.removeItem('token')
              window.location.href = '/login'
              break
            case 403:
              ElMessage.error('拒绝访问')
              break
            case 404:
              ElMessage.error('请求的资源不存在')
              break
            case 500:
              ElMessage.error('服务器错误')
              break
            default:
              ElMessage.error(data?.message || '请求失败')
          }
        } else {
          ElMessage.error('网络错误，请检查网络连接')
        }

        return Promise.reject(error)
      }
    )
  }

  get<T = any>(url: string, params?: any) {
    return this.instance.get<any, { data: T; message: string }>(url, { params })
  }

  post<T = any>(url: string, data?: any) {
    return this.instance.post<any, { data: T; message: string }>(url, data)
  }

  put<T = any>(url: string, data?: any) {
    return this.instance.put<any, { data: T; message: string }>(url, data)
  }

  delete<T = any>(url: string) {
    return this.instance.delete<any, { data: T; message: string }>(url)
  }
}

export default new Request()
```

### 3.4 货币相关工具函数

```typescript
// src/utils/currency.ts
import Decimal from 'decimal.js'

export const CURRENCY_SYMBOLS: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£',
  HKD: 'HK$',
}

export const CURRENCY_DECIMALS: Record<string, number> = {
  CNY: 2,
  USD: 2,
  EUR: 2,
  JPY: 0,
  GBP: 2,
  HKD: 2,
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number | string,
  currency: string,
  options: {
    showSymbol?: boolean
    showCode?: boolean
    precision?: number
  } = {}
): string {
  const {
    showSymbol = true,
    showCode = true,
    precision = CURRENCY_DECIMALS[currency] || 2,
  } = options

  const decimal = new Decimal(amount)
  const formatted = decimal.toFixed(precision)

  const parts = formatted.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const numberStr = parts.join('.')

  const symbol = showSymbol ? CURRENCY_SYMBOLS[currency] || '' : ''
  const code = showCode ? ` ${currency}` : ''

  return `${symbol}${numberStr}${code}`
}

/**
 * 货币转换
 */
export function convertCurrency(
  amount: number | string,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number
): string {
  if (fromCurrency === toCurrency) {
    return new Decimal(amount).toFixed(CURRENCY_DECIMALS[toCurrency])
  }

  const decimal = new Decimal(amount)
  const rate = new Decimal(exchangeRate)
  const result = decimal.times(rate)

  return result.toFixed(CURRENCY_DECIMALS[toCurrency])
}
```

### 3.5 价格显示组件

```vue
<!-- src/components/common/PriceDisplay/index.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrency } from '@/utils/currency'
import { useResponsive } from '@/composables/useResponsive'

interface Props {
  amount: number
  currency: string
  exchangeRate?: number
  baseCurrency?: string
  baseCurrencyAmount?: number
  showBaseCurrency?: boolean
  size?: 'small' | 'default' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  baseCurrency: 'CNY',
  showBaseCurrency: false,
  size: 'default',
})

const { isMobile } = useResponsive()

const formattedAmount = computed(() =>
  formatCurrency(props.amount, props.currency)
)

const formattedBaseAmount = computed(() => {
  if (!props.baseCurrencyAmount) return ''
  return formatCurrency(props.baseCurrencyAmount, props.baseCurrency)
})

const sizeClass = computed(() => `price-display--${props.size}`)
</script>

<template>
  <div class="price-display" :class="[sizeClass, { 'is-mobile': isMobile }]">
    <div class="price-main">
      <span class="price-amount">{{ formattedAmount }}</span>
    </div>
    <div v-if="showBaseCurrency && baseCurrencyAmount" class="price-base">
      <span class="price-base-text">≈ {{ formattedBaseAmount }}</span>
      <el-tooltip v-if="exchangeRate" :content="`汇率: ${exchangeRate}`">
        <el-icon class="price-info-icon"><InfoFilled /></el-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
.price-display {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;

  &.is-mobile {
    flex-direction: column;
    gap: 4px;
  }

  &--small {
    .price-amount {
      font-size: 14px;
    }
    .price-base-text {
      font-size: 12px;
    }
  }

  &--large {
    .price-amount {
      font-size: 24px;
      font-weight: 600;
    }
    .price-base-text {
      font-size: 14px;
    }
  }
}

.price-main {
  display: flex;
  align-items: baseline;
}

.price-amount {
  font-size: 16px;
  color: #303133;
}

.price-base {
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-base-text {
  font-size: 12px;
  color: #909399;
}

.price-info-icon {
  font-size: 14px;
  color: #909399;
  cursor: help;
}
</style>
```

### 3.6 货币选择器组件

```vue
<!-- src/components/common/CurrencySelector/index.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { CURRENCY_SYMBOLS } from '@/utils/currency'
import type { Currency } from '@/types/api/currency'

interface Props {
  modelValue: Currency
  currencies?: Currency[]
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: Currency): void
}

const props = withDefaults(defineProps<Props>(), {
  currencies: () => ['CNY', 'USD', 'EUR', 'JPY', 'GBP', 'HKD'],
  disabled: false,
})

const emit = defineEmits<Emits>()

const selected = ref<Currency>(props.modelValue)

watch(selected, (value) => {
  emit('update:modelValue', value)
})

watch(() => props.modelValue, (value) => {
  selected.value = value
})
</script>

<template>
  <el-select v-model="selected" :disabled="disabled" placeholder="选择货币">
    <el-option
      v-for="currency in currencies"
      :key="currency"
      :value="currency"
      :label="`${CURRENCY_SYMBOLS[currency]} ${currency}`"
    >
      <span class="currency-option">
        <span class="currency-symbol">{{ CURRENCY_SYMBOLS[currency] }}</span>
        <span class="currency-code">{{ currency }}</span>
      </span>
    </el-option>
  </el-select>
</template>

<style scoped lang="scss">
.currency-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.currency-symbol {
  font-size: 16px;
  font-weight: 600;
}

.currency-code {
  color: #606266;
}
</style>
```

### 3.7 响应式检测 Composable

```typescript
// src/composables/useResponsive.ts
import { useBreakpoints } from '@vueuse/core'

export function useResponsive() {
  const breakpoints = useBreakpoints({
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  })

  const isMobile = breakpoints.smaller('md')
  const isTablet = breakpoints.between('md', 'lg')
  const isDesktop = breakpoints.greaterOrEqual('lg')

  return {
    isMobile,
    isTablet,
    isDesktop,
  }
}
```

---

## 四、开发流程

### 4.1 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:5173

### 4.2 构建生产版本

```bash
npm run build
```

### 4.3 本地预览生产版本

```bash
npm run preview
```

---

## 五、目录创建脚本

快速创建项目目录结构：

```bash
#!/bin/bash

# 创建目录结构
mkdir -p src/{api/modules,assets/{images,icons,styles},components/{common,business},composables,layouts,locales/{zh-CN,en-US},router,stores/modules,types/{api,models},utils,views/{login,dashboard,tenant,product,order,billing,payment,currency}}

# 创建基础文件
touch src/api/request.ts
touch src/api/types.ts
touch src/assets/styles/{variables.scss,mixins.scss,reset.scss}
touch src/composables/{useCurrency.ts,useAuth.ts,useResponsive.ts,useI18n.ts}
touch src/layouts/{DefaultLayout.vue,MobileLayout.vue,EmptyLayout.vue}
touch src/router/{index.ts,routes.ts,guards.ts}
touch src/stores/index.ts
touch src/utils/{currency.ts,date.ts,storage.ts,validator.ts,constants.ts}
touch src/App.vue
touch src/main.ts

echo "目录结构创建完成！"
```

---

## 六、下一步

1. **初始化项目** ✅
2. **安装依赖** ✅
3. **配置文件** ✅
4. **创建目录结构** ✅
5. **实现核心组件**（价格显示、货币选择器）
6. **开发订单创建页面**（多币种支持）
7. **开发支付页面**
8. **测试与优化**

需要我继续帮您实现某个具体模块吗？
