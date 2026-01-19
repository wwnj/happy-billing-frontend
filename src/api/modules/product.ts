import request from '@/api/request'
import type { PageResult } from '@/types/global'
import type { Sku, PriceRule, SkuWithPrice } from '@/types/api/product'

/**
 * 获取 SKU 列表
 */
export const getSkuList = (params: any) => {
  return request.get<PageResult<Sku>>('/api/v1/products/sku', params)
}

/**
 * 获取 SKU 详情
 */
export const getSkuDetail = (skuId: string) => {
  return request.get<Sku>(`/api/v1/products/sku/${skuId}`)
}

/**
 * 获取价格规则列表
 */
export const getPriceRuleList = (params: any) => {
  return request.get<PageResult<PriceRule>>('/api/v1/price-rules', params)
}

/**
 * 获取价格规则详情
 */
export const getPriceRuleDetail = (ruleId: string) => {
  return request.get<PriceRule>(`/api/v1/price-rules/${ruleId}`)
}

/**
 * 获取带价格信息的 SKU 列表
 * 这是一个辅助函数，组合 SKU 和价格规则数据
 */
export const getSkuListWithPrice = async (): Promise<SkuWithPrice[]> => {
  // 获取 SKU 列表
  const skuResponse = await getSkuList({ page: 1, page_size: 100 })
  const skus = skuResponse.data.data || []

  // 获取价格规则列表
  const priceResponse = await getPriceRuleList({ page: 1, page_size: 100 })
  const priceRules = priceResponse.data.data || []

  // 组合数据
  return skus.map(sku => {
    // 查找对应的价格规则（按 sku_code 或 spu_code 匹配）
    const priceRule = priceRules.find(
      rule => rule.sku_code === sku.sku_code || rule.spu_code === sku.spu_code
    )

    // 提取单价（仅处理 FIXED 类型）
    let unitPrice: number | undefined
    let currency = priceRule?.currency

    if (priceRule && priceRule.rule_type === 'FIXED') {
      unitPrice = priceRule.pricing_detail?.unit_price
    }

    return {
      ...sku,
      unit_price: unitPrice,
      currency: currency,
      price_rule: priceRule,
    }
  })
}
