<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, CreditCard, Check, Message, Phone, Share } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { login } from '@/api/modules/auth'

const router = useRouter()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false,
})

// 登录状态
const loading = ref(false)

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 50, message: '用户名长度在 3 到 50 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 50, message: '密码长度在 6 到 50 个字符', trigger: 'blur' },
  ],
}

/**
 * 处理登录
 */
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    // 验证表单
    await loginFormRef.value.validate()

    loading.value = true

    // 调用登录API
    const { data } = await login({
      username: loginForm.username,
      password: loginForm.password,
    })

    // 存储token和用户信息
    localStorage.setItem('token', data.token)
    localStorage.setItem('user_id', data.user_id)
    localStorage.setItem('tenant_id', data.tenant_id)
    localStorage.setItem('username', data.username)

    // 记住密码
    if (loginForm.remember) {
      localStorage.setItem('remembered_username', loginForm.username)
    } else {
      localStorage.removeItem('remembered_username')
    }

    ElMessage.success('登录成功')

    // 跳转到首页
    router.push('/dashboard')
  } catch (error: any) {
    console.error('登录失败:', error)
    if (error !== 'cancel') {
      ElMessage.error('登录失败，请检查用户名和密码')
    }
  } finally {
    loading.value = false
  }
}

/**
 * 回车登录
 */
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleLogin()
  }
}

// 初始化 - 读取记住的用户名
const rememberedUsername = localStorage.getItem('remembered_username')
if (rememberedUsername) {
  loginForm.username = rememberedUsername
  loginForm.remember = true
}
</script>

<template>
  <div class="login-page">
    <!-- 左侧品牌区域 -->
    <div class="brand-section">
      <div class="brand-content">
        <div class="brand-logo">
          <el-icon :size="80">
            <CreditCard />
          </el-icon>
        </div>
        <h1 class="brand-title">Happy Billing</h1>
        <p class="brand-subtitle">智能计费系统</p>
        <div class="brand-features">
          <div class="feature-item">
            <el-icon :size="24"><Check /></el-icon>
            <span>多币种支持</span>
          </div>
          <div class="feature-item">
            <el-icon :size="24"><Check /></el-icon>
            <span>实时汇率转换</span>
          </div>
          <div class="feature-item">
            <el-icon :size="24"><Check /></el-icon>
            <span>灵活计费规则</span>
          </div>
          <div class="feature-item">
            <el-icon :size="24"><Check /></el-icon>
            <span>数据安全保障</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="form-section">
      <div class="form-container">
        <div class="form-header">
          <h2>欢迎回来</h2>
          <p>登录您的账户以继续使用</p>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          size="large"
          @keypress.enter="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              clearable
              @keypress="handleKeyPress"
            />
          </el-form-item>

          <el-form-item>
            <div class="form-options">
              <el-checkbox v-model="loginForm.remember">
                记住我
              </el-checkbox>
              <el-link type="primary" :underline="false">
                忘记密码？
              </el-link>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              style="width: 100%"
              :loading="loading"
              @click="handleLogin"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>

        <div class="form-footer">
          <el-divider>其他登录方式</el-divider>
          <div class="social-login">
            <el-button circle :icon="Message" disabled />
            <el-button circle :icon="Phone" disabled />
            <el-button circle :icon="Share" disabled />
          </div>
          <p class="register-text">
            还没有账户？
            <el-link type="primary" :underline="false" @click="router.push('/register')">
              立即注册
            </el-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  height: 100vh;
  overflow: hidden;

  // 左侧品牌区域
  .brand-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px;
    position: relative;
    overflow: hidden;

    // 背景装饰
    &::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 500px;
      height: 500px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -30%;
      left: -10%;
      width: 400px;
      height: 400px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
    }

    .brand-content {
      max-width: 500px;
      z-index: 1;
      text-align: center;

      .brand-logo {
        margin-bottom: 24px;
        animation: float 3s ease-in-out infinite;

        .el-icon {
          color: white;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }
      }

      .brand-title {
        font-size: 48px;
        font-weight: 700;
        margin: 0 0 16px 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .brand-subtitle {
        font-size: 20px;
        margin: 0 0 48px 0;
        opacity: 0.9;
      }

      .brand-features {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-top: 48px;

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          backdrop-filter: blur(10px);

          .el-icon {
            flex-shrink: 0;
          }
        }
      }
    }
  }

  // 右侧表单区域
  .form-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    padding: 40px;

    .form-container {
      width: 100%;
      max-width: 400px;

      .form-header {
        text-align: center;
        margin-bottom: 40px;

        h2 {
          font-size: 32px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 12px 0;
        }

        p {
          font-size: 14px;
          color: #909399;
          margin: 0;
        }
      }

      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .form-footer {
        margin-top: 32px;
        text-align: center;

        .social-login {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin: 20px 0;
        }

        .register-text {
          margin-top: 20px;
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }

  // 移动端适配
  @media (max-width: 768px) {
    flex-direction: column;

    .brand-section {
      flex: 0 0 200px;
      padding: 20px;

      .brand-content {
        .brand-logo {
          .el-icon {
            font-size: 48px;
          }
        }

        .brand-title {
          font-size: 28px;
        }

        .brand-subtitle {
          font-size: 14px;
          margin-bottom: 24px;
        }

        .brand-features {
          display: none;
        }
      }

      &::before,
      &::after {
        display: none;
      }
    }

    .form-section {
      flex: 1;
      padding: 20px;

      .form-container {
        .form-header {
          margin-bottom: 24px;

          h2 {
            font-size: 24px;
          }
        }
      }
    }
  }
}

// 浮动动画
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
