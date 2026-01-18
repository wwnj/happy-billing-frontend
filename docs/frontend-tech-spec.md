# Happy Billing 前端技术方案文档

> **项目名称：** happy-billing-frontend
> **技术栈：** Vue 3 + TypeScript + Element Plus
> **特性：** 国际化支持 + 移动端适配
> **创建日期：** 2026-01-17

---

## 一、技术栈详细说明

### 1.1 核心框架

| 技术 | 版本 | 用途 | 选型理由 |
|------|------|------|----------|
| **Vue 3** | ^3.4.0 | 前端框架 | 组合式 API、性能优秀、生态成熟 |
| **TypeScript** | ^5.3.0 | 类型系统 | 类型安全、与后端 Go 强类型一致 |
| **Vite** | ^5.0.0 | 构建工具 | 开发体验好、构建速度快 |
| **Vue Router** | ^4.2.0 | 路由管理 | 官方路由，支持 TypeScript |
| **Pinia** | ^2.1.0 | 状态管理 | 轻量、类型安全、组合式 API 友好 |

### 1.2 UI 组件库

| 技术 | 版本 | 用途 | 选型理由 |
|------|------|------|----------|
| **Element Plus** | ^2.5.0 | UI 组件库 | 企业级、组件丰富、中文文档完善 |
| **UnoCSS** | ^0.58.0 | 原子化 CSS | 按需加载、性能优秀、移动端适配友好 |
| **VueUse** | ^10.7.0 | 组合式工具库 | 提供大量实用 Hooks |

### 1.3 国际化 & 移动端

| 技术 | 版本 | 用途 |
|------|------|------|
| **vue-i18n** | ^9.9.0 | 国际化 |
| **@vueuse/core** | ^10.7.0 | 响应式工具（移动端检测） |
| **autoprefixer** | ^10.4.0 | CSS 兼容性 |
| **postcss-px-to-viewport** | ^1.1.0 | 移动端适配（px → vw） |

### 1.4 开发辅助

| 技术 | 版本 | 用途 |
|------|------|------|
| **axios** | ^1.6.0 | HTTP 请求 |
| **dayjs** | ^1.11.0 | 日期处理 |
| **lodash-es** | ^4.17.0 | 工具函数 |
| **decimal.js** | ^10.4.0 | 高精度计算（货币） |
| **echarts** | ^5.4.0 | 图表库（汇率趋势） |
| **@vueuse/motion** | ^2.0.0 | 动画库 |

---

