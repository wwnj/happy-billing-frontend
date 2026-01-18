# Happy Billing API 对接文档

> 本文档提供完整的 TypeScript 类型定义和 API 调用示例

---

## 一、通用类型定义

### 1.1 响应结构

```typescript
// src/types/global.d.ts

/**
 * API 统一响应结构
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

/**
 * 分页查询参数
 */
export interface PageQuery {
  page: number
  page_size: number
}

/**
 * 通用状态
 */
export type Status = 0 | 1  // 0: 禁用, 1: 启用
```

---

## 二、货币模块

### 2.1 类型定义

```typescript
// src/types/api/currency.d.ts

/**
 * 货币类型
 */
export type Currency = 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP' | 'HKD'

/**
 * 汇率记录
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
 * 汇率列表查询参数
 */
export interface ExchangeRateListQuery extends PageQuery {
  from_currency?: Currency
  to_currency?: Currency
  date?: string
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
 * 创建汇率请求
 */
export interface CreateExchangeRateRequest {
  from_currency: Currency
  to_currency: Currency
  rate: number
  effective_date: string
  source?: string
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

### 2.2 API 调用

```typescript
// src/api/modules/currency.ts
import request from '@/api/request'
import type { PageResult } from '@/types/global'
import type {
  ExchangeRate,
  ExchangeRateListQuery,
  ExchangeRateQuery,
  CreateExchangeRateRequest,
  CurrencyConvertRequest,
  CurrencyConvertResponse,
} from '@/types/api/currency'

/**
 * 获取汇率列表
 */
export const getExchangeRates = (params: ExchangeRateListQuery) => {
  return request.get<PageResult<ExchangeRate>>('/api/v1/exchange-rates', params)
}

/**
 * 查询特定汇率
 */
export const queryExchangeRate = (params: ExchangeRateQuery) => {
  return request.get<ExchangeRate>('/api/v1/exchange-rates/query', params)
}

/**
 * 创建汇率
 */
export const createExchangeRate = (data: CreateExchangeRateRequest) => {
  return request.post<ExchangeRate>('/api/v1/exchange-rates', data)
}

/**
 * 货币转换
 */
export const convertCurrency = (data: CurrencyConvertRequest) => {
  return request.post<CurrencyConvertResponse>('/api/v1/currency/convert', data)
}
```

---

## 三、租户模块

### 3.1 类型定义

```typescript
// src/types/api/tenant.d.ts
import type { Status } from '@/types/global'
import type { Currency } from './currency'

/**
 * 租户类型
 */
export type TenantType = 'INDIVIDUAL' | 'ENTERPRISE'

/**
 * 认证类型
 */
export type VerifyType = 'INDIVIDUAL' | 'ENTERPRISE'

/**
 * 认证状态
 */
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

/**
 * 租户
 */
export interface Tenant {
  tenant_id: string
  tenant_code: string
  name: string
  tenant_type: TenantType
  preferred_currency: Currency
  verified: boolean
  verified_type?: VerifyType
  verified_at?: string
  status: Status
  created_at: string
  updated_at: string
}

/**
 * 组织
 */
export interface Organization {
  organization_id: string
  tenant_id: string
  parent_organization_id?: string
  org_code: string
  name: string
  org_type?: string
  level: number
  status: Status
  created_at: string
  updated_at: string
}

/**
 * 项目
 */
export interface Project {
  project_id: string
  tenant_id: string
  organization_id: string
  project_code: string
  name: string
  description?: string
  status: Status
  created_at: string
  updated_at: string
}

/**
 * 用户
 */
export interface User {
  user_id: string
  tenant_id: string
  is_primary: boolean
  username?: string
  real_name?: string
  email?: string
  phone?: string
  status: Status
  created_at: string
  updated_at: string
}

/**
 * 租户响应（包含关联信息）
 */
export interface TenantResponse {
  tenant: Tenant
  organizations?: Organization[]
  default_project?: Project
  primary_user?: User
}

/**
 * 个人注册请求
 */
export interface RegisterIndividualRequest {
  name: string
  email: string
  phone: string
}

/**
 * 企业注册请求
 */
export interface RegisterEnterpriseRequest {
  company_name: string
  email: string
  phone: string
}

/**
 * 租户列表查询
 */
