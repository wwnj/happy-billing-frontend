<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import CurrencySelector from '@/components/common/CurrencySelector/index.vue'
import PriceDisplay from '@/components/common/PriceDisplay/index.vue'
import ExchangeRateInfo from '@/components/common/ExchangeRateInfo/index.vue'
import type { Currency } from '@/types/api/currency'

// 转换表单
const converterForm = reactive({
  from_currency: 'USD' as Currency,
  to_currency: 'CNY' as Currency,
  amount: 100,
})

// 转换结果
const conversionResult = ref<{
  converted_amount: number
  exchange_rate: number
  effective_date: string
} | null>(null)

// 加载状态
const converting = ref(false)

// 常用货币对
const commonPairs = [
  { from: 'USD' as Currency, to: 'CNY' as Currency, label: '美元 → 人民币' },
  { from: 'EUR' as Currency, to: 'CNY' as Currency, label: '欧元 → 人民币' },
  { from: 'JPY' as Currency, to: 'CNY' as Currency, label: '日元 → 人民币' },
  { from: 'GBP' as Currency, to: 'CNY' as Currency, label: '英镑 → 人民币' },
  { from: 'HKD' as Currency, to: 'CNY' as Currency, label: '港币 → 人民币' },
  { from: 'CNY' as Currency, to: 'USD' as Currency, label: '人民币 → 美元' },
]

// 是否可以转换（源币种和目标币种不能相同）
const canConvert = computed(() => {
  return converterForm.from_currency !== converterForm.to_currency && converterForm.amount > 0
})

/**
 * 执行货币转换
 */
const handleConvert = async () => {
  if (!canConvert.value) {
    if (converterForm.from_currency === converterForm.to_currency) {
      ElMessage.warning('源币种和目标币种不能相同')
    } else {
      ElMessage.warning('请输入有效的金额')
    }
    return
  }

  converting.value = true

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟汇率数据
    const mockRates: Record<string, number> = {
      'USD-CNY': 7.22,
      'EUR-CNY': 7.85,
      'JPY-CNY': 0.048,
      'GBP-CNY': 9.15,
      'HKD-CNY': 0.92,
      'CNY-USD': 0.1385,
      'CNY-EUR': 0.1274,
      'CNY-JPY': 20.83,
      'CNY-GBP': 0.1093,
      'CNY-HKD': 1.087,
    }

    const rateKey = `${converterForm.from_currency}-${converterForm.to_currency}`
    const rate = mockRates[rateKey] || 1

    conversionResult.value = {
      converted_amount: converterForm.amount * rate,
      exchange_rate: rate,
      effective_date: new Date().toISOString().split('T')[0],
    }

    ElMessage.success('转换成功')
  } catch (error) {
    ElMessage.error('转换失败')
    console.error(error)
  } finally {
    converting.value = false
  }
}

/**
 * 交换源币种和目标币种
 */
const handleSwap = () => {
  const temp = converterForm.from_currency
  converterForm.from_currency = converterForm.to_currency
  converterForm.to_currency = temp

  // 如果已有转换结果，自动重新转换
  if (conversionResult.value) {
    handleConvert()
  }
}

/**
 * 使用常用货币对
 */
const useCommonPair = (pair: { from: Currency; to: Currency }) => {
  converterForm.from_currency = pair.from
  converterForm.to_currency = pair.to
  handleConvert()
}

/**
 * 重置
 */
const handleReset = () => {
  converterForm.from_currency = 'USD'
  converterForm.to_currency = 'CNY'
  converterForm.amount = 100
  conversionResult.value = null
}

// 监听金额变化，自动转换
watch(
  () => converterForm.amount,
  () => {
    if (conversionResult.value && canConvert.value) {
      handleConvert()
    }
  }
)
</script>

