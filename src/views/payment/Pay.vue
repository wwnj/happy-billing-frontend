<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import PriceDisplay from '@/components/common/PriceDisplay/index.vue'
import ExchangeRateInfo from '@/components/common/ExchangeRateInfo/index.vue'
import { getOrderDetail } from '@/api/modules/order'
import { getBalance, createPayment } from '@/api/modules/payment'
import type { Order } from '@/types/api/order'
import type { AccountBalance, PaymentMethod } from '@/types/api/payment'

const route = useRoute()
const router = useRouter()

// 订单ID
const orderId = computed(() => route.params.orderId as string)

// 订单详情
const order = ref<Order | null>(null)
const balance = ref<AccountBalance | null>(null)
const loading = ref(false)
const paying = ref(false)

// 选中的支付方式
const selectedPaymentMethod = ref<PaymentMethod>('BALANCE')

// 支付方式选项
const paymentMethods = [
  { value: 'BALANCE', label: '余额支付', icon: 'Wallet', disabled: false },
  { value: 'ALIPAY', label: '支付宝', icon: 'Money', disabled: false },
  { value: 'WECHAT', label: '微信支付', icon: 'ChatDotSquare', disabled: false },
  { value: 'BANK_TRANSFER', label: '银行转账', icon: 'Bank', disabled: false },
]

// 是否余额不足
const isBalanceInsufficient = computed(() => {
  if (!order.value || !balance.value) return false
  if (selectedPaymentMethod.value !== 'BALANCE') return false

  // 将订单金额转换为本位币（CNY）进行比较
  const orderAmount = order.value.base_currency_amount || order.value.payable_amount
  return balance.value.balance < orderAmount
})

// 可用余额（考虑冻结余额）
const availableBalance = computed(() => {
  if (!balance.value) return 0
  return balance.value.balance - balance.value.frozen_balance
})

/**
 * 加载订单详情
 */
