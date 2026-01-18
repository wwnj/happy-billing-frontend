<script setup lang="ts">
import { ref, watch } from 'vue'
import { CURRENCY_SYMBOLS } from '@/utils/currency'

type Currency = 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP' | 'HKD'

interface Props {
  modelValue: Currency
  currencies?: Currency[]
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: Currency): void
}

const props = withDefaults(defineProps<Props>(), {
  currencies: () => ['CNY', 'USD', 'EUR', 'JPY', 'GBP', 'HKD'],
  disabled: false,
})

const emit = defineEmits<Emits>()

const selected = ref<Currency>(props.modelValue)

watch(selected, (value) => {
  emit('update:modelValue', value)
})

watch(() => props.modelValue, (value) => {
  selected.value = value
})
</script>

<template>
  <el-select v-model="selected" :disabled="disabled" placeholder="选择货币">
    <el-option
      v-for="currency in currencies"
      :key="currency"
      :value="currency"
      :label="`${CURRENCY_SYMBOLS[currency]} ${currency}`"
    >
      <span class="currency-option">
        <span class="currency-symbol">{{ CURRENCY_SYMBOLS[currency] }}</span>
        <span class="currency-code">{{ currency }}</span>
      </span>
    </el-option>
  </el-select>
</template>

<style scoped lang="scss">
.currency-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.currency-symbol {
  font-size: 16px;
  font-weight: 600;
}

.currency-code {
  color: #606266;
}
</style>