export interface TenantListQuery extends PageQuery {
  tenant_type?: TenantType
  verified?: boolean
  keyword?: string
}
```

### 3.2 API 调用

```typescript
// src/api/modules/tenant.ts
import request from '@/api/request'
import type { PageResult } from '@/types/global'
import type {
  Tenant,
  TenantResponse,
  RegisterIndividualRequest,
  RegisterEnterpriseRequest,
  TenantListQuery,
} from '@/types/api/tenant'

/**
 * 获取租户列表
 */
export const getTenantList = (params: TenantListQuery) => {
  return request.get<PageResult<Tenant>>('/api/v1/tenants', params)
}

/**
 * 个人注册
 */
export const registerIndividual = (data: RegisterIndividualRequest) => {
  return request.post<TenantResponse>('/api/v1/tenants/register/individual', data)
}

/**
 * 企业注册
 */
export const registerEnterprise = (data: RegisterEnterpriseRequest) => {
  return request.post<TenantResponse>('/api/v1/tenants/register/enterprise', data)
}

/**
 * 获取租户详情
 */
export const getTenantDetail = (tenantId: string) => {
  return request.get<TenantResponse>(`/api/v1/tenants/${tenantId}`)
}
```

---

## 四、产品模块

### 4.1 类型定义

```typescript
// src/types/api/product.d.ts
import type { Status } from '@/types/global'

/**
 * 产品分类
 */
export interface ProductCategory {
  category_id: number
  category_code: string
  category_name: string
  parent_category_id?: number
  level: number
  sort_order: number
  description?: string
  status: Status
  created_at: string
  updated_at: string
}

/**
 * SPU（标准产品单元）
 */
export interface ProductSpu {
  spu_id: number
  spu_code: string
  spu_name: string
  category_id: number
  description?: string
  spec_keys?: string[]
  status: Status
  created_at: string
  updated_at: string
}

/**
 * SKU（库存单元）
 */
export interface ProductSku {
  sku_id: string
  sku_code: string
  spu_id: number
  spu_code: string
  sku_name: string
  spec_values?: Record<string, any>
  region?: string
  stock_type: string
  status: Status
  created_at: string
  updated_at: string
}

/**
 * 产品分类列表查询
 */
export interface CategoryListQuery extends PageQuery {
  parent_category_id?: number
  keyword?: string
}

/**
 * SPU 列表查询
 */
export interface SpuListQuery extends PageQuery {
  category_id?: number
  keyword?: string
}

/**
 * SKU 列表查询
 */
export interface SkuListQuery extends PageQuery {
  spu_code?: string
  region?: string
  keyword?: string
}
```

### 4.2 API 调用

```typescript
// src/api/modules/product.ts
import request from '@/api/request'
import type { PageResult } from '@/types/global'
import type {
  ProductCategory,
  ProductSpu,
  ProductSku,
  CategoryListQuery,
  SpuListQuery,
  SkuListQuery,
} from '@/types/api/product'

/**
 * 获取产品分类列表
 */
export const getCategoryList = (params: CategoryListQuery) => {
  return request.get<PageResult<ProductCategory>>('/api/v1/products/category', params)
}

/**
 * 获取 SPU 列表
 */
export const getSpuList = (params: SpuListQuery) => {
  return request.get<PageResult<ProductSpu>>('/api/v1/products/spu', params)
}

/**
 * 获取 SKU 列表
 */
export const getSkuList = (params: SkuListQuery) => {
  return request.get<PageResult<ProductSku>>('/api/v1/products/sku', params)
}

/**
 * 根据 SPU 获取 SKU
 */
export const getSkusBySpu = (spuId: number) => {
  return request.get<ProductSku[]>(`/api/v1/products/spu/${spuId}/skus`)
}
```

---

## 五、订单模块 ⭐

### 5.1 类型定义

```typescript
// src/types/api/order.d.ts
import type { Currency } from './currency'

/**
 * 订单类型
 */
export type OrderType = 'PREPAID' | 'POSTPAID'

/**
 * 订单状态
 */
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
 * 订单明细
 */
