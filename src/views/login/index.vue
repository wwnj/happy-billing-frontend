<script setup lang="ts">
</script>

<template>
  <div class="login-page">
    <el-card class="login-card">
      <h2>Happy Billing 登录</h2>
      <el-form>
        <el-form-item>
          <el-input placeholder="用户名" />
        </el-form-item>
        <el-form-item>
          <el-input type="password" placeholder="密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 20px;

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
