<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ExchangeRateInfo from '@/components/common/ExchangeRateInfo/index.vue'
import { getExchangeRates } from '@/api/modules/currency'
import type { ExchangeRate, Currency } from '@/types/api/currency'

// 查询参数
const queryParams = reactive({
  page: 1,
  page_size: 20,
  from_currency: undefined as Currency | undefined,
  to_currency: undefined as Currency | undefined,
})

// 汇率列表
const exchangeRatesList = ref<ExchangeRate[]>([])
const total = ref(0)
const loading = ref(false)

// 货币选项
const currencyOptions: Currency[] = ['CNY', 'USD', 'EUR', 'JPY', 'GBP', 'HKD']

// 货币名称映射
const currencyNames: Record<Currency, string> = {
  CNY: '人民币',
  USD: '美元',
  EUR: '欧元',
  JPY: '日元',
  GBP: '英镑',
  HKD: '港币',
}

/**
 * 加载汇率列表
 */
const loadExchangeRates = async () => {
  loading.value = true

  try {
    const { data } = await getExchangeRates(queryParams)
    exchangeRatesList.value = data.data || []
    total.value = data.total || 0
  } catch (error) {
    ElMessage.error('加载汇率列表失败')
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
  loadExchangeRates()
}

/**
 * 重置
 */
const handleReset = () => {
  queryParams.from_currency = undefined
  queryParams.to_currency = undefined
  queryParams.page = 1
  loadExchangeRates()
}

/**
 * 页码改变
 */
const handlePageChange = (page: number) => {
  queryParams.page = page
  loadExchangeRates()
}

/**
 * 页大小改变
 */
const handleSizeChange = (size: number) => {
  queryParams.page_size = size
  queryParams.page = 1
  loadExchangeRates()
}

/**
 * 获取货币名称
 */
const getCurrencyName = (currency: Currency) => {
  return currencyNames[currency] || currency
}

/**
 * 格式化日期
 */
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
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
  loadExchangeRates()
})
</script>

<template>
  <div class="exchange-rates-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>汇率管理</h2>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="queryParams">
          <el-form-item label="源币种">
            <el-select
              v-model="queryParams.from_currency"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="currency in currencyOptions"
                :key="currency"
                :label="`${currency} - ${getCurrencyName(currency)}`"
                :value="currency"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="目标币种">
            <el-select
              v-model="queryParams.to_currency"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="currency in currencyOptions"
                :key="currency"
                :label="`${currency} - ${getCurrencyName(currency)}`"
                :value="currency"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 当前汇率卡片 -->
      <div class="current-rates">
        <el-alert
          title="当前生效汇率"
          type="info"
          :closable="false"
          show-icon
        >
          <div class="rates-grid">
            <div
              v-for="rate in exchangeRatesList.filter(r => r.effective_date === '2026-01-17')"
              :key="rate.id"
              class="rate-card"
            >
              <ExchangeRateInfo
                :from-currency="rate.from_currency"
                :to-currency="rate.to_currency"
                :rate="rate.rate"
                :effective-date="rate.effective_date"
                :source="rate.source"
              />
            </div>
          </div>
        </el-alert>
      </div>

      <!-- 汇率历史记录 -->
      <el-divider content-position="left">
        <h3>汇率历史记录</h3>
      </el-divider>

      <el-table :data="exchangeRatesList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="源币种" width="150">
          <template #default="{ row }">
            {{ row.from_currency }} - {{ getCurrencyName(row.from_currency) }}
          </template>
        </el-table-column>
        <el-table-column label="目标币种" width="150">
          <template #default="{ row }">
            {{ row.to_currency }} - {{ getCurrencyName(row.to_currency) }}
          </template>
        </el-table-column>
        <el-table-column label="汇率" width="150">
          <template #default="{ row }">
            <span class="rate-value">{{ row.rate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生效日期" width="150">
          <template #default="{ row }">
            {{ formatDate(row.effective_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="source" label="数据来源" width="150" />
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="换算示例" min-width="200">
          <template #default="{ row }">
            1 {{ row.from_currency }} = {{ row.rate }} {{ row.to_currency }}
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
.exchange-rates-page {
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

  .current-rates {
    margin-bottom: 30px;

    .rates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      margin-top: 16px;

      .rate-card {
        padding: 12px;
        background-color: #fff;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
      }
    }
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .rate-value {
    font-size: 16px;
    font-weight: 600;
    color: #409eff;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  // 移动端适配
  @media (max-width: 768px) {
    padding: 10px;

    .current-rates {
      .rates-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
