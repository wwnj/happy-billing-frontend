<script setup lang="ts">
interface Props {
  fromCurrency: string
  toCurrency: string
  rate: number
  effectiveDate: string
  source?: string
}

defineProps<Props>()
</script>

<template>
  <div class="exchange-rate-info">
    <div class="rate-main">
      <span class="rate-text">
        1 {{ fromCurrency }} = {{ rate }} {{ toCurrency }}
      </span>
    </div>
    <div class="rate-meta">
      <span class="rate-date">{{ effectiveDate }}</span>
      <span v-if="source" class="rate-source">来源: {{ source }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.exchange-rate-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rate-main {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.rate-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}
</style>