## 二、项目架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────┐
│          用户界面层 (UI Layer)            │
│   ┌──────────┐  ┌──────────┐  ┌──────┐  │
│   │ 桌面端    │  │ 移动端    │  │ i18n │  │
│   └──────────┘  └──────────┘  └──────┘  │
├─────────────────────────────────────────┤
│        组件层 (Component Layer)          │
│   ┌──────────┐  ┌──────────┐  ┌──────┐  │
│   │ 业务组件  │  │ 基础组件  │  │ 布局 │  │
│   └──────────┘  └──────────┘  └──────┘  │
├─────────────────────────────────────────┤
│         逻辑层 (Logic Layer)             │
│   ┌──────────┐  ┌──────────┐  ┌──────┐  │
│   │ Composables│ │  Store   │  │ Utils│  │
│   └──────────┘  └──────────┘  └──────┘  │
├─────────────────────────────────────────┤
│          API 层 (API Layer)              │
│   ┌──────────┐  ┌──────────┐  ┌──────┐  │
│   │ Request  │  │ Interceptor│ │ Types│  │
│   └──────────┘  └──────────┘  └──────┘  │
├─────────────────────────────────────────┤
│            后端服务 (Backend)            │
│         Go API Server :8080              │
└─────────────────────────────────────────┘
```

### 2.2 目录结构

```
happy-billing-frontend/
├── .vscode/                    # VSCode 配置
│   ├── settings.json
│   └── extensions.json
├── public/                     # 静态资源
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── api/                    # API 接口层
│   │   ├── modules/            # 按业务模块分类
│   │   │   ├── tenant.ts       # 租户 API
│   │   │   ├── product.ts      # 产品 API
│   │   │   ├── order.ts        # 订单 API
│   │   │   ├── billing.ts      # 账单 API
│   │   │   ├── payment.ts      # 支付 API
│   │   │   └── currency.ts     # 货币 API
│   │   ├── request.ts          # Axios 封装
│   │   └── types.ts            # 通用类型定义
│   │
│   ├── assets/                 # 资源文件
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       ├── variables.scss  # 全局变量
│   │       ├── mixins.scss     # 混入
│   │       └── reset.scss      # 样式重置
│   │
│   ├── components/             # 组件
│   │   ├── common/             # 通用组件
│   │   │   ├── CurrencySelector/     # 货币选择器
│   │   │   ├── PriceDisplay/         # 价格显示
│   │   │   ├── ExchangeRateInfo/     # 汇率信息
│   │   │   ├── BalanceCard/          # 余额卡片
│   │   │   └── ResponsiveTable/      # 响应式表格
│   │   └── business/           # 业务组件
│   │       ├── OrderForm/            # 订单表单
│   │       ├── PaymentModal/         # 支付弹窗
│   │       └── BillDetail/           # 账单详情
│   │
│   ├── composables/            # 组合式函数
│   │   ├── useCurrency.ts      # 货币相关
│   │   ├── useAuth.ts          # 认证相关
│   │   ├── useResponsive.ts    # 响应式检测
│   │   └── useI18n.ts          # 国际化
│   │
│   ├── layouts/                # 布局组件
│   │   ├── DefaultLayout.vue   # 默认布局（桌面端）
│   │   ├── MobileLayout.vue    # 移动端布局
│   │   └── EmptyLayout.vue     # 空白布局（登录页）
│   │
│   ├── locales/                # 国际化资源
│   │   ├── zh-CN/              # 简体中文
│   │   │   ├── common.json
│   │   │   ├── order.json
│   │   │   ├── payment.json
│   │   │   └── currency.json
│   │   ├── en-US/              # 英语
│   │   └── ja-JP/              # 日语（可选）
│   │
│   ├── router/                 # 路由
│   │   ├── index.ts            # 路由配置
│   │   ├── routes.ts           # 路由定义
│   │   └── guards.ts           # 路由守卫
│   │
│   ├── stores/                 # Pinia 状态管理
│   │   ├── modules/
│   │   │   ├── user.ts         # 用户状态
│   │   │   ├── tenant.ts       # 租户状态
│   │   │   ├── currency.ts     # 货币状态
│   │   │   └── app.ts          # 应用状态（语言、主题）
│   │   └── index.ts
│   │
│   ├── types/                  # TypeScript 类型定义
│   │   ├── api/                # API 响应类型
│   │   │   ├── tenant.d.ts
│   │   │   ├── order.d.ts
│   │   │   ├── payment.d.ts
│   │   │   └── currency.d.ts
│   │   ├── models/             # 数据模型
│   │   └── global.d.ts         # 全局类型
│   │
│   ├── utils/                  # 工具函数
│   │   ├── currency.ts         # 货币格式化
│   │   ├── date.ts             # 日期格式化
│   │   ├── storage.ts          # 本地存储
│   │   ├── validator.ts        # 表单验证
│   │   └── constants.ts        # 常量定义
│   │
│   ├── views/                  # 页面组件
│   │   ├── login/              # 登录
│   │   ├── dashboard/          # 仪表盘
│   │   ├── tenant/             # 租户管理
│   │   │   ├── List.vue
│   │   │   ├── Detail.vue
│   │   │   └── Register.vue
│   │   ├── product/            # 产品管理
│   │   │   ├── CategoryList.vue
│   │   │   ├── SpuList.vue
│   │   │   └── SkuList.vue
│   │   ├── order/              # 订单管理 ⭐
│   │   │   ├── List.vue
│   │   │   ├── Create.vue
│   │   │   └── Detail.vue
│   │   ├── billing/            # 账单管理
│   │   │   ├── List.vue
│   │   │   └── Detail.vue
│   │   ├── payment/            # 支付管理 ⭐
│   │   │   ├── List.vue
│   │   │   ├── Pay.vue
│   │   │   └── Balance.vue
│   │   └── currency/           # 货币管理 ⭐
│   │       ├── ExchangeRates.vue
│   │       ├── Converter.vue
│   │       └── History.vue
│   │
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 入口文件
│   └── env.d.ts                # 环境变量类型
│
├── .env                        # 环境变量（不提交）
├── .env.development            # 开发环境
├── .env.production             # 生产环境
├── .eslintrc.cjs               # ESLint 配置
├── .prettierrc.json            # Prettier 配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
├── uno.config.ts               # UnoCSS 配置
├── postcss.config.cjs          # PostCSS 配置
├── package.json
└── README.md
```

---

## 三、核心功能模块设计

### 3.1 租户管理模块

**功能列表：**
- ✅ 租户注册（个人/企业）
- ✅ 租户列表（支持搜索、筛选）
- ✅ 租户详情
- ✅ 租户认证管理
- ⭐ **偏好货币设置**

**关键页面：**
```
/tenant
  ├── /list            # 租户列表
  ├── /register        # 租户注册
  ├── /detail/:id      # 租户详情
  └── /settings        # 租户设置（偏好货币）
```

**API 对接：**
```typescript
// GET /api/v1/tenants
export const getTenantList = (params: TenantListQuery) => {
  return request.get<PageResult<Tenant>>('/api/v1/tenants', { params })
}

