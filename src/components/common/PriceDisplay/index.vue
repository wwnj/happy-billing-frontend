<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrency } from '@/utils/currency'
import { useResponsive } from '@/composables/useResponsive'

interface Props {
  amount: number
  currency: string
  exchangeRate?: number
  baseCurrency?: string
  baseCurrencyAmount?: number
  showBaseCurrency?: boolean
  size?: 'small' | 'default' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  baseCurrency: 'CNY',
  showBaseCurrency: false,
  size: 'default',
})

const { isMobile } = useResponsive()

const formattedAmount = computed(() =>
  formatCurrency(props.amount, props.currency)
)

const formattedBaseAmount = computed(() => {
  if (!props.baseCurrencyAmount) return ''
  return formatCurrency(props.baseCurrencyAmount, props.baseCurrency)
})

const sizeClass = computed(() => `price-display--${props.size}`)
</script>

<template>
  <div class="price-display" :class="[sizeClass, { 'is-mobile': isMobile }]">
    <div class="price-main">
      <span class="price-amount">{{ formattedAmount }}</span>
    </div>
    <div v-if="showBaseCurrency && baseCurrencyAmount" class="price-base">
      <span class="price-base-text">≈ {{ formattedBaseAmount }}</span>
      <el-tooltip v-if="exchangeRate" :content="`汇率: ${exchangeRate}`">
        <el-icon class="price-info-icon"><InfoFilled /></el-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
.price-display {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;

  &.is-mobile {
    flex-direction: column;
    gap: 4px;
  }

  &--small {
    .price-amount {
      font-size: 14px;
    }
    .price-base-text {
      font-size: 12px;
    }
  }

  &--large {
    .price-amount {
      font-size: 24px;
      font-weight: 600;
    }
    .price-base-text {
      font-size: 14px;
    }
  }
}

.price-main {
  display: flex;
  align-items: baseline;
}

.price-amount {
  font-size: 16px;
  color: #303133;
}

.price-base {
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-base-text {
  font-size: 12px;
  color: #909399;
}

.price-info-icon {
  font-size: 14px;
  color: #909399;
  cursor: help;
}
</style>
