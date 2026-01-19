import type { Currency } from './currency'

// SKU 状态
export type SkuStatus = 0 | 1 // 0: 禁用, 1: 启用

// 库存类型
export type StockType = 'AVAILABLE' | 'OUT_OF_STOCK' | 'PRE_ORDER'

// SKU 基本信息
export interface Sku {
  sku_id: string
  sku_code: string
  spu_id: number
  spu_code: string
  sku_name: string
  spec_values: Record<string, any>
  region: string
  stock_type: StockType
  status: SkuStatus
  created_at: string
  updated_at: string
}

// 价格规则类型
export type PriceRuleType = 'FIXED' | 'TIERED' | 'TIME_BASED' | 'PACKAGE'

// 价格规则
export interface PriceRule {
  rule_id: string
  rule_code: string
  rule_name: string
  sku_code?: string
  spu_code?: string
  rule_type: PriceRuleType
  pricing_detail: Record<string, any>
  currency: Currency
  effective_start: string
  effective_end?: string
  priority: number
  status: number
  created_at: string
  updated_at: string
}

// 带价格信息的 SKU
export interface SkuWithPrice extends Sku {
  unit_price?: number
  currency?: Currency
  price_rule?: PriceRule
}
