<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import PriceDisplay from '@/components/common/PriceDisplay/index.vue'
import ExchangeRateInfo from '@/components/common/ExchangeRateInfo/index.vue'
import { getOrderDetail, cancelOrder } from '@/api/modules/order'
import type { Order } from '@/types/api/order'

const route = useRoute()
const router = useRouter()

// 订单详情
const order = ref<Order | null>(null)
const loading = ref(false)
const cancelling = ref(false)

// 订单ID
const orderId = computed(() => route.params.id as string)

/**
 * 加载订单详情
 */
const loadOrderDetail = async () => {
  loading.value = true

  try {
    const { data } = await getOrderDetail(orderId.value)
    order.value = data

    if (!order.value) {
      ElMessage.error('订单不存在')
      router.push('/order/list')
    }
  } catch (error) {
    ElMessage.error('加载订单详情失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

/**
 * 支付订单
 */
const handlePayOrder = () => {
  if (!order.value) return
  router.push(`/payment/pay/${order.value.order_id}`)
}

/**
 * 取消订单
 */
const handleCancelOrder = async () => {
  if (!order.value) return

  try {
    await ElMessageBox.confirm(
      `确定要取消订单 ${order.value.order_no} 吗？`,
      '确认取消',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    cancelling.value = true

    await cancelOrder(order.value.order_id)
    ElMessage.success('订单已取消')
    loadOrderDetail()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('取消订单失败')
      console.error(error)
    }
  } finally {
    cancelling.value = false
  }
}

/**
 * 获取状态标签类型
 */
const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    PENDING: 'warning',
    PAID: 'success',
    CANCELLED: 'info',
  }
  return map[status]
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
 * 获取订单类型文本
 */
const getOrderTypeText = (type: string) => {
  const map: Record<string, string> = {
    PREPAID: '预付费',
    POSTPAID: '后付费',
  }
  return map[type]
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
  <div class="order-detail-page">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button link @click="router.back()">
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
            <h2>订单详情</h2>
          </div>
          <div v-if="order" class="header-right">
            <el-tag :type="getStatusType(order.status)" size="large">
              {{ getStatusText(order.status) }}
            </el-tag>
          </div>
        </div>
      </template>

      <template v-if="order">
        <!-- 基本信息 -->
        <el-divider content-position="left">
          <h3>基本信息</h3>
        </el-divider>

        <el-descriptions :column="2" border size="large">
          <el-descriptions-item label="订单号">
            {{ order.order_no }}
          </el-descriptions-item>
          <el-descriptions-item label="订单ID">
            {{ order.order_id }}
          </el-descriptions-item>
          <el-descriptions-item label="租户ID">
            {{ order.tenant_id }}
          </el-descriptions-item>
          <el-descriptions-item label="组织ID">
            {{ order.organization_id }}
          </el-descriptions-item>
          <el-descriptions-item label="项目ID">
            {{ order.project_id }}
          </el-descriptions-item>
          <el-descriptions-item label="用户ID">
            {{ order.user_id }}
          </el-descriptions-item>
          <el-descriptions-item label="订单类型">
            {{ getOrderTypeText(order.order_type) }}
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(order.status)">
              {{ getStatusText(order.status) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 产品信息 -->
        <el-divider content-position="left">
          <h3>产品信息</h3>
        </el-divider>

        <el-descriptions :column="2" border size="large">
          <el-descriptions-item label="SPU 编码">
            {{ order.spu_code }}
          </el-descriptions-item>
          <el-descriptions-item label="SKU 编码">
            {{ order.sku_code }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 价格信息 -->
        <el-divider content-position="left">
          <h3>价格信息</h3>
        </el-divider>

        <el-descriptions :column="1" border size="large">
          <el-descriptions-item label="订单币种">
            {{ order.currency }}
          </el-descriptions-item>
          <el-descriptions-item label="原始金额">
            <PriceDisplay
              :amount="order.original_amount"
              :currency="order.currency"
              size="default"
            />
          </el-descriptions-item>
          <el-descriptions-item label="折扣金额">
            <span class="discount-text">
              - <PriceDisplay
                :amount="order.discount_amount"
                :currency="order.currency"
                size="default"
              />
            </span>
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
          <el-descriptions-item label="已支付金额">
            <PriceDisplay
              :amount="order.paid_amount"
              :currency="order.currency"
              size="default"
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

        <!-- 时间信息 -->
        <el-divider content-position="left">
          <h3>时间信息</h3>
        </el-divider>

        <el-descriptions :column="2" border size="large">
          <el-descriptions-item label="创建时间">
            {{ formatDateTime(order.created_at) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDateTime(order.updated_at) }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 操作按钮 -->
        <el-divider />

        <div class="actions">
          <el-space>
            <el-button
              v-if="order.status === 'PENDING'"
              type="primary"
              size="large"
              @click="handlePayOrder"
            >
              立即支付
            </el-button>
            <el-button
              v-if="order.status === 'PENDING'"
              type="danger"
              size="large"
              :loading="cancelling"
              @click="handleCancelOrder"
            >
              取消订单
            </el-button>
            <el-button
              size="large"
              @click="router.push('/order/list')"
            >
              返回列表
            </el-button>
          </el-space>
        </div>
      </template>

      <el-empty v-else description="订单不存在" />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.order-detail-page {
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

  .discount-text {
    color: #67c23a;
    font-weight: 600;
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
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .header-right {
        width: 100%;
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