// POST /api/v1/tenants/register/individual
export const registerIndividual = (data: RegisterIndividualRequest) => {
  return request.post<TenantResponse>('/api/v1/tenants/register/individual', data)
}

// POST /api/v1/tenants/register/enterprise
export const registerEnterprise = (data: RegisterEnterpriseRequest) => {
  return request.post<TenantResponse>('/api/v1/tenants/register/enterprise', data)
}
```

---

### 3.2 产品目录模块

**功能列表：**
- ✅ 产品分类管理
- ✅ SPU 列表
- ✅ SKU 列表（支持规格筛选）
- ✅ 产品详情（展示价格规则）

**关键页面：**
```
/product
  ├── /category        # 分类列表
  ├── /spu             # SPU 列表
  └── /sku             # SKU 列表
```

**API 对接：**
```typescript
// GET /api/v1/products/category
export const getCategoryList = (params: CategoryListQuery) => {
  return request.get<PageResult<ProductCategory>>('/api/v1/products/category', { params })
}

// GET /api/v1/products/spu
export const getSpuList = (params: SpuListQuery) => {
  return request.get<PageResult<ProductSpu>>('/api/v1/products/spu', { params })
}

// GET /api/v1/products/sku
export const getSkuList = (params: SkuListQuery) => {
  return request.get<PageResult<ProductSku>>('/api/v1/products/sku', { params })
}
```

---

### 3.3 订单管理模块 ⭐ 核心

**功能列表：**
- ⭐ **多币种订单创建**
- ✅ 订单列表（支持币种筛选）
- ✅ 订单详情（显示汇率快照）
- ✅ 订单取消
- ✅ 订单状态追踪

**关键页面：**
```
/order
  ├── /list            # 订单列表
  ├── /create          # 创建订单 ⭐
  └── /detail/:id      # 订单详情 ⭐
```

**订单创建流程设计：**
```
步骤 1: 选择产品
  └─> 显示 SKU 列表，支持搜索和筛选

步骤 2: 配置规格
  └─> 数量、使用时长、地域等

步骤 3: 价格计算 ⭐
  ├─> 自动获取租户偏好货币
  ├─> 调用定价 API 计算价格
  ├─> 实时显示：显示币种金额 + 本位币金额
  └─> 显示汇率信息

步骤 4: 确认订单
  └─> 提交创建
```

**订单详情展示：**
```vue
<!-- 订单金额展示 -->
<PriceDisplay
  :amount="16.00"
  :currency="USD"
  :exchange-rate="0.1385"
  :show-base-currency="true"
/>
<!-- 显示效果：$16.00 USD (≈ ¥115.52 CNY @ 0.1385) -->
```

**API 对接：**
```typescript
// POST /api/v1/orders
export const createOrder = (data: CreateOrderRequest) => {
  return request.post<Order>('/api/v1/orders', data)
}

// GET /api/v1/orders
export const getOrderList = (params: OrderListQuery) => {
  return request.get<PageResult<Order>>('/api/v1/orders', { params })
}

// GET /api/v1/orders/:order_id
export const getOrderDetail = (orderId: string) => {
  return request.get<Order>(`/api/v1/orders/${orderId}`)
}

// PUT /api/v1/orders/:order_id/cancel
export const cancelOrder = (orderId: string) => {
  return request.put(`/api/v1/orders/${orderId}/cancel`)
}
```

---

### 3.4 账单管理模块

**功能列表：**
- ✅ 账单列表（支持状态筛选）
- ✅ 账单详情（显示汇率）
- ✅ 账单支付入口

**关键页面：**
```
/billing
  ├── /list            # 账单列表
  └── /detail/:id      # 账单详情
```

**API 对接：**
```typescript
// GET /api/v1/bills
export const getBillList = (params: BillListQuery) => {
  return request.get<PageResult<Bill>>('/api/v1/bills', { params })
}

// GET /api/v1/bills/:bill_id
export const getBillDetail = (billId: string) => {
  return request.get<Bill>(`/api/v1/bills/${billId}`)
}
```

---

### 3.5 支付管理模块 ⭐ 核心

**功能列表：**
- ⭐ **余额查询（显示 CNY）**
- ⭐ **账户充值**
- ⭐ **多币种支付**
- ✅ 支付记录查询
- ✅ 余额变动记录

**关键页面：**
```
/payment
  ├── /balance         # 余额管理 ⭐
  ├── /pay             # 支付页面 ⭐
  ├── /records         # 支付记录
  └── /transactions    # 余额变动记录
```

**支付流程设计：**
```
步骤 1: 选择支付对象
  ├─> 从账单列表选择
  └─> 或从订单详情进入