export interface OrderItem {
  item_no: string
  order_id: string
  spu_code: string
  sku_code: string
  sku_name: string
  sku_spec?: Record<string, any>
  quantity: number
  unit_price: number
  amount: number
  price_rule_id?: string
  created_at: string
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
export interface OrderListQuery extends PageQuery {
  tenant_id?: string
  status?: OrderStatus
  currency?: Currency
  start_date?: string
  end_date?: string
}
```

### 5.2 API 调用

```typescript
// src/api/modules/order.ts
import request from '@/api/request'
import type { PageResult } from '@/types/global'
import type {
  Order,
  CreateOrderRequest,
  OrderListQuery,
} from '@/types/api/order'

/**
 * 创建订单
 */
export const createOrder = (data: CreateOrderRequest) => {
  return request.post<Order>('/api/v1/orders', data)
}

/**
 * 获取订单列表
 */
export const getOrderList = (params: OrderListQuery) => {
  return request.get<PageResult<Order>>('/api/v1/orders', params)
}

/**
 * 获取订单详情
 */
export const getOrderDetail = (orderId: string) => {
  return request.get<Order>(`/api/v1/orders/${orderId}`)
}

/**
 * 取消订单
 */
export const cancelOrder = (orderId: string) => {
  return request.put(`/api/v1/orders/${orderId}/cancel`)
}
```

---

## 六、账单模块

### 6.1 类型定义

```typescript
// src/types/api/billing.d.ts
import type { Currency } from './currency'

/**
 * 账单状态
 */
export type BillStatus = 'UNPAID' | 'PAID' | 'OVERDUE' | 'CANCELLED'

/**
 * 账单
 */
export interface Bill {
  bill_id: string
  order_id: string
  tenant_id: string
  project_id: string
  bill_type: string
  currency: Currency
  exchange_rate?: number
  base_currency: Currency
  base_currency_amount?: number
  original_amount: number
  discount_amount: number
  payable_amount: number
  status: BillStatus
  due_date?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

/**
 * 账单列表查询
 */
export interface BillListQuery extends PageQuery {
  tenant_id?: string
  order_id?: string
  status?: BillStatus
  start_date?: string
  end_date?: string
}
```

### 6.2 API 调用

```typescript
// src/api/modules/billing.ts
import request from '@/api/request'
import type { PageResult } from '@/types/global'
import type { Bill, BillListQuery } from '@/types/api/billing'

/**
 * 获取账单列表
 */
export const getBillList = (params: BillListQuery) => {
  return request.get<PageResult<Bill>>('/api/v1/bills', params)
}

/**
 * 获取账单详情
 */
export const getBillDetail = (billId: string) => {
  return request.get<Bill>(`/api/v1/bills/${billId}`)
}
```

---

## 七、支付模块 ⭐

### 7.1 类型定义

```typescript
// src/types/api/payment.d.ts
import type { Currency } from './currency'

/**
 * 支付方式
 */
export type PaymentMethod = 'BALANCE' | 'ALIPAY' | 'WECHAT' | 'BANK_TRANSFER'

/**
 * 支付状态
 */
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

/**
 * 支付记录
 */
export interface Payment {
  payment_id: string
  order_id?: string
  bill_id?: string
  tenant_id: string
  user_id: string
  payment_method: PaymentMethod
  payment_channel?: string
  currency: Currency
  exchange_rate?: number
  base_currency: Currency
  base_currency_amount?: number
  amount: number
  status: PaymentStatus
  external_order_id?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

/**
 * 账户余额
 */
export interface AccountBalance {
  tenant_id: string
  balance: number
  frozen_balance: number
  credit_limit: number
  currency: Currency
  created_at: string
  updated_at: string
}

/**
 * 余额变动类型
 */
export type TransactionType = 'RECHARGE' | 'DEDUCT' | 'REFUND' | 'FREEZE' | 'UNFREEZE'

/**
 * 余额变动记录
 */
export interface BalanceTransaction {
  transaction_id: string
  tenant_id: string
  transaction_type: TransactionType
  amount: number
  balance_before: number
  balance_after: number
  related_order_id?: string
  related_bill_id?: string
  related_payment_id?: string
  remark?: string
  created_at: string
}

/**
 * 创建支付请求
 */
export interface CreatePaymentRequest {
  order_id?: string
  bill_id?: string
  tenant_id: string
  user_id: string
  payment_method: PaymentMethod
  payment_channel?: string
  amount: number
  currency: Currency
}

/**
 * 充值请求
 */
export interface RechargeRequest {
  amount: number
}

/**
 * 支付列表查询
 */
export interface PaymentListQuery extends PageQuery {
  tenant_id?: string
  status?: PaymentStatus
  payment_method?: PaymentMethod
  start_date?: string
  end_date?: string
}
```

### 7.2 API 调用

```typescript
// src/api/modules/payment.ts
import request from '@/api/request'
import type { PageResult } from '@/types/global'
import type {
  Payment,
  AccountBalance,
  BalanceTransaction,
  CreatePaymentRequest,
  RechargeRequest,
  PaymentListQuery,
} from '@/types/api/payment'

/**
 * 创建支付
 */
export const createPayment = (data: CreatePaymentRequest) => {
  return request.post<Payment>('/api/v1/payments', data)
}

/**
 * 获取支付详情
 */
export const getPaymentDetail = (paymentId: string) => {
  return request.get<Payment>(`/api/v1/payments/${paymentId}`)
}

/**
 * 获取支付列表
 */
export const getPaymentList = (params: PaymentListQuery) => {
  return request.get<PageResult<Payment>>('/api/v1/payments', params)
}

/**
 * 获取账户余额
 */
export const getBalance = (tenantId: string) => {
  return request.get<AccountBalance>(`/api/v1/tenants/${tenantId}/balance`)
}

/**
 * 充值
 */
export const recharge = (tenantId: string, data: RechargeRequest) => {
  return request.post(`/api/v1/tenants/${tenantId}/balance/recharge`, data)
}

/**
 * 获取余额变动记录
 */
export const getBalanceTransactions = (tenantId: string, params: PageQuery) => {
  return request.get<PageResult<BalanceTransaction>>(
    `/api/v1/tenants/${tenantId}/balance/transactions`,
    params
  )
}
```

---

## 八、定价模块

### 8.1 类型定义

```typescript
// src/types/api/pricing.d.ts

/**
 * 价格规则
 */
export interface PriceRule {
  rule_id: string
  rule_name: string
  sku_code: string
  price_type: string
  base_price: number
  unit: string
  billing_cycle?: string
  min_quantity?: number
  max_quantity?: number
  status: number
  created_at: string
  updated_at: string
}

/**
 * 折扣规则
 */
export interface DiscountRule {
  rule_id: string
  rule_name: string
  discount_type: string
  discount_value: number
  min_amount?: number
  start_time?: string
  end_time?: string
  status: number
  created_at: string
  updated_at: string
}

/**
 * 价格计算请求
 */
export interface PriceCalculateRequest {
  sku_code: string
  tenant_id: string
  quantity: number
  start_time: string
  end_time: string
}

/**
 * 价格计算结果
 */
export interface PriceCalculateResult {
  sku_code: string
  quantity: number
  original_price: number
  discount_amount: number
  final_price: number
  price_rule?: PriceRule
  applied_discounts?: DiscountRule[]
}
```

### 8.2 API 调用

```typescript
// src/api/modules/pricing.ts
import request from '@/api/request'
import type {
  PriceCalculateRequest,
  PriceCalculateResult,
} from '@/types/api/pricing'

/**
 * 计算价格
 */
export const calculatePrice = (data: PriceCalculateRequest) => {
  return request.post<PriceCalculateResult>('/api/v1/pricing/calculate', data)
}
```

---

## 九、使用示例

### 9.1 订单创建流程

```vue
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useCurrency } from '@/composables/useCurrency'
import { calculatePrice } from '@/api/modules/pricing'
import { createOrder } from '@/api/modules/order'
import type { CreateOrderRequest } from '@/types/api/order'

const { convert, loading: currencyLoading } = useCurrency()

// 表单数据
const form = reactive<CreateOrderRequest>({
  tenant_id: 'tenant_a3f9b2c4d5',
  organization_id: 'org_test_001',
  project_id: 'proj_test_001',
  user_id: 'user_001',
  order_type: 'PREPAID',
  sku_code: '',
  quantity: 1,
})

// 价格信息
const priceInfo = ref({
  originalPrice: 0,
  discountAmount: 0,
  finalPrice: 0,
  currency: 'USD' as Currency,
  baseCurrencyAmount: 0,
  exchangeRate: 0,
})

/**
 * 计算价格
 */
const handleCalculatePrice = async () => {
  try {
    // 调用定价 API
    const { data } = await calculatePrice({
      sku_code: form.sku_code,
      tenant_id: form.tenant_id,
      quantity: form.quantity,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    })

    // 转换为本位币
    const result = await convert(data.final_price, priceInfo.value.currency, 'CNY')

    if (result) {
      priceInfo.value = {
        originalPrice: data.original_price,
        discountAmount: data.discount_amount,
        finalPrice: data.final_price,
        currency: priceInfo.value.currency,
        baseCurrencyAmount: result.convertedAmount,
        exchangeRate: result.rate,
      }
    }
  } catch (error) {
    ElMessage.error('价格计算失败')
  }
}

/**
 * 提交订单
 */
const handleSubmit = async () => {
  try {
    const { data } = await createOrder(form)
    ElMessage.success('订单创建成功')
    console.log('订单详情:', data)
  } catch (error) {
    ElMessage.error('订单创建失败')
  }
}
</script>

<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="SKU 代码">
      <el-input v-model="form.sku_code" @blur="handleCalculatePrice" />
    </el-form-item>

