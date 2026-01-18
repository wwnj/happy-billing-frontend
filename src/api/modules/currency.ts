import request from '@/api/request'
import type { PageResult } from '@/types/global'
import type {
  ExchangeRate,
  ExchangeRateQuery,
  CurrencyConvertRequest,
  CurrencyConvertResponse,
} from '@/types/api/currency'

/**
 * 查询特定汇率
 */
export const queryExchangeRate = (params: ExchangeRateQuery) => {
  return request.get<ExchangeRate>('/api/v1/exchange-rates/query', params)
}

/**
 * 获取汇率列表
 */
export const getExchangeRates = (params: any) => {
  return request.get<PageResult<ExchangeRate>>('/api/v1/exchange-rates', params)
}

/**
 * 货币转换
 */
export const convertCurrency = (data: CurrencyConvertRequest) => {
  return request.post<CurrencyConvertResponse>('/api/v1/currency/convert', data)
}