<template>
  <div class="converter-page">
    <el-row :gutter="20">
      <!-- 左侧：转换器 -->
      <el-col :xs="24" :lg="14">
        <el-card>
          <template #header>
            <h2>货币转换器</h2>
          </template>

          <div class="converter-form">
            <!-- 源货币 -->
            <div class="form-item">
              <label>源货币</label>
              <div class="currency-input">
                <CurrencySelector v-model="converterForm.from_currency" />
                <el-input-number
                  v-model="converterForm.amount"
                  :min="0"
                  :max="999999999"
                  :precision="2"
                  :step="100"
                  class="amount-input"
                />
              </div>
            </div>

            <!-- 交换按钮 -->
            <div class="swap-button">
              <el-button
                :icon="'Sort'"
                circle
                @click="handleSwap"
              />
            </div>

            <!-- 目标货币 -->
            <div class="form-item">
              <label>目标货币</label>
              <div class="currency-input">
                <CurrencySelector v-model="converterForm.to_currency" />
                <div v-if="conversionResult" class="result-display">
                  <PriceDisplay
                    :amount="conversionResult.converted_amount"
                    :currency="converterForm.to_currency"
                    size="large"
                  />
                </div>
                <div v-else class="result-placeholder">
                  转换结果将显示在这里
                </div>
              </div>
            </div>

            <!-- 汇率信息 -->
            <div v-if="conversionResult" class="rate-info">
              <ExchangeRateInfo
                :from-currency="converterForm.from_currency"
                :to-currency="converterForm.to_currency"
                :rate="conversionResult.exchange_rate"
                :effective-date="conversionResult.effective_date"
                source="系统汇率"
              />
            </div>

            <!-- 操作按钮 -->
            <div class="actions">
              <el-space>
                <el-button
                  type="primary"
                  size="large"
                  :loading="converting"
                  :disabled="!canConvert"
                  @click="handleConvert"
                >
                  转换
                </el-button>
                <el-button size="large" @click="handleReset">
                  重置
                </el-button>
              </el-space>
            </div>

            <!-- 转换说明 -->
            <el-alert
              v-if="conversionResult"
              type="success"
              :closable="false"
              show-icon
            >
              <template #title>
                <div class="conversion-summary">
                  {{ converterForm.amount }} {{ converterForm.from_currency }}
                  =
                  {{ conversionResult.converted_amount.toFixed(2) }} {{ converterForm.to_currency }}
                </div>
              </template>
            </el-alert>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：常用货币对快捷转换 -->
      <el-col :xs="24" :lg="10">
        <el-card>
          <template #header>
            <h3>常用货币对</h3>
          </template>

          <div class="common-pairs">
            <el-button
              v-for="pair in commonPairs"
              :key="`${pair.from}-${pair.to}`"
              class="pair-button"
              @click="useCommonPair(pair)"
            >
              {{ pair.label }}
            </el-button>
          </div>

          <el-divider />

          <div class="tips">
            <h4>使用提示</h4>
            <ul>
              <li>点击常用货币对可快速设置转换方向</li>
              <li>使用交换按钮可快速切换源币种和目标币种</li>
              <li>修改金额后会自动重新计算转换结果</li>
              <li>汇率数据每日更新，仅供参考</li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.converter-page {
  padding: 20px;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  h4 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
  }

  .converter-form {
    .form-item {
      margin-bottom: 24px;

      label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #606266;
      }

      .currency-input {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .amount-input {
          width: 100%;
        }

        .result-display {
          padding: 16px;
          background-color: #f5f7fa;
          border-radius: 4px;
          text-align: center;
        }

        .result-placeholder {
          padding: 16px;
          background-color: #f5f7fa;
          border-radius: 4px;
          text-align: center;
          color: #909399;
          font-size: 14px;
        }
      }
    }

    .swap-button {
      display: flex;
      justify-content: center;
      margin: 16px 0;
    }

    .rate-info {
      margin: 20px 0;
      padding: 16px;
      background-color: #f5f7fa;
      border-radius: 4px;
    }

    .actions {
      margin: 24px 0;
      display: flex;
      justify-content: center;
    }

    .conversion-summary {
      font-size: 16px;
      font-weight: 600;
      text-align: center;
    }
  }

  .common-pairs {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .pair-button {
      width: 100%;
      justify-content: flex-start;
    }
  }

  .tips {
    ul {
      margin: 0;
      padding-left: 20px;
      color: #606266;
      font-size: 14px;
      line-height: 1.8;

      li {
        margin-bottom: 8px;
      }
    }
  }

  // 移动端适配
  @media (max-width: 768px) {
    padding: 10px;
  }
}
</style>