    <el-form-item label="数量">
      <el-input-number v-model="form.quantity" :min="1" @change="handleCalculatePrice" />
    </el-form-item>

    <!-- 价格展示 -->
    <el-form-item label="订单金额">
      <PriceDisplay
        :amount="priceInfo.finalPrice"
        :currency="priceInfo.currency"
        :exchange-rate="priceInfo.exchangeRate"
        :base-currency-amount="priceInfo.baseCurrencyAmount"
        :show-base-currency="true"
        size="large"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">创建订单</el-button>
    </el-form-item>
  </el-form>
</template>
```

### 9.2 支付流程

```vue
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getBalance, createPayment } from '@/api/modules/payment'
import { getBillDetail } from '@/api/modules/billing'
import type { CreatePaymentRequest } from '@/types/api/payment'
import type { Bill } from '@/types/api/billing'

const props = defineProps<{
  billId: string
}>()

const balance = ref(0)
const bill = ref<Bill | null>(null)

// 支付表单
const paymentForm = reactive<CreatePaymentRequest>({
  bill_id: props.billId,
  tenant_id: '',
  user_id: '',
  payment_method: 'BALANCE',
  amount: 0,
  currency: 'USD',
})

/**
 * 加载数据
 */
onMounted(async () => {
  // 获取账单信息
  const { data: billData } = await getBillDetail(props.billId)
  bill.value = billData
  paymentForm.tenant_id = billData.tenant_id
  paymentForm.amount = billData.payable_amount
  paymentForm.currency = billData.currency

  // 获取余额
  const { data: balanceData } = await getBalance(billData.tenant_id)
  balance.value = balanceData.balance
})

/**
 * 确认支付
 */
const handlePay = async () => {
  // 检查余额
  if (bill.value && balance.value < (bill.value.base_currency_amount || 0)) {
    ElMessage.warning('余额不足，请先充值')
    return
  }

  try {
    const { data } = await createPayment(paymentForm)
    ElMessage.success('支付成功')
    console.log('支付详情:', data)
  } catch (error) {
    ElMessage.error('支付失败')
  }
}
</script>

<template>
  <el-card v-if="bill">
    <template #header>
      <span>支付确认</span>
    </template>

