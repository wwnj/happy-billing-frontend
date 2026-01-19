<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import PriceDisplay from '@/components/common/PriceDisplay/index.vue'
import CurrencySelector from '@/components/common/CurrencySelector/index.vue'
import { createOrder } from '@/api/modules/order'
import { convertCurrency } from '@/api/modules/currency'
import { getSkuListWithPrice } from '@/api/modules/product'
import type { CreateOrderRequest } from '@/types/api/order'
import type { Currency } from '@/types/api/currency'
import type { SkuWithPrice } from '@/types/api/product'

const router = useRouter()

// 表单数据
const form = reactive<CreateOrderRequest & { currency: Currency }>({
  tenant_id: 'tenant_demo_001',
  organization_id: 'org_demo_001',
  project_id: 'proj_demo_001',
  user_id: 'user_demo_001',
  order_type: 'PREPAID',
  sku_code: '',
  quantity: 1,
  currency: 'USD',
})

// SKU 列表
const skuOptions = ref<SkuWithPrice[]>([])
const skuLoading = ref(false)

// 价格信息
const priceInfo = reactive({
  originalPrice: 0,
  discountAmount: 0,
  finalPrice: 0,
  currency: 'USD' as Currency,
  baseCurrencyAmount: 0,
  exchangeRate: 0,
  loading: false,
})

// 是否正在提交
const submitting = ref(false)

// 当前选中的 SKU
const selectedSku = computed(() => {
  return skuOptions.value.find(sku => sku.sku_code === form.sku_code)
})

// SKU 改变时重新计算价格
const handleSkuChange = () => {
  if (selectedSku.value) {
    form.currency = selectedSku.value.currency as Currency
    calculatePrice()
  }
}

// 数量改变时重新计算价格
const handleQuantityChange = () => {
  if (selectedSku.value) {
    calculatePrice()
  }
}

// 货币改变时重新计算价格
const handleCurrencyChange = () => {
  calculatePrice()
}

/**
 * 计算价格
 */
const calculatePrice = async () => {
  if (!selectedSku.value) {
    return
  }

  priceInfo.loading = true

  try {
    // 计算原始价格
    const unitPrice = selectedSku.value.unit_price || 0
    const basePrice = unitPrice * form.quantity
    priceInfo.originalPrice = basePrice
    priceInfo.discountAmount = 0
    priceInfo.finalPrice = basePrice
    priceInfo.currency = form.currency

    // 如果显示币种不是本位币，需要转换
    if (form.currency !== 'CNY') {
      try {
        const { data } = await convertCurrency({
          amount: priceInfo.finalPrice,
          from_currency: form.currency,
          to_currency: 'CNY',
        })

        priceInfo.baseCurrencyAmount = data.converted_amount
        priceInfo.exchangeRate = data.exchange_rate
      } catch (error) {
        // 如果转换失败，使用模拟汇率
        const mockRates: Record<string, number> = {
          USD: 7.22,
          EUR: 7.85,
          JPY: 0.048,
          GBP: 9.15,
          HKD: 0.92,
        }
        priceInfo.exchangeRate = mockRates[form.currency] || 1
        priceInfo.baseCurrencyAmount = priceInfo.finalPrice * priceInfo.exchangeRate
      }
    } else {
      priceInfo.baseCurrencyAmount = priceInfo.finalPrice
      priceInfo.exchangeRate = 1
    }
  } catch (error) {
    console.error('价格计算失败:', error)
  } finally {
    priceInfo.loading = false
  }
}

/**
 * 提交订单
 */
const handleSubmit = async () => {
  if (!form.sku_code) {
    ElMessage.warning('请选择产品')
    return
  }

  if (form.quantity <= 0) {
    ElMessage.warning('数量必须大于0')
    return
  }

  submitting.value = true

  try {
    const { data } = await createOrder({
      tenant_id: form.tenant_id,
      organization_id: form.organization_id,
      project_id: form.project_id,
      user_id: form.user_id,
      order_type: form.order_type,
      sku_code: form.sku_code,
      quantity: form.quantity,
    })

    ElMessage.success('订单创建成功')
    router.push(`/order/detail/${data.order_id}`)
  } catch (error) {
    ElMessage.error('订单创建失败')
    console.error(error)
  } finally {
    submitting.value = false
  }
}

/**
 * 加载 SKU 列表
 */
