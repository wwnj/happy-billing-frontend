import request from '@/api/request'
import type { LoginRequest, LoginResponse, UserInfo } from '@/types/api/auth'

/**
 * 用户登录
 */
export const login = (data: LoginRequest) => {
  return request.post<LoginResponse>('/api/v1/auth/login', data)
}

/**
 * 用户登出
 */
export const logout = () => {
  return request.post<any>('/api/v1/auth/logout')
}

/**
 * 获取当前用户信息
 */
export const getUserInfo = () => {
  return request.get<UserInfo>('/api/v1/auth/user')
}

/**
 * 刷新Token
 */
export const refreshToken = () => {
  return request.post<LoginResponse>('/api/v1/auth/refresh')
}
