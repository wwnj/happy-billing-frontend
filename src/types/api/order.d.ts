import type { Currency } from './currency'

export type OrderType = 'PREPAID' | 'POSTPAID'
export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED'

export interface Order {
  order_id: string
  order_no: string
  tenant_id: string
  organization_id: string
  project_id: string
  user_id: string
  order_type: OrderType
  spu_code: string
  sku_code: string
  currency: Currency
  exchange_rate?: number
  base_currency: Currency
  base_currency_amount?: number
  original_amount: number
  discount_amount: number
  payable_amount: number
  paid_amount: number
  period_start?: string
  period_end?: string
  status: OrderStatus
  order_detail?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CreateOrderRequest {
  tenant_id: string
  organization_id: string
  project_id: string
  user_id: string
  order_type: OrderType
  sku_code: string
  quantity: number
  period_start?: string
  period_end?: string
  order_detail?: Record<string, any>
}