步骤 2: 确认支付信息 ⭐
  ├─> 账单金额：$16.00 USD
  ├─> 实时汇率：1 USD = 7.22 CNY
  ├─> 本位币金额：¥115.52 CNY
  ├─> 当前余额：¥60,860.48 CNY
  └─> 支付后余额：¥60,744.96 CNY

步骤 3: 选择支付方式
  ├─> 余额支付（默认）
  ├─> 支付宝（模拟）
  └─> 微信支付（模拟）

步骤 4: 支付确认
  └─> 输入支付密码（如需要）

步骤 5: 支付结果
  └─> 显示支付成功 + 跳转到支付记录
```

**余额页面设计：**
```vue
<BalanceCard>
  <div class="balance-header">
    <div class="amount">¥60,860.48</div>
    <div class="currency">CNY (本位币)</div>
  </div>
  <div class="balance-actions">
    <el-button type="primary">充值</el-button>
    <el-button>变动记录</el-button>
  </div>
  <div class="balance-info">
    <div>冻结余额: ¥0.00</div>
    <div>信用额度: ¥0.00</div>
  </div>
</BalanceCard>
```

**API 对接：**
```typescript
// GET /api/v1/tenants/:tenant_id/balance
export const getBalance = (tenantId: string) => {
  return request.get<AccountBalance>(`/api/v1/tenants/${tenantId}/balance`)
}

// POST /api/v1/tenants/:tenant_id/balance/recharge
export const recharge = (tenantId: string, data: RechargeRequest) => {
  return request.post(`/api/v1/tenants/${tenantId}/balance/recharge`, data)
}

// POST /api/v1/payments
export const createPayment = (data: CreatePaymentRequest) => {
  return request.post<Payment>('/api/v1/payments', data)
}

// GET /api/v1/payments/:payment_id
export const getPaymentDetail = (paymentId: string) => {
  return request.get<Payment>(`/api/v1/payments/${paymentId}`)
}
```

---

### 3.6 货币管理模块 ⭐ 新增

**功能列表：**
- ⭐ **汇率列表**
- ⭐ **汇率查询**
- ⭐ **货币转换器**
- ⭐ **汇率历史趋势图**

**关键页面：**
```
/currency
  ├── /exchange-rates  # 汇率列表 ⭐
  ├── /converter       # 货币转换器 ⭐
  └── /history         # 汇率历史
```

**货币转换器设计：**
```vue
<CurrencyConverter>
  <div class="converter-input">
    <el-input v-model="amount" type="number" />
    <CurrencySelector v-model="fromCurrency" />
  </div>
  <div class="converter-result">
    <div class="result-amount">{{ convertedAmount }}</div>
    <CurrencySelector v-model="toCurrency" />
  </div>
  <div class="exchange-rate-info">
    汇率: 1 {{ fromCurrency }} = {{ rate }} {{ toCurrency }}
    <div class="rate-date">更新时间: {{ effectiveDate }}</div>
  </div>
</CurrencyConverter>
```

**汇率趋势图：**
- 使用 ECharts 展示汇率历史趋势
- 支持选择时间范围（7天、30天、90天）
- 支持多币种对比

**API 对接：**
```typescript
// GET /api/v1/exchange-rates
export const getExchangeRates = (params: ExchangeRateListQuery) => {
  return request.get<PageResult<ExchangeRate>>('/api/v1/exchange-rates', { params })
}

// GET /api/v1/exchange-rates/query
export const queryExchangeRate = (params: ExchangeRateQuery) => {
  return request.get<ExchangeRate>('/api/v1/exchange-rates/query', { params })
}

// POST /api/v1/currency/convert
export const convertCurrency = (data: CurrencyConvertRequest) => {
  return request.post<CurrencyConvertResponse>('/api/v1/currency/convert', data)
}
```

---

## 四、国际化实现方案

### 4.1 支持的语言

| 语言 | 代码 | 优先级 | 说明 |
|------|------|--------|------|
| 简体中文 | zh-CN | P0 | 默认语言 |
| 英语 | en-US | P0 | 国际化必备 |
| 日语 | ja-JP | P1 | 可选（根据业务需求） |

### 4.2 国际化资源结构

```
src/locales/
├── zh-CN/
│   ├── common.json      # 通用词汇
│   ├── menu.json        # 菜单
│   ├── tenant.json      # 租户模块
│   ├── product.json     # 产品模块
│   ├── order.json       # 订单模块
│   ├── payment.json     # 支付模块
│   ├── currency.json    # 货币模块 ⭐
│   └── validation.json  # 表单验证
├── en-US/
│   └── ...
└── ja-JP/
    └── ...
