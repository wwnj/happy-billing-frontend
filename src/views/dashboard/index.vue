<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BalanceCard from '@/components/common/BalanceCard/index.vue'
import PriceDisplay from '@/components/common/PriceDisplay/index.vue'
import type { AccountBalance } from '@/types/api/payment'

const router = useRouter()

// 统计数据
const stats = ref({
  totalOrders: 127,
  pendingOrders: 12,
  totalRevenue: 125690,
  monthRevenue: 28750,
  totalTenants: 18,
  activeTenants: 15,
  paymentSuccessRate: 98.5,
  avgOrderAmount: 989,
})

// 账户余额
const balance = ref<AccountBalance | null>(null)

// 最近订单
const recentOrders = ref([
  {
    order_no: 'ORD20260117001',
    amount: 361,
    currency: 'CNY',
    status: 'PENDING',
    created_at: '2026-01-17T10:30:00Z',
  },
  {
    order_no: 'ORD20260117002',
    amount: 722,
    currency: 'CNY',
    status: 'PAID',
    created_at: '2026-01-16T14:25:00Z',
  },
  {
    order_no: 'ORD20260117003',
    amount: 100,
    currency: 'CNY',
    status: 'PAID',
    created_at: '2026-01-15T09:20:00Z',
  },
])

/**
 * 加载数据
 */
const loadDashboardData = async () => {
  try {
    // 加载余额信息
    balance.value = {
      tenant_id: 'tenant_demo_001',
      balance: 1000,
      frozen_balance: 50,
      credit_limit: 500,
      currency: 'CNY',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-17T10:00:00Z',
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
    console.error(error)
  }
}

/**
 * 查看订单详情（保留供未来使用）
 */
// const viewOrder = (orderNo: string) => {
//   const orderId = orderNo.replace('ORD', 'order_').substring(0, 20) + '001'
//   router.push(`/order/detail/${orderId}`)
// }

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
 * 格式化日期时间
 */
const formatDateTime = (datetime: string) => {
  return new Date(datetime).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 初始化
onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="dashboard">
    <h1>仪表盘</h1>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon orders">
              <el-icon :size="32"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">总订单数</div>
              <div class="stat-value">{{ stats.totalOrders }}</div>
              <div class="stat-desc">待支付: {{ stats.pendingOrders }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon revenue">
              <el-icon :size="32"><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">总收入</div>
              <div class="stat-value">
                <PriceDisplay
                  :amount="stats.totalRevenue"
                  currency="CNY"
                  size="small"
                />
              </div>
              <div class="stat-desc">本月: ¥{{ stats.monthRevenue.toLocaleString() }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon tenants">
              <el-icon :size="32"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">租户数</div>
              <div class="stat-value">{{ stats.totalTenants }}</div>
              <div class="stat-desc">活跃: {{ stats.activeTenants }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon success">
              <el-icon :size="32"><SuccessFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">支付成功率</div>
              <div class="stat-value">{{ stats.paymentSuccessRate }}%</div>
              <div class="stat-desc">平均订单: ¥{{ stats.avgOrderAmount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 余额卡片 + 最近订单 -->
    <el-row :gutter="20" class="content-row">
      <el-col :xs="24" :lg="12">
        <BalanceCard
          v-if="balance"
          :balance="balance.balance"
          :frozen-balance="balance.frozen_balance"
          :credit-limit="balance.credit_limit"
          :currency="balance.currency"
          @recharge="router.push('/payment/balance')"
          @view-records="router.push('/payment/balance')"
        />
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>最近订单</h3>
              <el-button link type="primary" @click="router.push('/order/list')">
                查看全部
              </el-button>
            </div>
          </template>

          <el-table :data="recentOrders" style="width: 100%">
            <el-table-column prop="order_no" label="订单号" width="160" />
            <el-table-column label="金额" width="120">
              <template #default="{ row }">
                <PriceDisplay
                  :amount="row.amount"
                  :currency="row.currency"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="时间" min-width="100">
              <template #default="{ row }">
                {{ formatDateTime(row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-row :gutter="20" class="quick-actions">
      <el-col :span="24">
        <el-card>
          <template #header>
            <h3>快捷操作</h3>
          </template>

          <div class="actions-grid">
            <el-button
              type="primary"
              size="large"
              @click="router.push('/order/create')"
            >
              <el-icon><Plus /></el-icon>
              创建订单
            </el-button>
            <el-button
              type="success"
              size="large"
              @click="router.push('/payment/balance')"
            >
              <el-icon><Wallet /></el-icon>
              账户充值
            </el-button>
            <el-button
              type="info"
              size="large"
              @click="router.push('/currency/converter')"
            >
              <el-icon><Switch /></el-icon>
              货币转换
            </el-button>
            <el-button
              type="warning"
              size="large"
              @click="router.push('/currency/exchange-rates')"
            >
              <el-icon><TrendCharts /></el-icon>
              汇率查询
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  padding: 20px;

  h1 {
    margin: 0 0 20px 0;
    font-size: 24px;
    font-weight: 600;
  }

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .stats-row {
    margin-bottom: 20px;
  }

  .stat-card {
    .stat-content {
      display: flex;
      gap: 16px;
      align-items: center;

      .stat-icon {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        &.orders {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        &.revenue {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }

        &.tenants {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }

        &.success {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          color: white;
        }
      }

      .stat-info {
        flex: 1;

        .stat-title {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 4px;
        }

        .stat-desc {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }

  .content-row {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .quick-actions {
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;

      .el-button {
        width: 100%;
        height: 60px;
        font-size: 16px;
      }
    }
  }

  // 移动端适配
  @media (max-width: 768px) {
    padding: 10px;

    h1 {
      font-size: 20px;
    }

    .stat-card {
      .stat-content {
        .stat-icon {
          width: 48px;
          height: 48px;

          :deep(.el-icon) {
            font-size: 24px;
          }
        }

        .stat-info {
          .stat-value {
            font-size: 20px;
          }
        }
      }
    }

    .actions-grid {
      grid-template-columns: 1fr 1fr;

      .el-button {
        height: 50px;
        font-size: 14px;
      }
    }
  }
}
</style>
