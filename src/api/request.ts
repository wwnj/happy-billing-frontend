import axios from 'axios'
import type { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PageResult<T = any> {
  total: number
  page: number
  page_size: number
  data: T[]
}

class Request {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        const tenantId = localStorage.getItem('tenantId')
        if (tenantId) {
          config.headers['X-Tenant-ID'] = tenantId
        }

        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { code, message, data } = response.data

        if (code === 0) {
          return Promise.resolve({ data, message } as any)
        }

        ElMessage.error(message || '请求失败')
        return Promise.reject(new Error(message))
      },
      (error: AxiosError<ApiResponse>) => {
        if (error.response) {
          const { status, data } = error.response

          switch (status) {
            case 401:
              ElMessage.error('未授权，请重新登录')
              localStorage.removeItem('token')
              window.location.href = '/login'
              break
            case 403:
              ElMessage.error('拒绝访问')
              break
            case 404:
              ElMessage.error('请求的资源不存在')
              break
            case 500:
              ElMessage.error('服务器错误')
              break
            default:
              ElMessage.error(data?.message || '请求失败')
          }
        } else {
          ElMessage.error('网络错误，请检查网络连接')
        }

        return Promise.reject(error)
      }
    )
  }

  get<T = any>(url: string, params?: any) {
    return this.instance.get<any, { data: T; message: string }>(url, { params })
  }

  post<T = any>(url: string, data?: any) {
    return this.instance.post<any, { data: T; message: string }>(url, data)
  }

  put<T = any>(url: string, data?: any) {
    return this.instance.put<any, { data: T; message: string }>(url, data)
  }

  delete<T = any>(url: string) {
    return this.instance.delete<any, { data: T; message: string }>(url)
  }
}

export default new Request()
