<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { Tenant } from '@/types/api/tenant'

// 查询参数
const queryParams = reactive({
  page: 1,
  page_size: 20,
})

// 租户列表
const tenantList = ref<Tenant[]>([])
const total = ref(0)
const loading = ref(false)

/**
 * 加载租户列表
 */
const loadTenantList = async () => {
  loading.value = true

  try {
    // 模拟数据
    const mockTenants: Tenant[] = [
      {
        tenant_id: 'tenant_demo_001',
        tenant_code: 'T001',
        name: '演示租户001',
        tenant_type: 'ENTERPRISE',
        preferred_currency: 'CNY',
        verified: true,
        verified_type: 'ENTERPRISE',
        status: 1,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-17T10:00:00Z',
      },
      {
        tenant_id: 'tenant_demo_002',
        tenant_code: 'T002',
        name: '演示租户002',
        tenant_type: 'INDIVIDUAL',
        preferred_currency: 'USD',
        verified: false,
        status: 1,
        created_at: '2026-01-10T00:00:00Z',
        updated_at: '2026-01-15T10:00:00Z',
      },
    ]

    tenantList.value = mockTenants
    total.value = mockTenants.length
  } catch (error) {
    ElMessage.error('加载租户列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

/**
 * 页码改变
 */
const handlePageChange = (page: number) => {
  queryParams.page = page
  loadTenantList()
}

/**
 * 页大小改变
 */
const handleSizeChange = (size: number) => {
  queryParams.page_size = size
  queryParams.page = 1
  loadTenantList()
}

/**
 * 获取租户类型文本
 */
const getTenantTypeText = (type: string) => {
  const map: Record<string, string> = {
    ENTERPRISE: '企业',
    INDIVIDUAL: '个人',
  }
  return map[type] || type
}

/**
 * 获取状态标签类型
 */
const getStatusType = (status: number) => {
  return status === 1 ? 'success' : 'info'
}

/**
 * 获取状态文本
 */
const getStatusText = (status: number) => {
  return status === 1 ? '启用' : '禁用'
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
  loadTenantList()
})
</script>

<template>
  <div class="tenant-list-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>租户列表</h2>
        </div>
      </template>

      <!-- 租户表格 -->
      <el-table :data="tenantList" v-loading="loading" stripe>
        <el-table-column prop="tenant_id" label="租户ID" width="180" fixed />
        <el-table-column prop="tenant_code" label="租户代码" width="120" />
        <el-table-column prop="name" label="租户名称" width="200" />
        <el-table-column label="租户类型" width="120">
          <template #default="{ row }">
            {{ getTenantTypeText(row.tenant_type) }}
          </template>
        </el-table-column>
        <el-table-column prop="preferred_currency" label="偏好币种" width="120" />
        <el-table-column label="认证状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.verified ? 'success' : 'info'" size="small">
              {{ row.verified ? '已认证' : '未认证' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.updated_at) }}
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
.tenant-list-page {
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

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  // 移动端适配
  @media (max-width: 768px) {
    padding: 10px;
  }
}
</style>
