<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import PriceDisplay from '@/components/common/PriceDisplay/index.vue'
import { getOrderList as _unused, cancelOrder } from '@/api/modules/order'
import type { Order, OrderStatus } from '@/types/api/order'
import type { Currency } from '@/types/api/currency'

const router = useRouter()

// 查询参数
const queryParams = reactive({
  page: 1,
  page_size: 20,
  tenant_id: 'tenant_demo_001',
  status: undefined as OrderStatus | undefined,
  currency: undefined as Currency | undefined,
})

// 订单列表
const orderList = ref<Order[]>([])
const total = ref(0)
const loading = ref(false)

// 状态选项
const statusOptions = [
  { label: '全部', value: undefined },
  { label: '待支付', value: 'PENDING' },
  { label: '已支付', value: 'PAID' },
  { label: '已取消', value: 'CANCELLED' },
]

// 货币选项
const currencyOptions = [
  { label: '全部', value: undefined },
  { label: 'CNY', value: 'CNY' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'JPY', value: 'JPY' },
  { label: 'GBP', value: 'GBP' },
  { label: 'HKD', value: 'HKD' },
]

/**
 * 加载订单列表
 */
const loadOrderList = async () => {
  loading.value = true

  try {
    // 模拟数据（实际应该调用API）
    // const { data } = await getOrderList(queryParams)

    // 使用模拟数据
    const mockOrders: Order[] = [
      {
        order_id: 'order_001',
        order_no: 'ORD20260117001',
        tenant_id: 'tenant_demo_001',
        organization_id: 'org_demo_001',
        project_id: 'proj_demo_001',
        user_id: 'user_demo_001',
        order_type: 'PREPAID',
        spu_code: 'spu_vm_001',
        sku_code: 'sku_vm_001',
        currency: 'USD',
        exchange_rate: 7.22,
        base_currency: 'CNY',
        base_currency_amount: 361,
        original_amount: 50,
        discount_amount: 0,
        payable_amount: 50,
        paid_amount: 0,
        status: 'PENDING',
        created_at: '2026-01-17T10:30:00Z',
        updated_at: '2026-01-17T10:30:00Z',
      },
      {
        order_id: 'order_002',
        order_no: 'ORD20260117002',
        tenant_id: 'tenant_demo_001',
        organization_id: 'org_demo_001',
        project_id: 'proj_demo_001',
        user_id: 'user_demo_001',
        order_type: 'PREPAID',
        spu_code: 'spu_vm_002',
        sku_code: 'sku_vm_002',
        currency: 'USD',
        exchange_rate: 7.22,
        base_currency: 'CNY',
        base_currency_amount: 722,
        original_amount: 100,
        discount_amount: 0,
        payable_amount: 100,
        paid_amount: 100,
        status: 'PAID',
        created_at: '2026-01-16T14:20:00Z',
        updated_at: '2026-01-16T14:25:00Z',
      },
      {
        order_id: 'order_003',
        order_no: 'ORD20260117003',
        tenant_id: 'tenant_demo_001',
        organization_id: 'org_demo_001',
        project_id: 'proj_demo_001',
        user_id: 'user_demo_001',
        order_type: 'PREPAID',
        spu_code: 'spu_storage_001',
        sku_code: 'sku_storage_001',
        currency: 'CNY',
        exchange_rate: 1,
        base_currency: 'CNY',
        base_currency_amount: 100,
        original_amount: 100,
        discount_amount: 0,
        payable_amount: 100,
        paid_amount: 100,
        status: 'PAID',
        created_at: '2026-01-15T09:15:00Z',
        updated_at: '2026-01-15T09:20:00Z',
      },
    ]

    orderList.value = mockOrders
    total.value = mockOrders.length
  } catch (error) {
    ElMessage.error('加载订单列表失败')
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
  loadOrderList()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.status = undefined
  queryParams.currency = undefined
  queryParams.page = 1
  loadOrderList()
}

/**
 * 页码改变
 */
const handlePageChange = (page: number) => {
  queryParams.page = page
  loadOrderList()
}

/**
 * 页大小改变
 */
const handleSizeChange = (size: number) => {
  queryParams.page_size = size
  queryParams.page = 1
  loadOrderList()
}

/**
 * 查看详情
 */
const handleViewDetail = (order: Order) => {
  router.push(`/order/detail/${order.order_id}`)
}

/**
 * 取消订单
 */
const handleCancelOrder = async (order: Order) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消订单 ${order.order_no} 吗？`,
      '确认取消',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await cancelOrder(order.order_id)
    ElMessage.success('订单已取消')
    loadOrderList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('取消订单失败')
      console.error(error)
    }
  }
}

/**
 * 获取状态标签类型
 */
const getStatusType = (status: OrderStatus) => {
  const map: Record<OrderStatus, any> = {
    PENDING: 'warning',
    PAID: 'success',
    CANCELLED: 'info',
  }
  return map[status]
}

/**
 * 获取状态文本
 */
const getStatusText = (status: OrderStatus) => {
  const map: Record<OrderStatus, string> = {
    PENDING: '待支付',
    PAID: '已支付',
    CANCELLED: '已取消',
  }
  return map[status]
}

// 初始化
onMounted(() => {
  loadOrderList()
})
</script>

<template>
  <div class="order-list-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>订单列表</h2>
          <el-button type="primary" @click="router.push('/order/create')">
            创建订单
          </el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="queryParams">
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="全部" clearable>
              <el-option
                v-for="item in statusOptions.filter(o => o.value !== undefined)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="货币">
            <el-select v-model="queryParams.currency" placeholder="全部" clearable>
              <el-option
                v-for="item in currencyOptions.filter(o => o.value !== undefined)"
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

      <!-- 订单表格 -->
      <el-table :data="orderList" v-loading="loading" stripe>
        <el-table-column prop="order_no" label="订单号" width="180" fixed />
        <el-table-column prop="sku_code" label="SKU" width="150" />
        <el-table-column label="金额" width="250">
          <template #default="{ row }">
            <PriceDisplay
              :amount="row.payable_amount"
              :currency="row.currency"
              :exchange-rate="row.exchange_rate"
              :base-currency-amount="row.base_currency_amount"
              :show-base-currency="row.currency !== 'CNY'"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewDetail(row)">
              详情
            </el-button>
            <el-button
              v-if="row.status === 'PENDING'"
              link
              type="danger"
              @click="handleCancelOrder(row)"
            >
              取消
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
.order-list-page {
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
}
</style>