const loadOrderDetail = async () => {
  loading.value = true

  try {
    // 加载订单信息
    const { data: orderData } = await getOrderDetail(orderId.value)
    order.value = orderData

    if (!order.value) {
      ElMessage.error('订单不存在')
      router.push('/order/list')
      return
    }

    if (order.value.status !== 'PENDING') {
      ElMessage.warning('订单状态不正确，无法支付')
      router.push(`/order/detail/${orderId.value}`)
      return
    }

    // 加载账户余额
    const { data: balanceData } = await getBalance(order.value.tenant_id)
    balance.value = balanceData
  } catch (error) {
    ElMessage.error('加载订单信息失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

/**
 * 处理支付
 */
const handlePay = async () => {
  if (!order.value) return

  // 余额支付时检查余额是否充足
  if (selectedPaymentMethod.value === 'BALANCE' && isBalanceInsufficient.value) {
    ElMessage.warning('余额不足，请选择其他支付方式或充值')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定使用${paymentMethods.find(m => m.value === selectedPaymentMethod.value)?.label}支付订单 ${order.value.order_no} 吗？`,
      '确认支付',
      {
        confirmButtonText: '确定支付',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    paying.value = true

    // 调用支付API
    await createPayment({
      order_id: order.value.order_id,
      tenant_id: order.value.tenant_id,
      user_id: order.value.user_id,
      payment_method: selectedPaymentMethod.value,
      currency: order.value.currency,
      amount: order.value.payable_amount,
    })

    ElMessage.success('支付成功')
    router.push(`/order/detail/${orderId.value}`)
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('支付失败')
      console.error(error)
    }
  } finally {
    paying.value = false
  }
}

/**
 * 获取状态文本
 */
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    PENDING: '待支付',
    PAID: '已支付',
    CANCELLED: '已取消',
  }
  return map[status]
}

/**
 * 格式化日期时间
 */
const formatDateTime = (datetime: string) => {
  return new Date(datetime).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// 初始化
onMounted(() => {
  loadOrderDetail()
})
</script>

<template>
  <div class="payment-page">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button link @click="router.back()">
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
            <h2>支付订单</h2>
          </div>
        </div>
      </template>

      <template v-if="order">
        <!-- 订单信息 -->
        <el-divider content-position="left">
          <h3>订单信息</h3>
        </el-divider>

        <el-descriptions :column="2" border size="large">
          <el-descriptions-item label="订单号">
            {{ order.order_no }}
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag type="warning">{{ getStatusText(order.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="产品 SKU">
            {{ order.sku_code }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDateTime(order.created_at) }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 支付信息 -->
        <el-divider content-position="left">
          <h3>支付信息</h3>
        </el-divider>

        <div class="payment-info">
          <el-descriptions :column="1" border size="large">
            <el-descriptions-item label="订单币种">
              {{ order.currency }}
            </el-descriptions-item>
            <el-descriptions-item label="应付金额">
              <PriceDisplay
                :amount="order.payable_amount"
                :currency="order.currency"
                :exchange-rate="order.exchange_rate"
                :base-currency-amount="order.base_currency_amount"
                :show-base-currency="order.currency !== 'CNY'"
                size="large"
              />
            </el-descriptions-item>
            <el-descriptions-item v-if="order.currency !== 'CNY'" label="汇率信息">
              <ExchangeRateInfo
                :from-currency="order.currency"
                to-currency="CNY"
                :rate="order.exchange_rate || 0"
                :effective-date="order.created_at"
                source="系统汇率"
              />
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 账户余额 -->
        <el-divider content-position="left">
          <h3>账户余额</h3>
        </el-divider>

        <div v-if="balance" class="balance-info">
          <el-descriptions :column="1" border size="large">
            <el-descriptions-item label="可用余额">
              <PriceDisplay
                :amount="availableBalance"
                currency="CNY"
                size="default"
              />
            </el-descriptions-item>
            <el-descriptions-item label="冻结余额">
              <PriceDisplay
                :amount="balance.frozen_balance"
                currency="CNY"
                size="small"
              />
            </el-descriptions-item>
            <el-descriptions-item label="信用额度">
              <PriceDisplay
                :amount="balance.credit_limit"
                currency="CNY"
                size="small"
              />
            </el-descriptions-item>
          </el-descriptions>

          <el-alert
            v-if="isBalanceInsufficient"
            title="余额不足"
            type="warning"
            description="您的账户余额不足，请选择其他支付方式或前往充值"
            show-icon
            :closable="false"
            class="mt-4"
          />
        </div>

        <!-- 支付方式选择 -->
        <el-divider content-position="left">
          <h3>支付方式</h3>
        </el-divider>

        <el-radio-group v-model="selectedPaymentMethod" class="payment-methods">
          <el-radio
            v-for="method in paymentMethods"
            :key="method.value"
            :label="method.value"
            :disabled="method.disabled || (method.value === 'BALANCE' && isBalanceInsufficient)"
            class="payment-method"
            border
          >
            <div class="method-content">
              <el-icon :size="24"><component :is="method.icon" /></el-icon>
              <span class="method-label">{{ method.label }}</span>
            </div>
          </el-radio>
        </el-radio-group>

        <!-- 支付按钮 -->
        <el-divider />

        <div class="actions">
          <el-space>
            <el-button
              type="primary"
              size="large"
              :loading="paying"
              @click="handlePay"
            >
              确认支付
            </el-button>
            <el-button
              size="large"
              @click="router.push(`/order/detail/${orderId}`)"
            >
              取消
            </el-button>
          </el-space>
        </div>
      </template>

      <el-empty v-else description="订单不存在" />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.payment-page {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
      }
    }
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .payment-info {
    margin: 20px 0;
  }

  .balance-info {
    margin: 20px 0;

    .mt-4 {
      margin-top: 16px;
    }
  }

  .payment-methods {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;

    .payment-method {
      width: 100%;
      height: auto;
      margin: 0;
      padding: 16px;

      :deep(.el-radio__label) {
        width: 100%;
      }

      .method-content {
        display: flex;
        align-items: center;
        gap: 12px;

        .method-label {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
  }

  .actions {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  // 移动端适配
  @media (max-width: 768px) {
    padding: 10px;

    .card-header {
      .header-left {
        h2 {
          font-size: 18px;
        }
      }
    }

    :deep(.el-descriptions) {
      .el-descriptions__label {
        width: 100px;
      }
    }

    .actions {
      :deep(.el-space) {
        width: 100%;
        flex-direction: column;

        .el-button {
          width: 100%;
        }
      }
    }
  }
}
</style>