```

### 4.3 货币模块国际化示例

```json
// zh-CN/currency.json
{
  "currency": {
    "title": "货币管理",
    "exchangeRate": "汇率",
    "baseCurrency": "本位币",
    "displayCurrency": "显示币种",
    "converter": "货币转换器",
    "history": "汇率历史",
    "effectiveDate": "生效日期",
    "source": "汇率来源",
    "convert": {
      "from": "从",
      "to": "到",
      "amount": "金额",
      "result": "转换结果",
      "rate": "汇率"
    },
    "currencies": {
      "CNY": "人民币",
      "USD": "美元",
      "EUR": "欧元",
      "JPY": "日元",
      "GBP": "英镑",
      "HKD": "港币"
    }
  }
}

// en-US/currency.json
{
  "currency": {
    "title": "Currency Management",
    "exchangeRate": "Exchange Rate",
    "baseCurrency": "Base Currency",
    "displayCurrency": "Display Currency",
    "converter": "Currency Converter",
    "history": "Exchange Rate History",
    "effectiveDate": "Effective Date",
    "source": "Rate Source",
    "convert": {
      "from": "From",
      "to": "To",
      "amount": "Amount",
      "result": "Result",
      "rate": "Rate"
    },
    "currencies": {
      "CNY": "Chinese Yuan",
      "USD": "US Dollar",
      "EUR": "Euro",
      "JPY": "Japanese Yen",
      "GBP": "British Pound",
      "HKD": "Hong Kong Dollar"
    }
  }
}
```

### 4.4 使用示例

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div>
    <h1>{{ t('currency.title') }}</h1>
    <el-select v-model="currency">
      <el-option
        v-for="curr in ['CNY', 'USD', 'EUR']"
        :key="curr"
        :value="curr"
        :label="t(`currency.currencies.${curr}`)"
      />
    </el-select>
  </div>
</template>
```

---

## 五、移动端适配方案

### 5.1 响应式断点设计

```typescript
// src/utils/constants.ts
export const BREAKPOINTS = {
  xs: 0,      // 手机竖屏
  sm: 576,    // 手机横屏
  md: 768,    // 平板竖屏
  lg: 992,    // 平板横屏
  xl: 1200,   // 桌面
  xxl: 1600   // 大屏
}
```

### 5.2 布局适配策略

**桌面端布局 (≥768px):**
```
┌─────────────────────────────────┐
│         顶部导航栏               │
├──────┬──────────────────────────┤
│      │                          │
│ 侧边 │      内容区域            │
│ 菜单 │                          │
│      │                          │
└──────┴──────────────────────────┘
```

**移动端布局 (<768px):**
```
┌─────────────────────────────────┐
│  Logo  [汉堡菜单]  [用户]        │
├─────────────────────────────────┤
│                                 │
│         内容区域                 │
│         (全屏)                  │
│                                 │
└─────────────────────────────────┘
```

### 5.3 自适应组件示例

**响应式表格：**
```vue
<!-- ResponsiveTable.vue -->
<template>
  <!-- 桌面端：标准表格 -->
  <el-table v-if="!isMobile" :data="data">
    <el-table-column prop="orderId" label="订单ID" />
    <el-table-column prop="amount" label="金额" />
    <el-table-column prop="currency" label="币种" />
    <el-table-column prop="status" label="状态" />
  </el-table>

  <!-- 移动端：卡片列表 -->
  <div v-else class="mobile-list">
    <el-card v-for="item in data" :key="item.orderId" class="order-card">
      <div class="card-header">
        <span class="order-id">{{ item.orderId }}</span>
        <el-tag :type="getStatusType(item.status)">{{ item.status }}</el-tag>
      </div>
      <div class="card-body">
        <PriceDisplay :amount="item.amount" :currency="item.currency" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useResponsive } from '@/composables/useResponsive'

const { isMobile } = useResponsive()
</script>
```

**响应式价格显示：**
```vue
<!-- PriceDisplay.vue -->
<template>
  <!-- 桌面端：横向排列 -->
  <div v-if="!isMobile" class="price-horizontal">
    <span class="amount">{{ formattedAmount }}</span>
    <span class="currency">{{ currency }}</span>
    <span v-if="showBaseCurrency" class="base-amount">
      (≈ {{ formattedBaseAmount }} {{ baseCurrency }})
    </span>
  </div>

  <!-- 移动端：垂直排列 -->
  <div v-else class="price-vertical">
    <div class="main-price">
      <span class="amount">{{ formattedAmount }}</span>
      <span class="currency">{{ currency }}</span>
    </div>
    <div v-if="showBaseCurrency" class="base-price">
      ≈ {{ formattedBaseAmount }} {{ baseCurrency }}
    </div>
  </div>
</template>

<style scoped>
.price-horizontal {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-vertical {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-vertical .main-price {
  font-size: 18px;
  font-weight: 600;
}

.price-vertical .base-price {
  font-size: 12px;
  color: #909399;
}
</style>
```

