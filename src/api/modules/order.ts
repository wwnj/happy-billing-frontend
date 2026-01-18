import request from '@/api/request'
import type { PageResult } from '@/types/global'
import type {
  Order,
  CreateOrderRequest,
} from '@/types/api/order'

/**
 * 创建订单
 */
export const createOrder = (data: CreateOrderRequest) => {
  return request.post<Order>('/api/v1/orders', data)
}

/**
 * 获取订单列表
 */
export const getOrderList = (params: any) => {
  return request.get<PageResult<Order>>('/api/v1/orders', params)
}

/**
 * 获取订单详情
 */
export const getOrderDetail = (orderId: string) => {
  return request.get<Order>(`/api/v1/orders/${orderId}`)
}

/**
 * 取消订单
 */
export const cancelOrder = (orderId: string) => {
  return request.put(`/api/v1/orders/${orderId}/cancel`)
}

/**
 * 支付订单
 */
export const payOrder = (orderId: string) => {
  return request.post(`/api/v1/orders/${orderId}/pay`)
}
