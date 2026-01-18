<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PriceDisplay from '@/components/common/PriceDisplay/index.vue'
import type { Payment, PaymentMethod, PaymentStatus } from '@/types/api/payment'

const router = useRouter()

// 查询参数
const queryParams = reactive({
  page: 1,
  page_size: 20,
  tenant_id: 'tenant_demo_001',
  payment_method: undefined as PaymentMethod | undefined,
  status: undefined as PaymentStatus | undefined,
})

// 支付记录列表
const paymentList = ref<Payment[]>([])
const total = ref(0)
const loading = ref(false)

// 支付方式选项
const paymentMethodOptions = [
  { label: '全部', value: undefined },
  { label: '余额支付', value: 'BALANCE' },
  { label: '支付宝', value: 'ALIPAY' },
  { label: '微信支付', value: 'WECHAT' },
  { label: '银行转账', value: 'BANK_TRANSFER' },
]

// 支付状态选项
const statusOptions = [
  { label: '全部', value: undefined },
  { label: '待支付', value: 'PENDING' },
  { label: '支付成功', value: 'SUCCESS' },
  { label: '支付失败', value: 'FAILED' },
]

/**
 * 加载支付记录列表
 */
const loadPaymentList = async () => {
  loading.value = true

  try {
    // 模拟数据
    const mockPayments: Payment[] = [
      {
        payment_id: 'pay_001',
        order_id: 'order_002',
        tenant_id: 'tenant_demo_001',
        user_id: 'user_demo_001',
        payment_method: 'BALANCE',
        currency: 'USD',
        exchange_rate: 7.22,
        base_currency: 'CNY',
        base_currency_amount: 722,
        amount: 100,
        status: 'SUCCESS',
        paid_at: '2026-01-16T14:25:00Z',
        created_at: '2026-01-16T14:24:00Z',
        updated_at: '2026-01-16T14:25:00Z',
      },
      {
        payment_id: 'pay_002',
        order_id: 'order_003',
        tenant_id: 'tenant_demo_001',
        user_id: 'user_demo_001',
        payment_method: 'BALANCE',
        currency: 'CNY',
        exchange_rate: 1,
        base_currency: 'CNY',
        base_currency_amount: 100,
        amount: 100,
        status: 'SUCCESS',
        paid_at: '2026-01-15T09:20:00Z',
        created_at: '2026-01-15T09:19:00Z',
        updated_at: '2026-01-15T09:20:00Z',
      },
      {
        payment_id: 'pay_003',
        order_id: 'order_001',
        tenant_id: 'tenant_demo_001',
        user_id: 'user_demo_001',
        payment_method: 'ALIPAY',
        currency: 'USD',
        exchange_rate: 7.22,
        base_currency: 'CNY',
        base_currency_amount: 361,
        amount: 50,
        status: 'PENDING',
        created_at: '2026-01-17T10:35:00Z',
        updated_at: '2026-01-17T10:35:00Z',
      },
    ]

    paymentList.value = mockPayments
    total.value = mockPayments.length
  } catch (error) {
    ElMessage.error('加载支付记录失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

/**
 * 搜索
 */
const handleSearch = () => {
  queryParams.page = 1
  loadPaymentList()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.payment_method = undefined
  queryParams.status = undefined
  queryParams.page = 1
  loadPaymentList()
}

/**
 * 页码改变
 */
const handlePageChange = (page: number) => {
  queryParams.page = page
  loadPaymentList()
}

/**
 * 页大小改变
 */
const handleSizeChange = (size: number) => {
  queryParams.page_size = size
  queryParams.page = 1
  loadPaymentList()
}

/**
 * 查看订单详情
 */
const handleViewOrder = (payment: Payment) => {
  if (payment.order_id) {
    router.push(`/order/detail/${payment.order_id}`)
  } else {
    ElMessage.info('该支付记录无关联订单')
  }
}

/**
 * 获取支付方式文本
 */
const getPaymentMethodText = (method: PaymentMethod) => {
  const map: Record<PaymentMethod, string> = {
    BALANCE: '余额支付',
    ALIPAY: '支付宝',
    WECHAT: '微信支付',
    BANK_TRANSFER: '银行转账',
  }
  return map[method]
}

/**
 * 获取状态标签类型
 */
const getStatusType = (status: PaymentStatus) => {
  const map: Record<PaymentStatus, any> = {
    PENDING: 'warning',
    SUCCESS: 'success',
    FAILED: 'danger',
  }
  return map[status]
}

/**
 * 获取状态文本
 */
const getStatusText = (status: PaymentStatus) => {
  const map: Record<PaymentStatus, string> = {
    PENDING: '待支付',
    SUCCESS: '支付成功',
    FAILED: '支付失败',
  }
  return map[status]
}

/**
 * 格式化日期时间
 */
const formatDateTime = (datetime?: string) => {
  if (!datetime) return '-'
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
  loadPaymentList()
})
</script>

<template>
  <div class="payment-list-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>支付记录</h2>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="queryParams">
          <el-form-item label="支付方式">
            <el-select v-model="queryParams.payment_method" placeholder="全部" clearable>
              <el-option
                v-for="item in paymentMethodOptions.filter(o => o.value !== undefined)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="支付状态">
            <el-select v-model="queryParams.status" placeholder="全部" clearable>
              <el-option
                v-for="item in statusOptions.filter(o => o.value !== undefined)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 支付记录表格 -->
      <el-table :data="paymentList" v-loading="loading" stripe>
        <el-table-column prop="payment_id" label="支付ID" width="180" fixed />
        <el-table-column prop="order_id" label="订单ID" width="150" />
        <el-table-column label="支付方式" width="120">
          <template #default="{ row }">
            {{ getPaymentMethodText(row.payment_method) }}
          </template>
        </el-table-column>
        <el-table-column label="支付金额" width="200">
          <template #default="{ row }">
            <PriceDisplay
              :amount="row.amount"
              :currency="row.currency"
              :exchange-rate="row.exchange_rate"
              :base-currency-amount="row.base_currency_amount"
              :show-base-currency="row.currency !== 'CNY'"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="支付状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="支付时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.paid_at) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.order_id"
              link
              type="primary"
              @click="handleViewOrder(row)"
            >
              查看订单
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.page_size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.payment-list-page {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .search-bar {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  // 移动端适配
  @media (max-width: 768px) {
    padding: 10px;
  }
}
</style>
