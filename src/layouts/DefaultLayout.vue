<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})
</script>

<template>
  <div class="default-layout">
    <el-container>
      <el-header class="header">
        <router-link to="/dashboard" class="logo">Happy Billing</router-link>
        <el-menu mode="horizontal" :router="true" :default-active="activeMenu" class="nav-menu">
          <el-menu-item index="/dashboard">仪表盘</el-menu-item>
          <el-menu-item index="/tenant/list">租户管理</el-menu-item>
          <el-menu-item index="/order/list">订单管理</el-menu-item>
          <el-menu-item index="/payment/balance">支付管理</el-menu-item>
          <el-menu-item index="/currency/exchange-rates">货币管理</el-menu-item>
        </el-menu>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.default-layout {
  height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  margin-right: 40px;
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
}

.nav-menu {
  flex: 1;
  border: none;
}

.main {
  background-color: #f5f7fa;
  padding: 20px;
}
</style>
