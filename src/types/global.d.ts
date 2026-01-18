/**
 * API 统一响应结构
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 分页结果
 */
export interface PageResult<T = any> {
  total: number
  page: number
  page_size: number
  data: T[]
}

/**
 * 分页查询参数
 */
export interface PageQuery {
  page: number
  page_size: number
}

/**
 * 通用状态
 */
export type Status = 0 | 1  // 0: 禁用, 1: 启用