### 5.4 移动端优化

**触摸优化：**
```scss
// 增大点击区域
.mobile-button {
  min-height: 44px;  // iOS 推荐的最小触摸尺寸
  padding: 12px 20px;
}

// 触摸反馈
.mobile-list-item {
  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
```

**字体大小适配：**
```scss
// 使用 vw 单位实现流式排版
html {
  font-size: calc(14px + 2 * (100vw - 320px) / 1280);
}

// 移动端字体不小于 14px
@media (max-width: 768px) {
  body {
    font-size: max(14px, 1rem);
  }
}
```

**性能优化：**
- 列表虚拟滚动（使用 `vue-virtual-scroller`）
- 图片懒加载（使用 `vue-lazyload`）
- 路由懒加载
- 组件按需加载

---

## 六、关键技术实现

### 6.1 货币格式化工具

```typescript
// src/utils/currency.ts
import Decimal from 'decimal.js'

/**
 * 货币符号映射
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£',
  HKD: 'HK$'
}

/**
 * 货币小数位配置
 */
export const CURRENCY_DECIMALS: Record<string, number> = {
  CNY: 2,
  USD: 2,
  EUR: 2,
  JPY: 0,  // 日元没有小数位
  GBP: 2,
  HKD: 2
}

/**
 * 格式化货币金额
 * @param amount 金额
 * @param currency 货币代码
 * @param options 格式化选项
 * @returns 格式化后的字符串
 */
export function formatCurrency(
  amount: number | string,
  currency: string,
  options: {
    showSymbol?: boolean    // 是否显示符号
    showCode?: boolean      // 是否显示货币代码
    precision?: number      // 小数位数（覆盖默认）
  } = {}
): string {
  const {
    showSymbol = true,
    showCode = true,
    precision = CURRENCY_DECIMALS[currency] || 2
  } = options

  // 使用 Decimal.js 确保精度
  const decimal = new Decimal(amount)
  const formatted = decimal.toFixed(precision)

  // 添加千位分隔符
  const parts = formatted.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const numberStr = parts.join('.')

  // 构建最终字符串
  const symbol = showSymbol ? CURRENCY_SYMBOLS[currency] || '' : ''
  const code = showCode ? ` ${currency}` : ''

  return `${symbol}${numberStr}${code}`
}

/**
 * 货币转换
 * @param amount 金额
 * @param fromCurrency 源货币
 * @param toCurrency 目标货币
 * @param exchangeRate 汇率
 * @returns 转换后的金额
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

/**
 * 示例：
 * formatCurrency(115.5235, 'CNY')  // "¥115.52 CNY"
 * formatCurrency(16, 'USD')        // "$16.00 USD"
 * formatCurrency(1000, 'JPY')      // "¥1,000 JPY"
 * convertCurrency(16, 'USD', 'CNY', 7.22)  // "115.52"
 */
```

### 6.2 货币相关 Composable

```typescript
// src/composables/useCurrency.ts
import { ref, computed } from 'vue'
import { useCurrencyStore } from '@/stores/modules/currency'
import { queryExchangeRate, convertCurrency as apiConvert } from '@/api/modules/currency'
import type { Currency, ExchangeRate } from '@/types/api/currency'

export function useCurrency() {
  const currencyStore = useCurrencyStore()
  const loading = ref(false)

  /**
   * 获取汇率
   */
  const getRate = async (
    fromCurrency: Currency,
    toCurrency: Currency,
    date?: string
  ): Promise<ExchangeRate | null> => {
    // 先从缓存获取
    const cached = currencyStore.getRate(fromCurrency, toCurrency)
    if (cached) return cached

    // 从 API 获取
    loading.value = true
    try {
      const { data } = await queryExchangeRate({
        from_currency: fromCurrency,
        to_currency: toCurrency,
        date
      })
      currencyStore.setRate(fromCurrency, toCurrency, data)
      return data
    } catch (error) {
      console.error('Failed to get exchange rate:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 货币转换
   */
  const convert = async (
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency
  ): Promise<{ convertedAmount: number; rate: number } | null> => {
    loading.value = true
    try {
      const { data } = await apiConvert({
        amount,
        from_currency: fromCurrency,
        to_currency: toCurrency
      })
      return {
        convertedAmount: data.converted_amount,
        rate: data.exchange_rate
      }
    } catch (error) {
      console.error('Failed to convert currency:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 计算本位币金额
   */
  const calculateBaseCurrencyAmount = async (
    amount: number,
    currency: Currency
  ): Promise<number> => {
    if (currency === 'CNY') return amount

    const result = await convert(amount, currency, 'CNY')
    return result?.convertedAmount || 0
  }

  return {
    loading: computed(() => loading.value),
    getRate,
    convert,
    calculateBaseCurrencyAmount
  }
}
```

