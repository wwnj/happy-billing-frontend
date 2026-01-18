export type Currency = 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP' | 'HKD'

export interface ExchangeRate {
  id: number
  from_currency: Currency
  to_currency: Currency
  rate: number
  effective_date: string
  source?: string
  created_at: string
}

export interface ExchangeRateQuery {
  from_currency: Currency
  to_currency: Currency
  date?: string
}

export interface CurrencyConvertRequest {
  amount: number
  from_currency: Currency
  to_currency: Currency
  date?: string
}

export interface CurrencyConvertResponse {
  from_currency: Currency
  to_currency: Currency
  amount: number
  converted_amount: number
  exchange_rate: number
  effective_date: string
}