    <div class="payment-info">
      <div class="info-item">
        <span class="label">账单金额：</span>
        <PriceDisplay
          :amount="bill.payable_amount"
          :currency="bill.currency"
          :exchange-rate="bill.exchange_rate"
          :base-currency-amount="bill.base_currency_amount"
          :show-base-currency="true"
        />
      </div>

      <div class="info-item">
        <span class="label">当前余额：</span>
        <span class="value">¥{{ balance.toFixed(2) }} CNY</span>
      </div>

      <div class="info-item">
        <span class="label">支付后余额：</span>
        <span class="value">
          ¥{{ (balance - (bill.base_currency_amount || 0)).toFixed(2) }} CNY
        </span>
      </div>
    </div>

    <template #footer>
      <el-button type="primary" @click="handlePay">确认支付</el-button>
    </template>
  </el-card>
</template>

<style scoped>
.payment-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  font-weight: 600;
  margin-right: 8px;
}
</style>
```

---

## 十、错误码说明

| Code | 说明 | HTTP Status |
|------|------|-------------|
| 0 | 成功 | 200 |
| 1000 | 内部错误 | 500 |
| 1001 | 参数错误 | 400 |
| 3010 | SKU 不存在 | 404 |
| 4001 | 余额不足 | 400 |
| 4002 | 账单已支付 | 400 |
| 5001 | 订单不存在 | 404 |
| 5002 | 订单无法取消 | 400 |

---

完整的 API 文档已创建！所有类型定义都与后端 API 严格对应。
