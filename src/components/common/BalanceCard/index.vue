<script setup lang="ts">
import { formatCurrency } from '@/utils/currency'

interface Props {
  balance: number
  frozenBalance?: number
  creditLimit?: number
  currency?: string
}

withDefaults(defineProps<Props>(), {
  frozenBalance: 0,
  creditLimit: 0,
  currency: 'CNY',
})
</script>

<template>
  <el-card class="balance-card">
    <div class="balance-header">
      <div class="amount">{{ formatCurrency(balance, currency) }}</div>
      <div class="currency-label">{{ currency }} (本位币)</div>
    </div>
    <div class="balance-actions">
      <el-button type="primary">充值</el-button>
      <el-button>变动记录</el-button>
    </div>
    <div class="balance-info">
      <div class="info-item">
        <span class="label">冻结余额:</span>
        <span class="value">{{ formatCurrency(frozenBalance, currency) }}</span>
      </div>
      <div class="info-item">
        <span class="label">信用额度:</span>
        <span class="value">{{ formatCurrency(creditLimit, currency) }}</span>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.balance-card {
  .balance-header {
    text-align: center;
    margin-bottom: 20px;

    .amount {
      font-size: 32px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 8px;
    }

    .currency-label {
      font-size: 14px;
      color: #909399;
    }
  }

  .balance-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .balance-info {
    border-top: 1px solid #ebeef5;
    padding-top: 16px;

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;

      .label {
        color: #606266;
      }

      .value {
        color: #303133;
        font-weight: 500;
      }
    }
  }
}
</style>
