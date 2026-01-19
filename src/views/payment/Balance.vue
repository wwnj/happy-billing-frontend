<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BalanceCard from '@/components/common/BalanceCard/index.vue'
import PriceDisplay from '@/components/common/PriceDisplay/index.vue'
import { getBalance, rechargeBalance, getBalanceTransactions } from '@/api/modules/payment'
import type { AccountBalance, BalanceTransaction } from '@/types/api/payment'
import type { Currency } from '@/types/api/currency'

const router = useRouter()

// 账户余额
const balance = ref<AccountBalance | null>(null)
const loading = ref(false)

// 余额变动记录
const balanceHistory = ref<BalanceTransaction[]>([])
const historyLoading = ref(false)
const total = ref(0)

// 充值对话框
const rechargeDialogVisible = ref(false)
const rechargeForm = reactive({
  amount: 0,
  currency: 'CNY' as Currency,
})
const recharging = ref(false)

// 查询参数
const queryParams = reactive({
  page: 1,
  page_size: 20,
  tenant_id: 'tenant_demo_001',
})

/**
 * 加载余额信息
 */
const loadBalance = async () => {
  loading.value = true

  try {
    const { data } = await getBalance(queryParams.tenant_id)
    balance.value = data
  } catch (error) {
    ElMessage.error('加载余额信息失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

/**
 * 加载余额变动记录
 */
const loadBalanceHistory = async () => {
  historyLoading.value = true

  try {
    const { data } = await getBalanceTransactions(queryParams.tenant_id, {
      page: queryParams.page,
      page_size: queryParams.page_size,
    })
    balanceHistory.value = data.data || []
    total.value = data.total || 0
  } catch (error) {
    ElMessage.error('加载余额变动记录失败')
    console.error(error)
  } finally {
    historyLoading.value = false
  }
}

/**
 * 打开充值对话框
 */
const handleRecharge = () => {
  rechargeForm.amount = 0
  rechargeForm.currency = 'CNY'
  rechargeDialogVisible.value = true
}

/**
 * 确认充值
 */
const handleConfirmRecharge = async () => {
  if (rechargeForm.amount <= 0) {
    ElMessage.warning('充值金额必须大于0')
    return
  }

  recharging.value = true

  try {
    // 调用充值API
    await rechargeBalance(queryParams.tenant_id, {
      amount: rechargeForm.amount,
    })

    ElMessage.success('充值成功')
    rechargeDialogVisible.value = false

    // 刷新余额和记录
    await Promise.all([loadBalance(), loadBalanceHistory()])
  } catch (error) {
    ElMessage.error('充值失败')
    console.error(error)
  } finally {
    recharging.value = false
  }
}

/**
 * 查看变动记录详情
 */
const handleViewRecord = (record: BalanceTransaction) => {
  if (record.related_order_id) {
    // 使用 router 生成完整路径，然后在新标签页打开
    const routeData = router.resolve({
      name: 'OrderDetail',
      params: { id: record.related_order_id }
    })
    window.open(routeData.href, '_blank')
  } else {
    ElMessage.info('该记录无关联订单')
  }
}

/**
 * 获取变动类型标签类型
 */
const getTypeTagType = (type: string) => {
  const map: Record<string, any> = {
    RECHARGE: 'success',
    DEDUCT: 'warning',
    REFUND: 'info',
    FREEZE: 'danger',
    UNFREEZE: 'success',
  }
  return map[type] || 'info'
}

/**
 * 获取变动类型文本
 */
const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    RECHARGE: '充值',
    DEDUCT: '扣减',
    REFUND: '退款',
    FREEZE: '冻结',
    UNFREEZE: '解冻',
  }
  return map[type] || type
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

/**
 * 页码改变
 */
const handlePageChange = (page: number) => {
  queryParams.page = page
  loadBalanceHistory()
}

/**
 * 页大小改变
 */
const handleSizeChange = (size: number) => {
  queryParams.page_size = size
  queryParams.page = 1
  loadBalanceHistory()
}

// 初始化
onMounted(() => {
  loadBalance()
  loadBalanceHistory()
})
</script>

<template>
  <div class="balance-page">
    <!-- 余额卡片 -->
    <BalanceCard
      v-if="balance"
      v-loading="loading"
      :balance="balance.balance"
      :frozen-balance="balance.frozen_balance"
      :credit-limit="balance.credit_limit"
      :currency="balance.currency"
      @recharge="handleRecharge"
      @view-records="() => {}"
    />

    <!-- 余额变动记录 -->
    <el-card class="mt-4">
      <template #header>
        <div class="card-header">
          <h3>余额变动记录</h3>
        </div>
      </template>

      <el-table
        :data="balanceHistory"
        v-loading="historyLoading"
        stripe
      >
        <el-table-column prop="transaction_id" label="记录ID" width="180" />
        <el-table-column label="变动类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.transaction_type)">
              {{ getTypeText(row.transaction_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="变动金额" width="150">
          <template #default="{ row }">
            <span :class="row.amount > 0 ? 'amount-positive' : 'amount-negative'">
              {{ row.amount > 0 ? '+' : '' }}
              <PriceDisplay
                :amount="Math.abs(row.amount)"
                currency="CNY"
                size="small"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="变动前余额" width="150">
          <template #default="{ row }">
            <PriceDisplay
              :amount="row.balance_before"
              currency="CNY"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="变动后余额" width="150">
          <template #default="{ row }">
            <PriceDisplay
              :amount="row.balance_after"
              currency="CNY"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="说明" min-width="200" />
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.related_order_id"
              link
              type="primary"
              @click="handleViewRecord(row)"
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

    <!-- 充值对话框 -->
    <el-dialog
      v-model="rechargeDialogVisible"
      title="账户充值"
      width="500px"
    >
      <el-form :model="rechargeForm" label-width="100px">
        <el-form-item label="充值金额" required>
          <el-input-number
            v-model="rechargeForm.amount"
            :min="0"
            :max="999999"
            :precision="2"
            :step="100"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="充值币种">
          <el-select v-model="rechargeForm.currency" disabled style="width: 100%">
            <el-option label="CNY" value="CNY" />
          </el-select>
          <div class="form-tip">目前仅支持人民币充值</div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-space>
          <el-button @click="rechargeDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="recharging"
            @click="handleConfirmRecharge"
          >
            确认充值
          </el-button>
        </el-space>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.balance-page {
  padding: 20px;

  .mt-4 {
    margin-top: 20px;
  }

  .card-header {
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .amount-positive {
    color: #67c23a;
    font-weight: 600;
  }

  .amount-negative {
    color: #f56c6c;
    font-weight: 600;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .form-tip {
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
  }

  // 移动端适配
  @media (max-width: 768px) {
    padding: 10px;
  }
}
</style>
