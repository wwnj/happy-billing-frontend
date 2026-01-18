/**
 * 登录请求参数
 */
export interface LoginRequest {
  username: string
  password: string
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  token: string
  user_id: string
  tenant_id: string
  username: string
  real_name?: string
  email?: string
  phone?: string
  expires_at: string
}

/**
 * 用户信息
 */
export interface UserInfo {
  user_id: string
  tenant_id: string
  username: string
  real_name?: string
  email?: string
  phone?: string
  is_primary: boolean
  status: number
}
