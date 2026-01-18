<script setup lang="ts">
import { useResponsive } from '@/composables/useResponsive'

interface Props {
  data: any[]
  columns: {
    prop: string
    label: string
    width?: string
  }[]
}

defineProps<Props>()

const { isMobile } = useResponsive()
</script>

<template>
  <!-- 桌面端：标准表格 -->
  <el-table v-if="!isMobile" :data="data" stripe>
    <el-table-column
      v-for="column in columns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
    />
  </el-table>

  <!-- 移动端：卡片列表 -->
  <div v-else class="mobile-list">
    <el-card v-for="(item, index) in data" :key="index" class="mobile-card">
      <div v-for="column in columns" :key="column.prop" class="card-row">
        <span class="row-label">{{ column.label }}:</span>
        <span class="row-value">{{ item[column.prop] }}</span>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.mobile-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-card {
  .card-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .row-label {
      color: #909399;
      font-size: 14px;
    }

    .row-value {
      color: #303133;
      font-size: 14px;
      font-weight: 500;
    }
  }
}
</style>
