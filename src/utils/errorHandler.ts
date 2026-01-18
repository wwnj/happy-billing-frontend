import { ElMessage, ElNotification } from 'element-plus'

/**
 * 全局错误处理工具类
 */
class ErrorHandler {
  /**
   * 处理 API 错误
   */
  static handleApiError(error: any, customMessage?: string) {
    console.error('[API Error]:', error)

    const message = customMessage || error?.message || '操作失败，请稍后重试'

    // 根据错误类型显示不同的提示
    if (error?.response) {
      const status = error.response.status

      switch (status) {
        case 401:
          ElNotification({
            title: '未授权',
            message: '登录已过期，请重新登录',
            type: 'error',
            duration: 3000,
          })
          // 清除 token 并跳转到登录页
          localStorage.removeItem('token')
          setTimeout(() => {
            window.location.href = '/login'
          }, 1000)
          break

        case 403:
          ElMessage.error('您没有权限执行此操作')
          break

        case 404:
          ElMessage.error('请求的资源不存在')
          break

        case 500:
          ElMessage.error('服务器错误，请稍后重试')
          break

        case 502:
        case 503:
          ElMessage.error('服务暂时不可用，请稍后重试')
          break

        default:
          ElMessage.error(message)
      }
    } else if (error?.request) {
      // 网络错误
      ElMessage.error('网络连接失败，请检查网络设置')
    } else {
      // 其他错误
      ElMessage.error(message)
    }
  }

  /**
   * 处理应用运行时错误
   */
  static handleRuntimeError(error: Error, info?: any) {
    console.error('[Runtime Error]:', error, info)

    ElNotification({
      title: '应用错误',
      message: '应用运行出错，请刷新页面重试',
      type: 'error',
      duration: 5000,
    })
  }

  /**
   * 处理Promise未捕获的错误
   */
  static handlePromiseRejection(event: PromiseRejectionEvent) {
    console.error('[Unhandled Promise Rejection]:', event.reason)

    ElNotification({
      title: '未处理的异步错误',
      message: '操作失败，请重试',
      type: 'error',
      duration: 3000,
    })
  }
}

/**
 * 安装全局错误处理
 */
export function setupErrorHandler() {
  // 处理 Vue 运行时错误
  window.addEventListener('error', (event) => {
    ErrorHandler.handleRuntimeError(event.error)
  })

  // 处理未捕获的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.handlePromiseRejection(event)
    event.preventDefault()
  })

  console.log('✅ 全局错误处理已启动')
}

export default ErrorHandler