### 6.3 响应式检测 Composable

```typescript
// src/composables/useResponsive.ts
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { BREAKPOINTS } from '@/utils/constants'

export function useResponsive() {
  const breakpoints = useBreakpoints(BREAKPOINTS)

  const isMobile = breakpoints.smaller('md')    // < 768px
  const isTablet = breakpoints.between('md', 'lg')  // 768px - 992px
  const isDesktop = breakpoints.greaterOrEqual('lg') // >= 992px

  const deviceType = computed(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    return 'desktop'
  })

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType
  }
}
```

---

## 七、API 对接规范

### 7.1 请求封装

```typescript
// src/api/request.ts
import axios, { AxiosError, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'

/**
 * 统一响应结构
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 分页结果
 */
export interface PageResult<T = any> {
  total: number
  page: number
  page_size: number
  data: T[]
}

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    // 添加 Token
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }

    // 添加租户 ID（如果有）
    if (userStore.currentTenantId) {
      config.headers['X-Tenant-ID'] = userStore.currentTenantId
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data

    // 成功响应
    if (code === 0) {
      return { data, message }
    }

    // 业务错误
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message))
  },
  (error: AxiosError<ApiResponse>) => {
    // HTTP 错误
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          // 跳转到登录页
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

export default request
```

### 7.2 TypeScript 类型定义

```typescript
// src/types/api/currency.d.ts
export type Currency = 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP' | 'HKD'

/**
 * 汇率
 */
export interface ExchangeRate {
  id: number
  from_currency: Currency
  to_currency: Currency
  rate: number
  effective_date: string
  source?: string
  created_at: string
}

/**
 * 汇率查询请求
 */
export interface ExchangeRateQuery {
  from_currency: Currency
  to_currency: Currency
  date?: string
}

/**
 * 货币转换请求
 */
export interface CurrencyConvertRequest {
  amount: number
  from_currency: Currency
  to_currency: Currency
  date?: string
}

/**
 * 货币转换响应
 */
export interface CurrencyConvertResponse {
  from_currency: Currency
  to_currency: Currency
  amount: number
  converted_amount: number
  exchange_rate: number
  effective_date: string
}
```

```typescript
// src/types/api/order.d.ts
import type { Currency } from './currency'

export type OrderType = 'PREPAID' | 'POSTPAID'
export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED'

/**
 * 订单
 */
export interface Order {
  order_id: string
  order_no: string
  tenant_id: string
  organization_id: string
  project_id: string
  user_id: string
  order_type: OrderType
  spu_code: string
  sku_code: string
  currency: Currency
  exchange_rate?: number
  base_currency: Currency
  base_currency_amount?: number
  original_amount: number
  discount_amount: number
  payable_amount: number
  paid_amount: number
  period_start?: string
  period_end?: string
  status: OrderStatus
  order_detail?: Record<string, any>
  created_at: string
  updated_at: string
}

/**
 * 创建订单请求
 */
export interface CreateOrderRequest {
  tenant_id: string
  organization_id: string
  project_id: string
  user_id: string
  order_type: OrderType
  sku_code: string
  quantity: number
  period_start?: string
  period_end?: string
  order_detail?: Record<string, any>
}

/**
 * 订单列表查询
 */
export interface OrderListQuery {
  tenant_id?: string
  status?: OrderStatus
  currency?: Currency
  page: number
  page_size: number
}
```

### 7.3 环境变量配置

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=Happy Billing
VITE_ENABLE_MOCK=false

