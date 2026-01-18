import type { Currency } from './currency'

export type PaymentMethod = 'BALANCE' | 'ALIPAY' | 'WECHAT' | 'BANK_TRANSFER'
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

export interface Payment {
  payment_id: string
  order_id?: string
  bill_id?: string
  tenant_id: string
  user_id: string
  payment_method: PaymentMethod
  payment_channel?: string
  currency: Currency
  exchange_rate?: number
  base_currency: Currency
  base_currency_amount?: number
  amount: number
  status: PaymentStatus
  external_order_id?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

export interface AccountBalance {
  tenant_id: string
  balance: number
  frozen_balance: number
  credit_limit: number
  currency: Currency
  created_at: string
  updated_at: string
}

export type TransactionType = 'RECHARGE' | 'PAYMENT' | 'DEDUCT' | 'REFUND' | 'FREEZE' | 'UNFREEZE'

export interface BalanceTransaction {
  transaction_id: string
  tenant_id: string
  transaction_type: TransactionType
  amount: number
  balance_before: number
  balance_after: number
  related_order_id?: string
  related_bill_id?: string
  related_payment_id?: string
  remark?: string
  created_at: string
}

// 余额记录别名（用于余额变动记录）
export interface BalanceRecord {
  record_id: string
  tenant_id: string
  type: TransactionType
  amount: number
  balance_before: number
  balance_after: number
  related_order_id?: string
  description?: string
  created_at: string
}

export interface CreatePaymentRequest {
  order_id?: string
  bill_id?: string
  tenant_id: string
  user_id: string
  payment_method: PaymentMethod
  payment_channel?: string
  amount: number
  currency: Currency
}
