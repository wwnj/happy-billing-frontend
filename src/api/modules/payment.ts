import request from '@/api/request'
import type { PageResult } from '@/types/global'
import type {
  Payment,
  AccountBalance,
  BalanceTransaction,
  CreatePaymentRequest,
} from '@/types/api/payment'

/**
 * 创建支付
 */
export const createPayment = (data: CreatePaymentRequest) => {
  return request.post<Payment>('/api/v1/payments', data)
}

/**
 * 获取支付详情
 */
export const getPaymentDetail = (paymentId: string) => {
  return request.get<Payment>(`/api/v1/payments/${paymentId}`)
}

/**
 * 获取支付列表
 */
export const getPaymentList = (params: any) => {
  return request.get<PageResult<Payment>>('/api/v1/payments', params)
}

/**
 * 获取账户余额
 */
export const getBalance = (tenantId: string) => {
  return request.get<AccountBalance>(`/api/v1/tenants/${tenantId}/balance`)
}

/**
 * 充值
 */
export const recharge = (tenantId: string, data: { amount: number }) => {
  return request.post(`/api/v1/tenants/${tenantId}/balance/recharge`, data)
}

/**
 * 充值余额（别名）
 */
export const rechargeBalance = recharge

/**
 * 获取余额变动记录
 */
export const getBalanceTransactions = (tenantId: string, params: any) => {
  return request.get<PageResult<BalanceTransaction>>(
    `/api/v1/tenants/${tenantId}/balance/transactions`,
    params
  )
}

/**
 * 获取余额历史记录（别名）
 */
export const getBalanceHistory = getBalanceTransactions