# .env.production
VITE_API_BASE_URL=https://api.happybilling.com
VITE_APP_TITLE=Happy Billing
VITE_ENABLE_MOCK=false
```

---

## 八、开发计划

### 8.1 第一阶段：基础搭建（1 周）

**任务清单：**
- [x] 初始化项目（Vite + Vue 3 + TypeScript）
- [x] 配置 Element Plus、UnoCSS、vue-i18n
- [x] 搭建基础架构（Router、Pinia、API 层）
- [x] 实现登录页面和布局系统
- [x] 配置国际化（中文、英文）
- [x] 配置移动端适配（PostCSS）

**验收标准：**
- ✅ 项目可运行，无编译错误
- ✅ 基础路由正常工作
- ✅ 国际化切换正常
- ✅ 移动端布局适配正常

---

### 8.2 第二阶段：核心组件开发（1 周）

**任务清单：**
- [x] 实现 `CurrencySelector` 货币选择器
- [x] 实现 `PriceDisplay` 价格显示组件
- [x] 实现 `ExchangeRateInfo` 汇率信息组件
- [x] 实现 `BalanceCard` 余额卡片
- [x] 实现 `ResponsiveTable` 响应式表格
- [x] 编写组件文档和 Storybook（可选）

**验收标准：**
- ✅ 所有组件通过单元测试
- ✅ 组件在移动端和桌面端显示正常
- ✅ 组件支持国际化

---

### 8.3 第三阶段：业务模块开发（2 周）

**Week 1：租户、产品、订单模块**
- [x] 租户管理页面
- [x] 产品目录页面
- [x] 订单列表页面
- [x] **订单创建页面（多币种支持）⭐**
- [x] 订单详情页面

**Week 2：账单、支付、货币模块**
- [x] 账单列表页面
- [x] 账单详情页面
- [x] **支付页面（多币种支付）⭐**
- [x] **余额管理页面 ⭐**
- [x] **货币管理页面（汇率、转换器、历史）⭐**

**验收标准：**
- ✅ 所有页面功能完整
- ✅ 多币种流程测试通过
- ✅ API 对接正常

---

### 8.4 第四阶段：测试与优化（1 周）

**任务清单：**
- [x] 单元测试（Vitest）
- [x] E2E 测试（Playwright）
- [x] 性能优化（懒加载、虚拟滚动）
- [x] 移动端兼容性测试
- [x] 多语言测试
- [x] 修复 Bug

**验收标准：**
- ✅ 测试覆盖率 > 80%
- ✅ Lighthouse 性能评分 > 90
- ✅ 移动端所有功能正常

---

### 8.5 第五阶段：部署上线（3 天）

**任务清单：**
- [x] 配置 Nginx
- [x] 配置 CI/CD（GitHub Actions）
- [x] 编写部署文档
- [x] 上线生产环境
- [x] 监控和日志配置

---

## 九、技术风险与应对

### 9.1 精度问题

**风险：** JavaScript 浮点数精度问题导致货币计算错误

**应对：**
- ✅ 使用 `decimal.js` 进行所有货币计算
- ✅ 后端返回字符串类型的金额
- ✅ 前端格式化时统一处理小数位

### 9.2 汇率缓存

**风险：** 汇率变化导致前端显示过期数据

**应对：**
- ✅ 汇率缓存时间 < 24 小时
- ✅ 关键操作（支付）时强制刷新汇率
- ✅ 显示汇率更新时间

### 9.3 移动端性能

**风险：** 移动端设备性能较差，页面卡顿

**应对：**
- ✅ 列表虚拟滚动
- ✅ 图片懒加载
- ✅ 路由懒加载
- ✅ 减少首屏加载体积

### 9.4 国际化维护

**风险：** 多语言文件维护成本高，容易遗漏

**应对：**
- ✅ 使用工具自动检测缺失翻译
- ✅ 建立翻译审核流程
- ✅ 优先支持中英文，其他语言可选

---

## 十、附录

### 10.1 推荐 VSCode 插件

```json
// .vscode/extensions.json
{
  "recommendations": [
    "Vue.volar",                    // Vue 3 官方插件
    "Vue.vscode-typescript-vue-plugin",
    "dbaeumer.vscode-eslint",       // ESLint
    "esbenp.prettier-vscode",       // Prettier
    "bradlc.vscode-tailwindcss",    // UnoCSS 智能提示
    "lokalise.i18n-ally",           // 国际化辅助
    "antfu.unocss",                 // UnoCSS 插件
    "formulahendry.auto-rename-tag" // 自动重命名标签
  ]
}
```

### 10.2 代码规范

**ESLint + Prettier:**
- 使用 `@antfu/eslint-config` 预设
- 强制使用组合式 API
- 强制使用 TypeScript 类型注解

**命名规范：**
- 组件名：PascalCase（`PriceDisplay.vue`）
- 文件名：kebab-case（`use-currency.ts`）
- 变量名：camelCase（`exchangeRate`）
- 常量名：UPPER_SNAKE_CASE（`API_BASE_URL`）

### 10.3 Git 提交规范

```
feat: 新功能
fix: 修复 Bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具配置

示例：
feat(order): 实现多币种订单创建功能
fix(payment): 修复余额支付汇率计算错误
```

---

## 总结

本技术方案涵盖了 Happy Billing 前端系统的完整设计，重点关注：

✅ **多币种支持**：完整的货币选择、汇率查询、金额转换功能
✅ **国际化**：中英文双语支持，可扩展
✅ **移动端适配**：响应式布局，移动端友好
✅ **类型安全**：TypeScript 全栈类型定义
✅ **性能优化**：懒加载、虚拟滚动、按需加载

**下一步建议：**
1. 审查技术方案，确认技术栈选择
2. 初始化项目，搭建基础架构
3. 优先实现核心组件（货币相关）
4. 逐步开发业务模块

如有任何疑问或需要调整，请随时告知！