const loadSkuList = async () => {
  skuLoading.value = true

  try {
    const skuList = await getSkuListWithPrice()
    // 过滤出有价格的 SKU
    skuOptions.value = skuList.filter(sku => sku.unit_price !== undefined)
  } catch (error) {
    ElMessage.error('加载产品列表失败')
    console.error(error)
  } finally {
    skuLoading.value = false
  }
}

// 初始化
onMounted(() => {
  loadSkuList()
})
</script>

<template>
  <div class="order-create-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>创建订单</h2>
        </div>
      </template>

      <el-form :model="form" label-width="120px" size="large">
        <!-- 步骤 1: 选择产品 -->
        <el-divider content-position="left">
          <h3>步骤 1: 选择产品</h3>
        </el-divider>

        <el-form-item label="产品 SKU" required>
          <el-select
            v-model="form.sku_code"
            placeholder="请选择产品 SKU"
            :loading="skuLoading"
            style="width: 100%"
            @change="handleSkuChange"
          >
            <el-option
              v-for="sku in skuOptions"
              :key="sku.sku_code"
              :value="sku.sku_code"
              :label="sku.sku_name"
            >
              <div class="sku-option">
                <span class="sku-name">{{ sku.sku_name }}</span>
                <span class="sku-price">{{ sku.unit_price }} {{ sku.currency }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 步骤 2: 配置规格 -->
        <el-divider content-position="left">
          <h3>步骤 2: 配置规格</h3>
        </el-divider>

        <el-form-item label="订单类型" required>
          <el-radio-group v-model="form.order_type">
            <el-radio label="PREPAID">预付费</el-radio>
            <el-radio label="POSTPAID">后付费</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="数量" required>
          <el-input-number
            v-model="form.quantity"
            :min="1"
            :max="100"
            @change="handleQuantityChange"
          />
        </el-form-item>

        <el-form-item label="显示币种">
          <CurrencySelector
            v-model="form.currency"
            @update:model-value="handleCurrencyChange"
          />
        </el-form-item>

        <!-- 步骤 3: 价格计算 -->
        <el-divider content-position="left">
          <h3>步骤 3: 价格预览</h3>
        </el-divider>

        <div v-if="selectedSku" class="price-preview" v-loading="priceInfo.loading">
          <el-descriptions :column="1" border size="large">
            <el-descriptions-item label="单价">
              {{ selectedSku.unit_price }} {{ selectedSku.currency }}
            </el-descriptions-item>
            <el-descriptions-item label="数量">
              {{ form.quantity }}
            </el-descriptions-item>
            <el-descriptions-item label="原始金额">
              <PriceDisplay
                :amount="priceInfo.originalPrice"
                :currency="priceInfo.currency"
                size="default"
              />
            </el-descriptions-item>
            <el-descriptions-item label="折扣金额">
              <span class="discount-text">
                - <PriceDisplay
                  :amount="priceInfo.discountAmount"
                  :currency="priceInfo.currency"
                  size="default"
                />
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="应付金额">
              <PriceDisplay
                :amount="priceInfo.finalPrice"
                :currency="priceInfo.currency"
                :exchange-rate="priceInfo.exchangeRate"
                :base-currency-amount="priceInfo.baseCurrencyAmount"
                :show-base-currency="priceInfo.currency !== 'CNY'"
                size="large"
              />
            </el-descriptions-item>
            <el-descriptions-item v-if="priceInfo.currency !== 'CNY'" label="汇率信息">
              <div class="rate-info">
                1 {{ priceInfo.currency }} = {{ priceInfo.exchangeRate }} CNY
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <el-empty v-else description="请先选择产品" />

        <!-- 步骤 4: 确认订单 -->
        <el-divider content-position="left">
          <h3>步骤 4: 确认订单</h3>
        </el-divider>

        <el-form-item>
          <el-space>
            <el-button
              type="primary"
              size="large"
              :loading="submitting"
              :disabled="!selectedSku"
              @click="handleSubmit"
            >
              创建订单
            </el-button>
            <el-button size="large" @click="router.back()">
              取消
            </el-button>
          </el-space>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.order-create-page {
  padding: 20px;

  .card-header {
    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .sku-option {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .sku-name {
      flex: 1;
    }

    .sku-price {
      color: #409eff;
      font-weight: 600;
    }
  }

  .price-preview {
    margin: 20px 0;
    padding: 20px;
    background-color: #f5f7fa;
    border-radius: 8px;

    .discount-text {
      color: #67c23a;
      font-weight: 600;
    }

    .rate-info {
      color: #606266;
      font-size: 14px;
    }
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
}
</style>
